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
import Field from "@/components/site/field";
import { FaqList } from "@/components/site/faq-list";
import { DropLinkSection } from "@/components/site/drop-link";
import { RoutePath } from "@/components/site/route-path";
import { HOME_FAQS, HOME_FEATURES, METRICS, TIERS } from "@/lib/site-content";
import { businessPrice, freePrice } from "@/lib/pricing";
import { useCurrency } from "@/components/site/use-currency";
import { DownloadButton, OtherPlatforms } from "@/components/site/platform";
import JsonLd from "@/components/site/json-ld";
import { faqPage, graph, softwareApplication, webPage } from "@/lib/schema";

const TICKER = [
  "2 TB MUMBAI → USA",
  "5 HOURS",
  // The run peaked at a gigabit; the product has no ceiling. Two separate
  // claims — merged into "beyond 1 Gbps sustained" they described neither.
  "1 GBPS PEAK · NO CEILING",
  "AES-256 + TLS 1.3 INSIDE",
  "0 BYTES STORED",
  "BYTE-EXACT RESUME",
];

export default function Home() {
  const [currency] = useCurrency();

  return (
    <SiteShell>
      <JsonLd data={graph(
        webPage({
          path: "/",
          name: "Zetarya — Transfer files beyond 1 Gbps",
          description:
            "Send very large files directly between two devices. No speed cap — 1 Gbps sustained and beyond. Encrypted end to end, resumable to the byte, nothing stored.",
          extra: { mainEntity: { "@id": "https://zetarya.com/#software" } },
        }),
        softwareApplication(),
        faqPage("/", HOME_FAQS),
      )} />
      {/* ---------------- hero ---------------- */}
      <section className="relative isolate overflow-hidden">
        <Field className="mask-fade-y pointer-events-none absolute inset-0 -z-10" />

        <div className="measure pb-14 pt-14 text-center sm:pt-24 lg:pb-20">
          {/*<Reveal>*/}
          {/*  <span className="chip">*/}
          {/*    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />*/}
          {/*    NOW LIVE*/}
          {/*  </span>*/}
          {/*</Reveal>*/}

          <Reveal delay={70}>
            <h1 className="h-display mx-auto mt-6 max-w-[900px] text-[40px] sm:text-[56px] lg:text-[68px]">
              Transfer at full speed.
              <br className="hidden sm:block" /> Nothing in between.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-relaxed text-muted sm:text-[18px]">
              P2P fully encrypted high speed data transfer system.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <DownloadButton className="btn-primary btn-lg w-full sm:w-auto" />
              <Link
                href="/whitepaper"
                className="btn-ghost btn-lg group w-full sm:w-auto"
              >
                Read the white paper
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
        </div>
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
          <Reveal className="lg:order-2">
            <Eyebrow>SPEED · DEVICE TO DEVICE</Eyebrow>
            <h2 className="h-section mt-4 text-[28px] sm:text-[34px] lg:text-[38px]">
              We use the whole pipe
            </h2>
            <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
              Between two devices running the app, whatever your network can do, Zetarya does.
              Across a desk there is no upload step at all - the file crosses your own Wi-Fi. Across
              the world we moved 2 TB from Mumbai to N. Virginia in 5 hours, touching a gigabit and
              holding close to it the whole way. Lose the link and it resumes at the exact byte.
            </p>
            <RoutePath variant="direct" className="mt-7 max-w-[420px]" />
            <Link href="/features" className="link-accent mt-6">
              See the features
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="lg:order-1">
            <ThroughputChart />
          </Reveal>
        </div>
      </Section>

      {/* ---------------- receive from anyone ----------------
          On its own surface deliberately. It is the second of the two routes
          and the slower one, so it should not read as a continuation of the
          gigabit story immediately above it. */}
      <Section rule className="bg-surface">
        <DropLinkSection />
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
      {/* ---------------- track: kept back deliberately, see note above ---------------- */}
      <Section rule>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>TRACK</Eyebrow>
            <h2 className="h-section mt-4 text-[28px] sm:text-[34px] lg:text-[38px]">
              Every byte, on a timeline
            </h2>
            <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
              A year of transfers at a glance - volume per day, throughput per run, and the exact
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
      </Section>

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
        <div className="mx-auto mt-12 grid max-w-[780px] items-start gap-6 md:grid-cols-2">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <PricingCard
                // Monthly here, as the preview always was; /pricing is where
                // the yearly term and the currency are actually chosen. The
                // currency still follows the visitor, so the two pages do not
                // quote different money for the same plan.
                tier={
                  t.name === "Free"
                    ? { ...t, price: freePrice(currency) }
                    : { ...t, ...businessPrice(currency, false) }
                }
                maxFeatures={3}
                href="/pricing"
              />
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

      {/* ---------------- faq ---------------- */}
      <Section rule id="faq" className="scroll-mt-[72px]">
        <SectionHeading
          center
          title="The questions people actually ask"
          sub="The small details, answered properly. Billing questions live on the pricing page."
        />
        <FaqList items={HOME_FAQS} />
        <Reveal className="mt-10 text-center">
          <Link href="/faq" className="link-accent">
            All questions
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-10 text-center text-sm text-muted">
            Something not covered?{" "}
            <Link href="/contact" className="font-semibold text-accent hover:underline">
              Ask us
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <CtaBanner />
    </SiteShell>
  );
}
