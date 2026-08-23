"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { LogoMark } from "./logo";
import { useInView } from "./reveal";

/* ---------------------------------------------------------------------------
   A single peer-to-peer transfer, simulated honestly.

   2 TB at a sustained 1 Gbps takes 4 h 26 m 40 s. We advance a simulated clock
   60 s per tick so the whole run plays out in about a minute, while every
   number on screen — throughput, transferred, progress, elapsed, ETA — stays
   internally consistent with that real arithmetic.
--------------------------------------------------------------------------- */

const TOTAL_MB = 2_000_000; // 2 TB
const TARGET_MBPS = 1000; // 1 Gbps
const SIM_DT = 60; // simulated seconds per tick
const TICK_MS = 250;
const RAMP_SECONDS = 600; // reach full speed over the first 10 simulated minutes
const BARS = 60;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function speedAt(elapsed: number, i: number) {
  const ramp = easeOutCubic(Math.min(1, elapsed / RAMP_SECONDS));
  // gentle downward drift only — a healthy direct link does not swing around,
  // and it never reports above the plan ceiling
  const drift =
    1 - 0.009 * (0.5 - 0.5 * Math.cos(i * 0.19)) - 0.005 * (0.5 - 0.5 * Math.cos(i * 0.61 + 1.1));
  return Math.max(0, Math.min(TARGET_MBPS, TARGET_MBPS * ramp * drift));
}

