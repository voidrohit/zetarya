import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/fields";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password - Zetarya",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
