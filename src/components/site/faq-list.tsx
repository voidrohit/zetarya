"use client";

import React from "react";
import { Icon } from "./icons";
import { Reveal } from "./reveal";
import type { Faq } from "@/lib/site-content";

/**
 * The accordion used by both /pricing and the homepage. Each page passes the
 * questions it wants; whatever is rendered here is also what that page's
 * FAQPage structured data must list, so the two stay in step.
 */
export function FaqList({
  items,
  defaultOpen = 0,
}: {
  items: Faq[];
  /** Index to start expanded, or null for all collapsed. */
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = React.useState<number | null>(defaultOpen);

  return (
    <div className="mx-auto mt-12 max-w-[800px]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={Math.min(i, 8) * 50}>
            <div className="border-t border-line">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[16px] font-semibold tracking-[-0.01em] sm:text-[16.5px]">
                  {f.q}
                </span>
                <Icon
                  name="chevron-down"
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)] ${
                  isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[680px] text-[15.5px] leading-relaxed text-muted">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
