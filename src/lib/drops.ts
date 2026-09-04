/**
 * The page's half of browser drops: what zetarya.com/@username talks to.
 *
 * Mirrors the /public routes in the backend (internal/handlers/drop_handler.go).
 * The page has no account; a drop's secret, handed back once at creation and
 * sent in a header from then on, is its only credential.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? "https://api.zetarya.com" : "http://localhost:8080");

const SECRET_HEADER = "X-Zetarya-Drop";

export type PublicLink = {
  username: string;
  displayName: string;
  accepting: boolean;
  /** The relay's per-transfer cap, decided by the backend. */
  limitMbps: number;
  relay: string;
};

export type DropReceipt = {
  id: string;
  secret: string;
  expiresAt: number;
  limitMbps: number;
  relay: string;
};

export type DropState =
  | "pending"
  | "accepted"
  | "declined"
  | "transferring"
  | "done"
  | "error"
  | "cancelled"
  | "expired";

export type DropStatus = {
  id: string;
  status: DropState;
  /** The device that accepted, once one has. */
  device?: string;
  /** Its listener — what the engine dials. Present while a listener exists. */
  ticket?: string;
  receivedBytes: number;
  error?: string;
  expiresAt: number;
  limitMbps: number;
  relay: string;
};

export type FileEntry = { name: string; size: number };

export class DropApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DropApiError";
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      data && typeof data === "object" && typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed (${res.status})`;
    throw new DropApiError(message, res.status);
  }
  return data as T;
}

const enc = encodeURIComponent;

export const fetchLink = (username: string) => call<PublicLink>(`/public/links/${enc(username)}`);

export const createDrop = (username: string, senderName: string, files: FileEntry[]) =>
  call<DropReceipt>(`/public/links/${enc(username)}/drops`, {
    method: "POST",
    body: JSON.stringify({ senderName, files }),
  });

export const dropStatus = (id: string, secret: string) =>
  call<DropStatus>(`/public/drops/${enc(id)}`, { headers: { [SECRET_HEADER]: secret } });

export const cancelDrop = (id: string, secret: string) =>
  call<void>(`/public/drops/${enc(id)}`, { method: "DELETE", headers: { [SECRET_HEADER]: secret } });
