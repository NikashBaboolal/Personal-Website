import { certifications, person } from "@/lib/content";
import { cn } from "@/lib/utils";

const ECSA = certifications.find((c) => c.code === "ECSA");
const RING_TEXT = `Engineering Council of South Africa • ${person.role} • Engineering Council of South Africa • ${person.role} • `;

/** Featured ECSA Candidate Engineer medallion with slowly rotating ring text and a hexagonal (benzene) rim. */
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
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.45),rgba(56,189,248,0.2)_55%,transparent_75%)] blur-3xl"
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

      {/* benzene rim: hexagon + aromatic ring, slowly counter-rotating */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute inset-[9%] size-[82%] animate-[spin_60s_linear_infinite_reverse] motion-reduce:animate-none"
      >
        <defs>
          <linearGradient id="medallion-stream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2dd4bf" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <polygon
          points="100,8 179.67,54 179.67,146 100,192 20.33,146 20.33,54"
          fill="none"
          stroke="url(#medallion-stream)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {[
          [100, 8, 100, -2],
          [179.67, 54, 188.33, 49],
          [179.67, 146, 188.33, 151],
          [100, 192, 100, 202],
          [20.33, 146, 11.67, 151],
          [20.33, 54, 11.67, 49],
        ].map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2dd4bf" strokeOpacity="0.6" strokeWidth="2" />
        ))}
      </svg>

      {/* face */}
      <div className="bg-night-2 absolute inset-[16%] flex flex-col items-center justify-center overflow-hidden text-center [clip-path:polygon(50%_0,93.3%_25%,93.3%_75%,50%_100%,6.7%_75%,6.7%_25%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-20px_40px_rgba(0,0,0,0.5)]">
        <div aria-hidden="true" className="bg-grid-night absolute inset-0 opacity-50 [mask-image:radial-gradient(circle,black,transparent_75%)]" />
        <span className="font-dm-mono relative text-[10px] tracking-[0.3em] text-white/60 uppercase sm:text-[11px]">
          Registered
        </span>
        <span className="font-display text-flame relative my-1 text-6xl leading-none font-black sm:text-7xl">
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
