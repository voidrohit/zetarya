import Link from "next/link";
import React from "react";
import { Icon, IconName } from "./icons";
import { Reveal } from "./reveal";
import { DownloadButton, OtherPlatforms } from "./platform";

export function Section({
  children,
  className = "",
  rule = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  rule?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`${rule ? "rule" : ""} ${className}`}>
      <div className="measure py-16 sm:py-20 lg:py-24">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`h-section mt-3 text-[30px] sm:text-[36px] lg:text-[40px] ${
          center ? "mx-auto max-w-[760px]" : "max-w-[720px]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-[16px] leading-relaxed text-muted sm:text-[17px] ${
            center ? "mx-auto max-w-[620px]" : "max-w-[620px]"
          }`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export function FeatureBlock({
  icon,
  title,
  body,
  delay = 0,
}: {
  icon: IconName;
  title: string;
  body: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="group">
      <span className="grid h-[38px] w-[38px] place-items-center rounded bg-surface text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-accent-soft">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <h3 className="mt-3.5 text-[17px] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="measure pb-10 pt-14 text-center sm:pb-12 sm:pt-20">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={70}>
        <h1 className="h-display mx-auto mt-4 max-w-[900px] text-[36px] sm:text-[46px] lg:text-[56px]">
          {title}
        </h1>
      </Reveal>
      {sub && (
        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-relaxed text-muted sm:text-[18px]">
            {sub}
          </p>
        </Reveal>
      )}
      {children && <Reveal delay={200}>{children}</Reveal>}
    </section>
  );
}

export function CtaBanner({
  title = "Start moving files the direct way.",
  sub = "Free forever for personal transfers. 25 GB a month, no card, no account to create.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <div className="measure relative py-20 text-center sm:py-24">
        <Reveal>
          <h2 className="h-section mx-auto max-w-[760px] text-[32px] text-bg sm:text-[40px] lg:text-[44px]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-5 max-w-[600px] text-[16px] leading-relaxed text-white/55 sm:text-[17px]">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <DownloadButton className="btn-primary btn-lg" />
            <span className="opacity-70">
              <OtherPlatforms />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rule border-b bg-surface">
      <div className="measure grid grid-cols-2 gap-8 py-12 sm:py-14 lg:grid-cols-4">{children}</div>
    </div>
  );
}
