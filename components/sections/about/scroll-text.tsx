"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Apple-style "text reveal on scroll": each word's opacity is linked to the
 * scroll position of the paragraph, so the statement lights up as you read.
 */
export function ScrollLitText({
  text,
  highlight = [],
  className,
}: {
  text: string;
  /** Words (case-insensitive, punctuation ignored) rendered with the flame gradient. */
  highlight?: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  const words = text.split(" ");
  const marks = new Set(highlight.map(normalise));

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        // input ranges must stay inside [0, 1] and be non-decreasing (motion's ScrollTimeline path)
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            static={Boolean(reduce)}
            accent={marks.has(normalise(word))}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function normalise(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9+]/g, "");
}

function Word({
  children,
  progress,
  range,
  static: isStatic,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  static: boolean;
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="relative mr-[0.25em] mb-[0.08em] inline-block">
      <motion.span
        // Always pass a style object: switching to `undefined` after hydration (when the
        // reduced-motion preference resolves) would leave the last motion values stuck inline.
        style={isStatic ? { opacity: 1, y: 0 } : { opacity, y }}
        className={cn("inline-block", accent && "text-flame animate-flame-shift")}
      >
        {children}
      </motion.span>
    </span>
  );
}
