import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { canonicalFor, languageAlternates, robotsMeta } from "@/lib/seo";
import { phone, site } from "@/lib/content";
import { ui } from "@/lib/ui-dict";
import { Container, Kicker } from "@/components/public/ui";
import { ContactBand } from "@/components/public/cta";

/**
 * Required before a single phone number is collected: a consent checkbox cannot
 * discharge the information duty on its own.
 *
 * The controller is a NATURAL PERSON, not a company. Identification is his name
 * plus a working contact channel — which is what the information duty actually
 * asks for, and all it asks for.
 *
 * THE IDNP IS NOT PUBLISHED AND MUST NOT BE RE-ADDED (D-030). It was here for a
 * few hours, behind a collapsed reveal, at the owner's explicit request; he
 * asked for it removed once it was clear nothing requires it. A national
 * identification number on a public page is a permanent identity-theft surface
 * that buys nothing: scrapers and search engines pick it up within minutes and
 * it cannot be recalled. tests/privacy.test.ts fails if it reappears.
 *
 * The COPY lives in lib/ui-dict.ts so both languages render from this one
 * component. The DATA below does not: a name, a legal form and an address are
 * facts, not translations, and duplicating them per locale is how they drift.
 */

/** CONFIRMED by the owner, 2026-09-05 (checklist A4). */
const LEGAL_ENTITY = "Simion Bărbăcaru";
/** The legal form is a term of art, so it is stated per language. */
const LEGAL_FORM: Record<Locale, string> = {
  ro: "persoană fizică",
  ru: "физическое лицо",
};
/**
 * The address the owner declared for the domain. It has a real mailbox as of
 * 2026-09-06 — a bouncing controller address is a compliance failure, not a
 * cosmetic one. See docs/work/GO-LIVE.md.
 */
const CONTACT_EMAIL = "contact@semidom.md";

/** Bumped whenever this text changes materially; travels with every lead email. */
const POLICY_VERSION = "2026-09-05";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = ui(locale);
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: {
      canonical: canonicalFor(locale, "/confidentialitate"),
      languages: languageAlternates("/confidentialitate"),
    },
    robots: robotsMeta(locale),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Every new route repeats this guard, or generateStaticParams would prerender
  // an unpublished locale with the wrong language (ADR-011).
  if (!publishedLocales.includes(locale)) notFound();

  const t = ui(locale);

  return (
    <article className="bg-canvas pb-24 pt-32 sm:pt-36">
      <Container className="max-w-[44rem]">
        <Kicker>{t.privacy.kicker}</Kicker>
        <h1 className="mt-5 text-display-2 text-ink">{t.privacy.title}</h1>
        <p className="mt-5 text-lead text-ink-soft">{t.privacy.lead}</p>
        <p className="mt-3 text-sm text-muted">{t.privacy.version(POLICY_VERSION)}</p>

        <Section title={t.privacy.controllerTitle}>
          <P>{t.privacy.controllerBody(LEGAL_ENTITY, LEGAL_FORM[locale], site.name)}</P>
          <P>
            {t.privacy.contactBody} <A href={`tel:${phone.e164}`}>{phone.display}</A>{" "}
            {t.privacy.contactOr} <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
          </P>
        </Section>

        <Section title={t.privacy.collectTitle}>
          <P>{t.privacy.collectLead}</P>
          <Ul items={t.privacy.collectItems} />
          <P>{t.privacy.collectNote}</P>
        </Section>

        <Section title={t.privacy.whyTitle}>
          <P>{t.privacy.whyBody}</P>
          <P>{t.privacy.whyNoMarketing}</P>
        </Section>

        <Section title={t.privacy.sharedTitle}>
          <P>{t.privacy.sharedLead}</P>
          <Ul items={t.privacy.sharedItems} />
          <P>{t.privacy.sharedNote}</P>
        </Section>

        <Section title={t.privacy.cookiesTitle}>
          <P>{t.privacy.cookiesBody}</P>
          <P>{t.privacy.cookiesFuture}</P>
        </Section>

        <Section title={t.privacy.retentionTitle}>
          <P>{t.privacy.retentionBody}</P>
        </Section>

        <Section title={t.privacy.rightsTitle}>
          <P>
            {t.privacy.rightsBody} <A href={`tel:${phone.e164}`}>{phone.display}</A>{" "}
            {t.privacy.contactOr} <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
          </P>
          <P>{t.privacy.rightsAuthority}</P>
        </Section>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          <Link className="underline underline-offset-4 hover:text-ink" href={`/${locale}#contact`}>
            {t.privacy.backToForm}
          </Link>
        </p>
      </Container>

      {/* Every public route renders an id="contact", so the header CTA and the
          mobile bar always have a target on the page the visitor is reading. */}
      <div id="contact" className="mt-20">
        <ContactBand locale={locale} title={t.privacy.bandTitle} body={t.privacy.bandBody} />
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-display-3 text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base leading-relaxed text-ink-soft">{children}</p>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="font-medium text-bronze-deep underline underline-offset-4" href={href}>
      {children}
    </a>
  );
}

function Ul({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2 text-base leading-relaxed text-ink-soft">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 flex-none rounded-full bg-bronze" />
          {item}
        </li>
      ))}
    </ul>
  );
}
