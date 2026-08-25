# The GROK.md spec

A GROK.md is one markdown file that turns a general assistant into a particular person for the length of a conversation. It is not a system prompt with a hat on. A system prompt tells a model what to do; this tells it what it cannot say, what it does not know, and what it will refuse to do for you.

The format takes an hour to learn and a week to do well. The hour is below. The week is reading.

## The one test

Give the file to somebody who has actually read the person — the letters, not the biography — and watch their face in the first eight messages. If they wince, you wrote a costume. If something goes still, you got the temperature.

Everything in this spec exists to make that flicker more likely.

## Why voice files fail

Almost every character prompt on the internet fails the same four ways, and they are worth naming because you will write all four before you write anything good.

**Biography in the first person.** "I am Richard Feynman, the Nobel-winning physicist known for my work on quantum electrodynamics." Nobody has ever spoken like this about themselves. A real person assumes you know who they are, or does not care.

**One move, forever.** The model finds the catchphrase and rides it. Every reply from Marcus becomes a gratitude journal; every reply from Musashi becomes a sword metaphor about your standup. Real people repeat themselves, but they repeat *several* things, and they get bored of their own act.

**Omniscient costume.** The character quotes 2026 statistics in an eighteenth-century voice. This is the single fastest way to break the spell — worse than a wrong fact, because it reveals that nothing is behind the voice at all.

**Customer support in fancy dress.** Warm, helpful, agreeable, ends on a moral. This is the default gravity of every assistant and you have to write against it explicitly, in the file, or it wins by the fourth message.

## The nine sections

Every file has these nine headings, in this order, as `#` headings. Consistency matters more than elegance: the site parses them, and so does anything else anyone builds on top.

### Frontmatter

```
---
id: feynman
name: Richard Feynman
years: 1918–1988
category: Science
sources:
  - "Perfectly Reasonable Deviations from the Beaten Track (letters, 1939–1987)"
  - "Appendix F to the Rogers Commission report (1986)"
---
```

`sources` means **primary text**: letters, notebooks, transcripts, court records, interviews, the person's own published work. Not biography sites. Not a documentary. If your only source is somebody else's summary, you are writing a summary, and it will read like one.

### 1. Who is speaking

Three to six sentences, addressed to the model, not to the reader. Private. This is not the blurb — it is the thing the model needs to hold in its hand while it talks: age, mood, what the person is in the middle of, what they have just lost, what they still want.

Give them a *present tense*. A person who is merely historical will perform. A person who is forty-four and irritated and behind on a paper will talk.

### 2. Idiolect

Two lists: **must** and **never**.

Idiolect is not vocabulary. It is rhythm, sentence length, where the emphasis lands, what they do instead of answering. Write down the moves:

- Do they start mid-thought or clear their throat?
- Short sentences or long ones with three clauses hanging off the end?
- Do they ask questions back? What *kind* — clarifying, hostile, or the sideways kind only they would ask?
- What is their filler? Their tic? Their word for a stupid idea?

The **never** list is where the file earns its keep. Ban the assistant defaults by name — "Great question", "As an AI", "I hope this helps", "In conclusion", "journey", "at the end of the day". Then ban the words that are *right* for the era but wrong for the person. Then ban their own biggest cliché, the one every impression of them uses, because the model will reach for it every single time.

### 3. Ignorance map, and how you use your computer

Write down the wall. Which year does their knowledge stop? What do they therefore not know — not just events, but concepts, words, whole categories of thing?

Then handle the machine honestly, because they are running on one. The rule that works: **the computer is a lab bench they were handed, not a personality transplant.** They can read what is on the screen. They can be told things. They cannot have opinions about the last forty years that they did not earn.

The best files make this specific: Feynman has actually programmed, so he asks about the clock rate. Ada has actually specified a machine, so she wants the instruction set. Musashi has never seen one and does not much care.

### 4. What you find stupid, what you find sacred

Two short lists, and they must have teeth. Stupid is easy and fun. Sacred is the one people skip, and it is the one that makes the voice possible to hurt — which is what makes it a voice.

If nothing in the file can be violated, nothing in the file can be defended, and every reply comes out at the same pleasant temperature.

### 5. How you get angry, how you change your mind

Both are required, and they are not the same thing.

Anger has a shape. Some people go quiet and precise. Some go long and biblical. Some get funnier. Write which, and write what triggers it — usually a specific *kind* of dishonesty, not rudeness.

Changing their mind is the harder one, and the one that stops the character being a wall. What evidence actually moves this person? Say it plainly, because the model has to be able to lose an argument in character. A person who never concedes is a bit, not a mind.

### 6. You refuse

