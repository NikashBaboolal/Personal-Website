"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";

/** Deterministic drips from the stuck valve (no Math.random -> no hydration mismatch). */
const DRIPS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: ((i * 37) % 90) - 45,
  fall: 140 + ((i * 53) % 120),
  delay: (i * 0.41) % 3,
  duration: 1.1 + ((i * 13) % 6) / 10,
  size: 4 + ((i * 7) % 4),
}));

function ValveWheel({ animate }: { animate: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="inline-block size-[0.74em] align-[-0.02em] drop-shadow-[0_0_30px_rgba(45,212,191,0.45)]"
      aria-hidden="true"
      // Someone keeps trying to open it... it's stuck.
      initial={{ rotate: 0 }}
      animate={animate ? { rotate: [0, 28, 18, 34, -4, 0] } : { rotate: 0 }}
      transition={
        animate
          ? { duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }
          : { duration: 0.3 }
      }
    >
      <defs>
        <linearGradient id="nf-wheel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="0.45" stopColor="#2dd4bf" />
          <stop offset="0.8" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#nf-wheel)" strokeWidth="9" />
      {[0, 60, 120].map((deg) => (
        <rect
          key={deg}
          x="46"
          y="10"
          width="8"
          height="80"
          rx="4"
          fill="url(#nf-wheel)"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="#06141b" stroke="url(#nf-wheel)" strokeWidth="6" />
      <circle cx="50" cy="50" r="3.5" fill="#f5a524" />
    </motion.svg>
  );
}

function Digit({ children, animate, delay }: { children: string; animate: boolean; delay: number }) {
  return (
    <motion.span
      className="text-flame animate-flame-shift inline-block"
      initial={{ opacity: 1 }}
      animate={animate ? { opacity: [1, 1, 0.35, 1, 0.7, 1, 1] } : { opacity: 1 }}
      transition={
        animate
          ? {
              duration: 1.1,
              times: [0, 0.4, 0.45, 0.5, 0.6, 0.66, 1],
              repeat: Infinity,
              repeatDelay: 3.2,
              delay,
            }
          : { duration: 0.2 }
      }
    >
      {children}
    </motion.span>
  );
}

export function NotFoundScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  // Loops run only while the scene is on screen and motion is allowed.
  const animate = inView && !reduce;

  return (
    <section
      ref={ref}
      className="bg-night relative isolate flex min-h-[100svh] items-center overflow-hidden py-24 text-white md:py-32">
      {/* Decorative backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid-night mask-fade-y absolute inset-0 opacity-60" />
        <div className="bg-flame absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]" />
        <div className="bg-lamp-blue absolute -bottom-40 -left-40 size-[28rem] rounded-full opacity-20 blur-[120px]" />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <p className="font-dm-mono text-night-muted text-xs tracking-[0.3em] uppercase">
          Error 404 · Page not found
        </p>

        <div className="relative mt-6">
          {/* The stuck valve is weeping: process fluid drips from the packing */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[62%] left-1/2 size-0"
          >
            {DRIPS.map((drip) => (
              <motion.span
                key={drip.id}
                className="from-lamp-yellow to-lamp-red absolute top-0 left-0 block rounded-full rounded-tl-none bg-linear-to-b"
                style={{ width: drip.size, height: drip.size, x: drip.x, rotate: 45 }}
                initial={{ opacity: 0, y: 0 }}
                animate={
                  animate
                    ? { opacity: [0, 1, 0], y: [0, 6, drip.fall] }
                    : { opacity: 0, y: 0 }
                }
                transition={
                  animate
                    ? {
                        duration: drip.duration,
                        delay: drip.delay,
                        repeat: Infinity,
                        repeatDelay: 1.4,
                        ease: "easeIn",
                        times: [0, 0.3, 1],
                      }
                    : { duration: 0 }
                }
              />
            ))}
          </div>

          <h1 className="font-display relative text-[8.5rem] leading-none font-black tracking-tighter sm:text-[12rem] md:text-[15rem]">
            <span className="sr-only">404: page not found</span>
            <span aria-hidden="true" className="inline-flex items-center gap-[0.04em]">
              <Digit animate={animate} delay={0}>
                4
              </Digit>
              <ValveWheel animate={animate} />
              <Digit animate={animate} delay={0.35}>
                4
              </Digit>
            </span>
          </h1>
        </div>

        <p className="font-display mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          This valve is closed.
        </p>
        <p className="text-night-muted mt-4 max-w-xl text-base sm:text-lg">
          The page you&apos;re after has been shut off, moved or never left the pilot plant. Let&apos;s
          get things flowing again.
        </p>

        <nav
          aria-label="Helpful links"
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/" variant="flame">
            Back to home
          </ButtonLink>
          <ButtonLink href="/experience" variant="ghost-light">
            View experience
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Get in touch
          </ButtonLink>
        </nav>
      </Container>
    </section>
  );
}
