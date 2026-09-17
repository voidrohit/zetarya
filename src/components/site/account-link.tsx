"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";

/**
 * Account access, in the shapes the nav needs.
 *
 * It used to be one grey text link sitting beside the download button, and the
 * pair read badly: a filled primary button next to plain text makes the button
 * look oversized and the link look like something we forgot to style. So the
 * two states are drawn where each belongs instead.
 *
 *   nav     signed out — "Sign in" joins Features and Pricing, where it is one
 *           more destination and competes with nothing.
 *   avatar  signed in  — a single initial, small enough to sit next to the
 *           button without arguing with it.
 *   block   the mobile sheet, where everything is stacked and full width, so
 *           there is no proportion to get wrong.
 *
 * Each renders nothing in the states it does not serve, and nothing at all
 * while the session is being restored: flashing "Sign in" at someone who is
 * already signed in is a worse flicker than a moment of empty space.
 */
type Variant = "nav" | "avatar" | "block";

export function AccountLink({
  variant = "block",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const { status, user } = useAuth();
  const pathname = usePathname();

  if (status === "loading") return null;

  const signedIn = status === "signedIn";
  const name = user?.preferred_username || "Account";

  if (variant === "nav") {
    if (signedIn) return null;
    // Returns its own <li> so the nav can drop it straight into the list and
    // leave no empty item behind once someone signs in.
    const active = pathname === "/signin";
    return (
      <li>
        <Link
          href="/signin"
          aria-current={active ? "page" : undefined}
          className={`group relative text-sm font-medium transition-colors ${
            active ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          Sign in
          <span
            className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
              active ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      </li>
    );
  }

  if (variant === "avatar") {
    if (!signedIn) return null;
    return (
      <Link
        href="/account"
        title={name}
        aria-label={`Account: ${name}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface2 text-[13px] font-semibold uppercase text-ink transition-colors hover:bg-accent-soft hover:text-accent"
      >
        {name.trim().charAt(0) || "A"}
      </Link>
    );
  }

  return (
    <Link
      href={signedIn ? "/account" : "/signin"}
      className={
        className || "text-[14px] font-medium text-muted transition-colors hover:text-ink"
      }
    >
      {signedIn ? name : "Sign in"}
    </Link>
  );
}
