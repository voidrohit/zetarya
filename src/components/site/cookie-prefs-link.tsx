"use client";

import React from "react";
import { OPEN_PREFERENCES } from "./cookie-banner";

/**
 * Reopens the cookie panel after a choice has been made. Withdrawing consent
 * has to be as easy as giving it, and the banner never shows twice — without
 * this there is no way back to the toggles.
 */
export default function CookiePrefsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))}
      className="text-[13px] transition-colors hover:text-accent"
    >
      Cookie preferences
    </button>
  );
}
