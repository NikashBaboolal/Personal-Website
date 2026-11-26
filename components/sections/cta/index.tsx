import { IconArrowRight, IconBrandLinkedin, IconMail, IconPhone } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { ButtonLink, buttonClasses } from "@/components/button";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { LogoMark } from "@/components/brand/logo";
import { person } from "@/lib/content";
import { CtaBackground } from "./cta-background";

/** NIGHT closing section rendered right before the footer. */
export function CtaSection() {
  return (
    <section
      id="cta"
      className="bg-night relative isolate overflow-hidden py-28 text-white md:py-40"
    >
      <CtaBackground />

      {/* LogoMark watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] mix-blend-screen"
      >
        <LogoMark className="size-[26rem] md:size-[40rem]" />
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        <Reveal y={10} blur={4}>
          <span className="font-dm-mono text-night-muted inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-[0.2em] uppercase backdrop-blur">
            <span className="relative flex size-2">
              <span className="bg-lamp-orange animate-pulse-ring absolute inset-0 rounded-full" />
              <span className="bg-lamp-yellow relative size-2 rounded-full" />
            </span>
            Open to new opportunities
          </span>
        </Reveal>

        <h2 className="font-display mt-8 max-w-5xl text-5xl leading-[0.95] font-black tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]">
          <TextReveal text="Let's work" />{" "}
          <TextReveal
            text="together"
            delay={0.2}
            wordClassName="text-flame animate-flame-shift"
          />
        </h2>

        <Reveal delay={0.25} className="mt-8 max-w-2xl">
          <p className="text-night-muted text-base leading-relaxed text-pretty md:text-lg">
            Process optimisation, root cause analysis, process safety or data-driven reporting: if
            you have a plant problem worth solving, I&apos;d like to hear about it.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/contact" variant="flame" className="h-12 w-full px-7 text-base sm:w-auto">
            Get in touch
            <IconArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover/btn:translate-x-1"
            />
          </ButtonLink>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost-light", "h-12 w-full px-7 text-base sm:w-auto")}
          >
            <IconBrandLinkedin aria-hidden="true" className="size-4" />
            Connect on LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        <Reveal delay={0.45} className="mt-10">
          <ul className="text-night-muted flex flex-col items-center gap-x-8 gap-y-3 text-sm sm:flex-row">
            <li>
              <a
                href={`mailto:${person.email}`}
                className="focus-visible:ring-lamp-orange inline-flex items-center gap-2 rounded-full transition-colors outline-none hover:text-white focus-visible:ring-2"
              >
                <IconMail aria-hidden="true" className="size-4" />
                {person.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${person.tel}`}
                className="focus-visible:ring-lamp-orange inline-flex items-center gap-2 rounded-full transition-colors outline-none hover:text-white focus-visible:ring-2"
              >
                <IconPhone aria-hidden="true" className="size-4" />
                {person.phone}
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
