"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { navLinks, person } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE_OUT, isActivePath } from "@/components/layout/nav-utils";

const ORIGIN = "calc(100% - 2.75rem) 2.75rem";

/** Animated two-line hamburger that morphs into an X. */
export const MenuToggle = forwardRef<
  HTMLButtonElement,
  { open: boolean; controls: string; onToggle: () => void }
>(function MenuToggle({ open, controls, onToggle }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
      className="focus-visible:ring-lamp-orange relative grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:outline-none lg:hidden"
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -mt-px -ml-2.5 h-0.5 w-5 rounded-full bg-current"
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -mt-px -ml-2.5 h-0.5 w-5 rounded-full bg-current"
        initial={false}
        animate={
          open
            ? { y: 0, rotate: -45, width: 20 }
            : { y: 4, rotate: 0, width: 14 }
        }
        transition={{ duration: 0.3, ease: EASE_OUT }}
      />
    </button>
  );
});

/**
 * Full-screen night overlay menu (rendered under the navbar pill). Exposed as a modal
 * dialog; the navbar owns focus trapping, Escape and scroll lock.
 */
export const MobileMenu = forwardRef<
  HTMLDivElement,
  { id: string; onNavigate: () => void }
>(function MobileMenu({ id, onNavigate }, ref) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-lenis-prevent
      initial={
        reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }
      }
      animate={
        reduce ? { opacity: 1 } : { clipPath: `circle(150% at ${ORIGIN})` }
      }
      exit={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
      transition={{ duration: reduce ? 0.15 : 0.6, ease: [0.65, 0, 0.35, 1] }}
      className="bg-night fixed inset-0 z-40 overflow-x-hidden overflow-y-auto overscroll-contain text-white lg:hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="bg-grid-night absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] opacity-50" />
        <div className="bg-flame absolute -right-32 -bottom-32 size-96 rounded-full opacity-25 blur-[100px]" />
      </div>

      <div className="relative flex min-h-full flex-col px-6 pt-28 pb-10 sm:px-10">
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link, i) => {
              const active = isActivePath(pathname, link.href);
              return (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.06,
                    ease: EASE_OUT,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className="group focus-visible:ring-lamp-orange flex items-baseline gap-4 rounded-lg py-1.5 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="font-dm-mono text-night-muted text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[2.6rem] leading-none font-black tracking-tight transition-colors sm:text-6xl",
                        active
                          ? "text-flame"
                          : "group-hover:text-lamp-yellow group-focus-visible:text-lamp-yellow text-white",
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT }}
          className="mt-auto pt-12"
        >
          <Link
            href="/contact"
            onClick={onNavigate}
            className="bg-flame text-night inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            Get in touch <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>

          <div className="border-night-line mt-10 grid gap-6 border-t pt-8 text-sm sm:grid-cols-2">
            <div>
              <p className="font-dm-mono text-night-muted text-[0.7rem] tracking-[0.2em] uppercase">
                Based in
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-white/90">
                <IconMapPin aria-hidden="true" className="size-4" /> {person.location}
              </p>
            </div>
            <div>
              <p className="font-dm-mono text-night-muted text-[0.7rem] tracking-[0.2em] uppercase">
                Phone
              </p>
              <a
                href={`tel:${person.tel}`}
                className="hover:text-lamp-yellow focus-visible:ring-lamp-orange mt-2 inline-flex items-center gap-2 rounded text-white/90 focus-visible:ring-2 focus-visible:outline-none"
              >
                <IconPhone aria-hidden="true" className="size-4" /> {person.phone}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
              <a
                href={`mailto:${person.email}`}
                className="hover:text-lamp-yellow focus-visible:ring-lamp-orange inline-flex items-center gap-2 rounded text-white/90 focus-visible:ring-2 focus-visible:outline-none"
              >
                <IconMail aria-hidden="true" className="size-4" /> {person.email}
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="hover:text-lamp-yellow focus-visible:ring-lamp-orange grid size-9 place-items-center rounded-full border border-white/10 text-white/80 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <IconBrandLinkedin aria-hidden="true" className="size-5" />
              </a>
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="hover:text-lamp-yellow focus-visible:ring-lamp-orange grid size-9 place-items-center rounded-full border border-white/10 text-white/80 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <IconBrandGithub aria-hidden="true" className="size-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
