import type { Payment } from "@/auth/account";

/**
 * Who is issuing. The same details the site already publishes in its
 * schema.org Organization block, so the document and the markup cannot drift.
 */
export const SELLER = {
  name: "Zetarya",
  parent: "zero2",
  email: "admin@zetarya.com",
  phone: "+91 91193 34720",
  city: "Jaipur",
  region: "Rajasthan",
  country: "India",
} as const;

/**
 * A stable, human-readable number for one payment.
 *
 * Derived from the order rather than counted, because a counter would need
 * somewhere to live and would renumber every time the list was refiltered.
 * The order id is already unique and already on the Razorpay side of the
 * transaction, which is what makes this reconcilable.
 */
export function invoiceNumber(payment: Payment): string {
  const d = new Date(payment.createdAt || Date.now());
  const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  return `ZTA-${stamp}-${payment.orderId.replace(/^order_/, "").slice(-8).toUpperCase()}`;
}

/** "September 2026" — the bucket a payment belongs to.
 *
 *  A zero date reads as "Undated" rather than January 1970. A payment with no
 *  timestamp is a data error, and 1970 is the kind of wrong that looks like a
 *  real answer: it sorts, it renders, and nobody reports it. */
export function monthLabel(millis: number): string {
  if (!millis) return "Undated";
  return new Date(millis).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/** Sort key for a month, so groups order newest-first without parsing names. */
export function monthKey(millis: number): string {
  // Undated rows sort last rather than to 1970, which would bury them under
  // every real month instead of leaving them visible at the end.
  if (!millis) return "0000-00";
  const d = new Date(millis);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Payments grouped into months, newest first, each group newest first. */
export function byMonth(payments: Payment[]): { key: string; label: string; items: Payment[] }[] {
  const groups = new Map<string, Payment[]>();
  for (const p of [...payments].sort((a, b) => b.createdAt - a.createdAt)) {
    const key = monthKey(p.createdAt);
    const bucket = groups.get(key);
    if (bucket) bucket.push(p);
    else groups.set(key, [p]);
  }
  return [...groups.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => ({ key, label: monthLabel(items[0].createdAt), items }));
}

/** What the plan id means on a document someone files for their accounts. */
export function describePlan(planId: string): { name: string; term: string } {
  if (planId.includes("annual")) return { name: "Zetarya Business", term: "12 months" };
  if (planId.includes("monthly")) return { name: "Zetarya Business", term: "1 month" };
  return { name: `Zetarya ${planId.replace(/_/g, " ")}`, term: "—" };
}
