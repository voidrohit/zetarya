"use client";

import React from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { useConsent } from "@/lib/consent";
import { capturePageview, startAnalytics, stopAnalytics } from "@/lib/analytics";

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
  const allowed = consent?.analytics === true;

  return (
    <>
      {allowed && (
        <>
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "796a32ce7e8b4cdc97d74505ea4b4e50"}'
          />
          <Analytics />
        </>
      )}
      {/* Always mounted, so that withdrawing consent reaches the SDK. A
          component rendered only while `allowed` would simply unmount, and
          PostHog would carry on from memory with nobody left to stop it.

          Suspense is not optional here: this sits in the root layout, and
          useSearchParams without a boundary opts every page in the site out of
          static rendering. */}
      <React.Suspense fallback={null}>
        <PostHog allowed={allowed} />
      </React.Suspense>
    </>
  );
}

/**
 * Starts and stops PostHog, and records a page view per route.
 *
 * The App Router moves between pages without a document load, so the SDK's own
 * page view fires once on arrival and never again. `usePathname` changes on
 * every navigation, which is the signal it is missing.
 */
function PostHog({ allowed }: { allowed: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (allowed) startAnalytics();
    else stopAnalytics();
  }, [allowed]);

  React.useEffect(() => {
    if (!allowed || !pathname) return;
    const query = searchParams?.toString();
    capturePageview(window.origin + pathname + (query ? `?${query}` : ""));
  }, [allowed, pathname, searchParams]);

  return null;
}
