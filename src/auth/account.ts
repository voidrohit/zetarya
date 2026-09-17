import { request } from "./http";
import { getAccessToken } from "./tokenStore";
import { refreshSession } from "./session";
import { ApiError } from "./http";

/**
 * The signed-in half of the API: plan, devices and payments.
 *
 * Mirrors the same routes the desktop app uses, so the account page and the
 * app report the same numbers from the same source rather than each deciding
 * what a plan looks like.
 */

async function authed<T>(path: string, options: { method?: string; body?: unknown } = {}) {
  const token = getAccessToken();
  if (!token) throw new ApiError("Not signed in", 401, null);
  try {
    return await request<T>(path, { ...options, token });
  } catch (err) {
    // One silent retry through a refresh, so a tab left open overnight
    // reloads rather than showing an error the user has to click past.
    if (!(err instanceof ApiError) || err.status !== 401) throw err;
    const fresh = await refreshSession();
    if (!fresh) throw err;
    return request<T>(path, { ...options, token: fresh });
  }
}

/** Mirrors `Plan` in internal/models/zetarya/plan.go. */
export type Plan = {
  plan: "free" | "business" | string;
  displayName: string;
  dataLimitBytes: number;
  maxMbps: number;
  usedBytes: number;
  remainingBytes: number;
  recipientsPerSend: number;
  resumeWindowHours: number;
  /** How many devices may be signed in at once on this tier. */
  maxSessions: number;
  /** Millis; when this month's usage resets. */
  periodEndsAt: number;
  /** Millis; when a paid term runs out. Absent when there is no term — which
   *  is every free plan. Not the same as periodEndsAt, which only resets the
   *  usage meter and never changes the tier. */
  planExpiresAt?: number;
  period: number;
};

/** One machine signed in to this account. */
export type Device = {
  endpointId: string;
  name: string;
  platform?: string;
  trusted?: boolean;
  current?: boolean;
  lastSeenAt?: number;
  createdAt?: number;
};

/** One Razorpay order and what became of it. */
export type Payment = {
  orderId: string;
  plan: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  paymentId?: string;
  createdAt: number;
};

/** Reading the plan is what creates a free one for a brand-new account, so
 *  this doubles as "make sure this user has a plan". */
export const fetchPlan = () => authed<Plan>("/api/v1/zetarya/plan");

export const fetchDevices = () => authed<Device[]>("/api/v1/zetarya/devices");

export const fetchPayments = () => authed<Payment[]>("/api/v1/zetarya/payments");

/** Mirrors `SessionInfo` in internal/service/auth_service.go. One live
 *  sign-in — not a device: the same laptop signed in twice is two rows. */
export type AuthSession = {
  id: string;
  userAgent: string;
  ip: string;
  createdAt: number;
  lastSeenAt: number;
  current: boolean;
};

export const fetchSessions = () =>
  authed<{ sessions: AuthSession[] }>("/auth/sessions").then((r) => r.sessions ?? []);

export const revokeSession = (id: string) =>
  authed<void>(`/auth/sessions/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Signs out every device except this one. */
export const revokeOtherSessions = () =>
  authed<void>("/auth/sessions/revoke-others", { method: "POST" });

/** Unlimited is a negative sentinel rather than zero: zero is a real answer to
 *  "how many bytes are left", and a client that had not heard of an uncapped
 *  tier would read it as an account with nothing left to spend. */
export const UNLIMITED = -1;
export const isUnlimited = (value: number) => value < 0;
