import React from "react";
import { Reveal } from "./reveal";
import { Eyebrow } from "./primitives";
import { Icon } from "./icons";
import { RoutePath } from "./route-path";

/**
 * How someone with no app sends you a file.
 *
 * The single most useful thing to say to a visitor whose platform has not
 * shipped yet, which is why it appears on the download page as well as the
 * home page — one component so the two never drift into telling it
 * differently.
 */

const STEPS = [
  {
    icon: "link" as const,
    title: "You have a link",
    body: "Every account gets one at zetarya.com/@username. It never changes and never expires.",
  },
  {
    icon: "globe" as const,
    title: "They open it in a browser",
    body: "No app, no account, no sign-up. Any browser on any machine, including the ones we have not shipped a client for.",
  },
  {
    icon: "devices" as const,
    title: "The files land on your device",
    body: "Encrypted end to end and never written to a disk of ours. You approve each one on the device before a byte is stored.",
  },
];

export function DropLinkSection({ heading }: { heading?: string }) {
  return (
    <>
      <Reveal>
        <Eyebrow>RECEIVE FROM ANYONE</Eyebrow>
        <h2 className="h-section mt-3 max-w-[640px] text-[26px] sm:text-[32px] lg:text-[36px]">
          {heading ?? "Your clients don't need Zetarya to send you something"}
        </h2>
        <p className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-muted sm:text-[17px]">
          You receive in the app, as always. They send from a browser tab, so the person on the
          other end installs nothing and signs up for nothing.
        </p>
      </Reveal>

      {/* The route, before the steps. It is the honest answer to "will this be
          as fast as the rest of the page promised" — no, and here is why. */}
      <Reveal delay={80}>
        <RoutePath variant="relay" className="mt-8" />
      </Reveal>

      {/* The link itself, because the whole idea is easier to see than read. */}
      <Reveal delay={100}>
        <div className="mt-9 flex items-center gap-3 overflow-hidden rounded border border-line bg-card p-4 sm:p-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-accent-soft text-accent">
            <Icon name="link" className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 truncate font-mono text-[15px] tracking-[-0.01em] text-ink sm:text-[17px]">
            zetarya.com/<span className="text-accent">@username</span>
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-9 sm:grid-cols-3 sm:gap-8">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={160 + i * 80}>
            <span className="font-mono text-[11px] font-medium tracking-[0.09em] text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2.5 text-[17px] font-semibold tracking-[-0.01em]">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
          </Reveal>
        ))}
      </div>
    </>
  );
}
