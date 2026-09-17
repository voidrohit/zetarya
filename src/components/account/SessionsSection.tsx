"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/site/icons";
import {
  fetchSessions,
  revokeOtherSessions,
  revokeSession,
  type AuthSession,
} from "@/auth/account";

/**
 * Live sign-ins, with revoke.
 *
 * Neighbouring question to Devices, and deliberately separate: that list is
 * "which machines do I transfer from", this is "who is signed in right now" —
 * and only the second is the one you act on after losing a laptop.
 */
export function SessionsSection({ maxSessions }: { maxSessions?: number }) {
  const [sessions, setSessions] = useState<AuthSession[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => fetchSessions().then(setSessions, () => setSessions([]));
  useEffect(() => {
    void load();
  }, []);

  const act = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
      await load();
    } catch {
      setError("Could not revoke that session. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  if (!sessions) return null;
  const others = sessions.filter((s) => !s.current).length;
  const atCap = !!maxSessions && sessions.length >= maxSessions;

  return (
    <div className="rounded-[14px] border border-line bg-card">
      {error && <p className="border-b border-line px-5 py-3 text-[12.5px] text-accent">{error}</p>}

      {maxSessions ? (
        <p className="border-b border-line px-5 py-2.5 text-[12px] text-faint">
          {sessions.length} of {maxSessions} devices signed in
          {/* Said before it happens rather than after: the next sign-in ends
              the oldest session, and finding that out by being signed out is
              the worst way to learn it. */}
          {atCap && " — signing in somewhere new will end the least recently used one"}
        </p>
      ) : null}

      {sessions.length === 0 ? (
        <p className="px-5 py-4 text-[13.5px] text-muted">No active sessions.</p>
      ) : (
        <ul className="divide-y divide-line">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-muted">
                <Icon name={glyph(s.userAgent)} className="h-4 w-4" />
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[13.5px] font-medium">{describe(s.userAgent)}</span>
                  {s.current && (
                    <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                      this session
                    </span>
                  )}
                </span>
                <span className="truncate font-mono text-[11px] text-faint">
                  {s.ip || "unknown IP"} · {ago(s.lastSeenAt)}
                </span>
              </span>

              {/* The current session has no revoke: ending it from here is
                  just signing out, and the button beside it already does
                  that with the right wording. */}
              {!s.current && (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void act(s.id, () => revokeSession(s.id))}
                  className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-50"
                >
                  {busy === s.id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {others > 0 && (
        <div className="border-t border-line px-5 py-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void act("others", revokeOtherSessions)}
            className="text-[12.5px] font-medium text-accent transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {busy === "others"
              ? "Signing out…"
              : `Sign out ${others} other session${others > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

/** Rough platform from a user agent — enough to tell one row from another. */
function describe(userAgent: string): string {
  const ua = userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone / iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X|Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return ua ? ua.slice(0, 32) : "Unknown device";
}

/** Only the icons this set actually has: a phone for handhelds, a laptop for
 *  everything else. A missing name renders nothing at all. */
function glyph(userAgent: string): "phone" | "laptop" {
  return /iPhone|iPad|iPod|Android/i.test(userAgent || "") ? "phone" : "laptop";
}

function ago(millis: number): string {
  if (!millis) return "";
  const mins = Math.round((Date.now() - millis) / 60000);
  if (mins < 1) return "active now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(millis).toLocaleDateString();
}
