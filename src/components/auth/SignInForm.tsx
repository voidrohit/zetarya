"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as api from "@/auth/api";
import { storeTokens } from "@/auth/tokenStore";
import { hasTokens, type MfaChallenge } from "@/auth/types";
import { useAuth } from "@/auth/AuthProvider";
import { errorText } from "@/auth/http";
import { startGoogle } from "@/auth/oauth";
import { AuthShell, CodeInput, Field, FormError, Separator, inputClass, outlineButton, primaryButton } from "./fields";
import { GoogleButton } from "./GoogleButton";

/**
 * Sign in, and the MFA step when the account asks for one.
 *
 * Both live here because they are one conversation: /auth/signin either
 * returns tokens or a challenge, and splitting them across routes would mean
 * carrying the one-shot session through a navigation.
 */
export function SignInForm({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const { completeLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mfa, setMfa] = useState<MfaChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async (tokens: { access_token?: string; id_token: string; refresh_token: string }) => {
    storeTokens(tokens);
    await completeLogin(tokens.access_token ?? tokens.id_token);
    router.push(next);
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.signIn(identifier.trim(), password);

      if (res.challenge_name === "SOFTWARE_TOKEN_MFA" || res.challenge_name === "EMAIL_OTP") {
        setMfa({
          session: res.session ?? "",
          username: res.username ?? res.preferred_username ?? identifier.trim(),
          challengeName: res.challenge_name,
        });
        return;
      }
      // An unconfirmed account is not a failure, it is an unfinished signup.
      if (res.challenge_name === "CONFIRM_SIGNUP") {
        router.push(`/signup?confirm=${encodeURIComponent(res.username ?? identifier.trim())}`);
        return;
      }
      if (res.challenge_name === "ACCOUNT_DEACTIVATED") {
        setError("This account is deactivated. Open the desktop app to restore it.");
        return;
      }
      if (!hasTokens(res)) {
        setError("Sign-in did not complete. Please try again.");
        return;
      }
      await finish(res);
    } catch (err) {
      setError(errorText(err, "Could not sign you in"));
    } finally {
      setBusy(false);
    }
  };

  const onMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfa) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.respondMfa({
        preferred_username: mfa.username,
        session: mfa.session,
        code,
        challenge_name: mfa.challengeName,
      });
      if (!hasTokens(res)) {
        setError("That code was not accepted.");
        return;
      }
      await finish(res);
    } catch (err) {
      setError(errorText(err, "That code was not accepted"));
    } finally {
      setBusy(false);
    }
  };

  if (mfa) {
    return (
      <AuthShell
        title="Enter your code"
        sub={
          mfa.challengeName === "EMAIL_OTP"
            ? "We sent a six-digit code to your email."
            : "Open your authenticator app and enter the six-digit code."
        }
      >
        <form onSubmit={onMfa} className="flex flex-col gap-4">
          <FormError message={error} />
          <CodeInput value={code} onChange={setCode} autoFocus />
          <button
            type="submit"
            disabled={busy || code.length < 6}
            className={primaryButton}
          >
            {busy ? "Checking…" : "Continue"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMfa(null);
              setCode("");
              setError(null);
            }}
            className="text-[13px] text-muted transition-colors hover:text-ink"
          >
            Back to sign in
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sign in"
      sub="Your plan, usage and devices in one place."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" onClick={() => startGoogle(next)} />

      <Separator />

      <form onSubmit={onSignIn} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Email or username">
          <input
            autoFocus
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <Field
          label="Password"
          hint={
            <Link href="/forgot-password" className="text-[12.5px] text-accent hover:underline">
              Forgot?
            </Link>
          }
        >
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          disabled={busy || !identifier.trim() || !password}
          className={primaryButton}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
