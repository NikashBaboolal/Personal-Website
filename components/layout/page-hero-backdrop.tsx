"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { MediaImage } from "@/lib/media";
import { LogoMark } from "@/components/brand/logo";

/** Deterministic beam layout (no Math.random → no hydration mismatch). */
const BEAMS = [
  { left: "12%", delay: 0, duration: 6.5, height: "h-24" },
  { left: "31%", delay: 2.2, duration: 8, height: "h-32" },
  { left: "54%", delay: 1.1, duration: 7, height: "h-20" },
  { left: "73%", delay: 3.4, duration: 9, height: "h-28" },
  { left: "89%", delay: 0.6, duration: 7.5, height: "h-24" },
] as const;

/**
 * Decorative layers for the inner-page hero: Ken Burns photo with duotone
 * overlay (or a designed gradient fallback), drifting grid, falling beams and
 * a flame glow. Entirely aria-hidden.
 *
 * The element tree never depends on the reduced-motion flag (hydration-safe); loops only run
 * while the hero is on screen and motion is allowed, otherwise they snap to a resting state.
 */
export function PageHeroBackdrop({ media }: { media?: MediaImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "100px 0px" });
  const active = inView && !reduce;
  const rest = { duration: 0 };
  const cssPlay = { animationPlayState: active ? "running" : "paused" } as const;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {media ? (
        <>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.04, x: "0%", y: "0%" }}
            animate={
              active ? { scale: 1.16, x: "-1.5%", y: "-1%" } : { scale: 1.04, x: "0%", y: "0%" }
            }
            transition={
              active
                ? { duration: 24, ease: "linear", repeat: Infinity, repeatType: "reverse" }
                : rest
            }
          >
            <Image
              src={media.src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder={media.blurDataURL ? "blur" : "empty"}
              blurDataURL={media.blurDataURL}
              className="object-cover grayscale"
            />
          </motion.div>
          {/* Duotone: navy multiply + flame screen tint, then legibility gradients */}
          <div className="bg-navy absolute inset-0 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,210,0,0.18),rgba(228,24,60,0.12)_45%,transparent_70%)] mix-blend-screen" />
          <div className="from-night/80 via-night/60 to-night absolute inset-0 bg-gradient-to-b" />
          <div className="from-night/90 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(59,63,182,0.45),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_100%,rgba(35,37,107,0.6),transparent_70%)]" />
        </>
      )}

      {/* Drifting grid (transform-only loop, one cell = 56px) */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,black,transparent)]">
        <motion.div
          className="bg-grid-night absolute inset-x-0 -top-14 bottom-0 opacity-70"
          initial={{ y: 0 }}
          animate={active ? { y: [0, 56] } : { y: 0 }}
          transition={active ? { duration: 6, ease: "linear", repeat: Infinity } : rest}
        />
      </div>

      {/* Beams falling along grid lines */}
      {BEAMS.map((beam) => (
        <motion.span
          key={beam.left}
          className={`absolute top-0 w-px ${beam.height} bg-gradient-to-b from-transparent via-lamp-orange to-transparent`}
          style={{ left: beam.left }}
          initial={{ y: "-120%", opacity: 0 }}
          animate={
            active
              ? { y: ["-120%", "520%"], opacity: [0, 1, 1, 0] }
              : { y: "-120%", opacity: 0 }
          }
          transition={
            active
              ? {
                  duration: beam.duration,
                  delay: beam.delay,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                }
              : rest
          }
        />
      ))}

      {/* Blueprint orbit with the brand mark (wide screens only, clear of the copy) */}
      <div className="absolute top-1/2 right-[-7rem] hidden size-[34rem] -translate-y-1/2 xl:block 2xl:right-[-3rem]">
        <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[12%] rounded-full border border-white/[0.09]" />
        <div style={cssPlay} className="animate-spin-slow absolute inset-[24%] rounded-full border border-dashed border-lamp-orange/30" />
        <div className="absolute inset-[36%] rounded-full bg-[radial-gradient(circle,rgba(247,147,30,0.22),transparent_70%)]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <motion.div
          className="absolute inset-[12%]"
          initial={{ rotate: 0 }}
          animate={active ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={active ? { duration: 28, ease: "linear", repeat: Infinity } : rest}
        >
          <span className="bg-lamp-yellow absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_14px_4px_rgba(255,210,0,0.55)]" />
        </motion.div>
        <div className="absolute inset-0 grid place-items-center">
          <LogoMark className="size-28 drop-shadow-[0_0_28px_rgba(247,147,30,0.55)]" />
        </div>
      </div>

      {/* Flame glow */}
      <div
        style={cssPlay}
        className="bg-flame animate-float-slow absolute -top-32 right-[-10%] h-80 w-[36rem] max-w-[80vw] rounded-full opacity-25 blur-[110px]"
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
