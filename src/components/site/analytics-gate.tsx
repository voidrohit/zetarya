"use client";

import React from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { useConsent } from "@/lib/consent";

/**
 * Analytics mounts here and only here, once the visitor has said yes.
 *
 * Both of these used to sit in the root layout and load on every page view
 * regardless of the banner. Rendering them from consent means "Essential only"
 * genuinely sends nothing: the scripts are never inserted, so there is no
 * request for a content blocker to block either.
 *
 * Content blockers (Brave Shields, uBlock) will still block these hosts for
 * visitors who have opted in — that is the blocker's call, not ours, and it
 * fails quietly. The page does not depend on either script loading.
 */
export default function AnalyticsGate() {
  const consent = useConsent();
  if (!consent?.analytics) return null;

  return (
    <>
      <Script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "796a32ce7e8b4cdc97d74505ea4b4e50"}'
      />
      <Analytics />
    </>
  );
}
