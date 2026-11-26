import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-width process line that runs across the bottom of the hero, like a strip
 * cut from a P&ID:
 *
 *   feed -> FV-101 -> E-101 (shell & tube, steam shell side) -> R-101 (agitated CSTR)
 *        -> P-101 -> T-101 (column) -> E-102 (condenser) -> D-101 (reflux drum)
 *        -> AT-104 -> FV-105 -> TK-101 (product tank)
 *
 * Streams flow (animated dash offset), vapour bubbles rise through the column
 * trays, the agitator turns and the tank level breathes. CSS-only motion, so the
 * global prefers-reduced-motion rule freezes it. Decorative (aria-hidden).
 */

const COLD = "#5eead4";
const CYAN = "#22d3ee";
const HOT = "#f5a524";
const LINE = "rgba(94,234,212,0.3)";
const INK = "#06141b";
const LABEL = "rgba(204,251,241,0.7)";
const MONO = "ui-monospace, SFMono-Regular, monospace";

type Stream = { d: string; hot?: boolean; slow?: boolean };

const STREAMS: Stream[] = [
  { d: "M0 70 H140" }, // feed -> E-101
  { d: "M300 70 H380" }, // E-101 -> R-101
  { d: "M420 112 V118 H528" }, // R-101 bottoms -> P-101
  { d: "M552 118 H600 V78 H640" }, // P-101 -> T-101 feed tray
  { d: "M660 6 V2 H780 V18" }, // overhead vapour -> condenser
  { d: "M780 42 V56" }, // condenser -> drum
  { d: "M830 68 H700 V30 H680", slow: true }, // reflux
  { d: "M930 68 H1270" }, // distillate -> tank
  { d: "M660 114 V119 H1440", slow: true }, // column bottoms out along the floor
  { d: "M190 20 V52", hot: true }, // steam to E-101 shell
  { d: "M250 88 V118", hot: true }, // condensate out
];

const TRAYS = [20, 34, 48, 62, 76, 90, 104];

const BUBBLES = [
  { x: 648, delay: 0, dur: 2.6 },
  { x: 658, delay: 0.9, dur: 3 },
  { x: 668, delay: 1.7, dur: 2.8 },
  { x: 674, delay: 0.4, dur: 3.3 },
  { x: 652, delay: 2.2, dur: 2.9 },
] as const;

const INSTRUMENTS = [
  { tag: ["FIC", "101"], x: 96, y: 24, to: [96, 62] },
  { tag: ["TIC", "102"], x: 500, y: 40, to: [462, 56] },
  { tag: ["LIC", "103"], x: 960, y: 24, to: [930, 62] },
  { tag: ["AT", "104"], x: 1060, y: 30, to: [1060, 68] },
  { tag: ["FIC", "105"], x: 1180, y: 24, to: [1180, 62] },
] as const;

function Flow({ d, hot, slow }: Stream) {
  return (
    <g>
      <path d={d} stroke={hot ? "rgba(245,165,36,0.3)" : LINE} strokeWidth="1.4" />
      <path
        d={d}
        stroke={hot ? HOT : COLD}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="6 18"
        className={slow ? "animate-stream-flow-slow" : "animate-stream-flow"}
        opacity={hot ? 0.75 : 0.9}
      />
    </g>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} fill={LABEL} fontSize="8" fontFamily={MONO} letterSpacing="1">
      {children}
    </text>
  );
}

function Valve({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={COLD} strokeWidth="1.1" strokeLinejoin="round">
      <path d={`M${x - 9} ${y - 7} L${x + 9} ${y + 7} V${y - 7} L${x - 9} ${y + 7} Z`} fill={INK} />
      <path d={`M${x} ${y} V${y - 12} M${x - 6} ${y - 12} H${x + 6}`} />
    </g>
  );
}

