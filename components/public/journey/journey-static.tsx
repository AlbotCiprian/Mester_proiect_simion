import Image from "next/image";
import { getBaieChapter, tour, type JourneyStill } from "@/lib/journey";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/lib/ui-dict";
import { Arrow, Button, Container, Kicker } from "@/components/public/ui";

// Always server-rendered. This is the accessible / no-JS / reduced-motion /
// SEO baseline. The client enhancer (ScrollJourney) hides it via CSS when it
// activates the cinematic experience. See spec 29 §5 (tiers D/E) and §9.
//
// Since the chapter no longer ships a frame sequence (lib/journey.ts, D-006),
// this block is what most visitors actually see, so it carries the full stage
// story rather than a single representative frame.
export function JourneyStatic({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const baie = getBaieChapter(locale);
  const { price, media } = baie;
  const middle = media.stages.slice(1, -1);

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
            <div className="grid grid-cols-2 gap-3">
              <StageFrame still={media.before} label={t.home.before} tone="ink" ratio="aspect-[3/4]" />
              <StageFrame still={media.after} label={t.home.after} tone="bronze" ratio="aspect-[3/4]" />
            </div>

            {/* Middle stages. Labels sit UNDER the frame: at three-across on a
                phone the tile is ~110px and an overlaid badge covers the photo. */}
            <ol className="mt-3 grid grid-cols-3 gap-3">
              {middle.map((still, i) => (
                <li key={still.src}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
                    <Image
                      src={still.src}
                      alt={still.alt}
                      fill
                      sizes="(min-width:1024px) 16vw, 30vw"
                      style={{ objectPosition: still.focal ?? "50% 50%" }}
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-muted">
                    <span className="font-display text-bronze-deep">0{i + 2}</span> {still.label}
                  </p>
                </li>
              ))}
            </ol>

            <figcaption className="mt-3 text-xs text-muted">{baie.attribution}</figcaption>
          </figure>

          <aside className="rounded-sm border border-line-strong bg-canvas-raised p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze-deep">{t.journey.priceKicker}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">
              {price.from === null ? t.journey.priceOnRequest : `${price.from} ${price.unit ?? ""}`}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t.journey.includes}: {price.includes.join(", ")}.
            </p>
            <p className="mt-1 text-xs text-muted">{t.journey.finalNote}</p>

            <div className="mt-6 border-t border-line pt-5">
              <Button href={baie.cta.href} variant="bronze" className="w-full">
                {baie.cta.label} <Arrow />
              </Button>
            </div>
          </aside>
        </div>

        {/* Owner footage of a DIFFERENT finished bathroom — labelled as such so it is
            never read as a stage of the renovation documented above. Portrait and
            user-initiated: no autoplay, nothing preloaded but the poster. */}
        <figure className="mt-8 grid items-center gap-6 rounded-sm border border-line-strong bg-canvas-raised p-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:p-6">
          {/* width/height reserve the box so the poster cannot shift the layout.
              The export carries no audio track, so no captions track is required. */}
          <video
            className="h-auto w-full rounded-sm border border-line bg-ink"
            src={tour.src}
            poster={tour.poster}
            width={tour.width}
            height={tour.height}
            aria-label={tour.caption[locale]}
            controls
            muted
            loop
            playsInline
            preload="none"
          />
          {/* figcaption must be a direct child of figure — hence the spans. */}
          <figcaption>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-bronze-deep">
              {tour.label[locale]}
            </span>
            <span className="mt-2 block max-w-md text-sm text-ink-soft">{tour.caption[locale]}</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

function StageFrame({
  still,
  label,
  tone,
  ratio,
}: {
  still: JourneyStill;
  label: string;
  tone: "ink" | "bronze";
  ratio: string;
}) {
  return (
    <figure className={`relative ${ratio} overflow-hidden rounded-sm border border-line`}>
      <Image
        src={still.src}
        alt={still.alt}
        fill
        sizes="(min-width:1024px) 24vw, 46vw"
        style={{ objectPosition: still.focal ?? "50% 50%" }}
        className="object-cover"
      />
      <figcaption
        className={`absolute left-2 top-2 rounded-xs px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wide ${
          tone === "bronze" ? "bg-bronze text-canvas-raised" : "bg-ink/75 text-canvas"
        }`}
      >
        {label}
      </figcaption>
    </figure>
  );
}
