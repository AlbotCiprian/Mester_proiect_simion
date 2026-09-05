import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { canonicalFor, languageAlternates, robotsMeta } from "@/lib/seo";
import { site } from "@/lib/content";
import { ui } from "@/lib/ui-dict";
import {
  organizationSchema,
  servicesItemListSchema,
  webPageSchema,
  websiteSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeSections } from "@/components/public/home-sections";

/** OpenGraph locale tags. Explicit per locale rather than derived from the
 *  locale code, so adding a language cannot silently mislabel a page ro_MD. */
const OG_LOCALE: Record<Locale, string> = { ro: "ro_MD", ru: "ru_MD" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = ui(locale);
  const url = canonicalFor(locale);

  return {
    // `absolute` so the root template does not append the brand a second time,
    // which rendered <title>SemiDom · SemiDom</title>.
    title: { absolute: t.meta.homeTitle },
    description: t.meta.homeDescription,
    alternates: { canonical: url, languages: languageAlternates("") },
    robots: robotsMeta(locale),
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      locale: OG_LOCALE[locale],
      images: [
        {
          url: "/media/hero/hero-cada-placata-desktop.webp",
          width: 1600,
          height: 900,
          alt: t.meta.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // An unpublished locale has no content and must never render Romanian copy
  // under a Russian URL (ADR-011). Once a locale is published this never fires;
  // it stays because it is what makes adding a THIRD language safe.
  if (!publishedLocales.includes(locale)) notFound();

  const t = ui(locale);

  return (
    <>
      <JsonLd
        nodes={[
          organizationSchema(locale),
          websiteSchema(locale),
          webPageSchema(locale, {
            title: t.meta.homeTitle,
            description: t.meta.homeDescription,
            hasPart: `${canonicalFor(locale)}#services`,
          }),
          servicesItemListSchema(locale),
        ]}
      />
      <HomeSections locale={locale} />
    </>
  );
}
