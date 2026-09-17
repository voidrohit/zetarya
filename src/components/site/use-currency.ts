"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, browserTimezone, currencyForTimezone, type Currency } from "@/lib/pricing";

const KEY = "zetarya.currency";

/**
 * Which currency to show prices in: the visitor's last choice, else the one
 * their timezone implies.
 *
 * Always starts at USD and moves on the first effect, never during render.
 * The pricing page is prerendered, and its crawlable HTML and its
 * schema.org offers are both in dollars — starting anywhere else would make
 * the server and client markup disagree and hand search engines a price that
 * depends on where the build ran.
 */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [currency, set] = useState<Currency>("USD");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      // Private mode, or storage refused. The timezone still answers.
    }
    const next = CURRENCIES.find((c) => c === stored) ?? currencyForTimezone(browserTimezone());
    if (next !== "USD") set(next);
  }, []);

  const choose = (c: Currency) => {
    set(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {
      // A choice that cannot be remembered is still a choice for this visit.
    }
  };

  return [currency, choose];
}
