import { certifications, person } from "@/lib/content";
import { cn } from "@/lib/utils";

const ECSA = certifications.find((c) => c.code === "ECSA");
const RING_TEXT = `Engineering Council of South Africa • ${person.role} • Engineering Council of South Africa • ${person.role} • `;

/** Featured ECSA Candidate Engineer medallion with slowly rotating ring text and a flame rim. */
export function Medallion({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${ECSA?.label ?? "Candidate Engineer"}, ${ECSA?.issuer ?? "Engineering Council of South Africa"}`}
      className={cn("relative mx-auto aspect-square w-full max-w-[22rem]", className)}
    >
      {/* glow */}
      <div
        aria-hidden="true"
        className="bg-flame animate-flame-shift absolute inset-[8%] rounded-full bg-[length:200%_200%] opacity-40 blur-3xl"
      />

      {/* rotating ring text */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full animate-[spin_48s_linear_infinite]"
      >
        <defs>
          <path id="medallion-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,0.08)" />
        <text
          className="font-dm-mono"
          fontSize="8.6"
          letterSpacing="1.6"
          fill="rgba(255,255,255,0.72)"
        >
          <textPath href="#medallion-ring" textLength="548" lengthAdjust="spacing">
            {RING_TEXT.toUpperCase()}
          </textPath>
        </text>
      </svg>

      {/* flame rim (conic, counter-rotating) */}
      <div aria-hidden="true" className="absolute inset-[15%] overflow-hidden rounded-full">
        <div className="absolute -inset-1/4 animate-[spin_14s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,#ffd200,#f7931e,#e4183c,#3b3fb6,#ffd200)]" />
      </div>

      {/* face */}
      <div className="bg-night-2 absolute inset-[17%] flex flex-col items-center justify-center overflow-hidden rounded-full text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-20px_40px_rgba(0,0,0,0.5)]">
        <div aria-hidden="true" className="bg-grid-night absolute inset-0 opacity-50 [mask-image:radial-gradient(circle,black,transparent_75%)]" />
        <span className="font-dm-mono relative text-[10px] tracking-[0.3em] text-white/60 uppercase sm:text-[11px]">
          Registered
        </span>
        <span className="font-display text-flame animate-flame-shift relative my-1 text-6xl leading-none font-black sm:text-7xl">
          ECSA
        </span>
        <span className="font-display relative text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Candidate
        </span>
        <span aria-hidden="true" className="bg-flame relative my-2.5 h-px w-12" />
        <span className="font-dm-mono relative max-w-[10rem] text-[9px] leading-relaxed tracking-[0.2em] text-white/70 uppercase sm:text-[10px]">
          Engineer
        </span>
      </div>
    </div>
  );
}
