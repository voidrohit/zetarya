"use client";

import { useSearchParams } from "next/navigation";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * The `?next=` reader, split out so the pages themselves stay server
 * components with real metadata.
 *
 * `next` is where to land after signing in — /pricing sends its own path so
 * someone who clicked "Get Business" while signed out comes back to it. Only
 * same-site paths are honoured: an absolute URL here would make this an open
 * redirect, handing anyone a zetarya.com link that lands on their site.
 */
function safeNext(raw: string | null, fallback = "/account"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export function SignInEntry() {
  const params = useSearchParams();
  return <SignInForm next={safeNext(params.get("next"))} />;
}

export function SignUpEntry() {
  const params = useSearchParams();
  return (
    <SignUpForm
      next={safeNext(params.get("next"))}
      confirmFor={params.get("confirm") ?? undefined}
    />
  );
}
