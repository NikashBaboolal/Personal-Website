"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * Hydration-safe replacement for motion's `useReducedMotion`.
 * Returns `false` on the server and during hydration (so server and client markup match),
 * then the real `prefers-reduced-motion` preference, with live updates.
 * Motion's own transform animations are additionally disabled for these users via
 * `<MotionConfig reducedMotion="user">` in the root providers.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
