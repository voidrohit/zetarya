/**
 * Which clients exist, one platform at a time.
 *
 * Plain data with no "use client", because both a server component (the
 * download page) and client components (the nav button) need it. It lived in
 * platform.tsx and was copied into the download page, which drifted within a
 * day — Android was "In Google Play review" in one and "Planned" in the other.
 *
 * A platform with an `href` is downloadable. That is the only test anywhere.
 */
import type React from "react";
import { FaApple, FaGooglePlay, FaLinux, FaWindows } from "react-icons/fa";

export type Platform = "mac" | "windows" | "linux" | "ios" | "android";

export const RELEASES: Record<
  Platform,
  {
    label: string;
    note: string;
    href?: string;
    /** Set when `href` is a store listing rather than a file of ours. You get
     *  an app from a store and you download a file from us, and a button
     *  should not use the same verb for both. */
    store?: string;
  }
> = {
  mac: {
    label: "macOS",
    note: "Apple silicon and Intel · macOS 11 or later",
    // Redirects to the current build rather than naming a version, so a
    // release does not need this file edited. See src/app/api/download/mac.
    href: "/api/download/mac",
  },
  windows: {
    label: "Windows",
    note: "64-bit · Windows 10 and later",
    // Same shape as mac: a redirect of ours that resolves the current version
    // from the updater manifest. See src/app/api/download/windows.
    href: "/api/download/windows",
  },
  ios: { label: "iOS", note: "In TestFlight, App Store review next" },
  android: {
    label: "Android",
    note: "On Google Play",
    href: "https://play.google.com/store/apps/details?id=com.zetarya.app",
    store: "Google Play",
  },
  linux: { label: "Linux", note: "Planned" },
};

/** Download order: what you can have, then what is closest to being real. */
export const PLATFORM_ORDER: Platform[] = ["mac", "windows", "ios", "android", "linux"];

/**
 * The mark each platform is shown with, in one place.
 *
 * It was written out separately in platform.tsx and in the download page,
 * which is the same duplication that had Android described two different ways
 * before this file existed.
 *
 * Android carries Google Play's logo rather than the robot: every route to the
 * Android build now goes through the store, and the mark on a button should be
 * the one on the page it opens.
 */
export const PLATFORM_GLYPHS: Record<
  Platform,
  React.ComponentType<{ className?: string }>
> = {
  mac: FaApple,
  ios: FaApple,
  windows: FaWindows,
  android: FaGooglePlay,
  linux: FaLinux,
};

/** What a platform's primary button says. */
export function downloadLabel(platform: Platform): string {
  const release = RELEASES[platform];
  return release.store ? `Get it on ${release.store}` : `Download for ${release.label}`;
}

/** The same, compacted for the nav, where the bar has no room for a sentence. */
export function shortDownloadLabel(platform: Platform): string {
  return RELEASES[platform].store ?? "Download";
}
