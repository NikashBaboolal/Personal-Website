import {
  IconArrowUpRight,
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { person } from "@/lib/content";

const cards = [
  {
    label: "Email",
    value: person.email,
    href: `mailto:${person.email}`,
    Icon: IconMail,
    external: false,
  },
  {
    label: "Phone",
    value: person.phone,
    href: `tel:${person.tel}`,
    Icon: IconPhone,
    external: false,
  },
  {
    label: "LinkedIn",
    value: person.linkedinHandle,
    href: person.linkedin,
    Icon: IconBrandLinkedin,
    external: true,
  },
  {
    label: "Location",
    value: person.location,
    href: `https://www.openstreetmap.org/search?query=${encodeURIComponent(person.location)}`,
    Icon: IconMapPin,
    external: true,
  },
] as const;

/** Direct contact routes: email, phone, LinkedIn and location. */
export function ContactCards() {
  return (
    <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1" stagger={0.08}>
      {cards.map(({ label, value, href, Icon, external }) => (
        <RevealItem key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={`${label}: ${value}${external ? " (opens in a new tab)" : ""}`}
            className="group/card border-line bg-surface hover:border-lamp-orange/50 focus-visible:ring-lamp-orange relative flex items-center gap-4 overflow-hidden rounded-3xl border p-5 transition-all duration-300 outline-none hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-40px_rgba(11,12,31,0.45)] focus-visible:ring-2"
          >
            <span className="bg-flame text-night grid size-12 shrink-0 place-items-center rounded-2xl">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-dm-mono text-muted-foreground block text-[0.7rem] tracking-[0.18em] uppercase">
                {label}
              </span>
              <span className="font-display text-foreground group-hover/card:text-lamp-orange block truncate text-lg font-bold tracking-tight transition-colors">
                {value}
              </span>
            </span>
            <IconArrowUpRight
              aria-hidden="true"
              className="text-muted-foreground group-hover/card:text-lamp-orange size-5 shrink-0 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
            />
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
