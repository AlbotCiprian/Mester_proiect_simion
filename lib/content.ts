import type { Locale } from "@/lib/i18n";

/*
  PUBLIC CONTENT — the source of truth for every visitor-facing string that is
  not site chrome. Chrome lives in lib/ui-dict.ts.

  SHAPE. Anything that does not change between languages — a slug, an image
  path, a focal point, an anchor — is declared ONCE in a "base" array. Anything
  a Russian speaker must read in Russian lives in a `Record<Locale, ...>` keyed
  by that slug. Two consequences, both deliberate:

    - a photograph and its alt text cannot drift apart, because the path is
      declared once and the alt is looked up beside it;
    - adding a locale, or forgetting one string in one language, is a COMPILE
      ERROR rather than a page that renders half in Romanian. That is the
      failure ADR-011 forbids, and a type is the only thing that reliably
      prevents it.

  RULES THAT STILL APPLY (CLAUDE.md + .claude/rules):
  - no invented prices, warranties, reviews, projects, coverage areas or legal
    claims. Anything the owner has not confirmed is an EMPTY ARRAY or an empty
    string, so the section cannot render — never a placeholder, never an
    em-dash, never a "CONFIRM_OWNER" string in the DOM;
  - every photograph is owner-supplied work, and its alt text describes what the
    frame actually shows, not what we would like it to show.
*/

export const CONFIRM = "CONFIRM_OWNER" as const;

export type ConfirmFlag = typeof CONFIRM;

