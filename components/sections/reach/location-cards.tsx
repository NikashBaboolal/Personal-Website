"use client";

import { IconMapPin } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { globeSites } from "./sites";

type Rail = { top: number; height: number };

/** Place cards joined by an animated connector rail with "live" pulse dots. */
export function LocationCards({ className }: { className?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rail, setRail] = useState<Rail | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const dots = dotRefs.current.filter((d): d is HTMLSpanElement => d !== null);
      if (dots.length < 2) return;
      const base = list.getBoundingClientRect().top;
      const first = dots[0].getBoundingClientRect();
      const lastDot = dots[dots.length - 1].getBoundingClientRect();
      const top = first.top + first.height / 2 - base;
      const bottom = lastDot.top + lastDot.height / 2 - base;
      setRail((prev) =>
        prev && Math.abs(prev.top - top) < 0.5 && Math.abs(prev.height - (bottom - top)) < 0.5
          ? prev
          : { top, height: bottom - top },
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <ol ref={listRef} className={cn("relative flex flex-col gap-4", className)}>
      {rail ? (
        <li
          aria-hidden="true"
          className="pointer-events-none absolute left-[2.0625rem] z-10 w-px"
          style={{ top: rail.top + 14, height: Math.max(0, rail.height - 28) }}
        >
          <span className="absolute inset-0 bg-white/10" />
          <motion.span
            className="absolute inset-0 origin-top bg-gradient-to-b from-[#2dd4bf] via-[#22d3ee] to-[#3b82f6]"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </li>
      ) : null}

      {globeSites.map((site, i) => (
        <motion.li
          key={site.id}
          initial={reduce ? false : { opacity: 0, x: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="group border-night-line bg-night-2/70 relative overflow-hidden rounded-3xl border p-6 pl-16 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 sm:pl-16"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
            style={{ background: site.css }}
          />
          <span
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            aria-hidden="true"
            className="absolute top-7 left-6 grid size-5 place-items-center"
          >
            <span
              className="animate-pulse-ring absolute inset-0 rounded-full"
              style={{ background: site.css, animationDelay: `${i * 0.8}s` }}
            />
            <span className="relative size-2.5 rounded-full ring-4 ring-[#0e1030]" style={{ background: site.css }} />
          </span>

          <p className="font-dm-mono text-night-muted flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
            {site.id === "braunschweig" ? "Germany" : "South Africa"}
            {site.kind === "home" ? (
              <>
                <span className="h-px w-6 bg-white/15" />
                <span className="text-white/70">Home</span>
              </>
            ) : null}
          </p>
          <h3 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-white">{site.label}</h3>
          <p className="text-night-muted mt-3 flex gap-2.5 text-sm leading-relaxed">
            <IconMapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-white/50" />
            <span>{site.sublabel}</span>
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
