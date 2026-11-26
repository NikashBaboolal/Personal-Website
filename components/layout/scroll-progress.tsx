"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/** Thin flame-gradient reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="bg-flame pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
