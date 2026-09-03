import "server-only";

import { phone, services, site } from "@/lib/content";
import { absoluteUrl, canonicalFor } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

/**
 * JSON-LD builders.
 *
 * Governing rule (spec 18): structured data must reflect exactly the visible
 * content. Implementation rule: every builder omits undefined keys before
 * serialisation, because an emitted `"priceRange": ""` or `"name": "CONFIRM_OWNER"`
 * is a false claim in machine-readable form — strictly worse than an absent
 * property.
 *
 * DELIBERATELY NOT EMITTED, and why:
 * - `AggregateRating` / `Review` — self-serving review markup on your own
 *   business has been ineligible for rich results since 2019, and
 *   .claude/rules/seo-accessibility.md forbids fake ratings outright.
 * - `LocalBusiness` / `HomeAndConstructionBusiness` — needs `areaServed` (B4)
 *   and a legal name (A1/A4). A service-area business must NOT emit a street
 *   address, and inventing one is worse than omitting the type.
 * - `Service` / `Offer` — needs the confirmed service list (B1/B2) and prices (C).
 * - `FAQPage` — the FAQ is empty by design until the owner answers.
 * - `SearchAction` — there is no site search, and Google retired the sitelinks
 *   searchbox.
 * - `BreadcrumbList` — two pages; it would be noise.
 */

type Json = Record<string, unknown>;

/**
 * Explicit per locale rather than a ternary: adding "en" to lib/i18n.ts would
 * otherwise make English pages announce themselves as ru-MD, with no type error.
 */
const LANGUAGE_TAG: Record<Locale, string> = { ro: "ro-MD", ru: "ru-MD" };

/** Drop undefined/null/empty values so no hollow property is ever serialised. */
function compact(input: Json): Json {
  const out: Json = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

/**
 * The organisation. `name` is confirmed (SemiDom, D-018) and so is `telephone`.
 * Everything else waits for owner confirmation and is absent until then.
 */
// Locale-independent: the organisation is one entity across every language.
export function organizationSchema(): Json {
  return compact({
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: site.name,
    description: site.descriptor,
    // Root-scoped, matching the @id. A locale-scoped url on a root-scoped @id
    // means both locales emit the same node with a different url.
    url: absoluteUrl("/"),
    telephone: phone.e164,
    // `logo` is deliberately absent: /icon.svg is a self-declared placeholder
    // chosen while the brand was undecided, and this file's own rule is that an
    // absent property beats a hollow one. Add it with a real raster logo (A2).
    image: absoluteUrl("/media/hero/hero-cada-placata-desktop.webp"),
    // areaServed, address, openingHoursSpecification, priceRange, sameAs,
    // foundingDate: all CONFIRM_OWNER. Absent, not guessed.
  });
}

export function websiteSchema(locale: Locale): Json {
  return compact({
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: LANGUAGE_TAG[locale],
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  });
}

export function webPageSchema(
  locale: Locale,
  opts: { path?: string; title: string; description: string; hasPart?: string },
): Json {
  return compact({
    "@type": "WebPage",
    "@id": `${canonicalFor(locale, opts.path ?? "")}#webpage`,
    url: canonicalFor(locale, opts.path ?? ""),
    name: opts.title,
    description: opts.description,
    inLanguage: LANGUAGE_TAG[locale],
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl("/")}#organization` },
    hasPart: opts.hasPart ? { "@id": opts.hasPart } : undefined,
  });
}

/**
 * The services grid, as ItemList. This describes what the page VISIBLY lists,
 * which is the one thing spec 18 requires — it makes no offer and states no
 * price, so it needs no owner confirmation.
 */
export function servicesItemListSchema(locale: Locale): Json {
  return compact({
    "@type": "ItemList",
    "@id": `${canonicalFor(locale)}#services`,
    name: "Servicii",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      description: service.summary,
    })),
  });
}

/** Wraps the graph in the envelope Google expects. */
export function jsonLdGraph(nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
