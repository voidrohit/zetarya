import type { Metadata } from "next";
import "./globals.css";

import { Urbanist} from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '800'],
});

export const metadata: Metadata = {
  title: "Zetarya - Bulk data transfer",
  description: "Generated by create next appMoving world's data with speed, security and accuracy",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["high speed data transfer", "1Gbps", "data transfer", "transfer", "aspera", "ibm aspera", "resilio"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "zero2",
      url: "https://www.zero2.in/",
    },
  ],
  viewport:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.className}>
      <body className="">{children}</body>
      <Analytics/>
    </html>
  );
}
