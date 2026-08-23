import Link from "next/link";
import React from "react";
import { Logo, LogoMark } from "./logo";
import { FOOTER_COLUMNS } from "@/lib/site-content";

export default function SiteFooter() {
  return (
    <footer className="rule mt-auto bg-bg">
      <div className="measure pt-16 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[300px_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-[300px]">
            <Logo className="h-8" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Direct encrypted transfer between your devices over UDP. Up to 1 Gbps, AES-256 + TLS 1.3, nothing stored.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-semibold text-ink">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule mt-14 flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-4 w-5" />
            <p className="text-[13px] text-faint">© 2026 Zetarya by zero2. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-5 text-faint">
            <a href="mailto:admin@zetarya.com" className="text-[13px] transition-colors hover:text-accent">
              admin@zetarya.com
            </a>
            <span className="hidden h-3 w-px bg-line sm:block" />
            <a href="tel:+919119334720" className="text-[13px] transition-colors hover:text-accent">
              +91 91193 34720
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
