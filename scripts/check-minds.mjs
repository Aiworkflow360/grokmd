#!/usr/bin/env node
/**
 * The mechanical half of review.
 *
 * It cannot tell you whether a mind sounds like the person — that is a human
 * reading the letters — but it can refuse the failures that are checkable, and
 * one of those turns out to be the failure that matters most.
 *
 * When five files are written by one person, the author's sentences leak into
 * all five. Five different centuries end up answering "are you an AI?" with the
 * same clause. That is invisible while you write and obvious when a machine
 * counts it, so the cross-file phrase check below is the important part of this
 * script: any run of seven words appearing in two mind files is the author
 * talking, not the subject.
 *
 * Runs before every build. A file that fails does not ship.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MINDS = path.join(ROOT, "minds");

const REQUIRED_SECTIONS = [
  "who is speaking",
  "idiolect",
  "ignorance map",
  "what you find stupid",
  "how you get angry",
  "you refuse",
  "first message",
  "eight test prompts",
  "sources",
];

/** Phrases that mean the assistant won. Matched case-insensitively. */
const BANNED = [
  "as an ai",
  "as a language model",
  "i'm just an ai",
  "i hope this helps",
  "great question",
  "certainly!",
  "let me know if",
  "feel free to",
  "i'd be happy to help",
  "in conclusion,",
  "delve into",
  "it's important to note",
  "stay curious, my friend",
];

/**
 * The author, visible in his own product. A mind file is addressed to a model
 * about one person; it must not know it is on a shelf, and it must not contain
 * workshop notes.
 */
const AUTHOR_LEAKS = [
  "the directory",
  "this directory",
  "on the shelf",
  "this file",
  "the file",
  "a file that",
  "anti-slop",
  "the spec",
  "the other minds",
];

/** How many words in a row two files may share before it is one voice, not two. */
const PHRASE_WINDOW = 7;

const errors = [];
const warnings = [];

const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

