/**
 * One JSON-LD graph per page. Every page emits a single <script> containing the
 * site-wide nodes (Organization, WebSite) plus its own page nodes, so every @id
 * reference resolves inside the same document. No cross-<script> references.
 */
import { POSTS, SPECS, TIERS, type Faq, type Post } from "@/lib/site-content";

export const SITE = "https://zetarya.com";

/**
 * Post/changelog dates are human strings ("14 August 2026"). `new Date(s)` reads
 * those as LOCAL midnight, so on an IST machine every ISO date came out a day
 * early — and the result changed with the build box's timezone. Pin to UTC.
 */
export function isoDate(human: string): string {
  return new Date(`${human} UTC`).toISOString();
}

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Zetarya",
  legalName: "Zetarya",
  url: SITE,
  description:
    "Zetarya moves very large files directly between two devices at up to 1 Gbps over its own UDP protocol, encrypted end to end with nothing stored on its servers.",
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE}/#logo`,
    url: `${SITE}/icons/icon-512x512.png`,
    contentUrl: `${SITE}/icons/icon-512x512.png`,
    width: 512,
    height: 512,
    caption: "Zetarya",
  },
  image: { "@id": `${SITE}/#logo` },
  email: "admin@zetarya.com",
  telephone: "+91-91193-34720",
  foundingDate: "2022",
  founder: { "@id": `${SITE}/#founder` },
  // zero2 is the parent company, NOT another profile of Zetarya. Putting it in
  // sameAs claimed the two were the same entity.
  parentOrganization: {
    "@type": "Organization",
    name: "zero2",
    url: "https://www.zero2.in/",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "admin@zetarya.com",
      telephone: "+91-91193-34720",
      availableLanguage: ["en"],
      areaServed: "Worldwide",
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "admin@zetarya.com",
      availableLanguage: ["en"],
      areaServed: "Worldwide",
    },
    {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: "admin@zetarya.com",
      availableLanguage: ["en"],
      areaServed: "Worldwide",
    },
  ],
  // Locality-level only: this is exactly what the Privacy, Terms and Contact
  // pages state. Do not add a streetAddress that the site does not publish.
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  areaServed: "Worldwide",
  // TODO(seo): add real `sameAs` profile URLs (LinkedIn, X, GitHub) once they
  // exist — they are the strongest entity-resolution signal available here.
};

const FOUNDER = {
  "@type": "Person",
  "@id": `${SITE}/#founder`,
  name: "Rohit Kumar Singh",
  jobTitle: "Founder",
  worksFor: { "@id": `${SITE}/#organization` },
  url: `${SITE}/about`,
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Zetarya",
  url: SITE,
  description:
    "Send very large files directly between two devices at up to 1 Gbps. Encrypted end to end, resumable to the byte, and nothing stored on our servers.",
  publisher: { "@id": `${SITE}/#organization` },
  inLanguage: "en",
  // No site search exists, so no SearchAction. Pointing one at a /search route
  // that 404s is a common and self-inflicted error.
};

const OG_IMAGE = {
  "@type": "ImageObject",
  "@id": `${SITE}/#primaryimage`,
  url: `${SITE}/opengraph-image.png`,
  contentUrl: `${SITE}/opengraph-image.png`,
  width: 2846,
  height: 1566,
};

type Crumb = { name: string; path: string };

export function breadcrumbs(url: string, trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path === "/" ? "/" : c.path}`,
    })),
  };
}

export function webPage(opts: {
  path: string;
  name: string;
  description: string;
  type?: string;
  trail?: Crumb[];
  datePublished?: string;
  dateModified?: string;
  extra?: Record<string, unknown>;
}) {
  const url = opts.path === "/" ? `${SITE}/` : `${SITE}${opts.path}`;
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
    primaryImageOfPage: { "@id": `${SITE}/#primaryimage` },
    inLanguage: "en",
    ...(opts.trail ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...opts.extra,
  };
}

/** Wraps page nodes with the site-wide nodes into one graph. */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, FOUNDER, WEBSITE, OG_IMAGE, ...nodes],
  };
}

// ---------------------------------------------------------------------------
// Page-specific builders
// ---------------------------------------------------------------------------

/** Numeric USD price, or null for "Custom" / non-numeric tiers. */
function usd(price: string): string | null {
  const n = price.replace(/[^\d.]/g, "");
  return n && !Number.isNaN(Number(n)) ? String(Number(n)) : null;
}

