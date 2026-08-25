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

/** One documented stage of the same room, in execution order. */
export interface JourneyStill {
  label: string;
  src: string;
  alt: string;
  focal?: string;
}

/**
 * Frame-scrub sequence. `null` means the chapter cannot serve the scrub tier and
 * the client enhancer must fall back — it is a capability of the MEDIA, not of
 * the device. The Pexels sequence that used to live here was placeholder footage
 * and has been deleted; regenerating it needs a landscape shoot (D-006).
 */
export interface JourneyScrub {
  count: number;
  dirDesktop: string;
  dirMobile: string;
  ext: string;
}

export interface JourneyMedia {
  poster: string;
  posterAlt: string;
  before: JourneyStill;
  after: JourneyStill;
  stages: JourneyStill[];
  /** Portrait clip for the immersive tier. `null` disables that tier. */
  loop: { src: string; poster: string } | null;
  scrub: JourneyScrub | null;
}

export interface JourneyChapter {
  id: string;
  room: string;
  kicker: string;
  title: string;
  intro: string;
  stages: string[]; // narrative stages mapped across scroll progress
  media: JourneyMedia;
  service: { label: string; slug: string };
  price: JourneyPrice;
  metrics: { value: string; label: string; confirm: ConfirmFlag }[];
  cta: { label: string; href: string };
  attribution: string;
}

/**
 * A separate finished project, filmed by the owner. Kept apart from the chapter
 * above on purpose: it is a different bathroom, so it must not be presented as a
 * stage of the renovation the chapter documents.
 */
export const tour = {
  src: "/media/tur/tur-baie-finisata.mp4",
  poster: "/media/tur/tur-baie-finisata-poster.webp",
  width: 480,
  height: 848,
  label: "Tur filmat · alt proiect finalizat",
  caption:
    "Filmare a proprietarului dintr-o altă baie finalizată: pereți placați cu plăci aspect travertin și cuvă de duș zidită și placată, cu rigolă liniară.",
};

// Etapele de mai jos sunt fotografii ale ACELEIAȘI băi, în ordinea execuției
// (public/images/proiecte/baie-marmura-gri). Nu se amestecă proiecte.
const baieStages: JourneyStill[] = [
  {
    label: "Demolare și degajare",
    src: "/images/proiecte/baie-marmura-gri/01-inainte-demolare.jpg",
    alt: "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată.",
    focal: "50% 40%",
  },
  {
    label: "Suport pregătit",
    src: "/images/proiecte/baie-marmura-gri/03-inainte-suport-pregatit.jpg",
    alt: "Pereți de baie curățați până la suport, cu urme de adeziv pieptănat și zone de mortar reparate înainte de placare.",
    focal: "50% 45%",
  },
  {
    label: "Instalații și nișe tehnice",
    src: "/images/proiecte/baie-marmura-gri/04-proces-nisa-tehnica.jpg",
    alt: "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă.",
    focal: "50% 35%",
  },
  {
    label: "Placare cu nivelare",
    src: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg",
    alt: "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    focal: "50% 50%",
  },
  {
    label: "Rost finisat și montaj",
    src: "/images/proiecte/baie-marmura-gri/09-dupa-ansamblu.jpg",
    alt: "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare.",
    focal: "50% 50%",
  },
];

export const baie: JourneyChapter = {
  id: "baie",
  room: "Baie",
  kicker: "Parcursul renovării · Camera 1",
  title: "Cum prinde viață o baie placată",
  intro:
    "Etapele reale ale unei băi renovate de noi — de la demolare până la rostul finisat. Toate fotografiile sunt din aceeași încăpere.",
  stages: baieStages.map((s) => s.label),
  media: {
    poster: "/images/proiecte/baie-marmura-gri/07-proces-rosturi-si-polita.jpg",
    posterAlt:
      "Detaliu de execuție: rost continuu între plăci, poliță placată și nișă de vizitare pentru apometru.",
    before: baieStages[0]!,
    after: baieStages[baieStages.length - 1]!,
    stages: baieStages,
    // Owner has no portrait footage of THIS room; `tour` above is another project.
    loop: null,
    // No landscape footage exists — the scrub tier stays retired (D-006).
    scrub: null,
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
  attribution:
    "Fotografii din lucrările proprii, la fața locului. Locația, suprafața și data rămân de confirmat (CONFIRM_OWNER).",
};
