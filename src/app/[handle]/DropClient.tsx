"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SiteShell from "@/components/site/site-shell";
import { Icon } from "@/components/site/icons";
import {
  DropApiError,
  cancelDrop,
  createDrop,
  dropStatus,
  fetchLink,
  type DropReceipt,
  type DropStatus,
  type PublicLink,
} from "@/lib/drops";
import {
  collectDropped,
  collectInput,
  loadEngine,
  merge,
  sendPicked,
  type EngineEvent,
  type Picked,
} from "@/lib/engine";

/* ---------------------------------------------------------------------------
   The page a stranger lands on. Four things happen, in order: they say who
   they are and pick files; one of the owner's devices accepts; the wasm engine
   dials that device through the relay; the receiver verifies every byte.

   Nothing here touches a server with the payload. The backend sees names and
   sizes; the relay sees ciphertext.
--------------------------------------------------------------------------- */

const POLL_MS = 1500;
const NAME_KEY = "zetarya.drop.sender";

type Phase =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "compose" }
  | { kind: "waiting"; receipt: DropReceipt }
  | { kind: "sending"; receipt: DropReceipt; status: DropStatus }
  | { kind: "done"; device: string }
  | { kind: "failed"; message: string; receipt?: DropReceipt; retryable: boolean };

type Progress = { bytes: number; total: number; speedBps: number; relay: boolean };

