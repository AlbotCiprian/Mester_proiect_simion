import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { locales } from "@/lib/i18n";
import { ui } from "@/lib/ui-dict";

/**
 * Personal data that must never reach the shipped source.
 *
 * The owner's IDNP was published for a few hours, behind a collapsed reveal, at
 * his own request, and removed the same day (D-030). A national identification
 * number on a public page is a permanent identity-theft surface: scrapers and
 * search engines pick it up within minutes and it cannot be recalled.
 *
 * The point of this file is that "we removed it" is not a control. Anyone
 * reading the old commit, an old decision record or an old screenshot can put
 * it back in thirty seconds — and this working tree is shared by more than one
 * agent session, which has already reverted the removal once. A failing test is
 * the only thing that actually stops it.
 */

const ROOT = path.resolve(import.meta.dirname, "..");

/** Everything compiled into or served by the site. Not docs, not git history. */
const SHIPPED_DIRS = ["app", "components", "lib", "config", "scripts", "public"];

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".txt",
  ".html",
  ".svg",
  ".xml",
  ".webmanifest",
]);

function walk(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, out);
    } else if (TEXT_EXT.has(path.extname(entry.name))) {
      if (statSync(full).size < 2_000_000) out.push(full);
    }
  }
  return out;
}

const files = SHIPPED_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));

describe("no national identification number reaches the shipped source", () => {
  it("scans a non-trivial number of files, so a silent zero is not a pass", () => {
    // Without this, a broken walk() would make every assertion below vacuous —
    // the most common way a scanning test rots into a no-op.
    assert.ok(files.length > 40, `only ${files.length} files scanned; the walk is broken`);
  });

  it("contains no IDNP-shaped 13-digit run", () => {
    // A Moldovan IDNP is exactly 13 digits. Lookarounds rather than \b so that a
    // 13-digit run inside a longer number is not reported, and a longer number
    // is not sliced into a false positive.
    const idnp = /(?<!\d)\d{13}(?!\d)/;
    for (const file of files) {
      const hit = idnp.exec(readFileSync(file, "utf8"));
      assert.equal(
        hit,
        null,
        `${path.relative(ROOT, file)} contains a 13-digit identifier "${hit?.[0]}". ` +
          `If it is not an IDNP, narrow this test deliberately; if it is, it must not ship (D-030).`,
      );
    }
  });

  it("never re-introduces the specific number that was published", () => {
    // Belt and braces: the regex above could be narrowed one day by someone who
    // does not know why it exists. This assertion cannot be satisfied by
    // accident. Split so the number is not itself a searchable literal here.
    const published = ["0990", "9032", "23519"].join("");
    for (const file of files) {
      assert.ok(
        !readFileSync(file, "utf8").includes(published),
        `${path.relative(ROOT, file)} re-introduces the owner's IDNP`,
      );
    }
  });
});

describe("the privacy notice still discharges the information duty", () => {
  const privacy = readFileSync(
    path.join(ROOT, "app", "(public)", "[locale]", "confidentialitate", "page.tsx"),
    "utf8",
  );

  it("names the controller", () => {
    // Removing the IDNP must not quietly take the identification with it: a form
    // that collects a phone number needs a named person standing behind it.
    assert.match(privacy, /const LEGAL_ENTITY = "[^"]{4,}"/, "no controller is named");
    assert.doesNotMatch(
      privacy,
      /const LEGAL_ENTITY: string \| null = null/,
      "the controller was gated back off",
    );
  });

  it("gives both a phone and an e-mail route for a data-subject request", () => {
    assert.match(privacy, /mailto:/, "no e-mail route for a data-subject request");
    assert.match(privacy, /tel:/, "no phone route for a data-subject request");
  });

  /**
   * The COPY moved to lib/ui-dict.ts when the notice became bilingual, so these
   * assert against the dictionary rather than the component — and against EVERY
   * locale, which is stronger than what they checked before. A Russian privacy
   * notice missing the cookie statement or the supervisory authority is not a
   * translation gap, it is a compliance gap.
   */
  for (const locale of locales) {
    const t = ui(locale);

    it(`[${locale}] states the cookie position`, () => {
      assert.ok(t.privacy.cookiesTitle.length > 0, "the cookie section disappeared");
      assert.ok(
        t.privacy.cookiesBody.length > 80,
        "the cookie statement is too short to say anything",
      );
    });

    it(`[${locale}] names the supervisory authority`, () => {
      // Romanian: "Centrului Național pentru Protecția Datelor…"
      // Russian:  "Национальный центр по защите персональных данных…"
      assert.match(
        t.privacy.rightsAuthority,
        /Centrul|Centrului|Национальный центр/,
        "no supervisory authority named",
      );
    });

    it(`[${locale}] names the two processors by name`, () => {
      const shared = t.privacy.sharedItems.join(" ");
      assert.match(shared, /Resend/, "Resend is not disclosed");
      assert.match(shared, /Vercel/, "Vercel is not disclosed");
    });

    it(`[${locale}] states the legal basis and the right to withdraw`, () => {
      assert.match(
        t.privacy.whyBody,
        /consimțământ|согласие|согласия/i,
        "consent is not named as the basis",
      );
      assert.match(
        t.privacy.whyBody,
        /retrage|отозвать/i,
        "the right to withdraw consent is missing",
      );
    });
  }
});
