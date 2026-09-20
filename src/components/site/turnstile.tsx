"use client";

import React from "react";

/**
 * Cloudflare Turnstile, for the contact form.
 *
 * Turnstile and not reCAPTCHA: the privacy page promises no third-party
 * tracking, and reCAPTCHA buys its accuracy by profiling visitors across
 * every site that embeds it. Turnstile sets no cookies and keeps nothing
 * about the visitor between sites, so it is the one that can be added
 * without making the page say something untrue.
 *
 * It is a security control rather than analytics, which is why it is not
 * behind the consent banner: it runs on a form the visitor chose to submit,
 * and it is what stops that form being used as a mail relay.
 *
 * Without NEXT_PUBLIC_TURNSTILE_SITE_KEY this renders nothing and reports an
 * empty token. That is the local-development case; the backend refuses
 * unverified submissions in production regardless of what the page sends.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileAPI = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export const turnstileConfigured = Boolean(SITE_KEY);

/** Loads the script once per document, however many widgets ask for it. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile: script failed")));
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile: script failed"));
    document.head.appendChild(s);
  });
}

export type TurnstileHandle = { reset: () => void };

/**
 * Renders the widget and reports its token.
 *
 * `onToken` is called with the token when the challenge passes, and with ""
 * whenever it stops being usable — expiry, an error, or a reset after a
 * submission. A token is single-use, so the form must reset the widget after
 * every attempt or the second send is refused as a replay.
 */
export const Turnstile = React.forwardRef<
  TurnstileHandle,
  {
    onToken: (t: string) => void;
    /** Names this surface in the challenge. The backend requires the same
     *  string back from Cloudflare, so a token solved on one of our forms
     *  cannot be spent on another. Must match the handler's constant. */
    action: string;
  }
>(function Turnstile({ onToken, action }, ref) {
    const box = React.useRef<HTMLDivElement>(null);
    const widget = React.useRef<string | null>(null);
    // Kept in a ref so the effect below never re-runs on a new callback
    // identity — re-rendering the widget would throw the token away.
    const cb = React.useRef(onToken);
    cb.current = onToken;

    React.useImperativeHandle(ref, () => ({
      reset() {
        if (widget.current && window.turnstile) {
          window.turnstile.reset(widget.current);
          cb.current("");
        }
      },
    }));

    React.useEffect(() => {
      if (!SITE_KEY || !box.current) return;
      let cancelled = false;

      loadScript()
        .then(() => {
          if (cancelled || !box.current || !window.turnstile) return;
          widget.current = window.turnstile.render(box.current, {
            sitekey: SITE_KEY,
            action,
            callback: (token: string) => cb.current(token),
            "expired-callback": () => cb.current(""),
            "error-callback": () => cb.current(""),
            // Follows the page rather than forcing a light widget onto a
            // dark one; the site already respects prefers-color-scheme.
            theme: "auto",
          });
        })
        .catch(() => cb.current(""));

      return () => {
        cancelled = true;
        // Strict Mode mounts effects twice in development. Without this the
        // second mount renders a second widget beside the first.
        if (widget.current && window.turnstile) {
          window.turnstile.remove(widget.current);
          widget.current = null;
        }
      };
      // action is a constant at the call site; re-rendering the widget to
      // track it would only throw away a solved token.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  if (!SITE_KEY) return null;
  return <div ref={box} className="min-h-[65px]" />;
});
