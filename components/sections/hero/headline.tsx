"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * H1 with a word-by-word masked rise. Words inside `highlight` get the
 * animated process-stream gradient (teal to blue).
 */
export function HeroHeadline({
  text,
  highlight,
  className,
  delay = 0.15,
}: {
  text: string;
  highlight?: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  const hl = highlight ? highlight.split(" ") : [];
  const hlStart = hl.length
    ? words.findIndex((_, i) => words.slice(i, i + hl.length).join(" ") === highlight)
    : -1;
  const isHighlighted = (i: number) => hlStart >= 0 && i >= hlStart && i < hlStart + hl.length;

  return (
    <h1 className={cn("font-display font-black tracking-[-0.035em] text-balance text-white", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={cn(
                  "inline-block",
                  isHighlighted(i) && "text-flame animate-flame-shift pr-[0.04em]",
                )}
                style={isHighlighted(i) ? { animationDelay: `${(i - hlStart) * -1.2}s` } : undefined}
                initial={{ y: "115%", rotate: 6, opacity: 0 }}
                animate={{ y: "0%", rotate: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
