import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google"
import AnalyticsGate from "@/components/site/analytics-gate";
import { AuthProvider } from "@/auth/AuthProvider";

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
    default: "Zetarya — Transfer files beyond 1 Gbps",
    template: "%s",
  },
  description:
    "Send very large files directly between two devices. No speed cap — 1 Gbps sustained and beyond. Encrypted end to end, resumable to the byte, nothing stored.",
  // Resolves relative to the current route, so every page gets its own canonical.
  alternates: { canonical: "./" },
  manifest: "/manifest.json",
  keywords: [
      "high speed data transfer", "1Gbps",
      "1 Gbps",
      "1Gbps data transfer",
      "1 Gbps data transfer",
      "beyond 1 Gbps",
      "unlimited speed file transfer",
      "multi-gigabit file transfer",
      "10Gbps file transfer",
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
    title: "Zetarya — Transfer files beyond 1 Gbps",
    description:
      "Send very large files directly between two devices. No speed cap — 1 Gbps sustained and beyond. Encrypted end to end, resumable to the byte, nothing stored.",
    images: '/opengraph-image.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
    twitter: {
        card: "summary_large_image",
        title: "Zetarya — Transfer files beyond 1 Gbps",
        description:
            "Send very large files directly between two devices. No speed cap — 1 Gbps sustained and beyond. Encrypted end to end, resumable to the byte, nothing stored.",
        images: ["/opengraph-image.png"],
        creator: "@zetarya",   // Optional: your Twitter handle
    },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#faf8f6" }],
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
      {/* Wraps everything: one session restore for the whole site, rather
          than each page reaching for tokens on its own. */}
      <AuthProvider>{children}</AuthProvider>
      {/* Mounts only once the visitor has allowed analytics — see lib/consent. */}
      <AnalyticsGate />
      </body>
    </html>
  );
}
