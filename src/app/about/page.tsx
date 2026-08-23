import type { Metadata } from "next";
import Link from "next/link";
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
import { TEAM, VALUES } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About — Zetarya",
  description: "We're building the transfer tool we wished we had.",
};

const STORY = [
  "In 2023 we were shipping colour-graded footage between two studios eleven kilometres apart. The fastest reliable method was a motorcycle. Everything else meant uploading a terabyte to a data centre in another country so that someone across town could download it back again.",
  "That detour is the default because storing your file is how most products make money. We wanted the other shape: a direct encrypted link between two machines, no copy anywhere else, and every bit of the line you are already paying for.",
  "Zetarya is that link. It runs on desktop and mobile, on our own protocol over UDP, and it keeps nothing. Fifteen of us work on it now, across four time zones, and we still measure every release against a motorcycle.",
];

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="ABOUT"
        title="We’re building the transfer tool we wished we had."
        sub="Zetarya started because four of us kept couriering hard drives across a city with gigabit fibre in every building."
      />

      <div className="measure pb-16 sm:pb-20">
        <div className="mx-auto max-w-prose space-y-6">
          {STORY.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="text-[17px] leading-[1.75] sm:text-[17.5px]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="rule border-b bg-surface">
        <div className="measure grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {VALUES.map((v, i) => (
            <FeatureBlock key={v.title} {...v} delay={i * 90} />
          ))}
        </div>
      </div>

      <Section>
        <SectionHeading center title="The people on it" />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={(i % 4) * 80}>
              <div className="group">
                <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded bg-surface transition-colors duration-300 group-hover:bg-accent-soft">
                  <span className="text-[28px] font-semibold tracking-[-0.02em] text-faint transition-colors duration-300 group-hover:text-accent">
                    {m.initials}
                  </span>
                </div>
                <p className="mt-3.5 text-center text-[15px] font-semibold">{m.name}</p>
                <p className="mt-0.5 text-center text-[13px] text-muted">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div
            id="hiring"
            className="mx-auto mt-14 flex max-w-[640px] flex-col items-center gap-4 rounded border border-line p-7 text-center sm:flex-row sm:justify-center sm:text-left"
          >
            <p className="text-[15px]">We’re hiring across protocol, mobile and support.</p>
            <Link href="/contact" className="link-accent">
              See open roles
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>

      <CtaBanner
        title="Send us something large."
        sub="The fastest way to understand Zetarya is to move a file you would normally dread moving."
      />
    </SiteShell>
  );
}
