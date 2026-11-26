"use client";

import { useRef } from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { usePlay, useSvgId } from "./use-play";

const T = 8; // loop length (s)
const STROKE = "#c9ccff";

type Stroke = {
  d: string;
  s: number;
  dur: number;
  width?: number;
  color?: string;
};

/** Valve / flange cross-section, drawn in order. `s` = normalised start time. */
const STROKES: Stroke[] = [
  { d: "M60 60 H84 V180 H60 Z", s: 0.04, dur: 0.08 },
  { d: "M316 60 H340 V180 H316 Z", s: 0.1, dur: 0.08 },
  { d: "M84 96 H149.5 M250.5 96 H316", s: 0.16, dur: 0.06 },
  { d: "M84 144 H149.5 M250.5 144 H316", s: 0.18, dur: 0.06 },
  {
    d: "M144 120 A56 56 0 1 0 256 120 A56 56 0 1 0 144 120",
    s: 0.22,
    dur: 0.12,
  },
  {
    d: "M170 120 A30 30 0 1 0 230 120 A30 30 0 1 0 170 120",
    s: 0.32,
    dur: 0.07,
  },
  { d: "M171.7 110 H228.3 M171.7 130 H228.3", s: 0.37, dur: 0.05 },
  {
    d: "M192 64.6 V38 M208 64.6 V38 M168 30 H232 V38 H168 Z",
    s: 0.41,
    dur: 0.06,
  },
  {
    d: "M60 206 H340 M60 200 V212 M340 200 V212",
    s: 0.48,
    dur: 0.07,
    color: "#f7931e",
    width: 1.2,
  },
  {
    d: "M364 60 V180 M358 60 H370 M358 180 H370",
    s: 0.53,
    dur: 0.06,
    color: "#f7931e",
    width: 1.2,
  },
];

const BOLTS = [
  [72, 72],
  [72, 168],
  [328, 72],
  [328, 168],
] as const;

const CURSOR = {
  x: [30, 60, 84, 316, 340, 150, 200, 200, 200, 60, 340, 364, 364, 30],
  y: [40, 60, 180, 60, 180, 96, 64, 90, 34, 206, 206, 60, 180, 40],
  times: [
    0, 0.04, 0.1, 0.13, 0.18, 0.2, 0.26, 0.33, 0.44, 0.49, 0.55, 0.57, 0.6, 1,
  ],
};

const BLUEPRINT: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ].join(","),
  backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
  backgroundPosition: "center",
  maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
};

function drawTransition(s: number, dur: number): Transition {
  return {
    duration: T,
    times: [0, s, s + dur, 1],
    repeat: Infinity,
    ease: "easeInOut",
  };
}

function fadeTransition(s: number): Transition {
  return {
    duration: T,
    times: [0, s, s + 0.04, 1],
    repeat: Infinity,
    ease: "easeOut",
  };
}

