import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative process flow diagram (PFD) for the hero, drawn as a dark-mode
 * engineering sheet:
 *
 *   feed -> FV-101 -> E-101 (shell & tube preheater, steam on the shell side)
 *        -> R-101 (jacketed CSTR with agitator) -> P-101 -> T-101 (distillation column)
 *   T-101 overhead -> E-102 (condenser) -> D-101 (reflux drum) -> reflux + distillate
 *   T-101 bottoms  -> E-103 (reboiler, steam heated) -> bottoms product
 *
 * Streams "flow" with animated dash offsets, vapour bubbles rise through the
 * column trays and the agitator turns. All motion is CSS, so the global
 * prefers-reduced-motion rule freezes it. Purely decorative (aria-hidden).
 */

const COLD = "#5eead4";
const CYAN = "#22d3ee";
const HOT = "#f5a524";
const LINE = "rgba(94,234,212,0.32)";
const INK = "#06141b";
const LABEL = "rgba(204,251,241,0.75)";

type Stream = { d: string; hot?: boolean; slow?: boolean };

const STREAMS: Stream[] = [
  // feed -> control valve -> E-101 tube side
  { d: "M0 430 H110" },
  // E-101 outlet -> R-101 inlet nozzle
  { d: "M270 430 H300 V318 H342" },
  // R-101 bottom outlet -> P-101 -> T-101 feed tray
  { d: "M390 462 V488 H458" },
  { d: "M482 488 H540 V300 H600" },
  // T-101 overhead vapour -> E-102 condenser
  { d: "M630 40 V20 H780 V58" },
  // E-102 -> D-101 reflux drum
  { d: "M780 102 V150" },
  // reflux back to the top tray
  { d: "M752 166 H712 V92 H660", slow: true },
  // distillate product
  { d: "M848 166 H960" },
  // T-101 bottoms -> E-103 reboiler, vapour return, bottoms product
  { d: "M630 470 V500 H700" },
  { d: "M744 486 V420 H660", slow: true },
  { d: "M733 512 V517 H960" },
  // utility steam (hot) on E-101 shell side and E-103
  { d: "M150 360 V410", hot: true },
  { d: "M230 450 V510", hot: true },
  { d: "M800 494 H766", hot: true },
];

const TRAY_YS = Array.from({ length: 12 }, (_, i) => 72 + i * 32);

const BUBBLES = [
  { x: 612, delay: 0, dur: 4.2 },
  { x: 624, delay: 1.3, dur: 5 },
  { x: 638, delay: 2.4, dur: 4.6 },
  { x: 648, delay: 0.7, dur: 5.6 },
  { x: 618, delay: 3.1, dur: 4.4 },
  { x: 642, delay: 3.8, dur: 5.2 },
  { x: 630, delay: 2, dur: 4.8 },
  { x: 654, delay: 4.4, dur: 5 },
] as const;

const INSTRUMENTS = [
  { tag: ["FIC", "101"], x: 62, y: 372, to: [62, 430] },
  { tag: ["TIC", "102"], x: 478, y: 330, to: [440, 340] },
  { tag: ["LIC", "103"], x: 888, y: 112, to: [848, 160] },
  { tag: ["PIC", "104"], x: 548, y: 46, to: [600, 60] },
  { tag: ["AT", "105"], x: 920, y: 214, to: [920, 166] },
] as const;

function Flow({ d, hot, slow }: Stream) {
  return (
    <g>
      <path d={d} fill="none" stroke={hot ? "rgba(245,165,36,0.35)" : LINE} strokeWidth="1.6" />
      <path
        d={d}
        fill="none"
        stroke={hot ? HOT : COLD}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="6 18"
        className={slow ? "animate-stream-flow-slow" : "animate-stream-flow"}
        opacity={hot ? 0.7 : 0.85}
      />
    </g>
  );
}

function Tag({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} fill={LABEL} fontSize="10" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="1">
      {children}
    </text>
  );
}

