"use client";

import React, { useState } from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { Icon, IconName } from "@/components/site/icons";
import { PageHero } from "@/components/site/primitives";
import { sendContact } from "@/lib/contact";
import { Turnstile, type TurnstileHandle, turnstileConfigured } from "@/components/site/turnstile";

const CHANNELS: { icon: IconName; label: string; value: string; href: string }[] = [
  { icon: "mail", label: "Support", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "briefcase", label: "Sales", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "alert", label: "Security", value: "admin@zetarya.com", href: "mailto:admin@zetarya.com" },
  { icon: "phone", label: "Phone", value: "+91 91193 34720", href: "tel:+919119334720" },
];

const TOPICS = ["Sales", "Support", "Partnership", "Press", "Other"];

/** Must match TurnstileAction in the backend's contact handler: Cloudflare
 *  echoes this back at verification and a mismatch is refused. */
const TURNSTILE_ACTION = "contact";

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

export default function ContactClient() {
  // Four states rather than a boolean: a form that says "Send message" while
  // it is already sending gets clicked twice, and one that silently does
  // nothing on a failure loses the enquiry without telling anyone.
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [challengeStalled, setChallengeStalled] = useState(false);
  const challenge = React.useRef<TurnstileHandle>(null);

  // A challenge that never arrives leaves the send button disabled with
  // nothing on screen explaining why — which is what a content blocker, a
  // firewalled Cloudflare, or a site key whose allowed-hostname list is
  // missing this domain all look like from the visitor's side. Turnstile does
  // not always call its error callback in those cases, so waiting on it is
  // not enough; after ten seconds with no token we say so and point at the
  // address that always works.
  React.useEffect(() => {
    if (!turnstileConfigured || token) {
      setChallengeStalled(false);
      return;
    }
    const t = setTimeout(() => setChallengeStalled(true), 10_000);
    return () => clearTimeout(t);
  }, [token]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "Sales",
    message: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    // The disabled button is only the visible half of this: a disabled submit
    // button does not stop form.requestSubmit(), and a form that has lost its
    // token to an expiry can reach here looking ready. The backend refuses a
    // tokenless submission anyway — this just avoids spending a request to be
    // told so, and says something more useful than "forbidden".
    if (turnstileConfigured && !token) {
      setError("Finish the check below before sending.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      // website is the honeypot and is always empty from a real browser —
      // it is hidden, and nobody can type into it.
      await sendContact({ ...form, turnstileToken: token, website: "" });
      setStatus("sent");
    } catch (err) {
      // The token has been spent either way. Without this reset a second
      // attempt is refused as a replay, and the form looks broken.
      challenge.current?.reset();
      setToken("");
      // The backend writes these messages for the person reading them, so
      // they are shown as-is. Anything else - the request never landed at
      // all - gets a line that names the fallback.
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong sending that.",
      );
      setStatus("error");
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="CONTACT"
        title="Let’s talk."
        sub="Sales, support, security disclosures or press - pick the right door and you’ll hear back within a working day."
      />

      <div className="measure grid gap-12 pb-20 lg:grid-cols-[1fr_380px] lg:gap-20">
        <Reveal>
          {status === "sent" ? (
            <div className="animate-fade-in rounded border border-line bg-card p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ok/10">
                <Icon name="check" className="h-5 w-5 text-ok" />
              </span>
              <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">
                Thanks - that’s with us.
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                We’ve got your message and will reply to{" "}
                <span className="font-medium text-ink">{form.email}</span>, usually
                within a working day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="relative space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    maxLength={100}
                    autoComplete="name"
                    className={inputCls}
                    placeholder="Jordan Ellis"
                  />
                </Field>
                <Field label="Work email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    maxLength={254}
                    autoComplete="email"
                    className={inputCls}
                    placeholder="jordan@company.com"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Company">
                  <input
                    value={form.company}
                    onChange={set("company")}
                    maxLength={120}
                    autoComplete="organization"
                    className={inputCls}
                    placeholder="Northwind Studios"
                  />
                </Field>
                <Field label="Topic">
                  <select
                    value={form.topic}
                    onChange={set("topic")}
                    className={`${inputCls} appearance-none`}
                  >
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
                  value={form.message}
                  onChange={set("message")}
                  maxLength={5000}
                  className={`${inputCls} resize-y`}
                  placeholder="Tell us what you’re trying to move, and how large it usually is."
                />
              </Field>

              {/* Hidden from people, visible to anything that parses the
                  form. tabIndex and aria-hidden keep it out of the keyboard
                  order and off screen readers, so it is invisible to
                  assistive technology as well as to sighted visitors. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <Turnstile ref={challenge} onToken={setToken} action={TURNSTILE_ACTION} />

              {challengeStalled && (
                <p className="animate-fade-in text-[13.5px] leading-relaxed text-muted">
                  The anti-spam check isn&rsquo;t loading - an ad blocker or a strict
                  network will do that. Email{" "}
                  <a
                    href="mailto:admin@zetarya.com"
                    className="font-medium text-accent underline underline-offset-2"
                  >
                    admin@zetarya.com
                  </a>{" "}
                  and we&rsquo;ll pick it up just the same.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending" || (turnstileConfigured && !token)}
                className="btn-primary btn-lg group disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
                {status !== "sending" && (
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>

              {status === "error" && (
                <p
                  role="alert"
                  className="animate-fade-in text-[13.5px] leading-relaxed text-accent"
                >
                  {error} You can also email{" "}
                  <a
                    href="mailto:admin@zetarya.com"
                    className="font-medium underline underline-offset-2"
                  >
                    admin@zetarya.com
                  </a>{" "}
                  directly.
                </p>
              )}
            </form>
          )}
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
