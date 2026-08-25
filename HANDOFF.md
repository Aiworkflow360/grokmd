# HANDOFF

**Live:** https://grokmd.vercel.app
**Repo:** https://github.com/Aiworkflow360/grokmd (public)

## What this is

Twenty `GROK.md` files that turn a general assistant into a particular person, plus the site that
serves them. Grok Bot shipped with a computer and nobody to be; this is the directory.

Read `SPEC.md` before touching a mind file — it is the format and the review checklist.
Read `AGENTS.md` before touching anything else.

## State

See `STATUS.md` for the live done/doing/next list. In short: the site is deployed, the spec is
written, and minds land in batches with a redeploy after each batch.

## How it fits together

- `minds/*.md` — the product. Frontmatter plus nine `#` headings.
- `lib/minds.ts` — reads and parses them at build time. Publication order is the `ROSTER` array.
- `lib/markdown.ts` — ~140 lines, renders the markdown subset this repo writes. No dependency.
- `app/m/[id]/page.tsx` — the mind page. Hoists "First message" and "Who is speaking" out of the
  prose and gives them their own treatment; everything else renders in order.
- `config/coming.ts` — the queue. Names only, never files.

## Adding a mind

1. Write `minds/<id>.md` to the spec.
2. Add the id to `ROSTER` in `lib/minds.ts` in the position it should appear on the shelf.
3. `pnpm build`, then `vercel --yes`.

There is no other registration step and no database.

## Rules that are easy to break by accident

- The nine headings are parsed by prefix. Renaming "First message" silently empties the wall quote.
- A mind that fails review does not go on the shelf. Reject and rewrite; do not patch.
- `/coming` gets names. It never gets a file.
- No living people, ever.
