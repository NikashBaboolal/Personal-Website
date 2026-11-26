"use client";

import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { globeSites } from "./sites";

type DotMap = {
  viewBox: string;
  /** All land dots as one compact path (zero-length segments + round caps). */
  path: string;
  pins: { id: string; x: number; y: number; color: string; label: string; client: boolean }[];
};

const REGION = { lat: { min: -38, max: 60 }, lng: { min: -12, max: 56 } };

/**
 * Static dotted map of southern Africa shown when WebGL is unavailable.
 * dotted-map (and its world geometry) is only downloaded in that case.
 */
export function GlobeFallback({ className }: { className?: string }) {
  const [map, setMap] = useState<DotMap | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    import("dotted-map")
      .then(({ default: DottedMap }) => {
        if (cancelled) return;
        const dm = new DottedMap({ height: 56, grid: "diagonal", region: REGION });
        const path = dm
          .getPoints()
          .map((p) => `M${p.x.toFixed(2)} ${p.y.toFixed(2)}h0`)
          .join("");
        const pins = globeSites.map((s) => {
          const p = dm.getPin({ lat: s.lat, lng: s.lng });
          return {
            id: s.id,
            x: p.x,
            y: p.y,
            color: s.css,
            label: s.label,
            client: s.kind !== "home",
          };
        });
        setMap({ viewBox: `0 0 ${dm.image.width} ${dm.image.height}`, path, pins });
      })
      .catch(() => {
        /* keep the plain placeholder */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Map of Africa and Europe showing Richards Bay and Cape Town in South Africa, and Braunschweig in Germany."
      className={cn("relative aspect-square w-full overflow-hidden rounded-full", className)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_55%,rgba(45,212,191,0.28),rgba(6,16,30,0)_70%)]"
      />
      <div aria-hidden="true" className="border-night-line absolute inset-[6%] rounded-full border" />
      {map ? (
        <svg
          aria-hidden="true"
          viewBox={map.viewBox}
          className="absolute inset-[8%] h-[84%] w-[84%]"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={map.path} stroke="rgba(163,165,194,0.45)" strokeWidth={0.42} strokeLinecap="round" />
          {map.pins.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={1.6} fill={p.color} opacity={0.25}>
                {reduce ? null : (
                  <>
                    <animate attributeName="r" values="0.8;3;0.8" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
                  </>
                )}
              </circle>
              <circle cx={p.x} cy={p.y} r={0.8} fill={p.color} />
              <text
                x={p.x + (p.id === "cape-town" ? -1.6 : 1.6)}
                y={p.y - 1.2}
                textAnchor={p.id === "cape-town" ? "end" : "start"}
                fontSize={1.7}
                fill="#ffffff"
                className="font-dm-mono"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}
