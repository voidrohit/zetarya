"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteShell from "@/components/site/site-shell";
import { Icon } from "@/components/site/icons";
import { PlatformGlyph, detectPlatform } from "@/components/site/platform";
import { PLATFORM_ORDER, RELEASES, type Platform } from "@/lib/platforms";
import { useAuth } from "@/auth/AuthProvider";
import {
  fetchDevices,
  fetchPayments,
  fetchPlan,
  isUnlimited,
  type Device,
  type Payment,
  type Plan,
} from "@/auth/account";
import { formatPrice, type Currency } from "@/lib/pricing";
import { byMonth, describePlan, invoiceNumber } from "@/lib/invoice";
import { SessionsSection } from "./SessionsSection";

/**
 * The signed-in area: what the account has, what it has used, what is signed
 * in to it, and how to get the app.
 *
 * Every figure comes from the same routes the desktop app reads, so the two
 * can never disagree about a plan.
 */
export function AccountClient() {
  const router = useRouter();
  const { status, user, signOut } = useAuth();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "signedOut") router.replace("/signin?next=/account");
  }, [status, router]);

  useEffect(() => {
    if (status !== "signedIn") return;
    // Independent reads: a missing device list must not blank the plan card.
    fetchPlan().then(setPlan, () => setError("Could not load your plan."));
    fetchDevices().then(setDevices, () => setDevices([]));
    fetchPayments().then(setPayments, () => setPayments([]));
  }, [status]);

  if (status !== "signedIn") {
    return (
      <SiteShell>
        <div className="grid min-h-[60vh] place-items-center text-[14px] text-muted">
          Loading your account…
        </div>
      </SiteShell>
    );
  }

  const business = plan?.plan === "business";

  return (
    <SiteShell>
      <div className="mx-auto max-w-[880px] px-5 py-14">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-7">
          <div>
            <h1 className="font-serif text-[28px] leading-[1.15] tracking-[-0.3px]">
              {user?.name || user?.preferred_username || "Your account"}
            </h1>
            <p className="mt-1 text-[13.5px] text-muted">{user?.email}</p>
          </div>
          <button
            onClick={() => void signOut().then(() => router.push("/"))}
            className="inline-flex min-h-[34px] items-center rounded-lg border border-line bg-surface px-3 text-[12.5px] font-medium text-ink transition-colors hover:bg-bg"
          >
            Sign out
          </button>
        </header>

        {error && <p className="mt-6 text-[13.5px] text-accent">{error}</p>}

        <PlanSection plan={plan} business={business} />
        <DevicesSection devices={devices} />
        <BillingSection payments={payments} />

        <Panel title="Active sessions">
          <SessionsSection maxSessions={plan?.maxSessions} />
        </Panel>

        <DownloadSection />
      </div>
    </SiteShell>
  );
}

/** The app's settings card, to the pixel: same radius, same label, same
 *  padding. Someone moving between the two should not notice a seam. */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-line bg-card ${className}`}>{children}</div>
  );
}

function PlanSection({ plan, business }: { plan: Plan | null; business: boolean }) {
  if (!plan) return null;

  const capped = !isUnlimited(plan.dataLimitBytes);
  const used = capped && plan.dataLimitBytes > 0 ? plan.usedBytes / plan.dataLimitBytes : 0;

  return (
    <Panel title="Plan & usage">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[22px] font-semibold tracking-[-0.01em]">{plan.displayName}</span>
              {business && (
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              {capped
                ? `${formatBytes(plan.usedBytes)} of ${formatBytes(plan.dataLimitBytes)} used this month`
                : `${formatBytes(plan.usedBytes)} moved this month, of unlimited`}
            </p>
          </div>

          {/* A Business account is not offered Business again: the plan is
              already active, and an upsell button on a paid plan reads as a
              second charge waiting to happen. */}
          {!business && (
            <Link href="/pricing" className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-accent-deep px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-night">
              Upgrade to Business
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          )}
        </div>

        {capped && (
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${Math.max(Math.min(used, 1) * 100, plan.usedBytes > 0 ? 2 : 0)}%` }}
            />
          </div>
        )}

        <dl className="mt-6 grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
          <Row label="Transfer speed" value={limit(plan.maxMbps, (v) => `Up to ${v} Mbps`)} />
          <Row label="Recipients per send" value={limit(plan.recipientsPerSend, (v) => `Up to ${v}`)} />
          <Row label="Usage resets" value={date(plan.periodEndsAt)} />
          {plan.planExpiresAt ? <Row label="Plan renews on" value={date(plan.planExpiresAt)} /> : null}
        </dl>
      </Card>
    </Panel>
  );
}