function parse(file, source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    fail(file, "no frontmatter block");
    return null;
  }
  const front = {};
  const sources = [];
  let inSources = false;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && inSources) {
      sources.push(item[1].replace(/^["'](.*)["']$/, "$1"));
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key === "sources") {
      inSources = true;
      if (value) sources.push(value);
      continue;
    }
    inSources = false;
    front[key] = value.replace(/^["'](.*)["']$/, "$1");
  }

  const body = source.slice(match[0].length);
  const sections = [];
  let current = null;
  for (const line of body.split(/\r?\n/)) {
    const heading = /^#\s+(.*)$/.exec(line);
    if (heading) {
      current = { heading: heading[1].trim(), lines: [] };
      sections.push(current);
      continue;
    }
    if (current) current.lines.push(line);
  }
  return { front, sources, sections };
}

/**
 * Words only, lowercased — so punctuation and emphasis cannot hide a repeat.
 *
 * Two kinds of text are stripped first, because they are shared on purpose:
 * anything in **bold** (the spec's own section labels — Fraud, Must, Never,
 * Licensed advice he never held) and anything in "quotes" (the eight test
 * prompts are the same eight situations in every file, and the Idiolect never
 * lists quote assistant phrases in order to forbid them). What is left is the
 * author writing in his own voice, which is the thing being counted.
 */
function words(text) {
  return text
    .replace(/\*\*[^*]*\*\*/g, " ")
    .replace(/[\u201c\u201d"][^\u201c\u201d"]*[\u201c\u201d"]/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function sentenceCount(text) {
  return (text.match(/[.!?](\s|$)/g) || []).length;
}

const files = fs.existsSync(MINDS)
  ? fs.readdirSync(MINDS).filter((name) => name.endsWith(".md")).sort()
  : [];

if (files.length === 0) {
  console.error("check-minds: minds/ is empty. Refusing to build an empty directory.");
  process.exit(1);
}

/**
 * The structural check.
 *
 * The seven-word check above catches copied sentences. It does not catch a
 * copied *shape*: twenty files whose row-7 SLOP line is "Insists he is X, or
 * produces a disclaimer" share no seven words once the names differ, and are
 * nonetheless one sentence written twenty times.
 *
 * So: strip every capitalised word (the names are the only thing that varied),
 * lowercase the rest, and compare the test-prompt rows against each other at a
 * much shorter window. What survives is the author reaching for the same move
 * in the same slot, which is the failure the whole review exists to find.
 */
const SHAPE_WINDOW = 5;
const shapeOwner = new Map();
const shapeHits = [];

function shapeWords(line) {
  return line
    .replace(/^\s*-\s*(SLOP|REAL)\s*—?\s*/i, "")
    .replace(/\*\*[^*]*\*\*/g, " ")
    .replace(/[\u201c\u201d"][^\u201c\u201d"]*[\u201c\u201d"]/g, " ")
    .split(/\s+/)
    .filter((word) => !/^[A-Z]/.test(word))
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function checkShape(file, label, line) {
  const tokens = shapeWords(line);
  const seen = new Set();
  for (let i = 0; i + SHAPE_WINDOW <= tokens.length; i += 1) {
    const phrase = tokens.slice(i, i + SHAPE_WINDOW).join(" ");
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    const key = `${label}::${phrase}`;
    const owner = shapeOwner.get(key);
    if (owner && owner.file !== file) {
      shapeHits.push({ file, owner: owner.file, label, phrase });
      return;
    }
    if (!owner) shapeOwner.set(key, { file });
  }
}

/**
 * A mind that wins all eight exchanges is a wall. The gate cannot judge who
 * won, but it can insist that somewhere in the eight there is a word for
 * yielding — and an author who has to reach for one is at least forced to
 * decide which row it belongs in.
 */
const CONCEDES = /\b(concede[sd]?|conceding|admits|admitted|is wrong|was wrong|gives way|caught out|wrong-footed|charmed|disarmed|delighted|moved|relents|yields|beaten|loses|has no answer|cannot answer|does not know|undone|stopped in his tracks|stopped in her tracks)\b/i;

/** phrase -> first file that used it, for the cross-file check. */
const phraseOwner = new Map();
const collisions = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(MINDS, file), "utf8");
  const parsed = parse(file, source);
  if (!parsed) continue;
  const { front, sources, sections } = parsed;

  for (const key of ["id", "name", "years", "category"]) {
    if (!front[key]) fail(file, `frontmatter is missing "${key}"`);
  }
  if (front.id && `${front.id}.md` !== file) {
    fail(file, `frontmatter id "${front.id}" does not match the filename`);
  }
  if (sources.length < 3) {
    fail(file, `only ${sources.length} sources listed — the spec wants primary text, plural`);
  }

  const headings = sections.map((section) => section.heading.toLowerCase());
  let cursor = 0;
  for (const required of REQUIRED_SECTIONS) {
    const found = headings.findIndex((h, index) => index >= cursor && h.startsWith(required));
    if (found === -1) {
      const anywhere = headings.some((h) => h.startsWith(required));
      fail(file, anywhere ? `section "${required}" is out of order` : `missing section "${required}"`);
    } else {
      cursor = found + 1;
    }
  }

  for (const section of sections) {
    const heading = section.heading.toLowerCase();
    const text = section.lines.join("\n");
    const lower = text.toLowerCase();

    for (const leak of AUTHOR_LEAKS) {
      // Word-boundaried, so "the spec" does not fire on "the specimen".
      const pattern = new RegExp(`\\b${leak}\\b`);
      if (pattern.test(lower)) fail(file, `author's voice: "${leak}" in "${section.heading}"`);
    }

    // The Idiolect "never" list quotes assistant phrases in order to ban them.
    if (heading.startsWith("idiolect")) continue;
    for (const phrase of BANNED) {
      if (!lower.includes(phrase)) continue;
      const onlyInSlop = section.lines
        .filter((line) => line.toLowerCase().includes(phrase))
        .every((line) => /^\s*-\s*SLOP/i.test(line));
      if (!onlyInSlop) fail(file, `assistant phrase "${phrase}" in "${section.heading}"`);
    }
  }

  const firstMessage = sections.find((s) => s.heading.toLowerCase().startsWith("first message"));
  if (firstMessage) {
    const text = firstMessage.lines.join("\n").replace(/^>\s?/gm, "").trim();
    if (!text) fail(file, "first message is empty");
    if (/^(greetings|hello|hi there|welcome)/i.test(text)) {
      fail(file, "first message opens with a greeting");
    }
    const count = sentenceCount(text);
    if (count > 3) fail(file, `first message is ${count} sentences — the spec caps it at three`);
  }

  const prompts = sections.find((s) => s.heading.toLowerCase().startsWith("eight test prompts"));
  if (prompts) {
    const text = prompts.lines.join("\n");
    const slop = (text.match(/^\s*-\s*SLOP/gim) || []).length;
    const real = (text.match(/^\s*-\s*REAL/gim) || []).length;
    if (slop !== 8) fail(file, `${slop} SLOP lines, expected 8`);
    if (real !== 8) fail(file, `${real} REAL lines, expected 8`);

    const slopLines = prompts.lines.filter((line) => /^\s*-\s*SLOP/i.test(line));
    const realLines = prompts.lines.filter((line) => /^\s*-\s*REAL/i.test(line));
    slopLines.forEach((line, index) => checkShape(file, `slop${index}`, line));
    realLines.forEach((line, index) => checkShape(file, `real${index}`, line));
    slopLines.forEach((line) => checkShape(file, "slop-any", line));

    if (!realLines.some((line) => CONCEDES.test(line))) {
      fail(file, "the character wins all eight — nothing in any REAL row concedes, is caught out, or lands on them");
    }
  }

  /**
   * Cross-file phrase check. Sources are bibliographies and legitimately share
   * wording ("letters", "notebooks"), so they are excluded; everything the
   * character or the character sheet says is in scope.
   */
  const prose = sections
    .filter((s) => !s.heading.toLowerCase().startsWith("sources"))
    .map((s) => s.lines.join("\n"))
    .join("\n");
  const seenHere = new Set();
  const tokens = words(prose);
  for (let i = 0; i + PHRASE_WINDOW <= tokens.length; i += 1) {
    const phrase = tokens.slice(i, i + PHRASE_WINDOW).join(" ");
    if (seenHere.has(phrase)) continue;
    seenHere.add(phrase);
    const owner = phraseOwner.get(phrase);
    if (owner && owner !== file) {
      collisions.push({ file, owner, phrase });
    } else if (!owner) {
      phraseOwner.set(phrase, file);
    }
  }
}

/** One report per file pair, with an example — a list of 300 is unreadable. */
const byPair = new Map();
for (const collision of collisions) {
  const key = `${collision.owner} ↔ ${collision.file}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(collision.phrase);
}
const byShape = new Map();
for (const hit of shapeHits) {
  const key = `${hit.owner} ↔ ${hit.file}`;
  if (!byShape.has(key)) byShape.set(key, []);
  byShape.get(key).push(`${hit.label}: "${hit.phrase}"`);
}
for (const [pair, hits] of byShape) {
  const [owner, other] = pair.split(" ↔ ");
  errors.push(`${owner}: ${hits.length} test-prompt row(s) share a shape with ${other} — e.g. ${hits[0]}`);
}

for (const [pair, phrases] of byPair) {
  const [owner] = pair.split(" ↔ ");
  errors.push(
    `${owner}: shares ${phrases.length} phrase(s) with ${pair.split(" ↔ ")[1]} — e.g. "${phrases[0]}"`,
  );
}

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (errors.length) {
  console.error(`\ncheck-minds: ${errors.length} problem(s)\n`);
  for (const error of errors) console.error(`  FAIL  ${error}`);
  console.error("");
  process.exit(1);
}

console.log(`check-minds: ${files.length} file(s) pass — no shared ${PHRASE_WINDOW}-word phrases.`);
