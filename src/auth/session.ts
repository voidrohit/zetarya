import { ApiError } from "./http";
import { decodeToken, isTokenExpired, secondsUntilExpiry } from "./jwt";
import type { JwtPayload } from "./jwt";
import * as api from "./api";
import { clearTokens, getAccessToken, getIdToken, getRefreshToken, storeTokens } from "./tokenStore";

/** Session lifecycle: refresh, the keep-alive timer, and sign-out. Knows
 *  nothing about React. */

// If several calls 401 at once they all reach for a refresh. Without dedup the
// first rotates the token and the rest 401 again and wipe the session.
let inFlight: Promise<string | null> | null = null;

export function refreshSession(): Promise<string | null> {
  if (!inFlight) {
    inFlight = doRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const expiredAccess = getAccessToken();

  try {
    // The expired access token goes in the BODY, never the Authorization
    // header — the server would reject it before reaching the refresh logic.
    const data = await api.refresh({
      refresh_token: refreshToken,
      ...(expiredAccess ? { access_token: expiredAccess } : {}),
    });

    const newAccess = data.access_token ?? null;
    // Cognito does not rotate the refresh token on a basic refresh, so the
    // stored one is carried forward unchanged.
    storeTokens({
      access_token: newAccess ?? undefined,
      id_token: data.id_token ?? getIdToken() ?? "",
      refresh_token: refreshToken,
    });
    return newAccess ?? data.id_token ?? null;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      // The refresh token itself was rejected — the session is over.
      clearTokens();
      stopSilentRefresh();
    }
    return null;
  }
}

/** A currently valid session's payload, refreshing silently if the access
 *  token has expired. Null when there is no usable session. */
export async function getValidSession(): Promise<JwtPayload | null> {
  let token = getAccessToken();
  if (!token) return null;
  if (isTokenExpired(token)) {
    token = await refreshSession();
    if (!token) return null;
  }
  return decodeToken(token);
}

let timer: ReturnType<typeof setInterval> | null = null;

/** Checks each minute and refreshes under five minutes remaining, keeping the
 *  session alive for as long as the refresh token lasts. */
export function startSilentRefresh() {
  stopSilentRefresh();
  timer = setInterval(async () => {
    const token = getAccessToken();
    if (token && secondsUntilExpiry(token) < 5 * 60) await refreshSession();
  }, 60_000);
}

export function stopSilentRefresh() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

let signingOut = false;

/** Signs out locally first and unconditionally — the server call is
 *  best-effort and must never hold the UI hostage. */
export async function logout(): Promise<void> {
  stopSilentRefresh();
  const token = getAccessToken();
  clearTokens();

  if (!signingOut) {
    signingOut = true;
    try {
      await Promise.race([
        api.signOut(token),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);
    } catch {
      // A failed revoke must not block local cleanup.
    } finally {
      // Without this, a throw wedges the flag on and every later sign-out
      // skips the revoke for the rest of the session.
      signingOut = false;
    }
  }
}
