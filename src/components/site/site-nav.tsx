"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Icon } from "./icons";
import { NAV_LINKS } from "@/lib/site-content";
import { DownloadButton } from "./platform";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflowY = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70"
          : "border-transparent bg-bg"
      }`}
    >
      <nav className="measure flex h-[72px] items-center justify-between">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo className="h-7 sm:h-8" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => {
            // "/#faq" is an anchor on the homepage, not a section of the site:
            // it should never claim the active underline.
            const active =
              !l.href.includes("#") &&
              (pathname === l.href || pathname.startsWith(l.href + "/"));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative text-sm font-medium transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex">
          <DownloadButton className="btn-primary btn-md" />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-[70] -mr-1 p-2 text-ink md:hidden"
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-[72px] z-[60] bg-bg md:hidden">
          <div className="measure flex flex-col gap-1 pt-6">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                // Closing on a pathname change is not enough: a hash link on the
                // page you are already on leaves the pathname untouched, so the
                // sheet would stay up over the section it just jumped to.
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 55}ms` }}
                className="animate-slide-up border-b border-line py-4 text-2xl font-semibold tracking-[-0.02em] text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6">
              <DownloadButton className="btn-primary btn-lg w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
