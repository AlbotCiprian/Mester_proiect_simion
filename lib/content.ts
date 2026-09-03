/*
  PROVISIONAL PROTOTYPE CONTENT — NOT APPROVED FOR PUBLICATION.

  Every business value below is a placeholder and is marked CONFIRM_OWNER.
  Nothing here may go to production before Gate A (owner discovery) is complete:
  see docs/specs/26-OWNER-DISCOVERY-CHECKLIST.md.

  Rules honored (docs/specs/01 + CLAUDE.md):
  - no invented prices, warranties, reviews, projects, coverage areas or legal claims
    presented as real. These strings exist ONLY to demonstrate layout and are flagged.
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
  /** Set when the photo does not literally depict this service (see teracotă). */
  imageConfirm?: ConfirmFlag;
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

// Only categories we can actually evidence with owner photography (D-008).
export type ProjectCategory = "Baie" | "Proces" | "Exterior";

export interface PortfolioItem {
  slug: string;
  title: string;
  type: string;
  category: ProjectCategory;
  image: string;
  imageAlt: string;
  /** CSS object-position for `image`. */
  focal?: string;
  /** Larger, story-first tile rendered as a before/after pair. */
  featured?: boolean;
  /** Optional "before" frame for a before/after comparison. */
  before?: string;
  beforeAlt?: string;
  /** CSS object-position for `before`. */
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

// GATE A now lives in config/indexability.mjs, because next.config.mjs must read
// the same value and cannot import TypeScript. Re-exported here so nothing that
// already imports it from lib/content breaks.
export { GATE_A_COMPLETE } from "@/config/indexability.mjs";

/**
 * The single source for the brand. Everything else — page titles, the header
 * wordmark, the footer, llms.txt, JSON-LD, the privacy notice — derives from it.
 *
 * `name` is CONFIRMED (owner, 2026-09-03). The legal entity behind it (A4) and
 * the exact localities (B4) are not, and both still gate indexing.
 */
export const site = {
  name: "SemiDom",
  shortName: "SemiDom",
  /** Descriptor shown beside the wordmark and used as the title suffix. */
  descriptor: "Placări ceramice și renovări de baie",
  tagline: "Placări și renovări de baie executate cu precizie",
  // CONFIRM_OWNER: exact localities served (checklist B4).
  serviceArea: "Chișinău și împrejurimi",
  confirm: CONFIRM,
};

/**
 * The one contact fact that is CONFIRMED (owner, 2026-08-19).
 * E.164 for machines (tel:, JSON-LD), spaced for humans.
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

/**
 * Section anchors on the homepage. Rendered through `navHref(locale, hash)` so
 * they work from any route — a bare "#servicii" resolves against whatever path
 * the visitor is on, which turns every nav item into a dead link the moment a
 * second route exists.
 */
export const nav = [
  { label: "Servicii", hash: "#servicii" },
  { label: "Proiecte", hash: "#proiecte" },
  { label: "Proces", hash: "#proces" },
  { label: "Prețuri", hash: "#preturi" },
  { label: "Despre", hash: "#despre" },
  { label: "Contact", hash: "#contact" },
];

export function navHref(locale: string, hash: string): string {
  return `/${locale}${hash}`;
}

// NOTE: the old `hero` export (Unsplash stock photo) was removed. The homepage
// hero is owned by lib/hero.ts, which renders owner media behind a rights gate.

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
 * placeholders that read as public promises. If a figure cannot be confirmed,
 * the tile is deleted, never rounded.
 */
export const trustFacts: TrustFact[] = [];

// Photos: owner-supplied, published from docs/poze via scripts/build-media.mjs.
// `focal` values come from scripts/media-catalog.mjs — keep the two in sync.
export const services: Service[] = [
  {
    slug: "gresie-faianta",
    title: "Montaj gresie și faianță",
    summary:
      "Placare precisă pe pereți și pardoseli, cu pregătirea corectă a suportului și rosturi calibrate.",
    bullets: ["Nivel laser și suport plan", "Tăieturi și colțuri la 45°", "Rosturi uniforme, etanșe"],
    image: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg",
    imageAlt:
      "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    focal: "50% 50%",
  },
  {
    slug: "renovari-bai",
    title: "Renovări de baie la cheie",
    summary:
      "Coordonăm tot procesul — de la demontare și hidroizolație până la finisaje și montaj sanitar.",
    bullets: ["Hidroizolație în zonele umede", "Trasee apă și canalizare", "Finisaje și montaj obiecte"],
    image: "/images/proiecte/baie-wc-suspendat/01-dupa-wc-suspendat.jpg",
    imageAlt:
      "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță.",
    focal: "50% 45%",
  },
  {
    slug: "teracota-sobe",
    title: "Teracotă și plăci ceramice",
    summary:
      "Lucrări de teracotă și placări ceramice decorative, cu atenție la tipar, ton și aliniere.",
    bullets: ["Selectarea tiparului", "Aliniere pe module", "Detalii de racord curate"],
    // CONFIRM_OWNER: nu există încă nicio fotografie de teracotă/sobă în materialul
    // primit. Imaginea de mai jos ilustrează execuția ceramică decorativă (muchii
    // tăiate la 45°), NU o lucrare de teracotă. Se înlocuiește la prima lucrare
    // fotografiată — sau serviciul se scoate din grilă dacă nu se mai execută.
    image: "/images/proiecte/baie-cada-placata/02-cada-placata-detaliu-muchii.jpg",
    imageAlt:
      "Detaliu de execuție ceramică: muchie exterioară tăiată la 45°, fără profil metalic, și racord curat la peretele placat.",
    focal: "50% 55%",
    imageConfirm: CONFIRM,
  },
  {
    slug: "placari-exterioare",
    title: "Placări exterioare și terase",
    summary:
      "Placări rezistente la îngheț pentru terase, scări și fațade, cu pante și rosturi tehnice corecte.",
    bullets: ["Adezivi pentru exterior", "Pante de scurgere", "Rosturi de dilatare"],
    image: "/images/proiecte/fatada-si-scara-exterioara/01-fatada-si-scara.jpg",
    imageAlt:
      "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate.",
    focal: "50% 50%",
  },
];

export const flagship = {
  kicker: "Proiect reprezentativ",
  // Descrierea de mai jos spune DOAR ce se vede în fotografii. Locația, suprafața,
  // durata și acordul scris de publicare rămân CONFIRM_OWNER (checklist D.31).
  title: "Cadă zidită și placată integral, cu muchii la 45°",
  // Rendered only when it says something. An empty string is honest; a
  // placeholder shown to a customer is an internal note on the shop window.
  location: "", // CONFIRM_OWNER — checklist G2

  summary:
    "O cadă zidită și îmbrăcată complet în plăci de format mare, cu muchiile tăiate la 45° și tiparul continuat de pe perete pe corpul căzii.",
  challenge:
    "Corpul căzii are muchii expuse pe trei laturi, unde un profil metalic ar fi rupt continuitatea plăcii.",
  approach:
    "Am tăiat muchiile la 45° și am selectat plăcile astfel încât desenul să curgă de pe perete pe cant și mai departe pe blat.",
  result:
    "Cada se citește ca un volum dintr-un singur material, fără margini metalice și fără întreruperi de tipar.",
  metrics: [
    { value: "—", label: "suprafață placată", confirm: CONFIRM },
    { value: "—", label: "durată execuție", confirm: CONFIRM },
    { value: "—", label: "format plăci", confirm: CONFIRM },
  ],
  image: "/images/proiecte/baie-cada-placata/01-cada-placata-ansamblu.jpg",
  imageAlt:
    "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
  focal: "50% 55%",
};

export const precisionPoints = [
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
];

export const processSteps: ProcessStep[] = [
  { index: "01", title: "Cerere și imagini", body: "Ne trimiți situația și câteva fotografii ale spațiului." },
  { index: "02", title: "Calificare", body: "Clarificăm serviciul, suprafața aproximativă și intervalul dorit." },
  { index: "03", title: "Evaluare", body: "Programăm o evaluare la fața locului, atunci când este necesar." },
  { index: "04", title: "Ofertă și scope", body: "Primești o ofertă clară, cu ce este inclus și ce nu." },
  { index: "05", title: "Execuție", body: "Pregătire, protecție, montaj și verificări pe parcurs." },
  { index: "06", title: "Predare și garanție", body: "Predăm lucrarea curată, cu recomandări de întreținere." },
];

export const estimator = {
  kicker: "Estimare orientativă",
  title: "Află un interval, nu o surpriză",
  body: "Instrumentul nostru explică factorii care influențează costul — suprafață, tip de placă, pregătirea suportului și complexitatea — și oferă un interval orientativ. Prețul final se stabilește după evaluare.",
  factors: ["Suprafața și geometria", "Formatul și tipul plăcii", "Starea suportului", "Hidroizolație și instalații"],
  // Label must describe what actually happens: this scrolls to the form, it
  // does not compute anything (spec 06 forbids promising an interaction that
  // does not exist). A real estimator is blocked on owner pricing.
  cta: { label: "Cere o estimare", href: "#contact" },
  note: "Estimatorul nu este o ofertă contractuală (ADR-012).",
};

// Fotografii reale, livrate de proprietar și publicate din docs/poze prin
// scripts/build-media.mjs. Dreptul de publicare per proiect rămâne CONFIRM_OWNER:
// primirea fișierelor nu este acordul scris cerut de checklist D.31.
// Fotografii reale, livrate de proprietar și publicate din docs/poze prin
// scripts/build-media.mjs. Dreptul de publicare per proiect rămâne CONFIRM_OWNER:
// primirea fișierelor nu este acordul scris cerut de checklist D.31.
export const portfolio: PortfolioItem[] = [
  {
    slug: "baie-marmura-gri",
    title: "Renovare completă de baie — de la demolare la finisaj",
    type: "Demolare · instalații · placare · montaj sanitar",
    category: "Baie",
    featured: true,
    before: "/images/proiecte/baie-marmura-gri/01-inainte-demolare.jpg",
    beforeAlt:
      "Baie de bloc în demolare: faianța veche desprinsă, moloz pe pardoseală și sac de resturi lângă bateria demontată.",
    beforeFocal: "50% 40%",
    image: "/images/proiecte/baie-marmura-gri/09-dupa-ansamblu.jpg",
    imageAlt:
      "Vedere de ansamblu a băii finalizate: cabină de duș, lavoar cu mobilier alb și oglindă cu iluminare.",
    focal: "50% 50%",
  },
  {
    slug: "cada-placata-portelan",
    title: "Cadă placată în porțelan",
    type: "Muchii tăiate la 45° · tipar continuu",
    category: "Baie",
    image: "/images/proiecte/baie-cada-placata/01-cada-placata-ansamblu.jpg",
    imageAlt:
      "Cadă zidită și placată integral cu plăci aspect marmură, cu muchii tăiate la 45° și tipar continuu pe perete.",
    focal: "50% 55%",
  },
  {
    slug: "baie-marmura-alba",
    title: "Baie cu marmură albă și accent negru",
    type: "Porțelan lucios · duș fără prag",
    category: "Baie",
    image: "/images/proiecte/baie-marmura-alba/06-dupa-zona-dus.jpg",
    imageAlt:
      "Baie finalizată în plăci albe aspect marmură, lucioase, cu zonă de duș fără prag și coloană pentru rezervor încastrat.",
    focal: "50% 50%",
  },
  {
    slug: "baie-wc-suspendat",
    title: "Baie compactă cu WC suspendat",
    type: "Format mare aspect beton · nișă-poliță",
    category: "Baie",
    image: "/images/proiecte/baie-wc-suspendat/01-dupa-wc-suspendat.jpg",
    imageAlt:
      "Baie compactă finalizată, cu plăci de format mare aspect beton, WC suspendat cu clapetă încastrată și nișă-poliță.",
    focal: "50% 45%",
  },
  {
    slug: "cabina-dus-marmura-gri",
    title: "Cabină de duș în baie placată",
    type: "Aspect marmură gri · profile negre",
    category: "Baie",
    image: "/images/proiecte/baie-marmura-gri/08-dupa-cabina-dus.jpg",
    imageAlt:
      "Baie finalizată, cu cabină de duș semirotundă cu profile negre și pereți placați cu plăci aspect marmură gri.",
    focal: "50% 45%",
  },
  {
    slug: "perete-accent-marmura-neagra",
    title: "Perete de accent din marmură neagră",
    type: "Contrast alb–negru · rigolă liniară",
    category: "Baie",
    image: "/images/proiecte/baie-marmura-alba/08-dupa-accent-marmura-neagra.jpg",
    imageAlt:
      "Perete de accent din plăci aspect marmură neagră, în contrast cu placarea albă și rigola liniară din pardoseală.",
    focal: "50% 45%",
  },
  {
    slug: "nisa-wc-suspendat",
    title: "Nișă placată pentru WC suspendat",
    type: "Rezervor încastrat · colțuri la 45°",
    category: "Baie",
    image: "/images/proiecte/baie-cada-placata/03-nisa-wc-suspendat.jpg",
    imageAlt:
      "Nișă placată pentru rezervor încastrat de WC suspendat, cu poliță din plăci și colțuri tăiate la 45°.",
    focal: "50% 50%",
  },
  {
    slug: "hidroizolatie-si-incalzire-in-pardoseala",
    title: "Hidroizolație și încălzire în pardoseală",
    type: "În execuție · zonă umedă și rigolă",
    category: "Proces",
    image: "/images/proiecte/baie-marmura-alba/03-proces-hidroizolatie-si-incalzire.jpg",
    imageAlt:
      "Hidroizolație aplicată pe pardoseală și pereți, cu cablu de încălzire în pardoseală montat pe plasă și rigolă liniară.",
    focal: "50% 55%",
  },
  {
    slug: "placare-cu-sistem-de-nivelare",
    title: "Placare cu sistem de nivelare",
    type: "În execuție · plăci de format mare",
    category: "Proces",
    image: "/images/proiecte/baie-marmura-gri/06-proces-placare-cu-nivelare.jpg",
    imageAlt:
      "Placare de perete în execuție: plăci aspect marmură gri aliniate cu sistem de clipsuri de nivelare.",
    focal: "50% 50%",
  },
  {
    slug: "nisa-tehnica-si-polita",
    title: "Nișă tehnică și poliță placată",
    type: "În execuție · acces la apometru",
    category: "Proces",
    image: "/images/proiecte/baie-marmura-gri/04-proces-nisa-tehnica.jpg",
    imageAlt:
      "Nișă tehnică lăsată deschisă pentru apometru și tubulatura de ventilație, cu poliță placată și fixată cu bandă.",
    focal: "50% 35%",
  },
  {
    slug: "cuva-dus-zidita",
    title: "Cuvă de duș zidită pe rigolă liniară",
    type: "În execuție · BCA și șapă",
    category: "Proces",
    image: "/images/proiecte/compartimentari-si-cuva-dus/01-proces-cuva-dus-zidita.jpg",
    imageAlt:
      "Cuvă de duș zidită din blocuri BCA în jurul unei rigole liniare deja montate, pe șapă proaspătă.",
    focal: "50% 50%",
  },
  {
    slug: "fatada-si-scara-exterioara",
    title: "Fațadă ventilată și scară exterioară",
    type: "Placare exterioară · porțelan format mare",
    category: "Exterior",
    image: "/images/proiecte/fatada-si-scara-exterioara/01-fatada-si-scara.jpg",
    imageAlt:
      "Fațadă și scară exterioară placate cu plăci porțelanate de format mare, cu trepte și contratrepte aliniate.",
    focal: "50% 50%",
  },
  {
    slug: "trepte-si-terasa-in-executie",
    title: "Trepte și terasă în execuție",
    type: "În execuție · placare exterioară",
    category: "Exterior",
    image: "/images/proiecte/fatada-si-scara-exterioara/02-proces-trepte-si-terasa.jpg",
    imageAlt:
      "Scară exterioară în curs de placare, cu plăci poziționate pe terasă și clipsuri de nivelare.",
    focal: "50% 50%",
  },
];

/**
 * Empty until real, sourced, consented reviews exist (checklist G4).
 * A testimonial is quoted, never drafted — see DECISIONS D-007. Nothing may be
 * written here on the owner's behalf, and the section does not render while empty.
 */
export const reviews: Review[] = [];

/**
 * Empty until the owner answers (checklist F). Five questions whose answer was
 * literally "Conținut de confirmat cu proprietarul" used to render here as real
 * FAQ entries.
 */
export const faqs: Faq[] = [];
