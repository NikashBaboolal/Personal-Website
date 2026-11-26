"use client";

import { useId, useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * Giant "NIKASH BABOOLAL" wordmark that rises/unmasks as the footer scrolls
 * into view. SVG textLength guarantees it spans the full width at any size.
 * Hovering crossfades the outline into the brand flame gradient.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const gradientId = `wordmark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  // Numeric inset + template: string interpolation of clip-path values is unreliable.
  const insetTop = useTransform(scrollYProgress, [0, 0.9], [100, 0]);
  const clip = useMotionTemplate`inset(${insetTop}% 0% 0% 0%)`;

  return (
    <div ref={ref} aria-hidden="true" className="group relative overflow-hidden select-none">
      <motion.div
        style={reduce ? undefined : { y, clipPath: clip }}
        className="will-change-transform"
      >
        <svg viewBox="0 0 1000 132" className="block h-auto w-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0" stopColor="#2dd4bf" />
              <stop offset="0.3" stopColor="#22d3ee" />
              <stop offset="0.62" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="118"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="font-display fill-white/[0.05] stroke-white/20 font-black"
            strokeWidth="1"
            fontSize="128"
          >
            NIKASH BABOOLAL
          </text>
          <text
            x="0"
            y="118"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill={`url(#${gradientId})`}
            className="font-display font-black opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            fontSize="128"
          >
            NIKASH BABOOLAL
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
