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

export interface HeroMediaConfig {
  desktopPoster: string;
  mobilePoster: string;
  /** Describes the frame. The hero image is content, not decoration. */
  posterAlt: string;
  video: HeroVideoConfig | null;
  rightsStatus: RightsStatus;
  publicationAllowed: boolean;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
}

// Only fields safe to ship to the browser. No rightsStatus, no internal source.
export interface HeroMediaDTO {
  desktopPoster: string;
  mobilePoster: string;
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

export function toPublicDTO(m: HeroMediaConfig): HeroMediaDTO {
  return {
    desktopPoster: m.desktopPoster,
    mobilePoster: m.mobilePoster,
    posterAlt: m.posterAlt,
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
  desktopPoster: "/media/hero/hero-cada-placata-desktop.webp",
  mobilePoster: "/media/hero/hero-cada-placata-mobile.webp",
  posterAlt:
    "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
  video: null,
  rightsStatus: "OWNED",
  publicationAllowed: true,
  desktopObjectPosition: "50% 50%",
  mobileObjectPosition: "50% 50%",
};

// CTAs use existing in-page anchors (dedicated routes + service preselect are P1).
export const heroCta = { primary: "#contact", secondary: "#proiecte" } as const;

// RO only in P0. RU stays CONFIRM_OWNER until publishedLocales includes "ru".
export const heroCopy: Partial<Record<Locale, HeroCopy>> = {
  ro: {
    eyebrow: "Finisaje premium pentru spații care rămân",
    title: "Teracotă și placări executate cu precizie",
    description:
      "Transformăm băi și interioare complete prin pregătire corectă, aliniere atentă și finisaje curate, adaptate fiecărui proiect.",
    primaryCta: "Cere o estimare",
    secondaryCta: "Vezi proiectele",
    pause: "Oprește video",
    play: "Pornește video",
    scrollHint: "Descoperă serviciile",
  },
};
