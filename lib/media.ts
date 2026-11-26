/**
 * Photography manifest (process-plant photos only).
 * Every entry must point at a real file under /public/images with its license/credit.
 */
export type MediaImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  /** Low-quality placeholder (data URL) for next/image blur. */
  blurDataURL?: string;
};

/**
 * Agreed keys. Sections reference these; the media agent supplies as many as it can.
 * hero-refinery      night refinery / industrial plant with lights (wide)
 * valves             industrial valves / pipework close-up
 * instrumentation    gauges, control panel, sensors
 * pipes              pipeline / pipe rack
 */
export type MediaKey =
  | "hero-refinery"
  | "valves"
  | "instrumentation"
  | "pipes";

export const media: Partial<Record<MediaKey, MediaImage>> = {
  "hero-refinery": {
    src: "/images/hero-refinery.webp",
    width: 2400,
    height: 1602,
    alt: "Oil refinery at dusk with red-and-white striped chimneys and process units lit against a deep blue sky",
    credit: "Photo by Maksym Kaharlytskyi on Unsplash (https://unsplash.com/photos/red-and-white-tower-under-blue-sky-during-night-time-u13zBF4r56A)",
    blurDataURL:
      "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAsAAsBMJagCdAEO+1VVIAAA/vDZfuM49HShHO2wzNFMW0r+AKxmNmPw/XWonml/s48mKAAAAA==",
  },
  "valves": {
    src: "/images/valves.webp",
    width: 1600,
    height: 900,
    alt: "Row of cast-iron handwheel valves on blue process piping in an industrial plant",
    credit: "Photo by Frantisek Duris on Unsplash (https://unsplash.com/photos/a-bunch-of-pipes-that-are-connected-to-each-other-ge_SnLxU3sw)",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAkAAsBMJagCdADi6fuNgAD+wblsEU0SWWaPhhnNM3JeDXqFH9GWVuzp2uP/R33gK0krvQ4wEfH04yCWlyZNw2bqIU9x2p+g/X49guNDypyDAAA=",
  },
  "instrumentation": {
    src: "/images/instrumentation.webp",
    width: 1600,
    height: 1067,
    alt: "Power station control room with rows of analogue meters, gauges and switchgear controls",
    credit: "Photo by Frantisek Duris on Unsplash (https://unsplash.com/photos/a-large-control-room-with-lots-of-control-knobs-C3DfIgig1j8)",
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAsAAsBMJQBOgCLur0Gq14AA/fz7a8Hm+BksW7cAYX9H87+gaGKFMQ/JVlb7Nfb24KgiACq0oejfM87CjQCnAwDqw8BfMMxYAA==",
  },
  "pipes": {
    src: "/images/pipes.webp",
    width: 1600,
    height: 1048,
    alt: "Dimly lit plant room with insulated steel pipes, flanged bends and valves overhead",
    credit: "Photo by iSawRed on Unsplash (https://unsplash.com/photos/a-close-up-of-a-machine-pCZsRKT-_Ns)",
    blurDataURL:
      "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAsAAsBMJaQAAjwmVadkwAD++RgewO2gW841TY6f9pxK799/5FXRYoC2JIxBBImpLPbDhu6N+NQBePi9DKDlRK6kK7gkuEBqNAAA",
  },
};

/** Returns the image for a key, or undefined so callers can render a graphic fallback. */
export function getMedia(key: MediaKey): MediaImage | undefined {
  return media[key];
}
