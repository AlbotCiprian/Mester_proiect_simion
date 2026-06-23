// Locale configuration. RO is the launch default.
// RU is published only when the owner confirms verified translations
// (see docs/specs/19-CONTENT-I18N-EDITORIAL.md and ADR-011). EN is a later option.

export const locales = ["ro", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ro";

// Locales with verified, publishable content. Others render a "coming soon"
// notice instead of silently falling back (no mixed-language pages).
export const publishedLocales: Locale[] = ["ro"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  ro: "Română",
  ru: "Русский",
};
