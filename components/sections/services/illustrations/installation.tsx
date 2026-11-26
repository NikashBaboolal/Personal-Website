"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { r2, usePlay } from "./use-play";

const MODULE = 4.5;
const T = 14; // seconds for one full turn of the driver gear

/** Spur gear outline centred on 0,0 with N trapezoid teeth. */
function gearPath(teeth: number) {
  const rp = (MODULE * teeth) / 2;
  const ro = rp + MODULE * 0.95;
  const rr = rp - MODULE * 1.15;
  const a = (Math.PI * 2) / teeth;
  const pt = (r: number, t: number) =>
    `${r2(r * Math.cos(t))} ${r2(r * Math.sin(t))}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const t = i * a;
    d += `${i === 0 ? "M" : "L"}${pt(rr, t - a * 0.3)} L${pt(ro, t - a * 0.14)} L${pt(ro, t + a * 0.14)} L${pt(rr, t + a * 0.3)} `;
  }
  return `${d}Z`;
}

type Gear = {
  id: string;
  teeth: number;
  x: number;
  y: number;
  rot0: number;
  turns: number;
  fill: string;
  holes: number;
};

const deg = (r: number) => (r * 180) / Math.PI;
const norm = (v: number) => ((v % 1) + 1) % 1;

/** Places a gear meshing with `driver` at angle phi (radians), solving tooth phase so teeth interlock. */
function meshWith(
  driver: Gear,
  teeth: number,
  phi: number,
  extra: Omit<Gear, "teeth" | "x" | "y" | "rot0" | "turns">,
): Gear {
  const dist = (MODULE * (driver.teeth + teeth)) / 2;
  const aA = 360 / driver.teeth;
  const aB = 360 / teeth;
  const phiDeg = deg(phi);
  const fA = norm((phiDeg - driver.rot0) / aA);
  const rot0 = phiDeg + 180 - aB * norm(0.5 - fA);
  return {
    ...extra,
    teeth,
    x: r2(driver.x + dist * Math.cos(phi)),
    y: r2(driver.y + dist * Math.sin(phi)),
    rot0: r2(rot0),
    turns: -driver.turns * (driver.teeth / teeth),
  };
}

const DRIVER: Gear = {
  id: "a",
  teeth: 16,
  x: 150,
  y: 140,
  rot0: 0,
  turns: 1,
  fill: "#23256b",
  holes: 4,
};
const GEARS: Gear[] = [
  DRIVER,
  meshWith(DRIVER, 10, (-42 * Math.PI) / 180, {
    id: "b",
    fill: "#f7931e",
    holes: 5,
  }),
  meshWith(DRIVER, 12, (148 * Math.PI) / 180, {
    id: "c",
    fill: "#3b3fb6",
    holes: 6,
  }),
];

function GearShape({ gear }: { gear: Gear }) {
  const rp = (MODULE * gear.teeth) / 2;
  const holeR = rp * 0.55;
  return (
    <>
      <path d={gearPath(gear.teeth)} fill={gear.fill} />
      <circle
        r={rp * 0.78}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      {Array.from({ length: gear.holes }, (_, i) => {
        const t = (i / gear.holes) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={r2(holeR * Math.cos(t))}
            cy={r2(holeR * Math.sin(t))}
            r={r2(rp * 0.14)}
            fill="#fff"
            fillOpacity="0.9"
          />
        );
      })}
      <circle r={r2(rp * 0.2)} fill="#fff" />
      <circle r={r2(rp * 0.08)} fill={gear.fill} />
    </>
  );
}

const TICKS = Array.from({ length: 13 }, (_, i) => -120 + i * 20);

export function InstallationIllustration({
  className,
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 400 240"
        className="h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        {/* Gear train */}
        {GEARS.map((g) => (
          <g key={g.id} transform={`translate(${g.x} ${g.y})`}>
            <motion.g
              initial={false}
              animate={
                play
                  ? { rotate: [g.rot0, g.rot0 + 360 * g.turns] }
                  : { rotate: g.rot0 }
              }
              transition={
                play
                  ? { duration: T, repeat: Infinity, ease: "linear" }
                  : { duration: 0 }
              }
            >
              <GearShape gear={g} />
            </motion.g>
          </g>
        ))}

        {/* Pressure gauge */}
        <g transform="translate(318 74)">
          <circle
            r="46"
            fill="#fff"
            stroke="#0b0c1f"
            strokeOpacity="0.1"
            strokeWidth="6"
          />
          <circle r="40" fill="none" stroke="#e4e2dc" strokeWidth="1" />
          <path
            d="M 39.39 -6.95 A 40 40 0 0 1 34.64 20"
            stroke="#e4183c"
            strokeWidth="4"
            strokeOpacity="0.85"
            fill="none"
          />
          {TICKS.map((t, i) => (
            <line
              key={t}
              x1="0"
              y1={i % 2 === 0 ? -31 : -34}
              x2="0"
              y2="-38"
              stroke="#0b0c1f"
              strokeOpacity={i % 2 === 0 ? 0.7 : 0.35}
              strokeWidth={i % 2 === 0 ? 1.4 : 1}
              transform={`rotate(${t})`}
            />
          ))}
          <text
            y="22"
            textAnchor="middle"
            fontSize="7"
            letterSpacing="1.5"
            fill="#6b6b78"
            fontFamily="var(--font-dm-mono), monospace"
          >
            BAR
          </text>
          <motion.g
            initial={false}
            animate={
              play
                ? { rotate: [-120, 46, -26, 10, -14, -2, -6, -6, -120] }
                : { rotate: -6 }
            }
            transition={
              play
                ? {
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.14, 0.24, 0.32, 0.4, 0.47, 0.54, 0.9, 1],
                    ease: "easeInOut",
                  }
                : { duration: 0.6 }
            }
          >
            {/* invisible circle keeps the pivot at the bbox centre */}
            <circle r="34" fill="transparent" />
            <path d="M-2 4 L0 -32 L2 4 Z" fill="#e4183c" />
          </motion.g>
          <circle r="5" fill="#0b0c1f" />
        </g>

        {/* Flange + nut with swinging wrench */}
        <g transform="translate(296 178)">
          <rect
            x="-34"
            y="-14"
            width="68"
            height="28"
            rx="6"
            fill="#ebe9e3"
            stroke="#0b0c1f"
            strokeOpacity="0.08"
          />
          <circle cx="-22" cy="0" r="4" fill="#0b0c1f" fillOpacity="0.25" />
          <circle cx="22" cy="0" r="4" fill="#0b0c1f" fillOpacity="0.25" />
          <motion.g
            initial={false}
            animate={play ? { rotate: [-26, 8, -26] } : { rotate: -12 }}
            transition={
              play
                ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.6 }
            }
          >
            <circle r="86" fill="transparent" />
            <path d="M12 -6 H80 A6 6 0 0 1 80 6 H12 Z" fill="#0b0c1f" />
            <circle r="15" fill="#0b0c1f" />
          </motion.g>
          <path
            d="M8 0 L4 6.93 L-4 6.93 L-8 0 L-4 -6.93 L4 -6.93 Z"
            fill="#ffd200"
            stroke="#0b0c1f"
            strokeWidth="1.2"
          />
        </g>
      </svg>

      {/* Badges */}
      <div className="pointer-events-none absolute top-1 left-1 flex flex-col items-start gap-2">
        <span className="bg-night inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <span className="relative flex size-2">
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-emerald-400" />
            <span className="relative size-2 rounded-full bg-emerald-400" />
          </span>
          24/7 technicians
        </span>
        <span className="border-line text-foreground/80 inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">
          <span className="bg-lamp-red size-1.5 rounded-full" />
          Valve reconditioning
        </span>
      </div>
    </div>
  );
}
