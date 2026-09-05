import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DropClient from "./DropClient";

// A personal upload page, not content: keep it out of the index.
export const metadata: Metadata = {
  title: "Send files - Zetarya",
  description: "Send files straight to someone's device. Nothing is stored on a server.",
  robots: { index: false, follow: false },
};

/**
 * zetarya.com/@username — the public receiving link.
 *
 * A dynamic segment rather than a folder named "@username": in the App Router
 * a folder that starts with "@" is a parallel-route slot, not a path. Only
 * handles that start with "@" are ours; anything else at the root that no
 * static page claimed is a 404 as before.
 */
export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const decoded = decodeURIComponent(handle);
  if (!decoded.startsWith("@") || decoded.length < 2) notFound();
  return <DropClient username={decoded.slice(1)} />;
}
