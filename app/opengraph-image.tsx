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
  night: "#07081a",
  yellow: "#ffd200",
  orange: "#f7931e",
  red: "#e4183c",
  blue: "#3b3fb6",
  navy: "#23256b",
};

const flame = `linear-gradient(100deg, ${colors.yellow} 0%, ${colors.orange} 38%, ${colors.red} 72%, ${colors.blue} 100%)`;

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
                backgroundColor: "rgba(255,255,255,0.045)",
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
                backgroundColor: "rgba(255,255,255,0.045)",
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
              "radial-gradient(circle at 960px 300px, rgba(247,147,30,0.38) 0%, rgba(228,24,60,0.2) 22%, rgba(59,63,182,0.1) 40%, rgba(7,8,26,0) 58%)",
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
              "radial-gradient(circle at 0px 630px, rgba(59,63,182,0.4) 0%, rgba(35,37,107,0.16) 25%, rgba(7,8,26,0) 45%)",
          }}
        />
        {/* Brand mark */}
        <img
          src={markSrc}
          alt=""
          width={300}
          height={300}
          style={{ position: "absolute", right: 110, top: 165, borderRadius: 64 }}
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
            <div style={{ width: 44, height: 6, borderRadius: 9999, backgroundImage: flame }} />
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
                backgroundImage: flame,
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
                style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: colors.yellow }}
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
