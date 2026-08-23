import type { Metadata } from "next";
import React from "react";
import LegalPage, { LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — Zetarya",
  description: "The terms that govern your use of Zetarya.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance",
    paragraphs: [
      "By creating a Zetarya account, installing a client, or using zetarya.com, you agree to these terms. If you are agreeing on behalf of an organisation, you confirm you have authority to bind it.",
    ],
  },
  {
    heading: "Description of service",
    paragraphs: [
      "Zetarya establishes encrypted links between devices you control or are invited to, using our own protocol over UDP, and moves files across them. The service runs on Amazon Web Services. Where a direct link cannot be formed, an encrypted relay may carry the ciphertext without the ability to read it.",
      "We may change or discontinue features. For paid accounts we will give 30 days’ notice before removing anything material.",
    ],
  },
  {
    heading: "Accounts and eligibility",
    paragraphs: [
      "You must be at least 16 years old. You are responsible for your account credentials and for activity on devices paired to your account. Tell us promptly at admin@zetarya.com if you suspect unauthorised access.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: [
      "Do not use Zetarya to distribute malware, infringe copyright, transmit unlawful material, or attempt to breach the security of our infrastructure or another user’s devices.",
      "Do not resell transfer capacity, run automated load beyond documented rate limits, or circumvent plan quotas.",
    ],
  },
  {
    heading: "Payment and billing",
    paragraphs: [
      "Paid plans are billed per seat, monthly or annually, in advance. Fees exclude taxes, which are added where applicable. Seats added mid-term are prorated to your renewal date.",
      "Failed payments suspend paid features after a 14-day grace period; the account reverts to the Free plan rather than being deleted.",
    ],
  },
  {
    heading: "Cancellation and refunds",
    paragraphs: [
      "You may cancel at any time from account settings, effective at the end of the current period. Annual plans cancelled within 14 days of first purchase are refunded in full. We do not otherwise refund partial periods.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "Zetarya and its clients, documentation and marks remain our property. We grant you a non-exclusive, non-transferable licence to use them for the term of your subscription.",
    ],
  },
  {
    heading: "Your content and licence",
    paragraphs: [
      "Your files remain entirely yours. Because they are transferred directly between endpoints and are never stored by us, we take no licence over them of any kind. Any content you publish in shared account metadata — device names, roster labels — you licence to us only to display it back to your team.",
    ],
  },
  {
    heading: "Third-party services",
    paragraphs: [
      "Clients may interact with operating-system services and, for billing, with PhonePe. Those services have their own terms; we are not responsible for them.",
    ],
  },
  {
    heading: "Warranty disclaimer",
    paragraphs: [
      "The service is provided “as is”. We do not warrant that transfers will be uninterrupted, that a direct link is always achievable on every network, or that the service will meet a particular throughput on a connection we do not control.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, our aggregate liability arising from the service is limited to the fees you paid in the twelve months before the claim. We are not liable for indirect, incidental or consequential loss, including loss of data you did not retain a copy of.",
    ],
  },
  {
    heading: "Indemnification",
    paragraphs: [
      "You will indemnify Zetarya against third-party claims arising from your unlawful use of the service or your breach of these terms.",
    ],
  },
  {
    heading: "Termination",
    paragraphs: [
      "You may stop using the service at any time. We may suspend or terminate an account for material breach, unlawful use, or non-payment, with notice where practicable. On termination, paired devices stop transferring; there is no stored content for us to delete or return.",
    ],
  },
  {
    heading: "Governing law and disputes",
    paragraphs: [
      "These terms are governed by the laws of India. The courts of Jaipur have exclusive jurisdiction, save that either party may seek injunctive relief in any competent court. We will always try to resolve a dispute informally first — write to admin@zetarya.com.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We will post changes here and, for material changes, email account owners at least 30 days in advance. Continuing to use the service after they take effect constitutes acceptance.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: ["Zetarya by zero2, Jaipur, Rajasthan, India. admin@zetarya.com."],
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" updated="12 August 2026" sections={SECTIONS} />;
}
