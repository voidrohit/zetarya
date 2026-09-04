/**
 * The wasm sender, served from /engine (see scripts/build-engine.sh).
 *
 * Loaded on demand and once: four megabytes of iroh is not something every
 * visitor to the site should pay for, only the ones about to send.
 */

export type EngineEvent =
  | { type: "connected"; peer: string }
  | { type: "path"; relay: boolean; remote: string }
  | { type: "progress"; bytes: number; total: number; speedBps: number }
  | { type: "done" }
  | { type: "error"; message: string }
  | { type: "ticket" | "verifying" | "retrying" | "paused" | "manifest" };

/** A file with the relative path it will land at, forward slashes. */
export type Picked = { path: string; file: File };

type Entry = { path: string; size: number; mtimeMs: number };
type Read = (entry: number, offset: number, len: number) => Promise<Uint8Array>;

type Engine = {
  send: (
    ticket: string,
    relay: string,
    entries: Entry[],
    read: Read,
    limitMbps: number,
    streams: number,
    onEvent: (event: EngineEvent) => void,
  ) => Promise<void>;
  cancel: () => void;
};

/** Parallel streams. Over a relay the cap is the ceiling, not the stream
 *  count, and a few streams keep the pipe full while one waits on a read. */
const STREAMS = 3;

const ENGINE_PATH = "/engine/zetarya_browser.js";

let loading: Promise<Engine> | null = null;

/** Resolves once the module and its wasm are initialised. Safe to call early
 *  so the download overlaps with the person choosing files. */
export function loadEngine(): Promise<Engine> {
  loading ??= (async () => {
    // Built at runtime rather than written as a literal, because three
    // bundlers read this line and every one of them would try to resolve it —
    // the engine is a build artefact under public/, not a module in the graph.
    // The comments cover webpack and turbopack. esbuild, which bundles the
    // Cloudflare server function, honours neither and failed the deploy build
    // outright; it leaves a dynamic import alone only when it cannot read the
    // specifier statically, which a URL assembled here is.
    const url = new URL(ENGINE_PATH, window.location.origin).href;
    const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url);
    await mod.default();
    return { send: mod.send, cancel: mod.cancel };
  })();
  return loading;
}

/** Sends `picked` to the device behind `ticket`. Resolves when the receiver
 *  has verified every byte. Calling it again after a failure resumes. */
export function sendPicked(
  engine: Engine,
  ticket: string,
  relay: string,
  picked: Picked[],
  limitMbps: number,
  onEvent: (event: EngineEvent) => void,
): Promise<void> {
  const entries = picked.map((p) => ({ path: p.path, size: p.file.size, mtimeMs: p.file.lastModified }));
  const read: Read = (entry, offset, len) =>
    picked[entry].file
      .slice(offset, offset + len)
      .arrayBuffer()
      .then((buf) => new Uint8Array(buf));
  return engine.send(ticket, relay, entries, read, limitMbps, STREAMS, onEvent);
}

/**
 * Everything dropped onto the page, folders walked. Paths keep the folder
 * structure so a dropped "Photos" lands as "Photos/…" on the other side.
 */
export async function collectDropped(items: DataTransferItemList): Promise<Picked[]> {
  const out: Picked[] = [];
  const entries = Array.from(items)
    .map((item) => item.webkitGetAsEntry?.() ?? null)
    .filter((e): e is FileSystemEntry => e !== null);

  // Older engines: no entry API, files only.
  if (entries.length === 0) {
    for (const item of Array.from(items)) {
      const file = item.getAsFile();
      if (file) out.push({ path: file.name, file });
    }
    return out;
  }

  const walk = async (entry: FileSystemEntry, prefix: string): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject),
      );
      out.push({ path: prefix + entry.name, file });
      return;
    }
    if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      // readEntries returns in batches and an empty batch when it is done.
      for (;;) {
        const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
          reader.readEntries(resolve, reject),
        );
        if (batch.length === 0) break;
        for (const child of batch) await walk(child, `${prefix}${entry.name}/`);
      }
    }
  };
  for (const entry of entries) await walk(entry, "");
  return out;
}

/** Files from an <input>, with the folder path a directory picker gives. */
export function collectInput(list: FileList): Picked[] {
  return Array.from(list).map((file) => ({
    path: file.webkitRelativePath || file.name,
    file,
  }));
}

/** Two files at one path cannot both land; the first one picked wins. */
export function merge(existing: Picked[], added: Picked[]): Picked[] {
  const seen = new Set(existing.map((p) => p.path));
  const out = [...existing];
  for (const p of added) {
    if (seen.has(p.path)) continue;
    seen.add(p.path);
    out.push(p);
  }
  return out;
}
