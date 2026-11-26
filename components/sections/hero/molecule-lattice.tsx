import { cn } from "@/lib/utils";

/**
 * Faint hexagonal "molecule" lattice (fused benzene rings, like graphite) that
 * replaces the template's starfield. A handful of atoms glow softly; under
 * reduced motion the glow is static (global CSS rule).
 */

const R = 22; // hexagon circumradius
const W = Math.sqrt(3) * R; // horizontal spacing (pointy-top hexagons)
const COLS = 22;
const ROWS = 9;

type Pt = readonly [number, number];

function hexPoints(cx: number, cy: number): Pt[] {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const;
  });
}

/** Deterministic integer hash -> [0, 1) so server and client render identically. */
function rand(seed: number) {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const cells: { d: string; key: string; pts: Pt[] }[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const cx = col * W + (row % 2 ? W / 2 : 0);
    const cy = row * R * 1.5;
    const pts = hexPoints(cx, cy);
    cells.push({
      key: `${row}-${col}`,
      pts,
      d: `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`,
    });
  }
}

/** A few "atoms" that pulse; every 5th is a hot-stream amber. */
const atoms = cells
  .map((c, i) => ({ c, i }))
  .filter(({ i }) => rand(i + 1) > 0.9)
  .map(({ c, i }) => {
    const [x, y] = c.pts[Math.floor(rand(i + 7) * 6)];
    return {
      x: x.toFixed(1),
      y: y.toFixed(1),
      i,
      hot: i % 5 === 0,
      delay: (rand(i + 3) * 6).toFixed(2),
    };
  });

const VIEW_W = Math.round(COLS * W);
const VIEW_H = Math.round(ROWS * R * 1.5);

export function MoleculeLattice({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMin slice"
      className={cn(
        "pointer-events-none mask-[radial-gradient(ellipse_80%_90%_at_50%_0%,black_20%,transparent_80%)]",
        className,
      )}
    >
      <g fill="none" stroke="rgba(94,234,212,0.09)" strokeWidth="0.8">
        {cells.map((c) => (
          <path key={c.key} d={c.d} />
        ))}
      </g>
      {atoms.map((a) => (
        <circle
          key={a.i}
          cx={a.x}
          cy={a.y}
          r={a.hot ? 1.8 : 1.5}
          fill={a.hot ? "#f5a524" : "#5eead4"}
          className="animate-pulse"
          style={{ animationDuration: "4s", animationDelay: `${a.delay}s` }}
        />
      ))}
    </svg>
  );
}
