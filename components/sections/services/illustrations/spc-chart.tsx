"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { r2, seeded, usePlay } from "./use-play";

const W = 320;
const H = 150;
const N = 28;
const MEAN = H / 2;
const UCL = 30;
const LCL = H - 30;

/** Deterministic in-control process data with one excursion that gets corrected. */
const points = (() => {
  const rnd = seeded(7);
  return Array.from({ length: N }, (_, i) => {
    let y = MEAN + (rnd() - 0.5) * 46;
    if (i === 17) y = UCL - 8; // out-of-control point
    if (i > 17) y = MEAN + (rnd() - 0.5) * 22; // tighter after corrective action
    return { x: r2(12 + (i * (W - 24)) / (N - 1)), y: r2(y) };
  });
})();

const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

/** Statistical process control chart: data line draws in, the excursion pings, variance tightens. */
export function SpcChartIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const T = 7;

  return (
    <div ref={ref} className={cn("flex h-full w-full flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <span className="font-dm-mono text-night-muted text-[10px] tracking-[0.2em] uppercase">
          X-bar control chart
        </span>
        <span className="bg-teal-400/10 text-teal-300 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold">
          <span className="bg-teal-400 size-1.5 rounded-full" />
          In control
        </span>
      </div>
      <div className="relative flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="size-full" preserveAspectRatio="none" aria-hidden="true">
          {[UCL, LCL].map((y) => (
            <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#f5a524" strokeOpacity="0.6" strokeDasharray="5 5" />
          ))}
          <line x1="0" x2={W} y1={MEAN} y2={MEAN} stroke="rgba(255,255,255,0.25)" />
          <text x={W - 4} y={UCL - 5} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.5)" className="font-dm-mono">
            UCL
          </text>
          <text x={W - 4} y={LCL + 12} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.5)" className="font-dm-mono">
            LCL
          </text>
          <motion.path
            d={path}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={false}
            animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
            transition={play ? { duration: T, times: [0, 0.55, 0.92, 1], repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
          />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === 17 ? 4 : 2.2} fill={i === 17 ? "#f5a524" : "#2dd4bf"} opacity={0.9} />
          ))}
          {play ? (
            <motion.circle
              cx={points[17].x}
              cy={points[17].y}
              fill="none"
              stroke="#f5a524"
              strokeWidth="1.5"
              initial={{ r: 4, opacity: 0 }}
              animate={{ r: [4, 4, 16], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}
