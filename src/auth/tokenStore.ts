import type { AuthTokens } from "./types";

/**
 * Where tokens live in the browser.
 *
 * Cookies in production, localStorage in development, matching the desktop
 * app's rule so the two never disagree about which to read. These are not
 * httpOnly and cannot be: the page reads them to set an Authorization header.
 * They are scoped to this origin, and the API is a separate origin that never
 * receives them as cookies — only as a bearer header the page attaches.
 */
const isProd = process.env.NODE_ENV === "production";

const COOKIE = { id: "psess", refresh: "prefresh_sess", access: "paccess" } as const;
const LOCAL = {
  id: "stg-psess",
  refresh: "stg-prefresh_sess",
  access: "stg-paccess",
} as const;

const THIRTY_DAYS = 60 * 60 * 24 * 30;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; secure; samesite=strict; max-age=${THIRTY_DAYS}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function read(kind: keyof typeof COOKIE): string | null {
  if (typeof window === "undefined") return null;
  try {
    return isProd ? readCookie(COOKIE[kind]) : localStorage.getItem(LOCAL[kind]);
  } catch {
    // Storage refused (private mode, blocked site data). No session, not a crash.
    return null;
  }
}

export const getIdToken = () => read("id");
export const getAccessToken = () => read("access");
export const getRefreshToken = () => read("refresh");

export function storeTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  try {
    if (isProd) {
      writeCookie(COOKIE.id, tokens.id_token);
      writeCookie(COOKIE.refresh, tokens.refresh_token);
      if (tokens.access_token) writeCookie(COOKIE.access, tokens.access_token);
    } else {
      localStorage.setItem(LOCAL.id, tokens.id_token);
      localStorage.setItem(LOCAL.refresh, tokens.refresh_token);
      if (tokens.access_token) localStorage.setItem(LOCAL.access, tokens.access_token);
    }
  } catch {
    // A session that cannot be persisted still works for this tab.
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    // Both stores, always: a build that flipped between dev and prod would
    // otherwise leave the other set behind and restore a stale session.
    Object.values(COOKIE).forEach(deleteCookie);
    Object.values(LOCAL).forEach((k) => localStorage.removeItem(k));
  } catch {
    // Nothing to do — there is no way to clear what cannot be read either.
  }
}
