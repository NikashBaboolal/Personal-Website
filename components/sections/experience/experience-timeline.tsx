"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/button";
import { experience, type Role } from "@/lib/content";
import { cn } from "@/lib/utils";

const COMPACT_ROLES = 3;
const COMPACT_POINTS = 3;

/** P&ID-style function letters for each role type. */
const TYPE_TAG: Record<string, string> = {
  "Full-time": "FT",
  "Part-time": "PT",
  Internship: "IN",
};

/**
 * Career timeline drawn as a process stream: a pipe with fluid flowing down it, a
 * scroll-linked fill, and P&ID instrument bubbles as nodes that light up as the
 * stream reaches them.
 * compact: latest roles only (home page) with a link to /experience.
 */
export function ExperienceTimeline({
  compact = false,
  className,
  id = "experience",
}: {
  compact?: boolean;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "100px 0px" });
  const flowing = inView && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const roles = compact ? experience.slice(0, COMPACT_ROLES) : experience;

  return (
    <section
      id={id}
      className={cn("bg-surface border-line relative overflow-hidden border-y py-24 md:py-32", className)}
    >
      <div aria-hidden="true" className="bg-grid-light mask-fade-y pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 size-[28rem] rounded-full bg-teal-300/20 blur-3xl"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Experience"
          title={compact ? "Where I've been making an impact" : "Career timeline"}
          lead={
            compact
              ? "From plant-floor process engineering at Mondi Group to battery research in Germany and data work in municipal infrastructure."
              : "Every role, most recent first: process engineering, research, consulting, leadership and data."
          }
          align="center"
        />

        <ol ref={ref} className="relative mx-auto mt-16 max-w-5xl md:mt-24">
          {/* pipe */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-[7px] -translate-x-1/2 rounded-full border border-slate-300 bg-slate-100 md:left-1/2"
          />
          {/* fluid: fills with scroll, dashes flow downstream */}
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-[3px] origin-top -translate-x-1/2 overflow-hidden rounded-full bg-teal-500/30 md:left-1/2"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          >
            <motion.span
              className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#0d9488_0_8px,#22d3ee_8px_12px,transparent_12px_20px)]"
              initial={false}
              animate={flowing ? { backgroundPositionY: ["0px", "20px"] } : { backgroundPositionY: "0px" }}
              transition={flowing ? { duration: 0.9, ease: "linear", repeat: Infinity } : { duration: 0 }}
            />
          </motion.span>
          {roles.map((role, i) => (
            <RoleItem
              key={role.slug}
              role={role}
              index={i}
              total={roles.length}
              progress={scrollYProgress}
              reduce={!!reduce}
              compact={compact}
            />
          ))}
        </ol>

        {compact ? (
          <div className="mt-14 flex justify-center">
            <ButtonLink href="/experience" variant="outline">
              Full experience
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function RoleItem({
  role,
  index,
  total,
  progress,
  reduce,
  compact,
}: {
  role: Role;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
  compact: boolean;
}) {
  const at = total > 1 ? index / (total - 1) : 0;
  const lit = useTransform(progress, [Math.max(0, at - 0.06), at + 0.001], [0, 1]);
  const cardOpacity = useTransform(progress, [Math.max(0, at - 0.15), at], [0.35, 1]);
  const cardX = useTransform(progress, [Math.max(0, at - 0.15), at], [index % 2 === 0 ? -24 : 24, 0]);
  const left = index % 2 === 0;
  const points = compact ? role.points.slice(0, COMPACT_POINTS) : role.points;

  return (
    <li className="relative grid grid-cols-[3rem_1fr] items-start gap-5 pb-12 last:pb-0 md:grid-cols-[1fr_4rem_1fr] md:gap-8 md:pb-16">
      {/* Node: P&ID instrument bubble (function letters over loop number) */}
      <div className="relative z-10 col-start-1 row-start-1 grid place-items-center pt-6 md:col-start-2">
        <div
          aria-hidden="true"
          className="relative grid size-12 place-items-center overflow-hidden rounded-full border-2 border-slate-300 bg-white shadow-sm md:size-14"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ccfbf1,#99f6e4)] shadow-[0_0_24px_rgba(45,212,191,0.55)]"
            style={{ opacity: reduce ? 1 : lit }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-teal-500"
            style={{ opacity: reduce ? 1 : lit }}
          />
          <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-slate-400/70" />
          <span className="font-dm-mono relative -mt-0.5 flex flex-col items-center leading-none">
            <span className="text-night pb-1 text-[11px] font-semibold md:text-xs">
              {TYPE_TAG[role.type] ?? "XX"}
            </span>
            <span className="pt-1 text-[9px] text-teal-700 md:text-[10px]">{101 + index}</span>
          </span>
        </div>
      </div>

      {/* Dates on the opposite side (desktop) */}
      <div
        className={cn(
          "hidden pt-9 md:row-start-1 md:block",
          left ? "md:col-start-3" : "md:col-start-1 md:text-right",
        )}
      >
        <p className="font-dm-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {role.start} – {role.end}
        </p>
        <p className="font-dm-mono text-muted-foreground/80 mt-1 text-[11px] tracking-[0.16em] uppercase">
          {role.place}
        </p>
      </div>

      {/* Card */}
      <motion.div
        className={cn("col-start-2 row-start-1", left ? "md:col-start-1" : "md:col-start-3")}
        style={{ opacity: reduce ? 1 : cardOpacity, x: reduce ? 0 : cardX }}
      >
        <article className="border-line rounded-3xl border bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(11,12,31,0.12)] backdrop-blur md:p-7">
          <p className="font-dm-mono text-teal-700 text-xs tracking-[0.2em] uppercase">
            {role.type}
            <span className="md:hidden">
              {" "}
              · {role.start} – {role.end}
            </span>
          </p>
          <h3 className="font-display text-foreground mt-2 text-2xl font-extrabold tracking-tight">
            {role.title}
          </h3>
          <p className="text-foreground/80 mt-1 text-sm font-semibold">
            {role.org}
            <span className="text-muted-foreground font-normal md:hidden"> · {role.place}</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {points.map((point) => (
              <li key={point} className="text-muted-foreground flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 rounded-[1px] bg-teal-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {compact && role.points.length > points.length ? (
            <Link
              href={`/experience#${role.slug}`}
              className="text-foreground focus-visible:ring-teal-500 mt-4 inline-flex items-center gap-1 rounded-full text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
            >
              +{role.points.length - points.length} more
              <span className="sr-only"> about {role.title} at {role.org}</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </article>
      </motion.div>
      {/* anchor for deep links */}
      <span id={role.slug} aria-hidden="true" className="absolute -top-28" />
    </li>
  );
}
