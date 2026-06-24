import Image from "next/image";
import {
  estimator,
  faqs,
  flagship,
  portfolio,
  precisionPoints,
  processSteps,
  reviews,
  services,
  trustFacts,
  channels,
} from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Arrow, Button, Container, Kicker, Section, SectionHeading } from "@/components/public/ui";
import { Journey } from "@/components/public/journey/journey";
import { CinematicHero } from "@/components/public/hero/cinematic-hero";

/* -------------------------------------------------------- Trust strip */
function TrustStrip() {
  return (
    <section className="joint-rule bg-canvas-raised">
      <Container className="py-10">
        <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {trustFacts.map((f) => (
            <li key={f.label} className="sm:px-6">
              <p className="font-display text-3xl font-semibold text-ink sm:text-4xl">{f.value}</p>
              <p className="mt-1 text-sm text-muted">{f.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-bronze-deep">Cifre demonstrative — de confirmat și dovedit (CONFIRM_OWNER).</p>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------- Services */
function Services() {
  return (
    <Section id="servicii" tone="canvas" divide>
      <Container>
        <SectionHeading
          kicker="Ce executăm"
          title="Servicii de placare și renovare"
          intro="Lucrăm pe câteva direcții clare, fiecare cu standardul ei de pregătire, montaj și verificare."
        />
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {services.map((s, i) => (
            <article key={s.slug} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width:640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-sm text-bronze-deep">0{i + 1}</span>
                <h3 className="text-xl text-ink">{s.title}</h3>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>
              <ul className="mt-4 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bronze" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------- Flagship */
function Flagship() {
  return (
    <Section id="despre" tone="surface" divide>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line-strong">
              <Image
                src={flagship.image}
                alt={flagship.imageAlt}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div>
            <Kicker>{flagship.kicker}</Kicker>
            <h2 className="mt-5 text-3xl text-ink sm:text-4xl">{flagship.title}</h2>
            <p className="mt-2 text-sm text-muted">{flagship.location}</p>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">{flagship.summary}</p>

            <dl className="mt-7 space-y-4 border-l border-line-strong pl-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-bronze-deep">Provocare</dt>
                <dd className="mt-1 text-sm text-ink-soft">{flagship.challenge}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-bronze-deep">Abordare</dt>
                <dd className="mt-1 text-sm text-ink-soft">{flagship.approach}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-bronze-deep">Rezultat</dt>
                <dd className="mt-1 text-sm text-ink-soft">{flagship.result}</dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {flagship.metrics.map((m) => (
                <li key={m.label}>
                  <p className="font-display text-2xl font-semibold text-ink">{m.value}</p>
                  <p className="text-xs text-muted">{m.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------- Precision proof */
function PrecisionProof() {
  return (
    <Section tone="ink" className="relative overflow-hidden">
      <div className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading
          kicker="Standardul nostru"
          title="Precizia se vede în detalii"
          intro="Diferența dintre o lucrare bună și una premium stă în pregătire, aliniere și racorduri."
          tone="light"
        />
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {precisionPoints.map((p, i) => (
            <div key={p.title} className="border-t border-canvas/15 pt-5">
              <span className="font-display text-sm text-bronze-light">0{i + 1}</span>
              <h3 className="mt-2 text-xl text-canvas">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-canvas/70">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Process */
function Process() {
  return (
    <Section id="proces" tone="canvas" divide>
      <Container>
        <SectionHeading
          kicker="Cum lucrăm"
          title="Un proces predictibil, de la cerere la garanție"
          intro="Știi în fiecare etapă ce urmează, ce decizi și ce livrăm."
        />
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step) => (
            <li key={step.index} className="border-t border-line pt-5">
              <span className="font-display text-2xl font-semibold text-bronze-deep">{step.index}</span>
              <h3 className="mt-2 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------- Estimator teaser */
function EstimatorTeaser() {
  return (
    <Section id="preturi" tone="surface" divide>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Kicker>{estimator.kicker}</Kicker>
            <h2 className="mt-5 text-3xl text-ink sm:text-4xl">{estimator.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">{estimator.body}</p>
            <div className="mt-8">
              <Button href={estimator.cta.href} variant="primary">
                {estimator.cta.label} <Arrow />
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">{estimator.note}</p>
          </div>

          <ul className="rounded-sm border border-line-strong bg-canvas-raised p-6 sm:p-8">
            <li className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-bronze-deep">
              Factori de cost
            </li>
            {estimator.factors.map((f) => (
              <li key={f} className="flex items-center gap-3 border-t border-line py-3 text-sm text-ink-soft first:border-0">
                <span className="font-display text-bronze-deep">+</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------- Portfolio */
function Portfolio() {
  return (
    <Section id="proiecte" tone="canvas" divide>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading kicker="Portofoliu" title="Lucrări selectate" />
          <Button href="#contact" variant="secondary">
            Cere un proiect similar
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {portfolio.map((p) => (
            <article key={p.slug} className="group relative overflow-hidden rounded-sm border border-line">
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(min-width:640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <p className="text-xs uppercase tracking-wide text-canvas/70">{p.type}</p>
                  <p className="font-display text-xl text-canvas">{p.title}</p>
                  <p className="text-xs text-canvas/70">{p.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ Reviews */
function Reviews() {
  return (
    <Section tone="surface" divide>
      <Container>
        <SectionHeading
          kicker="Recenzii"
          title="Ce spun clienții"
          intro="Publicăm recenzii doar cu sursă și consimțământ — fără texte inventate."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((r, i) => (
            <figure key={i} className="rounded-sm border border-line-strong bg-canvas-raised p-7">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-bronze" fill="currentColor" aria-hidden="true">
                <path d="M9 7H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4Zm10 0h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4Z" />
              </svg>
              <blockquote className="mt-4 text-lg leading-relaxed text-ink">“{r.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-ink">{r.author}</span>
                <span className="block text-muted">{r.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------------- FAQ */
function Faq() {
  return (
    <Section tone="canvas" divide>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker="Întrebări frecvente" title="Răspunsuri la ce ne întreabă clienții" />
        <div className="divide-y divide-line border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink">
                {f.q}
                <span className="text-bronze transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------------- Final CTA */
function FinalCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-canvas">
      <div className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true" />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <Kicker>Contact</Kicker>
          <h2 className="mt-5 text-3xl text-canvas sm:text-4xl lg:text-5xl">
            Spune-ne despre spațiul tău. Primești un interval și pașii următori.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-canvas/75">
            Trimite câteva fotografii și detaliile lucrării. Datele de contact reale se confirmă cu
            proprietarul <span className="text-bronze-light">(CONFIRM_OWNER)</span>.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#contact" variant="bronze">
            Trimite cererea <Arrow />
          </Button>
          {channels
            .filter((c) => c.type === "phone" || c.type === "telegram")
            .map((c) => (
              <Button key={c.type} href={c.href} variant="ghost-light">
                {c.type === "phone" ? c.label : "Scrie pe Telegram"}
              </Button>
            ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeSections({ locale }: { locale: Locale }) {
  return (
    <>
      <CinematicHero locale={locale} />
      <TrustStrip />
      <Services />
      <Flagship />
      <Journey />
      <PrecisionProof />
      <Process />
      <EstimatorTeaser />
      <Portfolio />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
