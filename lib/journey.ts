// Data contract for the scroll-cinematic "Parcursul Renovării".
// See docs/specs/29-SCROLL-CINEMATIC-EXPERIENCE.md.
// P0 = a single chapter (Baie). All business values are CONFIRM_OWNER.

import { CONFIRM, type ConfirmFlag } from "@/lib/content";

export interface JourneyPrice {
  from: number | null; // CONFIRM_OWNER — no invented price
  unit: string | null;
  includes: string[];
  factors: string[];
  confirm: ConfirmFlag;
}

export interface JourneyChapter {
  id: string;
  room: string;
  kicker: string;
  title: string;
  intro: string;
  stages: string[]; // narrative stages mapped across scroll progress
  frames: {
    count: number;
    dirDesktop: string; // landscape set
    dirMobile: string; // portrait set
    ext: string;
    poster: string;
    firstFrame: string;
    lastFrame: string;
    loop: string; // short muted loop for touch/low-memory tier
  };
  service: { label: string; slug: string };
  price: JourneyPrice;
  metrics: { value: string; label: string; confirm: ConfirmFlag }[];
  cta: { label: string; href: string };
  attribution: string;
}

export const baie: JourneyChapter = {
  id: "baie",
  room: "Baie",
  kicker: "Parcursul renovării · Camera 1",
  title: "Cum prinde viață o baie placată",
  intro:
    "Derulează și vezi etapele reale ale unei placări de baie — de la pregătirea suportului până la rostul finisat.",
  stages: ["Pregătirea suportului", "Hidroizolație", "Montajul plăcilor", "Rost finisat"],
  frames: {
    count: 60,
    dirDesktop: "/sequences/baie/1280",
    dirMobile: "/sequences/baie/828",
    ext: "webp",
    poster: "/sequences/baie/poster.webp",
    firstFrame: "/sequences/baie/1280/frame-0001.webp",
    lastFrame: "/sequences/baie/1280/frame-0060.webp",
    loop: "/sequences/baie/loop.mp4",
  },
  service: { label: "Renovări de baie la cheie", slug: "renovari-bai" },
  price: {
    from: null, // CONFIRM_OWNER
    unit: "lei/m²",
    includes: ["pregătirea suportului", "hidroizolație", "montaj", "rost finisat"],
    factors: ["suprafața", "formatul plăcii", "starea suportului", "instalații"],
    confirm: CONFIRM,
  },
  metrics: [
    { value: "—", label: "m² placați", confirm: CONFIRM },
    { value: "—", label: "zile execuție", confirm: CONFIRM },
  ],
  cta: { label: "Cere estimare pentru baie", href: "#contact" },
  attribution: "Filmare demonstrativă open-source (Pexels) — înlocuită cu lucrări reale la lansare.",
};
