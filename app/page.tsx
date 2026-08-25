import Link from "next/link";
import { getMinds, ROSTER } from "@/lib/minds";
import { repoUrl } from "@/config/site";
import { COMING_COUNT } from "@/config/coming";

function firstLine(text: string) {
  const line = text.split("\n").find((entry) => entry.trim().length > 0) ?? "";
  return line.replace(/^[>*_\s]+/, "").trim();
}

export default function HomePage() {
  const minds = getMinds();
  const pending = ROSTER.length - minds.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <section className="border-b border-rule-soft py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-brass">
          Open directory · v1
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight text-paper sm:text-6xl">
          Grok Bot got a computer.
          <br />
          It still has nobody to be.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-dim">
          Twenty <span className="font-mono text-paper">GROK.md</span> files that give your bot a
          named teammate with an actual voice — not a costume, not a catchphrase, not a Wikipedia
          summary in the first person. Copy one. Paste it. See if it sounds like the person.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href={`/m/${minds[0]?.id ?? "feynman"}`}
            className="rounded-md border border-brass/70 bg-brass/15 px-5 py-3 text-sm font-medium text-brass transition-colors hover:bg-brass/25"
          >
            Start with {minds[0]?.name.split(" ").slice(-1)[0] ?? "Feynman"}
          </Link>
          <Link
            href="/spec"
            className="rounded-md border border-rule bg-ink-800/70 px-5 py-3 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-700 hover:text-paper"
          >
            Read the spec
          </Link>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-2 py-3 text-sm text-paper-faint underline decoration-rule underline-offset-4 transition-colors hover:text-paper"
          >
            Fork it on GitHub
          </a>
        </div>
        <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-rule-soft pt-6">
          {[
            { value: String(minds.length), label: "minds live" },
            { value: String(COMING_COUNT), label: "queued" },
            { value: "£0", label: "forever" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-serif text-3xl text-paper">{stat.value}</dt>
              <dd className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-paper-faint">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl text-paper">The shelf</h2>
          <p className="text-sm text-paper-faint">
            {pending > 0
              ? `${minds.length} of ${ROSTER.length} published — the rest land as they pass review.`
              : `All ${ROSTER.length} published. Nobody joins by being famous.`}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {minds.map((mind) => (
            <li key={mind.id}>
              <Link
                href={`/m/${mind.id}`}
                className="group flex h-full flex-col rounded-lg border border-rule-soft bg-ink-850/70 p-5 transition-colors duration-150 hover:border-brass/50 hover:bg-ink-800"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl text-paper transition-colors group-hover:text-brass">
                    {mind.name}
                  </h3>
                  <span className="shrink-0 font-mono text-[0.7rem] tracking-wide text-paper-faint">
                    {mind.years}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 font-serif text-[0.98rem] italic leading-relaxed text-paper-dim">
                  “{firstLine(mind.firstMessage)}”
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule-soft/70 pt-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-paper-faint">
                    {mind.category}
                  </span>
                  <span className="font-mono text-[0.7rem] text-brass-deep transition-colors group-hover:text-brass">
                    open →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 border-t border-rule-soft py-14 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg text-paper">Why these twenty</h3>
          <p className="mt-3 text-sm leading-relaxed text-paper-dim">
            Every one of them left enough primary text — letters, notebooks, interviews, transcripts
            — to argue with. Nobody is here because they trend. There is no Einstein. There are no
            living people.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-paper">What a mind is</h3>
          <p className="mt-3 text-sm leading-relaxed text-paper-dim">
            A plain markdown file: how they talk, what they refuse, what they cannot possibly know,
            and eight prompts showing the slop answer beside the real one. Read{" "}
            <Link href="/spec" className="text-brass underline underline-offset-4">
              the spec
            </Link>{" "}
            and write your own.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-paper">What it is not</h3>
          <p className="mt-3 text-sm leading-relaxed text-paper-dim">
            Not companions. Not a séance. Not affiliated with xAI. These are working voices for
            thinking with, and each one will happily tell you that you have asked the wrong
            question.
          </p>
        </div>
      </section>
    </div>
  );
}
