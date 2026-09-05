import Image from "next/image";
import Link from "next/link";
import { photo } from "@/lib/landing-photos";
import { findLandingPage, type LandingPage } from "@/lib/landing";
import type { Locale } from "@/lib/i18n";
import { Arrow, Button, Container, Kicker, Section, SectionHeading } from "@/components/public/ui";
import { CallButton, ContactBand } from "@/components/public/cta";
import { LeadForm } from "@/components/public/lead-form";

/**
 * One topic page, rendered from `lib/landing.ts`.
 *
 * Server Component throughout — there is no interactivity here except the FAQ,
 * which uses native <details> so it works with JavaScript disabled and gets its
 * expand/collapse semantics from the browser.
 *
 * Section order is a conversion decision, not a layout one: proof (photographs
 * of the actual work) comes before the first ask, the first ask comes at the
 * halfway point rather than only at the bottom, and the form is on THIS page so
 * a convinced reader never has to navigate to convert.
 */
export function LandingSections({ page, locale }: { page: LandingPage; locale: Locale }) {
  const related = page.related
    .map((slug) => findLandingPage(slug))
    .filter((item): item is LandingPage => Boolean(item));

  return (
    <>
      <LandingHero page={page} locale={locale} />
      <Scope page={page} />
      <Gallery page={page} />
      <ContactBand
        locale={locale}
        title="Spune-ne ce ai de făcut"
        body="Un telefon de două minute sau câteva rânduri în formular sunt de ajuns ca să știm dacă și cum putem ajuta."
      />
      <Execution page={page} />
      <Pitfalls page={page} />
      {page.costFactors ? <CostFactors page={page} /> : null}
      <Faq page={page} />
      {related.length > 0 ? <Related items={related} locale={locale} /> : null}
      <LandingContact page={page} locale={locale} />
    </>
  );
}

/* --------------------------------------------------------------- Hero */
function LandingHero({ page, locale }: { page: LandingPage; locale: Locale }) {
  const lead = page.intro[0];
  return (
    <section className="relative overflow-hidden bg-ink text-canvas">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-36">
        <Breadcrumb locale={locale} current={page.h1} />
        <p className="kicker kicker--light mt-8">{page.kicker}</p>
        <h1 className="mt-4 max-w-3xl text-display-1 text-canvas">{page.h1}</h1>
        {lead ? <p className="mt-6 max-w-2xl text-lead text-canvas/85">{lead}</p> : null}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <CallButton variant="bronze" />
          <Button href="#contact" variant="ghost-light">
            Cere o estimare <Arrow />
          </Button>
        </div>
      </Container>
    </section>
  );
}

