"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Tone } from "./illustrations";

const SPRING = { stiffness: 180, damping: 22, mass: 0.6 };

/** Masks a padded element down to a 1px border ring. */
const BORDER_MASK = {
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
} as const;

/** Card with subtle 3D tilt + cursor-following spotlight. Static under reduced motion. */
export function TiltCard({
  tone,
  className,
  children,
}: {
  tone: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const glow = useSpring(0, { stiffness: 120, damping: 20 });

  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), SPRING);

  const spotColor =
    tone === "night" ? "rgba(45,212,191,0.18)" : "rgba(34,211,238,0.16)";
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${spotColor}, transparent 70%)`;
  const ring = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(34,211,238,0.85), transparent 70%)`;

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mx.set(x);
    my.set(y);
    if (!reduce) {
      px.set(x / rect.width);
      py.set(y / rect.height);
    }
  }

  function onEnter(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "touch") glow.set(1);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={
        reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }
      }
      className={cn(
        "group/card relative isolate overflow-hidden rounded-3xl border transition-shadow duration-500 will-change-transform",
        tone === "night"
          ? "bg-night border-night-line text-white hover:shadow-[0_30px_80px_-30px_rgba(34,211,238,0.35)]"
          : "bg-surface border-line text-foreground hover:shadow-[0_30px_80px_-30px_rgba(11,12,31,0.25)]",
        className,
      )}
    >
      {/* Spotlight fill */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlight, opacity: glow }}
      />
      {/* Spotlight border highlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-3xl p-px"
        style={{ background: ring, opacity: glow, ...BORDER_MASK }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.article>
  );
}
