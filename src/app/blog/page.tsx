import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { LogoMark } from "@/components/site/logo";
import { PageHero, Section } from "@/components/site/primitives";
import { POSTS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Blog - Zetarya",
  description: "Throughput experiments, protocol write-ups, and notes from moving very large files.",
};

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-surface2 text-[10px] font-semibold text-muted">
      {initials}
    </span>
  );
}

export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured)!;
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <SiteShell>
      <PageHero
        eyebrow="BLOG"
        title="Notes from the wire"
        sub="Throughput experiments, protocol write-ups, and what we learn from moving other people’s very large files."
      />

      <div className="measure pb-16">
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded border border-line bg-card transition-all duration-300 hover:shadow-lift lg:grid-cols-[460px_1fr]"
          >
            <div className="relative grid h-[220px] place-items-center overflow-hidden bg-surface grid-backdrop lg:h-full">
              <LogoMark className="h-24 w-28 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  {featured.category}
                </span>
                <span className="text-[12.5px] text-faint">
                  {featured.date} · {featured.read}
                </span>
              </div>
              <h2 className="h-section mt-4 text-[26px] sm:text-[32px]">{featured.title}</h2>
              <p className="mt-3 max-w-[560px] text-[16px] leading-relaxed text-muted">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                <Avatar initials={featured.initials} />
                <span className="text-[13px] font-medium">{featured.author}</span>
                <span className="text-[12.5px] text-faint">{featured.role}</span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>

      <Section rule>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <span className="inline-block rounded-md bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  {p.category}
                </span>
                <h3 className="mt-3.5 text-[19px] font-semibold leading-snug tracking-[-0.015em] transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar initials={p.initials} />
                  <span className="text-[13px] font-medium">{p.author}</span>
                </div>
                <p className="mt-2 text-[12.5px] text-faint">
                  {p.date} · {p.read}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
