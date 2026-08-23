"use client";

import React, { useEffect, useState } from "react";
import { FaApple, FaWindows, FaLinux, FaAndroid } from "react-icons/fa";

export type Platform = "mac" | "windows" | "linux" | "ios" | "android";

export const DOWNLOADS: Record<Platform, { href: string; label: string }> = {
  mac: { href: "/download/zetarya.pkg", label: "Download for Mac" },
  ios: { href: "/download/zetarya.pkg", label: "Download for iOS" },
  windows: { href: "/download/zetarya.exe", label: "Download for Windows" },
  linux: { href: "/download/zetarya.exe", label: "Download for Linux" },
  android: { href: "/download/zetarya.exe", label: "Download for Android" },
};

const GLYPHS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  mac: FaApple,
  ios: FaApple,
  windows: FaWindows,
  linux: FaLinux,
  android: FaAndroid,
};

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
  const Glyph = GLYPHS[platform];
  return <Glyph className={className} aria-hidden="true" />;
}

/** Clients are not shipping yet — every download entry point reads "Coming soon". */
export const DOWNLOADS_LIVE = false;

export function DownloadButton({
  className = "btn-primary btn-lg",
  fullLabel = true,
}: {
  className?: string;
  fullLabel?: boolean;
}) {
  const platform = usePlatform();

  if (!DOWNLOADS_LIVE) {
    return (
      <span
        role="button"
        aria-disabled="true"
        className={`${className} cursor-default hover:!bg-accent hover:!shadow-none active:!scale-100`}
      >
        {platform && <PlatformGlyph platform={platform} className="h-[17px] w-[17px]" />}
        Coming soon
      </span>
    );
  }

  if (!platform) {
    return <span className={`${className} pointer-events-none opacity-0`} aria-hidden="true" />;
  }
  const d = DOWNLOADS[platform];
  return (
    <a href={d.href} download className={className}>
      <PlatformGlyph platform={platform} className="h-[17px] w-[17px]" />
      {fullLabel ? d.label : "Download"}
    </a>
  );
}

const PLATFORM_LABEL: Record<Platform, string> = {
  mac: "macOS",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  android: "Android",
};

export function OtherPlatforms() {
  const platform = usePlatform();
  const shown: Platform[] = ["mac", "windows", "linux"];

  if (!DOWNLOADS_LIVE) {
    return (
      <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[13px] text-faint">
        {shown.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <PlatformGlyph platform={p} className="h-3.5 w-3.5" />
            {PLATFORM_LABEL[p]}
          </span>
        ))}
        <span className="opacity-80">· builds land soon</span>
      </span>
    );
  }

  const others = shown.filter((p) => {
    if (!platform) return true;
    if (platform === "ios") return p !== "mac";
    if (platform === "android") return p !== "linux";
    return p !== platform;
  });

  return (
    <span className="inline-flex items-center gap-3">
      {others.map((p) => (
        <a
          key={p}
          href={DOWNLOADS[p].href}
          download
          className="inline-flex items-center gap-1.5 text-[13px] text-faint transition-colors hover:text-accent"
        >
          <PlatformGlyph platform={p} className="h-3.5 w-3.5" />
          {PLATFORM_LABEL[p]}
        </a>
      ))}
    </span>
  );
}
