import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Icon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Page not found - Zetarya",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="measure grid min-h-[62vh] place-items-center py-20 text-center">
        <div>
          <p className="animate-fade-in text-[96px] font-semibold leading-none tracking-[-0.05em] text-surface2 sm:text-[132px]">
            404
          </p>
          <h1 className="h-section mt-6 text-[28px] sm:text-[36px]">This page went missing.</h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
            The link may be broken, or the page may have moved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary btn-lg w-full sm:w-auto">
              Back home
            </Link>
            <Link href="/features" className="btn-ghost btn-lg group w-full sm:w-auto">
              Explore features
              <Icon
                name="arrow-right"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