function Breadcrumb({ locale, current }: { locale: Locale; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-canvas/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href={`/${locale}`} className="transition-colors hover:text-canvas">
            Acasă
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={`/${locale}/servicii`} className="transition-colors hover:text-canvas">
            Servicii
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" className="text-canvas/85">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}

/* -------------------------------------------------- Intro + what it covers */
function Scope({ page }: { page: LandingPage }) {
  const rest = page.intro.slice(1);
  return (
    <Section tone="canvas" divide>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-5">
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="rounded-sm border border-line-strong bg-canvas-raised p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              Ce include lucrarea
            </p>
            <ul className="mt-5 space-y-3">
              {page.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 flex-none rounded-full bg-bronze"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------- Gallery */
function Gallery({ page }: { page: LandingPage }) {
  if (page.gallery.length === 0) return null;
  return (
    <Section tone="surface" divide>
      <Container>
        <SectionHeading
          kicker="Din lucrări executate"
          title="Fotografii de la fața locului"
          intro="Inclusiv etapele de proces — partea care spune ceva despre execuție, nu doar despre rezultat."
        />
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {page.gallery.map((key) => {
            const frame = photo(key);
            return (
              <li
                key={key}
                className="group relative overflow-hidden rounded-sm border border-line"
              >
                <figure className="relative aspect-[3/4]">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 50vw"
                    style={{ objectPosition: frame.focal ?? "50% 50%" }}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </figure>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------- Execution */
function Execution({ page }: { page: LandingPage }) {
  return (
    <Section tone="canvas" divide>
      <Container>
        <SectionHeading
          kicker="Cum executăm"
          title="Ordinea în care se face, și de ce contează"
          intro="Fiecare etapă închide definitiv o decizie. De aceea ordinea nu este o preferință."
        />
        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {page.steps.map((step, index) => (
            <li key={step.title} className="border-t border-line pt-5">
              <span className="font-display text-2xl font-semibold text-bronze-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-display-3 text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Pitfalls */
function Pitfalls({ page }: { page: LandingPage }) {
  return (
    <Section tone="ink" className="relative overflow-hidden">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionHeading
          kicker="De evitat"
          title="Greșelile care se plătesc mai târziu"
          intro="Toate se văd după ani, nu la predare. De aceea le scriem aici, unde le poți folosi și dacă lucrarea o face altcineva."
          tone="light"
        />
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {page.pitfalls.map((item) => (
            <div key={item.title} className="border-t border-canvas/15 pt-5">
              <h3 className="text-display-3 text-canvas">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------- Cost factors */
function CostFactors({ page }: { page: LandingPage }) {
  if (!page.costFactors) return null;
  return (
    <Section tone="surface" divide>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Kicker>Ce influențează costul</Kicker>
            <h2 className="mt-5 text-display-2 text-ink">
              Ce trebuie să știm ca să dăm un număr
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
              Nu publicăm un preț pe metru pătrat, pentru că un preț dat fără să fi văzut lucrarea
              se schimbă la prima vizită. Mai jos este exact ce cântărește, în ordinea impactului.
            </p>
            <p className="mt-4 text-xs text-muted">
              Estimarea nu este o ofertă contractuală (ADR-012).
            </p>
          </div>
          <ul className="rounded-sm border border-line-strong bg-canvas-raised p-6 sm:p-8">
            {page.costFactors.map((factor) => (
              <li
                key={factor}
                className="flex items-start gap-3 border-t border-line py-3 text-sm leading-relaxed text-ink-soft first:border-0 first:pt-0"
              >
                <span aria-hidden="true" className="font-display text-bronze-deep">
                  +
                </span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------------- FAQ */
function Faq({ page }: { page: LandingPage }) {
  if (page.faqs.length === 0) return null;
  return (
    <Section tone="canvas" divide>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker="Întrebări frecvente" title="Ce ne întreabă oamenii" />
        <div className="divide-y divide-line border-t border-line">
          {page.faqs.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-bronze transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------- Related */
function Related({ items, locale }: { items: LandingPage[]; locale: Locale }) {
  return (
    <Section tone="surface" divide>
      <Container>
        <SectionHeading kicker="Continuă" title="Lucrări legate de aceasta" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${locale}/servicii/${item.slug}`}
                className="group flex h-full flex-col justify-between rounded-sm border border-line bg-canvas-raised p-6 transition-colors hover:border-ink"
              >
                <span className="text-display-3 text-ink transition-colors group-hover:text-bronze-deep">
                  {item.h1}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bronze-deep">
                  Vezi pagina <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------- Contact */
// The conversion endpoint for THIS page. Same id as the homepage section, so
// every "#contact" on the site resolves without leaving the current route.
function LandingContact({ page, locale }: { page: LandingPage; locale: Locale }) {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-canvas">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />
      <Container className="relative py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Kicker tone="light">Contact</Kicker>
            <h2 className="mt-5 text-display-2 text-canvas">Cere o estimare</h2>
            <p className="mt-5 text-base leading-relaxed text-canvas/75">
              Scrie-ne câteva rânduri despre lucrare — {page.h1.toLowerCase()} sau orice altceva
              din aceeași zonă. Revenim cu pașii următori și cu ce ne trebuie ca să estimăm corect.
            </p>
            <div className="mt-8 border-t border-canvas/15 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-canvas/50">
                Sau direct la telefon
              </p>
              <div className="mt-3">
                <CallButton variant="ghost-light" />
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-canvas/15 bg-canvas/[0.04] p-6 sm:p-8">
            <LeadForm locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  );
}
