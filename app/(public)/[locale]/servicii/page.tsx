import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { canonicalFor, languageAlternates, robotsMeta } from "@/lib/seo";
import { site } from "@/lib/content";
import { getLandingPages, landingSlugs } from "@/lib/landing";
import { ui } from "@/lib/ui-dict";
import { breadcrumbSchema, landingItemListSchema, webPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Arrow, Container, Kicker, Section, SectionHeading } from "@/components/public/ui";
import { CallButton, ContactBand } from "@/components/public/cta";

/**
 * The hub for the fifteen topic pages.
 *
 * It exists for two reasons and both matter. For a visitor it is the one screen
 * that shows the whole range without scrolling the homepage. For a crawler it is
 * the internal link that makes every topic page reachable in two clicks from the
 * root — a page that only the sitemap knows about gets crawled late and ranked
 * worse. That became the ONLY sitewide path to them when the footer list was
 * removed, so this page is now load-bearing for crawlability.
 */

/**
 * Editorial grouping. Purely presentational: the slugs are the source of truth
 * and the labels come from the dictionary, so a group cannot end up with a
 * Romanian heading on a Russian page.
 */
const GROUPS = [
  {
    key: "bathroom",
    slugs: [
      "renovare-baie-la-cheie",
      "reparatie-baie",
      "hidroizolatie-baie",
      "dus-fara-prag-cuva-zidita",
      "placare-cada-baie",
      "montaj-wc-suspendat",
      "incalzire-in-pardoseala",
    ],
  },
  {
    key: "tiling",
    slugs: ["montaj-gresie-faianta", "placi-format-mare", "teracota"],
  },
  {
    key: "exterior",
    slugs: ["placare-terasa", "placare-scari-trepte", "placare-fatada"],
  },
  {
    key: "before",
    slugs: ["cat-costa-montajul-gresie-faianta", "mester-gresie-faianta-chisinau"],
  },
] as const;

const OG_LOCALE: Record<Locale, string> = { ro: "ro_MD", ru: "ru_MD" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = ui(locale);
  const url = canonicalFor(locale, "/servicii");
  return {
    title: { absolute: `${t.hub.title} · ${site.name}` },
    description: t.hub.description,
    alternates: { canonical: url, languages: languageAlternates("/servicii") },
    robots: robotsMeta(locale),
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t.hub.title,
      description: t.hub.description,
      locale: OG_LOCALE[locale],
    },
  };
}

export default async function ServicesHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!publishedLocales.includes(locale)) notFound();

  const t = ui(locale);
  const pages = getLandingPages(locale);

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(locale, [
            { name: t.nav.home, path: "" },
            { name: t.nav.services, path: "/servicii" },
          ]),
          webPageSchema(locale, {
            path: "/servicii",
            title: t.hub.title,
            description: t.hub.description,
          }),
          landingItemListSchema(locale, pages),
        ]}
      />

      <section className="relative overflow-hidden bg-ink text-canvas">
        <div
          className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
        />
        <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-36">
          <nav aria-label={t.nav.ariaBreadcrumb} className="text-xs text-canvas/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={`/${locale}`} className="transition-colors hover:text-canvas">
                  {t.nav.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-canvas/85">
                  {t.nav.services}
                </span>
              </li>
            </ol>
          </nav>
          <Kicker tone="light">{t.hub.kicker}</Kicker>
          <h1 className="mt-4 max-w-3xl text-display-1 text-canvas">{t.hub.title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-canvas/85">{t.hub.description}</p>
          <div className="mt-9">
            <CallButton locale={locale} variant="bronze" />
          </div>
        </Container>
      </section>

      <Section tone="canvas" divide>
        <Container>
          <SectionHeading
            kicker={t.hub.pageCount(landingSlugs.length)}
            title={t.hub.listTitle}
            intro={t.hub.listIntro}
          />
          <div className="mt-14 space-y-14">
            {GROUPS.map((group) => (
              <div key={group.key}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line-strong pt-5">
                  <h2 className="text-display-3 text-ink">{t.hub.groups[group.key]}</h2>
                  <p className="text-sm text-muted">{t.hub.groupNotes[group.key]}</p>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.slugs.map((slug) => {
                    const page = pages.find((item) => item.slug === slug);
                    if (!page) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/${locale}/servicii/${page.slug}`}
                          className="group flex h-full flex-col rounded-sm border border-line bg-canvas-raised p-6 transition-colors hover:border-ink"
                        >
                          <span className="text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-bronze-deep">
                            {page.h1}
                          </span>
                          <span className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                            {page.metaDescription}
                          </span>
                          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-bronze-deep">
                            {t.cta.openPage} <Arrow />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <HubContact locale={locale} />
    </>
  );
}

// The hub carries the same id="contact" as every other route, so the header and
// the mobile bar never navigate away from the page the visitor is reading.
function HubContact({ locale }: { locale: Locale }) {
  const t = ui(locale);
  return (
    <div id="contact">
      <ContactBand locale={locale} title={t.hub.bandTitle} body={t.hub.bandBody} />
      <Section tone="canvas">
        <Container className="text-center">
          <p className="text-base text-ink-soft">
            {t.hub.formNote}{" "}
            <Link
              href={`/${locale}#contact`}
              className="font-medium text-bronze-deep underline underline-offset-4"
            >
              {t.hub.formNoteLink}
            </Link>
            .
          </p>
        </Container>
      </Section>
    </div>
  );
}