function fmtSize(mb: number) {
  if (mb >= 1_000_000) return `${(mb / 1_000_000).toFixed(2)} TB`;
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

function fmtSpeed(mbps: number) {
  return mbps >= 1000 ? `${(mbps / 1000).toFixed(2)} Gbps` : `${Math.round(mbps)} Mbps`;
}

function fmtClock(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

function fmtEta(sec: number) {
  if (!isFinite(sec) || sec <= 0) return "—";
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

type State = {
  tick: number;
  elapsed: number;
  sent: number;
  speed: number;
  peak: number;
  bars: number[];
  done: boolean;
};

const INITIAL: State = {
  tick: 0,
  elapsed: 0,
  sent: 0,
  speed: 0,
  peak: 0,
  bars: Array(BARS).fill(0),
  done: false,
};

export default function TransferPanel() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [s, setS] = useState<State>(INITIAL);
  const holdRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // Show a representative mid-transfer frame instead of animating.
      const bars = Array.from({ length: BARS }, (_, i) => speedAt(RAMP_SECONDS + i * SIM_DT, i));
      setS({
        tick: 133,
        elapsed: 133 * SIM_DT,
        sent: TOTAL_MB * 0.5,
        speed: TARGET_MBPS,
        peak: TARGET_MBPS,
        bars,
        done: false,
      });
      return;
    }

    const id = window.setInterval(() => {
      setS((prev) => {
        if (prev.done) {
          holdRef.current += 1;
          return holdRef.current > 12 ? ((holdRef.current = 0), INITIAL) : prev;
        }

        const tick = prev.tick + 1;
        const elapsed = tick * SIM_DT;
        const speed = speedAt(elapsed, tick);
        const sent = Math.min(TOTAL_MB, prev.sent + (speed / 8) * SIM_DT);
        const done = sent >= TOTAL_MB;

        return {
          tick,
          elapsed,
          sent,
          speed: done ? 0 : speed,
          peak: Math.max(prev.peak, speed),
          bars: [...prev.bars.slice(1), done ? 0 : speed],
          done,
        };
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [inView]);

  const pct = (s.sent / TOTAL_MB) * 100;
  const remainingMb = TOTAL_MB - s.sent;
  const etaSec = s.speed > 0 ? remainingMb / (s.speed / 8) : Infinity;
  const avg = s.elapsed > 0 ? (s.sent * 8) / s.elapsed : 0;

  const ringLen = 2 * Math.PI * 54;
  const ringOffset = ringLen * (1 - pct / 100);

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute -inset-x-8 -top-24 h-[380px] grid-backdrop mask-fade-b opacity-70" />

      <div className="relative overflow-hidden rounded border border-line bg-card shadow-panel">
        {/* chrome */}
        <div className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="h-4 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight">
                {s.done ? "Delivered" : "Transferring"}
              </p>
              <p className="truncate font-mono text-[10px] text-faint">
                session 0x8F2A · 1 recipient · udp direct
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded bg-card px-2.5 py-1.5 font-mono text-[10px] text-muted sm:inline-flex">
              <Icon name="lock" className="h-3 w-3 text-accent" />
              AES-256 · TLS 1.3
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
              {s.done ? "Done" : "Live"}
            </span>
          </div>
        </div>

        <div className="grid gap-px bg-line lg:grid-cols-[1fr_300px]">
          {/* ---------------- left ---------------- */}
          <div className="bg-card p-4 sm:p-6">
            <p className="font-mono text-[10px] tracking-[0.12em] text-faint">
              TOTAL THROUGHPUT · LAST 60 MINUTES
            </p>

            <div className="mt-2 flex items-end justify-between gap-3">
              <div className="flex items-end gap-2">
                <span className="text-[34px] font-semibold leading-none tracking-[-0.035em] tabular-nums sm:text-[40px]">
                  {s.speed >= 1000 ? (s.speed / 1000).toFixed(2) : Math.round(s.speed)}
                </span>
                <span className="pb-1 text-sm font-medium text-muted">
                  {s.speed >= 1000 ? "Gbps" : "Mbps"}
                </span>
              </div>
              <span className="hidden shrink-0 font-mono text-[11px] text-muted sm:inline">
                plan limit 1 Gbps · 1 recipient
              </span>
            </div>

            {/* graph */}
            <div className="mt-5 flex gap-3">
              <div className="hidden w-8 shrink-0 flex-col justify-between py-[2px] text-right font-mono text-[9px] text-faint sm:flex">
                <span>1G</span>
                <span>750</span>
                <span>500</span>
                <span>250</span>
                <span>0</span>
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex h-[132px] items-end gap-[2px] sm:gap-[3px]">
                  {s.bars.map((v, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t-[2px] transition-[height] duration-200 ease-linear"
                      style={{
                        height: `${Math.max(1.5, (v / TARGET_MBPS) * 100)}%`,
                        background: `rgba(190,42,80,${0.22 + 0.78 * Math.pow(i / (BARS - 1), 1.7)})`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9.5px] text-faint">
                  {["-60m", "-45m", "-30m", "-15m", "now"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* the two peers */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded bg-surface p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-card">
                  <Icon name="laptop" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-semibold">MacBook Pro</span>
                  <span className="block truncate text-[11px] text-muted">This device</span>
                </span>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-1">
                <Icon name="arrow-right" className="h-4 w-4 text-accent" />
                <span className="font-mono text-[9px] text-faint">udp</span>
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded bg-surface p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-card">
                  <Icon name="drive" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-semibold">Studio-iMac</span>
                  <span className="block truncate text-[11px] text-muted">ana@studio.io</span>
                </span>
              </div>
            </div>

            {/* the file */}
            <div className="mt-4 rounded border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <Icon name="file" className="h-3.5 w-3.5 shrink-0 text-muted" />
                  <span className="truncate text-[13px] font-medium">dailies-2026-08-23.zip</span>
                </span>
                <span className="shrink-0 font-mono text-[11.5px] font-semibold tabular-nums text-accent">
                  {pct.toFixed(1)}%
                </span>
              </div>

              <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-200 ease-linear"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
                <span className="tabular-nums">
                  {fmtSize(s.sent)} / 2.00 TB
                </span>
                <span className="tabular-nums">
                  {s.done ? "complete" : `${fmtSpeed(s.speed)} · ${fmtEta(etaSec)} left`}
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- right ---------------- */}
          <div className="flex flex-col gap-px bg-line">
            <div className="bg-card p-5 sm:p-6">
              <p className="font-mono text-[10px] tracking-[0.12em] text-faint">SESSION PROGRESS</p>
              <div className="mt-4 flex justify-center">
                <div className="relative h-[132px] w-[132px]">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#EAE8E5" strokeWidth="11" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#BE2A50"
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray={ringLen}
                      strokeDashoffset={ringOffset}
                      className="transition-[stroke-dashoffset] duration-200 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] tabular-nums">
                      {Math.round(pct)}%
                    </span>
                    <span className="mt-1.5 font-mono text-[10px] tabular-nums text-muted">
                      {fmtSize(s.sent)} / 2 TB
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                <div>
                  <p className="font-mono text-[9.5px] tracking-[0.1em] text-faint">ELAPSED</p>
                  <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums">
                    {fmtClock(s.elapsed)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] tracking-[0.1em] text-faint">REMAINING</p>
                  <p className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-accent">
                    {s.done ? "0:00" : fmtEta(etaSec)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-1">
              <div className="bg-card p-5 sm:px-6">
                <p className="font-mono text-[9.5px] tracking-[0.1em] text-faint">AVERAGE SPEED</p>
                <p className="mt-1.5 text-[24px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                  {avg >= 1000 ? (avg / 1000).toFixed(2) : Math.round(avg)}
                  <span className="ml-1 text-[12px] font-medium text-muted">
                    {avg >= 1000 ? "Gbps" : "Mbps"}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[10px] text-faint">
                  peak {fmtSpeed(s.peak)}
                </p>
              </div>

              <div className="bg-card p-5 sm:px-6">
                <p className="font-mono text-[9.5px] tracking-[0.1em] text-faint">ROUTE</p>
                <p className="mt-1.5 text-[13px] font-semibold">Mumbai → N. Virginia</p>
                <p className="mt-1 font-mono text-[10px] text-faint">direct · 0 relays</p>
              </div>
            </div>

            <div className="flex-1 bg-card p-5 sm:px-6 sm:pb-6">
              <div className="flex items-start gap-2.5 rounded bg-surface p-3">
                <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                <p className="text-[11.5px] leading-relaxed text-muted">
                  Encrypted on this device, decrypted on theirs. Nothing is written to our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
