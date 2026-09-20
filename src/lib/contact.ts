/**
 * The contact form's half of POST /public/contact.
 *
 * The backend sends the enquiry on to admin@zetarya.com through SES, with the
 * sender's address as Reply-To. Nothing is stored — the inbox is the record.
 *
 * Shares the fetch helper with drops.ts rather than repeating it, so a change
 * to how the backend reports errors lands in one place.
 */

import { call } from "./drops";

export type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  /** Cloudflare Turnstile result. The backend refuses submissions without a
   *  valid one in production. Single-use: reset the widget after every try. */
  turnstileToken: string;
  /** The honeypot. Hidden from people, so a non-empty value means a bot
   *  filled in every field it could find. Always sent as "" by this form. */
  website: string;
};

/**
 * Sends one enquiry. Throws DropApiError on a rejected or failed submission —
 * its `message` is written for the person who filled the form in, so it can be
 * shown as-is.
 */
export const sendContact = (body: ContactSubmission) =>
  call<{ status: string }>("/public/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
