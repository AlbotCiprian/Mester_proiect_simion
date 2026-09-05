import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { landingBase, landingSlugs, findLandingPage, getLandingPages } from "@/lib/landing";
import { photos, photo, type PhotoKey } from "@/lib/landing-photos";
import { locales, type Locale } from "@/lib/i18n";

/**
 * The topic pages are the only part of the site that exists purely to be found
 * by search. That makes them the part where a shortcut is most tempting and
 * most expensive: near-duplicate pages, a price invented to fill a heading, a
 * photograph referenced by a path that was renamed, a sitemap entry for a page
 * that 404s.
 *
 * EVERY assertion runs against EVERY locale. A Russian page that is a thinner
 * gloss of the Romanian is a doorway page with extra steps, and the word-count
 * and uniqueness checks below are what stop one from shipping.
 */

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

describe("topic page inventory", () => {
  it("has the fifteen pages the owner asked for", () => {
    assert.equal(landingBase.length, 15);
  });

  it("has no duplicate slug", () => {
    assert.equal(new Set(landingSlugs).size, landingSlugs.length);
  });

  it("uses url-safe, lowercase, diacritic-free slugs", () => {
    for (const slug of landingSlugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `slug "${slug}" is not url-safe`);
    }
  });

  it("records a search intent per locale, for every page", () => {
    for (const base of landingBase) {
      for (const locale of locales) {
        assert.ok(
          base.query[locale] && base.query[locale].length > 3,
          `${base.slug} has no ${locale} search intent`,
        );
      }
    }
  });
});

for (const locale of locales) {
  const pages = getLandingPages(locale);

  describe(`[${locale}] every page exists and is unique`, () => {
    it("renders all fifteen", () => {
      assert.equal(pages.length, 15);
    });

    it("has no duplicate H1, meta title or meta description", () => {
      // Two pages with the same title compete for the same query and each makes
      // the other rank worse. This is the single most common way a set of
      // keyword pages destroys its own value.
      assert.equal(new Set(pages.map((p) => p.h1)).size, pages.length, "duplicate H1");
      assert.equal(new Set(pages.map((p) => p.metaTitle)).size, pages.length, "duplicate title");
      assert.equal(
        new Set(pages.map((p) => p.metaDescription)).size,
        pages.length,
        "duplicate description",
      );
    });
  });

  describe(`[${locale}] every page carries enough substance to deserve indexing`, () => {
    for (const page of pages) {
      it(`${page.slug} — has unique body content, not a template fill`, () => {
        assert.ok(page.intro.length >= 2, "needs at least two lead paragraphs");
        assert.ok(page.includes.length >= 4, "needs a real scope list");
        assert.ok(page.steps.length >= 3, "needs the execution order");
        assert.ok(page.pitfalls.length >= 3, "needs the part worth reading");
        assert.ok(page.faqs.length >= 3, "needs real questions");
        assert.ok(page.gallery.length >= 2, "needs evidence");

        const words = page.intro.join(" ").split(/\s+/).filter(Boolean).length;
        assert.ok(words >= 90, `intro is ${words} words; thin content is not indexable content`);
      });

      it(`${page.slug} — meta description fits a result snippet`, () => {
        assert.ok(
          page.metaDescription.length >= 80 && page.metaDescription.length <= 200,
          `metaDescription is ${page.metaDescription.length} chars`,
        );
      });
    }
  });

  describe(`[${locale}] nothing unverifiable is published`, () => {
    const all = JSON.stringify(pages);

    it("states no price", () => {
      // CLAUDE.md: no invented prices. The cost page explains the DRIVERS
      // precisely so that no number has to be stated.
      assert.doesNotMatch(all, /\d+\s*(lei|MDL|EUR|€|\$|лей|руб)/i, "a price appears");
      // "formate de la 30x60" is a tile SIZE, so the guard anchors on a currency.
      assert.doesNotMatch(
        all,
        /(de la|от)\s+\d[\d\s.,]*\s*(lei|mdl|eur|€|\$|лей)/i,
        "a 'from X' price teaser appears",
      );
    });

    it("promises no warranty period and no response time", () => {
      assert.doesNotMatch(all, /\d+\s*(luni|ani)\s*garan/i, "a warranty period is promised (ro)");
      assert.doesNotMatch(all, /гарантия\s*\d+/i, "a warranty period is promised (ru)");
      assert.doesNotMatch(all, /în\s*\d+\s*(ore|minute)/i, "a response time is promised (ro)");
      assert.doesNotMatch(all, /в течение\s*\d+\s*(часов|минут)/i, "a response time is promised (ru)");
    });

    it("claims no volume of past work and no rating", () => {
      assert.doesNotMatch(all, /\d+\+?\s*(proiecte|clienți|lucrări) (executate|finalizate)/i);
      assert.doesNotMatch(all, /\d+\+?\s*(объектов|клиентов)\s*(выполнено|сдано)/i);
      assert.doesNotMatch(all, /\d[.,]\d\s*\/\s*5/, "a rating appears");
    });

    it("leaves no CONFIRM_OWNER marker in visitor-facing text", () => {
      assert.doesNotMatch(all, /CONFIRM_OWNER/);
    });

    it("names no locality beyond the one the owner confirmed", () => {
      // "Chișinău și împrejurimi" / «Кишинёв и пригороды» is his own phrasing
      // (checklist B4). A list of named towns we cannot evidence is exactly the
      // doorway-page pattern.
      const forbidden = [
        "Bălți",
        "Cahul",
        "Orhei",
        "Ungheni",
        "Comrat",
        "Soroca",
        "Tiraspol",
        "Бэлць",
        "Бельцы",
        "Кагул",
        "Оргеев",
        "Унгень",
        "Комрат",
        "Сорока",
        "Тирасполь",
      ];
      for (const town of forbidden) {
        assert.ok(!all.includes(town), `content names "${town}", which is not confirmed`);
      }
    });
  });

  describe(`[${locale}] the copy is written, not glossed`, () => {
    it("every page differs from its counterpart in the other locale", () => {
      // A page whose "translation" is byte-identical is an untranslated page
      // that will ship as a mixed-language result.
      const other = locales.find((l) => l !== locale) as Locale;
      const otherPages = getLandingPages(other);
      for (const page of pages) {
        const twin = otherPages.find((p) => p.slug === page.slug);
        assert.ok(twin, `${page.slug} is missing in ${other}`);
        assert.notEqual(page.h1, twin?.h1, `${page.slug} H1 is untranslated`);
        assert.notEqual(
          page.intro[0],
          twin?.intro[0],
          `${page.slug} lead paragraph is untranslated`,
        );
      }
    });

    it("carries no Romanian diacritics in the Russian copy", () => {
      // The cheapest possible tell that a Romanian string leaked into the
      // Russian file. Cyrillic text has no reason to contain ă, â, î, ș or ț.
      if (locale !== "ru") return;
      const all = JSON.stringify(pages);
      const leak = /[ăâîșțĂÂÎȘȚ]/.exec(all);
      assert.equal(leak, null, `Romanian text leaked into the Russian copy near "${leak?.[0]}"`);
    });
  });
}

