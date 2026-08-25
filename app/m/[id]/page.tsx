import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { SupportStrip } from "@/components/support-strip";
import { grokBotPayload } from "@/lib/grok-bot";
import { renderMarkdown } from "@/lib/markdown";
import { getMind, getMinds } from "@/lib/minds";
import { blobUrl, followUrl, rawUrl, site, tweetUrl } from "@/config/site";

export function generateStaticParams() {
  return getMinds().map((mind) => ({ id: mind.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const mind = getMind(id);
  if (!mind) return { title: "Not on the shelf" };

  const description = mind.firstMessage.split("\n")[0]?.slice(0, 180) ?? site.description;
  return {
    title: `${mind.name} — GROK.md`,
    description,
    openGraph: {
      title: `${mind.name} — GROK.md`,
      description,
      url: `${site.url}/m/${mind.id}`,
    },
  };
}

/** Sections that get their own treatment above the fold. */
const HOISTED = ["first message", "who is speaking"];

export default async function MindPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mind = getMind(id);
  if (!mind) notFound();

  const body = mind.sections
    .filter((section) => !HOISTED.some((prefix) => section.heading.toLowerCase().startsWith(prefix)))
    .map((section) => `## ${section.heading}\n\n${section.body}`)
    .join("\n\n");

  const shareText = `${mind.name} as a GROK.md. Not a costume — the real temperature.`;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8">
      <nav className="pt-6 text-sm">
        <Link href="/" className="text-paper-faint transition-colors hover:text-paper">
          ← The shelf
        </Link>
      </nav>

      <header className="border-b border-rule-soft pb-10 pt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-faint">
          <span className="text-brass">{mind.category}</span>
          <span aria-hidden="true">·</span>
          <span>{mind.years}</span>
          <span aria-hidden="true">·</span>
          <span>{mind.filePath}</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-paper sm:text-5xl">
          {mind.name}
        </h1>
      </header>

      <section className="py-10">
        <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-faint">
          They speak first
        </h2>
        <blockquote className="first-message mt-4 border-y border-rule bg-ink-850/50 px-5 py-6 sm:px-7 sm:py-8">
          <div
            className="font-serif text-xl leading-[1.55] text-paper sm:text-[1.4rem]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(mind.firstMessage) }}
          />
        </blockquote>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2.5">
          <CopyButton text={mind.raw} label="Copy GROK.md" doneLabel="On your clipboard" />
          <CopyButton
            text={grokBotPayload(mind)}
            label="Copy for Grok Bot"
            doneLabel="Paste it into the chat"
            variant="secondary"
          />
          <a
            href={rawUrl(mind.filePath)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-rule bg-ink-800/70 px-4 py-2.5 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-700 hover:text-paper"
          >
            Raw file
          </a>
          <a
            href={blobUrl(mind.filePath)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md px-3 py-2.5 text-sm text-paper-faint underline decoration-rule underline-offset-4 transition-colors hover:text-paper"
          >
            GitHub
          </a>
        </div>
        <SupportStrip
          followHref={followUrl()}
          tweetHref={tweetUrl(shareText, `${site.url}/m/${mind.id}`)}
          prompt={`If ${mind.name.split(" ").slice(-1)[0]} sounds like ${mind.name.split(" ").slice(-1)[0]}, that is the only review that matters.`}
        />
      </section>

      {mind.whoIsSpeaking ? (
        <section className="mt-12 rounded-lg border border-rule-soft bg-ink-850/50 p-6">
          <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-faint">
            Who is speaking
          </h2>
          <div
            className="prose mt-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(mind.whoIsSpeaking) }}
          />
        </section>
      ) : null}

      <section
        className="prose mt-14"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />

      <details className="mt-12 rounded-lg border border-rule-soft bg-ink-850/50">
        <summary className="cursor-pointer px-5 py-4 text-sm text-paper-dim marker:text-brass-deep">
          Show the raw file
        </summary>
        <pre className="max-h-[32rem] overflow-y-auto border-t border-rule-soft px-5 py-4 font-mono text-[0.78rem] leading-relaxed whitespace-pre-wrap break-words text-paper-dim">
          {mind.raw}
        </pre>
      </details>

      <nav className="mt-12 flex justify-between gap-4 border-t border-rule-soft pt-6 text-sm">
        <Link href="/" className="text-paper-faint transition-colors hover:text-paper">
          ← All minds
        </Link>
        <Link href="/spec" className="text-paper-faint transition-colors hover:text-paper">
          Write your own →
        </Link>
      </nav>
    </article>
  );
}
