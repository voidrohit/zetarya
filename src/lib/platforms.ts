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
export type Platform = "mac" | "windows" | "linux" | "ios" | "android";

export const RELEASES: Record<
  Platform,
  { label: string; note: string; href?: string }
> = {
  mac: {
    label: "macOS",
    note: "Apple silicon and Intel, one download",
    // Redirects to the current build rather than naming a version, so a
    // release does not need this file edited. See src/app/api/download/mac.
    href: "/api/download/mac",
  },
  windows: { label: "Windows", note: "In build - next after macOS" },
  ios: { label: "iOS", note: "In TestFlight, App Store review next" },
  android: { label: "Android", note: "In Google Play review" },
  linux: { label: "Linux", note: "Planned" },
};

/** Download order: what you can have, then what is closest to being real. */
export const PLATFORM_ORDER: Platform[] = ["mac", "windows", "ios", "android", "linux"];
