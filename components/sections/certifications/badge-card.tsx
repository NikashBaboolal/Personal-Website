"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Seal, type SealTone } from "./seal";

/** Certification card: hexagonal embossed seal, conic sheen on hover, one-off shine sweep on reveal. */
export function BadgeCard({
  code,
  seal,
  label,
  tone,
  index,
  className,
}: {
  /** Card title. */
  code: string;
  /** Text on the seal face (defaults to `code`). */
  seal?: string;
  label: string;
  tone: SealTone;
  index: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <article
      className={cn(
        "group border-night-line relative flex h-full flex-col items-center overflow-hidden rounded-3xl border",
        "from-night-2 to-night bg-gradient-to-b px-4 pt-7 pb-6 text-center",
        "transition-[border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-white/20",
        tone === "brass"
          ? "hover:shadow-[0_20px_60px_-20px_rgba(45,212,191,0.4)]"
          : "hover:shadow-[0_20px_60px_-20px_rgba(56,189,248,0.4)]",
        className,
      )}
    >
      {/* corner hairlines */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative size-24 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-rotate-6 sm:size-28">
        <Seal code={seal ?? code} tone={tone} className="size-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]" />
        {/* conic sheen — spins only while hovered */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[13%] overflow-hidden [clip-path:polygon(50%_0,93.3%_25%,93.3%_75%,50%_100%,6.7%_75%,6.7%_25%)] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
        >
          <span className="absolute -inset-1/2 animate-[spin_3.2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.95)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.7)_220deg,transparent_260deg)] [animation-play-state:paused] group-hover:[animation-play-state:running]" />
        </span>
      </div>

      <h3 className="font-display mt-5 text-sm leading-tight font-extrabold tracking-tight text-balance text-white sm:text-base">
        {code}
      </h3>
      <p className="text-night-muted mt-1.5 text-xs leading-snug text-balance sm:text-[13px]">{label}</p>

      {/* in-view shine sweep */}
      {reduce ? null : (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
          initial={{ x: "-120%" }}
          whileInView={{ x: "320%" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.3, delay: 0.35 + index * 0.08, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </article>
  );
}
