"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/auth/api";
import { completeGoogle, consumeNext } from "@/auth/oauth";
import { storeTokens } from "@/auth/tokenStore";
import { hasTokens } from "@/auth/types";
import { useAuth } from "@/auth/AuthProvider";
import { errorText } from "@/auth/http";
import { normalizeUsername, USERNAME_RE } from "@/auth/username";
import { AuthShell, Field, FormError, inputClass, primaryButton } from "./fields";

/**
 * Where Cognito sends the browser back after Google.
 *
 * A brand-new federated account exists in Cognito but not here: the exchange
 * returns `needs_username`, and this asks for one before the account is real.
 */
export function CallbackClient() {
  const router = useRouter();
  const { completeLogin } = useAuth();
  const ran = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<{ access: string; refresh: string } | null>(null);
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Effects run twice in development; a code may only be exchanged once.
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state") ?? "";
      const denied = params.get("error");

      if (denied) {
        setError("Sign-in was cancelled.");
        return;
      }
      if (!code) {
        setError("That sign-in link is incomplete.");
        return;
      }

      try {
        const res = await completeGoogle(code, state);
        if (!hasTokens(res)) {
          setError("Sign-in did not complete. Please try again.");
          return;
        }
        storeTokens(res);

        if (res.needs_username) {
          setClaim({
            access: res.access_token ?? res.id_token,
            refresh: res.refresh_token,
          });
          return;
        }
        await completeLogin(res.access_token ?? res.id_token);
        router.replace(consumeNext());
      } catch (err) {
        setError(errorText(err, "Could not finish signing you in"));
      }
    })();
  }, [completeLogin, router]);

  if (claim) {
    return (
      <AuthShell title="Pick a username" sub="This is how other people find you to send files.">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              const res = await api.claimUsername(claim.access, claim.refresh, username);
              // The server reissues tokens carrying the chosen name in place
              // of the placeholder, so store whatever came back.
              if (res.id_token && res.refresh_token) {
                storeTokens({
                  id_token: res.id_token,
                  refresh_token: res.refresh_token,
                  access_token: res.access_token,
                });
              }
              await completeLogin(res.access_token ?? claim.access);
              router.replace(consumeNext());
            } catch (err) {
              setError(errorText(err, "Could not claim that username"));
            } finally {
              setBusy(false);
            }
          }}
        >
          <FormError message={error} />
          <Field label="Username">
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            disabled={busy || !USERNAME_RE.test(username)}
            className={primaryButton}
          >
            {busy ? "Saving…" : "Continue"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={error ? "Sign-in failed" : "Signing you in…"} sub={error ?? undefined}>
      {error ? (
        <button onClick={() => router.replace("/signin")} className={primaryButton}>
          Back to sign in
        </button>
      ) : (
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
        </div>
      )}
    </AuthShell>
  );
}
