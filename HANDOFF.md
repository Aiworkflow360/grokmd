# HANDOFF

**Live:** https://grokmd.vercel.app
**Repo:** https://github.com/Aiworkflow360/grokmd (public)

## What this is

Twenty `GROK.md` files that turn a general assistant into a particular person for the length of a conversation, plus the site that hands them over in two taps. Grok Bot shipped with a computer and nobody to be; this is the directory.

Read `SPEC.md` before touching a mind file. Read `AGENTS.md` before touching anything else.

## The one thing to understand before editing

**The failure is never in the file you are looking at. It is across the set.**

Write two of these and your own sentences leak into both. Two independent reviewers found it, and neither found it by reading a file — they found it by reading files side by side. What they caught:

- Every character answering "are you an AI?" with one sentence and a swapped name.
- Every ignorance-map section ending with the same two-sentence template.
- Every grief question resolving as "goes short, changes the subject" — for five entirely different wounds.
- Every character winning all eight test prompts, which makes a wall rather than a mind.
- Anger written as quiet and controlled in every file, because that is the author's taste, to the point of overwriting the documented fact that Feynman was loud.

`pnpm check` now catches the mechanical shadow of all of that. It cannot catch the next version of it. When the check fires, **do not paraphrase your way past it** — a green build after a reword is evidence of successful paraphrase. Go back to the primary text.

## State

`STATUS.md` has the live list. In short: all twenty published, share cards and `LAUNCH.md` done, three review passes run and their findings applied.

## How it fits together

- `minds/*.md` — the product. Frontmatter plus nine `#` headings in a fixed order.
- `lib/minds.ts` — reads and parses them at build time. Shelf order is the `ROSTER` array.
- `lib/markdown.ts` — ~150 lines, renders the markdown subset this repo writes. No dependency.
- `lib/og.tsx` — the share-card plate. Fonts are committed under `public/fonts` so card generation needs no network.
- `app/m/[id]/page.tsx` — hoists "First message" and "Who is speaking" out of the prose and gives them their own treatment; everything else renders in order.
- `config/coming.ts` — the queue. Names only.
- `scripts/check-minds.mjs` — the gate. Runs before `next build`.

## Adding a mind

1. Write `minds/<id>.md` to the spec.
2. Add the id to `ROSTER` in `lib/minds.ts` where it belongs on the shelf.
3. `pnpm build` — the check runs first and will refuse work that repeats another file.
4. `git push`. The Vercel project is connected; a push to `main` deploys production.

No database, no CMS, no other registration step.

## Traps

- The nine headings are matched by prefix. Renaming "First message" silently empties the wall quote.
- A first message over three sentences fails the build. That limit is in the spec and is worth keeping.
- The first message renders as markdown. It did not, once, and every emphasis mark printed literally on the wall and on the share card.
- `/coming` gets names. It never gets a file.
- No living people. Ever.

## What a fourth reviewer should look for

Three reviews so far, and the most valuable findings were always factual, not stylistic: a Dawkins line put in Twain's mouth inside the file about misattributed Twain quotes; letters to a wife Faraday had not met; Turing simultaneously forty-one and mid-treatment; Ali thirty-six, champion and in 1980 at once; Annie brushing Darwin's hair, reversed. **Check the claims against the primary sources before you check the prose against the spec.**

Two things a fourth reviewer should assume are still wrong:

1. **Something in here is a popular legend presented as a fact.** Three were caught — Leonardo testing a flying machine, contemporary records of Ganryūjima, the Instituto in Senna's bibliography. There will be more.
2. **Some move is being made in all twenty files and nobody has named it yet.** Each review found one the previous review could not see: a copied sentence, then a copied shape, then a copied *slot*. The check now catches all three of those. It will not catch the fourth.

## The two live tests

Putting a file on and answering cold questions found something no reading found: a section that states a position and supplies no material for it will be *constructed* by the model, and the construction will be modern. Feynman's file said "tell the story where he is the fool — he has plenty" and listed none, so the move got skipped. Marcus's file banned both defending and renouncing the slaveholding and gave no words for either, so the performance built a careful modern half-renunciation — the exact forgery the ban existed to stop.

**Run that test on any file you change.** Give it to a reader who has not seen the others, have them answer five questions in voice, and read the self-report.
