/**
 * What the current desktop releases are, read from the updater manifests.
 *
 * The site could hard-code a version, and then every release would need a
 * website edit that somebody eventually forgets — leaving a download page
 * offering a build two versions old. This reads the same latest.json each
 * installed app polls, so publishing a release is the only step.
 *
 * Mac and Windows ship on their own cadence and have a manifest each; they are
 * read through one function so a third platform is a table entry rather than
 * another copy of this logic.
 */

/** An hour: the manifests are cached for a minute at the edge, and a download
 *  page one hour behind a release is nobody's problem. */
const REVALIDATE_SECONDS = 3600;

const ASSETS = "https://assets.zetarya.com";

/** The desktop platforms that publish an updater manifest. */
export type DesktopPlatform = "mac" | "windows";

const SOURCES: Record<
  DesktopPlatform,
  {
    manifest: string;
    /** The updater's key for this platform. Its absence means the release was
     *  published without a build for it. */
    key: string;
    /** The file a person actually installs.
     *
     *  Derived rather than read, because the manifest names what the UPDATER
     *  consumes — a .tar.gz on macOS, the silent NSIS setup on Windows — and
     *  handing either of those to a visitor is not a download, it is a support
     *  ticket. The installer sits beside it under the same version. */
    installer: (version: string) => string;
  }
> = {
  mac: {
    manifest: `${ASSETS}/desktop/latest.json`,
    key: "darwin-aarch64",
    installer: (v) => `${ASSETS}/desktop/${v}/zetarya_${v}_universal.dmg`,
  },
  windows: {
    manifest: `${ASSETS}/windows/latest.json`,
    key: "windows-x86_64",
    installer: (v) => `${ASSETS}/windows/${v}/zetarya_${v}_x64_en-US.msi`,
  },
};

export type DesktopRelease = {
  version: string;
  /** Absolute URL of the installer to hand a visitor. */
  installer: string;
  publishedAt?: string;
};

export async function desktopRelease(
  platform: DesktopPlatform,
): Promise<DesktopRelease | null> {
  const source = SOURCES[platform];
  try {
    const res = await fetch(source.manifest, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const manifest = (await res.json()) as {
      version?: string;
      pub_date?: string;
      platforms?: Record<string, unknown>;
    };
    const version = manifest.version?.trim();
    // A manifest without this platform's key is one where the other platform
    // shipped alone; there is no build here to offer.
    if (!version || !manifest.platforms?.[source.key]) return null;

    return {
      version,
      installer: source.installer(version),
      publishedAt: manifest.pub_date,
    };
  } catch {
    // The download page still renders, saying the build is being published.
    // Better than a 500 on the one page a visitor came to use.
    return null;
  }
}

export const macRelease = () => desktopRelease("mac");
export const windowsRelease = () => desktopRelease("windows");
