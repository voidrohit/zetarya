import type { Metadata } from "next";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { Icon } from "@/components/site/icons";
import {
  CtaBanner,
  FeatureBlock,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { COMPARISON, FEATURE_GROUPS } from "@/lib/site-content";
import JsonLd from "@/components/site/json-ld";
import { breadcrumbs, graph, softwareApplication, webPage } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Features - Zetarya",
  description:
    "One encrypted link between two devices, on our own protocol over UDP. Up to 1 Gbps, AES-256 inside TLS 1.3, nothing stored.",
};

export default function FeaturesPage() {
  return (
    <SiteShell>
      <JsonLd data={graph(
        breadcrumbs("https://zetarya.com/features", [{ name: "Features", path: "/features" }]),
        webPage({
          path: "/features",
          name: "Features - Zetarya",
          description:
            "One encrypted link between two devices, on our own protocol over UDP. Up to 1 Gbps, AES-256 inside TLS 1.3, nothing stored.",
          trail: [],
          extra: { mainEntity: { "@id": "https://zetarya.com/#software" } },
        }),
        softwareApplication(),
      )} />
      <PageHero
        eyebrow="FEATURES"
        title={
          <>
            Everything you need.
            <br className="hidden sm:block" /> Nothing you don’t.
          </>
        }
        sub="One encrypted link between two devices, and the controls you need around it. No storage tier to manage, no share links to expire."
      />

      {FEATURE_GROUPS.map((group) => (
        <Section key={group.label} rule>
          <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">
              {group.label}
            </p>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">
              {group.heading}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((f, i) => (
              <FeatureBlock key={f.title} {...f} delay={i * 90} />
            ))}
          </div>
        </Section>
      ))}

      <Section rule>
        <SectionHeading
          center
          title="How it compares"
          sub="Measured against the two things teams usually reach for instead."
        />

        {/* desktop table */}
        <Reveal delay={100}>
          <div className="mt-12 hidden overflow-hidden rounded border border-line lg:block">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-surface">
              <div className="px-5 py-4 text-[13px] font-semibold text-muted">Capability</div>
              {COMPARISON.columns.map((c, i) => (
                <div
                  key={c}
                  className={`px-5 py-4 text-[13px] font-semibold ${i === 0 ? "text-accent" : "text-muted"}`}
                >
                  {c}
                </div>
              ))}
            </div>
            {COMPARISON.rows.map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-t border-line transition-colors hover:bg-surface/60"
              >
                <div className="px-5 py-4 text-[13.5px] font-medium">{row[0]}</div>
                <div className="flex items-center gap-2 px-5 py-4 text-[13.5px] font-semibold">
                  <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {row[1]}
                </div>
                <div className="px-5 py-4 text-[13.5px] text-muted">{row[2]}</div>
                <div className="px-5 py-4 text-[13.5px] text-muted">{row[3]}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* mobile cards */}
        <div className="mt-10 grid gap-4 lg:hidden">
          {COMPARISON.rows.map((row, i) => (
            <Reveal key={row[0]} delay={i * 40}>
              <div className="rounded border border-line bg-card p-4">
                <p className="text-[13.5px] font-semibold">{row[0]}</p>
                <div className="mt-3 space-y-2">
                  {COMPARISON.columns.map((c, ci) => (
                    <div key={c} className="flex items-center justify-between gap-3">
                      <span
                        className={`flex items-center gap-2 text-[12.5px] ${
                          ci === 0 ? "font-semibold" : "text-muted"
                        }`}
                      >
                        {ci === 0 && <Icon name="check" className="h-3 w-3 text-accent" />}
                        {c}
                      </span>
                      <span
                        className={`text-right text-[12.5px] ${
                          ci === 0 ? "font-semibold text-accent" : "text-muted"
                        }`}
                      >
                        {row[ci + 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Try it on your largest file."
        sub="Pair two devices and watch a 60 GB folder move without an upload bar in sight."
      />
    </SiteShell>
  );
}
