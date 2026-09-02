import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google"
import AnalyticsGate from "@/components/site/analytics-gate";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zetarya.com/'),
  title: {
    default: "Zetarya — Transfer files at up to 1 Gbps",
    template: "%s",
  },
  description:
    "Send very large files directly between two devices at up to 1 Gbps. Encrypted end to end, resumable to the byte, and nothing stored on our servers.",
  // Resolves relative to the current route, so every page gets its own canonical.
  alternates: { canonical: "./" },
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
  authors: [
    {
      name: "zero2",
      url: "https://www.zero2.in/",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-72x72.png" },
    { rel: "icon", url: "icons/icon-48x48.png" },
  ],
  openGraph: {
    type: "website",
    siteName: "Zetarya",
    locale: "en_US",
    url: "/",
    title: "Zetarya — Transfer files at up to 1 Gbps",
    description:
      "Send very large files directly between two devices at up to 1 Gbps. Encrypted end to end, resumable to the byte, and nothing stored on our servers.",
    images: '/opengraph-image.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
    twitter: {
        card: "summary_large_image",
        title: "Zetarya — Transfer files at up to 1 Gbps",
        description:
            "Send very large files directly between two devices at up to 1 Gbps. Encrypted end to end, resumable to the byte, and nothing stored on our servers.",
        images: ["/opengraph-image.png"],
        creator: "@zetarya",   // Optional: your Twitter handle
    },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fff" }],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
      {children}
      {/* Mounts only once the visitor has allowed analytics — see lib/consent. */}
      <AnalyticsGate />
      </body>
    </html>
  );
}
