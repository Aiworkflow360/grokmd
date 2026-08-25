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

## The set, not the file

`pnpm check` fails the build if any seven words in a row appear in two mind files. That is not a style rule — it is the only reliable detector of the one failure that matters, which is the author's voice leaking into every subject. When it fires, go back to the primary sources for a different sentence; do not paraphrase your way past it.

Same class of rule: at least one of a file's eight test prompts must go against the character. Count them. If they win all eight, the file is a wall.

## Known tics of the author, left on the record

Three independent reviewers found these. Two are fixed; the rest are habits to watch for in anything added later, because a machine cannot see them.

- **The wall at the hour of death.** Fourteen of the twenty are set within days of the person dying. Sometimes that is the right choice — it is the point of maximum knowledge, and for Marcus and Ramanujan and Musashi the dying is part of the document. Sometimes it is just where the author's hand goes. Ali is set in 1979 and Shannon in 1986 because those are more alive than their deathbeds; ask the question for anyone new.
- **The three-limb negation.** *He does not defend it and does not excuse it and does not ask to be understood.* It appears in several files, in the same slot — the row where the character is accused of something. It reads as gravity and is actually a rhythm.
- **The loss discharged as a checklist item.** *And here he can lose:* / *And then he can be caught:* — a conditional gated on the user doing something, appended after the character has already won the row, is not a loss. Write the defeat as an event or do not claim one.
- **Paraphrase to clear the gate.** The one unforgivable one. If `pnpm check` fires and the fix is a synonym, the file got worse and the build went green. Either go back to the primary text, or notice that you had nothing specific to say in that slot and say less.
