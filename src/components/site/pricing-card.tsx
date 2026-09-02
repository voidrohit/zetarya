"use client";

import Link from "next/link";
import React from "react";
import { Icon } from "./icons";
import type { Tier } from "@/lib/site-content";

export function PricingCard({
  tier,
  href,
  onCta,
  busy = false,
  soon = false,
  maxFeatures,
}: {
  tier: Tier;
  href?: string;
  onCta?: () => void;
  busy?: boolean;
  soon?: boolean;
  maxFeatures?: number;
}) {
  const features = maxFeatures ? tier.features.slice(0, maxFeatures) : tier.features;

  const label = (
    <>
      {soon ? "Coming soon" : busy ? "Opening checkout…" : tier.cta}
      {!busy && !soon && tier.highlight && (
        <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  return (
    <div
      className={`group/card relative flex flex-col rounded border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        tier.highlight ? "border-accent" : "border-line"
      }`}
    >
      {tier.highlight && (
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{tier.name}</h3>
        {tier.highlight && (
          <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
            Most popular
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end gap-1.5">
        <span className="text-[40px] font-semibold leading-none tracking-[-0.035em]">{tier.price}</span>
        {tier.unit && <span className="pb-1 text-sm text-muted">{tier.unit}</span>}
      </div>

      {tier.note && <p className="mt-2 text-[12.5px] text-faint">{tier.note}</p>}

      <p className="mt-3 text-sm leading-relaxed text-muted">{tier.desc}</p>

      {soon ? (
        <span
          role="button"
          aria-disabled="true"
          className={`group mt-6 w-full cursor-default ${
            tier.highlight ? "btn-primary hover:!bg-accent hover:!shadow-none" : "btn-ghost hover:!bg-transparent"
          } btn-md active:!scale-100`}
        >
          {label}
        </span>
      ) : onCta ? (
        <button
          type="button"
          onClick={onCta}
          disabled={busy}
          className={`group mt-6 w-full ${tier.highlight ? "btn-primary" : "btn-ghost"} btn-md disabled:opacity-60`}
        >
          {label}
        </button>
      ) : (
        <Link
          href={href || "/contact"}
          className={`group mt-6 w-full ${tier.highlight ? "btn-primary" : "btn-ghost"} btn-md`}
        >
          {label}
        </Link>
      )}

      <ul className="mt-7 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="text-[13.5px] leading-relaxed text-muted">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