export function DesignEngineeringIllustration({
  className,
}: {
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const { play, reduce } = usePlay(ref);
  const hatch = useSvgId("bp-hatch");
  const glow = useSvgId("bp-glow");

  const still = !play;
  const startHidden = !reduce;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div aria-hidden="true" className="absolute inset-0" style={BLUEPRINT} />
      <svg
        ref={ref}
        viewBox="0 0 400 240"
        className="relative h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={hatch}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path d="M0 0 V6" stroke="#5b60e0" strokeWidth="1.4" />
          </pattern>
          <radialGradient id={glow} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#3b3fb6" stopOpacity="0.45" />
            <stop offset="1" stopColor="#3b3fb6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="200" cy="120" rx="170" ry="110" fill={`url(#${glow})`} />

        {/* Title block */}
        <text
          x="20"
          y="24"
          fill="rgba(255,255,255,0.55)"
          fontSize="9"
          letterSpacing="2"
          fontFamily="var(--font-dm-mono), monospace"
        >
          SECTION A–A
        </text>
        <text
          x="380"
          y="24"
          textAnchor="end"
          fill="rgba(255,255,255,0.35)"
          fontSize="8"
          letterSpacing="1.5"
          fontFamily="var(--font-dm-mono), monospace"
        >
          SCALE 1:5
        </text>

        <motion.g
          initial={startHidden ? { opacity: 0 } : false}
          animate={still ? { opacity: 1 } : { opacity: [0, 1, 1, 0, 0] }}
          transition={
            still
              ? { duration: 0.6 }
              : {
                  duration: T,
                  times: [0, 0.02, 0.86, 0.95, 1],
                  repeat: Infinity,
                }
          }
        >
          {/* Centre line */}
          <motion.path
            d="M36 120 H344"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.8"
            strokeDasharray="10 4 2 4"
            initial={startHidden ? { opacity: 0 } : false}
            animate={still ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
            transition={still ? { duration: 0.4 } : fadeTransition(0.02)}
          />

          {/* Section hatching on flanges */}
          <motion.g
            initial={startHidden ? { opacity: 0 } : false}
            animate={still ? { opacity: 0.8 } : { opacity: [0, 0, 0.8, 0.8] }}
            transition={still ? { duration: 0.4 } : fadeTransition(0.45)}
          >
            <rect
              x="60"
              y="60"
              width="24"
              height="36"
              fill={`url(#${hatch})`}
            />
            <rect
              x="60"
              y="144"
              width="24"
              height="36"
              fill={`url(#${hatch})`}
            />
            <rect
              x="316"
              y="60"
              width="24"
              height="36"
              fill={`url(#${hatch})`}
            />
            <rect
              x="316"
              y="144"
              width="24"
              height="36"
              fill={`url(#${hatch})`}
            />
          </motion.g>

          {STROKES.map((st) => (
            <motion.path
              key={st.d}
              d={st.d}
              stroke={st.color ?? STROKE}
              strokeWidth={st.width ?? 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={startHidden ? { pathLength: 0 } : false}
              animate={still ? { pathLength: 1 } : { pathLength: [0, 0, 1, 1] }}
              transition={
                still ? { duration: 0.8 } : drawTransition(st.s, st.dur)
              }
            />
          ))}

          {/* Bolt holes */}
          {BOLTS.map(([cx, cy], i) => (
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="4"
              stroke={STROKE}
              strokeWidth="1.2"
              fill="#07081a"
              initial={startHidden ? { opacity: 0, scale: 0 } : false}
              animate={
                still
                  ? { opacity: 1, scale: 1 }
                  : { opacity: [0, 0, 1, 1], scale: [0, 0, 1, 1] }
              }
              transition={
                still ? { duration: 0.4 } : fadeTransition(0.14 + i * 0.01)
              }
            />
          ))}

          {/* Dimension labels */}
          <motion.g
            initial={startHidden ? { opacity: 0 } : false}
            animate={still ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
            transition={still ? { duration: 0.4 } : fadeTransition(0.58)}
            fontFamily="var(--font-dm-mono), monospace"
            fontSize="9"
            fill="#ffb15c"
          >
            <rect
              x="176"
              y="199"
              width="48"
              height="14"
              rx="3"
              fill="#07081a"
            />
            <text x="200" y="209" textAnchor="middle" letterSpacing="1">
              L 280
            </text>
            <text
              x="384"
              y="124"
              textAnchor="middle"
              letterSpacing="1"
              transform="rotate(90 384 120)"
            >
              DN 150
            </text>
          </motion.g>
        </motion.g>

        {/* Moving CAD cursor */}
        <motion.g
          initial={false}
          animate={
            still
              ? { x: 364, y: 180, opacity: reduce ? 0 : 1 }
              : { x: CURSOR.x, y: CURSOR.y, opacity: 1 }
          }
          transition={
            still
              ? { duration: 0.6 }
              : {
                  duration: T,
                  times: CURSOR.times,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <circle r="7" stroke="#ffd200" strokeWidth="1" strokeOpacity="0.6" />
          <path
            d="M-12 0 H-4 M4 0 H12 M0 -12 V-4 M0 4 V12"
            stroke="#ffd200"
            strokeWidth="1.2"
          />
          <circle r="1.6" fill="#ffd200" />
        </motion.g>
      </svg>
    </div>
  );
}
