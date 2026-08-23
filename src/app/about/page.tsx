import type { Metadata } from "next";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import {
  CtaBanner,
  FeatureBlock,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { VALUES } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About - Zetarya",
  description: "We're building the transfer tool we wished we had.",
};

const STORY = [
  "In 2022 our friend shipping colour-graded footage between two studios eleven kilometres apart. The fastest reliable method was a motorcycle. Everything else meant uploading a terabyte to a data centre in another country so that someone across town could download it back again.",
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

      <CtaBanner
        title="Send us something large."
        sub="The fastest way to understand Zetarya is to move a file you would normally dread moving."
      />
    </SiteShell>
  );
}
