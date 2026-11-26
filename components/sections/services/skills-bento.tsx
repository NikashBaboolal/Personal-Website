import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/button";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { skillGroups } from "@/lib/content";
import { cn } from "@/lib/utils";
import { skillVisuals } from "./illustrations";
import { SkillsMarquee } from "./skills-marquee";
import { TiltCard } from "./tilt-card";

/** Grid placement per card (12-col on lg, 2-col on md). */
const LAYOUT: Record<string, { cell: string; art: string }> = {
  data: { cell: "md:col-span-2 lg:col-span-7", art: "h-60 sm:h-72" },
  "process-optimisation": { cell: "lg:col-span-5", art: "h-64 sm:h-72" },
  "process-safety": { cell: "lg:col-span-4", art: "h-64 sm:h-72" },
  documentation: { cell: "lg:col-span-4", art: "h-56 sm:h-64" },
  "project-management": { cell: "md:col-span-2 lg:col-span-4", art: "h-56 sm:h-64" },
};

const FALLBACK = { cell: "lg:col-span-4", art: "h-56" };

/** "What I do" bento: skill groups with animated illustrations, tags and a core-skills marquee. */
export function SkillsBento({
  className,
  id = "skills",
  showLink = true,
}: {
  className?: string;
  id?: string;
  /** Show the "More about me" button (hide it on the About page itself). */
  showLink?: boolean;
}) {
  return (
    <section id={id} className={cn("bg-background relative overflow-hidden py-24 md:py-32", className)}>
      <div
        aria-hidden="true"
        className="bg-grid-light mask-fade-y pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60"
      />
      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What I do"
            title="Engineering, safety and data in one toolkit"
            lead="Process optimisation and continuous improvement, grounded in process safety and driven by data, from the plant floor to the dashboard."
          />
          {showLink ? (
            <ButtonLink href="/about" variant="outline" className="shrink-0 self-start lg:self-end">
              More about me
              <ArrowUpRight
                className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
          ) : null}
        </div>

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-4 [perspective:1600px] md:mt-16 md:grid-cols-2 lg:grid-cols-12"
          stagger={0.1}
        >
          {skillGroups.map((skill, i) => {
            const visual = skillVisuals[skill.slug];
            const layout = LAYOUT[skill.slug] ?? FALLBACK;
            const tone = visual?.tone ?? (i % 2 === 0 ? "night" : "light");
            const night = tone === "night";
            const Illustration = visual?.Illustration;
            return (
              <RevealItem key={skill.slug} className={cn("min-w-0", layout.cell)}>
                <TiltCard tone={tone} className="h-full">
                  {Illustration ? (
                    <div className={cn("relative overflow-hidden px-4 pt-4 sm:px-5 sm:pt-5", layout.art)}>
                      <Illustration />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-3 p-6 pt-5 sm:p-7 sm:pt-5">
                    <div className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          "font-dm-mono text-xs tracking-[0.2em]",
                          night ? "text-lamp-orange" : "text-lamp-red",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
                        {skill.title}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        "max-w-md text-sm leading-relaxed",
                        night ? "text-night-muted" : "text-muted-foreground",
                      )}
                    >
                      {skill.description}
                    </p>
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label={`${skill.title} skills`}>
                      {skill.tags.map((tag) => (
                        <li
                          key={tag}
                          className={cn(
                            "font-dm-mono rounded-full border px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase",
                            night
                              ? "border-night-line text-white/75 bg-white/[0.04]"
                              : "border-line text-muted-foreground bg-white",
                          )}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>

      <SkillsMarquee className="mt-16 md:mt-20" />
    </section>
  );
}
