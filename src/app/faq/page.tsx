import React from "react";
import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import JsonLd from "@/components/site/json-ld";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { BILLING_FAQS, PRODUCT_FAQS, FAQS } from "@/lib/site-content";
import { SITE, breadcrumbs, faqPage, graph, webPage } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ - Zetarya",
  description:
    "How transfers work, how fast each route is, what the encryption covers, and what the plans include.",
  alternates: { canonical: "/faq" },
};

/**
 * Every question, off the home page.
 *
 * The home page used to carry all seventeen product questions in one
 * accordion, which is more than anyone reads on a first visit — it kept six
 * and links here. Both pages declare FAQPage data for exactly what they
 * render, which is what Google asks for and also the only way the two stay
 * honest as questions move between them.
 */
export default function FaqPage() {
  return (
    <SiteShell>
      <JsonLd
        data={graph(
          breadcrumbs(`${SITE}/faq`, [{ name: "FAQ", path: "/faq" }]),
          webPage({
            path: "/faq",
            name: "FAQ - Zetarya",
            description:
              "How transfers work, how fast each route is, what the encryption covers, and what the plans include.",
            trail: [],
          }),
          faqPage("/faq", FAQS),
        )}
      />

      <PageHero
        eyebrow="FAQ"
        title="Questions, answered plainly."
        sub="The product first, then billing. If something here is not covered, the fastest route is the contact page."
      />

      <section className="measure pb-20">
        <Reveal>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-faint">
            The product
          </h2>
        </Reveal>
        <FaqList items={PRODUCT_FAQS} />

        <Reveal className="mt-20">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-faint">
            Plans and billing
          </h2>
        </Reveal>
        {/* Collapsed on arrival: the product list above is what people came
            for, and two open accordions on one page reads as a wall. */}
        <FaqList items={BILLING_FAQS} defaultOpen={null} />
      </section>
    </SiteShell>
  );
}
