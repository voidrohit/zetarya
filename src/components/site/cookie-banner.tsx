"use client";

import React, { useEffect, useState } from "react";

const KEY = "zetarya-cookie-choice";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) {
        const t = window.setTimeout(() => setShow(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* storage blocked — stay hidden */
    }
  }, []);

  const choose = (v: string) => {
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] animate-slide-up border-t border-line bg-card shadow-[0_-8px_32px_-8px_rgba(10,10,10,0.1)]">
      <div className="measure flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[640px]">
          <p className="text-sm font-semibold">We use one analytics cookie</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
            Essential cookies keep you signed in. With your consent we also count page views using
            privacy-preserving first-party analytics. No advertising, no cross-site tracking.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => choose("manage")}
            className="text-[13.5px] font-medium text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Manage preferences
          </button>
          <button onClick={() => choose("essential")} className="btn-ghost btn-md">
            Essential only
          </button>
          <button onClick={() => choose("all")} className="btn-primary btn-md">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
