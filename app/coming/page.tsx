import type { Metadata } from "next";
import Link from "next/link";
import { COMING, COMING_COUNT } from "@/config/coming";
import { SupportStrip } from "@/components/support-strip";
import { followUrl, repoUrl, site, tweetUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Coming",
  description: `${COMING_COUNT} more minds in the queue. Names only — nobody gets a file until the voice passes review.`,
};

export default function ComingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
      <header className="border-b border-rule-soft py-12">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-brass">The queue</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-paper sm:text-5xl">
          {COMING_COUNT} more. None of them written yet.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">
          This page is names and counts on purpose. Twenty that sound like the person beat two
          hundred that sound like each other, and a queue published as finished files would just be
          a slop pile with a nicer font.
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-paper-dim">
          A name leaves this list when someone has read enough primary text to catch it lying —
          letters, notebooks, transcripts, testimony — and the file survives review. Want one
          sooner? The spec is open;{" "}
          <a
            href={`${repoUrl}/issues/new`}
            target="_blank"
            rel="noreferrer"
            className="text-brass underline underline-offset-4"
          >
            open an issue
          </a>{" "}
          or send the pull request yourself.
        </p>
        <div className="mt-8">
          <SupportStrip
            followHref={followUrl()}
            tweetHref={tweetUrl(
              `${COMING_COUNT} more minds queued for Grok Bot. Twenty are already installable.`,
              `${site.url}/coming`,
            )}
            prompt="Tell us who is missing. Loudly is fine."
          />
        </div>
      </header>

      <div className="mt-12 flex flex-col gap-10">
        {COMING.map((shelf) => (
          <section key={shelf.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule-soft pb-3">
              <h2 className="font-serif text-xl text-paper">{shelf.title}</h2>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-paper-faint">
                {shelf.names.length} queued
              </p>
            </div>
            <p className="mt-3 text-sm italic text-paper-faint">{shelf.note}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shelf.names.map((name) => (
                <li
                  key={name}
                  className="rounded border border-rule-soft bg-ink-850/60 px-3 py-1.5 text-sm text-paper-dim"
                >
                  {name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-lg border border-rule-soft bg-ink-850/60 p-6">
        <h2 className="font-serif text-xl text-paper">Who will never be on this list</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-paper-dim">
          Living people. Fictional detectives. Anyone whose surviving record is a quote graphic.
          Einstein, because the internet already did him to death. Founders, because a costume with
          a growth strategy is not a mind.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-md border border-rule bg-ink-800/70 px-4 py-2.5 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-700 hover:text-paper"
        >
          Back to the shelf
        </Link>
      </section>
    </div>
  );
}
