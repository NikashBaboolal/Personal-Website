import { IconShieldCheck } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { certifications } from "@/lib/content";
import { cn } from "@/lib/utils";
import { BadgeCard } from "./badge-card";
import { Medallion } from "./medallion";

/** Short text for each embossed seal face (big mark + optional sub-line). */
const SEAL: Record<string, string> = {
  ECSA: "ECSA",
  "OHSA & MHSA": "OHSA MHSA",
  "Process Safety": "UC Davis",
  IBM: "IBM",
  Google: "Google",
  "Lean Six Sigma": "Six Sigma",
  "McKinsey Forward": "McKinsey Forward",
};

const CHIPS = ["Process safety", "Data science", "Project management", "Lean Six Sigma"] as const;

/** NIGHT section: licences and certifications as embossed seals, plus a featured ECSA medallion. */
export function Certifications({ className }: { className?: string }) {
  return (
    <section
      id="certifications"
      className={cn("bg-night relative overflow-hidden py-24 text-white md:py-32", className)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid-night absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)] opacity-40" />
        <div className="absolute -top-40 right-[-10%] size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.14),transparent_60%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_60%)]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <SectionHeading
              eyebrow="Licences & certifications"
              title="Registered, certified and still learning"
              lead="A Candidate Engineer with the Engineering Council of South Africa, with certifications spanning process safety and legal liability, data science, project management and Lean Six Sigma."
              tone="light"
            />
            <Reveal delay={0.2}>
              <ul className="flex flex-wrap gap-2.5">
                {[...CHIPS, `${certifications.length} credentials`].map((chip) => (
                  <li
                    key={chip}
                    className="font-dm-mono border-night-line text-night-muted inline-flex items-center gap-2 rounded-full border bg-white/[0.03] px-3.5 py-1.5 text-[11px] tracking-[0.16em] uppercase"
                  >
                    <IconShieldCheck aria-hidden="true" className="text-lamp-yellow size-3.5" />
                    {chip}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5" delay={0.1} y={32}>
            <Medallion />
          </Reveal>
        </div>

        <RevealGroup
          className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-4 lg:grid-cols-7"
          stagger={0.07}
        >
          {certifications.map((c, i) => (
            <RevealItem key={c.code} className="h-full">
              <BadgeCard
                code={c.label}
                seal={SEAL[c.code] ?? c.code}
                label={c.issuer}
                index={i}
                tone={i % 2 === 0 ? "brass" : "steel"}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
