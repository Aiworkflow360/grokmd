import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-brass">404</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-paper sm:text-5xl">
        Nobody of that name is on the shelf.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper-dim">
        Twenty minds, chosen because they left enough writing to argue with. If the one you wanted
        is missing, it is probably in the queue — or it should be, and you should say so.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md border border-brass/70 bg-brass/15 px-5 py-3 text-sm font-medium text-brass transition-colors hover:bg-brass/25"
        >
          The shelf
        </Link>
        <Link
          href="/coming"
          className="rounded-md border border-rule bg-ink-800/70 px-5 py-3 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-700 hover:text-paper"
        >
          Who is queued
        </Link>
      </div>
    </div>
  );
}
