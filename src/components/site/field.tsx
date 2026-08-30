"use client";

import React from "react";

/**
 * The hero backdrop: the same 48px dot lattice the rest of the site uses for
 * `grid-backdrop`, with one slow wave of light crossing it left to right.
 *
 * Dots ahead of the wave sit at the grid's resting grey. The crest grows them
 * and pulls them to accent, then they decay back over a long trailing tail —
 * a sharp leading edge and a slow release, so it reads as something arriving
 * rather than a light sweeping past. Nothing else is drawn.
 */
const SHADER = /* wgsl */ `
struct Params {
  res: vec2f,
  cell: f32,
  time: f32,
  reveal: f32,
};
@group(0) @binding(0) var<uniform> u: Params;

const REST = vec3f(0.905, 0.900, 0.884);   // the grid grey, on cream
const ACCENT = vec3f(0.745, 0.165, 0.314);

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let cell = max(u.cell, 8.0);
  let g = (fract(uv * u.res / cell) - 0.5) * cell;   // pixels from nearest dot
  let d = length(g);

  // One crest, gently bent so it never reads as a straight bar.
  let head = fract(u.time * 0.075) * 1.36 - 0.18;
  let s = uv.x - head + sin(uv.y * 2.3 + u.time * 0.11) * 0.045;
  let wave = select(exp(s * 4.2), exp(-s * 32.0), s > 0.0);

  let r = 1.05 + wave * 1.45;
  let dot = 1.0 - smoothstep(r, r + 1.15, d);

  var alpha = dot * (0.88 + 0.12 * wave);
  var pre = mix(REST, ACCENT, wave) * alpha;

  // A whisper of light between the dots, so the crest has some body.
  let wash = wave * 0.045;
  pre = pre + vec3f(0.86, 0.55, 0.63) * wash;
  alpha = alpha + wash;

  alpha = clamp(alpha, 0.0, 1.0) * u.reveal;
  return vec4f(pre, alpha); // premultiplied
}
`;

export default function Field({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host || !("gpu" in navigator)) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const { init, surface, effect, frame, frameLoop, clock } = await import("vgpu");
      let gpu;
      try {
        gpu = await init();
      } catch {
        return; // no adapter — the CSS grid stays
      }
      if (disposed) {
        gpu.dispose?.();
        return;
      }

      const view = surface(gpu, canvas, { dpr: [1, 2], clearColor: [0, 0, 0, 0] });
      const params = { res: view.size, cell: 48 * view.dpr, time: 0, reveal: 0 };
      const field = effect(gpu, SHADER, { label: "field", set: { u: params } });
      const time = clock(gpu);

      cleanups.push(() => {
        view.dispose();
        gpu.dispose?.();
      });
      setLive(true);

      if (still) {
        field.set({ u: { ...params, res: view.size, cell: 48 * view.dpr, time: 6, reveal: 1 } });
        frame(gpu, (f) => f.pass(view, field));
        return;
      }

      // No GPU work while the hero is scrolled out of view.
      let onscreen = true;
      const io = new IntersectionObserver(([e]) => (onscreen = e.isIntersecting), {
        rootMargin: "120px",
      });
      io.observe(host);
      cleanups.push(() => io.disconnect());

      const loop = frameLoop(
        gpu,
        (f) => {
          if (!onscreen) return;
          field.set({
            u: {
              res: view.size,
              cell: 48 * view.dpr,
              time: time.time,
              reveal: Math.min(1, time.time / 1.2),
            },
          });
          f.pass(view, field);
        },
        { fps: 60 },
      );
      cleanups.push(() => loop.stop());
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className={className}>
      {/* The static lattice, and what browsers without WebGPU keep. */}
      <div
        className={`grid-backdrop absolute inset-0 transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