function DevicesSection({ devices }: { devices: Device[] }) {
  return (
    <Panel title="Devices">
      {devices.length === 0 ? (
        <p className="text-[13.5px] text-muted">
          No devices yet. Install the app and sign in — it registers itself.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-card">
          {devices.map((d) => (
            <li key={d.endpointId} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium">{d.name || "Unnamed device"}</p>
                <p className="mt-0.5 font-mono text-[11.5px] text-faint">
                  {d.platform || "unknown"}
                  {d.lastSeenAt ? ` · last seen ${date(d.lastSeenAt)}` : ""}
                </p>
              </div>
              {d.current && (
                <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                  This device
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function BillingSection({ payments }: { payments: Payment[] }) {
  // Settled rows only: an abandoned checkout leaves a 'created' row, and
  // listing it as history reads as a charge that never happened.
  const months = byMonth(payments.filter((p) => p.status !== "created"));

  if (months.length === 0) {
    return (
      <Panel title="Invoices">
        <p className="text-[13.5px] text-muted">
          No payments yet. Receipts appear here once you upgrade.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title="Invoices">
      <div className="flex flex-col gap-5">
        {months.map((month) => (
          <div key={month.key}>
            <h3 className="mb-2 text-[12px] font-medium text-muted">{month.label}</h3>
            <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-card">
              {month.items.map((p) => {
                const plan = describePlan(p.plan);
                return (
                  <li key={p.orderId} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium">
                        {plan.name}
                        <span className="text-muted"> · {plan.term}</span>
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-faint">
                        {invoiceNumber(p)} · {date(p.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-right">
                        <span className="block font-mono text-[13px]">
                          {formatPrice(p.amount, p.currency as Currency)}
                        </span>
                        {p.status !== "paid" && (
                          <span className="block text-[11px] text-accent">{p.status}</span>
                        )}
                      </span>
                      {/* Only a settled payment has a receipt worth filing. */}
                      {p.status === "paid" && (
                        <Link
                          href={`/account/invoice/${encodeURIComponent(p.orderId)}`}
                          className="rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
                        >
                          Receipt
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DownloadSection() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  // After mount: the user agent is not known while prerendering, and guessing
  // would ship the wrong "your device" label in the static HTML.
  useEffect(() => setPlatform(detectPlatform()), []);

  return (
    <Panel title="Get started">
      <Card className="p-5">
        <p className="text-[14px] leading-relaxed text-muted">
          Transfers run directly between your own devices, so nothing moves until the app is on at
          least one of them. Install it, sign in with this account, and it pairs itself.
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {PLATFORM_ORDER.map((key) => {
            const release = RELEASES[key];
            const ready = !!release.href;
            return (
              <a
                key={key}
                href={release.href ?? "/download"}
                className={`flex items-center gap-3 rounded border px-4 py-3 transition-colors ${
                  ready
                    ? "border-line hover:border-ink/25 hover:bg-surface"
                    : "border-line opacity-60"
                }`}
              >
                <PlatformGlyph platform={key} className="h-[17px] w-[17px] shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-medium">
                    {release.label}
                    {key === platform && ready ? " — your device" : ""}
                  </span>
                  <span className="block truncate text-[12px] text-faint">{release.note}</span>
                </span>
              </a>
            );
          })}
        </div>
      </Card>
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="font-mono text-[12.5px]">{value}</dd>
    </div>
  );
}

/** Unlimited is a negative sentinel, never a number to print. */
function limit(value: number, format: (v: number) => string): string {
  return isUnlimited(value) ? "Unlimited" : format(value);
}

function date(millis: number): string {
  if (!millis) return "—";
  return new Date(millis).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBytes(bytes: number): string {
  if (isUnlimited(bytes)) return "Unlimited";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value >= 100 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}
