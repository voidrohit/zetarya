"use client";

import React, { useState } from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { Icon, IconName } from "@/components/site/icons";
import { PageHero } from "@/components/site/primitives";

const CHANNELS: { icon: IconName; label: string; value: string; href: string }[] = [
  { icon: "mail", label: "Support", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "briefcase", label: "Sales", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "alert", label: "Security", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "phone", label: "Phone", value: "+91 91193 34720", href: "tel:+919119334720" },
];

const TOPICS = ["Sales", "Support", "Partnership", "Press", "Other"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded border border-line bg-card px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <PageHero
        eyebrow="CONTACT"
        title="Let’s talk."
        sub="Sales, support, security disclosures or press — pick the right door and you’ll hear back within a working day."
      />

      <div className="measure grid gap-12 pb-20 lg:grid-cols-[1fr_380px] lg:gap-20">
        <Reveal>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <input required className={inputCls} placeholder="Jordan Ellis" />
              </Field>
              <Field label="Work email">
                <input required type="email" className={inputCls} placeholder="jordan@company.com" />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company">
                <input className={inputCls} placeholder="Northwind Studios" />
              </Field>
              <Field label="Topic">
                <select className={`${inputCls} appearance-none`} defaultValue="Sales">
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Message">
              <textarea
                required
                rows={6}
                className={`${inputCls} resize-y`}
                placeholder="Tell us what you’re trying to move, and how large it usually is."
              />
            </Field>

            <button type="submit" className="btn-primary btn-lg group">
              {sent ? "Thanks — we’ll be in touch" : "Send message"}
              {!sent && (
                <Icon
                  name="arrow-right"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>

            {sent && (
              <p className="animate-fade-in text-[13.5px] text-muted">
                This form is a demo — for anything urgent, email{" "}
                <a href="mailto:admin@zetarya.com" className="font-medium text-accent hover:underline">
                  admin@zetarya.com
                </a>
                .
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={120}>
          <aside className="rounded bg-surface p-7">
            <h2 className="text-[16px] font-semibold">Straight to the right team</h2>
            <div className="mt-5">
              {CHANNELS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-3 border-t border-line py-3.5"
                >
                  <Icon name={c.icon} className="h-4 w-4 shrink-0 text-muted" />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-muted">{c.label}</span>
                    <span className="block truncate text-[13.5px] font-semibold transition-colors group-hover:text-accent">
                      {c.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="font-mono text-[10.5px] tracking-[0.09em] text-faint">OFFICE</p>
              <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-muted">
                {"Zetarya by zero2\nJaipur, Rajasthan\nIndia"}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2.5 rounded bg-card p-3">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ok" />
              <span className="text-[12.5px] text-muted">
                Typical response: under 24 hours on weekdays
              </span>
            </div>
          </aside>
        </Reveal>
      </div>
    </SiteShell>
  );
}
