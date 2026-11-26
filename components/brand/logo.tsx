import { useId } from "react";
import { cn } from "@/lib/utils";

export type LogoTone = "dark" | "light";

function svgId(reactId: string) {
  return `nb${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * "NB" monogram: a rounded hexagon outline (a nod to process flowsheets) with the
 * initials set inside, filled with the site's flame gradient.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  /** When true the outline draws in and the mark glows gently (static under reduced motion). */
  animated?: boolean;
}) {
  const uid = svgId(useId());
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      className={cn("size-10 shrink-0 overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
      data-animated={animated || undefined}
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd200" />
          <stop offset="0.38" stopColor="#f7931e" />
          <stop offset="0.72" stopColor="#e4183c" />
          <stop offset="1" stopColor="#3b3fb6" />
        </linearGradient>
      </defs>
      <path
        d="M32 3.5 56.7 17.75v28.5L32 60.5 7.3 46.25v-28.5Z"
        fill="none"
        stroke={`url(#${uid}-g)`}
        strokeWidth="3"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animated ? 1 : undefined}
      >
        {animated ? (
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur="1.6s"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.22 1 0.36 1"
          />
        ) : null}
      </path>
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill={`url(#${uid}-g)`}
        fontFamily="var(--font-archivo), Archivo, system-ui, sans-serif"
        fontWeight={900}
        fontSize="24"
        letterSpacing="-1"
      >
        NB
      </text>
    </svg>
  );
}

/** Monogram + "Nikash Baboolal" wordmark. Size with a height on the wrapper (`className="h-12"`). */
export function Logo({
  className,
  tone = "dark",
  animated = false,
}: {
  className?: string;
  /** "dark" = navy wordmark for light backgrounds, "light" = white wordmark for dark backgrounds. */
  tone?: LogoTone;
  animated?: boolean;
  /** Kept for API compatibility with the template; ignored. */
  layout?: "inline" | "original";
}) {
  return (
    <span
      className={cn("inline-flex h-10 shrink-0 items-center gap-2.5", className)}
      role="img"
      aria-label="Nikash Baboolal"
    >
      <LogoMark animated={animated} className="h-full w-auto" />
      <span aria-hidden="true" className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.05rem] font-black tracking-tight",
            tone === "light" ? "text-white" : "text-navy",
          )}
        >
          Nikash Baboolal
        </span>
        <span
          className={cn(
            "font-dm-mono mt-1 text-[0.58rem] tracking-[0.22em] uppercase",
            tone === "light" ? "text-white/60" : "text-foreground/60",
          )}
        >
          Process Engineer
        </span>
      </span>
    </span>
  );
}
