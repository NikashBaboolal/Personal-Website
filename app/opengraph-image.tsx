import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { person } from "@/lib/content";

// Rendered once at build time with the font bundled in `next/og`: no network access needed.
export const alt = `${person.name}: ${person.role}`;
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  night: "#06141b",
  mint: "#5eead4",
  teal: "#2dd4bf",
  cyan: "#22d3ee",
  blue: "#3b82f6",
  navy: "#0f3a4a",
  hot: "#f5a524",
};

/** Process-stream gradient (teal -> cyan -> blue). */
const stream = `linear-gradient(100deg, ${colors.mint} 0%, ${colors.teal} 35%, ${colors.cyan} 68%, ${colors.blue} 100%)`;

/** Small process flow diagram strip (column, exchanger, reactor, instrument bubbles). */
const pfdSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160" width="560" height="160" fill="none">
  <g stroke="rgba(94,234,212,0.35)" stroke-width="2">
    <path d="M0 120 H70"/><path d="M190 120 H230 V70 H262"/><path d="M342 120 H392 V60 H430"/><path d="M470 20 V8 H560"/>
  </g>
  <g stroke="${colors.mint}" stroke-width="2.4" stroke-dasharray="8 18" stroke-linecap="round">
    <path d="M0 120 H70"/><path d="M190 120 H230 V70 H262"/><path d="M342 120 H392 V60 H430"/><path d="M470 20 V8 H560"/>
  </g>
  <path d="M110 92 V102 M150 138 V156" stroke="${colors.hot}" stroke-width="2" stroke-dasharray="6 8"/>
  <rect x="70" y="102" width="120" height="36" rx="18" stroke="${colors.mint}" stroke-width="2"/>
  <path d="M86 112 H174 M86 120 H174 M86 128 H174" stroke="${colors.mint}" stroke-width="1" opacity="0.6"/>
  <path d="M262 70 Q262 50 302 50 Q342 50 342 70 V128 Q342 150 302 150 Q262 150 262 128 Z" stroke="${colors.mint}" stroke-width="2"/>
  <path d="M302 36 V130 M282 124 H322 M286 100 H318" stroke="${colors.cyan}" stroke-width="2" stroke-linecap="round"/>
  <rect x="430" y="20" width="44" height="136" rx="20" stroke="${colors.mint}" stroke-width="2"/>
  <path d="M436 44 H466 M440 64 H470 M436 84 H466 M440 104 H470 M436 124 H466" stroke="${colors.mint}" stroke-width="1.4" opacity="0.6"/>
  <circle cx="40" cy="78" r="18" stroke="${colors.cyan}" stroke-width="1.6"/><path d="M22 78 H58" stroke="${colors.cyan}" stroke-width="1.2"/>
  <path d="M40 96 V120" stroke="${colors.cyan}" stroke-width="1.2" stroke-dasharray="4 4"/>
  <circle cx="380" cy="24" r="18" stroke="${colors.cyan}" stroke-width="1.6"/><path d="M362 24 H398" stroke="${colors.cyan}" stroke-width="1.2"/>
  <path d="M380 42 V60" stroke="${colors.cyan}" stroke-width="1.2" stroke-dasharray="4 4"/>
</svg>`;
const pfdSrc = `data:image/svg+xml;base64,${Buffer.from(pfdSvg).toString("base64")}`;

export default async function OpengraphImage() {
  // The NB monogram, inlined as a data URI.
  const mark = await readFile(join(process.cwd(), "public/brand/nb-mark.svg"));
  const markSrc = `data:image/svg+xml;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: colors.night,
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {Array.from({ length: 21 }, (_, i) => (
            <div
              key={`v${i}`}
              style={{
                position: "absolute",
                left: i * 60,
                top: 0,
                width: 1,
                height: 630,
                backgroundColor: "rgba(94,234,212,0.06)",
              }}
            />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <div
              key={`h${i}`}
              style={{
                position: "absolute",
                top: i * 60,
                left: 0,
                height: 1,
                width: 1200,
                backgroundColor: "rgba(94,234,212,0.06)",
              }}
            />
          ))}
        </div>
        {/* Glow behind the mark (full-canvas gradients: no clipped edges) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 960px 300px, rgba(45,212,191,0.32) 0%, rgba(34,211,238,0.16) 22%, rgba(59,130,246,0.1) 40%, rgba(6,20,27,0) 58%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 0px 630px, rgba(59,130,246,0.32) 0%, rgba(15,58,74,0.2) 25%, rgba(6,20,27,0) 45%)",
          }}
        />
        {/* Process flow strip along the bottom-right */}
        <img
          src={pfdSrc}
          alt=""
          width={420}
          height={120}
          style={{ position: "absolute", right: 36, bottom: 30, opacity: 0.55 }}
        />
        {/* Brand mark (NB inside a benzene ring) */}
        <img
          src={markSrc}
          alt=""
          width={250}
          height={250}
          style={{ position: "absolute", right: 120, top: 160, borderRadius: 56 }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 6, borderRadius: 9999, backgroundImage: stream }} />
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {person.disciplines.join(" · ")}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 120,
                lineHeight: 1,
                letterSpacing: -3,
                backgroundImage: stream,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              NIKASH
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                lineHeight: 1.1,
                letterSpacing: 18,
                marginTop: 4,
              }}
            >
              BABOOLAL
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                marginTop: 28,
                color: "rgba(255,255,255,0.86)",
                maxWidth: 700,
              }}
            >
              {`${person.role} · ${person.tagline}`}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(255,255,255,0.06)",
                fontSize: 24,
              }}
            >
              <div
                style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: colors.mint }}
              />
              {person.ecsa}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.6)" }}>
              {person.location}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
