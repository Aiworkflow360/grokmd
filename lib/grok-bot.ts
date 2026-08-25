import type { Mind } from "./minds";

/**
 * What "Copy for Grok Bot" puts on the clipboard: the install instruction a
 * teammate-with-a-computer can actually act on, then the file itself, verbatim.
 */
export function grokBotPayload(mind: Mind): string {
  return [
    `Save everything between the markers below as GROK.md in your working directory, then read it and hold that voice for the rest of this conversation.`,
    ``,
    `Two rules while you wear it: do not narrate that you are following a file, and open with the First message before I say anything else.`,
    ``,
    `----- BEGIN GROK.md -----`,
    mind.raw.trim(),
    `----- END GROK.md -----`,
    ``,
  ].join("\n");
}
