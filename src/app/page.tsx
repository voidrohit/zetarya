"use client";

import Link from "next/link";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import TransferPanel from "@/components/site/transfer-panel";
import ActivityHeatmap from "@/components/site/activity-heatmap";
import ThroughputChart from "@/components/site/throughput-chart";
import { CountUp } from "@/components/site/count-up";
import { Reveal } from "@/components/site/reveal";
import { Icon } from "@/components/site/icons";
import { PricingCard } from "@/components/site/pricing-card";
import {
  CtaBanner,
  Eyebrow,
  FeatureBlock,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { HOME_FEATURES, METRICS, TIERS } from "@/lib/site-content";
import { DownloadButton, OtherPlatforms } from "@/components/site/platform";

const TICKER = [
  "2 TB MUMBAI → USA",
  "4 H 27 M",
  "1 GBPS SUSTAINED",
  "AES-256 + TLS 1.3 INSIDE",
  "OUR OWN PROTOCOL · UDP",
  "0 BYTES STORED",
  "BYTE-EXACT RESUME",
];

export default function Home() {
  return (
    <SiteShell>
      {/* ---------------- hero ---------------- */}
      <section className="measure pb-12 pt-14 text-center sm:pt-20">
        <Reveal>
          <span className="chip">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            NOW IN BETA
          </span>
        </Reveal>

        <Reveal delay={70}>
          <h1 className="h-display mx-auto mt-6 max-w-[900px] text-[40px] sm:text-[56px] lg:text-[68px]">
            Transfer at full speed.
            <br className="hidden sm:block" /> Nothing in between.
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-relaxed text-muted sm:text-[18px]">
            Our own protocol over UDP. AES-256 inside TLS 1.3. Utilize full available bandwidth up to 1 Gbps between two devices, and
            not one byte parked on a server.
          </p>
        </Reveal>

        <Reveal delay={210}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton className="btn-primary btn-lg w-full sm:w-auto" />
            <Link href="/blog/one-gbps-long-haul" className="btn-ghost btn-lg group w-full sm:w-auto">
              Read the 1 Gbps run
              <Icon
                name="arrow-right"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-[13px] text-faint">
              Free forever for personal transfers. No account, no card.
            </p>
            <OtherPlatforms />
          </div>
        </Reveal>
      </section>

      {/* ---------------- product ---------------- */}
      <div className="measure pb-16 sm:pb-20">
        <Reveal delay={120}>
          <TransferPanel />
        </Reveal>
      </div>

      {/* ---------------- ticker ---------------- */}
      <div className="rule border-b bg-surface py-4">
        <div className="mask-fade-x flex overflow-hidden pause-hover">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex shrink-0 items-center gap-10">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{t}</span>
                <span className="h-1 w-1 rounded-full bg-accent/50" />
              </span>
            ))}
          </div>
          <div aria-hidden className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex shrink-0 items-center gap-10">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{t}</span>
                <span className="h-1 w-1 rounded-full bg-accent/50" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- features ---------------- */}
      <Section>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {HOME_FEATURES.map((f, i) => (
            <FeatureBlock key={f.title} {...f} delay={i * 90} />
          ))}
        </div>
      </Section>

      {/* ---------------- deep dive ---------------- */}
      <Section rule>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>TRACK</Eyebrow>
            <h2 className="h-section mt-4 text-[28px] sm:text-[34px] lg:text-[38px]">
              Every byte, on a timeline
            </h2>
            <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
              A year of transfers at a glance - volume per day, throughput per run, and the exact AWS
              route each one took.
            </p>
            <Link href="/features" className="link-accent mt-6">
              See what it tracks
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <ActivityHeatmap />
          </Reveal>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:order-2">
            <Eyebrow>SPEED</Eyebrow>
            <h2 className="h-section mt-4 text-[28px] sm:text-[34px] lg:text-[38px]">
              We use the whole pipe
            </h2>
            <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
              We pushed 2 TB from Mumbai to N. Virginia in 4 hours 27 minutes - a sustained 1 Gbps end to
              end on AWS EC2 machines. Pro runs at that ceiling, and a dropped link resumes at the exact byte.
            </p>
            <Link href="/features" className="link-accent mt-6">
              See the benchmarks
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="lg:order-1">
            <ThroughputChart />
          </Reveal>
        </div>
      </Section>

      {/* ---------------- metrics ---------------- */}
      <div className="rule border-b bg-surface">
        <div className="measure flex flex-wrap justify-center gap-x-16 gap-y-10 py-14">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80} className="w-[240px]">
              <p className="text-[32px] font-semibold leading-none tracking-[-0.035em] tabular-nums sm:text-[40px]">
                <CountUp
                  value={m.value}
                  decimals={m.decimals}
                  suffix={m.suffix}
                  prefix={(m as any).prefix ?? ""}
                />
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted sm:text-sm">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------------- testimonial ---------------- */}
      <Section>
        <Reveal>
          <blockquote className="mx-auto max-w-[900px] text-center text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] sm:text-[27px] lg:text-[30px]">
            “We were mailing hard drives to the colour grade suite. Now a 400 GB dailies bundle is on
            their machine before the coffee is poured - and legal stopped asking where the copy lives,
            because there isn’t one.”
          </blockquote>
        </Reveal>
      </Section>

      {/* ---------------- pricing preview ---------------- */}
      <Section rule>
        <SectionHeading
          center
          title="Pricing that stays out of the way"
          sub="Free to start, flat monthly after that. No egress fees, no per-gigabyte metering."
        />
        <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <PricingCard tier={t} maxFeatures={3} href="/pricing" />
            </Reveal>
          ))}
        </div>
        <Reveal delay={260}>
          <div className="mt-10 text-center">
            <Link href="/pricing" className="link-accent">
              Compare all plans
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>

      <CtaBanner />
    </SiteShell>
  );
}
