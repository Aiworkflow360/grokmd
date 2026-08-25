import fs from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 675 };
export const contentType = "image/png";

/**
 * The two faces are committed under public/fonts so card generation has no
 * network dependency. Read once per build.
 */
let cached: { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[] | null = null;

export function loadFonts() {
  if (cached) return cached;
  cached = [
    {
      name: "Plex Serif",
      data: fs.readFileSync(path.join(process.cwd(), "public/fonts/IBMPlexSerif-SemiBold.ttf")),
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Plex Mono",
      data: fs.readFileSync(path.join(process.cwd(), "public/fonts/IBMPlexMono-Regular.ttf")),
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
  return cached;
}

const INK = "#191512";
const RULE = "#3a332c";
const PAPER = "#efe9e0";
const PAPER_DIM = "#b3a99b";
const BRASS = "#d8a24a";

/**
 * One plate. A library card, not a poster: ink ground, a brass rule, the name
 * set in serif, and one line the person actually says. No glow, no gradient
 * mesh, no circuitry.
 */
export function Plate({
  eyebrow,
  title,
  quote,
  attribution,
}: {
  eyebrow: string;
  title: string;
  quote: string;
  attribution?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
        backgroundImage: `radial-gradient(1100px 520px at 50% -160px, #2a2118 0%, ${INK} 62%)`,
        padding: "62px 72px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Plex Mono",
            fontSize: 21,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: BRASS,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: "Plex Serif",
            fontSize: title.length > 22 ? 74 : 92,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            color: PAPER,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", width: 96, height: 3, backgroundColor: BRASS }} />
        <div
          style={{
            display: "flex",
            marginTop: 26,
            maxWidth: 980,
            fontFamily: "Plex Serif",
            fontSize: 33,
            lineHeight: 1.42,
            color: PAPER_DIM,
          }}
        >
          {quote}
        </div>
        {attribution ? (
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Plex Mono",
              fontSize: 20,
              color: "#7d7367",
            }}
          >
            {attribution}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${RULE}`,
          paddingTop: 24,
          fontFamily: "Plex Mono",
          fontSize: 21,
        }}
      >
        <div style={{ display: "flex", color: PAPER }}>
          grok<span style={{ color: BRASS }}>md</span>
          <span style={{ color: "#7d7367", marginLeft: 20 }}>grokmd.vercel.app</span>
        </div>
        <div style={{ display: "flex", color: "#7d7367" }}>
          Built for Grok Bot. Not affiliated with xAI.
        </div>
      </div>
    </div>
  );
}

/**
 * Cards get whole sentences. Cutting mid-clause on a dash produced
 * "…how long you have studied it —…" on the live Musashi card, which reads as
 * a truncation bug rather than as a quotation, so this only ever ends on a full
 * stop or a question mark — and falls back to a word boundary when even the
 * first sentence is too long for the plate.
 */
export function cardQuote(text: string, limit = 210) {
  const flat = text.replace(/\s+/g, " ").replace(/^[>*_\s]+/, "").trim();
  if (flat.length <= limit) return flat;

  const sentences = flat.match(/[^.!?]+[.!?]+/g) ?? [];
  let kept = "";
  for (const sentence of sentences) {
    if ((kept + sentence).trim().length > limit) break;
    kept += sentence;
  }
  if (kept.trim()) return kept.trim();

  const cut = flat.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
}
