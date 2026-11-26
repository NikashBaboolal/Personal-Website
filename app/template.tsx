"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * Set after the first page has mounted. The very first (server-rendered) page
 * is shown immediately so LCP isn't delayed; only client-side navigations get
 * the transition. Mutated in an effect only, so it never affects SSR output.
 */
const navigation = { hasMounted: false };

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Route transition: a night panel with a flame leading edge wipes up and away
 * while the new page fades/slides in. Transform/opacity only (no layout shift);
 * the wipe is fixed + pointer-events-none. Skipped for reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [animate] = useState(() => navigation.hasMounted);
  const play = animate && !reduce;

  useEffect(() => {
    navigation.hasMounted = true;
  }, []);

  return (
    <>
      {play ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 flex flex-col"
          initial={{ y: "0%" }}
          animate={{ y: "-105%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="bg-night flex-1" />
          <div className="bg-flame h-2 shadow-[0_0_40px_10px_rgba(45,212,191,0.45)]" />
        </motion.div>
      ) : null}
      <motion.div
        initial={play ? { opacity: 0, y: 28 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: play ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
