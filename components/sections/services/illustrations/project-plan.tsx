"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePlay } from "./use-play";

/** Generic project phases (illustrative, not a claim). Start/length in 12ths of the track. */
const ROWS = [
  { label: "Plan", start: 0, len: 3, color: "#2dd4bf" },
  { label: "Trial", start: 2, len: 5, color: "#22d3ee" },
  { label: "Measure", start: 5, len: 4, color: "#38bdf8" },
  { label: "Handover", start: 8, len: 4, color: "#3b82f6" },
] as const;

const pct = (n: number) => `${(n / 12) * 100}%`;

/** Gantt-style project plan; bars grow in sequence, then reset. */
export function ProjectPlanIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const T = 6;

  return (
    <div ref={ref} className={cn("flex h-full w-full flex-col justify-center", className)}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-dm-mono text-night-muted text-[10px] tracking-[0.2em] uppercase">
            Project plan
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
            <span className="size-1.5 rounded-full bg-teal-400" />
            On track
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {ROWS.map((row, i) => {
            const s = 0.05 + i * 0.14;
            return (
              <li key={row.label} className="flex items-center gap-2">
                <span className="font-dm-mono w-16 shrink-0 text-[9px] tracking-wider text-white/55 uppercase">
                  {row.label}
                </span>
                <div className="relative h-6 flex-1 rounded-[6px] border border-white/[0.06] bg-white/[0.03]">
                  <motion.span
                    className="absolute inset-y-1 rounded-[4px]"
                    style={{ left: pct(row.start), background: row.color }}
                    initial={false}
                    animate={
                      play
                        ? { width: ["0%", "0%", pct(row.len), pct(row.len), "0%"] }
                        : { width: pct(row.len) }
                    }
                    transition={
                      play
                        ? { duration: T, times: [0, s, s + 0.14, 0.92, 1], repeat: Infinity, ease: "easeOut" }
                        : { duration: 0.5 }
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
