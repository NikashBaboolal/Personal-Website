"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { setLenis } from "@/components/layout/scroll-control";

/**
 * Lenis smooth scrolling for the whole document. Disabled for
 * prefers-reduced-motion (native scrolling). Handles in-page anchor links.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -88 },
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
