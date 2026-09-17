import { API_URL } from "@/lib/drops";

/**
 * The site's authenticated half of the API.
 *
 * A near-copy of the desktop app's src/lib/http.ts, deliberately: both talk to
 * the same backend, and a second interpretation of the same error shape is how
 * the two drift apart. What is missing here is the Tauri-only parts — this
 * only ever runs in a browser.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

/** The visitor's IANA timezone — the server reads it to pick a price list. */
function timezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

export async function request<T>(
  path: string,
  { method = "GET", body, token, credentials, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "X-Client-Id": "web",
    "X-Client-Timezone": timezone(),
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials,
    signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const message =
      pick(data, "message") ?? pick(data, "error") ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function pick(data: unknown, key: string): string | undefined {
  if (data && typeof data === "object" && key in data) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string" && value) return value;
  }
  return undefined;
}

/** The text of whatever was thrown, whatever shape it arrived in. */
export function errorText(err: unknown, fallback = "Something went wrong"): string {
  if (typeof err === "string") return err || fallback;
  if (err instanceof Error) return err.message || fallback;
  if (err && typeof err === "object") {
    const message = (err as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}
