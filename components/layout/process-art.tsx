"use client";

/**
 * Chemical-process drawing primitives (PFD / P&ID style), shared by the page heroes,
 * CTA band and section backdrops. Everything is decorative SVG: callers wrap it in an
 * aria-hidden container. Loops only run while `active` is true (in view, tab visible,
 * reduced motion off) and otherwise rest in a static, fully drawn state.
 */

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Process stream palette (teal -> cyan -> sky -> blue, amber for hot streams). */
export const STREAM = {
  teal: "#2dd4bf",
  cyan: "#22d3ee",
  sky: "#38bdf8",
  blue: "#3b82f6",
  amber: "#f5a524",
} as const;

const REST = { duration: 0 };

function svgId(raw: string, prefix: string) {
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * A pipe run: faint static pipe plus a dashed "fluid" overlay whose dashes flow along
 * the path. Use inside an <svg>.
 */
export function Stream({
  d,
  color = STREAM.cyan,
  active,
  width = 1.5,
  speed = 3,
  reverse = false,
  opacity = 0.9,
}: {
  d: string;
  color?: string;
  active: boolean;
  width?: number;
  /** Seconds per dash cycle (lower = faster). */
  speed?: number;
  reverse?: boolean;
  opacity?: number;
}) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={width + 2.5} strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 10"
        initial={false}
        animate={active ? { strokeDashoffset: reverse ? [0, 32] : [32, 0] } : { strokeDashoffset: 0 }}
        transition={active ? { duration: speed, ease: "linear", repeat: Infinity } : REST}
      />
    </g>
  );
}

/** P&ID instrument bubble (circle with a tag split across a centre line). */
export function InstrumentBubble({
  x,
  y,
  tag,
  r = 14,
  color = STREAM.teal,
  field = false,
}: {
  x: number;
  y: number;
  /** e.g. "FIC-101" -> "FIC" over "101". */
  tag: string;
  r?: number;
  color?: string;
  /** Field-mounted instruments have no centre line. */
  field?: boolean;
}) {
  const [letters, num] = tag.split("-");
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="rgba(6,16,30,0.85)" stroke={color} strokeWidth={1.2} />
      {field ? null : <line x1={-r} x2={r} y1={0} y2={0} stroke={color} strokeOpacity={0.6} strokeWidth={0.8} />}
      <text y={-3} textAnchor="middle" fontSize={r * 0.52} fill="white" fillOpacity={0.85} className="font-dm-mono">
        {letters}
      </text>
      <text y={r * 0.62} textAnchor="middle" fontSize={r * 0.48} fill={color} className="font-dm-mono">
        {num}
      </text>
    </g>
  );
}

/** Gate/globe valve "bow-tie" symbol, centred on (x, y), pipe running horizontally. */
export function Valve({
  x,
  y,
  size = 9,
  color = STREAM.cyan,
  rotate = 0,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  rotate?: number;
}) {
  const s = size;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={`M${-s} ${-s * 0.7} L${s} ${s * 0.7} L${s} ${-s * 0.7} L${-s} ${s * 0.7} Z`} fill="rgba(6,16,30,0.9)" stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
      <line x1={0} y1={0} x2={0} y2={-s * 1.3} stroke={color} strokeWidth={1.1} />
      <line x1={-s * 0.55} y1={-s * 1.3} x2={s * 0.55} y2={-s * 1.3} stroke={color} strokeWidth={1.1} />
    </g>
  );
}

