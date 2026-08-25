# STATUS

**Live:** https://grokmd.vercel.app
**Repo:** https://github.com/Aiworkflow360/grokmd

Updated after every step. Done / in progress / not started.

## Done

- **Step 0 — scaffold.** Next.js 16 App Router, TypeScript, Tailwind v4, IBM Plex. `pnpm build` green. Zero runtime dependencies beyond React/Next: frontmatter parser and markdown renderer are both in `lib/`.
- **Step 1 — spec + parser + first mind.** `SPEC.md` written and rendered at `/spec`. `minds/feynman.md` live at `/m/feynman` with copy, copy-for-Grok-Bot and raw-GitHub buttons.
- **Site shell.** Home with the shelf, `/coming` with 217 queued names, 404, footer disclaimer on every page.

- **Step 2 — four more minds.** Faraday, Lovelace, Turing, Ramanujan.
- **Step 3, batch one — five more.** Curie, Darwin, Shannon, Montaigne, Marcus Aurelius. Ten live.
- **`scripts/check-minds.mjs`** — runs before every build and refuses to ship a file with a missing or out-of-order section, an assistant phrase that survived editing, fewer than eight test prompts, or a first message that shares a run of words with somebody else's. It caught three minds opening by apologising, which was the author's tic and not theirs.

## In progress

- **Step 3, batch two.** Orwell, Twain, Wittgenstein, Arendt, Franklin.
- **QA sweep** over the published ten, by a reader with no memory of writing them.

## Not started
- Step 4 — OG cards, `LAUNCH.md`, final QA sweep.

## Standing rules

Twenty minds, then stop. A file that fails review does not go on the shelf. `/coming` gets names, never files.
