import { ImageResponse } from "next/og";
import { loadFonts, Plate, size, contentType } from "@/lib/og";
import { getMinds } from "@/lib/minds";
import { COMING_COUNT } from "@/config/coming";

export const alt = "grokmd — minds you install";
export { size, contentType };

export default function Image() {
  const count = getMinds().length;

  return new ImageResponse(
    (
      <Plate
        eyebrow="Open directory · v1"
        title="Minds you install."
        quote={`${count} GROK.md files that give Grok Bot a named teammate with a real voice — written from letters and transcripts, not from a summary. Copy one. Paste it. See if it sounds like the person.`}
        attribution={`free · MIT / CC0 · ${COMING_COUNT} more queued`}
      />
    ),
    { ...size, fonts: loadFonts() },
  );
}