export function ProcessFlow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  // Unique ids so several diagrams (e.g. desktop + mobile variants) never share clip paths.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const col = `pfd-column-${uid}`;
  const reac = `pfd-reactor-${uid}`;
  const liq = `pfd-liquid-${uid}`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 520"
      className={cn("pointer-events-none", className)}
      style={style}
      fill="none"
    >
      <defs>
        <clipPath id={col}>
          <rect x="602" y="42" width="56" height="426" rx="26" />
        </clipPath>
        <clipPath id={reac}>
          <path d="M342 318 Q342 290 390 290 Q438 290 438 318 V430 Q438 460 390 460 Q342 460 342 430 Z" />
        </clipPath>
        <linearGradient id={liq} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.28" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* ---------- streams ---------- */}
      {STREAMS.map((s) => (
        <Flow key={s.d} {...s} />
      ))}

      {/* ---------- FV-101 feed control valve (bow-tie) ---------- */}
      <path d="M52 422 L72 438 V422 L52 438 Z" fill={INK} stroke={COLD} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M62 430 V414 M55 414 H69" stroke={COLD} strokeWidth="1.2" />

      {/* ---------- E-101 shell & tube preheater ---------- */}
      <g stroke={COLD} strokeWidth="1.3">
        <rect x="110" y="410" width="160" height="40" rx="20" fill={INK} />
        <path d="M128 418 H252 M128 426 H252 M128 434 H252 M128 442 H252" strokeWidth="0.7" opacity="0.6" />
        <path d="M132 410 V450 M248 410 V450" strokeWidth="0.9" />
      </g>
      <Tag x={160} y={472}>E-101</Tag>

      {/* ---------- R-101 jacketed CSTR ---------- */}
      <g clipPath={`url(#${reac})`}>
        <rect x="342" y="350" width="96" height="112" fill={`url(#${liq})`} />
        <path d="M342 352 Q366 344 390 352 T438 352" stroke={CYAN} strokeWidth="1" opacity="0.7" />
      </g>
      <path
        d="M342 318 Q342 290 390 290 Q438 290 438 318 V430 Q438 460 390 460 Q342 460 342 430 Z"
        stroke={COLD}
        strokeWidth="1.4"
      />
      {/* heating jacket */}
      <path
        d="M334 340 V432 Q334 470 390 470 Q446 470 446 432 V340"
        stroke="rgba(245,165,36,0.5)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {/* motor + shaft + agitator */}
      <rect x="378" y="262" width="24" height="18" rx="3" fill={INK} stroke={COLD} strokeWidth="1.2" />
      <path d="M390 280 V430" stroke={COLD} strokeWidth="1.2" />
      <g className="animate-agitate" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M366 418 H414 M366 410 V426 M414 410 V426" stroke={CYAN} strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="animate-agitate" style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "-0.6s" }}>
        <path d="M372 384 H408" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <Tag x={366} y={252}>R-101</Tag>

      {/* ---------- P-101 centrifugal pump ---------- */}
      <circle cx="470" cy="488" r="12" fill={INK} stroke={COLD} strokeWidth="1.3" />
      <path d="M470 476 H486" stroke={COLD} strokeWidth="1.3" />
      <Tag x={455} y={514}>P-101</Tag>

      {/* ---------- T-101 distillation column ---------- */}
      <rect x="602" y="42" width="56" height="426" rx="26" fill={INK} stroke={COLD} strokeWidth="1.4" />
      <g clipPath={`url(#${col})`}>
        {TRAY_YS.map((y, i) => (
          <path
            key={y}
            d={i % 2 ? `M602 ${y} H646` : `M614 ${y} H658`}
            stroke={COLD}
            strokeWidth="0.9"
            opacity="0.55"
          />
        ))}
        {BUBBLES.map((b) => (
          <circle
            key={`${b.x}-${b.delay}`}
            cx={b.x}
            cy="452"
            r="2.2"
            fill={COLD}
            className="animate-bubble-rise"
            style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
          />
        ))}
      </g>
      <Tag x={612} y={32}>T-101</Tag>

      {/* ---------- E-102 condenser ---------- */}
      <circle cx="780" cy="80" r="22" fill={INK} stroke={COLD} strokeWidth="1.3" />
      <path d="M762 80 L768 70 L776 90 L784 70 L792 90 L798 80" stroke={CYAN} strokeWidth="1.1" strokeLinejoin="round" />
      <Tag x={808} y={84}>E-102</Tag>

      {/* ---------- D-101 reflux drum ---------- */}
      <rect x="752" y="150" width="96" height="32" rx="16" fill={INK} stroke={COLD} strokeWidth="1.3" />
      <path d="M758 170 H842" stroke={CYAN} strokeWidth="0.9" opacity="0.6" />
      <Tag x={780} y={200}>D-101</Tag>

      {/* ---------- E-103 kettle reboiler ---------- */}
      <rect x="700" y="486" width="66" height="26" rx="13" fill={INK} stroke={COLD} strokeWidth="1.3" />
      <path d="M710 500 Q718 492 726 500 T742 500 T758 500" stroke={HOT} strokeWidth="1" opacity="0.7" />
      <Tag x={704} y={478}>E-103</Tag>

      {/* ---------- P&ID instrument bubbles + signal lines ---------- */}
      {INSTRUMENTS.map((ins) => (
        <g key={ins.tag.join("-")}>
          <path
            d={`M${ins.x} ${ins.y} L${ins.to[0]} ${ins.to[1]}`}
            stroke={CYAN}
            strokeWidth="0.8"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          <circle cx={ins.x} cy={ins.y} r="16" fill={INK} stroke={CYAN} strokeWidth="1.1" />
          <path d={`M${ins.x - 16} ${ins.y} H${ins.x + 16}`} stroke={CYAN} strokeWidth="0.7" />
          <text
            x={ins.x}
            y={ins.y - 4}
            textAnchor="middle"
            fill={LABEL}
            fontSize="8.5"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {ins.tag[0]}
          </text>
          <text
            x={ins.x}
            y={ins.y + 10}
            textAnchor="middle"
            fill={LABEL}
            fontSize="8.5"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {ins.tag[1]}
          </text>
        </g>
      ))}
    </svg>
  );
}
