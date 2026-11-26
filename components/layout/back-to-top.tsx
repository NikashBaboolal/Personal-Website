"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { scrollToTop } from "@/components/layout/scroll-control";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTop();
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="group inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pr-1.5 pl-4 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none"
    >
      Back to top
      <span className="bg-flame text-night grid size-8 place-items-center rounded-full">
        <IconArrowUp
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      </span>
    </button>
  );
}
