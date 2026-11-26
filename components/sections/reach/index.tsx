import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { GlobeCanvas } from "./globe-canvas";
import { LocationCards } from "./location-cards";
import { globeSites } from "./sites";

/** NIGHT section: interactive cobe globe with the places that shaped my career + place cards. */
export function ReachGlobe({ className }: { className?: string }) {
  return (
    <section
      id="reach"
      className={cn("bg-night relative overflow-hidden py-24 text-white md:py-32", className)}
    >
      {/* Decorative backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid-night absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_70%)] opacity-60" />
        <div className="absolute top-1/2 left-[28%] size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,63,182,0.22),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="relative mx-auto w-full max-w-[640px]">
              <GlobeCanvas />
            </div>
            <ul
              className="font-dm-mono text-night-muted mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-[0.18em] uppercase"
              aria-label="Map legend"
            >
              {globeSites.map((o) => (
                <li key={o.id} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: o.css }} />
                  {o.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 flex flex-col gap-10 lg:order-2 lg:col-span-5">
            <SectionHeading
              eyebrow="Where I've worked and studied"
              title="From Richards Bay to Braunschweig"
              lead="Schooled in Richards Bay, trained as a chemical engineer in Cape Town, and researching lithium-ion batteries in Germany."
              tone="light"
            />
            <LocationCards />
          </div>
        </div>
      </Container>
    </section>
  );
}
