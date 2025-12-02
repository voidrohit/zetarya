import type { Metadata } from "next";
import "./globals.css";

import { Urbanist} from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zetarya.com/'),
  title: "Zetarya - Transfer Files upto 1Gbps",
  description: "Team collaboration made easy by fast data transfer.",
  manifest: "/manifest.json",
  keywords: [
      "high speed data transfer", "1Gbps",
      "1 Gbps",
      "1Gbps data transfer",
      "1 Gbps data transfer",
      "data transfer",
      "transfer",
      "aspera",
      "ibm aspera",
      "resilio",
      "zetarya"
  ],
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fff" }],
  authors: [
    {
      name: "zero2",
      url: "https://www.zero2.in/",
    },
  ],
  viewport:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-72x72.png" },
    { rel: "icon", url: "icons/icon-48x48.png" },
  ],
  openGraph: {
    images: '/opengraph-image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.className}>
      <body className="">
      {children}
      <Script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "796a32ce7e8b4cdc97d74505ea4b4e50"}'
      />
      <Analytics/>
      </body>
    </html>
  );
}
