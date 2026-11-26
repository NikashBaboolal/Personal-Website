"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { LogoMark } from "@/components/brand/logo";
import { person } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useHeroReducedMotion } from "./use-reduced-motion";

const SPRING = { stiffness: 120, damping: 18, mass: 0.6 };

/**
 * Glowing "NB" monogram emblem: animated LogoMark in a glass core, wrapped in orbiting
 * rings, tick-mark dial, pulse rings and a rotating flame halo. Tilts toward
 * the pointer.
 */
export function HeroEmblem({ className }: { className?: string }) {
  const reduce = useHeroReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const coreX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const coreY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };


  return (
    <motion.div
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative aspect-square perspective-[1200px]", className)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative h-full w-full transform-3d"
        style={{ rotateX, rotateY }}
      >
        {/* rotating flame halo */}
        <div className="absolute inset-[14%] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#ffd200,#f7931e,#e4183c,#3b3fb6,#ffd200)] opacity-35 blur-3xl" />

        {/* pulse rings */}
        {[0, 0.8, 1.6].map((delay) => (
          <span
            key={delay}
            className="border-lamp-orange/40 animate-pulse-ring absolute inset-[34%] rounded-full border"
            style={{ animationDelay: `${delay}s`, animationDuration: "2.4s" }}
          />
        ))}

        {/* outer dial with tick marks */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full animate-spin-slow"
          style={{ animationDuration: "90s" }}
        >
          <defs>
            <linearGradient id="hero-emblem-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd200" />
              <stop offset="0.5" stopColor="#e4183c" />
              <stop offset="1" stopColor="#3b3fb6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.6"
            strokeDasharray="0.6 4.5"
          />
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke="url(#hero-emblem-arc)"
            strokeWidth="0.8"
            strokeDasharray="120 496"
            strokeLinecap="round"
          />
        </svg>

        {/* orbit ring 1 */}
        <div
          className="absolute inset-[8%] animate-spin-slow rounded-full border border-dashed border-white/10"
          style={{ animationDuration: "26s" }}
        >
          <span className="bg-lamp-yellow absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_14px_3px_rgba(255,210,0,0.7)]" />
        </div>

        {/* orbit ring 2 (counter-rotating) */}
        <div
          className="absolute inset-[20%] animate-spin-slow rounded-full border border-white/[0.08]"
          style={{ animationDuration: "18s", animationDirection: "reverse" }}
        >
          <span className="bg-lamp-orange absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full shadow-[0_0_12px_2px_rgba(247,147,30,0.8)]" />
          <span className="bg-lamp-red absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_2px_rgba(228,24,60,0.8)]" />
        </div>

        {/* glass core with the mark */}
        <motion.div className="absolute inset-[30%]" style={{ x: coreX, y: coreY }}>
          <div className="animate-float-slow h-full w-full">
          <div className="from-night-3/90 to-night/90 relative flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-linear-to-br shadow-[0_0_80px_-10px_rgba(247,147,30,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,210,0,0.22),transparent_65%)]" />
            <LogoMark animated className="relative size-[58%] drop-shadow-[0_0_24px_rgba(247,147,30,0.65)]" />
          </div>
          </div>
        </motion.div>

        {/* floating fact chips (from content) */}
        <div className="font-dm-mono animate-float-slow absolute top-[12%] -left-[4%] rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.65rem] tracking-[0.2em] text-white/80 uppercase backdrop-blur"
          style={{ animationDelay: "-3s" }}
        >
          <span className="text-lamp-yellow">ECSA</span> Candidate Engineer
        </div>
        <div className="font-dm-mono animate-float-slow absolute -right-[2%] bottom-[14%] rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.65rem] tracking-[0.2em] text-white/80 uppercase backdrop-blur"
          style={{ animationDelay: "-6s" }}
        >
          {person.location}
        </div>
      </motion.div>
    </motion.div>
  );
}
