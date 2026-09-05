import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { canonicalFor, robotsMeta } from "@/lib/seo";
import { site } from "@/lib/content";
import { landingPages } from "@/lib/landing";
import {
  breadcrumbSchema,
  landingItemListSchema,
  webPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Arrow, Container, Kicker, Section, SectionHeading } from "@/components/public/ui";
import { CallButton, ContactBand } from "@/components/public/cta";

/**
 * The hub for the fifteen topic pages.
 *
 * It exists for two reasons and both matter. For a visitor it is the one screen
 * that shows the whole range without scrolling the homepage. For a crawler it
 * is the internal link that makes every topic page reachable in two clicks from
 * the root — a page that only the sitemap knows about gets crawled late and
 * ranked worse.
 */

const TITLE = "Servicii de montaj și renovare";
const DESCRIPTION =
  "Toate lucrările pe care le executăm, fiecare cu etapele reale de execuție, greșelile de evitat și fotografii de la fața locului.";

/** Editorial grouping. Purely presentational — the source of truth is lib/landing.ts. */
const GROUPS: Array<{ title: string; note: string; slugs: string[] }> = [
  {
    title: "Baie",
    note: "De la o placare simplă până la o renovare completă, coordonată de o singură echipă.",
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
    title: "Placare",
    note: "Montajul propriu-zis, pe formatele și materialele cu care lucrăm.",
    slugs: ["montaj-gresie-faianta", "placi-format-mare", "teracota"],
  },
  {
    title: "Exterior",
    note: "Suprafețe expuse la îngheț, unde sistemul de montaj contează mai mult decât placa.",
    slugs: ["placare-terasa", "placare-scari-trepte", "placare-fatada"],
  },
  {
    title: "Înainte să ceri o ofertă",
    note: "Ce trebuie să știi ca să compari corect două oferte, inclusiv pe a noastră.",
    slugs: ["cat-costa-montajul-gresie-faianta", "mester-gresie-faianta-chisinau"],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const url = canonicalFor(locale, "/servicii");
  return {
    title: { absolute: `${TITLE} · ${site.name}` },
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
    },
  };
}

export default async function ServicesHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!publishedLocales.includes(locale)) notFound();

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(locale, [
            { name: "Acasă", path: "" },
            { name: "Servicii", path: "/servicii" },
          ]),
          webPageSchema(locale, { path: "/servicii", title: TITLE, description: DESCRIPTION }),
          landingItemListSchema(locale, landingPages),
        ]}
      />

      <section className="relative overflow-hidden bg-ink text-canvas">
        <div
          className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
        />
        <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-36">
          <nav aria-label="Breadcrumb" className="text-xs text-canvas/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={`/${locale}`} className="transition-colors hover:text-canvas">
                  Acasă
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-canvas/85">
                  Servicii
                </span>
              </li>
            </ol>
          </nav>
          <Kicker tone="light">Ce executăm</Kicker>
          <h1 className="mt-4 max-w-3xl text-display-1 text-canvas">{TITLE}</h1>
          <p className="mt-6 max-w-2xl text-lead text-canvas/85">{DESCRIPTION}</p>
          <div className="mt-9">
            <CallButton variant="bronze" />
          </div>
        </Container>
      </section>

      <Section tone="canvas" divide>
        <Container>
          <SectionHeading
            kicker={`${landingPages.length} pagini`}
            title="Alege lucrarea care te interesează"
            intro="Fiecare pagină descrie ordinea reală de execuție și ce se strică atunci când ordinea nu este respectată."
          />
          <div className="mt-14 space-y-14">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line-strong pt-5">
                  <h2 className="text-display-3 text-ink">{group.title}</h2>
                  <p className="text-sm text-muted">{group.note}</p>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.slugs.map((slug) => {
                    const page = landingPages.find((item) => item.slug === slug);
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
                            Deschide <Arrow />
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
  return (
    <div id="contact">
      <ContactBand
        locale={locale}
        title="Nu ești sigur în ce categorie intră lucrarea ta?"
        body="Sună și spune-ne în două fraze ce ai de făcut, sau trimite formularul de pe pagina principală. Îți spunem noi ce implică."
      />
      <Section tone="canvas">
        <Container className="text-center">
          <p className="text-base text-ink-soft">
            Formularul complet, cu toate câmpurile, este pe{" "}
            <Link
              href={`/${locale}#contact`}
              className="font-medium text-bronze-deep underline underline-offset-4"
            >
              pagina principală
            </Link>{" "}
            și pe fiecare pagină de serviciu.
          </p>
        </Container>
      </Section>
    </div>
  );
}
