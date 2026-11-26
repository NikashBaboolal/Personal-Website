"use client";

import createGlobe, { type Arc, type Globe, type Marker } from "cobe";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GlobeFallback } from "./globe-fallback";
import { HOME, globeSites, type GlobeSite } from "./sites";

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const MARKER_ELEVATION = 0.04;
/** cobe's globe radius in clip space. */
const GLOBE_RADIUS = 0.8;
/** phi that puts HOME.lng in the centre of the view (cobe convention). */
const HOME_PHI = -Math.PI / 2 - HOME.lng * DEG;
/** Slight tilt so both southern Africa and Germany stay on the visible face. */
const HOME_THETA = 0.05;
const INTRO_OFFSET = -2.6;
const INTRO_MS = 2600;
const SWAY = 0.32;
const RETURN_AFTER_MS = 4000;

type Status = "loading" | "ready" | "fallback";

/** Label placement beside each marker so nearby labels never overlap. */
const labelPlacement: Record<string, string> = {
  "richards-bay": "left-2 -translate-y-1/2",
  "cape-town": "right-2 -translate-y-1/2 flex-row-reverse",
  braunschweig: "left-2 -translate-y-1/2",
};

const markers: Marker[] = globeSites.map((s) => ({
  location: [s.lat, s.lng],
  size: s.kind === "home" ? 0.06 : 0.05,
  color: s.rgb,
}));

const byId = (id: string) => globeSites.find((s) => s.id === id);

const arcs: Arc[] = (() => {
  const home = byId("richards-bay");
  const ct = byId("cape-town");
  const de = byId("braunschweig");
  const out: Arc[] = [];
  if (home && ct) out.push({ from: [home.lat, home.lng], to: [ct.lat, ct.lng], color: [1, 0.824, 0] });
  if (ct && de) out.push({ from: [ct.lat, ct.lng], to: [de.lat, de.lng], color: [0.969, 0.576, 0.118] });
  return out;
})();

