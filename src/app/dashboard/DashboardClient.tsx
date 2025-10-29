"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "@/utils/actions";

type InitialUser = {
    id: string;
    name?: string;
    email: string;
    userName: string;
    provider: string;
    avatar_url?: string;
};

type ZetaUser = {
    email: string;
    data_send_mb: number | string;
    data_received_mb: number | string;
    allowed_speed_mbps: number | string;
    license_type: string;
    license_expiry_date?: number | string;
    allowed_data_mb?: number | string;
    current_month_send: number | string;
};

type PaymentRow = {
    payment_id: string;
    order_id: string;
    price: number;
    currency?: string;
    plan?: string;
    status?: string;
    date?: string | number;
};

const BRAND = { primary: "#BB254A", primaryHover: "#a32043" };

/* ---------- helpers ---------- */
function num(v: unknown, fallback = 0) {
    const n = typeof v === "string" ? Number(v) : (v as number);
    return Number.isFinite(n) ? n : fallback;
}
function formatMB(mb?: number | string): string {
    const v = Number(mb) || 0;

    if (v >= 1000 * 1000) {
        return `${(v / (1000 * 1000)).toFixed(2)} TB`;
    } else if (v >= 1000) {
        return `${(v / 1000).toFixed(2)} GB`;
    } else {
        return `${v.toLocaleString()} MB`;
    }
}

