"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePlay } from "./use-play";

/** Darker stream tones so the drawing reads on the light card. */
const C = { teal: "#0d9488", cyan: "#0891b2", blue: "#2563eb", amber: "#d97706", ink: "#0b1f33" } as const;

const W = 320;
const H = 190;

/** Yield trend: noisy and low before the improvement, then steps up and steadies. */
const YIELD = [
  [14, 150], [34, 142], [54, 152], [74, 138], [94, 148], [114, 140], [134, 146],
  [154, 120], [174, 104], [194, 96], [214, 92], [234, 90], [254, 88], [274, 87], [300, 86],
] as const;
const yieldPath = YIELD.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

/**
 * Process optimisation: a small PFD (feed -> reactor -> separator) whose product stream
 * feeds a yield trend that steps up after the improvement.
 */
export function ProcessOptimisationIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const flow = (speed: number) =>
    play
      ? { animate: { strokeDashoffset: [24, 0] }, transition: { duration: speed, ease: "linear" as const, repeat: Infinity } }
      : { animate: { strokeDashoffset: 0 }, transition: { duration: 0 } };

  return (
    <div ref={ref} className={cn("flex h-full w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="font-dm-mono text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
          Yield, before / after
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
          <span className="size-1.5 rounded-full bg-teal-500" />
          Variance down
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" aria-hidden="true">
        {/* --- PFD strip (top) --- */}
        <g>
          {/* feed */}
          <path d="M4 36 L54 36" stroke={C.cyan} strokeOpacity={0.2} strokeWidth={4} />
          <motion.path d="M4 36 L54 36" stroke={C.cyan} strokeWidth={1.6} strokeDasharray="5 7" initial={false} {...flow(1.6)} />
          {/* reactor */}
          <rect x={54} y={14} width={44} height={46} rx={10} fill="white" stroke={C.teal} strokeWidth={1.4} />
          <line x1={76} y1={8} x2={76} y2={48} stroke={C.teal} strokeWidth={1.2} />
          <motion.path
            d="M64 46 L88 50 M64 50 L88 46"
            stroke={C.teal}
            strokeWidth={1.8}
            strokeLinecap="round"
            style={{ originX: "76px", originY: "48px" }}
            initial={false}
            animate={play ? { scaleX: [1, -1, 1] } : { scaleX: 1 }}
            transition={play ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          />
          <text x={76} y={74} textAnchor="middle" fontSize={8} fill={C.ink} fillOpacity={0.55} className="font-dm-mono">R-101</text>
          {/* reactor -> separator */}
          <path d="M98 36 L150 36" stroke={C.teal} strokeOpacity={0.2} strokeWidth={4} />
          <motion.path d="M98 36 L150 36" stroke={C.teal} strokeWidth={1.6} strokeDasharray="5 7" initial={false} {...flow(1.4)} />
          {/* control valve */}
          <path d="M118 31 L130 41 L130 31 L118 41 Z" fill="white" stroke={C.cyan} strokeWidth={1.2} />
          {/* separator column */}
          <rect x={150} y={6} width={26} height={62} rx={13} fill="white" stroke={C.blue} strokeWidth={1.4} />
          {[20, 32, 44, 56].map((y, i) => (
            <line key={y} x1={i % 2 ? 156 : 150} x2={i % 2 ? 176 : 170} y1={y} y2={y} stroke={C.blue} strokeOpacity={0.5} />
          ))}
          <text x={163} y={80} textAnchor="middle" fontSize={8} fill={C.ink} fillOpacity={0.55} className="font-dm-mono">T-201</text>
          {/* product -> trend */}
          <path d="M176 22 L230 22 L230 36 L300 36" fill="none" stroke={C.blue} strokeOpacity={0.2} strokeWidth={4} />
          <motion.path d="M176 22 L230 22 L230 36 L300 36" fill="none" stroke={C.blue} strokeWidth={1.6} strokeDasharray="5 7" initial={false} {...flow(1.8)} />
          {/* recycle (amber, hot) */}
          <path d="M163 68 L163 84 L40 84 L40 36" fill="none" stroke={C.amber} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="3 4" />
          <text x={300} y={30} textAnchor="end" fontSize={8} fill={C.blue} className="font-dm-mono">PRODUCT</text>
        </g>

        {/* --- yield trend (bottom) --- */}
        <g>
          <rect x={6} y={96} width={W - 12} height={88} rx={10} fill="#f8fafc" stroke="#e2e8f0" />
          <line x1={144} x2={144} y1={100} y2={180} stroke={C.amber} strokeOpacity={0.6} strokeDasharray="3 3" />
          <text x={148} y={108} fontSize={7.5} fill={C.amber} className="font-dm-mono">CHANGE</text>
          <line x1={14} x2={W - 14} y1={86 + 2} y2={86 + 2} stroke="transparent" />
          <motion.path
            d={yieldPath}
            fill="none"
            stroke={C.teal}
            strokeWidth={2}
            strokeLinejoin="round"
            initial={false}
            animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
            transition={play ? { duration: 6, times: [0, 0.55, 0.92, 1], repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          />
          {YIELD.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.8} fill={x > 144 ? C.teal : "#94a3b8"} />
          ))}
          <text x={18} y={178} fontSize={7.5} fill={C.ink} fillOpacity={0.5} className="font-dm-mono">YIELD %</text>
        </g>
      </svg>
    </div>
  );
}
