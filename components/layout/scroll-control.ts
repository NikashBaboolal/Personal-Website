import type Lenis from "lenis";

/**
 * Tiny module-level handle on the active Lenis instance so chrome components
 * (mobile menu scroll-lock, back-to-top) can talk to it without a context.
 * Only touched from effects / event handlers, never during render.
 */
let instance: Lenis | null = null;
let lockCount = 0;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  document.documentElement.style.overflow = "";
  instance?.start();
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.4 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
