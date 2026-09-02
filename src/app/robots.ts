import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/", "/windows/"] },
    ],
    sitemap: "https://zetarya.com/sitemap.xml",
    host: "https://zetarya.com",
  };
}
