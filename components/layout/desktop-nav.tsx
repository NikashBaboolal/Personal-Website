"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { navLinks } from "@/lib/content";
import { cn } from "@/lib/utils";
import { isActivePath } from "@/components/layout/nav-utils";

const PILL_SPRING = { type: "spring", bounce: 0.18, duration: 0.5 } as const;

/** Desktop link row: shared-layout hover pill and active-route flame underline. */
export function DesktopNav() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              onBlur={() => setHovered(null)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none",
                active ? "text-white" : "text-white/70 hover:text-white",
              )}
            >
              {hovered === link.href ? (
                <motion.span
                  layoutId="nav-hover-pill"
                  transition={PILL_SPRING}
                  className="absolute inset-0 rounded-full bg-white/10"
                />
              ) : null}
              {active ? (
                <motion.span
                  layoutId="nav-active-indicator"
                  transition={PILL_SPRING}
                  className="bg-flame absolute inset-x-4 bottom-0.5 h-[2px] rounded-full"
                />
              ) : null}
              <span className="relative z-10">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
