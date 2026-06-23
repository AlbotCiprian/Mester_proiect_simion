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
  type: "phone" | "viber" | "telegram" | "email";
  label: string;
  href: string;
  confirm: ConfirmFlag;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  type: string;
  location: string;
  image: string;
  imageAlt: string;
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

export const site = {
  // CONFIRM_OWNER: legal + commercial name, domain, logo.
  name: "Atelier Teracota",
  shortName: "Atelier Teracota",
  tagline: "Placări și renovări de baie executate cu precizie",
  // CONFIRM_OWNER: real coverage area.
  serviceArea: "Chișinău și împrejurimi",
  confirm: CONFIRM,
};

export const channels: Channel[] = [
  // CONFIRM_OWNER: every real contact channel and number.
  { type: "phone", label: "+373 00 000 000", href: "tel:+37300000000", confirm: CONFIRM },
  { type: "viber", label: "Viber", href: "#", confirm: CONFIRM },
  { type: "telegram", label: "Telegram", href: "#", confirm: CONFIRM },
  { type: "email", label: "contact@example.md", href: "mailto:contact@example.md", confirm: CONFIRM },
];

export const nav = [
  { label: "Servicii", href: "#servicii" },
  { label: "Proiecte", href: "#proiecte" },
  { label: "Proces", href: "#proces" },
  { label: "Prețuri", href: "#preturi" },
  { label: "Despre", href: "#despre" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  kicker: "Atelier de placări ceramice · Moldova",
  // CONFIRM_OWNER: final headline / value proposition.
  headline: "Suprafețe ceramice cu rost perfect, baie cu baie.",
  subhead:
    "Montaj de gresie, faianță și teracotă și renovări complete de baie, prezentate transparent prin proiecte reale și estimate rapid pe baza situației tale.",
  primaryCta: { label: "Cere o estimare", href: "#contact" },
  secondaryCta: { label: "Vezi proiectele", href: "#proiecte" },
  image:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1920&q=80",
  imageAlt:
    "Baie modernă placată cu gresie de format mare și rosturi fine (imagine demonstrativă)",
};

export const trustFacts = [
  // CONFIRM_OWNER: every figure must be verifiable before publication.
  { value: "10+", label: "ani de experiență", confirm: CONFIRM },
  { value: "200+", label: "proiecte finalizate", confirm: CONFIRM },
  { value: "24 luni", label: "garanție lucrări", confirm: CONFIRM },
  { value: "Chișinău", label: "+ zone deservite", confirm: CONFIRM },
];

export const services: Service[] = [
  {
    slug: "gresie-faianta",
    title: "Montaj gresie și faianță",
    summary:
      "Placare precisă pe pereți și pardoseli, cu pregătirea corectă a suportului și rosturi calibrate.",
    bullets: ["Nivel laser și suport plan", "Tăieturi și colțuri la 45°", "Rosturi uniforme, etanșe"],
    image:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Detaliu de faianță montată pe perete (imagine demonstrativă)",
  },
  {
    slug: "renovari-bai",
    title: "Renovări de baie la cheie",
    summary:
      "Coordonăm tot procesul — de la demontare și hidroizolație până la finisaje și montaj sanitar.",
    bullets: ["Hidroizolație în zonele umede", "Trasee apă și canalizare", "Finisaje și montaj obiecte"],
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Baie renovată complet, vedere de ansamblu (imagine demonstrativă)",
  },
  {
    slug: "teracota-sobe",
    title: "Teracotă și plăci ceramice",
    summary:
      "Lucrări de teracotă și placări ceramice decorative, cu atenție la tipar, ton și aliniere.",
    bullets: ["Selectarea tiparului", "Aliniere pe module", "Detalii de racord curate"],
    image:
      "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Plăci ceramice cu textură caldă (imagine demonstrativă)",
  },
  {
    slug: "placari-exterioare",
    title: "Placări exterioare și terase",
    summary:
      "Placări rezistente la îngheț pentru terase, scări și fațade, cu pante și rosturi tehnice corecte.",
    bullets: ["Adezivi pentru exterior", "Pante de scurgere", "Rosturi de dilatare"],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Terasă placată cu gresie de exterior (imagine demonstrativă)",
  },
];

export const flagship = {
  kicker: "Proiect reprezentativ",
  // CONFIRM_OWNER: real project, media and right to publish (checklist D).
  title: "Baie cu travertin și nișă iluminată",
  location: "Chișinău (exemplu)",
  summary:
    "O baie de familie regândită complet: format mare de placare, nișă integrată și rosturi continue pe trei planuri.",
  challenge:
    "Pereți neregulați și un calandru de instalații care complica alinierea plăcilor de format mare.",
  approach:
    "Am corectat planul suportului, am pretrasat fiecare rând și am poziționat nișa pe modul, păstrând rostul continuu.",
  result:
    "O suprafață citită ca un singur material, cu racorduri curate și întreținere ușoară.",
  metrics: [
    { value: "18 m²", label: "suprafață placată", confirm: CONFIRM },
    { value: "12 zile", label: "durată execuție", confirm: CONFIRM },
    { value: "120×60", label: "format plăci (cm)", confirm: CONFIRM },
  ],
  image:
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
  imageAlt: "Baie placată cu travertin și nișă iluminată (imagine demonstrativă)",
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
  cta: { label: "Calculează orientativ", href: "#contact" },
  note: "Estimatorul nu este o ofertă contractuală (ADR-012).",
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "baie-travertin",
    title: "Baie cu travertin",
    type: "Renovare baie",
    location: "Chișinău (exemplu)",
    image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Baie placată în tonuri calde (imagine demonstrativă)",
  },
  {
    slug: "bucatarie-faianta",
    title: "Faianță bucătărie",
    type: "Montaj faianță",
    location: "Chișinău (exemplu)",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Faianță montată pe peretele bucătăriei (imagine demonstrativă)",
  },
  {
    slug: "dus-format-mare",
    title: "Duș format mare",
    type: "Placare gresie",
    location: "Chișinău (exemplu)",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Cabină de duș placată cu plăci de format mare (imagine demonstrativă)",
  },
  {
    slug: "terasa-exterior",
    title: "Terasă exterioară",
    type: "Placare exterior",
    location: "Chișinău (exemplu)",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Terasă placată cu gresie de exterior (imagine demonstrativă)",
  },
];

export const reviews: Review[] = [
  // CONFIRM_OWNER: real reviews with source/consent only (checklist F, spec 09).
  {
    quote: "Text recenzie reală — se publică doar cu sursă și consimțământ.",
    author: "Client (exemplu)",
    context: "Renovare baie · sursă de confirmat",
    confirm: CONFIRM,
  },
  {
    quote: "Text recenzie reală — se publică doar cu sursă și consimțământ.",
    author: "Client (exemplu)",
    context: "Montaj gresie · sursă de confirmat",
    confirm: CONFIRM,
  },
];

export const faqs: Faq[] = [
  { q: "Faceți și demontarea plăcilor vechi?", a: "Conținut de confirmat cu proprietarul (CONFIRM_OWNER)." },
  { q: "Lucrați cu materialele clientului?", a: "Conținut de confirmat cu proprietarul (CONFIRM_OWNER)." },
  { q: "În cât timp primesc o estimare?", a: "Conținut de confirmat cu proprietarul (CONFIRM_OWNER)." },
  { q: "Ce garanție oferiți?", a: "Conținut de confirmat cu proprietarul (CONFIRM_OWNER)." },
  { q: "În ce localități vă deplasați?", a: "Conținut de confirmat cu proprietarul (CONFIRM_OWNER)." },
];
