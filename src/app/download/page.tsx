import React from "react";
import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { CtaBanner, PageHero, Section } from "@/components/site/primitives";
import { DropLinkSection } from "@/components/site/drop-link";
import { Reveal } from "@/components/site/reveal";
import { macRelease, windowsRelease, type DesktopRelease } from "@/lib/releases";
import { PLATFORM_GLYPHS, PLATFORM_ORDER, RELEASES, type Platform } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Download - Zetarya",
  description:
    "Zetarya for macOS, Windows and Android: a universal Mac download, a 64-bit Windows installer, and the Android app on Google Play. iOS and Linux are on the way — and anyone can already send you files from a browser.",
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

// Statuses and marks come from the shared table, not a second list here — the
// two had already drifted on Android within a day of being written twice.
//
// READY is derived rather than listed, which is what keeps this page honest:
// macOS used to be hard-coded as the one actionable row, so the day Android
// got a link it would have dropped out of SOON and off the page entirely.
// One width for every row's action, so the buttons share a left edge down the
// column instead of each ending wherever its own label does. 240px clears the
// longest of them ("Get it on Google Play", 224px) with room for the next one.
const ACTION_WIDTH = "min-w-[240px]";

const READY = PLATFORM_ORDER.filter((p) => RELEASES[p].href);
const SOON = PLATFORM_ORDER.filter((p) => !RELEASES[p].href);

export default async function Page() {
  // Both manifests at once: they are independent hosts and one being slow
  // should not hold up the other's row. A platform missing from this map is
  // one whose link is a store listing, which has no version of ours to show.
  const [mac, windows] = await Promise.all([macRelease(), windowsRelease()]);
  const versioned: Partial<Record<Platform, DesktopRelease | null>> = { mac, windows };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Download"
        title={
          <>
            Zetarya for <span className="text-accent">Mac</span>,{" "}
            <span className="text-accent">Windows</span> and{" "}
            <span className="text-accent">Android</span>.
          </>
        }
        sub="A universal Mac download, a 64-bit Windows installer, and the Android app on Google Play. The rest are on their way - and anyone can already send you files without installing a thing."
      />

      <Section>
        <div className="overflow-hidden rounded border border-line">
          {/* Everything you can act on, in order. */}
          {READY.map((platform, i) => {
            const client = RELEASES[platform];
            const Glyph = PLATFORM_GLYPHS[platform];
            // Only our own builds can be mid-publish: those links point at a
            // redirect of ours that has nothing to redirect to between
            // releases. A store listing is either there or it is not.
            const release = versioned[platform];
            const publishing = platform in versioned && !release;
            const detail = release ? `Version ${release.version} · ${client.note}` : client.note;

            return (
              <Reveal key={platform} delay={i * 80}>
                <div
                  className={`flex flex-col gap-6 bg-card p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded bg-ink text-bg">
                      <Glyph className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">
                        {client.label}
                      </h2>
                      <p className="mt-1 text-[14.5px] text-muted">{detail}</p>
                    </div>
                  </div>

                  {publishing ? (
                    <span className={`btn-ghost btn-lg shrink-0 cursor-default ${ACTION_WIDTH}`}>
                      Publishing a new build…
                    </span>
                  ) : (
                    <a
                      href={client.href}
                      {...(client.store
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`btn-primary btn-lg shrink-0 ${ACTION_WIDTH}`}
                    >
                      <Glyph className="h-[17px] w-[17px]" aria-hidden="true" />
                      {client.store ? `Get it on ${client.store}` : "Download"}
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}

          {SOON.map((platform, i) => {
            const client = RELEASES[platform];
            const Glyph = PLATFORM_GLYPHS[platform];
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
        <DropLinkSection heading="Waiting on your platform? You can still receive today." />
      </Section>

      <CtaBanner
        title="Move your first file in under a minute."
        sub="Free forever for personal transfers. 25 GB a month, no card, nothing to configure."
      />
    </SiteShell>
  );
}
