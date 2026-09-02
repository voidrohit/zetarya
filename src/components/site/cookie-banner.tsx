"use client";

import React from "react";
import Link from "next/link";
import { DECLINED, GRANTED, setConsent, useConsent, type Consent } from "@/lib/consent";

/** Lets the footer reopen the panel after a choice has been made. */
export const OPEN_PREFERENCES = "zetarya:open-cookie-preferences";

const CATEGORIES: {
  key: keyof Consent;
  title: string;
  body: string;
  locked?: boolean;
}[] = [
  {
    key: "essential",
    title: "Essential",
    body: "Remembers this cookie choice and keeps you signed in. The site cannot work without it, so it cannot be switched off.",
    locked: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    body: "Counts page views so we know which pages are worth writing. First-party and aggregate: no advertising, no profile, no cross-site tracking.",
  },
];

export default function CookieBanner() {
  const consent = useConsent();
  const [panel, setPanel] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // Held back a beat so the banner does not fight the page for attention on
  // first paint. `consent === null` means the visitor has not been asked.
  React.useEffect(() => {
    if (consent !== null) return;
    const t = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(t);
  }, [consent]);

  // Reopening from the footer starts the toggles at whatever is in force.
  React.useEffect(() => {
    const open = () => {
      setAnalytics(consent?.analytics ?? false);
      setPanel(true);
    };
    window.addEventListener(OPEN_PREFERENCES, open);
    return () => window.removeEventListener(OPEN_PREFERENCES, open);
  }, [consent]);

  const decide = (next: Consent) => {
    const revoking = consent?.analytics === true && !next.analytics;
    setConsent(next);
    setPanel(false);
    // Unmounting the script element does not unload a script the browser has
    // already executed — the beacon would keep reporting until the next
    // navigation. Reload so withdrawal takes effect now rather than eventually.
    if (revoking) window.location.reload();
  };

  const askingNow = consent === null && ready;
  if (!askingNow && !panel) return null;

  if (panel) {
    return (
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-title"
          className="max-h-[88vh] w-full max-w-[520px] animate-slide-up overflow-y-auto rounded-t border border-line bg-card p-6 shadow-panel sm:rounded"
        >
          <h2 id="cookie-prefs-title" className="text-[17px] font-semibold">
            Cookie preferences
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            Choose what we may store on this device. You can change this at any time from the link in
            the footer.
          </p>

          <div className="mt-5 space-y-3">
            {CATEGORIES.map((c) => {
              const on = c.locked ? true : analytics;
              return (
                <div key={c.key} className="rounded border border-line p-4">
                  <label className="flex cursor-pointer items-start justify-between gap-4">
                    <span>
                      <span className="block text-[14px] font-semibold">{c.title}</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">
                        {c.body}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={c.locked}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      aria-label={c.locked ? `${c.title} (always on)` : c.title}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-accent disabled:opacity-45"
                    />
                  </label>
                  {c.locked && (
                    <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-faint">
                      ALWAYS ON
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => decide(analytics ? GRANTED : DECLINED)}
              className="btn-primary btn-md flex-1"
            >
              Save preferences
            </button>
            <button onClick={() => decide(GRANTED)} className="btn-ghost btn-md flex-1">
              Accept all
            </button>
          </div>

          <p className="mt-4 text-[12px] text-faint">
            More detail in our{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

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
            onClick={() => {
              setAnalytics(false);
              setPanel(true);
            }}
            className="text-[13.5px] font-medium text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Manage preferences
          </button>
          <button onClick={() => decide(DECLINED)} className="btn-ghost btn-md">
            Essential only
          </button>
          <button onClick={() => decide(GRANTED)} className="btn-primary btn-md">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
