"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/site/icons";
import { Logo } from "@/components/site/logo";

/**
 * The auth screens' furniture, matched to the desktop app's.
 *
 * Same split: an unlit panel carrying the argument, and a narrow column
 * carrying the form. Same control shapes — 42px rows, 8px radius, a brand
 * focus ring — so someone who signs in on the site and then in the app is
 * looking at one product rather than two.
 */

const ASSURANCES = ["AES-256 end-to-end", "Local-first", "Zero tracking"];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100vh]">
      <aside className="relative hidden w-[44%] max-w-[720px] shrink-0 flex-col overflow-hidden bg-accent-night text-white lg:flex">
        {/* Two soft lights rather than a flat fill, so the panel has depth
            without an image to load. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 20% 15%, rgba(190,42,80,0.45), transparent 70%), radial-gradient(50% 40% at 85% 90%, rgba(190,42,80,0.28), transparent 70%)",
          }}
        />

        <div className="relative flex h-full flex-col px-10 py-11 xl:px-14 xl:py-12">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <Logo className="h-[22px]" onDark />
          </Link>

          <div className="flex flex-1 flex-col justify-center gap-6 py-12">
            {/* Broken on its own sentences. Left to wrap inside a character
                clamp it splits mid-sentence, which reads as an accident. */}
            <h1 className="font-serif text-[31px] leading-[1.18] tracking-[-0.5px] text-white/95 xl:text-[40px]">
              <span className="block">Your files.</span>
              <span className="block">Your network.</span>
              <span className="block text-accent-dim">No cloud in between.</span>
            </h1>
            <p className="max-w-[34ch] text-[14.5px] leading-[1.65] text-white/50">
              Device-to-device transfers at the speed of your network.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {ASSURANCES.map((label) => (
              <li key={label} className="flex items-center gap-2 text-[12px] text-white/45">
                <Icon name="check" className="h-3 w-3" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex w-full flex-col overflow-y-auto px-6 py-10 sm:px-10">
        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center gap-7 py-6">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <Logo className="h-[22px]" />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="font-serif text-[30px] leading-[1.15] tracking-[-0.3px] text-ink">{title}</h2>
      {subtitle && <p className="text-[13.5px] leading-[1.5] text-muted">{subtitle}</p>}
    </div>
  );
}

export const inputClass =
  "w-full min-h-[42px] rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink " +
  "shadow-sm transition-colors placeholder:text-faint " +
  "focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/25 disabled:opacity-60";

export const buttonClass =
  "inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg px-4 text-sm " +
  "font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] " +
  "focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50";

export const primaryButton = `${buttonClass} bg-accent-deep text-white enabled:hover:bg-accent-night`;
export const outlineButton = `${buttonClass} border border-line bg-surface text-ink enabled:hover:bg-bg`;

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink">
        {label}
        {hint}
      </span>
      {children}
    </label>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2.5 text-[13px] text-accent-deep"
    >
      <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function Separator({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] text-faint">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** One field, not six boxes: paste works, screen readers read it as one
 *  thing, and nobody has to tab between digits. */
export function CodeInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <input
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      placeholder="000000"
      className={`${inputClass} text-center font-mono text-[20px] tracking-[0.5em]`}
    />
  );
}

/** The screens keep their own shell so the layout is chosen once, here. */
export function AuthShell({
  title,
  sub,
  children,
  footer,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <Heading title={title} subtitle={sub} />
      <div className="flex flex-col gap-4">{children}</div>
      {footer && <div className="text-[13.5px] text-muted">{footer}</div>}
    </>
  );
}
