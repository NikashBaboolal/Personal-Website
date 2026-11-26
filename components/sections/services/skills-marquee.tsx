"use client";

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/kibo-ui/marquee";
import { coreSkills } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Infinite chip marquee of the CV's core skills (static list for screen readers). */
export function SkillsMarquee({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <h3 className="sr-only">Core skills</h3>
      <ul className="sr-only">
        {coreSkills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Marquee aria-hidden="true">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent speed={36}>
          {coreSkills.map((skill) => (
            <MarqueeItem key={skill}>
              <span className="border-line text-foreground inline-flex items-center gap-2.5 rounded-full border bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-[0_6px_20px_-12px_rgba(11,12,31,0.25)]">
                <span aria-hidden="true" className="bg-flame size-1.5 rounded-full" />
                {skill}
              </span>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
