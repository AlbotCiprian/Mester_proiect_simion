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

import type { Locale } from "@/lib/i18n";

export const contactPreferences = ["telefon", "whatsapp", "viber", "telegram", "email"] as const;
export type ContactPreference = (typeof contactPreferences)[number];

/**
 * Contact preference -> the Channel["type"] that has to be confirmed before we
 * may offer it. The two vocabularies differ ("telefon" vs "phone"), and matching
 * them by string equality silently yields an empty list — which posts an empty
 * contactPreference and rejects every lead. Bound by a test.
 */
export const PREFERENCE_CHANNEL: Record<ContactPreference, string> = {
  telefon: "phone",
  whatsapp: "whatsapp",
  viber: "viber",
  telegram: "telegram",
  email: "email",
};

/**
 * Per-locale display labels. NOT a Partial: a missing language is a compile
 * error rather than a Russian form offering Romanian options.
 *
 * `Locale` is a type-only import — this file must stay free of zod (D-017),
 * and lib/i18n.ts brings nothing with it.
 */
const contactPreferenceLabelsByLocale: Record<Locale, Record<ContactPreference, string>> = {
  ro: {
    telefon: "Apel telefonic",
    whatsapp: "WhatsApp",
    viber: "Viber",
    telegram: "Telegram",
    email: "E-mail",
  },
  ru: {
    telefon: "Телефонный звонок",
    whatsapp: "WhatsApp",
    viber: "Viber",
    telegram: "Telegram",
    email: "E-mail",
  },
};

export function getContactPreferenceLabels(locale: Locale): Record<ContactPreference, string> {
  return contactPreferenceLabelsByLocale[locale];
}

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

const leadServiceLabelsByLocale: Record<Locale, Record<LeadServiceSlug, string>> = {
  ro: {
    "gresie-faianta": "Montaj gresie și faianță",
    "renovari-bai": "Renovare de baie la cheie",
    "teracota-sobe": "Teracotă și plăci ceramice",
    "placari-exterioare": "Placări exterioare și terase",
    altceva: "Altceva / nu sunt sigur",
  },
  ru: {
    "gresie-faianta": "Укладка плитки",
    "renovari-bai": "Ремонт ванной под ключ",
    "teracota-sobe": "Терракота и декоративная керамика",
    "placari-exterioare": "Наружная облицовка и террасы",
    altceva: "Другое / пока не знаю",
  },
};

export function getLeadServiceLabels(locale: Locale): Record<LeadServiceSlug, string> {
  return leadServiceLabelsByLocale[locale];
}

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
  | "confirm_ref"
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
