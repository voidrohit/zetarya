import React, { Suspense } from "react";
import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing - Zetarya",
  description:
    "Free at 30 GB a month. Plus and Pro scale to 10 TB at up to 1 Gbps. No egress fees and nothing expires.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PricingClient />
    </Suspense>
  );
}