function formatBytes(n: number): string {
  if (!n || n < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${i === 0 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")} ${units[i]}`;
}

function formatMbps(bytesPerSec: number): string {
  const mbps = (bytesPerSec * 8) / 1e6;
  return mbps >= 10 ? `${Math.round(mbps)} Mbps` : `${mbps.toFixed(1)} Mbps`;
}

function formatEta(remaining: number, bytesPerSec: number): string {
  if (bytesPerSec <= 0 || remaining <= 0) return "—";
  const s = Math.round(remaining / bytesPerSec);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

const inputCls =
  "w-full rounded border border-line bg-card px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent";

export default function DropClient({ username }: { username: string }) {
  const [link, setLink] = useState<PublicLink | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  // Read by the poll and the sender, which must not restart on a re-render.
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const total = picked.reduce((sum, p) => sum + p.file.size, 0);

  // Who is home, and are they accepting.
  useEffect(() => {
    let cancelled = false;
    fetchLink(username)
      .then((l) => {
        if (cancelled) return;
        setLink(l);
        setPhase({ kind: "compose" });
      })
      .catch(() => !cancelled && setPhase({ kind: "missing" }));
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {
      // No storage, no remembered name.
    }
    return () => {
      cancelled = true;
    };
  }, [username]);

  // The engine download overlaps with choosing files instead of following it.
  useEffect(() => {
    if (link?.accepting) void loadEngine().catch(() => {});
  }, [link]);

  const add = useCallback((more: Picked[]) => {
    setFormError(null);
    setPicked((prev) => merge(prev, more));
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      add(await collectDropped(e.dataTransfer.items));
    },
    [add],
  );

  /** Dials the accepted device and streams everything. */
  const send = useCallback(
    async (receipt: DropReceipt, status: DropStatus) => {
      setPhase({ kind: "sending", receipt, status });
      setProgress({ bytes: 0, total, speedBps: 0, relay: true });
      try {
        const engine = await loadEngine();
        await sendPicked(engine, status.ticket!, status.relay, picked, status.limitMbps, (ev: EngineEvent) => {
          if (ev.type === "progress") {
            setProgress((p) => ({ ...(p ?? { relay: true }), bytes: ev.bytes, total: ev.total, speedBps: ev.speedBps }));
          } else if (ev.type === "path") {
            setProgress((p) => (p ? { ...p, relay: ev.relay } : p));
          }
        });
        setPhase({ kind: "done", device: status.device ?? "their device" });
      } catch (err) {
        // A cancel from this page is not a failure to report.
        if (phaseRef.current.kind !== "sending") return;
        setPhase({
          kind: "failed",
          message: err instanceof Error ? err.message : String(err),
          receipt,
          retryable: true,
        });
      }
    },
    [picked, total],
  );

  // Waiting for a device: poll until one answers.
  useEffect(() => {
    if (phase.kind !== "waiting") return;
    const { receipt } = phase;
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      const status = await dropStatus(receipt.id, receipt.secret).catch(() => null);
      if (stopped || !status) return;
      switch (status.status) {
        case "pending":
          return;
        case "accepted":
        case "transferring":
          if (status.ticket) {
            stopped = true;
            void send(receipt, status);
          }
          return;
        case "declined":
          stopped = true;
          setPhase({ kind: "failed", message: `${link?.displayName ?? "They"} declined the transfer.`, retryable: false });
          return;
        case "expired":
          stopped = true;
          setPhase({
            kind: "failed",
            message: "Nobody answered in time. They may not have a device open — try again later.",
            retryable: false,
          });
          return;
        default:
          stopped = true;
          setPhase({ kind: "failed", message: "That request is no longer open.", retryable: false });
      }
    };
    void tick();
    const timer = setInterval(() => void tick(), POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [phase, link, send]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sender = name.trim();
    if (!sender) {
      setFormError("Say who you are so they know what to accept.");
      return;
    }
    if (picked.length === 0) {
      setFormError("Pick at least one file.");
      return;
    }
    try {
      localStorage.setItem(NAME_KEY, sender);
    } catch {
      // Fine without.
    }
    setFormError(null);
    try {
      const receipt = await createDrop(
        username,
        sender,
        picked.map((p) => ({ name: p.path, size: p.file.size })),
      );
      setPhase({ kind: "waiting", receipt });
    } catch (err) {
      setFormError(
        err instanceof DropApiError && err.status === 403
          ? `${link?.displayName ?? "They"} turned their link off.`
          : err instanceof Error
            ? err.message
            : "Could not start the transfer.",
      );
    }
  }

  async function cancel() {
    const current = phaseRef.current;
    const receipt = "receipt" in current ? current.receipt : undefined;
    setPhase({ kind: "compose" });
    setProgress(null);
    if (current.kind === "sending") (await loadEngine()).cancel();
    if (receipt) await cancelDrop(receipt.id, receipt.secret).catch(() => {});
  }

  /** After a failure mid-transfer: the receiver kept what landed and is still
   *  listening, so a second attempt picks up where this one stopped. */
  async function retry() {
    const current = phaseRef.current;
    if (current.kind !== "failed" || !current.receipt) return;
    const status = await dropStatus(current.receipt.id, current.receipt.secret).catch(() => null);
    if (status?.ticket) void send(current.receipt, status);
    else setPhase({ kind: "failed", message: "That transfer is no longer open on their side.", retryable: false });
  }

  return (
    <SiteShell>
      <section className="measure pb-20 pt-12 sm:pt-16">
        <div className="mx-auto max-w-[640px]">
          {phase.kind === "loading" && (
            <p className="py-20 text-center text-muted">Looking up {`@${username}`}…</p>
          )}

          {phase.kind === "missing" && (
            <div className="py-16 text-center">
              <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">NO SUCH LINK</p>
              <h1 className="h-section mt-3 text-[30px] sm:text-[36px]">
                Nobody is at {`@${username}`}.
              </h1>
              <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-relaxed text-muted">
                Check the link you were given. A Zetarya link looks like zetarya.com/@name.
              </p>
            </div>
          )}

          {link && phase.kind !== "loading" && phase.kind !== "missing" && (
            <>
              <header className="text-center">
                <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">
                  SEND FILES
                </p>
                <h1 className="h-section mt-3 text-[30px] sm:text-[38px]">
                  Send files to {link.displayName}
                </h1>
                <p className="mx-auto mt-4 max-w-[500px] text-[16px] leading-relaxed text-muted">
                  Straight from this browser to whichever of their devices accepts.
                  Encrypted end to end; nothing is stored on a server.
                </p>
              </header>

              <div className="card-surface mt-10 p-6 sm:p-8">
                {!link.accepting ? (
                  <div className="py-6 text-center">
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded bg-surface text-muted">
                      <Icon name="lock" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">
                      {link.displayName} isn&apos;t accepting files right now.
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      Their link is switched off. Ask them to turn it on in Zetarya under Request data.
                    </p>
                  </div>
                ) : phase.kind === "compose" || phase.kind === "failed" ? (
                  <form onSubmit={submit} className="space-y-5">
                    {phase.kind === "failed" && (
                      <div className="flex items-start gap-3 rounded border border-accent/30 bg-accent-soft px-4 py-3 text-[14px] text-accent-deep">
                        <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="flex-1">{phase.message}</span>
                        {phase.retryable && (
                          <button type="button" onClick={() => void retry()} className="font-semibold underline">
                            Try again
                          </button>
                        )}
                      </div>
                    )}

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold">Your name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={60}
                        placeholder="So they know who is sending"
                        className={inputCls}
                        autoComplete="name"
                      />
                    </label>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => void onDrop(e)}
                      className={`rounded border-2 border-dashed px-6 py-9 text-center transition-colors ${
                        dragging ? "border-accent bg-accent-soft" : "border-line bg-surface"
                      }`}
                    >
                      <span className="mx-auto grid h-11 w-11 place-items-center rounded bg-card text-accent">
                        <Icon name="folder" className="h-5 w-5" />
                      </span>
                      <p className="mt-3 text-[15px] font-semibold">
                        {dragging ? "Drop to add" : "Drag files or folders here"}
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button type="button" className="btn-ghost btn-md" onClick={() => fileInput.current?.click()}>
                          Choose files
                        </button>
                        <button type="button" className="btn-ghost btn-md" onClick={() => folderInput.current?.click()}>
                          Choose folder
                        </button>
                      </div>
                      <input
                        ref={fileInput}
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          if (e.target.files) add(collectInput(e.target.files));
                          e.target.value = "";
                        }}
                      />
                      <input
                        ref={folderInput}
                        type="file"
                        hidden
                        // Not in React's attribute types, but every engine honours it.
                        {...({ webkitdirectory: "" } as Record<string, string>)}
                        onChange={(e) => {
                          if (e.target.files) add(collectInput(e.target.files));
                          e.target.value = "";
                        }}
                      />
                    </div>

                    {picked.length > 0 && (
                      <div className="rounded border border-line">
                        <div className="flex items-baseline justify-between border-b border-line px-4 py-2.5">
                          <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-muted">
                            {picked.length} {picked.length === 1 ? "ITEM" : "ITEMS"} · {formatBytes(total)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPicked([])}
                            className="text-[13px] font-semibold text-accent"
                          >
                            Clear
                          </button>
                        </div>
                        <ul className="max-h-56 overflow-y-auto">
                          {picked.map((p) => (
                            <li key={p.path} className="flex items-center gap-3 px-4 py-2 text-[14px]">
                              <Icon name="file" className="h-4 w-4 shrink-0 text-faint" />
                              <span className="min-w-0 flex-1 truncate">{p.path}</span>
                              <span className="shrink-0 font-mono text-[12px] text-muted">
                                {formatBytes(p.file.size)}
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove ${p.path}`}
                                onClick={() => setPicked((prev) => prev.filter((x) => x.path !== p.path))}
                                className="shrink-0 text-faint hover:text-ink"
                              >
                                <Icon name="close" className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formError && <p className="text-[14px] text-accent-deep">{formError}</p>}

                    <button type="submit" className="btn-primary btn-lg w-full">
                      {picked.length === 0
                        ? "Pick files to send"
                        : `Send ${formatBytes(total)} to ${link.displayName}`}
                    </button>
                    <p className="text-center text-[12px] leading-relaxed text-faint">
                      They approve every transfer on their device before anything is written.
                      Browser transfers go through the Zetarya relay at up to {link.limitMbps} Mbps.
                    </p>
                  </form>
                ) : phase.kind === "waiting" ? (
                  <div className="py-4 text-center">
                    <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
                    <h2 className="mt-5 text-[19px] font-semibold tracking-[-0.01em]">
                      Waiting for {link.displayName} to accept
                    </h2>
                    <p className="mx-auto mt-2 max-w-[420px] text-[15px] leading-relaxed text-muted">
                      The request is on every device they are signed in on. Keep this tab open —
                      the files leave from here the moment one of them says yes.
                    </p>
                    <p className="mt-4 font-mono text-[12px] text-faint">
                      {picked.length} {picked.length === 1 ? "item" : "items"} · {formatBytes(total)}
                    </p>
                    <button type="button" onClick={() => void cancel()} className="btn-ghost btn-md mt-6">
                      Cancel
                    </button>
                  </div>
                ) : phase.kind === "sending" ? (
                  <div className="py-2">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                        Sending to {phase.status.device || "their device"}
                      </h2>
                      <span className="font-mono text-[13px] text-muted">
                        {progress && progress.total > 0
                          ? `${Math.floor((progress.bytes / progress.total) * 100)}%`
                          : "connecting…"}
                      </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface2">
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-300"
                        style={{
                          width: `${progress && progress.total > 0 ? (progress.bytes / progress.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <dl className="mt-4 grid grid-cols-3 gap-4 font-mono text-[12px]">
                      <div>
                        <dt className="text-faint">Transferred</dt>
                        <dd className="mt-0.5 text-ink">
                          {formatBytes(progress?.bytes ?? 0)} / {formatBytes(total)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-faint">Speed</dt>
                        <dd className="mt-0.5 text-ink">{formatMbps(progress?.speedBps ?? 0)}</dd>
                      </div>
                      <div>
                        <dt className="text-faint">Remaining</dt>
                        <dd className="mt-0.5 text-ink">
                          {formatEta(total - (progress?.bytes ?? 0), progress?.speedBps ?? 0)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-[12px] leading-relaxed text-faint">
                      Be on this page to get maximum speed. Make sure you are not connected to any VPN.
                    </p>
                    <button type="button" onClick={() => void cancel()} className="btn-ghost btn-md mt-5">
                      Cancel
                    </button>
                  </div>
                ) : phase.kind === "done" ? (
                  <div className="py-6 text-center">
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-ok/10 text-ok">
                      <Icon name="check" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">
                      Delivered to {phase.device}
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {formatBytes(total)} received and verified byte for byte.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPicked([]);
                        setProgress(null);
                        setPhase({ kind: "compose" });
                      }}
                      className="btn-ghost btn-md mt-6"
                    >
                      Send something else
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
