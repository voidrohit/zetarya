import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // `/_next/` must stay crawlable. Blocking it hides every JS and CSS chunk
      // from Googlebot, which then renders the page without them — Search
      // Console reported "15/15 page resources couldn't be loaded" on the
      // homepage for exactly this reason. Google's guidance is explicit that
      // CSS and JS must be fetchable. Nothing under /_next/ is indexable
      // content anyway, so there was never anything to protect.
      // "/@" is every personal upload page; each one is also noindex.
      { userAgent: "*", allow: "/", disallow: ["/api/", "/windows/", "/@"] },
    ],
    sitemap: "https://zetarya.com/sitemap.xml",
    host: "https://zetarya.com",
  };
}
