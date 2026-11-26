"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useHeroReducedMotion } from "./use-reduced-motion";

/** Mouse-outline scroll hint with a falling wheel dot. Decorative. */
export function ScrollCue({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useHeroReducedMotion();
  const inView = useInView(ref);
  const active = inView && !reduce;
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn("flex flex-col items-center gap-2", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.8 }}
    >
      <span className="relative flex h-9 w-5.5 justify-center rounded-full border border-white/25">
        <motion.span
          className="bg-lamp-yellow mt-1.5 block size-1 rounded-full shadow-[0_0_8px_rgba(94,234,212,0.9)]"
          initial={{ y: 0, opacity: 1 }}
          animate={active ? { y: [0, 12, 12], opacity: [1, 0, 0] } : { y: 0, opacity: 1 }}
          transition={
            active
              ? { duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.7, 1] }
              : { duration: 0 }
          }
        />
      </span>
      <span className="font-dm-mono text-[0.6rem] tracking-[0.3em] text-white/45 uppercase">Scroll</span>
    </motion.div>
  );
}
