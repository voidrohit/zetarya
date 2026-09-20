"use client";

import posthog from "posthog-js";

/**
 * PostHog, started from consent and nowhere else.
 *
 * The PostHog wizard wires `posthog.init` into a provider in the root layout,
 * which fires on every page view before anyone has touched the cookie banner.
 * This site promises the opposite in writing — the banner says page views are
 * counted "with your consent", and the privacy policy says the same — so the
 * SDK is started by AnalyticsGate after a yes, and told to stop on a no.
 *
 * Every function here is safe to call when there is no token and when consent
 * has not been given: they return without doing anything. Call sites can
 * therefore record events unconditionally and never guard.
 *
 * Configuration:
 *   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN  the project token (public by design)
 *   NEXT_PUBLIC_POSTHOG_HOST           the cloud region
 *
 * Without the token this whole module is inert, so a local checkout and a
 * preview deploy send nothing anywhere.
 */

const TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

/**
 * Whether the SDK is live is asked of PostHog rather than tracked here.
 *
 * A module-level `started` flag looked equivalent and was not: Fast Refresh
 * re-evaluates this module on an edit, resetting the flag to false while the
 * SDK carried on loaded in the page. Every capture after that returned early
 * and the dashboard just went quiet — no error, nothing to notice.
 */
const loaded = () => posthog.__loaded;

export function startAnalytics() {
  if (!TOKEN || typeof window === "undefined") return;

  // Consent given again after being withdrawn. The SDK is still in the page
  // from last time, only opted out, and init() on a loaded instance does
  // nothing — opting back in is the half that matters.
  if (loaded()) {
    posthog.opt_in_capturing();
    return;
  }

  posthog.init(TOKEN, {
    api_host: HOST,

    // Page views are captured by hand in AnalyticsGate. The App Router changes
    // routes without a document load, so the automatic one fires once and then
    // never again as someone moves through the site.
    capture_pageview: false,
    // Cheap, and the only way to tell a read from a bounce.
    capture_pageleave: true,

    // Off deliberately, and both of these are promises the site has made in
    // writing rather than preferences:
    //   autocapture records every click, input and submit on the page. The
    //   banner says we count page views.
    //   session recording replays the screen, which is not something a person
    //   agreeing to "privacy-preserving analytics" has agreed to.
    autocapture: false,
    disable_session_recording: true,

    // No profile for someone who never signs in — anonymous visitors stay a
    // count rather than becoming a person in a database.
    person_profiles: "identified_only",

    // The cookie stays on zetarya.com. Set loose it would also ride along to
    // api., relay. and auth., which is the cross-site tracking the site says
    // it does not do.
    cross_subdomain_cookie: false,
  });
}

/**
 * Stops capturing when consent is withdrawn.
 *
 * `opt_out_capturing` is the half that matters — the SDK stays loaded in the
 * page but sends nothing further. `reset` then drops the distinct id, so
 * turning analytics back on later starts a new anonymous visitor rather than
 * rejoining the old one.
 */
export function stopAnalytics() {
  if (!loaded()) return;
  posthog.opt_out_capturing();
  posthog.reset();
}

/** One page view. `url` should include the query string where there is one. */
export function capturePageview(url: string) {
  if (!loaded()) return;
  posthog.capture("$pageview", { $current_url: url });
}

/**
 * Anything worth counting that is not a page view.
 *
 * Named events only, listed in EVENTS below, because an event name invented at
 * a call site is one nobody finds again in the dashboard.
 */
export function capture(event: string, properties?: Record<string, unknown>) {
  if (!loaded()) return;
  posthog.capture(event, properties);
}

/**
 * The events this site records, and why each one exists.
 *
 * Two questions pay for this integration: do visitors end up with the app, and
 * do the public links actually deliver files. Everything here answers one of
 * those; nothing here is recorded because it was easy to record.
 */
export const EVENTS = {
  /** A download or store button was used. Which platform, and whether it was
   *  our installer or a store listing. */
  downloadClicked: "download_clicked",

  /** Someone opened a zetarya.com/@name link, and whether it was accepting. */
  dropLinkOpened: "drop_link_opened",
  /** They filled the form in and asked to send. The top of the funnel. */
  dropCreated: "drop_created",
  /** A device accepted and the bytes arrived. The bottom of it. */
  dropDelivered: "drop_delivered",
  /** It did not get there, and what stopped it. */
  dropFailed: "drop_failed",
} as const;
