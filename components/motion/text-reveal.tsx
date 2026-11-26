"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Word-by-word masked rise. Render inside a heading:
 * <h2><TextReveal text="Built for industry" /></h2>
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.05,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "div";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={cn("inline", className)}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
