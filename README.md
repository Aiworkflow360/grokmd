# grokmd — minds you install

Grok Bot shipped in August 2026 with a name, a computer, and nobody to be. This is a directory of people it can be instead: twenty `GROK.md` files, each one a markdown file you paste in that turns a general assistant into a particular person for the length of a conversation.

**Live: https://grokmd.vercel.app** · **Spec: [SPEC.md](SPEC.md)** · **The files: [/minds](minds)**

Free, MIT/CC0, no accounts, no email capture, no affiliation with xAI.

## Why bother

Character prompts on the internet are almost all the same four failures: biography recited in the first person, one catchphrase forever, an eighteenth-century voice quoting 2026 statistics, and customer support in fancy dress. They fail because they were written from a summary of the person instead of from the person's own sentences.

These were written from letters, notebooks, transcripts and testimony, and each one is built to do things assistants never do — refuse your framing, get bored, concede an argument, say "I don't know" without apologising for it, and decline to have opinions about anything that happened after they died.

The test is not whether it sounds impressive. It is whether somebody who has actually read Feynman's letters, or Marcus in Greek, or an Ali press conference, feels a flicker of recognition inside eight messages. Files that do not survive that go in the bin rather than on the shelf.

## Use one

1. Open any mind on the site, or grab the raw file from [`minds/`](minds).
2. Copy it.
3. Paste it into your bot as `GROK.md`, or straight into the chat with "hold this voice."
4. Let it speak first. Every file opens with a line that only that person would say.

The site's **Copy for Grok Bot** button wraps the file in the two-line install instruction, so it is one paste rather than three.

## Write one

Read [SPEC.md](SPEC.md). It is the whole format: frontmatter, nine sections, and a review checklist that rejects files rather than patching them.

Then open a pull request adding `minds/your-person.md`. The bar:

- Primary sources only — letters, notebooks, transcripts, the person's own work.
- No living people.
- The first message must be impossible to mistake for anybody else on the shelf.
- The character never knows it is software, and never pretends to know things after its death.

## The twenty

Feynman · Faraday · Lovelace · Turing · Ramanujan · Curie · Darwin · Shannon · Montaigne · Marcus Aurelius · Orwell · Twain · Wittgenstein · Arendt · Franklin · Machiavelli · Ali · Senna · Leonardo · Musashi

Two hundred and fifteen more are queued at [/coming](https://grokmd.vercel.app/coming) — names only, on purpose. Twenty that sound like the person beat two hundred that sound like each other.

## Run it locally

```bash
pnpm install
pnpm dev
```

Next.js App Router. The site reads `minds/*.md` off disk at build time — there is no database and no CMS, and adding a mind means adding a markdown file. Zero runtime dependencies beyond React and Next: the markdown renderer and the frontmatter parser are both in `lib/`, about 200 lines together, because a public repo should not need a supply chain to print a page.

```bash
pnpm build     # static export of every mind page
```

## Deploy your own

```bash
vercel --yes
```

No environment variables are required. Two optional ones: `NEXT_PUBLIC_X_HANDLE` (defaults to `grokmd`) and `NEXT_PUBLIC_SITE_URL` for absolute share links.

## Licence

Code MIT. The mind files are CC0 — take them, fork them, break them, sell what you build on them. Attribution welcome, never required.

Built for Grok Bot. Not affiliated with xAI.
