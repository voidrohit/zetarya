import React from "react";
import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing - Zetarya",
  description:
    "Free at 25 GB a month, up to 100 Mbps. Plus includes 2 TB, and Pro is uncapped on both volume and speed. No egress fees and nothing expires.",
};

export default function Page() {
  return <PricingClient />;
}
