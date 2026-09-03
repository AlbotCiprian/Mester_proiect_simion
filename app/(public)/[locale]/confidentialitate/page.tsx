import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, publishedLocales } from "@/lib/i18n";
import { canonicalFor, robotsMeta } from "@/lib/seo";
import { phone, site } from "@/lib/content";
import { Container, Kicker } from "@/components/public/ui";

/**
 * Required before a single phone number is collected: a consent checkbox cannot
 * discharge the information duty on its own.
 *
 * Controller identity (legal entity, registered address) is GATED, not
 * placeholder — an invented entity name in a privacy notice is worse than an
 * acknowledged gap. It renders as soon as checklist A4 is answered.
 */

const LEGAL_ENTITY: string | null = null; // CONFIRM_OWNER — checklist A4
const CONTACT_EMAIL: string | null = null; // CONFIRM_OWNER — checklist E4

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
      "Ce date colectăm prin formularul de contact, în ce scop, cine le procesează și cât timp le păstrăm.",
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
          le mai vede și cât timp le păstrăm.
        </p>

        <Section title="Cine prelucrează datele">
          {LEGAL_ENTITY ? (
            <P>
              Operatorul datelor este {LEGAL_ENTITY}. Ne poți contacta la{" "}
              <A href={`tel:${phone.e164}`}>{phone.display}</A>
              {CONTACT_EMAIL ? (
                <>
                  {" "}
                  sau la <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>
                </>
              ) : null}
              .
            </P>
          ) : (
            <P>
              Datele de identificare completă ale operatorului ({site.name}) urmează să fie
              publicate aici. Până atunci, pentru orice întrebare legată de datele tale ne poți suna
              la <A href={`tel:${phone.e164}`}>{phone.display}</A>.
            </P>
          )}
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
            Nu îți cerem adresa exactă, buletinul sau date de plată și nu folosim cookie-uri de
            urmărire. Serverul care găzduiește site-ul înregistrează, ca orice server web, adresa IP
            a cererii; o folosim doar ca să limităm trimiterile automate și nu o stocăm alături de
            datele tale.
          </P>
        </Section>

        <Section title="De ce le folosim">
          <P>
            Ca să răspundem la cererea ta: să te sunăm, să clarificăm lucrarea și să îți dăm un
            interval de preț. Temeiul este pregătirea unui eventual contract, la cererea ta. Nu
            trimitem newslettere, nu facem marketing și nu vindem datele nimănui.
          </P>
        </Section>

        <Section title="Cine le mai vede">
          <P>
            Cererea îți ajunge la noi pe e-mail. Pentru asta folosim doi furnizori, care
            procesează datele strict în numele nostru:
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

        <Section title="Cât timp le păstrăm">
          <P>
            Păstrăm cererea cât timp discutăm despre lucrare și, dacă lucrarea se face, pe durata
            garanției. Dacă nu ajungem la o colaborare, ștergem mesajul din cutia poștală în cel
            mult 12 luni.
          </P>
        </Section>

        <Section title="Drepturile tale">
          <P>
            Poți cere oricând să afli ce date avem despre tine, să le corectăm sau să le ștergem, și
            te poți opune folosirii lor. Ne suni la <A href={`tel:${phone.e164}`}>{phone.display}</A>{" "}
            și rezolvăm. Dacă nu ești mulțumit de răspuns, te poți adresa Centrului Național pentru
            Protecția Datelor cu Caracter Personal al Republicii Moldova.
          </P>
        </Section>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          <Link className="underline underline-offset-4 hover:text-ink" href={`/${locale}#contact`}>
            Înapoi la formularul de contact
          </Link>
        </p>
      </Container>
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
