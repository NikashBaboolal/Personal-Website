import Link from "next/link";
import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCertificate,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/brand/logo";
import { navLinks, person, summary } from "@/lib/content";
import { MoleculeLattice } from "@/components/layout/process-art";
import { BackToTop } from "@/components/layout/back-to-top";
import { FooterWordmark } from "@/components/layout/footer-wordmark";

const linkClass =
  "group inline-flex items-center gap-1.5 rounded text-sm text-white/75 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-dm-mono text-night-muted text-[0.7rem] tracking-[0.2em] uppercase">
      {children}
    </h2>
  );
}

/** Site footer (server component, so the copyright year is rendered once on the server). */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night relative isolate overflow-hidden text-white">
      {/* Decorative backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-night absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-teal-400/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_50%_at_80%_0%,black,transparent)]">
          <MoleculeLattice opacity={0.12} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <Container className="pt-20 md:pt-28">
        {/* CTA band */}
        <div className="border-night-line flex flex-col gap-8 border-b pb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-dm-mono text-lamp-orange text-xs tracking-[0.2em] uppercase">
              {person.name} · {person.role}
            </p>
            <p className="font-display mt-4 text-4xl leading-[1.05] font-black tracking-tight md:text-6xl">
              {person.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="flame">
              Get in touch
              <IconArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-0.5"
              />
            </ButtonLink>
            <ButtonLink href="/experience" variant="ghost-light">
              View experience
            </ButtonLink>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              aria-label="Nikash Baboolal, home"
              className="w-fit rounded-full focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:outline-none"
            >
              <Logo tone="light" />
            </Link>
            <p className="text-night-muted max-w-md text-sm leading-relaxed">{summary.split(". ")[0]}.</p>
            <div className="flex flex-wrap gap-2">
              <span className="border-lamp-yellow/30 bg-lamp-yellow/10 text-lamp-yellow inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                <IconCertificate aria-hidden="true" className="size-4" />
                {person.ecsa}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                {person.disciplines.join(" · ")}
              </span>
            </div>
          </div>

          <nav aria-labelledby="footer-nav" className="flex flex-col gap-5 lg:col-span-3">
            <ColumnTitle>
              <span id="footer-nav">Navigate</span>
            </ColumnTitle>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-5 lg:col-span-4">
            <ColumnTitle>Contact</ColumnTitle>
            <address className="flex flex-col gap-3 text-sm not-italic">
              <span className="text-night-muted inline-flex items-center gap-2">
                <IconMapPin aria-hidden="true" className="size-4 shrink-0" />
                {person.location}
              </span>
              <a href={`mailto:${person.email}`} className={linkClass}>
                <IconMail aria-hidden="true" className="size-4" />
                {person.email}
              </a>
              <a href={`tel:${person.tel}`} className={linkClass}>
                <IconPhone aria-hidden="true" className="size-4" />
                {person.phone}
              </a>
            </address>
          </div>
        </div>

        {/* Social strip */}
        <div className="border-night-line flex flex-col gap-6 border-t py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <IconBrandLinkedin aria-hidden="true" className="size-4" />
              <span>
                {person.linkedinHandle}
                <span className="sr-only"> on LinkedIn (opens in a new tab)</span>
              </span>
            </a>
            <a href={person.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <IconBrandGithub aria-hidden="true" className="size-4" />
              <span>
                NikashBaboolal
                <span className="sr-only"> on GitHub (opens in a new tab)</span>
              </span>
            </a>
          </div>
          <BackToTop />
        </div>

        <div className="text-night-muted flex flex-col gap-2 pb-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {person.name}. All rights reserved.
          </p>
          <p>{person.location}</p>
        </div>
      </Container>

      <div className="px-2 sm:px-4">
        <FooterWordmark />
      </div>
    </footer>
  );
}
