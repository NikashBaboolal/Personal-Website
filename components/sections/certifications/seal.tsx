"use client";

import { useId } from "react";

export type SealTone = "steel" | "brass";

const TONES: Record<
  SealTone,
  { hi: string; mid: string; lo: string; ink: string; glint: string }
> = {
  steel: { hi: "#f4f5fc", mid: "#a9aed4", lo: "#3d4178", ink: "#1b1d55", glint: "#ffffff" },
  brass: { hi: "#fff4c2", mid: "#f6c44a", lo: "#9a5508", ink: "#4a2603", glint: "#fffbe6" },
};

/** Scalloped rosette outline (deterministic, computed once). */
const ROSETTE_PATH = (() => {
  const points = 36;
  const cx = 60;
  const cy = 60;
  const outer = 57;
  const inner = 52.5;
  let d = "";
  for (let i = 0; i <= points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = (cx + r * Math.cos(a)).toFixed(2);
    const y = (cy + r * Math.sin(a)).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
  }
  return `${d}Z`;
})();

/** Split a certificate code into a big mark and a smaller sub-line for the seal face. */
export function sealText(code: string): { mark: string; sub: string } {
  const clean = code.replace(/:\d{4}$/, "");
  const tokens = clean.split(/\s+/).filter(Boolean);
  const mark = tokens[0] ?? code;
  const sub = tokens
    .slice(1)
    .filter((t) => t !== "/" && t !== mark && t.toLowerCase() !== "section")
    .join(" · ");
  return { mark, sub };
}

/** Embossed metallic certification seal (SVG). Purely decorative. */
export function Seal({ code, tone, className }: { code: string; tone: SealTone; className?: string }) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const t = TONES[tone];
  const { mark, sub } = sealText(code);
  const markSize = mark.length > 6 ? 12 : mark.length > 4 ? 15 : 22;

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.hi} />
          <stop offset="0.45" stopColor={t.mid} />
          <stop offset="0.55" stopColor={t.hi} />
          <stop offset="1" stopColor={t.lo} />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={t.hi} />
          <stop offset="0.6" stopColor={t.mid} />
          <stop offset="1" stopColor={t.lo} />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.32" cy="0.25" r="0.6">
          <stop offset="0" stopColor={t.glint} stopOpacity="0.85" />
          <stop offset="1" stopColor={t.glint} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* cast shadow */}
      <ellipse cx="60" cy="112" rx="34" ry="4" fill="#000" opacity="0.35" />
      {/* rosette rim */}
      <path d={ROSETTE_PATH} fill={`url(#${id}-rim)`} />
      <path d={ROSETTE_PATH} fill="none" stroke={t.lo} strokeOpacity="0.5" strokeWidth="0.6" />
      {/* embossed bevel: dark groove + light lip */}
      <circle cx="60" cy="60" r="46.5" fill="none" stroke={t.lo} strokeWidth="2.2" opacity="0.75" />
      <circle cx="60" cy="60.9" r="45.2" fill="none" stroke={t.glint} strokeWidth="0.9" opacity="0.7" />
      {/* pressed face */}
      <circle cx="60" cy="60" r="44" fill={`url(#${id}-face)`} />
      <circle cx="60" cy="60" r="44" fill={`url(#${id}-shine)`} />
      {/* milled inner ring */}
      <circle
        cx="60"
        cy="60"
        r="38.5"
        fill="none"
        stroke={t.ink}
        strokeOpacity="0.45"
        strokeWidth="1.4"
        strokeDasharray="0.9 1.6"
      />
      <circle cx="60" cy="60" r="35.5" fill="none" stroke={t.ink} strokeOpacity="0.25" strokeWidth="0.5" />

      {/* stamped lettering: highlight copy offset below, ink on top */}
      <g
        className="font-display"
        fontWeight={900}
        textAnchor="middle"
        letterSpacing="-0.02em"
      >
        <text x="60" y={sub ? 60.8 : 68.8} fontSize={markSize} fill={t.glint} opacity="0.75">
          {mark}
        </text>
        <text x="60" y={sub ? 60 : 68} fontSize={markSize} fill={t.ink}>
          {mark}
        </text>
      </g>
      {sub ? (
        <g
          className="font-dm-mono"
          fontWeight={500}
          textAnchor="middle"
          letterSpacing="0.06em"
        >
          <text x="60" y="76.6" fontSize={sub.length > 8 ? 7 : 9} fill={t.glint} opacity="0.7">
            {sub}
          </text>
          <text x="60" y="76" fontSize={sub.length > 8 ? 7 : 9} fill={t.ink} opacity="0.85">
            {sub}
          </text>
        </g>
      ) : null}
      {/* tiny star accents */}
      <g fill={t.ink} opacity="0.5">
        <circle cx="38" cy="60" r="1" />
        <circle cx="82" cy="60" r="1" />
      </g>
    </svg>
  );
}
