"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Pill with a travelling shimmer border and a live "pilot light" dot. */
export function EyebrowPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.p
      className={cn("relative inline-flex rounded-full p-px", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* static hairline + moving highlight form the border */}
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-white/12" />
      <span
        aria-hidden="true"
        className="animate-shimmer absolute inset-0 rounded-full bg-[linear-gradient(110deg,transparent_25%,#ffd200_45%,#e4183c_55%,transparent_75%)] bg-size-[200%_100%]"
      />
      <span className="bg-night/90 font-dm-mono relative inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[0.65rem] tracking-[0.18em] text-white/85 uppercase backdrop-blur sm:text-xs">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="bg-lamp-orange absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span className="bg-lamp-yellow relative inline-flex size-2 rounded-full" />
        </span>
        {/* Single flex item so whitespace between text nodes isn't trimmed. */}
        <span>{children}</span>
      </span>
    </motion.p>
  );
}
