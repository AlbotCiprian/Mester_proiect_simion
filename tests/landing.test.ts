import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { landingPages, landingSlugs, findLandingPage } from "@/lib/landing";
import { photos, photo, type PhotoKey } from "@/lib/landing-photos";

/**
 * The fifteen topic pages are the only part of the site that exists purely to
 * be found by search. That makes them the part where a shortcut is most
 * tempting and most expensive: near-duplicate pages, a price invented to fill a
 * heading, a photograph referenced by a path that was renamed, a sitemap entry
 * for a page that 404s.
 *
 * Every assertion below is one of those failures, made impossible to ship.
 */

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

describe("topic page inventory", () => {
  it("has the fifteen pages the owner asked for", () => {
    assert.equal(landingPages.length, 15);
  });

  it("has no duplicate slug", () => {
    assert.equal(new Set(landingSlugs).size, landingSlugs.length);
  });

  it("has no duplicate H1 or meta title", () => {
    // Two pages with the same title compete for the same query and each makes
    // the other rank worse. This is the single most common way a set of
    // keyword pages destroys its own value.
    assert.equal(new Set(landingPages.map((p) => p.h1)).size, landingPages.length);
    assert.equal(new Set(landingPages.map((p) => p.metaTitle)).size, landingPages.length);
    assert.equal(
      new Set(landingPages.map((p) => p.metaDescription)).size,
      landingPages.length,
    );
  });

  it("uses url-safe, lowercase, diacritic-free slugs", () => {
    for (const slug of landingSlugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `slug "${slug}" is not url-safe`);
    }
  });
});

describe("every page carries enough substance to deserve indexing", () => {
  for (const page of landingPages) {
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

describe("nothing unverifiable is published", () => {
  // Serialise once; a claim can hide in any field.
  const all = JSON.stringify(landingPages);

  it("states no price", () => {
    // CLAUDE.md: no invented prices. "cat-costa" explains the DRIVERS of cost
    // precisely so that no number has to be stated.
    assert.doesNotMatch(all, /\d+\s*(lei|MDL|EUR|€|\$)/i, "a price appears in the content");
    // "formate de la 30×60" is a tile SIZE, not an amount, so the guard has to
    // anchor on a currency. That also keeps it working the day a page
    // legitimately quotes a dimension range.
    assert.doesNotMatch(
      all,
      /de la\s+\d[\d\s.,]*\s*(lei|mdl|eur|€|\$)/i,
      "a 'de la X lei' price teaser appears",
    );
  });

  it("promises no warranty period and no response time", () => {
    assert.doesNotMatch(all, /\d+\s*(luni|ani)\s*garan/i, "a warranty period is promised");
    assert.doesNotMatch(all, /în\s*\d+\s*(ore|minute)/i, "a response time is promised");
  });

  it("claims no volume of past work and no rating", () => {
    assert.doesNotMatch(all, /\d+\+?\s*(proiecte|clienți|lucrări) (executate|finalizate)/i);
    assert.doesNotMatch(all, /\d[.,]\d\s*\/\s*5/, "a rating appears");
  });

  it("leaves no CONFIRM_OWNER marker in visitor-facing text", () => {
    assert.doesNotMatch(all, /CONFIRM_OWNER/);
  });

  it("names no locality beyond the one the owner confirmed", () => {
    // "Chișinău și împrejurimi" is his own phrasing (checklist B4). A list of
    // named towns we cannot evidence is exactly the doorway-page pattern.
    const forbidden = ["Bălți", "Cahul", "Orhei", "Ungheni", "Comrat", "Soroca", "Tiraspol"];
    for (const town of forbidden) {
      assert.ok(!all.includes(town), `content names "${town}", which is not confirmed`);
    }
  });
});

describe("internal links resolve", () => {
  it("every related slug points at a page that exists", () => {
    for (const page of landingPages) {
      for (const slug of page.related) {
        assert.ok(findLandingPage(slug), `${page.slug} links to missing page "${slug}"`);
      }
    }
  });

  it("no page links to itself", () => {
    for (const page of landingPages) {
      assert.ok(!page.related.includes(page.slug), `${page.slug} links to itself`);
    }
  });

  it("every page is reachable from at least one other page", () => {
    // Orphans are crawled late and ranked worse. The footer links all of them
    // sitewide, but the topical graph has to stand on its own too.
    const linked = new Set(landingPages.flatMap((p) => p.related));
    for (const page of landingPages) {
      assert.ok(linked.has(page.slug), `${page.slug} is an orphan in the related graph`);
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
    for (const page of landingPages) {
      for (const key of page.gallery) {
        assert.ok(key in photos, `${page.slug} references unknown photo "${key}"`);
      }
    }
  });
});
