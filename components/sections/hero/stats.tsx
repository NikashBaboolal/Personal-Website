"use client";

import { IconChartLine, IconCoins, IconTrophy, IconUsers } from "@tabler/icons-react";
import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { stats } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS = [IconCoins, IconChartLine, IconUsers, IconTrophy] as const;

/** Count-up number that supports decimals (e.g. R1.5m). */
function StatNumber({
  to,
  decimals,
  prefix,
  suffix,
}: {
  to: number;
  decimals: number;
  prefix: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const id = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(id);
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Glassy stat cards with count-up numbers, staggered in after the headline. */
export function HeroStats({ className, delay = 1 }: { className?: string; delay?: number }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4", className)}>
      {stats.map((stat, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <motion.li
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* top highlight + hover glow */}
            <span
              aria-hidden="true"
              className="via-lamp-orange/70 absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent to-transparent"
            />
            <span
              aria-hidden="true"
              className="bg-lamp-orange/25 absolute -top-12 -right-12 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-2xl leading-none font-extrabold tracking-tight text-white tabular-nums sm:text-3xl lg:text-4xl">
                <StatNumber
                  to={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <Icon aria-hidden="true" className="text-lamp-yellow/80 size-5 shrink-0" stroke={1.5} />
            </div>
            <p className="font-dm-mono text-night-muted mt-3 text-[0.62rem] leading-relaxed tracking-[0.14em] uppercase sm:text-[0.7rem]">
              {stat.label}
            </p>
          </motion.li>
        );
      })}
    </ul>
  );
}
