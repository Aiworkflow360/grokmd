import type { Metadata } from "next";
import { renderMarkdown } from "@/lib/markdown";
import { readRepoFile } from "@/lib/minds";
import { blobUrl, rawUrl } from "@/config/site";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "The spec",
  description:
    "How a GROK.md is built: idiolect, ignorance map, refusals, first message, and eight prompts that show the slop answer beside the real one.",
};

export default function SpecPage() {
  const source = readRepoFile("SPEC.md");
  // The page supplies its own title, and SPEC.md's own headings start at "##".
  // Promoting them by one keeps /spec and /m/[id] on the same visual hierarchy.
  const withoutTitle = source
    .replace(/^#\s+.*$/m, "")
    .replace(/^(#{2,})\s/gm, (_match, hashes: string) => `${hashes.slice(1)} `)
    .trim();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8">
      <header className="border-b border-rule-soft py-12">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-brass">SPEC.md</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-paper sm:text-5xl">
          How to build one that isn&rsquo;t a costume
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-paper-dim">
          The format is nine headings of plain markdown. The hard part is none of them — it is
          reading enough of the person that you stop guessing.
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <CopyButton text={source} label="Copy SPEC.md" doneLabel="On your clipboard" />
          <a
            href={rawUrl("SPEC.md")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-rule bg-ink-800/70 px-4 py-2.5 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-700 hover:text-paper"
          >
            Raw file
          </a>
          <a
            href={blobUrl("SPEC.md")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md px-3 py-2.5 text-sm text-paper-faint underline decoration-rule underline-offset-4 transition-colors hover:text-paper"
          >
            GitHub
          </a>
        </div>
      </header>

      <div
        className="prose mt-12"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(withoutTitle) }}
      />
    </div>
  );
}
