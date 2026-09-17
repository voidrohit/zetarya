import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "Your account - Zetarya",
  description: "Your plan, usage, devices and billing.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountClient />;
}
