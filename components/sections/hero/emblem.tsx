"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { LogoMark } from "@/components/brand/logo";
import { person } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useHeroReducedMotion } from "./use-reduced-motion";

const SPRING = { stiffness: 120, damping: 18, mass: 0.6 };

/** Benzene hexagon in a 200x200 box (pointy-top), radius 88. */
const VERTICES: readonly (readonly [number, number])[] = [
  [100, 12],
  [176.2, 56],
  [176.2, 144],
  [100, 188],
  [23.8, 144],
  [23.8, 56],
];
const RING = `M${VERTICES.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
/** Kekulé double bonds: every other edge, drawn inset toward the centre. */
const INNER_BONDS = [0, 2, 4].map((i) => {
  const [x1, y1] = VERTICES[i];
  const [x2, y2] = VERTICES[(i + 1) % 6];
  /** Move a point a fraction `t` of the way toward the ring centre (100, 100). */
  const inset = (x: number, y: number, t: number) =>
    [x + (100 - x) * t, y + (100 - y) * t] as const;
  const a = inset(x1 + (x2 - x1) * 0.18, y1 + (y2 - y1) * 0.18, 0.12);
  const b = inset(x1 + (x2 - x1) * 0.82, y1 + (y2 - y1) * 0.82, 0.12);
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
});
/** P&ID instrument bubbles (decorative tags, ISA-5.1 style). */
const TAGS = [
  { tag: "TIC-101", x: 196, y: 24, lx: 176.2, ly: 56 },
  { tag: "FIC-102", x: 4, y: 176, lx: 23.8, ly: 144 },
] as const;

/**
 * "NB" monogram emblem: the benzene-ring LogoMark in a glass core, framed by a large
 * benzene ring (Kekulé bonds, atom nodes, a stream flowing round the ring), P&ID
 * instrument bubbles, an instrument-dial and orbiting stream particles. Tilts
 * toward the pointer.
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
        {/* soft stream-coloured halo */}
        <div className="absolute inset-[16%] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#5eead4,#22d3ee,#3b82f6,#2dd4bf,#5eead4)] opacity-25 blur-3xl" />

        {/* outer instrument dial: tick marks + P&ID tags */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full animate-spin-slow"
          style={{ animationDuration: "120s" }}
        >
          <defs>
            <linearGradient id="hero-emblem-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5eead4" />
              <stop offset="0.5" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
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

        {/* benzene ring: carbon skeleton + Kekulé double bonds, with atoms at the vertices */}
        <svg viewBox="0 0 200 200" className="absolute inset-[6%] h-[88%] w-[88%] overflow-visible">
          <defs>
            <linearGradient id="hero-benzene" x1="20" y1="10" x2="180" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5eead4" />
              <stop offset="0.55" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d={RING}
            fill="none"
            stroke="url(#hero-benzene)"
            strokeWidth="1.4"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <g stroke="url(#hero-benzene)" strokeWidth="1" strokeLinecap="round" opacity="0.5">
            {INNER_BONDS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          {/* flowing "stream" along the ring */}
          <path
            d={RING}
            fill="none"
            stroke="#5eead4"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="4 28"
            className="animate-stream-flow-slow"
            opacity="0.9"
          />
          {VERTICES.map(([x, y], i) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="4.2" fill="#06141b" stroke="url(#hero-benzene)" strokeWidth="1.2" />
              <circle cx={x} cy={y} r="1.6" fill={i % 3 === 0 ? "#f5a524" : "#5eead4"} />
            </g>
          ))}
          {/* P&ID instrument bubbles sitting off the ring */}
          {TAGS.map((t) => (
            <g key={t.tag} opacity="0.7">
              <line x1={t.lx} y1={t.ly} x2={t.x} y2={t.y} stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2 2" />
              <circle cx={t.x} cy={t.y} r="11" fill="#0b1f29" stroke="#22d3ee" strokeWidth="0.8" />
              <line x1={t.x - 11} y1={t.y} x2={t.x + 11} y2={t.y} stroke="#22d3ee" strokeWidth="0.5" />
              <text x={t.x} y={t.y - 3} textAnchor="middle" fill="#ccfbf1" fontSize="5.2" fontFamily="ui-monospace, monospace">
                {t.tag.split("-")[0]}
              </text>
              <text x={t.x} y={t.y + 6.5} textAnchor="middle" fill="#ccfbf1" fontSize="5.2" fontFamily="ui-monospace, monospace">
                {t.tag.split("-")[1]}
              </text>
            </g>
          ))}
        </svg>

        {/* orbit ring 1: a molecule-sized particle riding a stream */}
        <div
          className="absolute inset-[10%] animate-spin-slow rounded-full border border-dashed border-white/[0.07]"
          style={{ animationDuration: "26s" }}
        >
          <span className="bg-lamp-yellow absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_14px_3px_rgba(94,234,212,0.6)]" />
        </div>

        {/* orbit ring 2 (counter-rotating) */}
        <div
          className="absolute inset-[22%] animate-spin-slow rounded-full border border-white/[0.05]"
          style={{ animationDuration: "18s", animationDirection: "reverse" }}
        >
          <span className="bg-lamp-red absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" />
          <span className="bg-stream-hot absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_2px_rgba(245,165,36,0.6)]" />
        </div>

        {/* glass core with the mark */}
        <motion.div className="absolute inset-[31%]" style={{ x: coreX, y: coreY }}>
          <div className="animate-float-slow h-full w-full">
          <div className="from-night-3/90 to-night/90 relative flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-linear-to-br shadow-[0_0_80px_-10px_rgba(45,212,191,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(94,234,212,0.18),transparent_65%)]" />
            <LogoMark animated className="relative size-[58%] drop-shadow-[0_0_24px_rgba(45,212,191,0.55)]" />
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
