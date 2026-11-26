"use client";

import { animate, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { SlidingNumber } from "@/components/sliding-number";
import { stats } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Animated headline numbers from the CV (R1.5m savings, 15% yield, 16 tutors, 96% maths). */
export function StatsRow({
  className,
  tone = "dark",
}: {
  className?: string;
  /** "dark" text on light backgrounds, "light" text on night backgrounds. */
  tone?: "dark" | "light";
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-3xl border lg:grid-cols-4",
        tone === "dark" ? "border-line bg-line" : "border-night-line bg-night-line",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <Stat key={stat.label} stat={stat} index={i} tone={tone} />
      ))}
    </dl>
  );
}

function Stat({
  stat,
  index,
  tone,
}: {
  stat: (typeof stats)[number];
  index: number;
  tone: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const factor = Math.pow(10, stat.decimals);
  // Start from a value with the same digit count so the odometer width stays stable.
  const from = stat.value >= 10 ? Math.pow(10, String(Math.floor(stat.value)).length - 1) : 0;
  const [value, setValue] = useState<number>(from);
  const shown = reduce ? stat.value : value;

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, stat.value, {
      duration: 1.6,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v * factor) / factor),
    });
    return () => controls.stop();
  }, [inView, reduce, from, stat.value, index, factor]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col-reverse gap-2 overflow-hidden p-5 sm:p-7",
        tone === "dark" ? "bg-surface" : "bg-night-2",
      )}
    >
      <span
        aria-hidden="true"
        className="bg-flame absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      />
      <dt
        className={cn(
          "font-dm-mono text-[0.68rem] leading-relaxed tracking-[0.18em] uppercase",
          tone === "dark" ? "text-muted-foreground" : "text-night-muted",
        )}
      >
        {stat.label}
      </dt>
      <dd
        className={cn(
          "font-display flex items-baseline text-4xl font-black tracking-tight sm:text-5xl",
          tone === "dark" ? "text-foreground" : "text-white",
        )}
      >
        <span className="sr-only">
          {stat.prefix}
          {stat.value.toFixed(stat.decimals)}
          {stat.suffix}
        </span>
        <span aria-hidden="true" className="flex items-baseline">
          {stat.prefix ? <span className="mr-1 text-[0.7em] font-extrabold">{stat.prefix}</span> : null}
          {stat.decimals > 0 ? (
            <span className="tabular-nums">{shown.toFixed(stat.decimals)}</span>
          ) : (
            <SlidingNumber value={shown} />
          )}
          {stat.suffix ? <span className="text-flame">{stat.suffix}</span> : null}
        </span>
      </dd>
    </motion.div>
  );
}
