import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, publishedLocales } from "@/lib/i18n";
import { canonicalFor, robotsMeta } from "@/lib/seo";
import { site } from "@/lib/content";
import {
  organizationSchema,
  servicesItemListSchema,
  webPageSchema,
  websiteSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeSections } from "@/components/public/home-sections";
import { Container } from "@/components/public/ui";

const TITLE = `${site.name} — montaj gresie, faianță și renovări de baie în Chișinău`;
const DESCRIPTION =
  "Montaj de gresie și faianță și renovări complete de baie în Chișinău și împrejurimi. " +
  "Pregătirea suportului, hidroizolație, placare cu sistem de nivelare și finisaje curate — cu fotografii din lucrări reale.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  // An unpublished locale gets no canonical and no OG card: it is a stub, and
  // advertising it as a page is what would make it compete with the real one.
  if (!publishedLocales.includes(locale)) {
    // `absolute` so the root template does not append the brand a second time,
    // which rendered <title>SemiDom · SemiDom</title>.
    return { title: { absolute: `Русская версия — ${site.name}` }, robots: robotsMeta(locale) };
  }

  const url = canonicalFor(locale);
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: url },
    robots: robotsMeta(locale),
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: TITLE,
      description: DESCRIPTION,
      locale: "ro_MD",
      images: [
        {
          url: "/media/hero/hero-cada-placata-desktop.webp",
          width: 1600,
          height: 900,
          alt: "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45°.",
        },
      ],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // No silent fallback to another language (ADR-011). Unpublished locales get
  // an honest notice instead of mixed-language content.
  if (!publishedLocales.includes(locale)) {
    return <ComingSoon />;
  }

  return (
    <>
      <JsonLd
        nodes={[
          organizationSchema(),
          websiteSchema(locale),
          webPageSchema(locale, { title: TITLE, description: DESCRIPTION, hasPart: `${canonicalFor(locale)}#services` }),
          servicesItemListSchema(locale),
        ]}
      />
      <HomeSections locale={locale} />
    </>
  );
}

function ComingSoon() {
  return (
    // lang="ru" marks the language of this part: the document is ro, this block
    // is not (WCAG 3.1.2). The full per-locale <html lang> needs the root layout
    // restructured, which is a prerequisite of actually publishing RU.
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="kicker" lang="ru">
        Русская версия
      </p>
      <h1 className="mt-5 text-3xl text-ink sm:text-4xl">Versiunea în limba rusă urmează</h1>
      <p className="mt-4 max-w-md text-muted">
        Conținutul în limba rusă se publică doar după traduceri verificate. Între timp, vezi
        varianta în limba română.
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xs border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
      >
        Mergi la versiunea RO
      </Link>
    </Container>
  );
}
