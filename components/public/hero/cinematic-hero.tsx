import Link from "next/link";
import type { CSSProperties } from "react";
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
import { CallButton } from "@/components/public/cta";
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
      {/* LCP poster — eager, art-directed; only the matching source loads.
          Nothing is emitted when the rights gate is closed: the previous version
          fell back to heroMedia.desktopPoster, which leaked the gated URL. */}
      {media ? (
        // Order matters: the first matching <source> wins, so the mobile pair
        // must precede the desktop pair, and AVIF must precede WebP within each.
        // `decoding` is deliberately NOT "async" — this is the LCP element and
        // async permits the browser to defer the decode past first paint.
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet={media.mobilePoster.avif} />
          <source media="(max-width: 767px)" type="image/webp" srcSet={media.mobilePoster.webp} />
          <source type="image/avif" srcSet={media.desktopPoster.avif} />
          <source type="image/webp" srcSet={media.desktopPoster.webp} />
          <img
            src={media.desktopPoster.webp}
            alt={media.posterAlt}
            fetchPriority="high"
            style={
              {
                "--hero-pos-desktop": media.desktopObjectPosition,
                "--hero-pos-mobile": media.mobileObjectPosition,
              } as CSSProperties
            }
            className="hero-poster absolute inset-0 -z-20 h-full w-full object-cover"
          />
        </picture>
      ) : null}

      {media?.video ? (
        <CinematicHeroControls
          media={media}
          copy={{ pause: copy.pause, play: copy.play }}
          locale={locale}
        />
      ) : null}

      {/* Scrim for legibility: vertical on mobile, horizontal on desktop. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/50 lg:bg-gradient-to-r lg:from-ink/90 lg:via-ink/55 lg:to-ink/15"
      />

      <Container className="relative z-10 pb-24 pt-32 sm:pb-28 lg:py-40">
        <p className="kicker !text-bronze-light">{copy.eyebrow}</p>
        <h1 id="hero-title" className="mt-5 max-w-3xl text-display-1 text-canvas">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-xl text-lead text-canvas/90">
          {copy.description}
        </p>
        {/* Two ways to convert, side by side, above the fold. The phone was
            previously reachable only from the sticky bar on mobile and from the
            footer on desktop — for a trade hired by phone, that is the wrong
            place for it. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={heroCta.primary} variant="bronze">
            {copy.primaryCta} <Arrow />
          </Button>
          <CallButton locale={locale} variant="ghost-light" />
          <Button href={heroCta.secondary} variant="ghost-light" className="hidden sm:inline-flex">
            {copy.secondaryCta}
          </Button>
        </div>
        {disclosure ? <p className="mt-6 text-xs text-canvas/55">{disclosure}</p> : null}
      </Container>

      {/* Scroll hint — real, focusable link (also accessible). */}
      <Link
        href="#servicii"
        className="absolute inset-x-0 bottom-20 z-10 mx-auto flex w-fit items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/80 transition-colors hover:text-canvas lg:bottom-3"
      >
        {copy.scrollHint}
        <svg viewBox="0 0 16 16" className="scroll-hint-bob h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M8 3v9M4 8.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </section>
  );
}
