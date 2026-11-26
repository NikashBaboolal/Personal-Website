import Image from "next/image";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Optional cool teal duotone background photo of a process plant. Renders nothing when the media
 * manifest has no hero image — the layered graphics stand on their own.
 */
export function HeroPhoto({ className }: { className?: string }) {
  const image = getMedia("hero-refinery");
  if (!image) return null;

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={image.src}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
        className="object-cover opacity-20 grayscale"
      />
      {/* cool duotone: deep teal-navy shadows, cyan highlights (process plant at night) */}
      <div className="from-navy via-lamp-blue/50 to-lamp-red absolute inset-0 bg-linear-to-tr opacity-60 mix-blend-color" />
      <div className="from-night/30 via-night/70 to-night absolute inset-0 bg-linear-to-b" />
      <div className="from-night absolute inset-0 bg-linear-to-r via-transparent to-transparent" />
    </div>
  );
}