/** Same maths cobe uses to place markers: lat/lng -> normalised canvas coords + facing. */
function project(site: GlobeSite, phi: number, theta: number) {
  const r = site.lat * DEG;
  const a = site.lng * DEG - Math.PI;
  const o = Math.cos(r);
  const k = GLOBE_RADIUS + MARKER_ELEVATION;
  const p0 = -o * Math.cos(a) * k;
  const p1 = Math.sin(r) * k;
  const p2 = o * Math.sin(a) * k;
  const ct = Math.cos(theta);
  const cp = Math.cos(phi);
  const st = Math.sin(theta);
  const sp = Math.sin(phi);
  const x = cp * p0 + sp * p2;
  const y = sp * st * p0 + ct * p1 - cp * st * p2;
  const z = -sp * ct * p0 + st * p1 + cp * ct * p2;
  return { x: (x + 1) / 2, y: (-y + 1) / 2, z };
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Interactive cobe v2 globe centred on South Africa.
 * - auto-rotates in on load, then sways gently around home
 * - drag (pointer) or arrow keys to spin, spring physics, drifts home after idle
 * - only renders while on screen and tab visible; DPR capped at 2
 * - static dotted-map fallback when WebGL is unavailable or the context is lost
 */
export function GlobeCanvas({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const reduce = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0;
    let disposed = false;
    let failed = false;
    const fail = () => {
      if (disposed || failed) return;
      failed = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setStatus("fallback"));
    };

    if (!supportsWebGL()) {
      fail();
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
      };
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = Math.max(1, Math.round(mount.clientWidth || 560));

    let globe: Globe;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi: HOME_PHI + (reduce ? 0 : INTRO_OFFSET),
        theta: HOME_THETA,
        dark: 1,
        diffuse: 1.25,
        mapSamples: 16000,
        mapBrightness: 5.5,
        mapBaseBrightness: 0.02,
        baseColor: [0.2, 0.22, 0.5],
        markerColor: [0.969, 0.576, 0.118],
        glowColor: [0.23, 0.25, 0.71],
        markers,
        arcs,
        arcColor: [0.969, 0.576, 0.118],
        arcWidth: 0.6,
        arcHeight: 0.18,
        markerElevation: MARKER_ELEVATION,
        opacity: 0.92,
      });
    } catch {
      if (canvas.parentElement && canvas.parentElement !== mount) canvas.parentElement.remove();
      canvas.remove();
      fail();
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
      };
    }
    // cobe v2 wraps the canvas in its own positioned div (for CSS anchors).
    const cobeWrapper = canvas.parentElement !== mount ? canvas.parentElement : null;

    // --- interaction state -------------------------------------------------
    let dragTarget = 0;
    let dragValue = 0;
    let dragVel = 0;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastInteraction = -Infinity;
    let swayClock = 0;
    let introClock = reduce ? INTRO_MS : 0;
    let lastPhi = Number.NaN;
    let idleFrames = 0;
    let frames = 0;
    let sizeDirty = false;
    let inView = false;
    let last = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointerId = e.pointerId;
      lastX = e.clientX;
      mount.setPointerCapture(e.pointerId);
      mount.style.cursor = "grabbing";
      lastInteraction = performance.now();
      ensureRunning();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragTarget += (dx / size) * Math.PI;
      lastInteraction = performance.now();
    };
    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      mount.style.cursor = "";
      lastInteraction = performance.now();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      dragTarget += e.key === "ArrowLeft" ? -0.35 : 0.35;
      lastInteraction = performance.now();
      ensureRunning();
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", endDrag);
    mount.addEventListener("pointercancel", endDrag);
    mount.addEventListener("keydown", onKey);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      fail();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    // --- render loop ---------------------------------------------------------
    const updateLabels = (phi: number, theta: number) => {
      globeSites.forEach((site, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const p = project(site, phi, theta);
        const vis = Math.min(1, Math.max(0, (p.z + 0.02) * 6));
        el.style.transform = `translate3d(${(p.x * size).toFixed(1)}px, ${(p.y * size).toFixed(1)}px, 0)`;
        el.style.opacity = vis.toFixed(2);
      });
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || failed) return;
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      // The intro runs on (lightly capped) wall-clock time so slow devices still land on time.
      const introDt = last ? Math.min(now - last, 250) : 16;
      last = now;
      frames += 1;

      // Drift back home after idling.
      if (pointerId === null && now - lastInteraction > RETURN_AFTER_MS) {
        const home = Math.round(dragTarget / TAU) * TAU;
        dragTarget += (home - dragTarget) * (1 - Math.exp(-dt * 0.9));
      }
      // Spring the rendered rotation toward the drag target.
      const stiffness = 90;
      const damping = 16;
      dragVel += ((dragTarget - dragValue) * stiffness - dragVel * damping) * dt;
      dragValue += dragVel * dt;

      let intro = 0;
      if (introClock < INTRO_MS) {
        introClock = Math.min(INTRO_MS, introClock + introDt);
        intro = INTRO_OFFSET * (1 - easeOutCubic(introClock / INTRO_MS));
      }
      let sway = 0;
      if (!reduce) {
        swayClock += dt;
        // Sway eases in once the intro has landed.
        sway = Math.sin(swayClock * 0.22) * SWAY * Math.min(1, swayClock / 4);
      }

      const phi = HOME_PHI + intro + sway + dragValue;
      const moved = Math.abs(phi - lastPhi) > 1e-5;
      idleFrames = moved || sizeDirty ? 0 : idleFrames + 1;

      // Keep drawing for the first frames (map texture loads async), then only on change.
      if (frames < 90 || idleFrames < 2) {
        if (sizeDirty) {
          globe.update({ phi, theta: HOME_THETA, width: size, height: size });
          sizeDirty = false;
        } else {
          globe.update({ phi, theta: HOME_THETA });
        }
        updateLabels(phi, HOME_THETA);
        lastPhi = phi;
      }
      if (frames === 8) setStatus("ready");

      const settled = reduce && frames >= 90 && idleFrames > 30 && pointerId === null;
      if (inView && !document.hidden && !settled) raf = requestAnimationFrame(frame);
    };

    function ensureRunning() {
      if (raf || disposed || failed || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) ensureRunning();
      },
      { rootMargin: "120px" },
    );
    io.observe(mount);

    const onVisibility = () => {
      if (!document.hidden) ensureRunning();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      const next = Math.max(1, Math.round(mount.clientWidth));
      if (next === size) return;
      size = next;
      sizeDirty = true;
      ensureRunning();
    });
    ro.observe(mount);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", endDrag);
      mount.removeEventListener("pointercancel", endDrag);
      mount.removeEventListener("keydown", onKey);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      globe.destroy();
      canvas.remove();
      cobeWrapper?.remove();
    };
  }, [reduce]);

  if (status === "fallback") {
    return <GlobeFallback className={className} />;
  }

  return (
    <div className={cn("@container relative aspect-square w-full", className)}>
      {/* Atmosphere glow behind the globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_50%_60%,rgba(247,147,30,0.28),rgba(59,63,182,0.18)_45%,transparent_70%)] blur-2xl"
      />
      {/* Placeholder ring while WebGL spins up */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-[10%] rounded-full border border-white/10 transition-opacity duration-700",
          status === "ready" ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        ref={mountRef}
        role="img"
        tabIndex={0}
        aria-label="Interactive globe showing Richards Bay and Cape Town in South Africa, and Braunschweig in Germany. Drag or use the arrow keys to rotate."
        className={cn(
          "absolute inset-0 cursor-grab touch-pan-y rounded-full outline-none select-none",
          "focus-visible:ring-lamp-yellow/70 focus-visible:ring-offset-night focus-visible:ring-2 focus-visible:ring-offset-4",
          "transition-[opacity,scale] duration-[1400ms] ease-out",
          status === "ready" ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      />
      {/* DOM labels projected onto markers each frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {globeSites.map((site, i) => (
          <div
            key={site.id}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 will-change-transform"
          >
            <GlobeLabel site={site} placement={labelPlacement[site.id] ?? labelPlacement["richards-bay"]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GlobeLabel({ site, placement }: { site: GlobeSite; placement: string }) {
  return (
    <div className={cn("absolute flex items-center gap-1.5 whitespace-nowrap @md:gap-2", placement)}>
      <span className="h-px w-3 shrink-0 @md:w-5" style={{ background: site.css }} />
      <span className="border-night-line bg-night/80 rounded-lg border px-2 py-1 backdrop-blur-sm">
        {/* Narrow globes drop the kind line (the legend below carries it) to keep labels compact. */}
        <span className="font-dm-mono mb-1 hidden text-[9px] leading-none tracking-[0.18em] text-white/60 uppercase @md:block">
          {site.kind === "home" ? "Home" : site.id === "braunschweig" ? "Germany" : "South Africa"}
        </span>
        <span className="font-display block max-w-[6.5rem] text-[11px] leading-tight font-bold whitespace-normal text-white @md:max-w-none @md:text-[13px] @md:leading-none @md:whitespace-nowrap">
          {site.label}
        </span>
      </span>
    </div>
  );
}
