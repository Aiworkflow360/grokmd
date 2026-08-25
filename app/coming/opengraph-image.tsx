import { ImageResponse } from "next/og";
import { loadFonts, Plate, size, contentType } from "@/lib/og";
import { COMING_COUNT } from "@/config/coming";

export const alt = "The queue";
export { size, contentType };

export default function Image() {
  return new ImageResponse(
    (
      <Plate
        eyebrow="The queue"
        title={`${COMING_COUNT} more. None written yet.`}
        quote="Names and counts on purpose. A name leaves this list when somebody has read enough primary text to catch it lying — and the file survives review."
        attribution="no living people · no fictional detectives · no Einstein"
      />
    ),
    { ...size, fonts: loadFonts() },
  );
}
