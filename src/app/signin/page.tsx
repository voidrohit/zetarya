import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/fields";
import { SignInEntry } from "@/components/auth/entries";

export const metadata: Metadata = {
  title: "Sign in - Zetarya",
  description: "Sign in to see your plan, usage and devices.",
  // Account pages have nothing to index and should never rank above /pricing.
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignInEntry />
      </Suspense>
    </AuthLayout>
  );
}
