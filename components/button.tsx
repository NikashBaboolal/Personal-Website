import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "flame" | "dark" | "light" | "outline" | "ghost-light";

const variants: Record<Variant, string> = {
  flame:
    "bg-flame text-night shadow-glow bg-[length:200%_100%] hover:bg-[position:100%_0] animate-flame-shift",
  dark: "bg-night text-white hover:bg-night-3",
  light: "bg-white text-night hover:bg-lamp-yellow",
  outline:
    "border border-foreground/15 bg-transparent text-foreground hover:border-foreground/40 hover:bg-foreground/5",
  "ghost-light":
    "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10",
};

export function buttonClasses(variant: Variant = "dark", className?: string) {
  return cn(
    "group/btn relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-lamp-orange focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]",
    variants[variant],
    className,
  );
}

type Common = { variant?: Variant; className?: string; children: React.ReactNode };

/** Link-styled button. Use for navigation & CTAs. */
export function ButtonLink({
  href,
  variant = "dark",
  className,
  children,
  ...rest
}: Common & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "dark",
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
