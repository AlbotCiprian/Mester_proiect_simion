import type { MetadataRoute } from "next";
import { INDEXABLE, canonicalFor } from "@/lib/seo";
import { publishedLocales } from "@/lib/i18n";

/**
 * Only published, canonical, indexable routes. Driven off `publishedLocales`,
 * never `locales` — listing the /ru coming-soon stub would submit thin content
 * for indexing.
 */
const ROUTES = [
  { path: "" },
  { path: "/confidentialitate" },
] as const;
// "/proces" used to be listed here. It is an in-page ANCHOR (lib/content.ts nav),
// not a route — one third of the submitted sitemap 404'd on the first crawl.
// Every entry must correspond to a directory under app/(public)/[locale]/.

/**
 * `lastModified` is omitted deliberately.
 *
 * The obvious implementation — file mtime — is the CI checkout time, so every
 * deploy would stamp every URL as "changed today", which is exactly the signal
 * that makes Google stop trusting a sitemap. An absent lastmod is honest; a
 * wrong one is worse than none. `changefreq` and `priority` are omitted too:
 * Google ignores both.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];

  return publishedLocales.flatMap((locale) =>
    ROUTES.map((route) => ({ url: canonicalFor(locale, route.path) })),
  );
}
