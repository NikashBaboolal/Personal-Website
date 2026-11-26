"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/** Deterministic beam layout (no Math.random → no hydration mismatch). */
const BEAMS = [
  { left: 6, duration: 5.2, delay: 0.4, color: "#ffd200" },
  { left: 17, duration: 6.8, delay: 2.1, color: "#f7931e" },
  { left: 29, duration: 4.6, delay: 1.2, color: "#e4183c" },
  { left: 41, duration: 7.4, delay: 3.4, color: "#3b3fb6" },
  { left: 59, duration: 5.8, delay: 0.9, color: "#ffd200" },
  { left: 71, duration: 6.2, delay: 2.8, color: "#e4183c" },
  { left: 83, duration: 4.9, delay: 1.7, color: "#f7931e" },
  { left: 94, duration: 7.1, delay: 0.2, color: "#3b3fb6" },
] as const;

/**
 * Night background: grid, travelling vertical beams, a horizontal sweep and a
 * flame aurora "horizon". Animations only run while in view; static when the
 * user prefers reduced motion.
 */
export function CtaBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const reduce = useReducedMotion();
  const animate = inView && !reduce;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div className="bg-grid-night absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />

      {/* beams */}
      {BEAMS.map((beam) => (
        <div
          key={beam.left}
          className="absolute inset-y-0 w-px bg-white/[0.06]"
          style={{ left: `${beam.left}%` }}
        >
          <motion.div
            className="absolute left-0 h-40 w-px md:h-56"
            style={{
              top: 0,
              background: `linear-gradient(to bottom, transparent, ${beam.color}, transparent)`,
              boxShadow: `0 0 12px 1px ${beam.color}66`,
            }}
            initial={{ y: "-100%", opacity: 0 }}
            animate={
              animate
                ? { y: ["-100%", "900%"], opacity: [0, 1, 1, 0] }
                : { y: "-100%", opacity: 0 }
            }
            transition={
              animate
                ? {
                    duration: beam.duration,
                    delay: beam.delay,
                    repeat: Infinity,
                    repeatDelay: beam.delay + 1.5,
                    ease: "linear",
                  }
                : { duration: 0 }
            }
          />
        </div>
      ))}

      {/* horizontal sweep along the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10">
        <motion.div
          className="absolute top-0 h-px w-1/3"
          style={{
            background: "linear-gradient(90deg, transparent, #ffd200, #e4183c, transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={animate ? { x: ["-100%", "300%"] } : { x: "-100%" }}
          transition={
            animate ? { duration: 4.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" } : { duration: 0 }
          }
        />
      </div>

      {/* aurora blobs */}
      <div
        className={
          "bg-lamp-yellow/30 absolute -top-24 left-[8%] size-[22rem] rounded-full blur-[110px] md:size-[30rem] " +
          (reduce ? "" : "animate-float-slow")
        }
      />
      <div
        className={
          "bg-lamp-blue/40 absolute top-1/4 right-[2%] size-[24rem] rounded-full blur-[120px] md:size-[34rem] " +
          (reduce ? "" : "animate-float-slow [animation-delay:-4s]")
        }
      />

      {/* flame horizon */}
      <motion.div
        className="absolute -bottom-[45%] left-1/2 aspect-square w-[160%] rounded-full md:w-[110%]"
        style={{
          x: "-50%",
          background:
            "radial-gradient(closest-side, rgba(247,147,30,0.55), rgba(228,24,60,0.35) 45%, rgba(59,63,182,0.25) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={animate ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] } : { opacity: 0.75, scale: 1 }}
        transition={animate ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      />
    </div>
  );
}