/** Distillation column with trays and bubbles rising through the liquid on each tray. */
export function DistillationColumn({
  x,
  y,
  w = 46,
  h = 220,
  trays = 8,
  active,
  color = STREAM.sky,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  trays?: number;
  active: boolean;
  color?: string;
}) {
  const gap = h / (trays + 1);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={w / 2} fill="rgba(56,189,248,0.04)" stroke={color} strokeOpacity={0.7} strokeWidth={1.3} />
      {Array.from({ length: trays }, (_, i) => {
        const ty = gap * (i + 1);
        const weirLeft = i % 2 === 0;
        return (
          <g key={i}>
            <line x1={weirLeft ? 0 : w * 0.28} x2={weirLeft ? w * 0.72 : w} y1={ty} y2={ty} stroke={color} strokeOpacity={0.55} strokeWidth={1} />
            {[0.3, 0.5, 0.7].map((fx, j) => (
              <motion.circle
                key={j}
                cx={w * fx}
                r={1.6}
                fill={color}
                initial={false}
                animate={active ? { cy: [ty - 1, ty - gap * 0.75], opacity: [0, 0.9, 0] } : { cy: ty - gap * 0.4, opacity: 0.35 }}
                transition={active ? { duration: 1.8 + j * 0.3, delay: i * 0.22 + j * 0.4, repeat: Infinity, ease: "easeOut" } : REST}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** Continuous stirred-tank reactor: vessel, jacket, rotating agitator. */
export function Reactor({
  x,
  y,
  w = 90,
  h = 110,
  active,
  color = STREAM.teal,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  active: boolean;
  color?: string;
}) {
  const cx = w / 2;
  const level = h * 0.42;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* vessel with dished heads */}
      <path
        d={`M0 ${h * 0.14} Q0 0 ${cx} 0 Q${w} 0 ${w} ${h * 0.14} L${w} ${h * 0.86} Q${w} ${h} ${cx} ${h} Q0 ${h} 0 ${h * 0.86} Z`}
        fill="rgba(45,212,191,0.04)"
        stroke={color}
        strokeOpacity={0.75}
        strokeWidth={1.3}
      />
      {/* liquid level */}
      <path d={`M2 ${level} L${w - 2} ${level} L${w - 2} ${h * 0.86} Q${w - 2} ${h - 2} ${cx} ${h - 2} Q2 ${h - 2} 2 ${h * 0.86} Z`} fill={color} fillOpacity={0.1} />
      <motion.path
        d={`M2 ${level} Q${w * 0.25} ${level - 4} ${cx} ${level} T${w - 2} ${level}`}
        fill="none"
        stroke={color}
        strokeOpacity={0.6}
        initial={false}
        animate={active ? { y: [0, 2, 0] } : { y: 0 }}
        transition={active ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : REST}
      />
      {/* jacket */}
      <path d={`M-6 ${h * 0.3} L-6 ${h * 0.84} M${w + 6} ${h * 0.3} L${w + 6} ${h * 0.84}`} stroke={STREAM.amber} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="3 3" />
      {/* motor + shaft */}
      <rect x={cx - 9} y={-20} width={18} height={14} rx={3} fill="rgba(6,16,30,0.9)" stroke={color} strokeOpacity={0.8} />
      <line x1={cx} y1={-6} x2={cx} y2={h * 0.78} stroke={color} strokeOpacity={0.8} strokeWidth={1.2} />
      {/* impeller: blades squash horizontally to read as rotation in 2D */}
      <motion.g
        style={{ originX: `${cx}px`, originY: `${h * 0.78}px` }}
        initial={false}
        animate={active ? { scaleX: [1, -1, 1] } : { scaleX: 1 }}
        transition={active ? { duration: 1.1, repeat: Infinity, ease: "linear" } : REST}
      >
        <path d={`M${cx - 18} ${h * 0.78 - 5} L${cx + 18} ${h * 0.78 + 5} M${cx - 18} ${h * 0.78 + 5} L${cx + 18} ${h * 0.78 - 5}`} stroke={color} strokeWidth={2} strokeLinecap="round" />
      </motion.g>
    </g>
  );
}

/** Shell-and-tube heat exchanger, drawn horizontally. */
export function HeatExchanger({
  x,
  y,
  w = 130,
  h = 34,
  color = STREAM.sky,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={h / 2} fill="rgba(56,189,248,0.04)" stroke={color} strokeOpacity={0.7} strokeWidth={1.2} />
      {[0.3, 0.5, 0.7].map((f) => (
        <line key={f} x1={h * 0.5} x2={w - h * 0.5} y1={h * f} y2={h * f} stroke={color} strokeOpacity={0.4} strokeWidth={0.8} />
      ))}
      {[0.25, 0.45, 0.65].map((f) => (
        <line key={f} x1={w * f} x2={w * f} y1={f === 0.45 ? h * 0.35 : 0} y2={f === 0.45 ? h : h * 0.65} stroke={color} strokeOpacity={0.35} strokeWidth={0.8} />
      ))}
    </g>
  );
}

/** Tileable benzene / hexagon lattice background (fills its parent). */
export function MoleculeLattice({
  className,
  color = STREAM.teal,
  opacity = 0.12,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  const id = svgId(useId(), "lattice");
  // Flat-top hexagon, side 18 -> width 36, height ~31.2; tile is 54 x 62.4 (two offset rows).
  const s = 18;
  const hh = 15.59;
  const hex = (ox: number, oy: number) =>
    `M${ox - s} ${oy} L${ox - s / 2} ${oy - hh} L${ox + s / 2} ${oy - hh} L${ox + s} ${oy} L${ox + s / 2} ${oy + hh} L${ox - s / 2} ${oy + hh} Z`;
  return (
    <svg aria-hidden="true" className={cn("absolute inset-0 size-full", className)}>
      <defs>
        <pattern id={id} width={54} height={hh * 4} patternUnits="userSpaceOnUse">
          <path d={hex(18, hh)} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={1} />
          <path d={hex(45, hh * 3)} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={1} />
          {/* benzene inner ring on one of the two cells */}
          <circle cx={18} cy={hh} r={8} fill="none" stroke={color} strokeOpacity={opacity * 0.8} strokeWidth={0.8} />
          {/* bonds out to neighbours */}
          <line x1={36} y1={hh} x2={45 - s / 2} y2={hh * 2} stroke={color} strokeOpacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A single benzene ring (hexagon + aromatic circle), for seals and emblems. */
export function BenzeneRing({
  cx,
  cy,
  r,
  color = STREAM.teal,
  strokeWidth = 1.4,
  inner = true,
}: {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  strokeWidth?: number;
  inner?: boolean;
}) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${Math.round((cx + r * Math.cos(a)) * 100) / 100},${Math.round((cy + r * Math.sin(a)) * 100) / 100}`;
  }).join(" ");
  return (
    <g>
      <polygon points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      {inner ? <circle cx={cx} cy={cy} r={r * 0.58} fill="none" stroke={color} strokeOpacity={0.7} strokeWidth={strokeWidth * 0.8} /> : null}
    </g>
  );
}

/**
 * Wide process-flow-diagram scene: feed -> heat exchanger -> reactor -> column, with
 * overhead and bottoms streams and instrument tags. Scales to its container width.
 */
export function PfdScene({ active, className }: { active: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 900 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={cn("size-full", className)}>
      {/* feed in -> exchanger */}
      <Stream d="M0 250 L120 250" color={STREAM.sky} active={active} speed={2.6} />
      <HeatExchanger x={120} y={233} />
      {/* hot utility through exchanger */}
      <Stream d="M150 340 L150 300 L222 300 L222 267" color={STREAM.amber} active={active} speed={3.4} opacity={0.7} />
      {/* exchanger -> reactor */}
      <Stream d="M250 250 L330 250 L330 150 L372 150" color={STREAM.cyan} active={active} speed={2.4} />
      <Valve x={300} y={250} />
      <InstrumentBubble x={300} y={210} tag="FIC-101" />
      <line x1={300} y1={224} x2={300} y2={238} stroke={STREAM.teal} strokeOpacity={0.6} strokeDasharray="2 2" />
      <Reactor x={372} y={110} active={active} />
      <InstrumentBubble x={500} y={88} tag="TIC-102" />
      <line x1={486} y1={94} x2={462} y2={120} stroke={STREAM.teal} strokeOpacity={0.6} strokeDasharray="2 2" />
      {/* reactor -> column */}
      <Stream d="M417 220 L417 270 L560 270 L560 200 L600 200" color={STREAM.teal} active={active} speed={2.8} />
      <Valve x={500} y={270} />
      <DistillationColumn x={600} y={40} h={260} active={active} />
      <InstrumentBubble x={680} y={170} tag="LT-103" field />
      {/* overheads + condenser + reflux */}
      <Stream d="M623 40 L623 18 L760 18 L760 60" color={STREAM.sky} active={active} speed={2.2} />
      <HeatExchanger x={720} y={60} w={80} h={26} color={STREAM.sky} />
      <Stream d="M760 86 L760 120 L900 120" color={STREAM.cyan} active={active} speed={2.2} />
      <Stream d="M760 120 L700 120 L700 80 L646 80" color={STREAM.cyan} active={active} speed={2.8} opacity={0.6} />
      <InstrumentBubble x={840} y={70} tag="PSV-104" field />
      <line x1={840} y1={84} x2={840} y2={118} stroke={STREAM.amber} strokeOpacity={0.6} />
      {/* bottoms */}
      <Stream d="M623 300 L623 325 L900 325" color={STREAM.blue} active={active} speed={3.2} />
      <Valve x={780} y={325} color={STREAM.blue} />
    </svg>
  );
}
