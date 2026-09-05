// Data contract for the scroll-cinematic "Parcursul Renovării".
// See docs/specs/29-SCROLL-CINEMATIC-EXPERIENCE.md.
// P0 = a single chapter (Baie). All business values are CONFIRM_OWNER.

import { CONFIRM, type ConfirmFlag } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

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
  label: {
    ro: "Tur filmat · alt proiect finalizat",
    ru: "Видеотур · другой завершённый объект",
  } as Record<Locale, string>,
  caption: {
    ro: "Filmare a proprietarului dintr-o altă baie finalizată: pereți placați cu plăci aspect travertin și cuvă de duș zidită și placată, cu rigolă liniară.",
    ru: "Съёмка владельца в другой готовой ванной: стены облицованы плиткой под травертин, поддон душа выложен и облицован, с линейным трапом.",
  } as Record<Locale, string>,
};

// The stages below are photographs of the SAME bathroom, in execution order
// (public/images/proiecte/baie-marmura-gri). Projects are never mixed.
//
// Paths and focal points are declared once; the label and the alt text are
// per-locale. This module used to be plain Romanian strings and rendered as a
// wholly Romanian section on /ru — the type system could not catch it because
// nothing here was keyed by Locale. Now it is.
const stageBase = [
  { src: "/images/proiecte/baie-marmura-gri/01-inainte-demolare.jpg", focal: "50% 40%" },
  { src: "/images/proiecte/baie-marmura-gri/03-inainte-suport-pregatit.jpg", focal: "50% 45%" },
  { src: "/images/proiecte/baie-marmura-gri/04-proces-nisa-tehnica.jpg", focal: "50% 35%" },
  { src: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg", focal: "50% 50%" },
  { src: "/images/proiecte/baie-marmura-gri/09-dupa-ansamblu.jpg", focal: "50% 50%" },
] as const;

const stageText: Record<Locale, Array<{ label: string; alt: string }>> = {
  ro: [
    {
      label: "Demolare și degajare",
      alt: "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată.",
    },
    {
      label: "Suport pregătit",
      alt: "Pereți de baie curățați până la suport, cu urme de adeziv pieptănat și zone de mortar reparate înainte de placare.",
    },
    {
      label: "Instalații și nișe tehnice",
      alt: "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă.",
    },
    {
      label: "Placare cu nivelare",
      alt: "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    },
    {
      label: "Rost finisat și montaj",
      alt: "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare.",
    },
  ],
  ru: [
    {
      label: "Демонтаж и вывоз",
      alt: "Ванная в панельном доме на демонтаже: старая плитка сбита, мусор на полу, мешок с отходами рядом со снятым смесителем.",
    },
    {
      label: "Основание подготовлено",
      alt: "Стены ванной очищены до основания, видны следы гребёнки и локально отремонтированные участки раствора перед укладкой.",
    },
    {
      label: "Инженерия и технические ниши",
      alt: "Технический короб, оставленный открытым для счётчика воды и вентиляционного канала, с облицованной полкой на скотче.",
    },
    {
      label: "Укладка с системой выравнивания",
      alt: "Облицовка стены в процессе: плитка под серый мрамор, выровненная системой выравнивания плитки.",
    },
    {
      label: "Затирка и установка сантехники",
      alt: "Общий вид готовой ванной: душевая кабина, раковина с белой тумбой и зеркало с подсветкой.",
    },
  ],
};

function stagesFor(locale: Locale): JourneyStill[] {
  return stageBase.map((base, i) => ({ ...base, ...stageText[locale][i]! }));
}

interface ChapterText {
  room: string;
  kicker: string;
  title: string;
  intro: string;
  posterAlt: string;
  serviceLabel: string;
  priceIncludes: string[];
  priceFactors: string[];
  metricLabels: string[];
  ctaLabel: string;
  attribution: string;
}

const chapterText: Record<Locale, ChapterText> = {
  ro: {
    room: "Baie",
    kicker: "Parcursul renovării · Camera 1",
    title: "Cum prinde viață o baie placată",
    intro:
      "Etapele reale ale unei băi renovate de noi — de la demolare până la rostul finisat. Toate fotografiile sunt din aceeași încăpere.",
    posterAlt:
      "Detaliu de execuție: rost continuu între plăci, poliță placată și nișă de vizitare pentru apometru.",
    serviceLabel: "Renovări de baie la cheie",
    priceIncludes: ["pregătirea suportului", "hidroizolație", "montaj", "rost finisat"],
    priceFactors: ["suprafața", "formatul plăcii", "starea suportului", "instalații"],
    metricLabels: ["m² placați", "zile execuție"],
    ctaLabel: "Cere estimare pentru baie",
    attribution: "Fotografii din lucrările noastre, făcute la fața locului.",
  },
  ru: {
    room: "Ванная",
    kicker: "Ход ремонта · Помещение 1",
    title: "Как рождается облицованная ванная",
    intro:
      "Реальные этапы ванной, отремонтированной нами, — от демонтажа до затёртого шва. Все фотографии сделаны в одном и том же помещении.",
    posterAlt:
      "Деталь исполнения: непрерывный шов между плитками, облицованная полка и ревизионная ниша для счётчика воды.",
    serviceLabel: "Ремонт ванной под ключ",
    priceIncludes: ["подготовка основания", "гидроизоляция", "укладка", "затирка швов"],
    priceFactors: ["площадь", "формат плитки", "состояние основания", "инженерные сети"],
    metricLabels: ["м² облицовки", "дней работ"],
    ctaLabel: "Получить оценку для ванной",
    attribution: "Фотографии с наших объектов, сделанные на месте.",
  },
};

export function getBaieChapter(locale: Locale): JourneyChapter {
  const t = chapterText[locale];
  const stages = stagesFor(locale);
  return {
  id: "baie",
  room: t.room,
  kicker: t.kicker,
  title: t.title,
  intro: t.intro,
  stages: stages.map((s) => s.label),
  media: {
    poster: "/images/proiecte/baie-marmura-gri/07-proces-rosturi-si-polita.jpg",
    posterAlt: t.posterAlt,
    before: stages[0]!,
    after: stages[stages.length - 1]!,
    stages,
    // Owner has no portrait footage of THIS room; `tour` above is another project.
    loop: null,
    // No landscape footage exists — the scrub tier stays retired (D-006).
    scrub: null,
  },
  service: { label: t.serviceLabel, slug: "renovari-bai" },
  price: {
    from: null, // CONFIRM_OWNER
    unit: null, // no invented unit either: "lei/m²" implies a price we do not have
    includes: t.priceIncludes,
    factors: t.priceFactors,
    confirm: CONFIRM,
  },
  // Data-gated like every other unverifiable figure (D-011): an empty array
  // renders nothing, where an em-dash under a label read as a real metric.
  metrics: [],
  cta: { label: t.ctaLabel, href: "#contact" },
  // Visitor-facing caption. States only what is true and verifiable today; the
  // locality/surface/date remain unconfirmed and are therefore simply not claimed.
  attribution: t.attribution,
  };
}
