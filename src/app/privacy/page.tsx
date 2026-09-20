import type { Metadata } from "next";
import React from "react";
import LegalPage, { LegalSection } from "@/components/site/legal-page";
import JsonLd from "@/components/site/json-ld";
import { breadcrumbs, graph, isoDate, webPage } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy Policy - Zetarya",
  description: "What Zetarya collects, why, and what you can do about it.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Introduction",
    paragraphs: [
      "Zetarya, operated by zero2, provides zetarya.com and the Zetarya desktop, mobile and command-line clients. This policy explains what we collect, why, and what you can do about it.",
      "Because Zetarya transfers files directly between your devices, the files themselves never reach our systems. This policy is therefore mostly about account and diagnostic data, not about your content.",
    ],
  },
  {
    heading: "Information you provide",
    paragraphs: [
      "Account details: your name, email address, and - for paid accounts - billing contact and company name. Payment card data is handled by our payment processor and never touches our servers.",
      "Support correspondence: anything you send us in a ticket, including logs you choose to attach.",
      "Contact form: the name, email address, company and message you submit at zetarya.com/contact. It is delivered to our team as email and is not written to any database - the mailbox is the only copy, and your address is used to reply to you and for nothing else.",
    ],
  },
  {
    heading: "Information collected automatically",
    paragraphs: [
      "Connection metadata needed to establish a peer link: IP addresses of the two endpoints, NAT type, client version, and the timestamp and duration of the session.",
      "Aggregate telemetry: crash reports, feature usage counts, and throughput measurements. Telemetry can be disabled in settings without losing functionality.",
    ],
  },
  {
    heading: "What we never collect",
    paragraphs: [
      "File contents, folder structures, and encryption keys. These are generated and held on your devices. We are not technically able to read them, including when compelled by a lawful request.",
    ],
  },
  {
    heading: "How we use your information",
    paragraphs: [
      "To operate and secure the service, bill paid accounts, respond to support requests, and diagnose faults.",
      "We do not sell personal data, and we do not use your data to train machine learning models.",
    ],
  },
  {
    heading: "Legal basis for processing (GDPR)",
    paragraphs: [
      "Contract, for account and billing data necessary to provide the service. Legitimate interests, for security, abuse prevention and aggregate diagnostics. Consent, for optional telemetry and marketing email, which you can withdraw at any time.",
    ],
  },
  {
    heading: "Cookies and tracking",
    paragraphs: [
      "The marketing site uses one essential cookie for session state and, with your consent, one first-party analytics cookie. We do not run third-party advertising or cross-site tracking pixels.",
      "The contact form runs Cloudflare Turnstile to tell people from bots. It is a security measure rather than analytics, so it runs without asking for consent, and it is the one third-party script on the site. Turnstile sets no cookies and does not profile you across other sites - which is why we use it instead of a CAPTCHA that does.",
      "You can change your choice at any time from the cookie preferences link in the footer.",
    ],
  },
  {
    heading: "How we share information",
    paragraphs: [
      "With subprocessors listed below, under written data-processing terms. With authorities where legally required - noting that we cannot produce file contents we do not hold. With an acquirer, in the event of a merger, subject to this policy.",
    ],
  },
  {
    heading: "Data retention",
    paragraphs: [
      "Connection metadata is retained for 30 days for abuse prevention, then deleted. Account records are kept for the life of the account and for seven years afterwards where tax law requires it. Support tickets are deleted after 24 months. Contact form messages live in our mailbox and are deleted after 24 months, the same as tickets.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "Transfers run over TCP connections opened directly between your devices, encrypted with AES-256 inside TLS 1.3, with keys derived per session on your devices - no server of ours, and no cloud provider, sits on that path. The separate infrastructure we run for accounts and coordination uses least-privilege access and annual third-party penetration testing. We hold SOC 2 Type II and publish the summary report on request.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Depending on where you live, you may request access, correction, deletion, portability, restriction, or object to processing. Write to admin@zetarya.com and we will respond within 30 days.",
      "You also have the right to complain to your local supervisory authority.",
    ],
  },
  {
    heading: "Children’s privacy",
    paragraphs: [
      "Zetarya is not directed at children under 16 and we do not knowingly collect their personal data. If you believe a child has created an account, contact us and we will remove it.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We will post material changes here at least 30 days before they take effect, and email account owners. The date at the top always reflects the current version.",
    ],
  },
  {
    heading: "Contact us",
    paragraphs: ["Data protection queries: admin@zetarya.com. Zetarya by zero2, Jaipur, Rajasthan, India."],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbs("https://zetarya.com/privacy", [{ name: "Privacy Policy", path: "/privacy" }]),
          webPage({
            path: "/privacy",
            name: "Privacy Policy - Zetarya",
            description: "What Zetarya collects, why, and what you can do about it.",
            trail: [],
            dateModified: isoDate("12 August 2026"),
          }),
        )}
      />
      <LegalPage title="Privacy Policy" updated="12 August 2026" sections={SECTIONS} />
    </>
  );
}