export function ProcessLine({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const colClip = `pl-col-${uid}`;
  const tankClip = `pl-tank-${uid}`;
  const reacClip = `pl-reac-${uid}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 124"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none block", className)}
      fill="none"
    >
      <defs>
        <clipPath id={colClip}>
          <rect x="641" y="7" width="38" height="106" rx="18" />
        </clipPath>
        <clipPath id={tankClip}>
          <path d="M1271 44 L1325 30 L1379 44 V111 H1271 Z" />
        </clipPath>
        <clipPath id={reacClip}>
          <rect x="381" y="31" width="78" height="80" rx="24" />
        </clipPath>
      </defs>

      {STREAMS.map((s) => (
        <Flow key={s.d} {...s} />
      ))}

      {/* FV-101 feed control valve */}
      <Valve x={96} y={70} />

      {/* E-101 shell & tube exchanger */}
      <rect x="140" y="52" width="160" height="36" rx="18" fill={INK} stroke={COLD} strokeWidth="1.2" />
      <path d="M160 60 H280 M160 67 H280 M160 74 H280 M160 81 H280" stroke={COLD} strokeWidth="0.6" opacity="0.55" />
      <path d="M162 52 V88 M278 52 V88" stroke={COLD} strokeWidth="0.8" />
      <Label x={146} y={106}>E-101</Label>

      {/* R-101 agitated CSTR */}
      <g clipPath={`url(#${reacClip})`}>
        <rect x="381" y="62" width="78" height="50" fill={CYAN} opacity="0.12" />
        <path d="M381 63 Q400 58 420 63 T459 63" stroke={CYAN} strokeWidth="0.9" opacity="0.7" />
      </g>
      <rect x="380" y="30" width="80" height="82" rx="24" fill="none" stroke={COLD} strokeWidth="1.3" />
      <rect x="411" y="14" width="18" height="12" rx="2" fill={INK} stroke={COLD} strokeWidth="1.1" />
      <path d="M420 26 V98" stroke={COLD} strokeWidth="1.1" />
      <g className="animate-agitate" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M402 92 H438 M402 86 V98 M438 86 V98" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <Label x={358} y={20}>R-101</Label>

      {/* P-101 pump */}
      <circle cx="540" cy="118" r="10" fill={INK} stroke={COLD} strokeWidth="1.2" />
      <path d="M540 108 H553" stroke={COLD} strokeWidth="1.2" />
      <Label x={560} y={110}>P-101</Label>

      {/* T-101 distillation column */}
      <rect x="640" y="6" width="40" height="108" rx="19" fill={INK} stroke={COLD} strokeWidth="1.3" />
      <g clipPath={`url(#${colClip})`}>
        {TRAYS.map((y, i) => (
          <path key={y} d={i % 2 ? `M641 ${y} H670` : `M650 ${y} H679`} stroke={COLD} strokeWidth="0.8" opacity="0.55" />
        ))}
        {BUBBLES.map((b) => (
          <circle
            key={`${b.x}-${b.delay}`}
            cx={b.x}
            cy="110"
            r="1.8"
            fill={COLD}
            className="animate-bubble-rise-short"
            style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
          />
        ))}
      </g>
      <Label x={690} y={110}>T-101</Label>

      {/* E-102 condenser */}
      <circle cx="780" cy="30" r="12" fill={INK} stroke={COLD} strokeWidth="1.2" />
      <path d="M770 30 L774 24 L778 36 L782 24 L786 36 L790 30" stroke={CYAN} strokeWidth="1" strokeLinejoin="round" />
      <Label x={798} y={33}>E-102</Label>

      {/* D-101 reflux drum */}
      <rect x="830" y="56" width="100" height="24" rx="12" fill={INK} stroke={COLD} strokeWidth="1.2" />
      <path d="M838 71 H922" stroke={CYAN} strokeWidth="0.8" opacity="0.6" />
      <Label x={858} y={96}>D-101</Label>

      {/* product control valve */}
      <Valve x={1180} y={68} />

      {/* TK-101 cone-roof product tank, level gently rising and falling */}
      <g clipPath={`url(#${tankClip})`}>
        <rect
          x="1271"
          y="60"
          width="108"
          height="60"
          fill={CYAN}
          opacity="0.16"
          className="animate-tank-level"
        />
      </g>
      <path d="M1270 44 L1325 29 L1380 44 V112 H1270 Z" stroke={COLD} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M1270 68 H1278" stroke={COLD} strokeWidth="1" />
      <Label x={1300} y={100}>TK-101</Label>

      {/* instrument bubbles */}
      {INSTRUMENTS.map((ins) => (
        <g key={ins.tag.join("-") + ins.x}>
          <path
            d={`M${ins.x} ${ins.y + 13} L${ins.to[0]} ${ins.to[1]}`}
            stroke={CYAN}
            strokeWidth="0.7"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          <circle cx={ins.x} cy={ins.y} r="13" fill={INK} stroke={CYAN} strokeWidth="1" />
          <path d={`M${ins.x - 13} ${ins.y} H${ins.x + 13}`} stroke={CYAN} strokeWidth="0.6" />
          <text x={ins.x} y={ins.y - 3} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily={MONO}>
            {ins.tag[0]}
          </text>
          <text x={ins.x} y={ins.y + 9} textAnchor="middle" fill={LABEL} fontSize="7" fontFamily={MONO}>
            {ins.tag[1]}
          </text>
        </g>
      ))}
    </svg>
  );
}
