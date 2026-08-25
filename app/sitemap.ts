import { statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { INDEXABLE, canonicalFor } from "@/lib/seo";
import { publishedLocales } from "@/lib/i18n";

/**
 * Only published, canonical, indexable routes. Driven off `publishedLocales`,
 * never `locales` — listing the /ru coming-soon stub would submit thin content
 * for indexing.
 */
const ROUTES = [
  { path: "", source: "lib/content.ts" },
  { path: "/proces", source: "lib/content.ts" },
  { path: "/confidentialitate", source: "app/(public)/[locale]/confidentialitate/page.tsx" },
] as const;

/**
 * `lastModified` must be real (spec 18). A sitemap where every URL changed today
 * is a sitemap Google stops trusting, so the date comes from the file that
 * actually holds the content. `changefreq` and `priority` are omitted entirely:
 * Google ignores both.
 */
function lastModifiedOf(source: string): Date {
  try {
    return statSync(path.join(process.cwd(), source)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];

  return publishedLocales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: canonicalFor(locale, route.path),
      lastModified: lastModifiedOf(route.source),
    })),
  );
}