function epochToISTDateString(epoch?: number | string | number) {
    if (epoch === undefined || epoch === null || epoch === "") return "—";
    const ms = num(epoch) * (String(epoch).length > 10 ? 1 : 1000); // accept seconds or ms
    if (!Number.isFinite(ms)) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(ms));
}
function daysLeftFromEpoch(epoch?: number | string) {
    const ms = num(epoch) * (String(epoch).length > 10 ? 1 : 1000);
    if (!Number.isFinite(ms)) return null;
    const diff = ms - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
function usageBarColor(pct: number) {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 70) return "bg-amber-500";
    if (pct >= 40) return "bg-lime-500";
    return "bg-emerald-500";
}
function Badge({
                   children,
                   tone = "neutral" as "neutral" | "brand" | "warn",
               }: {
    children: React.ReactNode;
    tone?: "neutral" | "brand" | "warn";
}) {
    const tones = {
        neutral: "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200",
        brand:
            "bg-[rgba(187,37,74,0.10)] text-[rgb(187,37,74)] ring-1 ring-inset ring-[rgba(187,37,74,0.25)]",
        warn: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
    } as const;
    return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
            <path d="M12 3l7 4v5c0 4.97-3.05 9.25-7 10-3.95-.75-7-5.03-7-10V7l7-4z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export default function DashboardClient({ initialUser }: { initialUser: InitialUser }) {
    const { id, name, email, avatar_url } = initialUser;

    const [loading, setLoading] = useState(true);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zeta, setZeta] = useState<ZetaUser | null>(null);

    // payments state
    const [payments, setPayments] = useState<PaymentRow[] | null>(null);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                // NOTE: os_type is required by your create API. We keep it fixed and invisible to UI.
                const res = await fetch("/api/zeta/bootstrap", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, id, os_type: "web" }),
                });
                const payload = await res.json();

                console.log(payload);
                if (!payload.success) throw new Error(payload.message || "Failed to load user info");
                if (mounted) {
                    setZeta(payload.data ?? null);
                    setCreated(Boolean(payload.created));
                }

                // now fetch payments (minimal and focused)
                try {
                    setPaymentsLoading(true);
                    setPaymentsError(null);
                    const pRes = await fetch("/api/getpayments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });
                    if (!pRes.ok) {
                        const t = await pRes.text();
                        throw new Error(t || `Status ${pRes.status}`);
                    }
                    const pJson = await pRes.json();

                    console.log(pJson);

                    if (mounted) setPayments(pJson.body.data);
                } catch (pe: any) {
                    if (mounted) setPaymentsError(pe?.message || "Failed to load payments");
                } finally {
                    if (mounted) setPaymentsLoading(false);
                }
            } catch (e: any) {
                if (mounted) setError(e.message || "Something went wrong");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [email, id]);

    // Derived UI values
    const data_send_mb = num(zeta?.current_month_send);
    const allowed_data_mb = num(zeta?.allowed_data_mb);
    const total_used_mb = data_send_mb;

    const usage_pct = useMemo(() => {
        if (!allowed_data_mb) return 0;
        return Math.max(0, Math.min(100, Math.round((total_used_mb / allowed_data_mb) * 100)));
    }, [total_used_mb, allowed_data_mb]);

    const dleft = daysLeftFromEpoch(zeta?.license_expiry_date);
    const showWarn = usage_pct >= 90;

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 md:py-10 lg:py-12">
                {/* Header */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 md:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Identity */}
                        <div className="flex items-start gap-4 sm:items-center">
                            {avatar_url ? (
                                <Image
                                    src={avatar_url}
                                    alt={name ?? "User avatar"}
                                    width={80}
                                    height={80}
                                    className="rounded-full ring-2 ring-white shadow-sm"
                                    priority
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 text-xl font-semibold text-neutral-700 ring-2 ring-white shadow-sm">
                                    {(email?.[0] ?? "U").toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-semibold sm:text-2xl">{name ?? email ?? "User"}</h1>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {dleft !== null && <Badge tone={dleft <= 3 ? "warn" : "neutral"}>{dleft} day{dleft === 1 ? "" : "s"} left</Badge>}
                                    {/*<span className="text-sm text-neutral-500"><span className="font-medium">{zeta?.license_type ?? "free"}</span></span>*/}
                                    <Badge tone="neutral">{zeta?.license_type ?? "free"}</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Sign out (desktop) */}
                        <div className="hidden sm:block">
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition"
                                    style={{ backgroundColor: BRAND.primary }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
                                >
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sign out (mobile full-width) */}
                    <div className="mt-4 sm:hidden">
                        <form action={signOut} className="w-full">
                            <button
                                type="submit"
                                className="w-full rounded-lg px-4 py-3 text-center text-sm font-semibold text-white transition"
                                style={{ backgroundColor: BRAND.primary }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryHover)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="mt-6 grid gap-6 sm:mt-8 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-28 animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-sm" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div role="alert" aria-live="polite" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Top stats */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3">
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <div className="mb-2 text-sm text-neutral-500">Allowed Speed</div>
                                <div className="text-2xl font-semibold">{zeta?.allowed_speed_mbps ?? "—"} Mbps</div>
                                <div className="text-xs text-neutral-500">Per your current plan</div>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <div className="mb-2 text-sm text-neutral-500">Quota</div>
                                <div className="text-2xl font-semibold">
                                    {formatMB(total_used_mb)} <span className="text-sm text-neutral-500">/ {formatMB(allowed_data_mb)}</span>
                                </div>
                                <div className="text-xs text-neutral-500">{usage_pct}% used</div>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <div className="mb-2 text-sm text-neutral-500">License</div>
                                <div className="text-2xl font-semibold">{zeta?.license_type.toUpperCase() ?? "free"}</div>
                                <div className="text-xs text-neutral-500">Expires: {epochToISTDateString(zeta?.license_expiry_date)}</div>
                            </div>
                        </div>

                        {/* Payments panel */}
                        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Payments</h2>
                                    <p className="text-sm text-neutral-500">Recent payments and receipts for your account</p>
                                </div>
                                {/*<div className="flex items-center gap-3">*/}
                                {/*    <Link*/}
                                {/*        href="/pricing"*/}
                                {/*        className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"*/}
                                {/*    >*/}
                                {/*        Upgrade Plan*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                            </div>

                            {/* payments loading / empty */}
                            {paymentsLoading && (
                                <div className="mt-4">
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 w-1/3 rounded bg-neutral-200" />
                                        <div className="h-3 w-full rounded bg-neutral-200" />
                                        <div className="h-3 w-full rounded bg-neutral-200" />
                                    </div>
                                </div>
                            )}

                            {paymentsError && <p className="mt-4 text-sm text-red-600">{paymentsError}</p>}

                            {!paymentsLoading && !paymentsError && (!payments || payments.length === 0) && (
                                <div className="mt-4 text-sm text-neutral-600">No payments found for this account yet.</div>
                            )}

                            {!paymentsLoading && payments && payments.length > 0 && (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                        <tr className="text-left text-xs text-neutral-500">
                                            <th className="pb-3 pr-4">Date</th>
                                            <th className="pb-3 pr-4">Plan</th>
                                            <th className="pb-3 pr-4">Amount</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">Payment ID</th>
                                            <th className="pb-3 pr-4">Order ID</th>
                                            <th className="pb-3 pr-4"> </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                        {payments.map((p) => (
                                            <tr key={p.payment_id} className="text-sm">
                                                <td className="py-3 pr-4">{epochToISTDateString(p.date ?? undefined)}</td>
                                                <td className="py-3 pr-4">{p.plan ?? "Plus"}</td>
                                                <td className="py-3 pr-4">
                                                    ₹ {(p.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${
                                                        p.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : p.status === "FAILED" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-700"
                                                    }`}>
                                                      {p.status ?? "unknown"}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 break-all text-xs text-neutral-700">{p.payment_id}</td>
                                                <td className="py-3 pr-4 break-all text-xs text-neutral-700">{p.order_id}</td>
                                                {/*<td className="py-3 pr-4">*/}
                                                {/*    <a*/}
                                                {/*        className="inline-flex items-center justify-center rounded px-3 py-1 text-xs font-medium border border-neutral-200 hover:bg-neutral-50"*/}
                                                {/*        href={`/receipts/${p.payment_id}`}*/}
                                                {/*    >*/}
                                                {/*        View receipt*/}
                                                {/*    </a>*/}
                                                {/*</td>*/}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Actions panel */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-lg font-semibold">Quick actions</h3>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {
                                        zeta?.license_type === "free" ? <Link
                                            href="/pricing"
                                            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                                        >
                                            Upgrade
                                        </Link> : null
                                    }
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition"
                                        style={{ backgroundColor: BRAND.primary }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryHover)}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
                                    >
                                        Support
                                    </Link>
                                </div>

                                <p className="mt-3 text-xs text-neutral-500">
                                    {created ? "We created your Zetarya account just now." : "Your Zetarya account is up to date."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-lg font-semibold">Usage breakdown</h3>
                                <p className="text-sm text-neutral-500">Data sent / allowed quota</p>
                                <div className="mt-3">
                                    <div className="text-sm font-medium">{formatMB(total_used_mb)} used</div>
                                    <div className="text-xs text-neutral-500">of {formatMB(allowed_data_mb)}</div>
                                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral-200">
                                        <div className={`${usageBarColor(usage_pct)} h-3 rounded-full`} style={{ width: `${usage_pct}%` }} />
                                    </div>
                                </div>
                                {showWarn && <p className="mt-3 text-sm text-red-600">You’ve used over 90% of your quota. Consider upgrading.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
