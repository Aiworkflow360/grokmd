import { ImageResponse } from "next/og";
import { cardQuote, loadFonts, Plate, size, contentType } from "@/lib/og";
import { getMind, getMinds } from "@/lib/minds";

export const alt = "A GROK.md mind card";
export { size, contentType };

export function generateStaticParams() {
  return getMinds().map((mind) => ({ id: mind.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mind = getMind(id);

  return new ImageResponse(
    (
      <Plate
        eyebrow={`${mind?.category ?? "Mind"} · ${mind?.years ?? ""}`}
        title={mind?.name ?? "Not on the shelf"}
        quote={cardQuote(mind?.firstMessage ?? "")}
        attribution={mind ? `they speak first · minds/${mind.id}.md` : undefined}
      />
    ),
    { ...size, fonts: loadFonts() },
  );
}
