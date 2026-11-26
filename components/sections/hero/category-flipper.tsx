"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useHeroReducedMotion } from "./use-reduced-motion";

type Slot = "current" | "prev" | "next";

const SLOT_CLASSES: Record<Slot, string> = {
  // Visible word: rests in place, fully opaque (also the SSR / no-JS state).
  current: "translate-y-0 opacity-100 transition-[transform,opacity] duration-700",
  // Word that just left: slides up and fades out.
  prev: "-translate-y-full opacity-0 transition-[transform,opacity] duration-500",
  // Waiting words: parked below the mask; jump there instantly (no sweep).
  next: "translate-y-full opacity-0 transition-none",
};

/**
 * Vertical word flipper cycling through `words` (pauses when the tab is hidden).
 *
 * All words are stacked in a single grid cell and moved with CSS transitions
 * on transform/opacity, so the flip runs on the compositor and the current word
 * is always rendered at rest — it never depends on a JS animation finishing.
 */
export function CategoryFlipper({
  words,
  interval = 2400,
  className,
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useHeroReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [reduce, words.length, interval]);

  const prevIndex = (index - 1 + words.length) % words.length;
  const slotFor = (i: number): Slot =>
    i === index ? "current" : i === prevIndex && words.length > 1 ? "prev" : "next";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid overflow-hidden py-[0.1em] align-bottom leading-[1.3]",
        className,
      )}
    >
      {words.map((word, i) => (
        <span
          key={word}
          className={cn(
            "col-start-1 row-start-1 whitespace-nowrap ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none",
            SLOT_CLASSES[slotFor(i)],
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
