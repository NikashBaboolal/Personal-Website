"use client";

import { ArrowRight } from "lucide-react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { person, summary } from "@/lib/content";
import { Beams, DashedRule, GridFloor, LampBeam, NightGrid } from "./backdrop";
import { CategoryFlipper } from "./category-flipper";
import { HeroEmblem } from "./emblem";
import { EyebrowPill } from "./eyebrow-pill";
import { HeroHeadline } from "./headline";
import { LightAbove } from "./light-above";
import { Magnetic } from "./magnetic";
import { HeroPhoto } from "./photo";
import { ScrollCue } from "./scroll-cue";
import { SparkField } from "./spark-field";
import { Stars } from "./stars";
import { HeroStats } from "./stats";
import { useHeroReducedMotion } from "./use-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** First sentence of the CV summary. */
const LEAD = `${summary.split(". ")[0]}.`;
const DISCIPLINES = [...person.disciplines];

/** Home page hero: night sky, plant photo, sparks, glowing NB monogram emblem. */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useHeroReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["0 0", "1 0"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 240]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="hero"
        className="bg-night relative isolate flex min-h-[100svh] flex-col overflow-hidden text-white"
      >
        {/* ---------- Background layers ---------- */}
        <motion.div aria-hidden="true" className="absolute inset-0 -z-10" style={{ y: backdropY }}>
          <HeroPhoto />
          <NightGrid className="opacity-80" />
          <Stars className="absolute inset-x-0 top-0 h-[60%] opacity-70" />
          <LightAbove className="absolute -top-16 -left-[18%] hidden max-w-none opacity-40 md:block lg:-left-[8%]" />
          <LampBeam className="left-1/2 -translate-x-1/2 opacity-70 lg:left-[74%] lg:opacity-100" />
          <Beams className="hidden md:block" />
        </motion.div>
        <GridFloor className="-z-10" />
        <SparkField className="-z-10" />
        {/* vignette + bottom blend */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,transparent_40%,rgba(7,8,26,0.85)_100%)]"
        />
        <div
          aria-hidden="true"
          className="to-night pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-b from-transparent"
        />

        {/* ---------- Content ---------- */}
        <motion.div
          className="relative flex flex-1 origin-top flex-col pt-28 pb-6 sm:pt-32 lg:pt-32"
          style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
        >
          <Container className="grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <EyebrowPill>
                {person.role} · {person.ecsa}
              </EyebrowPill>

              <HeroHeadline
                text={person.tagline}
                highlight="backed by data"
                className="mt-6 text-[2.5rem] leading-[0.95] sm:text-6xl md:text-7xl xl:text-[5.4rem]"
              />

              <motion.p
                className="font-dm-mono mt-5 text-xs tracking-[0.22em] text-white/60 uppercase sm:text-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              >
                {person.name} · {person.location}
              </motion.p>

              <motion.p
                className="text-night-muted mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                {LEAD}
              </motion.p>

              <motion.p
                className="mt-4 flex flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:gap-3 sm:text-base"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
              >
                <span className="font-dm-mono text-[0.65rem] tracking-[0.2em] text-white/50 uppercase sm:text-xs">
                  Disciplines
                </span>
                <span aria-hidden="true" className="bg-flame hidden h-px w-8 shrink-0 sm:block" />
                <CategoryFlipper words={DISCIPLINES} className="font-semibold text-white" />
                <span className="sr-only">{DISCIPLINES.join(", ")}</span>
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
              >
                <Magnetic>
                  <ButtonLink href="/experience" variant="flame" className="h-12 px-7 text-[0.95rem]">
                    View experience
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/contact" variant="ghost-light" className="h-12 px-7 text-[0.95rem]">
                  Get in touch
                </ButtonLink>
              </motion.div>
            </div>

            <motion.div className="hidden justify-center lg:col-span-5 lg:flex" style={{ y: emblemY }}>
              <HeroEmblem className="w-full max-w-[30rem]" />
            </motion.div>
          </Container>

          <Container className="mt-12 lg:mt-10">
            <DashedRule className="mb-6" />
            <HeroStats />
            <ScrollCue className="mt-8" />
          </Container>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
