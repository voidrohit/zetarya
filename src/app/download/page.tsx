import React from "react";
import type { Metadata } from "next";
import { FaApple, FaWindows, FaLinux, FaAndroid } from "react-icons/fa";
import SiteShell from "@/components/site/site-shell";
import { CtaBanner, PageHero, Section } from "@/components/site/primitives";
import { DropLinkSection } from "@/components/site/drop-link";
import { Reveal } from "@/components/site/reveal";
import { macRelease } from "@/lib/releases";
import { PLATFORM_ORDER, RELEASES, type Platform } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Download - Zetarya",
  description:
    "Zetarya for macOS: one universal download for Apple silicon and Intel. Windows, iOS, Android and Linux are on the way — and anyone can already send you files from a browser.",
  alternates: { canonical: "/download" },
};

/**
 * One page, one list.
 *
 * Every platform sits in the same column, in the order they become real. A
 * separate "on the way" section further down read as two pages stapled
 * together; this reads as a product that has shipped on one platform and is
 * working through the rest.
 */

// Statuses come from the shared table, not a second list here — the two had
// already drifted on Android within a day of being written twice.
const GLYPHS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  mac: FaApple,
  ios: FaApple,
  windows: FaWindows,
  android: FaAndroid,
  linux: FaLinux,
};

const SOON = PLATFORM_ORDER.filter((p) => !RELEASES[p].href);

export default async function Page() {
  const release = await macRelease();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Download"
        title={
          <>
            Zetarya for <span className="text-accent">Mac</span>.
          </>
        }
        sub="One download for Apple silicon and Intel. The rest are on their way - and anyone can already send you files without installing a thing."
      />

      <Section>
        <div className="overflow-hidden rounded border border-line">
          {/* macOS leads on its own row: it is the one you can act on. */}
          <Reveal>
            <div className="flex flex-col gap-6 bg-card p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded bg-ink text-bg">
                  <FaApple className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">
                    macOS
                  </h2>
                  <p className="mt-1 text-[14.5px] text-muted">
                    {release
                      ? `Version ${release.version} · Apple silicon and Intel · macOS 11 or later`
                      : "Apple silicon and Intel · macOS 11 or later"}
                  </p>
                </div>
              </div>

              {release ? (
                <a href="/api/download/mac" className="btn-primary btn-lg shrink-0">
                  <FaApple className="h-[17px] w-[17px]" aria-hidden="true" />
                  Download
                </a>
              ) : (
                <span className="btn-ghost btn-lg shrink-0 cursor-default">
                  Publishing a new build…
                </span>
              )}
            </div>
          </Reveal>

          {SOON.map((platform, i) => {
            const client = RELEASES[platform];
            const Glyph = GLYPHS[platform];
            return (
            <Reveal key={platform} delay={80 + i * 60}>
              <div className="flex items-center justify-between gap-5 border-t border-line bg-surface/60 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded bg-surface text-faint">
                    <Glyph className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-muted">
                      {client.label}
                    </h2>
                    <p className="mt-0.5 text-[13.5px] text-faint">{client.note}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.08em] text-faint">
                  SOON
                </span>
              </div>
            </Reveal>
            );
          })}
        </div>

        <Reveal delay={380}>
          <p className="mt-6 text-center text-[13.5px] text-faint">
            Free forever for personal transfers. No account needed to receive.
          </p>
        </Reveal>
      </Section>

      <Section rule>
        <DropLinkSection heading="Not on a Mac? You can still receive today." />
      </Section>

      <CtaBanner
        title="Move your first file in under a minute."
        sub="Free forever for personal transfers. 25 GB a month, no card, nothing to configure."
      />
    </SiteShell>
  );
}
