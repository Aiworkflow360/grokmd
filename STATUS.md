# STATUS

**Live:** https://grokmd.vercel.app
**Repo:** https://github.com/Aiworkflow360/grokmd

## Done

- **Step 0 — scaffold.** Next.js 16 App Router, TypeScript, Tailwind v4, IBM Plex. Zero runtime dependencies beyond React and Next: the frontmatter parser and the markdown renderer are both in `lib/`, about 300 lines together.
- **Step 1 — spec, parser, first mind.** `SPEC.md` written and rendered at `/spec`. Feynman live at `/m/feynman` with copy, copy-for-Grok-Bot and raw-GitHub.
- **Steps 2 and 3 — the twenty.** All published. Feynman, Faraday, Lovelace, Turing, Ramanujan, Curie, Darwin, Shannon, Montaigne, Marcus Aurelius, Orwell, Twain, Wittgenstein, Arendt, Franklin, Machiavelli, Ali, Senna, Leonardo, Musashi. **The shelf is closed. Nobody else joins it.**
- **Step 4 — share cards and the launch thread.** One plate per person, 1200×675, generated at build time from two committed Plex faces so nothing is fetched. `LAUNCH.md` is eight posts.
- **The site.** Home, `/spec`, `/coming` with 217 queued names, a 404, and the footer disclaimer on every page.
- **`scripts/check-minds.mjs`.** Runs before every build. See below — it is the most useful thing in the repo after the files themselves.
- **Two reviews by readers with no memory of writing the files**, and the repairs they forced.
- **Mobile verified against the deployed build** at 375px: no horizontal overflow, and the copy button hands the clipboard all 12,683 characters of Feynman with the frontmatter and all nine sections intact.

## The gate, and why it exists

The first review found one voice wearing five names. Every file answered "are you an AI?" with the same clause and the nouns swapped; four of five opened by reporting they had been told to speak first; nobody raised their voice, including Feynman, who was famously loud in public. So the build started failing on any seven words shared between two mind files.

The second review found that the counter was being satisfied by **paraphrase**. Twenty files still said *Insists he is X, or produces a disclaimer* — one sentence, twenty times, sharing no seven words because the only thing that varied was the name. The check now also strips every capitalised word and compares the test-prompt rows at five, and fails any file where nothing in the eight rows concedes. Seven files failed that on the day it was added.

- **Third review**, over the nine minds nobody had checked, and the repairs it forced — see below.
- **Two live performances.** Somebody put Feynman's file on and answered five questions cold, then Marcus's. Both worked. Both reports named the same defect and it has been fixed.

## What the three reviews cost, and what they were worth

The third review found more in nine files than the first two found in eleven. Thirty-three factual corrections, of which the worst was Darwin: the file had him remembering brushing Annie's hair, and in his own memorial of her it is Annie who steals up behind him and brushes his, *making it beautiful*. A private document about a dead ten-year-old with the direction of the affection reversed.

Also: Curie's twenty radiological cars had become two hundred mobile units. Ali could not be thirty-six, champion, and in 1980 at once. Senna's bibliography cited statements about an institute founded after his death. Musashi's file quoted the first of the twenty-one precepts and gave the sixth. Leonardo simultaneously knew and did not know the Milan wall was lifting.

And two structural ones, both now enforced:

- **Nineteen files said one instruction nineteen ways**, rotating the verb to clear a seven-word window. That instruction has to be in every file — a file gets pasted somewhere on its own — so it is one identical sentence now, marked as boilerplate and exempt by name. Honest repetition beats disguised repetition.
- **Every first message was an entrance exam**, which is the failure the spec names by name, committed twenty times. Ten of them stop demanding anything now, and the build fails when more than half do.

## Not started

- Nothing. Twenty is the number, and `/coming` gets names, never files.
