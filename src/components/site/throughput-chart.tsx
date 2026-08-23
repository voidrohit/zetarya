"use client";

import React from "react";
import { useInView } from "./reveal";

const ROWS = [
  { name: "Zetarya · record run", value: "1,000 Mb/s", pct: 100, hot: true },
  { name: "Cloud storage sync", value: "118 Mb/s", pct: 11.8, hot: false },
  { name: "Browser upload service", value: "44 Mb/s", pct: 4.4, hot: false },
];

export default function ThroughputChart() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="rounded border border-line bg-card p-5 sm:p-7">
      <h3 className="text-sm font-semibold">2 TB across the planet</h3>
      <p className="mt-1 text-[12.5px] text-muted">
        Mumbai → N. Virginia on AWS · record run, 4 h 27 m
      </p>

      <div className="mt-6 space-y-5">
        {ROWS.map((r, i) => (
          <div key={r.name}>
            <div className="flex items-center justify-between gap-3">
              <span className={`text-[13px] ${r.hot ? "font-semibold text-ink" : "text-muted"}`}>
                {r.name}
              </span>
              <span
                className={`font-mono text-xs ${r.hot ? "font-semibold text-accent" : "text-muted"}`}
              >
                {r.value}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded bg-surface2">
              <div
                className={`h-full rounded ${r.hot ? "bg-accent" : "bg-faint"}`}
                style={{
                  width: inView ? `${r.pct}%` : "0%",
                  transition: `width 1100ms cubic-bezier(.16,1,.3,1) ${i * 140}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
