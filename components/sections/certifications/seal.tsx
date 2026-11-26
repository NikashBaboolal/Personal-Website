"use client";

import { useId } from "react";

export type SealTone = "steel" | "brass";

const TONES: Record<
  SealTone,
  { hi: string; mid: string; lo: string; ink: string; glint: string }
> = {
  // cool stainless (sky/blue streams)
  steel: { hi: "#eef8ff", mid: "#9fd3f5", lo: "#1d4f7a", ink: "#0b2540", glint: "#ffffff" },
  // teal-glazed (teal/cyan streams)
  brass: { hi: "#e6fffb", mid: "#5eead4", lo: "#0f5f58", ink: "#04312d", glint: "#f0fffd" },
};

/** Hexagon outline (pointy top), like a benzene ring. Deterministic. */
function hexPath(r: number, cx = 60, cy = 60) {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  return `${d}Z`;
}
const HEX_OUTER = hexPath(57);
const HEX_GROOVE = hexPath(50);
const HEX_FACE = hexPath(47);

/** Bond stubs off each vertex, as in a substituted ring. */
const BONDS = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i - Math.PI / 2;
  const p = (r: number) => [(60 + r * Math.cos(a)).toFixed(2), (60 + r * Math.sin(a)).toFixed(2)];
  const [x1, y1] = p(50);
  const [x2, y2] = p(55);
  return { x1, y1, x2, y2 };
});

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

/** Hexagonal (benzene-ring) certification seal with an embossed face (SVG). Purely decorative. */
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
      {/* hexagonal rim */}
      <path d={HEX_OUTER} fill={`url(#${id}-rim)`} strokeLinejoin="round" />
      <path d={HEX_OUTER} fill="none" stroke={t.lo} strokeOpacity="0.5" strokeWidth="0.6" strokeLinejoin="round" />
      {/* embossed bevel: dark groove + light lip */}
      <path d={HEX_GROOVE} fill="none" stroke={t.lo} strokeWidth="2.2" opacity="0.75" strokeLinejoin="round" />
      {/* pressed face */}
      <path d={HEX_FACE} fill={`url(#${id}-face)`} />
      <path d={HEX_FACE} fill={`url(#${id}-shine)`} />
      {/* bond stubs */}
      <g stroke={t.ink} strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round">
        {BONDS.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} />
        ))}
      </g>
      {/* aromatic ring */}
      <circle cx="60" cy="60" r="34" fill="none" stroke={t.ink} strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="1 1.8" />

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
