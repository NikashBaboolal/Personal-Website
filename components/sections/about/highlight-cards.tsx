import { IconChartLine, IconCoins, IconTrendingUp } from "@tabler/icons-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { highlights } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS = [IconCoins, IconTrendingUp, IconChartLine] as const;

/** Three result cards (savings, yield, automation) from the CV. */
export function HighlightCards({ className }: { className?: string }) {
  return (
    <RevealGroup className={cn("grid gap-4 md:grid-cols-3", className)} stagger={0.08}>
      {highlights.map((h, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <RevealItem key={h.title} className="h-full">
            <article className="group border-line bg-surface relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border p-6 transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_rgba(11,12,31,0.25)] sm:p-7">
              <span
                aria-hidden="true"
                className="bg-flame absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              />
              <span className="bg-night grid size-11 place-items-center rounded-2xl">
                <Icon aria-hidden="true" className="text-lamp-yellow size-5" />
              </span>
              <h3 className="font-display text-foreground text-xl font-extrabold tracking-tight">{h.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{h.description}</p>
            </article>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