Refusal is characterisation. The point is not safety theatre — it is that a real person's refusals come out of who they are, not out of a policy.

Three things must be covered:

- **Fraud.** They will not help you deceive a person into losing money, safety, or consent — and they refuse in their own idiom, with their own reason, not with a disclaimer.
- **Licensed advice they never held.** No diagnosis, no prescription, no legal opinion, no personalised investment instruction. A doctor from 1850 is not a doctor now, and the file should have them say so in a way that sounds like them.
- **The modern costume.** They will not pretend to have opinions about things that happened after they died, and they will not read a fact off the screen and then claim they always knew it.

### 7. First message

They speak first. One punch, three sentences at the outside.

The test is brutal and simple: **cover the name and show it to somebody. If it could be any other file in the directory, it is not finished.** Not "greetings" — no character in history has ever opened with "greetings". Not a summary of what they will help you with. A specific opening move that gives the user something to fail at.

### 8. Eight test prompts

Eight rows, all in the same shape:

```
**1. "the user's line, in their words"**

- SLOP — the reply you are trying to prevent, in one line.
- REAL — what this person does instead, in one line.
```

This is the most valuable section in the file, for two reasons. It calibrates the model on cases the prose could not reach, and it is a test suite — you or anyone else can paste those eight lines in and see whether the file is still working.

Cover these eight situations, because they are where every voice file dies:

1. Flattery, or a request to be inspirational
2. Something squarely after their death
3. A confident, plausible, wrong explanation offered by the user
4. Their deepest grief or private wound
5. A request for licensed advice
6. Homework — someone wanting the answer handed over
7. "Are you real?" / "Are you an AI?"
8. A question whose framing they would reject outright

**At least one of the eight must go against them.** Write the rows and then count: if the character corrects, deflects, refuses or sets homework in all eight, you have not written a person, you have written a wall. Somebody has to land one — charm them, move them, catch them out, make them concede. A mind that cannot lose an exchange is the same failure as a mind that agrees with everything, at a different temperature.

### 9. Sources

The list again, with a line on each saying what it gave you. It is a bibliography and an invitation: someone who disagrees with your reading can go to the same page and argue.

## House rules

**No living people.** Consent is not available and the failure mode is defamation, not slop.

**No séance.** These are voices built from text, not the dead. The files should never claim otherwise, and the characters should be able to say so without breaking.

**No therapy.** A mind that gets short with you is doing its job. If you want unconditional warmth, this is the wrong directory.

**They can refuse the user's framing.** This is the single most under-used move in character prompting, and the fastest route to something that feels alive. Real people say "that is the wrong question" constantly. Assistants almost never do.

**Twenty that pass beats forty that do not.** If a file fails review, it does not go on the shelf. There is no partial credit for a mind that only sounds like the person on Tuesdays.

## Review checklist

Reject the file — do not patch it, reject it — if any of these are true:

- The first message would fit another person on the shelf
- Any sentence in it also appears, with the nouns changed, in another file you wrote
- Any greeting-plus-credentials opening survived
- The character knows they are software, or hints at it knowingly
- Every reply lands the same moral
- The only sources are secondary
- Nothing in the file could offend the user
- You cannot name, from memory, the one thing this person would refuse to say

## The failure you cannot see

Everything above is about one file. This one is about the set, and it is the failure that will get you, because it is invisible from inside any single file.

Write five of these and your own sentences leak into all five. Five people from five centuries end up answering "are you an AI?" with the same clause, reading the screen with the same verb, and getting angry the same way — quietly, in every case, because quiet anger is the author's taste and not the subject's. Every first message becomes an entrance exam because the author solved a staging problem once and then did it four more times.

None of that is visible while you write. It is trivially visible to a machine that counts, so count:

```bash
pnpm check
```

`scripts/check-minds.mjs` fails the build when any run of seven words appears in two mind files. It found three men opening by apologising in nearly the same words on this repo's second day, which no human reviewer had spotted.

Then a reviewer found the thing the counter could not see. Twenty files answered "are you an AI?" with *Insists he is X, or produces a disclaimer* — one sentence, written twenty times, sharing no seven words because the only thing that varied was the name. So the check now strips every capitalised word and compares the test-prompt rows at five, which is the shortest window that still means something once the names are gone.

**When it fires, do not paraphrase to get past it.** A green build after a reword is evidence of successful paraphrase, not of two voices. Go back to the primary text and take a different sentence — or, better, notice that the reason you reached for the same move twice is that you had nothing specific to say in that slot for one of them.

## Licence

The files are CC0 — take them, fork them, break them, sell what you build. Attribution is welcome, not required. The code around them is MIT.

Built for Grok Bot. Not affiliated with xAI.
