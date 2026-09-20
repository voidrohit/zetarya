"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { EVENTS, capture } from "@/lib/analytics";
import {
  PLATFORM_GLYPHS,
  PLATFORM_ORDER,
  RELEASES,
  downloadLabel,
  shortDownloadLabel,
  type Platform,
} from "@/lib/platforms";

export { RELEASES };
export type { Platform };

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "mac";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/mac/.test(ua)) return "mac";
  if (/win/.test(ua)) return "windows";
  if (/linux|x11/.test(ua)) return "linux";
  return "mac";
}

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => setPlatform(detectPlatform()), []);
  return platform;
}

export function PlatformGlyph({
  platform,
  className = "h-4 w-4",
}: {
  platform: Platform;
  className?: string;
}) {
  const Glyph = PLATFORM_GLYPHS[platform];
  return <Glyph className={className} aria-hidden="true" />;
}

/**
 * The one button, on whatever the visitor is running.
 *
 * On a Mac it downloads and on Android it opens Google Play. On anything with
 * no build yet it goes to /download rather than saying "Coming soon" and
 * stopping — that page says when the others land, and a dead button is a
 * visitor who leaves.
 */
export function DownloadButton({
  className = "btn-primary btn-lg",
  fullLabel = true,
}: {
  className?: string;
  fullLabel?: boolean;
}) {
  const platform = usePlatform();

  // Nothing until the platform is known, so the label never changes under the
  // reader's eyes on first paint.
  if (!platform) {
    return <span className={`${className} pointer-events-none opacity-0`} aria-hidden="true" />;
  }

  const release = RELEASES[platform];
  if (release.href) {
    return (
      <a
        href={release.href}
        // A store listing leaves our site, so it opens alongside it. Our own
        // download does not navigate at all — it is a file — so it must not.
        {...(release.store ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() =>
          capture(EVENTS.downloadClicked, {
            platform,
            kind: release.store ? "store" : "installer",
            // Where on the page it was pressed matters: the hero converting and
            // the footer converting are different findings.
            placement: "primary",
          })
        }
        className={className}
      >
        <PlatformGlyph platform={platform} className="h-[17px] w-[17px]" />
        {fullLabel ? downloadLabel(platform) : shortDownloadLabel(platform)}
      </a>
    );
  }

  return (
    <Link href="/download" className={className}>
      <PlatformGlyph platform="mac" className="h-[17px] w-[17px]" />
      {fullLabel ? "Get Zetarya for Mac" : "Download"}
    </Link>
  );
}

/** The quiet line under the button: what else exists, and what does not. */
export function OtherPlatforms() {
  const platform = usePlatform();
  // Everything but iOS, which is still TestFlight-only and has nowhere public
  // to send anyone. /download lists it with the rest.
  const others = PLATFORM_ORDER.filter((p) => p !== platform && p !== "ios");

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[13px] text-faint">
      {others.map((p) => {
        const release = RELEASES[p];
        const body = (
          <>
            <PlatformGlyph platform={p} className="h-3.5 w-3.5" />
            {release.label}
            {!release.href && <span className="opacity-70">· soon</span>}
          </>
        );
        return release.href ? (
          <a
            key={p}
            href={release.href}
            {...(release.store ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() =>
              capture(EVENTS.downloadClicked, {
                platform: p,
                kind: release.store ? "store" : "installer",
                placement: "other-platforms",
              })
            }
            className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            {body}
          </a>
        ) : (
          <span key={p} className="inline-flex items-center gap-1.5">
            {body}
          </span>
        );
      })}
      <Link href="/download" className="transition-colors hover:text-accent">
        All downloads
      </Link>
    </span>
  );
}
