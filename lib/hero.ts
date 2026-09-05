// Full-window cinematic hero — config, rights gate and copy.
// See docs/specs/29-SCROLL-CINEMATIC-EXPERIENCE-REVISED-FULL-WINDOW-VIDEO.md.
// The rights gate is resolved on the SERVER (see cinematic-hero.tsx); only a
// sanitized public DTO is passed to the client island.

import type { Locale } from "@/lib/i18n";

export type RightsStatus = "OWNED" | "LICENSED" | "ORIGINAL_GENERATED" | "MOODBOARD_ONLY";

/** Motion layer. `null` while the owner has no landscape footage — see D-006. */
export interface HeroVideoConfig {
  desktopMp4: string;
  mobileMp4: string;
  durationSeconds: number;
}

/** One breakpoint, in both formats. AVIF is offered first. */
export interface HeroPoster {
  avif: string;
  webp: string;
}

export interface HeroMediaConfig {
  desktopPoster: HeroPoster;
  mobilePoster: HeroPoster;
  /** Describes the frame, per locale. The hero image is content, not decoration. */
  posterAlt: Record<Locale, string>;
  video: HeroVideoConfig | null;
  rightsStatus: RightsStatus;
  publicationAllowed: boolean;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
}

// Only fields safe to ship to the browser. No rightsStatus, no internal source.
export interface HeroMediaDTO {
  desktopPoster: HeroPoster;
  mobilePoster: HeroPoster;
  posterAlt: string;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
  video: { desktopMp4: string; mobileMp4: string } | null;
}

export interface HeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  pause: string;
  play: string;
  scrollHint: string;
}

// Disclosure is DERIVED from rightsStatus (spec 29 §16), never free-typed.
export function disclosureFor(status: RightsStatus): string | null {
  switch (status) {
    case "OWNED":
      return null; // real documented project — no disclosure needed
    case "LICENSED":
      return "Vizual demonstrativ";
    case "ORIGINAL_GENERATED":
      return "Concept vizual";
    case "MOODBOARD_ONLY":
      return null; // never published anyway
  }
}

// Server-side gate: may this media render in production at all?
export function canPublish(m: HeroMediaConfig): boolean {
  return m.publicationAllowed === true && m.rightsStatus !== "MOODBOARD_ONLY";
}

export function toPublicDTO(m: HeroMediaConfig, locale: Locale): HeroMediaDTO {
  return {
    desktopPoster: m.desktopPoster,
    mobilePoster: m.mobilePoster,
    posterAlt: m.posterAlt[locale],
    desktopObjectPosition: m.desktopObjectPosition ?? "50% 50%",
    mobileObjectPosition: m.mobileObjectPosition ?? "50% 50%",
    video: m.video ? { desktopMp4: m.video.desktopMp4, mobileMp4: m.video.mobileMp4 } : null,
  };
}

// Owner media. Stills from a documented project the owner executed and supplied
// (docs/poze -> public/media/hero via scripts/build-media.mjs), so rightsStatus is
// OWNED and disclosureFor() correctly renders no disclosure line.
//
// `video: null` is deliberate, not a TODO. The only clip the owner supplied is
// 480x848 — a 4x upscale to fill a desktop stage. Shipping a still beats shipping
// a blurred video, and beats keeping the AI-generated placeholder that was here.
// See docs/work/DECISIONS.md D-006; restoring motion needs a landscape shoot.
export const heroMedia: HeroMediaConfig = {
  // AVIF first: measured 72KB vs 108KB desktop, 88KB vs 116KB mobile, at 94%
  // detail retention. This is the LCP element and the only image on the
  // critical path, so it is the one place the format actually decides a metric.
  desktopPoster: {
    avif: "/media/hero/hero-cada-placata-desktop.avif",
    webp: "/media/hero/hero-cada-placata-desktop.webp",
  },
  mobilePoster: {
    avif: "/media/hero/hero-cada-placata-mobile.avif",
    webp: "/media/hero/hero-cada-placata-mobile.webp",
  },
  /**
   * Per locale. The hero image is CONTENT, not decoration, so its alt text is
   * read aloud and indexed — a Russian page describing its own main photograph
   * in Romanian is both an accessibility failure and a wasted image-search
   * signal. Total over Locale for the same reason heroCopy is.
   */
  posterAlt: {
    ro: "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
    ru: "Ванна в коробе, полностью облицованная плиткой под мрамор, с запилом углов под 45° и непрерывным рисунком по стене.",
  },
  video: null,
  rightsStatus: "OWNED",
  publicationAllowed: true,
  desktopObjectPosition: "50% 50%",
  mobileObjectPosition: "50% 50%",
};

// CTAs use existing in-page anchors (dedicated routes + service preselect are P1).
export const heroCta = { primary: "#contact", secondary: "#proiecte" } as const;

/**
 * NOT Partial. It used to be, with a `?? heroCopy.ro` fallback in the component,
 * and that combination did exactly what ADR-011 forbids: /ru rendered the whole
 * page in Russian and then the H1 — the single most important line on the site —
 * in Romanian. No type error, no warning, and invisible unless someone reads the
 * Russian page. A total Record makes a missing language a compile error.
 */
export const heroCopy: Record<Locale, HeroCopy> = {
  ro: {
    eyebrow: "Finisaje premium pentru spații care rămân",
    title: "Montaj gresie și faianță în Chișinău, executat cu precizie",
    description:
      "Transformăm băi și interioare complete prin pregătire corectă, aliniere atentă și finisaje curate, adaptate fiecărui proiect.",
    primaryCta: "Cere o estimare",
    secondaryCta: "Vezi proiectele",
    pause: "Oprește video",
    play: "Pornește video",
    scrollHint: "Descoperă serviciile",
  },
  ru: {
    eyebrow: "Премиальная отделка для помещений, которые остаются",
    // Carries the service AND the city, like the Romanian: it is the line that
    // has to work as a search result and as a first impression at the same time.
    title: "Укладка плитки в Кишинёве, выполненная точно",
    description:
      "Преображаем ванные и целые интерьеры: правильная подготовка основания, выверенное выравнивание и чистая отделка — под каждый объект.",
    primaryCta: "Получить оценку",
    secondaryCta: "Смотреть работы",
    pause: "Остановить видео",
    play: "Запустить видео",
    scrollHint: "Смотреть услуги",
  },
};
