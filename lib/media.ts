/**
 * Photography manifest. Filled in by the media agent.
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
 * pumps              industrial pump
 * mining             open-pit mine / excavator / haul truck
 * sparks             welding / grinding sparks
 * instrumentation    gauges, control panel, sensors
 * power-lines        transmission towers / substation
 * factory            factory floor / automation
 * pipes              pipeline / pipe rack
 * gears              gears / gearbox / power transmission
 * compressor         industrial compressor
 * transformer        electrical transformer / substation
 * engineers          engineers / technicians at work (no identifiable faces required)
 * port               Richards Bay style port / bulk terminal / cranes
 */
export type MediaKey =
  | "hero-refinery"
  | "valves"
  | "pumps"
  | "mining"
  | "sparks"
  | "instrumentation"
  | "power-lines"
  | "factory"
  | "pipes"
  | "gears"
  | "compressor"
  | "transformer"
  | "engineers"
  | "port";

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
  "pumps": {
    src: "/images/pumps.webp",
    width: 1600,
    height: 1067,
    alt: "Pair of blue electric-motor-driven centrifugal pumps connected to process pipework",
    credit: "Photo by Jahhid Fitrah Alamsyah on Unsplash (https://unsplash.com/photos/a-bunch-of-pipes-that-are-connected-to-each-other-2Z7K3Oxig98)",
    blurDataURL:
      "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQAgCdASoQAAsAAsBMJbACdAYs3THYh3+PlgAA/uH1Bd1Y600gBH77EVEYVK2JNbiPE/oL80bOUzod96fJCq1+4xP7eTR4YQNBNrP85MUrTH+gnuWbUdNPqzmLq+gNPEYc1/lAtLUKbEtk4SAAAA==",
  },
  "mining": {
    src: "/images/mining.webp",
    width: 1600,
    height: 1067,
    alt: "Articulated haul trucks working on a benched open-pit mine face in warm evening light",
    credit: "Photo by MiningWatch Portugal on Unsplash (https://unsplash.com/photos/a-large-truck-driving-down-a-dirt-road-YG0qc-e6hgg)",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAQCdASoQAAsAAsBMJQBOgB8nkLSa7gAA/uxQlc7eiY1Q3T46PaDCP1+rwTvTSPllXG2G7AB2lr+pZhr4R/7VwAWCfyUG7QeuTBDI0AmHUnD0EIMtuaEAAAA=",
  },
  "sparks": {
    src: "/images/sparks.webp",
    width: 1600,
    height: 1067,
    alt: "Gloved hands cutting steel box sections with an oxy-fuel torch, showering bright orange sparks",
    credit: "Photo by Cemrecan Yurtman on Unsplash (https://unsplash.com/photos/welder-working-on-a-piece-of-metal-in-a-factory-enPxH6uqABg)",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABQAgCdASoQAAsAAsBMJZACdH8AGZMJlFyq6NAA/vkcUDawRp8aWniPX63PI5c6AOh2VkJrefBR7NbYdR9vIVZJIgVRGIbwXqEJPaUx0M+zQ6Nnglvf4F47AAA=",
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
  "power-lines": {
    src: "/images/power-lines.webp",
    width: 1600,
    height: 1067,
    alt: "High-voltage transmission towers and power lines silhouetted against a blue and orange sunset",
    credit: "Photo by Matthew Henry on Unsplash (https://unsplash.com/photos/photo-of-truss-towers-yETqkLnhsUI)",
    blurDataURL:
      "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAsAAsBMJZgCdH8AGAccIqAA/uk2Q1aVPGZDMCs7y7fD+05INQdQ+su5WwH5dWq5G4s0cBVgi9VA4oUsqDI0AAA=",
  },
  "factory": {
    src: "/images/factory.webp",
    width: 1600,
    height: 1063,
    alt: "Interior of a heavy-industry plant with steel gantries, overhead cranes and hooks in warm hazy light",
    credit: "Photo by Ant Rozetsky on Unsplash (https://unsplash.com/photos/interior-of-large-industrial-factory-SLIFI67jv5k)",
    blurDataURL:
      "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQAAsAAsBMJYwCdADvfNP8Y5+AAP73g5OdpM/opSzFQdN5kTsSbv4Yd6ScHCj2pubpkwM5WgrjwIi0OG61FRg8t8vRjnLkBCoAAA==",
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
  "gears": {
    src: "/images/gears.webp",
    width: 1600,
    height: 1048,
    alt: "Close-up of heavy industrial spur and bevel gears on drive shafts in a weathered gearbox",
    credit: "Photo by stephan de MARANTHI on Unsplash (https://unsplash.com/photos/close-up-of-rusty-industrial-gears-and-machinery-P1nKpHG21j4)",
    blurDataURL:
      "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQAgCdASoQAAsAAsBMJaACdADwTb5jBiyAAP7zEQ6hBDyHTRXFPom2sODjs3uUCHgIgXA14H7Wb9TSxR0RLk5mKBSsF1Cd7OwbW/dPQV667W+IVaLiBALsotvnvYXvLK96cMtknBMAAA==",
  },
  "compressor": {
    src: "/images/compressor.webp",
    width: 1600,
    height: 900,
    alt: "Air compressor cylinder head with pressure gauge and brass fittings in a plant room",
    credit: "Photo by iSawRed on Unsplash (https://unsplash.com/photos/a-close-up-of-a-machine-u6HSiTBH6fU)",
    blurDataURL:
      "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQAAkAAsBMJZQCdAYvDa18M7QAAP36UdJ4O+HFDmh5PbDSp2OJYOFXtp0UOoH9MDj32pln1LXjlc1t4fAqnO7kL0Ffz8eHqhfZvhOtEf1V7P2UXyNLwAAA",
  },
  "transformer": {
    src: "/images/transformer.webp",
    width: 1600,
    height: 1200,
    alt: "Large power transformer with bushings and control cabinets in an electrical substation",
    credit: "Photo by American Public Power Association on Unsplash (https://unsplash.com/photos/white-electric-power-generator-VuR4oHZ3ucc)",
    blurDataURL:
      "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABQAgCdASoQAAwAAsBMJbACdAE2R7grQR00JaAAyrBj6bQYtsKhY7tNUT39zjBB2JESJEfmU6qd3xidaVS9RtBEkNesNA2J81uyuFp/j0NWhXtmvp20pSxgAAA=",
  },
  "engineers": {
    src: "/images/engineers.webp",
    width: 1600,
    height: 1067,
    alt: "Worker in a yellow hard hat seen from behind against warm out-of-focus site lights",
    credit: "Photo by Jon Tyson on Unsplash (https://unsplash.com/photos/person-in-yellow-hard-hat-and-brown-jacket-kR4K8nJ9JRc)",
    blurDataURL:
      "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQAgCdASoQAAsAAsBMJbACdAYsjqeYPX4AAP7mzsm84jfts/4dJLOR+ad4Q8oSYQzqzhvvSjwNjTT/DOIu5jO0Zt3VaIZl3VtJFRe6k6H58vo0g9JheOgbKSTt751AgreYDkc02BgAAA==",
  },
  "port": {
    src: "/images/port.webp",
    width: 1600,
    height: 1068,
    alt: "Port gantry cranes silhouetted against an orange sunset over the harbour water",
    credit: "Photo by Werner Hilversum on Unsplash (https://unsplash.com/photos/a-group-of-cranes-sitting-on-top-of-a-body-of-water-vFLJEhS_y5w)",
    blurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAAAQAgCdASoQAAsAAsBMJbACdFQAAqCUs/MMAP4JD8UkXLtGc0ogG0QtU7iQ5Vw2c4SCZiE0v2bj+va/aP/rXyC7pKsjwjc7iMXq2aLmm43c//iOyod313+GIuPypn973Zh1tHkAUpKMC/i1Mi9ws//xAbyUJUwAAAA=",
  },
};

/** Returns the image for a key, or undefined so callers can render a graphic fallback. */
export function getMedia(key: MediaKey): MediaImage | undefined {
  return media[key];
}