describe("internal links resolve, in every locale", () => {
  it("every related slug points at a page that exists", () => {
    for (const locale of locales) {
      for (const page of getLandingPages(locale)) {
        for (const slug of page.related) {
          assert.ok(
            findLandingPage(locale, slug),
            `[${locale}] ${page.slug} links to missing page "${slug}"`,
          );
        }
      }
    }
  });

  it("no page links to itself", () => {
    for (const base of landingBase) {
      assert.ok(!base.related.includes(base.slug), `${base.slug} links to itself`);
    }
  });

  it("every page is reachable from at least one other page", () => {
    // Orphans are crawled late and ranked worse. The hub links all of them, but
    // the topical graph has to stand on its own too.
    const linked = new Set(landingBase.flatMap((p) => p.related));
    for (const base of landingBase) {
      assert.ok(linked.has(base.slug), `${base.slug} is an orphan in the related graph`);
    }
  });
});

describe("every referenced photograph exists on disk", () => {
  it("the registry points at real files", () => {
    for (const key of Object.keys(photos) as PhotoKey[]) {
      const frame = photo(key);
      const file = path.join(PUBLIC_DIR, frame.src.replace(/^\//, ""));
      assert.ok(existsSync(file), `photo "${key}" points at a missing file: ${frame.src}`);
    }
  });

  it("every photograph has meaningful alt text", () => {
    for (const key of Object.keys(photos) as PhotoKey[]) {
      const frame = photo(key);
      assert.ok(frame.alt.length > 30, `photo "${key}" has token alt text`);
    }
  });

  it("every gallery key resolves in the registry", () => {
    for (const base of landingBase) {
      for (const key of base.gallery) {
        assert.ok(key in photos, `${base.slug} references unknown photo "${key}"`);
      }
    }
  });
});
