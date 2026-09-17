import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/fields";
import { SignUpEntry } from "@/components/auth/entries";

export const metadata: Metadata = {
  title: "Create your account - Zetarya",
  description: "Start on Free. No card needed.",
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignUpEntry />
      </Suspense>
    </AuthLayout>
  );
}
