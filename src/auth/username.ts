/** Backend username rule: 3–30 chars, lowercase alphanumerics plus . _ -,
 *  starting with a letter or digit. Kept in step with the API's validator. */
export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,29}$/;

/** Derives a username from an email's local part ("jane.doe@x.com" →
 *  "jane.doe"), or "" when nothing valid can be derived. */
export function suggestUsername(email: string): string {
  const local = (email.split("@")[0] ?? "").toLowerCase();
  const cleaned = local
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^[^a-z0-9]+/, "")
    .slice(0, 30);
  return USERNAME_RE.test(cleaned) ? cleaned : "";
}

export function normalizeUsername(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}