export function softwareApplication() {
  const numeric = TIERS.map((t) => usd(t.price)).filter((p): p is string => p !== null);
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#software`,
    name: "Zetarya",
    url: SITE,
    description:
      "Peer-to-peer file transfer for very large files. Up to 1 Gbps between two devices over a custom UDP protocol, AES-256 inside TLS 1.3, byte-exact resume, nothing stored server-side.",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "File Transfer",
    operatingSystem: "macOS, Windows, Linux, iOS, Android",
    softwareVersion: "2.4.0",
    downloadUrl: `${SITE}/windows/zetarya.exe`,
    featureList: [
      `Sustained transfer at up to ${SPECS.recordSpeed}`,
      `${SPECS.cipher} end-to-end encryption`,
      "Byte-exact resume after interruption",
      `Direct peer-to-peer transport using ${SPECS.transport}`,
      "No server-side storage of transferred files",
    ],
    publisher: { "@id": `${SITE}/#organization` },
    author: { "@id": `${SITE}/#organization` },
    image: { "@id": `${SITE}/#primaryimage` },
    // AggregateOffer spans the real published tiers, in the same currency the
    // prices on /pricing are shown in. Markup that disagrees with the visible
    // price is a manual-action risk.
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: numeric.length ? String(Math.min(...numeric.map(Number))) : "0",
      highPrice: numeric.length ? String(Math.max(...numeric.map(Number))) : "0",
      offerCount: TIERS.length,
      url: `${SITE}/pricing`,
      availability: "https://schema.org/InStock",
    },
    // No aggregateRating: there are no collected reviews. Inventing one is a
    // manual-action risk and is the single most penalised schema abuse.
  };
}

export function pricingOffers() {
  return TIERS.map((tier) => {
    const price = usd(tier.price);
    return {
      "@type": "Offer",
      "@id": `${SITE}/pricing#${tier.name.toLowerCase()}`,
      name: `Zetarya ${tier.name}`,
      description: tier.desc,
      category: tier.name,
      url: `${SITE}/pricing`,
      itemOffered: { "@id": `${SITE}/#software` },
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE}/#organization` },
      ...(price !== null
        ? {
            price,
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price,
              priceCurrency: "USD",
              billingIncrement: 1,
              unitCode: "MON",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          }
        : // "Custom" is a quote, not a price. Omit price entirely rather than
          // faking a 0 — a 0 makes the tier eligible for "free" treatment.
          { priceCurrency: "USD", availability: "https://schema.org/PreOrder" }),
    };
  });
}

/** Pass the questions the page actually renders — markup that claims Q&A a
 *  visitor cannot see on the page is a manual-action risk. */
export function faqPage(path: string, items: Faq[]) {
  const url = `${SITE}${path}`;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPosting(post: Post) {
  const url = `${SITE}/blog/${post.slug}`;
  const published = isoDate(post.date);
  const words = post.body.join(" ").split(/\s+/).filter(Boolean).length;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title.slice(0, 110),
    name: post.title,
    description: post.excerpt,
    articleSection: post.category,
    datePublished: published,
    // Google treats a missing dateModified as a staleness signal. No edit
    // history exists in the content model, so publish date is the honest value.
    dateModified: published,
    wordCount: words,
    timeRequired: `PT${parseInt(post.read, 10) || 5}M`,
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": `${SITE}/#person-${post.slug}-author`,
      name: post.author,
      jobTitle: post.role,
      description: post.bio,
      worksFor: { "@id": `${SITE}/#organization` },
    },
    publisher: { "@id": `${SITE}/#organization` },
    image: { "@id": `${SITE}/#primaryimage` },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    // Defined inline, not by reference: the Blog node itself only lives on
    // /blog, so a bare @id here dangles on every post page.
    isPartOf: {
      "@type": "Blog",
      "@id": `${SITE}/blog/#blog`,
      name: "Zetarya Blog",
      url: `${SITE}/blog`,
    },
    url,
  };
}

export function blogIndex() {
  return {
    "@type": "Blog",
    "@id": `${SITE}/blog/#blog`,
    name: "Zetarya Blog",
    description:
      "Throughput experiments, protocol write-ups, and notes from moving very large files.",
    url: `${SITE}/blog`,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: "en",
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE}/blog/${p.slug}#article`,
      headline: p.title.slice(0, 110),
      description: p.excerpt,
      datePublished: isoDate(p.date),
      url: `${SITE}/blog/${p.slug}`,
      author: { "@type": "Person", name: p.author },
      publisher: { "@id": `${SITE}/#organization` },
      image: { "@id": `${SITE}/#primaryimage` },
    })),
  };
}
