"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/button";
import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MenuToggle, MobileMenu } from "@/components/layout/mobile-menu";
import { EASE_OUT, FOCUSABLE } from "@/components/layout/nav-utils";
import { lockScroll, unlockScroll } from "@/components/layout/scroll-control";

const MOBILE_MENU_ID = "mobile-menu";

/**
 * Fixed site navbar. Transparent over the night hero, morphs into a floating
 * dark-glass pill on scroll, hides on scroll down / reappears on scroll up.
 */
export function Navbar() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    setScrolled(latest > 24);
    if (latest < 140) setHidden(false);
    else if (latest > previous + 2) setHidden(true);
    else if (latest < previous - 2) setHidden(false);
  });

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Mobile menu: scroll lock, initial focus, focus trap, Escape, auto-close at lg.
  useEffect(() => {
    if (!mobileOpen) return;
    lockScroll();
    const toggle = toggleRef.current;
    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    }, 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggle?.focus();
        return;
      }
      if (e.key !== "Tab" || !toggle || !menuRef.current) return;
      const items = [toggle, ...menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const index = items.indexOf(document.activeElement as HTMLElement);
      const last = items.length - 1;
      if (index === -1) {
        e.preventDefault();
        items[0].focus();
      } else if (e.shiftKey && index === 0) {
        e.preventDefault();
        items[last].focus();
      } else if (!e.shiftKey && index === last) {
        e.preventDefault();
        items[0].focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      unlockScroll();
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;
  const isHidden = hidden && !mobileOpen;

  return (
    <MotionConfig reducedMotion="user">
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
        onFocusCapture={() => setHidden(false)}
      >
        <motion.div
          initial={false}
          animate={{ y: isHidden ? "-140%" : "0%" }}
          transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
        >
          <div
            className={cn(
              "pointer-events-auto relative mx-auto flex h-16 items-center justify-between gap-3 rounded-full border transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-out",
              solid
                ? "bg-night/70 max-w-5xl border-white/10 pr-2 pl-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150 sm:pl-5"
                : "max-w-container border-transparent bg-transparent pr-1 pl-2 sm:pr-3 sm:pl-4",
            )}
          >
            <Link
              href="/"
              aria-label="Nikash Baboolal, home"
              onClick={closeMobile}
              className="shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none"
            >
              <Logo tone="light" className="h-9 sm:h-10" />
            </Link>

            <DesktopNav />

            <div className="flex items-center gap-2">
              <ButtonLink
                href="/contact"
                variant="flame"
                className="hidden h-10 px-5 sm:inline-flex"
                onClick={closeMobile}
              >
                Get in touch
                <IconArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover/btn:translate-x-0.5"
                />
              </ButtonLink>
              <MenuToggle
                ref={toggleRef}
                open={mobileOpen}
                controls={MOBILE_MENU_ID}
                onToggle={() => setMobileOpen((open) => !open)}
              />
            </div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <MobileMenu ref={menuRef} id={MOBILE_MENU_ID} onNavigate={closeMobile} />
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
