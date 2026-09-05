import type { Locale } from "@/lib/i18n";
import type { PhotoKey } from "@/lib/landing-photos";
import { landingTextRo } from "@/lib/landing-text-ro";
import { landingTextRu } from "@/lib/landing-text-ru";

/**
 * The fifteen topic pages under /ro/servicii/ and /ru/servicii/.
 *
 * WHAT THESE ARE NOT: doorway pages. `.claude/rules/seo-accessibility.md`
 * forbids them verbatim, and D-010 already refused a request for keyword URLs
 * that redirect to the homepage. Every page answers a different question with
 * different technical substance, shows different photographs of work that was
 * actually done, and can be read start to finish by someone who will never hire
 * us and still be worth their time. That is the test each one has to pass — in
 * BOTH languages: a Russian page that is a thinner gloss of the Romanian is a
 * doorway page with extra steps.
 *
 * WHAT THEY MAY NOT CONTAIN (CLAUDE.md, non-negotiable):
 *  - no price, no price range, no "de la X lei" / «от X лей». The cost page
 *    explains what DRIVES the cost precisely so no number has to be invented;
 *  - no warranty period, no response time, no "peste N proiecte";
 *  - no named locality we cannot evidence. "Chișinău și împrejurimi" /
 *    «Кишинёв и пригороды» is the owner's own phrasing and is as specific as we
 *    may be;
 *  - no review, no rating, no client name or address.
 *
 * SHAPE. The slug, the search intent, the photographs and the sibling links are
 * language-independent and live in `landingBase`, declared once. Every word a
 * reader sees lives in `lib/landing-text-{ro,ru}.ts`, keyed by the same slug.
 * `Record<Locale, ...>` makes a missing translation a compile-time or
 * test-time failure instead of a page that renders half in Romanian.
 */

