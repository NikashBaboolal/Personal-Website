"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useMediaQuery } from "@/components/layout/use-media-query";

const INTERACTIVE = "a, button, [role='button'], summary, label, input, select, textarea";

/**
 * Soft flame glow + ring that trails the pointer. Desktop (pointer: fine) only,
 * hidden for reduced motion. Never intercepts clicks (pointer-events: none).
 */
export function CursorGlow() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  if (!finePointer || reduce) return null;
  return <CursorGlowInner />;
}

function CursorGlowInner() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const opacity = useMotionValue(0);
  const ringScale = useMotionValue(1);

  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const gx = useSpring(x, { stiffness: 120, damping: 24 });
  const gy = useSpring(y, { stiffness: 120, damping: 24 });
  const scale = useSpring(ringScale, { stiffness: 300, damping: 24 });
  const fade = useSpring(opacity, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
      const target = e.target instanceof Element ? e.target : null;
      ringScale.set(target?.closest(INTERACTIVE) ? 1.9 : 1);
    };
    const onLeave = () => opacity.set(0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, opacity, ringScale]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen bg-[radial-gradient(circle,rgba(247,147,30,0.14),rgba(228,24,60,0.06)_40%,transparent_70%)]"
        style={{ x: gx, y: gy, opacity: fade }}
      />
      <motion.div
        className="border-lamp-orange/70 absolute top-0 left-0 -mt-3.5 -ml-3.5 size-7 rounded-full border mix-blend-difference"
        style={{ x: sx, y: sy, scale, opacity: fade }}
      />
    </div>
  );
}
