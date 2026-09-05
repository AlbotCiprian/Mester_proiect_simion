// Locale configuration. RO is the launch default.
// RU is published only when the owner confirms verified translations
// (see docs/specs/19-CONTENT-I18N-EDITORIAL.md and ADR-011). EN is a later option.

export const locales = ["ro", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ro";

// Locales with content complete enough to publish. Anything NOT listed here is
// 404 rather than a partial translation (ADR-011): a page that renders half in
// one language is worse than a page that admits it does not exist yet.
//
// "ru" joined on 2026-09-06. Everything a Russian visitor can reach is Russian:
// chrome, homepage, the fifteen topic pages, the hub, the lead form INCLUDING
// its server-side validation messages, and the privacy notice. The type system
// enforces it — every dictionary is Record<Locale, ...>, so a missing string is
// a compile error, and there is no fallback-to-Romanian path anywhere.
export const publishedLocales: Locale[] = ["ro", "ru"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  ro: "Română",
  ru: "Русский",
};
