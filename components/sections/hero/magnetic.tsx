"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { useHeroReducedMotion } from "./use-reduced-motion";

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

/** Pulls its child toward the pointer while hovered (mouse/pen only). */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useHeroReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
