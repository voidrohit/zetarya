"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { signinWithOtp, signinWithGoogle, verifyOtp } from "@/utils/actions";
import {redirect} from "next/navigation";

const BRAND = {
    primary: "#BB254A",
    primaryHover: "#a32043",
    soft: "rgba(239, 209, 198, 0.2)",
};

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [resendIn, setResendIn] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);

    function GoogleButton() {
        const { pending } = useFormStatus();
        return (
            <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-c enter rounded-md border border-[#ddd] bg-white px-3 py-3 text-[14px] transition-colors hover:bg-[#f8f9fa] hover:border-[#aaa] disabled:cursor-not-allowed disabled:opacity-70"
            >
                <svg className="mr-3" width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4" />
                    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853" />
                    <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05" />
                    <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335" />
                </svg>
                {pending ? "Redirecting…" : "Sign in with Google"}
            </button>
        );
    }

    // ————————————— Handlers (wire these to your API) —————————————

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setMessage(null);
        try {
            // TODO: call your "send OTP" API here
            // await sendOtp(email);
            await signinWithOtp(email)
            setOtp(Array(OTP_LENGTH).fill(""));
            setOtpSent(true);
            setResendIn(45); // cooldown seconds
            setMessage("We’ve sent a verification code to your email.");
        } catch (err: any) {
            setMessage("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some((d) => !d)) return;
        setLoading(true);
        setMessage(null);
        try {
            const code = otp.join("");
            await verifyOtp(email, code);
            setMessage("OTP verified! Redirecting…");
            redirect("/dashboard")
        } catch (err: any) {
            setMessage(`Invalid code. Please try again ${err}`);
        } finally {
            setLoading(false);
        }
    };


    const handleResendOTP = async () => {
        if (resendIn > 0) return;
        setResendLoading(true);
        setMessage(null);
        try {
            // TODO: call your "resend OTP" API
            // await resendOtp(email);
            await signinWithOtp(email);
            setResendIn(45);
            setMessage("Code resent.");
        } catch (err: any) {
            setMessage("Could not resend the code. Try again.");
        } finally {
            setResendLoading(false);
        }
    };

    // ————————————— OTP input UX —————————————

    const handleOtpChange = (value: string, index: number) => {
        const v = value.replace(/\D/g, ""); // only digits
        setOtp((prev) => {
            const next = [...prev];
            next[index] = v.slice(-1) || "";
            return next;
        });
        if (v && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const key = e.key;
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            inputsRef.current[index - 1]?.focus();
        } else if (key === "ArrowRight" && index < OTP_LENGTH - 1) {
            e.preventDefault();
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!text) return;
        e.preventDefault();
        const chars = text.slice(0, OTP_LENGTH - index).split("");
        setOtp((prev) => {
            const next = [...prev];
            for (let i = 0; i < chars.length; i++) next[index + i] = chars[i];
            return next;
        });
        const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
        requestAnimationFrame(() => inputsRef.current[nextIndex]?.focus());
    };

    // ————————————— Resend cooldown —————————————

    useEffect(() => {
        if (resendIn <= 0) return;
        const t = setInterval(() => setResendIn((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [resendIn]);

    // Focus first OTP box when we switch to OTP mode
    useEffect(() => {
        if (otpSent) inputsRef.current[0]?.focus();
    }, [otpSent]);

    const subtitle = useMemo(
        () =>
            !otpSent
                ? "Sign in via OTP with your email below"
                : "Enter the code sent to your email",
        [otpSent]
    );

    return (
        <div className="min-h-screen w-full bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="w-full max-w-[400px] rounded-xl bg-white p-8 shadow-md">
                {/* Logo */}
                <div className="flex justify-center mb-5">
                    <svg width="41" height="39" viewBox="0 0 41 39" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path
                            d="M36.4765 9.47653C36.8671 9.86706 36.8683 10.502 36.4623 10.8764C31.908 15.0764 25.9302 17.4212 19.7106 17.4212C13.491 17.4212 7.51316 15.0764 2.95891 10.8764C2.55292 10.502 2.55415 9.86706 2.94467 9.47653L7.35481 5.0664C7.74533 4.67588 8.37664 4.67849 8.79012 5.04462C11.7937 7.7042 15.6759 9.18434 19.7106 9.18434C23.7454 9.18434 27.6275 7.7042 30.6311 5.04462C31.0446 4.67849 31.6759 4.67588 32.0664 5.0664L36.4765 9.47653Z"
                            fill={BRAND.primary}
                        />
                        <path
                            d="M36.4765 27.5235C36.8671 27.1329 36.8683 26.498 36.4623 26.1236C31.908 21.9236 25.9302 19.5788 19.7106 19.5788C13.491 19.5788 7.51316 21.9236 2.95891 26.1236C2.55292 26.498 2.55415 27.1329 2.94467 27.5235L7.35481 31.9336C7.74533 32.3241 8.37664 32.3215 8.79012 31.9554C11.7937 29.2958 15.6759 27.8157 19.7106 27.8157C23.7454 27.8157 27.6275 29.2958 30.6311 31.9554C31.0446 32.3215 31.6759 32.3241 32.0664 31.9336L36.4765 27.5235Z"
                            fill={BRAND.primary}
                        />
                    </svg>
                </div>

                {/* Headings */}
                <h1 className="text-[24px] font-semibold text-[#333] text-center mb-2">Welcome</h1>
                <p className="text-[14px] text-[#666] text-center mb-6">{subtitle}</p>

                {/* Message */}
                {message && (
                    <div
                        className="mb-5 rounded-md px-3 py-3 text-center text-[14px]"
                        style={{ backgroundColor: BRAND.soft, color: BRAND.primary }}
                        // If you really need HTML from server, keep it; else prefer plain text
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
                )}

                {/* Forms */}
                {!otpSent ? (
                    <>
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-[14px] text-[#333]">Email address</label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 w-full rounded-md border border-[#ddd] px-3 text-[14px] outline-none focus:border-[var(--brand)]"
                                    style={
                                        {
                                            // Tailwind CSS var fallback
                                            ["--brand" as any]: BRAND.primary,
                                        } as React.CSSProperties
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-10 w-full rounded-md text-white text-[14px] transition-colors disabled:cursor-not-allowed disabled:bg-[#ccc]"
                                style={{ backgroundColor: BRAND.primary }}
                                onMouseDown={(e) => e.currentTarget.classList.add("active")}
                                onMouseUp={(e) => e.currentTarget.classList.remove("active")}
                            >
                                {loading ? "Loading..." : "Send OTP"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-7 flex items-center justify-center text-center">
                            <span className="h-px flex-1 bg-[#e0e0e0]" />
                            <span className="mx-3 bg-white px-3 text-[14px] text-[#666]">or continue with</span>
                            <span className="h-px flex-1 bg-[#e0e0e0]" />
                        </div>

                        {/* Google */}
                        <form action={signinWithGoogle}>
                            <GoogleButton />
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        {/* OTP inputs */}
                        <div className="mb-5">
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputsRef.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={(e) => handlePaste(e, index)}
                                        onFocus={(e) => (e.target as HTMLInputElement).select()}
                                        autoComplete={index === 0 ? "one-time-code" : "off"}
                                        className="h-10 w-10 rounded-md border border-[#ddd] text-center text-[18px] outline-none focus:border-[var(--brand)]"
                                        style={{ ["--brand" as any]: BRAND.primary } as React.CSSProperties}
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-2 text-left">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendIn > 0 || resendLoading || loading}
                                className="text-[13px] font-medium transition-colors disabled:cursor-not-allowed"
                                style={{
                                    color:
                                        resendIn > 0 || resendLoading || loading
                                            ? "#aaa"
                                            : BRAND.primary,
                                }}
                            >
                                {resendLoading ? "Resending..." : resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.some((d) => !d)}
                            className="h-10 w-full rounded-md text-white text-[14px] transition-colors disabled:cursor-not-allowed disabled:bg-[#ccc]"
                            style={{ backgroundColor: BRAND.primary }}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
