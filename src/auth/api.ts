import { request } from "./http";
import type { AuthResponse, User } from "./types";

/** Every /auth endpoint the site talks to, in one place. */

export const signIn = (preferred_username: string, password: string) =>
  request<AuthResponse>("/auth/signin", {
    method: "POST",
    body: { preferred_username, password },
  });

export const respondMfa = (input: {
  preferred_username: string;
  session: string;
  code: string;
  challenge_name: string;
}) => request<AuthResponse>("/auth/mfa/respond", { method: "POST", body: input });

export const signUp = (input: {
  name: string;
  email: string;
  preferred_username: string;
  password: string;
}) => request<AuthResponse>("/auth/signup", { method: "POST", body: input });

export const confirmSignUp = (preferred_username: string, code: string) =>
  request<AuthResponse>("/auth/confirm-signup", {
    method: "POST",
    body: { preferred_username, code },
  });

export const resendCode = (preferred_username: string) =>
  request<unknown>("/auth/resend-code", {
    method: "POST",
    body: { preferred_username },
  });

export const forgotPassword = (preferred_username: string) =>
  request<unknown>("/auth/forgot-password", {
    method: "POST",
    body: { preferred_username },
  });

export const confirmForgotPassword = (input: {
  preferred_username: string;
  code: string;
  new_password: string;
}) => request<unknown>("/auth/confirm-forgot-password", { method: "POST", body: input });

/** Availability check for the signup form. True means taken. */
export async function isTaken(field: "email" | "username", value: string) {
  const params = new URLSearchParams({ [field]: value });
  const data = await request<Record<string, boolean>>(`/auth/check?${params}`);
  return !!data[field];
}

/** Names a first-time Google account. The exchange hands back a placeholder
 *  and `needs_username`; the refresh token goes along so the server can
 *  reissue tokens carrying the chosen name. */
export const claimUsername = (
  accessToken: string,
  refresh_token: string,
  preferred_username: string,
) =>
  request<{ preferred_username: string } & Partial<AuthResponse>>("/auth/claim-username", {
    method: "POST",
    body: { preferred_username, refresh_token },
    token: accessToken,
  });

export const getMe = (token: string) => request<User>("/auth/me", { token });

export const signOut = (token: string | null) =>
  request<unknown>("/auth/signout", {
    method: "POST",
    token: token ?? undefined,
  });

export const refresh = (body: { refresh_token: string; access_token?: string }) =>
  request<AuthResponse>("/auth/refresh", { method: "POST", body });
