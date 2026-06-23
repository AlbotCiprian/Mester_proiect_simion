import Image from "next/image";
import { baie } from "@/lib/journey";
import { Arrow, Button, Container, Kicker } from "@/components/public/ui";

// Always server-rendered. This is the accessible / no-JS / reduced-motion /
// SEO baseline. The client enhancer (ScrollJourney) hides it via CSS when it
// activates the cinematic experience. See spec 29 §5 (tiers D/E) and §9.
export function JourneyStatic() {
  const { price } = baie;
  return (
    <section className="journey-static joint-rule bg-surface py-20 sm:py-28" aria-labelledby="journey-static-title">
      <Container>
        <Kicker>{baie.kicker}</Kicker>
        <h2 id="journey-static-title" className="mt-5 max-w-2xl text-3xl text-ink sm:text-4xl">
          {baie.title}
        </h2>
        <p className="mt-4 max-w-xl text-muted">{baie.intro}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <figure className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong">
              <Image
                src={baie.frames.poster}
                alt="Baie placată — cadru reprezentativ (demonstrativ, open-source)"
                fill
                sizes="(min-width:1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-muted">{baie.attribution}</figcaption>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <BeforeAfter src={baie.frames.firstFrame} label="Înainte" />
              <BeforeAfter src={baie.frames.lastFrame} label="După" />
            </div>
          </figure>

          <aside className="rounded-sm border border-line-strong bg-canvas-raised p-6 sm:p-7">
            <ol className="space-y-2.5">
              {baie.stages.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="font-display text-bronze-deep">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze-deep">Preț orientativ</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {price.from === null ? "La cerere" : `de la ${price.from} ${price.unit}`}{" "}
                <span className="align-middle text-xs font-normal text-muted">(CONFIRM_OWNER)</span>
              </p>
              <p className="mt-1 text-xs text-muted">Include: {price.includes.join(", ")}.</p>
              <p className="mt-1 text-xs text-muted">Evaluarea finală depinde de suprafață și condiții.</p>
            </div>

            <div className="mt-6">
              <Button href={baie.cta.href} variant="bronze" className="w-full">
                {baie.cta.label} <Arrow />
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function BeforeAfter({ src, label }: { src: string; label: string }) {
  return (
    <figure className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
      <Image src={src} alt={`${label} (demonstrativ)`} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
      <figcaption className="absolute left-2 top-2 rounded-xs bg-ink/75 px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide text-canvas">
        {label}
      </figcaption>
    </figure>
  );
}
