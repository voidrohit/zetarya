import type { Metadata } from "next";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/primitives";
import { CHANGELOG } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Changelog - Zetarya",
  description: "Every Zetarya release, in reverse order.",
};

export default function ChangelogPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="CHANGELOG"
        title="What shipped"
        sub="Every release, in reverse order. Clients auto-update; self-hosted relays are versioned separately."
      >
        <form className="mx-auto mt-8 flex max-w-[440px] flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@company.com"
            aria-label="Email address"
            className="flex-1 rounded border border-line bg-card px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
          <button type="submit" className="btn-primary btn-md shrink-0">
            Subscribe to updates
          </button>
        </form>
      </PageHero>

      <div className="measure pb-20">
        {CHANGELOG.map((e, i) => (
          <Reveal key={e.version} delay={i * 60}>
            <article className="grid gap-6 border-t border-line py-10 lg:grid-cols-[200px_1fr] lg:gap-14">
              <div className="lg:pt-1">
                <p className="font-mono text-[13px] font-semibold">{e.version}</p>
                <p className="mt-1 text-[13.5px] text-muted">{e.date}</p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span
                      key={t.label}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                        t.kind === "New"
                          ? "bg-accent-soft text-accent"
                          : "bg-surface2 text-muted"
                      }`}
                    >
                      {t.kind} · {t.label}
                    </span>
                  ))}
                </div>

                <h2 className="mt-4 text-[21px] font-semibold leading-snug tracking-[-0.02em] sm:text-[22px]">
                  {e.title}
                </h2>

                <ul className="mt-4 space-y-2.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                      <span className="text-[15.5px] leading-[1.68] text-muted">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SiteShell>
  );
}
