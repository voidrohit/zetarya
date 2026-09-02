"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent, stored on the device and nowhere else.
 *
 * The banner used to be decorative: Cloudflare Insights and Vercel Analytics
 * were mounted unconditionally in the root layout, so page views were already
 * being counted before anyone clicked anything, and "Essential only" only wrote
 * a string to localStorage. Analytics now mounts from this value and nothing
 * else, so declining actually declines.
 *
 * Only two categories exist because only two things exist. Inventing a
 * "Marketing" toggle for a site that runs no ad tech would be the same
 * dishonesty in a nicer wrapper.
 */
export type Consent = {
  /** Always true. Listed so the panel can show what it cannot switch off. */
  essential: true;
  /** Privacy-preserving page counts. Off until explicitly allowed. */
  analytics: boolean;
};

const KEY = "zetarya-consent";

/** The previous single-string key: "all" | "essential" | "manage". */
const LEGACY_KEY = "zetarya-cookie-choice";

// Frozen so useSyncExternalStore sees a stable reference and does not loop.
export const GRANTED: Consent = Object.freeze({ essential: true, analytics: true });
export const DECLINED: Consent = Object.freeze({ essential: true, analytics: false });

let cachedRaw: string | null = null;
let cached: Consent | null = null;

function parse(raw: string): Consent {
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    let analytics = false;
    try {
      analytics = JSON.parse(raw)?.analytics === true;
    } catch {
      /* corrupt value — treat as declined rather than assuming consent */
    }
    cached = analytics ? GRANTED : DECLINED;
  }
  return cached!;
}

/** null means "not asked yet" — the banner shows. */
function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return parse(raw);

    // Carry over the old choice. "manage" is deliberately not migrated: it
    // dismissed the banner without ever presenting a choice, so those visitors
    // were never actually asked and get asked now.
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy === "all") return GRANTED;
    if (legacy === "essential") return DECLINED;
    return null;
  } catch {
    // Storage blocked (private mode, hardened browser). Default to no
    // analytics — the safe direction — and keep the banner quiet.
    return DECLINED;
  }
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Keeps other tabs of the site in step with the choice made here.
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

export function setConsent(next: Consent) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ analytics: next.analytics }));
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* not persistable; the in-memory value below still applies for this page */
  }
  cachedRaw = null;
  cached = null;
  notify();
}

/** Clears the choice so the banner asks again. */
export function resetConsent() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
  cachedRaw = null;
  cached = null;
  notify();
}

// The server cannot know a per-device choice, so it renders the
// not-yet-decided state and the client corrects it on hydration.
const serverSnapshot = () => null;

export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, read, serverSnapshot);
}