export interface LandingBlock {
  title: string;
  body: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

/** Everything a reader sees. One of these per page, per language. */
export interface LandingText {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  /** Lead paragraphs. The first is also the page summary in JSON-LD. */
  intro: string[];
  /** Scope: what the work concretely includes. */
  includes: string[];
  /** Execution order. The part a competitor cannot copy from a catalogue. */
  steps: LandingBlock[];
  /** The mistakes that cost money later. The reason to read the page. */
  pitfalls: LandingBlock[];
  /** What we have to see before anyone can put a number on the work. */
  costFactors?: string[];
  faqs: LandingFaq[];
}

/** Language-independent facts about a page. */
export interface LandingBase {
  slug: string;
  /**
   * The search intent the page was written for, per language. Internal only —
   * never rendered. It exists so a later editor can tell whether a rewrite
   * still serves the same reader, and so the Russian page is understood as
   * targeting Russian queries rather than being a translation exercise.
   */
  query: Record<Locale, string>;
  gallery: PhotoKey[];
  /** Slugs of sibling pages. Two-way links are checked by tests/landing.test.ts. */
  related: string[];
}

export type LandingPage = LandingBase & LandingText;

export const landingBase: LandingBase[] = [
  {
    slug: "montaj-gresie-faianta",
    query: { ro: "montaj gresie faianta chisinau", ru: "укладка плитки кишинев" },
    gallery: ["griSuport", "griPrimeleRanduri", "griNivelare", "griRosturi", "griAnsamblu"],
    related: ["placi-format-mare", "renovare-baie-la-cheie", "cat-costa-montajul-gresie-faianta"],
  },
  {
    slug: "renovare-baie-la-cheie",
    query: { ro: "renovare baie la cheie chisinau", ru: "ремонт ванной под ключ кишинев" },
    gallery: ["griInainte", "griColoana", "albaHidro", "griNivelare", "griAnsamblu", "griLavoar"],
    related: ["reparatie-baie", "hidroizolatie-baie", "montaj-wc-suspendat"],
  },
  {
    slug: "reparatie-baie",
    query: { ro: "reparatii baie apartament", ru: "ремонт ванной комнаты в квартире" },
    gallery: ["griInainte", "griSuport", "albaRigola", "griRosturi"],
    related: ["renovare-baie-la-cheie", "hidroizolatie-baie", "montaj-gresie-faianta"],
  },
  {
    slug: "hidroizolatie-baie",
    query: { ro: "hidroizolatie baie", ru: "гидроизоляция ванной комнаты" },
    gallery: ["albaHidro", "albaRigola", "albaCablu", "cuvaDus"],
    related: ["dus-fara-prag-cuva-zidita", "renovare-baie-la-cheie", "incalzire-in-pardoseala"],
  },
  {
    slug: "dus-fara-prag-cuva-zidita",
    query: { ro: "dus fara prag rigola liniara", ru: "душ без порога линейный трап" },
    gallery: ["cuvaDus", "albaRigola", "albaHidro", "albaDus", "albaAnsamblu"],
    related: ["hidroizolatie-baie", "placare-cada-baie", "renovare-baie-la-cheie"],
  },
  {
    slug: "placare-cada-baie",
    query: { ro: "placare cada baie gresie", ru: "облицовка ванны плиткой" },
    gallery: ["cadaAnsamblu", "cadaMuchii", "cadaNisaWc"],
    related: ["montaj-gresie-faianta", "teracota", "renovare-baie-la-cheie"],
  },
  {
    slug: "montaj-wc-suspendat",
    query: {
      ro: "montaj wc suspendat rezervor incastrat",
      ru: "установка подвесного унитаза инсталляция",
    },
    gallery: ["wcSuspendat", "cadaNisaWc", "griNisa", "albaDus"],
    related: ["renovare-baie-la-cheie", "placi-format-mare", "montaj-gresie-faianta"],
  },
  {
    slug: "teracota",
    query: { ro: "teracota mester chisinau", ru: "терракота мастер кишинев" },
    gallery: ["cadaMuchii", "cadaAnsamblu", "albaAccentNegru", "griRosturi"],
    related: ["montaj-gresie-faianta", "placi-format-mare", "mester-gresie-faianta-chisinau"],
  },
  {
    slug: "placare-terasa",
    query: { ro: "placare terasa gresie exterior", ru: "укладка плитки на террасе" },
    gallery: ["trepteTerasa", "fatadaScara"],
    related: ["placare-scari-trepte", "placare-fatada", "placi-format-mare"],
  },
  {
    slug: "placare-scari-trepte",
    query: { ro: "placare scari trepte exterioare", ru: "облицовка ступеней лестницы" },
    gallery: ["fatadaScara", "trepteTerasa"],
    related: ["placare-terasa", "placare-fatada", "montaj-gresie-faianta"],
  },
  {
    slug: "placare-fatada",
    query: { ro: "placare fatada placi portelanate", ru: "облицовка фасада керамогранитом" },
    gallery: ["fatadaScara", "trepteTerasa"],
    related: ["placare-terasa", "placare-scari-trepte", "placi-format-mare"],
  },
  {
    slug: "incalzire-in-pardoseala",
    query: { ro: "incalzire in pardoseala sub gresie", ru: "тёплый пол под плитку" },
    gallery: ["albaCablu", "albaHidro", "albaAnsamblu"],
    related: ["hidroizolatie-baie", "renovare-baie-la-cheie", "montaj-gresie-faianta"],
  },
  {
    slug: "placi-format-mare",
    query: { ro: "montaj placi format mare 120x60", ru: "укладка крупноформатной плитки" },
    gallery: ["griPrimeleRanduri", "griNivelare", "wcSuspendat", "albaAnsamblu"],
    related: ["montaj-gresie-faianta", "placare-fatada", "cat-costa-montajul-gresie-faianta"],
  },
  {
    slug: "mester-gresie-faianta-chisinau",
    query: { ro: "mester gresie faianta chisinau", ru: "плиточник кишинев" },
    gallery: [
      "griInainte",
      "griNivelare",
      "griAnsamblu",
      "albaHidro",
      "cadaAnsamblu",
      "fatadaScara",
    ],
    related: ["montaj-gresie-faianta", "renovare-baie-la-cheie", "cat-costa-montajul-gresie-faianta"],
  },
  {
    slug: "cat-costa-montajul-gresie-faianta",
    query: { ro: "pret montaj gresie faianta", ru: "сколько стоит укладка плитки" },
    gallery: ["griInainte", "griSuport", "griNivelare", "griAnsamblu"],
    related: ["montaj-gresie-faianta", "renovare-baie-la-cheie", "mester-gresie-faianta-chisinau"],
  },
];

const text: Record<Locale, Record<string, LandingText>> = {
  ro: landingTextRo,
  ru: landingTextRu,
};

/** Every landing slug, for the sitemap and for generateStaticParams. */
export const landingSlugs: string[] = landingBase.map((page) => page.slug);

export function getLandingPages(locale: Locale): LandingPage[] {
  return landingBase.map((base) => {
    const copy = text[locale][base.slug];
    if (!copy) {
      // Unreachable while the text files are complete, and tests/landing.test.ts
      // asserts that they are. Throwing beats rendering a page with no words.
      throw new Error(`[landing] missing ${locale} copy for "${base.slug}"`);
    }
    return { ...base, ...copy };
  });
}

export function findLandingPage(locale: Locale, slug: string): LandingPage | undefined {
  const base = landingBase.find((page) => page.slug === slug);
  if (!base) return undefined;
  const copy = text[locale][slug];
  return copy ? { ...base, ...copy } : undefined;
}
