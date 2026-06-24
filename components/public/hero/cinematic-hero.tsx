import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  canPublish,
  disclosureFor,
  heroCopy,
  heroCta,
  heroMedia,
  toPublicDTO,
} from "@/lib/hero";
import { Arrow, Button, Container } from "@/components/public/ui";
import { CinematicHeroControls } from "@/components/public/hero/cinematic-hero-controls";

// Full-window cinematic hero (spec 29). Server Component:
// - resolves the media rights gate on the server (no gated URL leaks if not allowed);
// - renders the LCP poster (eager <picture>) + semantic copy + CTAs;
// - mounts the client controls island only when publication is allowed.
export function CinematicHero({ locale }: { locale: Locale }) {
  const copy = heroCopy[locale] ?? heroCopy.ro;
  if (!copy) return null;

  // SERVER-SIDE rights gate (spec 29 §16).
  const publish = canPublish(heroMedia);
  const disclosure = publish ? disclosureFor(heroMedia.rightsStatus) : null;
  const media = publish ? toPublicDTO(heroMedia) : null;

  return (
    <section
      id="cinematic-hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink lg:justify-center"
    >
      {/* LCP poster — eager, art-directed; only the matching source loads. */}
      <picture>
        {media ? <source media="(max-width: 767px)" srcSet={media.mobilePoster} /> : null}
        <img
          src={media ? media.desktopPoster : heroMedia.desktopPoster}
          alt=""
          fetchPriority="high"
          decoding="async"
          style={{ objectPosition: media?.desktopObjectPosition ?? "50% 50%" }}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      </picture>

      {media ? (
        <CinematicHeroControls
          media={media}
          copy={{ pause: copy.pause, play: copy.play }}
          locale={locale}
        />
      ) : null}

      {/* Scrim for legibility: vertical on mobile, horizontal on desktop. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/40 lg:bg-gradient-to-r lg:from-ink/85 lg:via-ink/35 lg:to-transparent"
      />

      <Container className="relative z-10 pb-24 pt-32 sm:pb-28 lg:py-40">
        <p className="kicker !text-bronze-light">{copy.eyebrow}</p>
        <h1 id="hero-title" className="mt-5 max-w-3xl text-4xl text-canvas sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-canvas/85 sm:text-lg">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={heroCta.primary} variant="bronze">
            {copy.primaryCta} <Arrow />
          </Button>
          <Button href={heroCta.secondary} variant="ghost-light">
            {copy.secondaryCta}
          </Button>
        </div>
        {disclosure ? <p className="mt-6 text-xs text-canvas/55">{disclosure}</p> : null}
      </Container>

      {/* Scroll hint — real, focusable link (also accessible). */}
      <Link
        href="#servicii"
        className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/70 transition-colors hover:text-canvas"
      >
        {copy.scrollHint}
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M8 3v9M4 8.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}
