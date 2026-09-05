import type { MetadataRoute } from "next";
import { INDEXABLE, canonicalFor } from "@/lib/seo";
import { publishedLocales } from "@/lib/i18n";
import { landingSlugs } from "@/lib/landing";

/**
 * Only published, canonical, indexable routes. Driven off `publishedLocales`,
 * never `locales` — listing the /ru coming-soon stub would submit thin content
 * for indexing.
 */
const ROUTES = [
  { path: "" },
  { path: "/servicii" },
  { path: "/confidentialitate" },
] as const;
// "/proces" used to be listed here. It is an in-page ANCHOR (lib/content.ts nav),
// not a route — one third of the submitted sitemap 404'd on the first crawl.
// Every entry must correspond to a directory under app/(public)/[locale]/.

/**
 * The topic pages are derived from `lib/landing.ts`, never typed here.
 *
 * That is the whole point: `app/(public)/[locale]/servicii/[slug]/page.tsx`
 * builds its static params from the same array, so a page and its sitemap entry
 * cannot exist without each other. A hand-maintained second list is how a
 * sitemap comes to advertise a 404.
 */
const LANDING_PATHS = landingSlugs.map((slug) => `/servicii/${slug}`);

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

  const paths = [...ROUTES.map((route) => route.path), ...LANDING_PATHS];

  return publishedLocales.flatMap((locale) =>
    paths.map((path) => ({ url: canonicalFor(locale, path) })),
  );
}
