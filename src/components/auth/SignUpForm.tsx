"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as api from "@/auth/api";
import { storeTokens } from "@/auth/tokenStore";
import { hasTokens } from "@/auth/types";
import { useAuth } from "@/auth/AuthProvider";
import { errorText } from "@/auth/http";
import { startGoogle } from "@/auth/oauth";
import { normalizeUsername, suggestUsername, USERNAME_RE } from "@/auth/username";
import { AuthShell, CodeInput, Field, FormError, Separator, inputClass, outlineButton, primaryButton } from "./fields";
import { GoogleButton } from "./GoogleButton";

/** Sign up, then confirm the emailed code. Two steps, one component: the
 *  username has to survive between them, and a page change would lose it. */
export function SignUpForm({
  next = "/account",
  confirmFor,
}: {
  next?: string;
  /** Set when arriving from a sign-in that found an unconfirmed account. */
  confirmFor?: string;
}) {
  const router = useRouter();
  const { completeLogin } = useAuth();

  const [step, setStep] = useState<"details" | "confirm">(confirmFor ? "confirm" : "details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(confirmFor ?? "");
  const [touchedUsername, setTouchedUsername] = useState(!!confirmFor);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  // Suggest a username from the email until the reader edits it themselves.
  useEffect(() => {
    if (!touchedUsername) setUsername(suggestUsername(email));
  }, [email, touchedUsername]);

  const usernameValid = USERNAME_RE.test(username);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.signUp({
        name: name.trim(),
        email: email.trim(),
        preferred_username: username,
        password,
      });
      setStep("confirm");
    } catch (err) {
      setError(errorText(err, "Could not create your account"));
    } finally {
      setBusy(false);
    }
  };

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.confirmSignUp(username, code);
      // Some accounts come back signed in; others must sign in once.
      if (hasTokens(res)) {
        storeTokens(res);
        await completeLogin(res.access_token ?? res.id_token);
        router.push(next);
        return;
      }
      router.push(`/signin?next=${encodeURIComponent(next)}`);
    } catch (err) {
      setError(errorText(err, "That code was not accepted"));
    } finally {
      setBusy(false);
    }
  };

  if (step === "confirm") {
    return (
      <AuthShell
        title="Check your email"
        sub={`We sent a six-digit code${email ? ` to ${email}` : ""}. Enter it to finish.`}
      >
        <form onSubmit={onConfirm} className="flex flex-col gap-4">
          <FormError message={error} />
          <CodeInput value={code} onChange={setCode} autoFocus />
          <button
            type="submit"
            disabled={busy || code.length < 6}
            className={primaryButton}
          >
            {busy ? "Confirming…" : "Confirm"}
          </button>
          <button
            type="button"
            disabled={resent}
            onClick={async () => {
              setResent(true);
              try {
                await api.resendCode(username);
              } catch (err) {
                setError(errorText(err, "Could not resend the code"));
                setResent(false);
              }
            }}
            className="text-[13px] text-muted transition-colors hover:text-ink disabled:opacity-60"
          >
            {resent ? "Code sent" : "Send another code"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      sub="Free to start. No card needed."
      footer={
        <>
          Already have one?{" "}
          <Link href="/signin" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" onClick={() => startGoogle(next)} />

      <Separator />

      <form onSubmit={onSignUp} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Name">
          <input
            autoFocus
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <Field
          label="Username"
          hint={
            username && !usernameValid ? (
              <span className="text-[12px] text-accent">3–30 chars, a–z 0–9 . _ -</span>
            ) : undefined
          }
        >
          <input
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setTouchedUsername(true);
              setUsername(normalizeUsername(e.target.value));
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <span className="mt-1.5 block text-[12px] text-faint">
            At least 8 characters, with a number and a capital.
          </span>
        </Field>

        <button
          type="submit"
          disabled={busy || !name.trim() || !email.trim() || !usernameValid || password.length < 8}
          className={primaryButton}
        >
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
