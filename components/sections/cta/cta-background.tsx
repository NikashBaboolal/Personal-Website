"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { MoleculeLattice, STREAM, Stream } from "@/components/layout/process-art";

/** Pipe runs across the band: right-angle routes like a plant piping layout. */
const PIPES = [
  { d: "M-20 70 L260 70 L260 150 L540 150 L540 60 L1220 60", color: STREAM.cyan, speed: 3.2 },
  { d: "M-20 300 L180 300 L180 220 L700 220 L700 320 L1220 320", color: STREAM.teal, speed: 3.8 },
  { d: "M-20 420 L420 420 L420 360 L900 360 L900 440 L1220 440", color: STREAM.sky, speed: 4.4 },
  { d: "M980 -20 L980 140 L1220 140", color: STREAM.amber, speed: 3, reverse: true },
] as const;

/**
 * Night background for the CTA band: a benzene lattice, plant pipe runs with fluid
 * flowing through them, and a soft teal "horizon" glow. Loops only run while in view
 * and are static when the user prefers reduced motion.
 */
export function CtaBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const reduce = useReducedMotion();
  const active = inView && !reduce;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]">
        <MoleculeLattice opacity={0.1} />
      </div>

      <svg
        viewBox="0 0 1200 480"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full opacity-60 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,transparent_20%,black_70%)]"
      >
        {PIPES.map((p) => (
          <Stream
            key={p.d}
            d={p.d}
            color={p.color}
            active={active}
            speed={p.speed}
            reverse={"reverse" in p ? p.reverse : false}
            opacity={0.8}
          />
        ))}
        {/* flanges at the elbows */}
        {[
          [260, 70],
          [540, 150],
          [180, 220],
          [700, 320],
          [420, 360],
          [900, 440],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="#06101e" stroke={STREAM.teal} strokeOpacity={0.7} />
        ))}
      </svg>

      {/* soft glows */}
      <div
        className={
          "absolute -top-24 left-[8%] size-[22rem] rounded-full bg-teal-400/20 blur-[110px] md:size-[30rem] " +
          (reduce ? "" : "animate-float-slow")
        }
      />
      <div
        className={
          "absolute top-1/4 right-[2%] size-[24rem] rounded-full bg-blue-500/25 blur-[120px] md:size-[34rem] " +
          (reduce ? "" : "animate-float-slow [animation-delay:-4s]")
        }
      />

      {/* teal horizon */}
      <motion.div
        className="absolute -bottom-[45%] left-1/2 aspect-square w-[160%] rounded-full md:w-[110%]"
        style={{
          x: "-50%",
          background:
            "radial-gradient(closest-side, rgba(45,212,191,0.35), rgba(34,211,238,0.22) 45%, rgba(59,130,246,0.18) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={active ? { opacity: [0.6, 0.85, 0.6], scale: [1, 1.04, 1] } : { opacity: 0.7, scale: 1 }}
        transition={active ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      />
    </div>
  );
}
