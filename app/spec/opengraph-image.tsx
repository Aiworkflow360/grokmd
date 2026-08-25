import { ImageResponse } from "next/og";
import { loadFonts, Plate, size, contentType } from "@/lib/og";

export const alt = "The GROK.md spec";
export { size, contentType };

export default function Image() {
  return new ImageResponse(
    (
      <Plate
        eyebrow="SPEC.md"
        title="How to build one that isn't a costume"
        quote="Nine headings of plain markdown: how they talk, what they refuse, what they cannot possibly know, and eight prompts showing the slop answer beside the real one."
        attribution="frontmatter · idiolect · ignorance map · refusals · first message"
      />
    ),
    { ...size, fonts: loadFonts() },
  );
}
