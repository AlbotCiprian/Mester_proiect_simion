/**
 * Lead attribution without a database.
 *
 * The email is the only record a lead ever gets, so whatever is not written into
 * it is lost forever — a lead that arrives without a source can never be
 * re-attributed later. Until now every email printed the same hardcoded
 * "ro · /#contact", which made every lead indistinguishable from every other.
 *
 * Everything here reduces attacker-controlled strings to a CLOSED ALLOWLIST
 * before they reach the message body. Nothing free-form travels: a `utm_source`
 * of "google" becomes the token `google`, and anything unrecognised becomes
 * `altul`. That keeps the email clean, keeps report grouping possible, and means
 * a crafted query string cannot forge a row.
 *
 * Imported by both the client form and the Server Action, so it must stay free
 * of `server-only` and of zod.
 */

/** Channels worth distinguishing in a weekly report. */
export const LEAD_SOURCES = [
  "google",
  "google-business",
  "facebook",
  "instagram",
  "tiktok",
  "999md",
  "whatsapp",
  "telegram",
  "viber",
  "direct",
  "altul",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  google: "Căutare Google",
  "google-business": "Google Maps / Business",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  "999md": "999.md",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  viber: "Viber",
  direct: "Direct / necunoscut",
  altul: "Altă sursă",
};

/** Host fragment -> source. Ordered: the first match wins. */
const REFERRER_MAP: Array<[string, LeadSource]> = [
  ["google.com/maps", "google-business"],
  ["maps.google", "google-business"],
  ["google.", "google"],
  ["bing.", "google"],
  ["yandex.", "google"],
  ["duckduckgo.", "google"],
  ["facebook.", "facebook"],
  ["fb.", "facebook"],
  ["instagram.", "instagram"],
  ["tiktok.", "tiktok"],
  ["999.md", "999md"],
  ["whatsapp.", "whatsapp"],
  ["wa.me", "whatsapp"],
  ["t.me", "telegram"],
  ["telegram.", "telegram"],
  ["viber.", "viber"],
];

/** utm_source value -> source. */
const UTM_MAP: Record<string, LeadSource> = {
  google: "google",
  gbp: "google-business",
  "google-business": "google-business",
  maps: "google-business",
  facebook: "facebook",
  fb: "facebook",
  instagram: "instagram",
  ig: "instagram",
  tiktok: "tiktok",
  "999": "999md",
  "999md": "999md",
  whatsapp: "whatsapp",
  telegram: "telegram",
  viber: "viber",
};

function normalize(value: string): string {
  return value.trim().toLowerCase().slice(0, 200);
}

/**
 * Resolve a source token from a UTM value and a referrer. Never returns anything
 * outside LEAD_SOURCES, so the caller cannot be made to print arbitrary text.
 */
export function resolveLeadSource(utmSource: string | undefined, referrer: string | undefined): LeadSource {
  if (utmSource) {
    const mapped = UTM_MAP[normalize(utmSource)];
    if (mapped) return mapped;
    return "altul";
  }

  if (referrer) {
    const ref = normalize(referrer);
    // A referrer from our own site is not a source; it is internal navigation.
    for (const [needle, source] of REFERRER_MAP) {
      if (ref.includes(needle)) return source;
    }
    return "altul";
  }

  // No referrer at all: typed the address, a bookmark, or a messenger that
  // strips the header. Common and not an error.
  return "direct";
}

/** Same-origin path, trimmed and length-capped. Never a full URL. */
export function safePath(pathname: string | undefined): string {
  if (!pathname || !pathname.startsWith("/")) return "/";
  return pathname.slice(0, 120);
}
