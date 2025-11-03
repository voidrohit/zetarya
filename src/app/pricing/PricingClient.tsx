// app/pricing/PricingClient.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PricingClient({ serverUser }: { serverUser?: any | null }) {
    const [opening, setOpening] = useState(false);
    const session = useSession(); // Session | null
    const supabase = useSupabaseClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    // avoid double auto-trigger
    const autoTriggeredRef = useRef(false);

    const handlePay = useCallback(async () => {
        if (!serverUser) {

            router.push(`/signin`);
            return;
        }

        setOpening(true);
        try {
            const orderRes = await fetch("/api/phonepe/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: serverUser?.email
                }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                console.log(errorData);
                throw new Error(errorData.error || `Order creation failed: ${orderRes.status}`);
            }

            const orderData = await orderRes.json();

            console.log(orderData.fullResponse);
            console.log(serverUser);
            const url = orderData.fullResponse.redirectUrl

            window.location.href = url;

        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Unable to start checkout. Please try again.");
        } finally {
            setOpening(false);
        }
    }, [serverUser, router]);

    // Auto-trigger payment when user returns with ?pay=plus and session exists
    useEffect(() => {
        const payParam = searchParams?.get("pay");
        if (payParam === "plus" && session && !autoTriggeredRef.current && !opening) {
            autoTriggeredRef.current = true;
            handlePay().catch((e) => console.error("auto-pay failed", e));
        }
    }, [searchParams, session, handlePay, opening]);

    return (
        <div className="bg-white flex justify-center align-center flex-col scroll-smooth">
            <div className="mx-auto z-10">
                <Navbar />
            </div>

            <div className="relative w-full py-16 lg:py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
                            Simple, transparent pricing
                        </h1>
                        <p className="mt-3 text-gray-600 md:text-lg">Scale your data transfer with secure, high-throughput plans.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Free */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Free</h3>
                                <p className="mt-1 text-sm text-gray-500">For testing & personal use</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">₹0</span>
                                <span className="text-gray-500">/mo</span>
                            </div>
                            <span onClick={() => router.push("/")}
                                  className="mb-8 cursor-pointer inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50">
                                Get free
                            </span>
                            <ul className="space-y-3 text-sm">
                                {[
                                    "Up to 40 Mbps transfer speed",
                                    "30 GB/month data transfer",
                                    "TLS encryption",
                                    "Peer to Peer data transfer",
                                ].map((f, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Plus */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                            <div className="absolute right-4 -top-3"></div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Plus</h3>
                                <p className="mt-1 text-sm text-gray-500">Best for growing teams</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">₹1,499</span>
                                <span className="text-gray-500">/mo</span>
                            </div>

                            {/*<div className="mb-6 flex items-baseline space-x-3">*/}
                            {/*    /!* Original price (struck through) *!/*/}
                            {/*    <span className="text-3xl font-semibold text-gray-400 line-through">₹1,499</span>*/}

                            {/*    /!* Discounted price *!/*/}
                            {/*    <div className="flex items-baseline space-x-1">*/}
                            {/*        <span className="text-4xl font-bold text-black">₹999</span>*/}
                            {/*        <span className="text-gray-500 text-lg">/mo</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <button
                                onClick={() => handlePay()}
                                disabled={opening}
                                className="mb-8 inline-flex w-full items-center justify-center rounded-xl bg-[#BB254A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#801336] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {opening ? "Opening..." : serverUser ? "Get Plus" : "Sign in to purchase"}
                            </button>

                            <ul className="space-y-3 text-sm">
                                {[
                                    "Up to 200 Mbps transfer speed",
                                    "2 TB/month included",
                                    "AES-256 + TLS encryption",
                                    "Priority email & chat support",
                                    "Peer to Peer data transfer"
                                ].map((f, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pro */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Pro</h3>
                                <p className="mt-1 text-sm text-gray-500">For high-volume transfer</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">Custom</span>
                            </div>

                            <span onClick={() => router.push("/contact")}
                                  className="mb-8 cursor-pointer inline-flex w-full items-center justify-center rounded-xl border border-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white">
                                Talk to Sales
                            </span>

                            <ul className="space-y-3 text-sm">
                                {[
                                    "Up to 1 Gbps transfer speed",
                                    "10 TB/month included",
                                    "AES-256 + TLS encryption",
                                    "Priority support",
                                    "Advanced routing & P2P acceleration",
                                    "On Prem Data transfer under the VPN",
                                    "API access",
                                    "Peer to Peer data transfer",
                                    "Dedicated onboarding",
                                ].map((f, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/*<div className="mt-8 text-center text-xs text-gray-500">Overages billed at competitive per-GB rates. Prices are in INR.</div>*/}
                </div>
            </div>

            <footer className="bg-[#171515] text-[#F5F5F7] py-8">
                <div className="flex flex-row justify-between h-[200px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h2 className="mb-4">CONTACT US</h2>
                        <p className="text-base lg:text-5xl mb-4 font-semibold">info@zetarya.com</p>
                        <p className="text-base lg:text-xl mb-4 font-semibold">+91 9119334720</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                        <div>
                            <a href="https://docs.zetarya.com" className="text-sm hover:underline">Docs</a>
                        </div>
                        <div>
                            <a href="/terms-and-privacy" className="text-sm hover:underline">Term & Privacy</a>
                        </div>
                        {/*<div>*/}
                        {/*    <a href="/blogs" className="text-sm hover:underline">Blogs</a>*/}
                        {/*</div>*/}
                        <div>
                            <a href="/pricing" className="text-sm hover:underline">Pricing</a>
                        </div>
                        <div>
                            <a href="https://www.zero2.in" className="text-sm hover:underline">Company</a>
                        </div>
                        <div>
                            <a href="/contact" className="text-sm hover:underline">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>

            <p className="text-gray-700 bg-[#171515] w-full text-center pb-2">© zero2 All rights reserved</p>
        </div>
    );
}
