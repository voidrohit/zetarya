import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "./reveal";

export type LegalSection = { heading: string; paragraphs: string[] };

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <SiteShell>
      <header className="rule border-b border-t-0">
        <div className="measure py-14 sm:py-16">
          <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">LEGAL</p>
          <h1 className="h-display mt-4 text-[34px] sm:text-[44px] lg:text-[48px]">{title}</h1>
          <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
        </div>
      </header>

      <div className="measure grid gap-12 py-14 lg:grid-cols-[236px_1fr] lg:gap-16">
        <nav className="lg:sticky lg:top-[96px] lg:self-start">
          <p className="font-mono text-[10.5px] tracking-[0.09em] text-faint">CONTENTS</p>
          <ul className="mt-4 space-y-2.5">
            {sections.map((s, i) => (
              <li key={s.heading}>
                <a
                  href={`#${slug(s.heading)}`}
                  className={`block text-[13px] leading-snug transition-colors hover:text-accent ${
                    i === 0 ? "font-semibold text-accent" : "text-muted"
                  }`}
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-prose">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={Math.min(i * 30, 180)}>
              <section id={slug(s.heading)} className={i > 0 ? "mt-10 scroll-mt-28" : "scroll-mt-28"}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[21px]">
                    {s.heading}
                  </h2>
                </div>
                <div className="mt-3.5 space-y-3.5">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-[15.5px] leading-[1.72] text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
