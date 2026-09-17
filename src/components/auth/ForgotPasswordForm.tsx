"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as api from "@/auth/api";
import { errorText } from "@/auth/http";
import { AuthShell, CodeInput, Field, FormError, Separator, inputClass, outlineButton, primaryButton } from "./fields";

/** Request a reset code, then set the new password with it. */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>, then: () => void, fallback: string) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      then();
    } catch (err) {
      setError(errorText(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  if (step === "reset") {
    return (
      <AuthShell title="Set a new password" sub="Enter the code we emailed you.">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(
              () =>
                api.confirmForgotPassword({
                  preferred_username: identifier.trim(),
                  code,
                  new_password: password,
                }),
              () => router.push("/signin"),
              "Could not reset your password",
            );
          }}
        >
          <FormError message={error} />
          <CodeInput value={code} onChange={setCode} autoFocus />
          <Field label="New password">
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            disabled={busy || code.length < 6 || password.length < 8}
            className={primaryButton}
          >
            {busy ? "Saving…" : "Set password"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      sub="We'll email you a code."
      footer={
        <Link href="/signin" className="font-semibold text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          run(
            () => api.forgotPassword(identifier.trim()),
            () => setStep("reset"),
            "Could not send a code",
          );
        }}
      >
        <FormError message={error} />
        <Field label="Email or username">
          <input
            autoFocus
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={inputClass}
          />
        </Field>
        <button
          type="submit"
          disabled={busy || !identifier.trim()}
          className={primaryButton}
        >
          {busy ? "Sending…" : "Send code"}
        </button>
      </form>
    </AuthShell>
  );
}
