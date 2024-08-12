import type { Metadata } from "next";
import "./globals.css";

import { Urbanist} from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zetarya.com/'),
  title: "Zetarya - Bulk data transfer",
  description: "Moving world's data with speed, security and accuracy",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["high speed data transfer", "1Gbps", "data transfer", "transfer", "aspera", "ibm aspera", "resilio"],
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
    images: '/opengraph-image.jpg',
  },
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