export interface Channel {
  type: "phone" | "whatsapp" | "viber" | "telegram" | "email";
  label: string;
  href: string;
  /**
   * Rendered publicly ONLY when true. An unconfirmed channel is a promise we
   * cannot keep: a Viber button on a number that has no Viber loses the customer
   * more effectively than having no button at all.
   */
  confirmed: boolean;
  confirm?: ConfirmFlag;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  /** CSS object-position. Phone frames are 9:20; center-cropping beheads them. */
  focal?: string;
  /** The topic page in lib/landing.ts that expands this card. */
  landingSlug: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

/** Only categories we can actually evidence with owner photography (D-008). */
export type ProjectCategoryKey = "bathroom" | "process" | "exterior";

export interface PortfolioItem {
  slug: string;
  title: string;
  type: string;
  category: string;
  image: string;
  imageAlt: string;
  focal?: string;
  /** Larger, story-first tile rendered as a before/after pair. */
  featured?: boolean;
  before?: string;
  beforeAlt?: string;
  beforeFocal?: string;
}

export interface Review {
  quote: string;
  author: string;
  context: string;
  confirm: ConfirmFlag;
}

export interface Faq {
  q: string;
  a: string;
}

// GATE A lives in config/indexability.mjs, because next.config.mjs must read the
// same value and cannot import TypeScript. Re-exported so nothing that already
// imports it from lib/content breaks.
export { GATE_A_COMPLETE } from "@/config/indexability.mjs";

/* ------------------------------------------------------------------ brand */

/**
 * The brand. `name` is CONFIRMED (owner, 2026-09-03) and is the same in every
 * language — it is a name, not a word. Everything descriptive around it is
 * per-locale, because "Gresie · Faianță · Baie" means nothing to half of
 * Chișinău.
 */
export const site = {
  name: "SemiDom",
  shortName: "SemiDom",
} as const;

interface SiteText {
  /** Long form, for prose and metadata. "SemiDom" says nothing on its own. */
  descriptor: string;
  /** Wordmark suffix. Must fit a 0.62rem tracked superscript beside the name. */
  descriptorShort: string;
  tagline: string;
  /** The owner's own words. Deliberately not a list of named localities (B4). */
  serviceArea: string;
}

const siteText: Record<Locale, SiteText> = {
  ro: {
    descriptor: "Placări ceramice și renovări de baie",
    descriptorShort: "Gresie · Faianță · Baie",
    tagline: "Placări și renovări de baie executate cu precizie",
    serviceArea: "Chișinău și împrejurimi",
  },
  ru: {
    descriptor: "Облицовка плиткой и ремонт ванных комнат",
    descriptorShort: "Плитка · Ванная · Ремонт",
    tagline: "Облицовка и ремонт ванных комнат, выполненные точно",
    serviceArea: "Кишинёв и пригороды",
  },
};

export function getSiteText(locale: Locale): SiteText {
  return siteText[locale];
}

/* ---------------------------------------------------------------- contact */

/**
 * The one contact fact that is CONFIRMED (owner, 2026-08-19).
 * E.164 for machines (tel:, JSON-LD), spaced for humans. Identical in every
 * language — a phone number is not translated.
 */
export const phone = {
  e164: "+37379968387",
  display: "+373 79 968 387",
} as const;

export const channels: Channel[] = [
  { type: "phone", label: phone.display, href: `tel:${phone.e164}`, confirmed: true },

  // CONFIRM_OWNER: does this number actually have WhatsApp / Viber, and is there
  // a Telegram username? Telegram cannot be linked by phone number at all — it
  // needs an @username. Flip `confirmed` per channel once the owner answers.
  {
    type: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/${phone.e164.replace("+", "")}`,
    confirmed: false,
    confirm: CONFIRM,
  },
  {
    type: "viber",
    label: "Viber",
    href: `viber://chat?number=${encodeURIComponent(phone.e164)}`,
    confirmed: false,
    confirm: CONFIRM,
  },
  { type: "telegram", label: "Telegram", href: "#", confirmed: false, confirm: CONFIRM },
  { type: "email", label: "E-mail", href: "#", confirmed: false, confirm: CONFIRM },
];

/** Only channels safe to show a visitor. */
export const publicChannels = channels.filter((c) => c.confirmed);

/* ------------------------------------------------------------- navigation */

/**
 * Homepage section anchors. The LABEL is not here — it is a key into
 * lib/ui-dict.ts, so the same anchor cannot end up with a Romanian label on a
 * Russian page, and a translator never has to touch routing.
 *
 * Rendered through `navHref(locale, hash)`: a bare "#servicii" resolves against
 * whatever path the visitor is on, which turns every nav item into a dead link
 * the moment a second route exists.
 */
export const nav = [
  { key: "projects", hash: "#proiecte" },
  { key: "process", hash: "#proces" },
  { key: "pricing", hash: "#preturi" },
  { key: "caseStudy", hash: "#despre" },
  { key: "contact", hash: "#contact" },
] as const;

export function navHref(locale: string, hash: string): string {
  return `/${locale}${hash}`;
}

/**
 * Real routes in the navigation, as opposed to the homepage anchors above.
 *
 * Kept separate because tests/routes.test.ts enforces that every entry of `nav`
 * is a "#anchor" whose id exists in home-sections.tsx — a rule that exists
 * because a bare anchor resolves against the CURRENT path.
 */
export const navPages = [{ key: "services", path: "/servicii" }] as const;

/**
 * The contact anchor, as a RELATIVE hash.
 *
 * Every public route renders an `id="contact"` section, so this scrolls the
 * visitor to the form on the page they are already reading instead of sending
 * them back to the homepage. That navigation was a conversion leak: the moment
 * someone is convinced is the moment they must be able to act.
 */
export const contactHash = "#contact";

/* ------------------------------------------------------------ trust facts */

export interface TrustFact {
  value: string;
  label: string;
}

/**
 * DATA-GATED, not comment-gated. A `CONFIRM_OWNER` comment does not stop a
 * deploy; an empty array does — the strip simply does not render.
 *
 * Refill ONLY with figures the owner can evidence (checklist B7, B8, D1, B4).
 * The previous values ("10+ ani", "200+ proiecte", "24 luni garanție") were
 * placeholders that read as public promises.
 */
export const trustFacts: Record<Locale, TrustFact[]> = { ro: [], ru: [] };

export function getTrustFacts(locale: Locale): TrustFact[] {
  return trustFacts[locale];
}

/* ---------------------------------------------------------------- services */

/** Locale-independent: paths, focal points, and the topic page each card opens. */
const serviceBase = [
  {
    slug: "gresie-faianta",
    image: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg",
    focal: "50% 50%",
    landingSlug: "montaj-gresie-faianta",
  },
  {
    slug: "renovari-bai",
    image: "/images/proiecte/baie-wc-suspendat/01-dupa-wc-suspendat.jpg",
    focal: "50% 45%",
    landingSlug: "renovare-baie-la-cheie",
  },
  {
    // The owner performs terracotta (B2, confirmed 2026-09-03) but has supplied
    // no photograph of it. Resolved by naming the card for what the photograph
    // DOES show — decorative ceramic execution with mitred 45° edges — while
    // keeping "teracotă" in the title because the service is real. Nothing here
    // claims the frame is terracotta; the alt text says exactly what it is.
    // Swap the image the day a terracotta photo arrives (D-026).
    slug: "teracota-sobe",
    image: "/images/proiecte/baie-cada-placata/02-cada-placata-detaliu-muchii.jpg",
    focal: "50% 55%",
    landingSlug: "teracota",
  },
  {
    slug: "placari-exterioare",
    image: "/images/proiecte/fatada-si-scara-exterioara/01-fatada-si-scara.jpg",
    focal: "50% 50%",
    landingSlug: "placare-terasa",
  },
] as const;

type ServiceSlug = (typeof serviceBase)[number]["slug"];

interface ServiceText {
  title: string;
  summary: string;
  bullets: string[];
  imageAlt: string;
}

const serviceText: Record<Locale, Record<ServiceSlug, ServiceText>> = {
  ro: {
    "gresie-faianta": {
      title: "Montaj gresie și faianță",
      summary:
        "Placare precisă pe pereți și pardoseli, cu pregătirea corectă a suportului și rosturi calibrate.",
      bullets: ["Nivel laser și suport plan", "Tăieturi și colțuri la 45°", "Rosturi uniforme, etanșe"],
      imageAlt:
        "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    },
    "renovari-bai": {
      title: "Renovări de baie la cheie",
      summary:
        "Coordonăm tot procesul — de la demontare și hidroizolație până la finisaje și montaj sanitar.",
      bullets: ["Hidroizolație în zonele umede", "Trasee apă și canalizare", "Finisaje și montaj obiecte"],
      imageAlt:
        "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță.",
    },
    "teracota-sobe": {
      title: "Plăci ceramice decorative și teracotă",
      summary:
        "Lucrări de teracotă și placări ceramice decorative, cu atenție la tipar, ton și aliniere.",
      bullets: ["Selectarea tiparului", "Aliniere pe module", "Detalii de racord curate"],
      imageAlt:
        "Detaliu de execuție ceramică: muchie exterioară tăiată la 45°, fără profil metalic, și racord curat la peretele placat.",
    },
    "placari-exterioare": {
      title: "Placări exterioare și terase",
      summary:
        "Placări rezistente la îngheț pentru terase, scări și fațade, cu pante și rosturi tehnice corecte.",
      bullets: ["Adezivi pentru exterior", "Pante de scurgere", "Rosturi de dilatare"],
      imageAlt:
        "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate.",
    },
  },
  ru: {
    "gresie-faianta": {
      title: "Укладка напольной и настенной плитки",
      summary:
        "Точная облицовка стен и полов с правильной подготовкой основания и выверенными швами.",
      bullets: [
        "Лазерный уровень и ровное основание",
        "Резы и углы с запилом под 45°",
        "Ровные, герметичные швы",
      ],
      imageAlt:
        "Облицовка стены в процессе: плитка под серый мрамор, выровненная системой выравнивания плитки.",
    },
    "renovari-bai": {
      title: "Ремонт ванной под ключ",
      summary:
        "Ведём весь процесс — от демонтажа и гидроизоляции до финишной отделки и установки сантехники.",
      bullets: [
        "Гидроизоляция мокрых зон",
        "Разводка воды и канализации",
        "Отделка и установка сантехники",
      ],
      imageAlt:
        "Готовая компактная ванная: крупноформатная плитка под бетон, подвесной унитаз со встроенной клавишей и ниша-полка.",
    },
    "teracota-sobe": {
      title: "Декоративная керамика и терракота",
      summary:
        "Работы по терракоте и декоративной керамической облицовке — с вниманием к рисунку, тону и выравниванию.",
      bullets: ["Подбор рисунка", "Раскладка по модулю", "Чистые примыкания"],
      imageAlt:
        "Деталь керамической работы: наружный угол с запилом под 45°, без металлического профиля, и чистое примыкание к облицованной стене.",
    },
    "placari-exterioare": {
      title: "Наружная облицовка и террасы",
      summary:
        "Морозостойкая облицовка террас, лестниц и фасадов — с правильными уклонами и деформационными швами.",
      bullets: ["Клеи для наружных работ", "Уклоны для отвода воды", "Деформационные швы"],
      imageAlt:
        "Фасад и наружная лестница, облицованные крупноформатным керамогранитом, со ступенями и подступенками в одной линии.",
    },
  },
};

export function getServices(locale: Locale): Service[] {
  return serviceBase.map((base) => ({ ...base, ...serviceText[locale][base.slug] }));
}

/* ---------------------------------------------------------------- flagship */

const flagshipBase = {
  image: "/images/proiecte/baie-cada-placata/01-cada-placata-ansamblu.jpg",
  focal: "50% 55%",
  /**
   * Empty by design (D-011). Surface area, duration and tile format are not
   * measured by us for this project, and a rounded figure in a project sheet is
   * exactly the kind of claim CLAUDE.md forbids. Refill only with values the
   * owner can evidence.
   */
  metrics: [] as Array<{ value: string; label: string }>,
  /** Rendered only when it says something (checklist G2). */
  location: "",
} as const;

interface FlagshipText {
  kicker: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  imageAlt: string;
}

const flagshipText: Record<Locale, FlagshipText> = {
  ro: {
    kicker: "Proiect reprezentativ",
    title: "Cadă zidită și placată integral, cu muchii la 45°",
    summary:
      "O cadă zidită și îmbrăcată complet în plăci de format mare, cu muchiile tăiate la 45° și tiparul continuat de pe perete pe corpul căzii.",
    challenge:
      "Corpul căzii are muchii expuse pe trei laturi, unde un profil metalic ar fi rupt continuitatea plăcii.",
    approach:
      "Am tăiat muchiile la 45° și am selectat plăcile astfel încât desenul să curgă de pe perete pe cant și mai departe pe blat.",
    result:
      "Cada se citește ca un volum dintr-un singur material, fără margini metalice și fără întreruperi de tipar.",
    imageAlt:
      "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
  },
  ru: {
    kicker: "Показательный проект",
    title: "Ванна в кирпичном коробе, облицованная целиком, с запилом под 45°",
    summary:
      "Ванна, выложенная коробом и полностью одетая в крупноформатную плитку: углы с запилом под 45°, рисунок продолжается со стены на корпус ванны.",
    challenge:
      "У короба открытые углы с трёх сторон — там металлический профиль разорвал бы непрерывность плитки.",
    approach:
      "Запилили углы под 45° и подобрали плитки так, чтобы рисунок переходил со стены на торец и дальше на верхнюю плоскость.",
    result:
      "Ванна читается как объём из одного материала: без металлических кромок и без разрывов рисунка.",
    imageAlt:
      "Ванна в коробе, полностью облицованная плиткой под мрамор, с запилом углов под 45° и непрерывным рисунком по стене.",
  },
};

export function getFlagship(locale: Locale) {
  return { ...flagshipBase, ...flagshipText[locale] };
}

/* -------------------------------------------------------- precision points */

interface Point {
  title: string;
  body: string;
}

const precisionPoints: Record<Locale, Point[]> = {
  ro: [
    {
      title: "Rost continuu pe module",
      body: "Plăcile sunt pretrasate astfel încât rostul să curgă fără întreruperi între pereți și pardoseală.",
    },
    {
      title: "Suport plan, verificat cu laser",
      body: "Planeitatea suportului este controlată înainte de montaj, nu corectată cu adeziv în exces.",
    },
    {
      title: "Hidroizolație în zonele umede",
      body: "În duș și în jurul căzii aplicăm hidroizolație înainte de placare, nu doar la finisaj.",
    },
    {
      title: "Racorduri și colțuri curate",
      body: "Tăieturile la 45° și profilele alese cu grijă elimină marginile expuse și liniile inestetice.",
    },
  ],
  ru: [
    {
      title: "Непрерывный шов по модулю",
      body: "Раскладка размечается заранее, чтобы шов шёл без разрывов между стенами и полом.",
    },
    {
      title: "Ровное основание, проверенное лазером",
      body: "Ровность основания контролируется до укладки, а не выправляется избытком клея.",
    },
    {
      title: "Гидроизоляция в мокрых зонах",
      body: "В душе и вокруг ванны гидроизоляция наносится до облицовки, а не только на финише.",
    },
    {
      title: "Чистые примыкания и углы",
      body: "Запил под 45° и аккуратно подобранные профили убирают открытые кромки и некрасивые линии.",
    },
  ],
};

export function getPrecisionPoints(locale: Locale): Point[] {
  return precisionPoints[locale];
}

/* ----------------------------------------------------------------- process */

const processSteps: Record<Locale, ProcessStep[]> = {
  ro: [
    { index: "01", title: "Cerere și imagini", body: "Ne trimiți situația și câteva fotografii ale spațiului." },
    { index: "02", title: "Calificare", body: "Clarificăm serviciul, suprafața aproximativă și intervalul dorit." },
    { index: "03", title: "Evaluare", body: "Programăm o evaluare la fața locului, atunci când este necesar." },
    { index: "04", title: "Ofertă și scope", body: "Primești o ofertă clară, cu ce este inclus și ce nu." },
    { index: "05", title: "Execuție", body: "Pregătire, protecție, montaj și verificări pe parcurs." },
    { index: "06", title: "Predare și garanție", body: "Predăm lucrarea curată, cu recomandări de întreținere." },
  ],
  ru: [
    { index: "01", title: "Заявка и фотографии", body: "Вы описываете ситуацию и присылаете несколько фотографий помещения." },
    { index: "02", title: "Уточнение", body: "Выясняем услугу, примерную площадь и желаемые сроки." },
    { index: "03", title: "Осмотр", body: "Назначаем выезд на объект, когда это необходимо." },
    { index: "04", title: "Смета и объём", body: "Вы получаете понятную смету: что входит и что не входит." },
    { index: "05", title: "Выполнение", body: "Подготовка, защита помещения, монтаж и проверки по ходу работ." },
    { index: "06", title: "Сдача и гарантия", body: "Сдаём объект убранным, с рекомендациями по уходу." },
  ],
};

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return processSteps[locale];
}

/* --------------------------------------------------------------- estimator */

interface EstimatorText {
  kicker: string;
  title: string;
  body: string;
  factors: string[];
  ctaLabel: string;
  note: string;
}

const estimator: Record<Locale, EstimatorText> = {
  ro: {
    kicker: "Cum se calculează",
    title: "Ce influențează costul unei placări",
    // Describes what actually happens. The previous copy promised "instrumentul
    // nostru … oferă un interval orientativ" — there is no instrument, the CTA
    // scrolls to the form, and no interval is shown anywhere.
    body: "Costul depinde de câțiva factori pe care îi verificăm înainte să dăm un preț: suprafața și geometria încăperii, formatul plăcii, starea suportului și lucrările ascunse — hidroizolație, trasee, nivelări. Îți spunem clar ce intră în preț și ce nu, după ce vedem situația.",
    factors: [
      "Suprafața și geometria",
      "Formatul și tipul plăcii",
      "Starea suportului",
      "Hidroizolație și instalații",
    ],
    ctaLabel: "Cere o estimare",
    note: "Estimatorul nu este o ofertă contractuală (ADR-012).",
  },
  ru: {
    kicker: "Как считается",
    title: "Что влияет на стоимость облицовки",
    body: "Стоимость зависит от нескольких факторов, которые мы проверяем до того, как назвать цену: площадь и геометрия помещения, формат плитки, состояние основания и скрытые работы — гидроизоляция, разводка, выравнивание. После осмотра мы чётко говорим, что входит в цену, а что нет.",
    factors: [
      "Площадь и геометрия",
      "Формат и тип плитки",
      "Состояние основания",
      "Гидроизоляция и инженерные сети",
    ],
    ctaLabel: "Получить оценку",
    note: "Оценка не является публичной офертой (ADR-012).",
  },
};

/** The CTA scrolls to the form; it does not compute anything (spec 06 forbids
 *  promising an interaction that does not exist). */
export const estimatorCtaHref = "#contact";

export function getEstimator(locale: Locale): EstimatorText {
  return estimator[locale];
}

/* --------------------------------------------------------------- portfolio */

const categoryLabels: Record<Locale, Record<ProjectCategoryKey, string>> = {
  ro: { bathroom: "Baie", process: "Proces", exterior: "Exterior" },
  ru: { bathroom: "Ванная", process: "Процесс", exterior: "Наружные" },
};

/**
 * Real photographs, owner-supplied, published from docs/poze through
 * scripts/build-media.mjs. `focal` values come from scripts/media-catalog.mjs —
 * keep the two in sync.
 */
const portfolioBase = [
  {
    slug: "baie-marmura-gri",
    category: "bathroom",
    featured: true,
    before: "/images/proiecte/baie-marmura-gri/01-inainte-demolare.jpg",
    beforeFocal: "50% 40%",
    image: "/images/proiecte/baie-marmura-gri/09-dupa-ansamblu.jpg",
    focal: "50% 50%",
  },
  {
    slug: "cada-placata-portelan",
    category: "bathroom",
    image: "/images/proiecte/baie-cada-placata/01-cada-placata-ansamblu.jpg",
    focal: "50% 55%",
  },
  {
    slug: "baie-marmura-alba",
    category: "bathroom",
    image: "/images/proiecte/baie-marmura-alba/06-dupa-zona-dus.jpg",
    focal: "50% 50%",
  },
  {
    slug: "baie-wc-suspendat",
    category: "bathroom",
    image: "/images/proiecte/baie-wc-suspendat/01-dupa-wc-suspendat.jpg",
    focal: "50% 45%",
  },
  {
    slug: "cabina-dus-marmura-gri",
    category: "bathroom",
    image: "/images/proiecte/baie-marmura-gri/08-dupa-cabina-dus.jpg",
    focal: "50% 45%",
  },
  {
    slug: "perete-accent-marmura-neagra",
    category: "bathroom",
    image: "/images/proiecte/baie-marmura-alba/08-dupa-accent-marmura-neagra.jpg",
    focal: "50% 45%",
  },
  {
    slug: "nisa-wc-suspendat",
    category: "bathroom",
    image: "/images/proiecte/baie-cada-placata/03-nisa-wc-suspendat.jpg",
    focal: "50% 50%",
  },
  {
    slug: "hidroizolatie-si-incalzire-in-pardoseala",
    category: "process",
    image: "/images/proiecte/baie-marmura-alba/03-proces-hidroizolatie-si-incalzire.jpg",
    focal: "50% 55%",
  },
  {
    slug: "placare-cu-sistem-de-nivelare",
    category: "process",
    image: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg",
    focal: "50% 50%",
  },
  {
    slug: "nisa-tehnica-si-polita",
    category: "process",
    image: "/images/proiecte/baie-marmura-gri/04-proces-nisa-tehnica.jpg",
    focal: "50% 35%",
  },
  {
    slug: "cuva-dus-zidita",
    category: "process",
    image: "/images/proiecte/compartimentari-si-cuva-dus/01-proces-cuva-dus-zidita.jpg",
    focal: "50% 50%",
  },
  {
    slug: "fatada-si-scara-exterioara",
    category: "exterior",
    image: "/images/proiecte/fatada-si-scara-exterioara/01-fatada-si-scara.jpg",
    focal: "50% 50%",
  },
  {
    slug: "trepte-si-terasa-in-executie",
    category: "exterior",
    image: "/images/proiecte/fatada-si-scara-exterioara/02-proces-trepte-si-terasa.jpg",
    focal: "50% 50%",
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  category: ProjectCategoryKey;
  image: string;
  focal?: string;
  featured?: boolean;
  before?: string;
  beforeFocal?: string;
}>;

type PortfolioSlug = (typeof portfolioBase)[number]["slug"];

interface PortfolioText {
  title: string;
  type: string;
  imageAlt: string;
  beforeAlt?: string;
}

const portfolioText: Record<Locale, Record<PortfolioSlug, PortfolioText>> = {
  ro: {
    "baie-marmura-gri": {
      title: "Renovare completă de baie — de la demolare la finisaj",
      type: "Demolare · instalații · placare · montaj sanitar",
      beforeAlt:
        "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată.",
      imageAlt:
        "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare.",
    },
    "cada-placata-portelan": {
      title: "Cadă placată în porțelan",
      type: "Muchii tăiate la 45° · tipar continuu",
      imageAlt:
        "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
    },
    "baie-marmura-alba": {
      title: "Baie cu marmură albă și accent negru",
      type: "Porțelan lucios · duș fără prag",
      imageAlt:
        "Baie finalizată în plăci albe aspect marmură, lucioase, cu zonă de duș fără prag și coloană pentru rezervor încastrat.",
    },
    "baie-wc-suspendat": {
      title: "Baie compactă cu WC suspendat",
      type: "Format mare aspect beton · nișă-poliță",
      imageAlt:
        "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță.",
    },
    "cabina-dus-marmura-gri": {
      title: "Cabină de duș în baie placată",
      type: "Aspect marmură gri · profile negre",
      imageAlt:
        "Baie finalizată, cu cabină de duș semirotundă cu profile negre și pereți placați cu plăci aspect marmură gri.",
    },
    "perete-accent-marmura-neagra": {
      title: "Perete de accent din marmură neagră",
      type: "Contrast alb–negru · rigolă liniară",
      imageAlt:
        "Perete de accent din plăci aspect marmură neagră, în contrast cu placarea albă și rigola liniară din pardoseală.",
    },
    "nisa-wc-suspendat": {
      title: "Nișă placată pentru WC suspendat",
      type: "Rezervor încastrat · colțuri la 45°",
      imageAlt:
        "Nișă placată pentru rezervor încastrat de WC suspendat, cu poliță din plăci și colțuri tăiate la 45°.",
    },
    "hidroizolatie-si-incalzire-in-pardoseala": {
      title: "Hidroizolație și încălzire în pardoseală",
      type: "În execuție · zonă umedă și rigolă",
      imageAlt:
        "Hidroizolație aplicată pe pardoseală și pereți, cu cablu de încălzire în pardoseală montat pe plasă și rigolă liniară.",
    },
    "placare-cu-sistem-de-nivelare": {
      title: "Placare cu sistem de nivelare",
      type: "În execuție · plăci de format mare",
      imageAlt:
        "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    },
    "nisa-tehnica-si-polita": {
      title: "Nișă tehnică și poliță placată",
      type: "În execuție · acces la apometru",
      imageAlt:
        "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă.",
    },
    "cuva-dus-zidita": {
      title: "Cuvă de duș zidită pe rigolă liniară",
      type: "În execuție · BCA și șapă",
      imageAlt:
        "Cuvă de duș zidită din blocuri BCA în jurul unei rigole liniare deja montate, pe șapă proaspătă.",
    },
    "fatada-si-scara-exterioara": {
      title: "Fațadă ventilată și scară exterioară",
      type: "Placare exterioară · porțelan format mare",
      imageAlt:
        "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate.",
    },
    "trepte-si-terasa-in-executie": {
      title: "Trepte și terasă în execuție",
      type: "În execuție · placare exterioară",
      imageAlt:
        "Scară exterioară în curs de placare, cu plăci poziționate pe terasă și clipsuri de nivelare.",
    },
  },
  ru: {
    "baie-marmura-gri": {
      title: "Полный ремонт ванной — от демонтажа до финиша",
      type: "Демонтаж · инженерия · облицовка · сантехника",
      beforeAlt:
        "Ванная в панельном доме на демонтаже: старая плитка сбита, мусор на полу, мешок с отходами рядом со снятым смесителем.",
      imageAlt:
        "Общий вид готовой ванной: душевая кабина, раковина с белой тумбой и зеркало с подсветкой.",
    },
    "cada-placata-portelan": {
      title: "Ванна, облицованная керамогранитом",
      type: "Запил под 45° · непрерывный рисунок",
      imageAlt:
        "Ванна в коробе, полностью облицованная плиткой под мрамор, с запилом углов под 45° и непрерывным рисунком по стене.",
    },
    "baie-marmura-alba": {
      title: "Ванная в белом мраморе с чёрным акцентом",
      type: "Глянцевый керамогранит · душ без порога",
      imageAlt:
        "Готовая ванная в глянцевой белой плитке под мрамор, с душевой зоной без порога и коробом под скрытую инсталляцию.",
    },
    "baie-wc-suspendat": {
      title: "Компактная ванная с подвесным унитазом",
      type: "Крупный формат под бетон · ниша-полка",
      imageAlt:
        "Готовая компактная ванная: крупноформатная плитка под бетон, подвесной унитаз со встроенной клавишей и ниша-полка.",
    },
    "cabina-dus-marmura-gri": {
      title: "Душевая кабина в облицованной ванной",
      type: "Под серый мрамор · чёрные профили",
      imageAlt:
        "Готовая ванная с полукруглой душевой кабиной в чёрных профилях и стенами в плитке под серый мрамор.",
    },
    "perete-accent-marmura-neagra": {
      title: "Акцентная стена из чёрного мрамора",
      type: "Контраст белого и чёрного · линейный трап",
      imageAlt:
        "Акцентная стена из плитки под чёрный мрамор, контрастирующая с белой облицовкой и линейным трапом в полу.",
    },
    "nisa-wc-suspendat": {
      title: "Облицованный короб под подвесной унитаз",
      type: "Скрытая инсталляция · углы под 45°",
      imageAlt:
        "Облицованная ниша под скрытый бачок подвесного унитаза, с полкой из плитки и углами с запилом под 45°.",
    },
    "hidroizolatie-si-incalzire-in-pardoseala": {
      title: "Гидроизоляция и тёплый пол",
      type: "В процессе · мокрая зона и трап",
      imageAlt:
        "Гидроизоляция, нанесённая на пол и стены, с кабелем тёплого пола на сетке и линейным трапом.",
    },
    "placare-cu-sistem-de-nivelare": {
      title: "Укладка с системой выравнивания",
      type: "В процессе · крупноформатная плитка",
      imageAlt:
        "Облицовка стены в процессе: плитка под серый мрамор, выровненная системой выравнивания плитки.",
    },
    "nisa-tehnica-si-polita": {
      title: "Технический короб и облицованная полка",
      type: "В процессе · доступ к счётчику",
      imageAlt:
        "Технический короб, оставленный открытым для счётчика воды и вентиляционного канала, с облицованной полкой на скотче.",
    },
    "cuva-dus-zidita": {
      title: "Выложенный поддон душа на линейном трапе",
      type: "В процессе · газоблок и стяжка",
      imageAlt:
        "Поддон душа, выложенный из газоблоков вокруг уже установленного линейного трапа, на свежей стяжке.",
    },
    "fatada-si-scara-exterioara": {
      title: "Вентилируемый фасад и наружная лестница",
      type: "Наружная облицовка · крупный керамогранит",
      imageAlt:
        "Фасад и наружная лестница, облицованные крупноформатным керамогранитом, со ступенями и подступенками в одной линии.",
    },
    "trepte-si-terasa-in-executie": {
      title: "Ступени и терраса в работе",
      type: "В процессе · наружная облицовка",
      imageAlt:
        "Наружная лестница в процессе облицовки: плитка разложена на террасе, установлены клинья системы выравнивания.",
    },
  },
};

export function getPortfolio(locale: Locale): PortfolioItem[] {
  return portfolioBase.map((base) => ({
    ...base,
    ...portfolioText[locale][base.slug],
    category: categoryLabels[locale][base.category],
  }));
}

/* --------------------------------------------------------- reviews and FAQ */

/**
 * Empty until real, sourced, consented reviews exist (checklist G4).
 * A testimonial is quoted, never drafted — see DECISIONS D-007.
 */
export const reviews: Record<Locale, Review[]> = { ro: [], ru: [] };

export function getReviews(locale: Locale): Review[] {
  return reviews[locale];
}

/**
 * Empty until the owner answers (checklist F). Five questions whose answer was
 * literally "Conținut de confirmat cu proprietarul" used to render here as real
 * FAQ entries. The topic pages carry their own, real FAQs.
 */
export const faqs: Record<Locale, Faq[]> = { ro: [], ru: [] };

export function getFaqs(locale: Locale): Faq[] {
  return faqs[locale];
}
