import { places } from "@/lib/content";

export type SiteKind = "home" | "place";

export type GlobeSite = {
  id: string;
  label: string;
  sublabel: string;
  kind: SiteKind;
  lat: number;
  lng: number;
  /** RGB 0..1 for cobe. */
  rgb: [number, number, number];
  /** CSS colour for DOM labels. */
  css: string;
};

/** Process-stream palette: teal, cyan, sky. */
const STREAMS = {
  teal: { rgb: [0.176, 0.831, 0.749] as [number, number, number], css: "#2dd4bf" },
  cyan: { rgb: [0.133, 0.827, 0.933] as [number, number, number], css: "#22d3ee" },
  sky: { rgb: [0.22, 0.741, 0.973] as [number, number, number], css: "#38bdf8" },
};

const tones = [STREAMS.teal, STREAMS.cyan, STREAMS.sky];

export const globeSites: GlobeSite[] = places.map((p, i) => ({
  id: p.id,
  label: p.label,
  sublabel: p.detail,
  kind: i === 0 ? "home" : "place",
  lat: p.lat,
  lng: p.lng,
  rgb: tones[i % tones.length].rgb,
  css: tones[i % tones.length].css,
}));

/** Longitude/latitude the globe settles on (between southern Africa and Europe). */
export const HOME = { lat: -5, lng: 20 };
