import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { getMedia, type MediaKey } from "@/lib/media";
import { PageHeroBackdrop } from "@/components/layout/page-hero-backdrop";

/**
 * Night inner-page hero: breadcrumb, eyebrow, revealed h1, lead and an
 * optional children slot (e.g. CTAs) over an animated photo/grid backdrop.
 * Top padding clears the fixed navbar.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Optional background photo key from lib/media.ts. */
  image?: MediaKey;
  /** Optional extra content (e.g. CTA buttons) rendered under the lead. */
  children?: React.ReactNode;
}) {
  const media = image ? getMedia(image) : undefined;

  return (
    <section className="bg-night relative isolate overflow-hidden pt-36 pb-20 text-white md:pt-44 md:pb-28">
      <PageHeroBackdrop media={media} />

      <Container className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="font-dm-mono text-night-muted flex flex-wrap items-center gap-1.5 text-[0.7rem] tracking-[0.2em] uppercase">
            <li>
              <Link
                href="/"
                className="rounded transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <IconChevronRight className="size-3" />
            </li>
            <li aria-current="page" className="text-white/90">
              {eyebrow}
            </li>
          </ol>
        </nav>

        <div className="mt-10 max-w-4xl md:mt-14">
          <Reveal>
            <p className="font-dm-mono text-lamp-orange inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase">
              <span aria-hidden="true" className="bg-flame h-px w-8" />
              {eyebrow}
            </p>
          </Reveal>
          <h1 className="font-display mt-5 text-5xl leading-[0.98] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            <TextReveal text={title} delay={0.1} />
          </h1>
          {lead ? (
            <Reveal delay={0.25}>
              <p className="text-night-muted mt-7 max-w-2xl text-lg leading-relaxed md:text-xl">
                {lead}
              </p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={0.35}>
              <div className="mt-9">{children}</div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
