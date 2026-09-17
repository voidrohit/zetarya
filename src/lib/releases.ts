/**
 * What the current desktop release is, read from the updater manifest.
 *
 * The site could hard-code a version, and then every release would need a
 * website edit that somebody eventually forgets — leaving a download page
 * offering a build two versions old. This reads the same latest.json the
 * installed app polls, so publishing a release is the only step.
 */

const MANIFEST = "https://assets.zetarya.com/desktop/latest.json";
const DOWNLOADS = "https://assets.zetarya.com/desktop";

/** An hour: the manifest is cached for a minute at the edge, and a download
 *  page one hour behind a release is nobody's problem. */
const REVALIDATE_SECONDS = 3600;

export type MacRelease = {
  version: string;
  /** The disk image a person downloads — not the .tar.gz the updater uses. */
  dmg: string;
  publishedAt?: string;
};

export async function macRelease(): Promise<MacRelease | null> {
  try {
    const res = await fetch(MANIFEST, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const manifest = (await res.json()) as {
      version?: string;
      pub_date?: string;
      platforms?: Record<string, unknown>;
    };
    const version = manifest.version?.trim();
    // A manifest with no darwin entry is one where a Windows-only release was
    // published; there is no Mac build to offer from it.
    if (!version || !manifest.platforms?.["darwin-aarch64"]) return null;

    return {
      version,
      // Derived rather than read: the manifest names the updater archive,
      // and handing a person a .tar.gz instead of a disk image is not a
      // download, it is a support ticket.
      dmg: `${DOWNLOADS}/${version}/zetarya_${version}_universal.dmg`,
      publishedAt: manifest.pub_date,
    };
  } catch {
    // The download page still renders, saying the build is being published.
    // Better than a 500 on the one page a visitor came to use.
    return null;
  }
}
