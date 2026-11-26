"use client";

import { useRef } from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { usePlay } from "./use-play";

const T = 8;

const RINGS = [
  { r: 44, color: "#f7931e", to: 1, s: 0.02 },
  { r: 34, color: "#e4183c", to: 0.82, s: 0.08 },
  { r: 24, color: "#3b3fb6", to: 0.66, s: 0.14 },
];

const STEPS = [
  "Draft SOP",
  "Review with the plant team",
  "Issue work instructions",
  "Audit ready",
];

/** Normalised keyframe timing: off until `s`, on by `s + d`, hold, reset at the end. */
function step(s: number, d = 0.06): Transition {
  return {
    duration: T,
    times: [0, s, s + d, 0.92, 1],
    repeat: Infinity,
    ease: "easeOut",
  };
}

export function TrainingIllustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = usePlay(ref);
  const rest = { duration: 0.5 };

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col justify-center gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {/* Progress rings */}
        <svg
          viewBox="0 0 110 110"
          className="size-24 shrink-0 -rotate-90 sm:size-28"
          aria-hidden="true"
        >
          {RINGS.map((ring) => (
            <g key={ring.r}>
              <circle
                cx="55"
                cy="55"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeOpacity="0.12"
                strokeWidth="7"
              />
              <motion.circle
                cx="55"
                cy="55"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="7"
                strokeLinecap="round"
                initial={false}
                animate={
                  play
                    ? { pathLength: [0, 0, ring.to, ring.to, 0] }
                    : { pathLength: ring.to }
                }
                transition={play ? step(ring.s, 0.3) : rest}
              />
            </g>
          ))}
        </svg>

        {/* Checklist */}
        <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
          {STEPS.map((label, i) => {
            const s = 0.12 + i * 0.09;
            return (
              <li
                key={label}
                className="flex items-center gap-2 text-xs font-medium"
              >
                <span className="border-line relative grid size-4 shrink-0 place-items-center overflow-hidden rounded-[5px] border bg-white">
                  <motion.span
                    className="bg-flame absolute inset-0"
                    initial={false}
                    animate={
                      play ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }
                    }
                    transition={play ? step(s, 0.04) : rest}
                  />
                  <svg
                    viewBox="0 0 16 16"
                    className="relative size-3"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                      fill="none"
                      stroke="#07081a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={
                        play
                          ? { pathLength: [0, 0, 1, 1, 0] }
                          : { pathLength: 1 }
                      }
                      transition={play ? step(s + 0.02, 0.05) : rest}
                    />
                  </svg>
                </span>
                <motion.span
                  className="text-foreground truncate"
                  initial={false}
                  animate={
                    play
                      ? { opacity: [0.45, 0.45, 1, 1, 0.45] }
                      : { opacity: 1 }
                  }
                  transition={play ? step(s, 0.04) : rest}
                >
                  {label}
                </motion.span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Operator certificate */}
      <motion.div
        className="border-line relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white p-3 shadow-[0_8px_24px_rgba(11,12,31,0.08)]"
        initial={false}
        animate={
          play
            ? { opacity: [0.35, 0.35, 1, 1, 0.35], y: [8, 8, 0, 0, 8] }
            : { opacity: 1, y: 0 }
        }
        transition={play ? step(0.5, 0.06) : rest}
      >
        <span className="bg-flame relative grid size-10 shrink-0 place-items-center rounded-full">
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="#07081a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="9" r="5" />
            <path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-dm-mono text-muted-foreground text-[9px] tracking-[0.2em] uppercase">
            Operator certificate
          </p>
          <div className="mt-1.5 flex flex-col gap-1">
            <span className="bg-foreground/15 h-1.5 w-3/4 rounded-full" />
            <span className="bg-foreground/10 h-1.5 w-1/2 rounded-full" />
          </div>
        </div>
        <motion.span
          className="border-lamp-red text-lamp-red font-dm-mono mr-1.5 shrink-0 rounded-md border-2 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          initial={false}
          animate={
            play
              ? {
                  opacity: [0, 0, 1, 1, 0],
                  scale: [1.8, 1.8, 1, 1, 1.8],
                  rotate: [-4, -4, -10, -10, -4],
                }
              : { opacity: 1, scale: 1, rotate: -10 }
          }
          transition={play ? step(0.6, 0.05) : rest}
        >
          Passed
        </motion.span>
      </motion.div>
    </div>
  );
}
