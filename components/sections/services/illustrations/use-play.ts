"use client";

import { useId, useSyncExternalStore, type RefObject } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/** True while the browser tab is visible (always true on the server). */
export function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
}

/**
 * Drives looping illustration animations:
 * - `play` is true only while the element is in view, the tab is visible and
 *   reduced motion is off. Illustrations animate to their resting (final)
 *   state when `play` is false, so nothing loops off-screen.
 * - `reduce` lets callers render the static final state from the start.
 */
export function usePlay(ref: RefObject<Element | null>, amount = 0.25) {
  const inView = useInView(ref, { amount });
  const reduce = useReducedMotion() ?? false;
  const visible = usePageVisible();
  return { play: inView && visible && !reduce, reduce };
}

/** SVG-safe unique id prefix for gradients / patterns / clip paths. */
export function useSvgId(prefix: string) {
  const raw = useId();
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/** Deterministic PRNG (mulberry32) so decorative randomness is SSR-safe. */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to 2 decimals so server/client SVG attribute strings match. */
export const r2 = (n: number) => Math.round(n * 100) / 100;
