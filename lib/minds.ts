import fs from "node:fs";
import path from "node:path";

export type MindSection = {
  /** The heading exactly as written in the file, minus the leading "# ". */
  heading: string;
  /** A stable slug for anchors. */
  slug: string;
  /** Raw markdown body underneath the heading. */
  body: string;
};

export type Mind = {
  id: string;
  name: string;
  years: string;
  category: string;
  sources: string[];
  /** The whole file, frontmatter included — this is what the copy button copies. */
  raw: string;
  /** Everything after the frontmatter. */
  markdown: string;
  sections: MindSection[];
  /** Pulled out of "# First message" so it can go on the wall. */
  firstMessage: string;
  /** Pulled out of "# Who is speaking" for the card blurb. */
  whoIsSpeaking: string;
  /** minds/<id>.md */
  filePath: string;
};

const MINDS_DIR = path.join(process.cwd(), "minds");

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Deliberately small frontmatter reader. The files are ours and in-repo, so this
 * handles exactly the five keys the spec defines and nothing else — no YAML
 * dependency, no surprises at build time.
 */
function parseFrontmatter(source: string, file: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    throw new Error(`${file}: missing frontmatter block`);
  }
  const scalars: Record<string, string> = {};
  const sources: string[] = [];
  let inSources = false;

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const listItem = /^\s*-\s+(.*)$/.exec(line);
    if (listItem && inSources) {
      sources.push(stripQuotes(listItem[1].trim()));
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key === "sources") {
      inSources = true;
      if (value) sources.push(stripQuotes(value));
      continue;
    }
    inSources = false;
    scalars[key] = stripQuotes(value);
  }

  return { scalars, sources, body: source.slice(match[0].length) };
}

function stripQuotes(value: string) {
  return value.replace(/^["'](.*)["']$/, "$1");
}

function parseSections(markdown: string): MindSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MindSection[] = [];
  let current: MindSection | null = null;
  const buffer: string[] = [];

  const flush = () => {
    if (!current) return;
    current.body = buffer.join("\n").trim();
    sections.push(current);
    buffer.length = 0;
  };

  for (const line of lines) {
    const heading = /^#\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      const text = heading[1].trim();
      current = { heading: text, slug: slugify(text), body: "" };
      continue;
    }
    if (current) buffer.push(line);
  }
  flush();
  return sections;
}

function sectionStartingWith(sections: MindSection[], prefix: string) {
  const wanted = prefix.toLowerCase();
  return sections.find((section) => section.heading.toLowerCase().startsWith(wanted));
}

function readMind(file: string): Mind {
  const filePath = path.join(MINDS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { scalars, sources, body } = parseFrontmatter(raw, file);

  for (const key of ["id", "name", "years", "category"]) {
    if (!scalars[key]) throw new Error(`${file}: frontmatter is missing "${key}"`);
  }

  const sections = parseSections(body);
  const first = sectionStartingWith(sections, "first message");
  const who = sectionStartingWith(sections, "who is speaking");

  return {
    id: scalars.id,
    name: scalars.name,
    years: scalars.years,
    category: scalars.category,
    sources,
    raw,
    markdown: body.trim(),
    sections,
    firstMessage: first ? stripBlockquote(first.body) : "",
    whoIsSpeaking: who ? who.body : "",
    filePath: `minds/${file}`,
  };
}

function stripBlockquote(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.replace(/^>\s?/, ""))
    .join("\n")
    .trim();
}

let cache: Mind[] | null = null;

export function getMinds(): Mind[] {
  if (cache) return cache;
  if (!fs.existsSync(MINDS_DIR)) {
    throw new Error("minds/ directory not found — the site is built from those files");
  }
  const files = fs
    .readdirSync(MINDS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();
  if (files.length === 0) {
    throw new Error("minds/ is empty — refusing to build a directory with nothing in it");
  }
  const minds = files.map(readMind);
  const order = new Map(ROSTER.map((id, index) => [id, index]));
  minds.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  cache = minds;
  return minds;
}

export function getMind(id: string): Mind | undefined {
  return getMinds().find((mind) => mind.id === id);
}

/** Publication order on the shelf. Anything not listed sorts to the end. */
export const ROSTER = [
  "feynman",
  "faraday",
  "lovelace",
  "turing",
  "ramanujan",
  "curie",
  "darwin",
  "shannon",
  "montaigne",
  "marcus-aurelius",
  "orwell",
  "twain",
  "wittgenstein",
  "arendt",
  "franklin",
  "machiavelli",
  "ali",
  "senna",
  "leonardo",
  "musashi",
];

/** Repo-root documents the site renders. Literal paths keep the build trace tight. */
const ROOT_DOCS = {
  "SPEC.md": () => fs.readFileSync(path.join(process.cwd(), "SPEC.md"), "utf8"),
} as const;

export function readRepoFile(relativePath: keyof typeof ROOT_DOCS): string {
  return ROOT_DOCS[relativePath]();
}
