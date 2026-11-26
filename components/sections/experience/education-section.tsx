import { GraduationCap } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { education } from "@/lib/content";
import { cn } from "@/lib/utils";

/** NIGHT section: education cards, current study first. */
export function EducationSection({ className, id = "education" }: { className?: string; id?: string }) {
  return (
    <section id={id} className={cn("bg-night relative overflow-hidden py-24 text-white md:py-32", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid-night absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)] opacity-40" />
        <div className="absolute -top-40 left-[-10%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.12),transparent_60%)]" />
      </div>
      <Container className="relative">
        <SectionHeading
          eyebrow="Education"
          title="Chemical engineering, now financial engineering"
          lead="An honours degree in Chemical Engineering from the University of Cape Town, and an MSc in Financial Engineering under way at WorldQuant University."
          tone="light"
        />
        <RevealGroup className="mt-14 grid gap-4 md:mt-16 lg:grid-cols-3" stagger={0.1}>
          {education.map((ed, i) => (
            <RevealItem key={ed.slug} className="h-full">
              <article className="group border-night-line bg-night-2/70 relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 sm:p-7">
                <span
                  aria-hidden="true"
                  className="bg-flame pointer-events-none absolute -top-24 -right-24 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center bg-teal-400/15 [clip-path:polygon(50%_0,93.3%_25%,93.3%_75%,50%_100%,6.7%_75%,6.7%_25%)]">
                    <GraduationCap aria-hidden="true" className="size-5 text-teal-300" />
                  </span>
                  <span className="font-dm-mono text-night-muted text-[11px] tracking-[0.18em] uppercase">
                    {ed.start ? `${ed.start} – ${ed.end}` : ed.end}
                  </span>
                </div>
                {i === 0 ? (
                  <span className="font-dm-mono mt-5 text-cyan-300 text-[10px] tracking-[0.2em] uppercase">
                    In progress
                  </span>
                ) : null}
                <h3 className={cn("font-display text-xl font-extrabold tracking-tight sm:text-2xl", i === 0 ? "mt-1.5" : "mt-5")}>
                  {ed.qualification}
                </h3>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  {ed.institution}
                  {ed.place ? <span className="text-night-muted font-normal"> · {ed.place}</span> : null}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {ed.points.map((p) => (
                    <li key={p} className="text-night-muted flex gap-2.5 text-sm leading-relaxed">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 rounded-[1px] bg-teal-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
