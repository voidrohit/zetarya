import { NextRequest, NextResponse } from "next/server";

/**
 * An old link that is still out in the world.
 *
 * It used to redirect to a hard-coded object in an S3 bucket, which now answers
 * 403 — and the object was a .pkg, a macOS installer, served from a .exe URL.
 * Anyone who followed it got a broken download of the wrong thing.
 *
 * It forwards to the real endpoint instead, so the link works and there is one
 * place that decides which Windows build is current.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/api/download/windows", request.url), 308);
}
