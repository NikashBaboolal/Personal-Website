import { Suspense } from "react";
import { IconCertificate } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion/reveal";
import { person } from "@/lib/content";
import { ContactCards } from "./contact-cards";
import { ContactForm, ContactFormWithParams } from "./contact-form";

function SideHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="font-dm-mono text-muted-foreground inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
        <span className="bg-flame inline-block size-1.5 rounded-full" />
        {eyebrow}
      </p>
      <h2 className="font-display text-foreground mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

/** /contact page body: mailto form plus direct contact cards. */
export function ContactSection() {
  return (
    <section id="contact" className="bg-background relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        className="bg-grid-light pointer-events-none absolute inset-x-0 top-0 h-[40rem] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <Reveal className="lg:col-span-7">
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithParams />
            </Suspense>
          </Reveal>

          <aside className="flex flex-col gap-8 lg:col-span-5" aria-label="Direct contact details">
            <div>
              <SideHeading eyebrow="Reach me directly" title="Contact details" />
              <ContactCards />
            </div>

            <Reveal delay={0.1}>
              <div className="bg-night border-night-line relative overflow-hidden rounded-3xl border p-6 text-white">
                <div
                  aria-hidden="true"
                  className="bg-flame pointer-events-none absolute -right-16 -bottom-16 size-48 rounded-full opacity-20 blur-3xl"
                />
                <div className="relative flex items-start gap-4">
                  <IconCertificate aria-hidden="true" className="text-lamp-yellow size-6 shrink-0" />
                  <p className="text-night-muted text-sm leading-relaxed">
                    <span className="font-semibold text-white">{person.name}</span>, {person.role}{" "}
                    and {person.ecsa}, based in {person.location}.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>
    </section>
  );
}
