// app/pricing/PricingClient.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteShell from "@/components/site/site-shell";
import { PricingCard } from "@/components/site/pricing-card";
import { FaqList } from "@/components/site/faq-list";
import { Reveal } from "@/components/site/reveal";
import { Icon } from "@/components/site/icons";
import { CtaBanner, FeatureBlock, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { BILLING_FAQS, PLAN_FEATURES, PLAN_MATRIX, TIERS } from "@/lib/site-content";
import { DOWNLOADS, DOWNLOADS_LIVE, detectPlatform } from "@/components/site/platform";

export default function PricingClient() {
    const [opening, setOpening] = useState(false);
    const [annual, setAnnual] = useState(true);
    const [email, setEmail] = useState("");
    const dialogRef = useRef<HTMLDialogElement>(null);

    // avoid double auto-trigger
    const autoTriggeredRef = useRef(false);

    const startCheckout = useCallback(async (buyerEmail: string) => {
        setOpening(true);
        try {
            const orderRes = await fetch("/api/phonepe/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: buyerEmail }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || `Order creation failed: ${orderRes.status}`);
            }

            const orderData = await orderRes.json();
            window.location.href = orderData.fullResponse.redirectUrl;
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Unable to start checkout. Please try again.");
        } finally {
            setOpening(false);
        }
    }, []);

    // Checkout needs an email to attach the order to. Ask for it, nothing more.
    const handlePay = useCallback(() => dialogRef.current?.showModal(), []);

    // Auto-open checkout when someone lands on ?pay=business (?pay=plus is
    // kept working for links that predate the tier rename).
    // Read from window rather than useSearchParams: the hook opts the whole
    // page out of prerendering, which would ship /pricing with no crawlable HTML.
    useEffect(() => {
        if (autoTriggeredRef.current) return;
        const pay = new URLSearchParams(window.location.search).get("pay");
        if (pay === "business" || pay === "plus") {
            autoTriggeredRef.current = true;
            handlePay();
        }
    }, [handlePay]);

    return (
        <SiteShell>
            <dialog
                ref={dialogRef}
                className="rounded border border-line bg-card p-0 text-ink backdrop:bg-black/40"
            >
                <form
                    method="dialog"
                    className="w-[min(92vw,380px)] p-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        dialogRef.current?.close();
                        startCheckout(email);
                    }}
                >
                    <h2 className="text-[17px] font-semibold">Where should the receipt go?</h2>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                        We use this to attach the order to your plan. No account needed.
                    </p>
                    <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="mt-4 w-full rounded border border-line bg-surface px-3 py-2.5 text-[14px] outline-none focus:border-accent"
                    />
                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() => dialogRef.current?.close()}
                            className="btn-ghost btn-md flex-1"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={opening} className="btn-primary btn-md flex-1 disabled:opacity-60">
                            Continue
                        </button>
                    </div>
                </form>
            </dialog>
            <PageHero
                eyebrow="PRICING"
                title="Simple, honest pricing."
                sub="Scale your data transfer with secure, high-throughput plans. No egress fees, nothing expires."
            >
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-1 rounded border border-line bg-surface p-1">
                        {[
                            { label: "Monthly", value: false },
                            { label: "Annual", value: true },
                        ].map((o) => (
                            <button
                                key={o.label}
                                onClick={() => setAnnual(o.value)}
                                className={`flex items-center gap-2 rounded-md px-4 py-2 text-[13.5px] transition-all duration-200 ${
                                    annual === o.value
                                        ? "border border-line bg-card font-semibold text-ink shadow-sm"
                                        : "border border-transparent font-medium text-muted hover:text-ink"
                                }`}
                            >
                                {o.label}
                                {o.value && (
                                    <span className="text-[12px] font-semibold text-accent">Save 17%</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </PageHero>

            <div className="measure mx-auto grid max-w-[780px] items-start gap-6 pb-16 md:grid-cols-2 sm:pb-20">
                {TIERS.map((t, i) => {
                    const isFree = t.name === "Free";
                    const isPaid = !isFree;
                    const priced = annual && t.annual ? { ...t, ...t.annual } : t;
                    return (
                        <Reveal key={t.name} delay={i * 90}>
                            <PricingCard
                                tier={priced}
                                busy={isPaid && opening}
                                soon={isFree && !DOWNLOADS_LIVE}
                                onCta={
                                    isPaid
                                        ? handlePay
                                        : DOWNLOADS_LIVE
                                          ? () => {
                                                window.location.href = DOWNLOADS[detectPlatform()].href;
                                            }
                                          : undefined
                                }
                            />
                        </Reveal>
                    );
                })}
            </div>

            {/* what every transfer does, on either plan */}
            <Section rule>
                <SectionHeading
                    center
                    title="In every transfer"
                    sub="The parts that do not change with your plan. Only speed and volume do."
                />
                <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {PLAN_FEATURES.map((f, i) => (
                        <FeatureBlock key={f.title} {...f} delay={i * 80} />
                    ))}
                </div>
            </Section>

            {/* plan matrix */}
            <Section rule>
                <SectionHeading center title="Compare every plan" />

                <Reveal delay={100}>
                    <div className="mt-12 hidden overflow-hidden rounded border border-line lg:block">
                        <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-surface">
                            <div className="px-5 py-4 text-[13px] font-semibold text-muted">Capability</div>
                            {PLAN_MATRIX.columns.map((c, i) => (
                                <div
                                    key={c}
                                    className={`px-5 py-4 text-[13px] font-semibold ${
                                        i === 1 ? "text-accent" : "text-muted"
                                    }`}
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                        {PLAN_MATRIX.rows.map((row) => (
                            <div
                                key={row[0]}
                                className="grid grid-cols-[1.6fr_1fr_1fr] border-t border-line transition-colors hover:bg-surface/60"
                            >
                                <div className="px-5 py-3.5 text-[13.5px] font-medium">{row[0]}</div>
                                {row.slice(1).map((v, i) => (
                                    <div key={i} className="px-5 py-3.5 text-[13.5px] text-muted">
                                        {v === "yes" ? (
                                            <Icon
                                                name="check"
                                                className={`h-4 w-4 ${i === 1 ? "text-accent" : "text-ok"}`}
                                            />
                                        ) : v === "no" ? (
                                            <Icon name="minus" className="h-4 w-4 text-faint" />
                                        ) : (
                                            v
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Reveal>

                <div className="mt-10 grid gap-4 lg:hidden">
                    {PLAN_MATRIX.rows.map((row, i) => (
                        <Reveal key={row[0]} delay={i * 30}>
                            <div className="rounded border border-line bg-card p-4">
                                <p className="text-[13.5px] font-semibold">{row[0]}</p>
                                <div className="mt-3 space-y-2">
                                    {PLAN_MATRIX.columns.map((c, ci) => {
                                        const v = row[ci + 1];
                                        return (
                                            <div key={c} className="flex items-center justify-between gap-3">
                                                <span className="text-[12.5px] text-muted">{c}</span>
                                                <span className="text-[12.5px] font-medium">
                                                    {v === "yes" ? (
                                                        <Icon name="check" className="h-4 w-4 text-accent" />
                                                    ) : v === "no" ? (
                                                        <Icon name="minus" className="h-4 w-4 text-faint" />
                                                    ) : (
                                                        v
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Section>

            {/* faq */}
            <Section rule>
                <SectionHeading
                    center
                    title="Questions about billing"
                    sub="How plans, invoices and limits work. Product questions are answered on the home page."
                />
                <FaqList items={BILLING_FAQS} />
                <Reveal delay={200}>
                    <p className="mt-10 text-center text-sm text-muted">
                        Still deciding?{" "}
                        <Link href="/contact" className="font-semibold text-accent hover:underline">
                            Talk to us
                        </Link>
                        .
                    </p>
                </Reveal>
            </Section>

            <CtaBanner
                title="Start on Free. Move up when you need to."
                sub="No account and no card to start - download, pair two devices, and send."
            />
        </SiteShell>
    );
}
