import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, publishedLocales } from "@/lib/i18n";
import { canonicalFor, robotsMeta } from "@/lib/seo";
import { phone, site } from "@/lib/content";
import { Container, Kicker } from "@/components/public/ui";
import { ContactBand } from "@/components/public/cta";

/**
 * Required before a single phone number is collected: a consent checkbox cannot
 * discharge the information duty on its own.
 *
 * The controller is a NATURAL PERSON, not a company, so the identification is
 * his name plus his IDNP. The IDNP is rendered behind a native <details>
 * disclosure — collapsed by default, expandable by anyone, and working with
 * JavaScript disabled — at the owner's explicit request (D-025).
 */

/** CONFIRMED by the owner, 2026-09-05 (checklist A4). */
const LEGAL_ENTITY = "Simion Barbacaru";
const LEGAL_FORM = "persoană fizică";
const LEGAL_IDNP = "0990903223519";
/**
 * The address the owner declared for the domain. It must have a real mailbox
 * before go-live — a bouncing controller address is a compliance failure, not a
 * cosmetic one. See docs/work/GO-LIVE.md, Stage 2.
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
  return {
    title: "Politica de confidențialitate",
    description:
      "Ce date colectăm prin formularul de contact, în ce scop, cine le procesează, ce cookie-uri folosim și cât timp le păstrăm.",
    alternates: { canonical: canonicalFor(locale, "/confidentialitate") },
    robots: robotsMeta(locale),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Every new route must repeat this guard, or generateStaticParams will
  // prerender it under /ru with Romanian copy (ADR-011: no partial translation).
  if (!publishedLocales.includes(locale)) notFound();

  return (
    <article className="bg-canvas pb-24 pt-32 sm:pt-36">
      <Container className="max-w-[44rem]">
        <Kicker>Date personale</Kicker>
        <h1 className="mt-5 text-display-2 text-ink">Politica de confidențialitate</h1>
        <p className="mt-5 text-lead text-ink-soft">
          Această pagină explică ce date primim prin formularul de pe site, de ce le folosim, cine
          le mai vede, ce cookie-uri folosim și cât timp le păstrăm.
        </p>
        <p className="mt-3 text-sm text-muted">Versiunea {POLICY_VERSION}.</p>

        <Section title="Cine prelucrează datele">
          <P>
            Operatorul datelor este <strong className="font-semibold text-ink">{LEGAL_ENTITY}</strong>{" "}
            ({LEGAL_FORM}), care activează sub denumirea comercială {site.name}, în Republica
            Moldova.
          </P>
          <Reveal label="Arată IDNP-ul operatorului" hint="Ascuns implicit, îl poți afișa oricând.">
            <span className="tabular">
              IDNP {LEGAL_IDNP}
            </span>
          </Reveal>
          <P>
            Ne poți contacta la <A href={`tel:${phone.e164}`}>{phone.display}</A> sau la{" "}
            <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
          </P>
        </Section>

        <Section title="Ce date colectăm">
          <P>Doar ce completezi tu în formular:</P>
          <Ul
            items={[
              "numele tău",
              "numărul de telefon",
              "adresa de e-mail, dacă o completezi (este opțională)",
              "localitatea, dacă o completezi",
              "serviciul pe care îl cauți și metoda de contact preferată",
              "detaliile pe care le scrii despre lucrare",
            ]}
          />
          <P>
            Nu îți cerem adresa exactă, buletinul sau date de plată. Serverul care găzduiește
            site-ul înregistrează, ca orice server web, adresa IP a cererii; noi o folosim doar ca
            să limităm trimiterile automate, într-o formă criptată ireversibil, și nu o stocăm
            alături de datele tale.
          </P>
        </Section>

        <Section title="De ce le folosim">
          <P>
            Ca să răspundem la cererea ta: să te sunăm, să clarificăm lucrarea și să îți dăm un
            interval de preț. Temeiul este consimțământul tău, exprimat prin bifa din formular,
            împreună cu pregătirea unui eventual contract, la cererea ta. Îți poți retrage
            consimțământul oricând, sunându-ne sau scriindu-ne.
          </P>
          <P>
            Nu trimitem newslettere, nu facem marketing, nu profilăm și nu vindem datele nimănui.
          </P>
        </Section>

        <Section title="Cine le mai vede">
          <P>
            Cererea îți ajunge la noi pe e-mail. Pentru asta folosim doi furnizori, care procesează
            datele strict în numele nostru:
          </P>
          <Ul
            items={[
              "Resend — serviciul care livrează e-mailul cu cererea ta. Serverele sale sunt în afara Republicii Moldova, în Statele Unite.",
              "Vercel — găzduirea site-ului, care păstrează pe termen scurt jurnale tehnice ale cererilor (inclusiv adresa IP).",
            ]}
          />
          <P>
            În rest, datele nu ajung la nimeni altcineva. Nu le transmitem altor meșteri, furnizori
            de materiale sau agenții de publicitate.
          </P>
        </Section>

        <Section title="Cookie-uri și tehnologii similare">
          <P>
            <strong className="font-semibold text-ink">Site-ul nu folosește cookie-uri.</strong> Nu
            avem cookie-uri de urmărire, de publicitate sau de analiză, nu folosim pixeli de
            remarketing și nu încărcăm scripturi din alte domenii. De aceea nu vezi nicio fereastră
            de consimțământ pentru cookie-uri: nu am avea pentru ce să ți-o cerem.
          </P>
          <P>
            Formularul folosește doar memoria paginii pe durata completării, care dispare când
            închizi fila. Dacă vom adăuga vreodată statistici de trafic, îți vom cere întâi acordul
            printr-un banner și vom actualiza această pagină înainte de a porni ceva.
          </P>
        </Section>

        <Section title="Cât timp le păstrăm">
          <P>
            Păstrăm cererea cât timp discutăm despre lucrare și, dacă lucrarea se face, pe durata
            garanției. Dacă nu ajungem la o colaborare, ștergem mesajul din cutia poștală în cel
            mult 12 luni.
          </P>
        </Section>

        <Section title="Drepturile tale">
          <P>
            Poți cere oricând să afli ce date avem despre tine, să le corectăm sau să le ștergem,
            să îți retragi consimțământul și să te opui folosirii lor. Ne suni la{" "}
            <A href={`tel:${phone.e164}`}>{phone.display}</A> sau ne scrii la{" "}
            <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> și rezolvăm.
          </P>
          <P>
            Dacă nu ești mulțumit de răspuns, te poți adresa Centrului Național pentru Protecția
            Datelor cu Caracter Personal al Republicii Moldova.
          </P>
        </Section>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          <Link className="underline underline-offset-4 hover:text-ink" href={`/${locale}#contact`}>
            Înapoi la formularul de contact
          </Link>
        </p>
      </Container>

      {/* Every public route renders an id="contact", so the header CTA and the
          mobile bar always have a target on the page the visitor is reading. */}
      <div id="contact" className="mt-20">
        <ContactBand
          locale={locale}
          title="Ai o întrebare despre datele tale?"
          body="Sună-ne și rezolvăm. Pentru o cerere de lucrare, formularul complet este pe pagina principală."
        />
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

/**
 * Hidden-by-default disclosure.
 *
 * Native <details>, not a `useState` toggle: it stays a Server Component, it
 * works with JavaScript disabled, and screen readers and keyboards get the
 * expand/collapse semantics for free. `open` is deliberately never set — the
 * value must be collapsed on first paint on every device.
 */
function Reveal({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xs border border-line bg-canvas-raised">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
        <span>
          {label}
          {hint ? <span className="mt-0.5 block text-xs font-normal text-muted">{hint}</span> : null}
        </span>
        <span
          aria-hidden="true"
          className="text-lg leading-none text-bronze transition-transform duration-200 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-line px-4 py-3 text-base text-ink">{children}</div>
    </details>
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

function Ul({ items }: { items: string[] }) {
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
