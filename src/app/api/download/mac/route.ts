import { NextRequest, NextResponse } from "next/server";
import { macRelease } from "@/lib/releases";

/**
 * /api/download/mac → the current disk image.
 *
 * A stable URL that outlives any one version, so every download button, blog
 * post and email link keeps working after a release rather than pointing at a
 * build nobody ships any more. The version lives in exactly one place: the
 * updater manifest the app itself reads.
 */
export async function GET(request: NextRequest) {
  const release = await macRelease();
  if (!release) {
    // Not a 404 — the file is not missing, the manifest was unreachable. Send
    // them to the page that can say so in words.
    return NextResponse.redirect(new URL("/download?unavailable=1", request.url));
  }
  return NextResponse.redirect(release.dmg, 302);
}
