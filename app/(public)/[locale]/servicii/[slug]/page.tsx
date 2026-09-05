import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, publishedLocales } from "@/lib/i18n";
import { canonicalFor, robotsMeta } from "@/lib/seo";
import { site } from "@/lib/content";
import { findLandingPage, landingSlugs } from "@/lib/landing";
import { photo } from "@/lib/landing-photos";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { LandingSections } from "@/components/public/landing-sections";

/**
 * The fifteen topic pages. Content is `lib/landing.ts`; this file is routing,
 * metadata and structured data only.
 *
 * `dynamicParams = false` so a URL that is not in `landingSlugs` 404s instead of
 * being rendered on demand — a topic page with no content is exactly the thin
 * page the SEO rules forbid, and an open dynamic segment is how one gets
 * created by accident.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  // Only the slug: the [locale] layout above contributes the locale half, and
  // an unpublished locale is rejected by the guard in the component below.
  return landingSlugs.map((slug) => ({ slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = findLandingPage(locale, slug);
  if (!page) return {};

  const path = `/servicii/${page.slug}`;
  const url = canonicalFor(locale, path);
  const firstKey = page.gallery[0];
  const cover = firstKey ? photo(firstKey) : undefined;

  return {
    // `absolute` so the root template does not append the brand a second time.
    title: { absolute: `${page.metaTitle} · ${site.name}` },
    description: page.metaDescription,
    alternates: { canonical: url },
    robots: robotsMeta(locale),
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: page.metaTitle,
      description: page.metaDescription,
      locale: "ro_MD",
      ...(cover ? { images: [{ url: cover.src, alt: cover.alt }] } : {}),
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function LandingRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  // Repeated on every route: without it, generateStaticParams would prerender
  // Romanian copy under /ru (ADR-011: no partial translation).
  if (!publishedLocales.includes(locale)) notFound();

  const page = findLandingPage(locale, slug);
  if (!page) notFound();

  const path = `/servicii/${page.slug}`;
  const faq = faqPageSchema(locale, { path, faqs: page.faqs });

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(locale, [
            { name: "Acasă", path: "" },
            { name: "Servicii", path: "/servicii" },
            { name: page.h1, path },
          ]),
          webPageSchema(locale, {
            path,
            title: page.metaTitle,
            description: page.metaDescription,
          }),
          serviceSchema(locale, {
            path,
            name: page.h1,
            // The visible lead paragraph, so the markup and the page agree.
            description: page.intro[0] ?? page.metaDescription,
          }),
          ...(faq ? [faq] : []),
        ]}
      />
      <LandingSections page={page} locale={locale} />
    </>
  );
}
