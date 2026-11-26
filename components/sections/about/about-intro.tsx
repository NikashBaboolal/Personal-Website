import { IconArrowUpRight } from "@tabler/icons-react";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { about, person } from "@/lib/content";
import { HighlightCards } from "./highlight-cards";
import { ScrollLitText } from "./scroll-text";
import { StatsRow } from "./stats-row";

/** Home: personal statement that lights up word-by-word on scroll + stats + result highlights. */
export function AboutIntro() {
  return (
    <section id="about" className="bg-background relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        className="bg-grid-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
      />
      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal y={10} blur={4}>
            <span className="font-dm-mono text-muted-foreground inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
              <span className="bg-flame inline-block size-1.5 rounded-full" />
              About me
            </span>
          </Reveal>
          <Reveal y={10} blur={4} delay={0.1}>
            <span className="font-dm-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {person.ecsa} · {person.location}
            </span>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
          <ScrollLitText
            text={about[0]}
            highlight={["Process", "Engineer", "analytics", "cost", "savings"]}
            className="font-display text-foreground text-[1.7rem] leading-[1.12] font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:col-span-9 xl:text-[3.4rem]"
          />
          <Reveal delay={0.2} className="flex flex-col items-start gap-5 lg:col-span-3 lg:items-end lg:text-right">
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">{about[1]}</p>
            <ButtonLink href="/about" variant="outline" className="w-fit">
              My story
              <IconArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </ButtonLink>
          </Reveal>
        </div>

        <StatsRow className="mt-16 md:mt-20" />
        <HighlightCards className="mt-4" />
      </Container>
    </section>
  );
}
