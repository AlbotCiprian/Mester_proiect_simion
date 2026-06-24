// Full-window cinematic hero — config, rights gate and copy.
// See docs/specs/29-SCROLL-CINEMATIC-EXPERIENCE-REVISED-FULL-WINDOW-VIDEO.md.
// The rights gate is resolved on the SERVER (see cinematic-hero.tsx); only a
// sanitized public DTO is passed to the client island.

import type { Locale } from "@/lib/i18n";

export type RightsStatus = "OWNED" | "LICENSED" | "ORIGINAL_GENERATED" | "MOODBOARD_ONLY";

export interface HeroMediaConfig {
  desktopMp4: string;
  mobileMp4: string;
  desktopPoster: string;
  mobilePoster: string;
  durationSeconds: number;
  rightsStatus: RightsStatus;
  publicationAllowed: boolean;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
}

// Only fields safe to ship to the browser. No rightsStatus, no internal source.
export interface HeroMediaDTO {
  desktopMp4: string;
  mobileMp4: string;
  desktopPoster: string;
  mobilePoster: string;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
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
    desktopMp4: m.desktopMp4,
    mobileMp4: m.mobileMp4,
    desktopPoster: m.desktopPoster,
    mobilePoster: m.mobilePoster,
    desktopObjectPosition: m.desktopObjectPosition ?? "50% 50%",
    mobileObjectPosition: m.mobileObjectPosition ?? "50% 50%",
  };
}

// Owner-provided prototype video (AI-generated concept interior).
// rightsStatus ORIGINAL_GENERATED -> shows "Concept vizual" disclosure.
// publicationAllowed=true: owner explicitly authorized this asset for the prototype
// (build is noindex; replace with owner footage + Vercel Blob at P1, see spec §6/§19).
export const heroMedia: HeroMediaConfig = {
  desktopMp4: "/media/hero/hero-finisaje-premium-desktop.mp4",
  mobileMp4: "/media/hero/hero-finisaje-premium-mobile.mp4",
  desktopPoster: "/media/hero/hero-finisaje-premium-desktop-poster.webp",
  mobilePoster: "/media/hero/hero-finisaje-premium-mobile-poster.webp",
  durationSeconds: 10,
  rightsStatus: "ORIGINAL_GENERATED",
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
