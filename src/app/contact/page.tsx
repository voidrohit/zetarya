import React from "react";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import JsonLd from "@/components/site/json-ld";
import { SITE, breadcrumbs, graph, webPage } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact - Zetarya",
  description:
    "Sales, support, security disclosures or press. Reach the Zetarya team at admin@zetarya.com or +91 91193 34720 and hear back within a working day.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbs(`${SITE}/contact`, [{ name: "Contact", path: "/contact" }]),
          webPage({
            path: "/contact",
            name: "Contact - Zetarya",
            description:
              "Sales, support, security disclosures or press - pick the right door and you will hear back within a working day.",
            type: "ContactPage",
            trail: [],
            extra: { mainEntity: { "@id": `${SITE}/#organization` } },
          }),
        )}
      />
      <ContactClient />
    </>
  );
}
