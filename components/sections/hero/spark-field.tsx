"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Canvas particle system: grinder-style sparks arcing up from below the fold
 * (white-hot -> yellow -> orange -> red) plus slow drifting embers.
 *
 * - Deterministic PRNG, initialised in an effect (SSR renders an empty canvas).
 * - Only animates while on screen and while the tab is visible.
 * - Respects prefers-reduced-motion (renders nothing).
 * - DPR capped at 2, pooled particles (no per-frame allocation of objects).
 */

type Spark = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  phase: number;
  hue: number;
};

type Emitter = {
  /** Position as a fraction of width; y is always just below the bottom edge. */
  fx: number;
  /** Base launch angle in radians (-PI/2 = straight up). */
  angle: number;
  spread: number;
  /** Sparks per frame at 60fps (average). */
  rate: number;
};

/** Mulberry32 — tiny deterministic PRNG. */
function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Heat ramp: white-hot -> lamp yellow -> lamp orange -> lamp red. */
const HEAT_STOPS: [number, number, number][] = [
  [255, 248, 225],
  [255, 210, 0],
  [247, 147, 30],
  [228, 24, 60],
];

const RAMP_STEPS = 48;
const HEAT_RAMP: string[] = Array.from({ length: RAMP_STEPS }, (_, i) => {
  const t = (i / (RAMP_STEPS - 1)) * (HEAT_STOPS.length - 1);
  const k = Math.min(Math.floor(t), HEAT_STOPS.length - 2);
  const f = t - k;
  const a = HEAT_STOPS[k];
  const b = HEAT_STOPS[k + 1];
  return `${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(
    a[1] + (b[1] - a[1]) * f,
  )},${Math.round(a[2] + (b[2] - a[2]) * f)}`;
});

const EMBER_COLORS = ["255,210,0", "247,147,30", "228,24,60"];

