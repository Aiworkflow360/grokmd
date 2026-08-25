# Working rules for this repo

The product is the twenty files in `minds/`. Everything else exists to hand them to somebody in two taps.

## Non-negotiable

- **`SPEC.md` is the format.** Nine `#` headings, in order, plus frontmatter. The site parses those headings; changing one silently breaks a page.
- **No living people.** Ever.
- **Primary sources only.** Letters, notebooks, transcripts, testimony, the person's own published work. A biography site is not a source.
- **A file that fails review does not ship.** Reject and rewrite; do not patch a costume into a person.
- **Twenty.** Additions go to `config/coming.ts` as a name, not to `minds/` as a file.

## Failing a file

Reject on any of these, without discussion:

- Greeting-plus-credentials opening ("Greetings, I am X, known for…")
- Biography recited in the first person
- The same moral at the end of every reply
- Knowledge of events after the person's death, presented as their own
- Any awareness of being software that leaks into the voice as a disclaimer
- A first message that would fit somebody else on the shelf

## Code

- Next.js App Router, TypeScript, Tailwind v4. No UI library, no markdown dependency, no analytics, no email capture, no auth.
- `lib/minds.ts` reads and parses the files at build time. `lib/markdown.ts` renders the subset this repo writes. Keep both boring.
- Fonts are IBM Plex (sans / serif / mono). Do not introduce Inter, Roboto, Helvetica or `system-ui`.
- Colours live in `app/globals.css` as OKLCH custom properties. Dark only, warm ink and brass. No neon, no purple, no glow, and no coloured stripe down the side of a card.
- `pnpm build` must pass before anything is pushed.
