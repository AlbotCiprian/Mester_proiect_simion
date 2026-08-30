/**
 * Plain constants and types shared by the client form and the server.
 *
 * They live apart from lib/lead.ts on purpose: importing anything from that
 * module pulls in `leadSchema`, and therefore zod, into the client bundle.
 * Measured cost of the accidental import: 19.3 kB brotli, First Load JS
 * 139 kB -> 120 kB. Validation is unchanged — the Server Action still parses
 * with the full schema.
 *
 * NOTHING in this file may import zod.
 */

export const contactPreferences = ["telefon", "whatsapp", "viber", "telegram", "email"] as const;
export type ContactPreference = (typeof contactPreferences)[number];

export const contactPreferenceLabels: Record<ContactPreference, string> = {
  telefon: "Apel telefonic",
  whatsapp: "WhatsApp",
  viber: "Viber",
  telegram: "Telegram",
  email: "E-mail",
};

/**
 * Explicit tuple, NOT derived from `services.map(...)`. A spread of a mapped
 * array widens to `string[]`, which silently kills exhaustiveness checking the
 * day a service slug is renamed. Kept in step with lib/content.ts by a test.
 */
export const leadServiceSlugs = [
  "gresie-faianta",
  "renovari-bai",
  "teracota-sobe",
  "placari-exterioare",
  "altceva",
] as const;
export type LeadServiceSlug = (typeof leadServiceSlugs)[number];

export const leadServiceLabels: Record<LeadServiceSlug, string> = {
  "gresie-faianta": "Montaj gresie și faianță",
  "renovari-bai": "Renovare de baie la cheie",
  "teracota-sobe": "Teracotă și plăci ceramice",
  "placari-exterioare": "Placări exterioare și terase",
  altceva: "Altceva / nu sunt sigur",
};

/** The fields the form can show an error against, plus a form-level slot. */
export type LeadFieldKey =
  | "name"
  | "phone"
  | "email"
  | "contactPreference"
  | "service"
  | "locality"
  | "message"
  | "consent"
  | "website"
  | "elapsedMs"
  | "_form";

export type LeadFieldErrors = Partial<Record<LeadFieldKey, string>>;

export type LeadResult =
  | { status: "success"; reference: string }
  /** Validation failed. The form re-renders with per-field messages. */
  | { status: "invalid"; errors: LeadFieldErrors }
  /** Accepted-looking but throttled. Deliberately vague to the client. */
  | { status: "rate_limited" }
  /**
   * We could not hand the request to anyone. NEVER dress this up as success:
   * with no database, an undelivered lead is a lost customer, so the UI must
   * fall back to the phone number.
   */
  | { status: "undelivered" };
