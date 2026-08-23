import React from "react";
import SiteNav from "./site-nav";
import SiteFooter from "./site-footer";
import CookieBanner from "./cookie-banner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
