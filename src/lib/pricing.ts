/**
 * What Business costs, per currency.
 *
 * Mirrors the backend's own table in internal/models/zetarya/plan.go — the
 * server is what actually charges, and these two lists must agree with it.
 * Amounts are the WHOLE term in the currency's smallest unit, so the annual
 * figure is a year and not a month.
 *
 * Not conversions of one another: each is a price chosen for its market, so a
 * rate change moves neither.
 */
export const CURRENCIES = ["USD", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

const BUSINESS: Record<Currency, { monthly: number; annual: number }> = {
  USD: { monthly: 3000, annual: 30000 }, //   $30 / month,   $300 / year
  INR: { monthly: 279900, annual: 2799900 }, // ₹2,799 / month, ₹27,999 / year
};

/** The currency a visitor is shown first, from their IANA timezone.
 *
 *  The timezone rather than the language: a browser in Pune set to en-US
 *  still reports Asia/Kolkata, while its language reads as American. Same
 *  rule as the API's CurrencyForTimezone, so the site and the app agree. */
export function currencyForTimezone(tz: string): Currency {
  const zone = tz.trim().toLowerCase();
  // Calcutta is the older name for the same zone; some systems still send it.
  return zone === "asia/kolkata" || zone === "asia/calcutta" ? "INR" : "USD";
}

/** The visitor's own timezone, or "" where the browser will not say. */
export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

/** Minor units to a displayed amount.
 *
 *  The locale follows the currency, not the reader: en-US renders "$30"
 *  rather than some visitors' "US$30", and en-IN groups rupees the Indian
 *  way — ₹27,999, and lakhs as 1,00,000 rather than 100,000. */
export function formatPrice(minor: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100);
}

/** The saving the annual term gives, as a whole percent. Derived rather than
 *  written down, so the badge can never advertise a discount the prices do
 *  not actually give. */
export function annualSaving(currency: Currency): number {
  const { monthly, annual } = BUSINESS[currency];
  return Math.round((1 - annual / 12 / monthly) * 100);
}

/** The price block for the Business card: the headline figure, its unit, and
 *  the line under it. Shaped to drop straight onto a Tier. */
export function businessPrice(currency: Currency, annual: boolean) {
  const { monthly, annual: yearly } = BUSINESS[currency];
  if (!annual) {
    return { price: formatPrice(monthly, currency), unit: "/mo", note: undefined };
  }
  return {
    // Rounded to a whole rupee or dollar, not a whole paisa: a twelfth of
    // ₹27,999 is ₹2,333.25, and a headline price with a quarter of a rupee
    // on it reads as a rounding error rather than a price.
    price: formatPrice(Math.round(yearly / 12 / 100) * 100, currency),
    unit: "/mo, billed yearly",
    note: `${formatPrice(yearly, currency)} billed once a year`,
  };
}

/** Free is free in every currency, but the symbol should still match. */
export function freePrice(currency: Currency): string {
  return formatPrice(0, currency);
}