export function SparkField({
  className,
  seed = 2013,
}: {
  className?: string;
  /** PRNG seed — the same seed always produces the same choreography. */
  seed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rand = createRng(seed);

    let width = 0;
    let height = 0;
    let speedScale = 1;
    let emitters: Emitter[] = [];
    let sparks: Spark[] = [];
    let embers: Ember[] = [];

    // Pointer state (smoothed so the reaction stays subtle).
    const pointer = { x: -9999, y: -9999, active: 0, target: 0, nx: 0.5 };

    let raf = 0;
    let last = 0;
    let clock = 0;
    let nextBurst = 90;
    let inView = false;
    let running = false;

    const spawnEmber = (e: Ember, anywhere: boolean) => {
      e.x = rand() * width;
      e.y = anywhere ? rand() * height : height + 10 + rand() * 40;
      e.vx = (rand() - 0.5) * 0.25;
      e.vy = -(0.25 + rand() * 0.7);
      e.age = anywhere ? rand() * 200 : 0;
      e.life = 380 + rand() * 520;
      e.size = 0.6 + rand() * 1.8;
      e.phase = rand() * Math.PI * 2;
      e.hue = Math.floor(rand() * EMBER_COLORS.length);
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const desktop = width >= 1024;
      const tablet = width >= 640;
      // Sparks reach roughly the same share of the viewport at any height.
      speedScale = Math.sqrt(height / 900);

      emitters = desktop
        ? [
            { fx: 0.8, angle: -Math.PI * 0.63, spread: 0.32, rate: 3.2 },
            { fx: 0.06, angle: -Math.PI * 0.38, spread: 0.22, rate: 0.9 },
          ]
        : [{ fx: 0.92, angle: -Math.PI * 0.64, spread: 0.3, rate: tablet ? 1.8 : 1.1 }];

      const sparkCap = desktop ? 460 : tablet ? 240 : 140;
      const emberCap = desktop ? 70 : tablet ? 44 : 26;

      if (sparks.length !== sparkCap) {
        sparks = Array.from({ length: sparkCap }, () => ({
          alive: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          age: 0,
          life: 1,
          size: 1,
        }));
      }
      if (embers.length !== emberCap) {
        embers = Array.from({ length: emberCap }, () => {
          const e: Ember = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            age: 0,
            life: 1,
            size: 1,
            phase: 0,
            hue: 0,
          };
          spawnEmber(e, true);
          return e;
        });
      }
    };

    const emit = (em: Emitter, count: number) => {
      // Lean the fountain gently toward the pointer.
      const lean = (pointer.nx - 0.5) * 0.5 * pointer.active;
      let made = 0;
      for (let i = 0; i < sparks.length && made < count; i++) {
        const s = sparks[i];
        if (s.alive) continue;
        const angle = em.angle + lean + (rand() - 0.5) * 2 * em.spread;
        const speed = (10 + rand() * 11) * speedScale;
        s.alive = true;
        s.x = em.fx * width + (rand() - 0.5) * 14;
        s.y = height + 6;
        s.vx = Math.cos(angle) * speed;
        s.vy = Math.sin(angle) * speed;
        s.age = 0;
        s.life = 50 + rand() * 70;
        s.size = 0.7 + rand() * 1.5;
        made++;
      }
    };

    const step = (dt: number) => {
      clock += dt;
      pointer.active += (pointer.target - pointer.active) * Math.min(1, 0.05 * dt);

      // Pulsing intensity, like an angle grinder biting into steel.
      const pulse =
        0.45 + 0.55 * Math.abs(Math.sin(clock * 0.018) * Math.sin(clock * 0.007 + 1.3));
      for (const em of emitters) {
        const expected = em.rate * pulse * dt;
        let count = Math.floor(expected);
        if (rand() < expected - count) count++;
        if (count) emit(em, count);
      }
      nextBurst -= dt;
      if (nextBurst <= 0 && emitters[0]) {
        emit(emitters[0], 22 + Math.floor(rand() * 26));
        nextBurst = 120 + rand() * 180;
      }

      const gravity = 0.34 * speedScale;
      const drag = Math.pow(0.992, dt);
      const px = pointer.x;
      const py = pointer.y;
      const influence = pointer.active;

      for (const s of sparks) {
        if (!s.alive) continue;
        s.age += dt;
        s.vy += gravity * dt;
        s.vx *= drag;
        s.vy *= drag;
        if (influence > 0.01) {
          const dx = s.x - px;
          const dy = s.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22500) {
            const f = (1 - d2 / 22500) * 0.6 * influence * dt;
            const d = Math.sqrt(d2) || 1;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
          }
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.age >= s.life || s.y > height + 40 || s.x < -60 || s.x > width + 60) {
          s.alive = false;
        }
      }

      for (const e of embers) {
        e.age += dt;
        e.phase += 0.02 * dt;
        e.x += (e.vx + Math.sin(e.phase) * 0.25) * dt;
        e.y += e.vy * dt;
        if (influence > 0.01) {
          const dx = e.x - px;
          const dy = e.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 32400) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d2 / 32400) * 1.4 * influence * dt;
            e.x += (dx / d) * f;
            e.y += (dy / d) * f;
          }
        }
        if (e.age >= e.life || e.y < -20) spawnEmber(e, false);
      }
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // Embers: soft halo + core.
      for (const e of embers) {
        const lifeT = e.age / e.life;
        const fade = Math.min(1, e.age / 40) * (1 - lifeT);
        const flicker = 0.55 + 0.45 * Math.sin(e.phase * 3.1);
        const alpha = fade * flicker;
        if (alpha <= 0.01) continue;
        const c = EMBER_COLORS[e.hue];
        ctx.fillStyle = `rgba(${c},${(alpha * 0.12).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${c},${(alpha * 0.85).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks: streaks along velocity with a glow pass.
      for (const s of sparks) {
        if (!s.alive) continue;
        const t = s.age / s.life;
        const alpha = Math.pow(1 - t, 0.9);
        if (alpha <= 0.02) continue;
        const color = HEAT_RAMP[Math.min(RAMP_STEPS - 1, Math.floor(t * RAMP_STEPS))];
        const tail = 2.4;
        const x0 = s.x - s.vx * tail;
        const y0 = s.y - s.vy * tail;

        ctx.strokeStyle = `rgba(${color},${(alpha * 0.16).toFixed(3)})`;
        ctx.lineWidth = s.size * 4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        ctx.strokeStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.lineWidth = s.size * (1 - t * 0.5);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = inView && !document.hidden && !motionQuery.matches;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (motionQuery.matches) ctx.clearRect(0, 0, width, height);
    };

    setup();

    const resizeObserver = new ResizeObserver(() => {
      setup();
      if (!running && !motionQuery.matches) draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.nx = Math.min(1, Math.max(0, pointer.x / Math.max(1, width)));
      pointer.target =
        pointer.y >= 0 && pointer.y <= height && pointer.x >= 0 && pointer.x <= width ? 1 : 0;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
