import React from "react";
import type { Metadata } from "next";
import PricingClient from "./PricingClient";
import JsonLd from "@/components/site/json-ld";
import {
  breadcrumbs,
  faqPage,
  graph,
  pricingOffers,
  softwareApplication,
  webPage,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pricing - Zetarya",
  description:
    "Free at 25 GB a month, up to 100 Mbps. Plus includes 2 TB, and Pro is uncapped on both volume and speed. No egress fees and nothing expires.",
  alternates: { canonical: "/pricing" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbs("https://zetarya.com/pricing", [{ name: "Pricing", path: "/pricing" }]),
          webPage({
            path: "/pricing",
            name: "Pricing - Zetarya",
            description:
              "Free at 25 GB a month, up to 100 Mbps. Plus includes 2 TB, and Pro is uncapped on both volume and speed.",
            trail: [],
            extra: { mainEntity: { "@id": "https://zetarya.com/#software" } },
          }),
          softwareApplication(),
          ...pricingOffers(),
          faqPage("/pricing"),
        )}
      />
      <PricingClient />
    </>
  );
}
