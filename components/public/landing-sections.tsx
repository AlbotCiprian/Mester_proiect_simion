import Image from "next/image";
import Link from "next/link";
import { photo } from "@/lib/landing-photos";
import { findLandingPage, type LandingPage } from "@/lib/landing";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/ui-dict";
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
  const t = ui(locale);
  const related = page.related
    .map((slug) => findLandingPage(locale, slug))
    .filter((item): item is LandingPage => Boolean(item));

  return (
    <>
      <LandingHero page={page} locale={locale} />
      <Scope page={page} locale={locale} />
      <Gallery page={page} locale={locale} />
      <ContactBand locale={locale} title={t.landing.bandTitle} body={t.landing.bandBody} />
      <Execution page={page} locale={locale} />
      <Pitfalls page={page} locale={locale} />
      {page.costFactors ? <CostFactors page={page} locale={locale} /> : null}
      <Faq page={page} locale={locale} />
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
          <CallButton locale={locale} variant="bronze" />
          <Button href="#contact" variant="ghost-light">
            {ui(locale).cta.estimate} <Arrow />
          </Button>
        </div>
      </Container>
    </section>
  );
}

function Breadcrumb({ locale, current }: { locale: Locale; current: string }) {
  const t = ui(locale);
  return (
    <nav aria-label={t.nav.ariaBreadcrumb} className="text-xs text-canvas/60">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href={`/${locale}`} className="transition-colors hover:text-canvas">
            {t.nav.home}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={`/${locale}/servicii`} className="transition-colors hover:text-canvas">
            {t.nav.services}
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
function Scope({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
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
              {t.landing.scopeTitle}
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
function Gallery({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
  if (page.gallery.length === 0) return null;
  return (
    <Section tone="surface" divide>
      <Container>
        <SectionHeading
          kicker={t.landing.galleryKicker}
          title={t.landing.galleryTitle}
          intro={t.landing.galleryIntro}
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
function Execution({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
  return (
    <Section tone="canvas" divide>
      <Container>
        <SectionHeading
          kicker={t.landing.stepsKicker}
          title={t.landing.stepsTitle}
          intro={t.landing.stepsIntro}
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
function Pitfalls({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
  return (
    <Section tone="ink" className="relative overflow-hidden">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionHeading
          kicker={t.landing.pitfallsKicker}
          title={t.landing.pitfallsTitle}
          intro={t.landing.pitfallsIntro}
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
function CostFactors({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
  if (!page.costFactors) return null;
  return (
    <Section tone="surface" divide>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Kicker>{t.landing.costKicker}</Kicker>
            <h2 className="mt-5 text-display-2 text-ink">{t.landing.costTitle}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
              {t.landing.costIntro}
            </p>
            <p className="mt-4 text-xs text-muted">{t.landing.costNote}</p>
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
function Faq({ page, locale }: { page: LandingPage; locale: Locale }) {
  const t = ui(locale);
  if (page.faqs.length === 0) return null;
  return (
    <Section tone="canvas" divide>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker={t.landing.faqKicker} title={t.landing.faqTitle} />
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
  const t = ui(locale);
  return (
    <Section tone="surface" divide>
      <Container>
        <SectionHeading kicker={t.landing.relatedKicker} title={t.landing.relatedTitle} />
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
                  {t.cta.openPage} <Arrow />
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
  const t = ui(locale);
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-canvas">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />
      <Container className="relative py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Kicker tone="light">{t.nav.contact}</Kicker>
            <h2 className="mt-5 text-display-2 text-canvas">{t.landing.contactTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-canvas/75">
              {t.landing.contactIntro(page.h1.toLowerCase())}
            </p>
            <div className="mt-8 border-t border-canvas/15 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-canvas/50">
                {t.cta.orByPhone}
              </p>
              <div className="mt-3">
                <CallButton locale={locale} variant="ghost-light" />
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
