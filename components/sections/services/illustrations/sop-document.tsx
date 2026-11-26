"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePlay } from "./use-play";

const C = { teal: "#0d9488", cyan: "#0891b2", blue: "#2563eb", ink: "#0b1f33" } as const;

/** Generic SOP steps (illustrative labels, not claims). */
const STEPS = ["Isolate & lock out", "Verify zero energy", "Line up valves", "Start-up checks"] as const;

/**
 * SOPs & technical documentation: a P&ID sheet behind an SOP checklist whose steps tick
 * off in sequence, then reset.
 */
export function SopDocumentIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const T = 6;

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      {/* P&ID sheet (behind) */}
      <div className="absolute top-2 right-1 h-[82%] w-[58%] rotate-3 rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        <svg viewBox="0 0 160 130" className="size-full" aria-hidden="true">
          <rect x={2} y={2} width={156} height={126} fill="none" stroke={C.ink} strokeOpacity={0.15} />
          <path d="M10 70 L60 70" stroke={C.cyan} strokeWidth={1.2} />
          <path d="M28 65 L38 75 L38 65 L28 75 Z" fill="white" stroke={C.cyan} />
          <rect x={60} y={40} width={30} height={60} rx={15} fill="white" stroke={C.blue} strokeWidth={1.2} />
          {[55, 70, 85].map((y) => (
            <line key={y} x1={60} x2={84} y1={y} y2={y} stroke={C.blue} strokeOpacity={0.5} />
          ))}
          <path d="M90 50 L130 50 M90 90 L150 90" stroke={C.teal} strokeWidth={1.2} />
          <circle cx={120} cy={30} r={9} fill="white" stroke={C.teal} />
          <line x1={111} y1={30} x2={129} y2={30} stroke={C.teal} strokeOpacity={0.6} />
          <text x={120} y={28} textAnchor="middle" fontSize={5} fill={C.ink} className="font-dm-mono">LIC</text>
          <text x={120} y={36} textAnchor="middle" fontSize={5} fill={C.teal} className="font-dm-mono">201</text>
          <rect x={96} y={108} width={60} height={18} fill="white" stroke={C.ink} strokeOpacity={0.2} />
          <text x={100} y={119} fontSize={5} fill={C.ink} fillOpacity={0.6} className="font-dm-mono">P&amp;ID-201 REV C</text>
        </svg>
      </div>

      {/* SOP card (front) */}
      <div className="absolute bottom-1 left-1 w-[66%] -rotate-2 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-dm-mono text-[9px] tracking-[0.18em] text-teal-700 uppercase">SOP-014</span>
          <span className="font-dm-mono text-[8px] text-slate-400">Rev 3</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {STEPS.map((step, i) => {
            const at = 0.1 + i * 0.16;
            return (
              <li key={step} className="flex items-center gap-2">
                <span className="relative grid size-3.5 shrink-0 place-items-center rounded-[4px] border border-slate-300">
                  <motion.svg
                    viewBox="0 0 12 12"
                    className="absolute inset-0 size-full"
                    initial={false}
                    animate={play ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
                    transition={play ? { duration: T, times: [0, at, at + 0.05, 0.92, 1], repeat: Infinity } : { duration: 0 }}
                  >
                    <rect width={12} height={12} rx={3} fill={C.teal} />
                    <path d="M3 6.2 L5.2 8.3 L9 3.8" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </span>
                <span className="text-[10px] leading-tight text-slate-600">{step}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-1.5">
          <span className="size-1.5 rounded-full bg-teal-500" />
          <span className="font-dm-mono text-[8px] tracking-wider text-slate-500 uppercase">Audit ready</span>
        </div>
      </div>
    </div>
  );
}
