import { API_URL } from "@/lib/drops";
import { request } from "./http";
import type { AuthResponse } from "./types";

/**
 * Google sign-in through the Cognito hosted UI, with PKCE and CSRF state.
 *
 * The web flow is the simple one: a full-page navigation to the backend,
 * which redirects to Cognito, which comes back to /auth/callback here. The
 * desktop app's loopback and deep-link transports do not exist in a browser.
 *
 * The redirect URI must be registered on the Cognito app client — it matches
 * exactly, with no wildcards.
 */

const STATE_KEY = "oauth_state";
const PKCE_KEY = "pkce_verifier";

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function randomString(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64url(bytes.buffer);
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(digest);
}

/** Where Cognito sends the browser back. Same origin as the page, so it works
 *  unchanged on localhost and in production — but each origin must be on the
 *  Cognito callback list. */
export function redirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

/**
 * Starts Google sign-in. Navigates away, so nothing after it runs.
 *
 * `next` is where to land afterwards — the pricing page passes its own path so
 * someone who clicked "Get Business" while signed out returns to it.
 */
export async function startGoogle(next = "/account"): Promise<void> {
  const verifier = randomString();
  const state = randomString();
  sessionStorage.setItem(PKCE_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
  sessionStorage.setItem("oauth_next", next);

  const params = new URLSearchParams({
    redirect_uri: redirectUri(),
    state,
    code_challenge: await challengeFor(verifier),
    code_challenge_method: "S256",
  });
  window.location.href = `${API_URL}/auth/oauth/google?${params}`;
}

/** Finishes the round trip. Throws when the state does not match what this
 *  browser stored, which is the CSRF check — a code that arrived without one
 *  of our own attempts behind it is not ours to exchange. */
export async function completeGoogle(code: string, state: string) {
  const expected = sessionStorage.getItem(STATE_KEY);
  const verifier = sessionStorage.getItem(PKCE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(PKCE_KEY);

  if (!expected || state !== expected) {
    throw new Error("This sign-in link did not come from here. Please try again.");
  }

  return request<AuthResponse>("/auth/oauth/callback", {
    method: "POST",
    body: {
      code,
      redirect_uri: redirectUri(),
      ...(verifier ? { code_verifier: verifier } : {}),
    },
  });
}

/** Where to go once signed in, set when the attempt started. */
export function consumeNext(): string {
  const next = sessionStorage.getItem("oauth_next");
  sessionStorage.removeItem("oauth_next");
  return next || "/account";
}
