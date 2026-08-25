#!/usr/bin/env node
/**
 * The mechanical half of review. It cannot tell you whether a mind sounds like
 * the person — that is a human reading the letters — but it can refuse the
 * failures that are checkable: a missing section, a section out of order, an
 * assistant phrase that survived editing, a first message that reads like
 * somebody else's, fewer than eight test prompts.
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
 * Banned only where the character is speaking. The Idiolect "never" lists quote
 * these phrases on purpose in order to forbid them, so those sections are
 * exempt and everything else is not.
 */
const SPEECH_SECTIONS = ["who is speaking", "first message"];

const errors = [];
const warnings = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

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

const files = fs.existsSync(MINDS)
  ? fs.readdirSync(MINDS).filter((name) => name.endsWith(".md")).sort()
  : [];

if (files.length === 0) {
  console.error("check-minds: minds/ is empty. Refusing to build an empty directory.");
  process.exit(1);
}

const firstMessages = new Map();

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
    const found = headings.findIndex((heading, index) => index >= cursor && heading.startsWith(required));
    if (found === -1) {
      const anywhere = headings.some((heading) => heading.startsWith(required));
      fail(file, anywhere ? `section "${required}" is out of order` : `missing section "${required}"`);
    } else {
      cursor = found + 1;
    }
  }

  for (const section of sections) {
    const heading = section.heading.toLowerCase();
    const isIdiolect = heading.startsWith("idiolect");
    if (isIdiolect) continue;
    const text = section.lines.join("\n").toLowerCase();
    for (const phrase of BANNED) {
      if (text.includes(phrase)) {
        // The test-prompt rows quote these deliberately, on the SLOP line.
        const onlyInSlop = section.lines
          .filter((line) => line.toLowerCase().includes(phrase))
          .every((line) => /^\s*-\s*SLOP/i.test(line));
        if (!onlyInSlop) fail(file, `assistant phrase "${phrase}" in section "${section.heading}"`);
      }
    }
  }

  const firstMessage = sections.find((section) => section.heading.toLowerCase().startsWith("first message"));
  if (firstMessage) {
    const text = firstMessage.lines.join("\n").replace(/^>\s?/gm, "").trim();
    if (!text) fail(file, "first message is empty");
    if (/^(greetings|hello|hi there|welcome)/i.test(text)) {
      fail(file, "first message opens with a greeting");
    }
    if (text.split(/\s+/).length > 130) {
      warn(file, "first message is long — the spec asks for one punch");
    }
    firstMessages.set(file, text);
  }

  const prompts = sections.find((section) => section.heading.toLowerCase().startsWith("eight test prompts"));
  if (prompts) {
    const text = prompts.lines.join("\n");
    const slop = (text.match(/^\s*-\s*SLOP/gim) || []).length;
    const real = (text.match(/^\s*-\s*REAL/gim) || []).length;
    if (slop !== 8) fail(file, `${slop} SLOP lines, expected 8`);
    if (real !== 8) fail(file, `${real} REAL lines, expected 8`);
  }
}

/**
 * The first-message test, mechanised as far as it goes: two openings that share
 * a long run of words are not two people. A human still has to apply the real
 * version of this test, which is covering the name and reading it aloud.
 */
const entries = [...firstMessages.entries()];
for (let i = 0; i < entries.length; i += 1) {
  for (let j = i + 1; j < entries.length; j += 1) {
    const a = entries[i][1].toLowerCase().split(/\s+/);
    const b = new Set();
    const bWords = entries[j][1].toLowerCase().split(/\s+/);
    for (let k = 0; k + 6 <= bWords.length; k += 1) b.add(bWords.slice(k, k + 6).join(" "));
    for (let k = 0; k + 6 <= a.length; k += 1) {
      if (b.has(a.slice(k, k + 6).join(" "))) {
        fail(entries[i][0], `first message shares a run of words with ${entries[j][0]}`);
        k = a.length;
      }
    }
  }
}

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (errors.length) {
  console.error(`\ncheck-minds: ${errors.length} problem(s)\n`);
  for (const error of errors) console.error(`  FAIL  ${error}`);
  console.error("");
  process.exit(1);
}

console.log(`check-minds: ${files.length} file(s) pass.`);
