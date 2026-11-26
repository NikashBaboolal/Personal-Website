"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InstrumentBubble, STREAM, Stream, Valve } from "@/components/layout/process-art";
import { usePlay } from "./use-play";

/**
 * Process safety: a P&ID pressure loop on a vessel. The pressure trend climbs, the
 * relief valve (PSV) lifts and vents to flare, then pressure settles. A HAZOP node
 * marker brackets the section under review.
 */
export function ProcessSafetyIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const T = 5;

  return (
    <div ref={ref} className={cn("flex h-full w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="font-dm-mono text-night-muted text-[10px] tracking-[0.2em] uppercase">
          P&amp;ID · Node 3
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
          <span className="size-1.5 rounded-full bg-amber-400" />
          HAZOP: High pressure
        </span>
      </div>
      <svg viewBox="0 0 320 200" className="w-full flex-1" aria-hidden="true">
        {/* HAZOP node boundary */}
        <rect x={70} y={22} width={180} height={150} rx={12} fill="none" stroke={STREAM.amber} strokeOpacity={0.55} strokeDasharray="6 5" />
        <g transform="translate(70 22)">
          <rect x={-1} y={-9} width={46} height={16} rx={8} fill="#1a1205" stroke={STREAM.amber} strokeOpacity={0.7} />
          <text x={22} y={2} textAnchor="middle" fontSize={8} fill={STREAM.amber} className="font-dm-mono">NODE 3</text>
        </g>

        {/* inlet with control valve */}
        <Stream d="M0 130 L120 130" color={STREAM.cyan} active={play} speed={2.2} />
        <Valve x={60} y={130} />
        {/* vessel */}
        <path d="M120 70 Q120 52 150 52 L170 52 Q200 52 200 70 L200 150 Q200 168 170 168 L150 168 Q120 168 120 150 Z" fill="rgba(34,211,238,0.05)" stroke={STREAM.sky} strokeWidth={1.3} />
        <motion.rect
          x={122}
          width={76}
          rx={4}
          fill={STREAM.cyan}
          fillOpacity={0.14}
          initial={false}
          animate={play ? { y: [120, 102, 102, 120], height: [46, 64, 64, 46] } : { y: 112, height: 54 }}
          transition={play ? { duration: T, times: [0, 0.45, 0.7, 1], repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
        <text x={160} y={92} textAnchor="middle" fontSize={8} fill="white" fillOpacity={0.5} className="font-dm-mono">V-301</text>
        {/* outlet */}
        <Stream d="M200 150 L320 150" color={STREAM.blue} active={play} speed={2.6} />

        {/* pressure transmitter + controller */}
        <line x1={200} y1={80} x2={232} y2={80} stroke={STREAM.teal} strokeOpacity={0.7} strokeDasharray="2 2" />
        <InstrumentBubble x={246} y={80} tag="PT-301" r={13} field />
        <InstrumentBubble x={60} y={92} tag="PIC-301" r={13} />
        <line x1={60} y1={105} x2={60} y2={118} stroke={STREAM.teal} strokeOpacity={0.7} strokeDasharray="2 2" />

        {/* relief valve to flare */}
        <line x1={160} y1={52} x2={160} y2={36} stroke={STREAM.amber} strokeWidth={1.3} />
        <g transform="translate(160 28)">
          <path d="M-7 8 L7 8 L0 -4 Z" fill="#1a1205" stroke={STREAM.amber} strokeWidth={1.2} />
          <path d="M0 -4 L0 -10 M-4 -12 L4 -8" stroke={STREAM.amber} strokeWidth={1.1} />
        </g>
        <text x={174} y={30} fontSize={8} fill={STREAM.amber} className="font-dm-mono">PSV-104</text>
        <path d="M167 20 L300 20 L300 4" fill="none" stroke={STREAM.amber} strokeOpacity={0.3} strokeWidth={3} />
        <motion.path
          d="M167 20 L300 20 L300 4"
          fill="none"
          stroke={STREAM.amber}
          strokeWidth={1.5}
          strokeDasharray="5 7"
          initial={false}
          animate={play ? { strokeDashoffset: [24, 0], opacity: [0, 0, 1, 1, 0] } : { strokeDashoffset: 0, opacity: 0.35 }}
          transition={
            play
              ? { strokeDashoffset: { duration: 0.8, repeat: Infinity, ease: "linear" }, opacity: { duration: T, times: [0, 0.4, 0.48, 0.7, 0.8], repeat: Infinity } }
              : { duration: 0 }
          }
        />
        <text x={296} y={34} textAnchor="end" fontSize={7.5} fill="white" fillOpacity={0.45} className="font-dm-mono">TO FLARE</text>

        {/* pressure trend */}
        <g transform="translate(212 108)">
          <rect width={96} height={42} rx={8} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
          <line x1={4} x2={92} y1={10} y2={10} stroke={STREAM.amber} strokeOpacity={0.6} strokeDasharray="3 3" />
          <text x={90} y={8} textAnchor="end" fontSize={6} fill={STREAM.amber} className="font-dm-mono">SET</text>
          <motion.path
            d="M4 32 L22 30 L36 24 L48 14 L54 10 L62 22 L74 28 L92 29"
            fill="none"
            stroke={STREAM.cyan}
            strokeWidth={1.5}
            initial={false}
            animate={play ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
            transition={play ? { duration: T, times: [0, 0.6, 0.9, 1], repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          />
        </g>
      </svg>
    </div>
  );
}
