"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/site/logo";
import { Icon } from "@/components/site/icons";
import { useAuth } from "@/auth/AuthProvider";
import { fetchPayments, type Payment } from "@/auth/account";
import { formatPrice, type Currency } from "@/lib/pricing";
import { SELLER, describePlan, invoiceNumber } from "@/lib/invoice";

/**
 * One payment as a document worth filing.
 *
 * Printed rather than generated as a PDF: every browser can already turn a
 * page into one, it honours the reader's own paper size, and it saves shipping
 * a PDF library to everyone who never opens this page. The print stylesheet is
 * what makes it a document instead of a screenshot of the site.
 */
export function InvoiceClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { status, user } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (status === "signedOut") {
      router.replace(`/signin?next=/account/invoice/${encodeURIComponent(orderId)}`);
    }
  }, [status, router, orderId]);

  useEffect(() => {
    if (status !== "signedIn") return;
    // The list is the only read there is; one payment is found in it rather
    // than fetched, which also means an order belonging to someone else is
    // simply not there.
    fetchPayments().then(
      (all) => {
        const found = all.find((p) => p.orderId === orderId) ?? null;
        setPayment(found);
        setMissing(!found);
      },
      () => setMissing(true),
    );
  }, [status, orderId]);

  if (missing) {
    return (
      <Frame>
        <p className="text-[14px] text-muted">
          No payment with that reference on this account.{" "}
          <Link href="/account" className="font-semibold text-accent hover:underline">
            Back to your account
          </Link>
        </p>
      </Frame>
    );
  }

  if (!payment) {
    return (
      <Frame>
        <p className="text-[14px] text-muted">Loading…</p>
      </Frame>
    );
  }

  const plan = describePlan(payment.plan);
  const amount = formatPrice(payment.amount, payment.currency as Currency);
  const issued = new Date(payment.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Frame>
      {/* Screen-only controls. `print:hidden` keeps them off the paper. */}
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink"
        >
          <Icon name="arrow-left" className="h-3.5 w-3.5" />
          Account
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-accent-deep px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-night"
        >
          <Icon name="download" className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      <article className="rounded-[14px] border border-line bg-card p-8 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <Logo className="h-[24px]" />
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              {SELLER.name}, a {SELLER.parent} company
              <br />
              {SELLER.city}, {SELLER.region}, {SELLER.country}
              <br />
              {SELLER.email} · {SELLER.phone}
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-[24px] leading-none">Receipt</h1>
            <p className="mt-2 font-mono text-[11.5px] text-muted">{invoiceNumber(payment)}</p>
            <p className="mt-0.5 text-[12px] text-muted">{issued}</p>
            <p
              className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                payment.status === "paid"
                  ? "bg-accent-soft text-accent"
                  : "bg-surface text-muted"
              }`}
            >
              {payment.status === "paid" ? "Paid" : payment.status}
            </p>
          </div>
        </header>

        <section className="grid gap-6 border-b border-line py-6 sm:grid-cols-2">
          <div>
            <h2 className="text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
              Billed to
            </h2>
            <p className="mt-2 text-[13.5px]">
              {user?.name || user?.preferred_username || "—"}
              <br />
              <span className="text-muted">{user?.email}</span>
            </p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
              Payment reference
            </h2>
            <p className="mt-2 font-mono text-[11.5px] break-all text-muted">
              {payment.orderId}
              {payment.paymentId ? (
                <>
                  <br />
                  {payment.paymentId}
                </>
              ) : null}
            </p>
          </div>
        </section>

        <table className="w-full border-collapse py-6 text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
                Description
              </th>
              <th className="py-3 text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
                Term
              </th>
              <th className="py-3 text-right text-[10px] font-semibold tracking-[0.13em] text-faint uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-4 text-[13.5px]">{plan.name}</td>
              <td className="py-4 text-[13.5px] text-muted">{plan.term}</td>
              <td className="py-4 text-right font-mono text-[13.5px]">{amount}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-4 text-[13.5px] font-semibold">
                Total paid
              </td>
              <td className="py-4 text-right font-mono text-[15px] font-semibold">{amount}</td>
            </tr>
          </tfoot>
        </table>

        <footer className="border-t border-line pt-5 text-[11.5px] leading-relaxed text-faint">
          <p>
            Payment collected by Razorpay on behalf of {SELLER.name}. This is a receipt for a
            payment already made — no action is needed.
          </p>
        </footer>
      </article>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[720px] px-5 py-12 print:px-0 print:py-0">{children}</div>;
}
