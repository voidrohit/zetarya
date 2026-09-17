import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/fields";
import { CallbackClient } from "@/components/auth/CallbackClient";

export const metadata: Metadata = {
  title: "Signing you in - Zetarya",
  robots: { index: false, follow: false },
};

export default function CallbackPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <CallbackClient />
      </Suspense>
    </AuthLayout>
  );
}
