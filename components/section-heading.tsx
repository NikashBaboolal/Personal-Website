import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

/**
 * Shared section heading: mono eyebrow, big display title (word reveal), optional lead.
 * tone="light" for dark (night) sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal y={10} blur={4}>
          <span
            className={cn(
              "font-dm-mono inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase",
              tone === "dark" ? "text-muted-foreground" : "text-night-muted",
            )}
          >
            <span className="bg-flame inline-block size-1.5 rounded-full" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl",
          tone === "dark" ? "text-foreground" : "text-white",
        )}
      >
        <TextReveal text={title} />
      </h2>
      {lead ? (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "text-base leading-relaxed text-pretty md:text-lg",
              tone === "dark" ? "text-muted-foreground" : "text-night-muted",
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
