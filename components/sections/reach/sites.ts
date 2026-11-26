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

const BRAND = {
  yellow: { rgb: [1, 0.824, 0] as [number, number, number], css: "#ffd200" },
  orange: { rgb: [0.969, 0.576, 0.118] as [number, number, number], css: "#f7931e" },
  red: { rgb: [0.894, 0.094, 0.235] as [number, number, number], css: "#e4183c" },
};

const tones = [BRAND.yellow, BRAND.orange, BRAND.red];

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
