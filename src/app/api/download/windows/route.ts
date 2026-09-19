import { NextRequest, NextResponse } from "next/server";
import { windowsRelease } from "@/lib/releases";

/**
 * /api/download/windows → the current installer.
 *
 * The Windows sibling of /api/download/mac, and stable for the same reason: a
 * link in a blog post or an email keeps working after a release rather than
 * pointing at a build nobody ships any more. The version lives in exactly one
 * place, the updater manifest the app itself reads.
 */
export async function GET(request: NextRequest) {
  const release = await windowsRelease();
  if (!release) {
    // Not a 404 — the file is not missing, the manifest was unreachable. Send
    // them to the page that can say so in words.
    return NextResponse.redirect(new URL("/download?unavailable=1", request.url));
  }
  return NextResponse.redirect(release.installer, 302);
}
