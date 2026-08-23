"use client";

import React, { useMemo } from "react";
import { useInView } from "./reveal";

const LEVELS = ["#EAE8E5", "rgba(190,42,80,.2)", "rgba(190,42,80,.4)", "rgba(190,42,80,.68)", "#BE2A50"];

export default function ActivityHeatmap({ weeks = 38 }: { weeks?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const cells = useMemo(
    () =>
      Array.from({ length: weeks }, (_, c) =>
        Array.from({ length: 7 }, (_, r) => {
          const v =
            (Math.sin(c * 0.7 + r * 1.9) + Math.sin(c * 0.23 + r * 0.6) + Math.sin(c * 1.31 + r * 0.31)) / 3;
          return v < -0.35 ? 0 : v < 0.02 ? 1 : v < 0.32 ? 2 : v < 0.6 ? 3 : 4;
        })
      ),
    [weeks]
  );

  return (
    <div ref={ref} className="rounded border border-line bg-card p-5 sm:p-6">
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-2">
          <span className="text-[26px] font-semibold leading-none tracking-[-0.03em] sm:text-[30px]">412</span>
          <span className="pb-0.5 text-[13px] text-muted">TB moved this year</span>
        </div>
        <span className="font-mono text-[11px] text-faint">84 transfers</span>
      </div>

      <div className="mt-5 flex gap-[3px] sm:gap-1">
        {cells.map((col, c) => (
          <div key={c} className="flex flex-1 flex-col gap-[3px] sm:gap-1">
            {col.map((lvl, r) => (
              <span
                key={r}
                className="aspect-square w-full rounded-[2px] transition-all duration-500"
                style={{
                  backgroundColor: LEVELS[lvl],
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(.4)",
                  transitionDelay: `${c * 12 + r * 6}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-faint">
        <span>Sep</span>
        <span className="flex items-center gap-1.5">
          less
          {LEVELS.map((c, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          more
        </span>
        <span>Aug</span>
      </div>
    </div>
  );
}
