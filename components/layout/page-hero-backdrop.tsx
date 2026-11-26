"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { MediaImage } from "@/lib/media";
import { MoleculeLattice, PfdScene } from "@/components/layout/process-art";

/**
 * Decorative layers for the inner-page hero: slow Ken Burns plant photo with a cool
 * ink/teal duotone (or a designed gradient fallback), a faint benzene lattice and a
 * process-flow diagram whose streams flow while the hero is on screen. aria-hidden.
 *
 * The element tree never depends on the reduced-motion flag (hydration-safe); loops only run
 * while the hero is on screen and motion is allowed, otherwise they rest in a static state.
 */
export function PageHeroBackdrop({ media }: { media?: MediaImage }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "100px 0px" });
  const active = inView && !reduce;
  const rest = { duration: 0 };

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {media ? (
        <>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.04, x: "0%", y: "0%" }}
            animate={
              active ? { scale: 1.12, x: "-1.5%", y: "-1%" } : { scale: 1.04, x: "0%", y: "0%" }
            }
            transition={
              active
                ? { duration: 28, ease: "linear", repeat: Infinity, repeatType: "reverse" }
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
          {/* Duotone: ink multiply + teal/cyan screen tint, then legibility gradients */}
          <div className="absolute inset-0 bg-[#0b1f33] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(45,212,191,0.16),rgba(56,189,248,0.10)_45%,transparent_70%)] mix-blend-screen" />
          <div className="from-night/85 via-night/65 to-night absolute inset-0 bg-gradient-to-b" />
          <div className="from-night/90 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(34,211,238,0.22),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_100%,rgba(59,130,246,0.25),transparent_70%)]" />
        </>
      )}

      {/* Benzene lattice, fading out towards the copy */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_85%_40%,black,transparent)]">
        <MoleculeLattice opacity={0.14} />
      </div>

      {/* Process flow diagram (wide screens only, clear of the copy) */}
      <div className="absolute top-1/2 right-[-4rem] hidden h-[22rem] w-[46rem] -translate-y-1/2 opacity-70 [mask-image:linear-gradient(to_right,transparent,black_30%)] xl:block 2xl:right-0">
        <PfdScene active={active} />
      </div>

      {/* Cool glow */}
      <div className="absolute -top-32 right-[-10%] h-80 w-[36rem] max-w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.35),rgba(56,189,248,0.15),transparent)] blur-[80px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
    </div>
  );
}
