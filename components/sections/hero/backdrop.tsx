"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useHeroReducedMotion } from "./use-reduced-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Night grid with a radial mask so it glows out from the top-centre. */
export function NightGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-grid-night absolute inset-0 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_75%)]",
        className,
      )}
    />
  );
}

/**
 * The "lamp": a conic cone of flame-coloured light falling from a bright bar
 * at the top edge (a nod to the company name).
 */
export function LampBeam({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute top-0 h-[34rem] w-[46rem]", className)}>
      <motion.div
        className="absolute inset-0 origin-top mask-[linear-gradient(to_bottom,black_0%,black_25%,transparent_90%)]"
        style={{
          backgroundImage:
            "conic-gradient(from 152deg at 50% 0%, transparent 0deg, rgba(228,24,60,0.35) 10deg, rgba(247,147,30,0.55) 22deg, rgba(255,210,0,0.28) 28deg, rgba(247,147,30,0.55) 34deg, rgba(228,24,60,0.35) 46deg, transparent 56deg, transparent 360deg)",
        }}
        initial={{ opacity: 0, scaleX: 0.45 }}
        animate={{ opacity: 0.9, scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
      />
      {/* glow pool under the bar */}
      <motion.div
        className="bg-lamp-orange absolute top-0 left-1/2 h-28 w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
      <motion.div
        className="bg-lamp-yellow absolute top-0 left-1/2 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        initial={{ width: "6rem", opacity: 0 }}
        animate={{ width: "16rem", opacity: 0.7 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
      />
      {/* the filament */}
      <motion.div
        className="via-lamp-yellow absolute top-0 left-1/2 h-px -translate-x-1/2 bg-linear-to-r from-transparent to-transparent"
        initial={{ width: "8rem", opacity: 0 }}
        animate={{ width: "24rem", opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
      />
    </div>
  );
}

/** Loops run only while on screen and motion is allowed (markup never depends on this). */
function useLoopActive<T extends Element>() {
  const ref = useRef<T>(null);
  const reduce = useHeroReducedMotion();
  const inView = useInView(ref, { margin: "80px 0px" });
  return [ref, inView && !reduce] as const;
}

const GRID_CELL = 64;

/**
 * Perspective grid floor receding into the distance, scrolling toward the viewer.
 * The pattern layer is one cell taller than its box and translated by exactly one
 * cell per loop (compositor-only transform, seamless wrap).
 */
export function GridFloor({ className }: { className?: string }) {
  const [ref, active] = useLoopActive<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden perspective-[420px] mask-[linear-gradient(to_bottom,transparent,black_45%,black_80%,transparent)]",
        className,
      )}
    >
      <div
        className="absolute -inset-x-1/2 top-0 h-[220%] origin-top"
        style={{ transform: "rotateX(70deg)" }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 will-change-transform"
          style={{
            top: -GRID_CELL,
            backgroundImage:
              "linear-gradient(to right, rgba(247,147,30,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(247,147,30,0.22) 1px, transparent 1px)",
            backgroundSize: `${GRID_CELL}px ${GRID_CELL}px`,
            backgroundPosition: "center 0px",
          }}
          initial={{ y: 0 }}
          animate={active ? { y: [0, GRID_CELL] } : { y: 0 }}
          transition={
            active ? { duration: 2.6, repeat: Infinity, ease: "linear" } : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}

const BEAMS = [
  { left: "8%", duration: 5.5, delay: 0.6 },
  { left: "27%", duration: 7, delay: 2.4 },
  { left: "62%", duration: 6.2, delay: 1.2 },
  { left: "91%", duration: 4.8, delay: 3.1 },
] as const;

/** Faint vertical rails with light pulses travelling down (SaaS grid-lines vibe). */
export function Beams({ className }: { className?: string }) {
  const [ref, active] = useLoopActive<HTMLDivElement>();
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {BEAMS.map((beam) => (
        <div
          key={beam.left}
          className="absolute inset-y-0 w-px overflow-hidden bg-linear-to-b from-transparent via-white/[0.07] to-transparent"
          style={{ left: beam.left }}
        >
          <motion.div
            className="via-lamp-orange absolute top-0 left-0 h-40 w-px bg-linear-to-b from-transparent to-transparent"
            initial={{ y: "-30vh" }}
            animate={active ? { y: ["-30vh", "120vh"] } : { y: "-30vh" }}
            transition={
              active
                ? {
                    duration: beam.duration,
                    delay: beam.delay,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    ease: "easeIn",
                  }
                : { duration: 0 }
            }
          />
        </div>
      ))}
    </div>
  );
}

/** Dashed gradient hairline (SaaS horizontal-gradient), tinted with brand orange. */
export function DashedRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mask-fade-x h-px w-full bg-[repeating-linear-gradient(90deg,rgba(247,147,30,0.55)_0_8px,transparent_8px_16px)]",
        className,
      )}
    />
  );
}
