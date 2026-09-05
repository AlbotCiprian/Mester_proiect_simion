import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

/**
 * Guards against two incidents that already happened once each, and one that
 * would happen at the Gate A flip.
 *
 * 1. `/proces` was listed in the sitemap for a whole release. It is an in-page
 *    anchor, not a route, so a third of the submitted sitemap would have 404'd
 *    on the first crawl. It was caught by a human reading the file.
 * 2. Nav entries are anchors on the homepage; a route added to the sitemap
 *    without a matching directory is invisible until Google reports it.
 * 3. Gate A must not open while any unverifiable claim is still in the content.
 *
 * These read the source files as text rather than importing them, because the
 * route modules pull in `server-only` and Next's request context.
 */

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALE_DIR = path.join(ROOT, "app", "(public)", "[locale]");

function read(relative: string): string {
  return readFileSync(path.join(ROOT, relative), "utf8");
}

/** Directory names under app/(public)/[locale]/ that are real routes. */
function realRouteSegments(): string[] {
  return readdirSync(LOCALE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .filter((entry) => existsSync(path.join(LOCALE_DIR, entry.name, "page.tsx")))
    .map((entry) => entry.name);
}

describe("sitemap", () => {
  const source = read("app/sitemap.ts");

  /** Paths in the ROUTES literal, e.g. "" and "/confidentialitate". */
  const declared = [...source.matchAll(/\{\s*path:\s*"([^"]*)"\s*\}/g)].map((m) => m[1] ?? "");

  it("declares at least the homepage", () => {
    assert.ok(declared.includes(""), "the homepage must be in the sitemap");
  });

  it("every declared route resolves to a real page directory", () => {
    const real = realRouteSegments();
    for (const declaredPath of declared) {
      if (declaredPath === "") continue; // the homepage is [locale]/page.tsx
      // First segment only: a nested route like /servicii/<slug> lives under the
      // /servicii directory and its second half is a dynamic segment.
      const segment = declaredPath.replace(/^\//, "").split("/")[0] ?? "";
      assert.ok(
        real.includes(segment),
        `sitemap lists "${declaredPath}" but app/(public)/[locale]/${segment}/page.tsx does not exist`,
      );
    }
  });

  it("never lists an in-page anchor", () => {
    for (const declaredPath of declared) {
      assert.ok(!declaredPath.includes("#"), `"${declaredPath}" is an anchor, not a route`);
    }
  });

  it("derives the topic pages from lib/landing.ts, not from a second typed list", () => {
    // The route module builds its static params from the same array. A second
    // hand-maintained list here is exactly how a sitemap comes to advertise a
    // URL that 404s — which is incident 1 above, in a new costume.
    assert.match(
      source,
      /import\s*\{[^}]*landingSlugs[^}]*\}\s*from\s*"@\/lib\/landing"/,
      "sitemap must import landingSlugs",
    );

    const routeFile = "app/(public)/[locale]/servicii/[slug]/page.tsx";
    assert.ok(existsSync(path.join(ROOT, routeFile)), `${routeFile} must exist`);
    const route = read(routeFile);
    assert.match(
      route,
      /import\s*\{[^}]*landingSlugs[^}]*\}\s*from\s*"@\/lib\/landing"/,
      "the route must generate its params from the same array the sitemap uses",
    );
    assert.match(
      route,
      /export const dynamicParams = false/,
      "an open dynamic segment renders a thin page for any URL somebody guesses",
    );
  });

  it("is driven off publishedLocales, never the full locale list", () => {
    // Check what is IMPORTED, not what the prose mentions — the file's own
    // comment explains why `locales` must not be used, and a naive text match
    // trips on that explanation.
    const imports = [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"@\/lib\/i18n"/g)]
      .flatMap((m) => (m[1] ?? "").split(","))
      .map((name) => name.trim())
      .filter(Boolean);
    assert.ok(imports.includes("publishedLocales"), "sitemap must import publishedLocales");
    assert.ok(
      !imports.includes("locales"),
      "sitemap imports `locales`; listing the unpublished /ru stub submits thin content for indexing",
    );
  });
});

describe("navigation", () => {
  it("every nav entry is an anchor, so navHref can prefix the locale", () => {
    // A bare "#servicii" resolves against the CURRENT path, so on any route
    // other than the homepage every nav item becomes a dead link.
    const content = read("lib/content.ts");
    const navBlock = content.slice(content.indexOf("export const nav = ["));
    const hashes = [...navBlock.slice(0, navBlock.indexOf("];")).matchAll(/hash:\s*"([^"]*)"/g)];
    assert.ok(hashes.length > 0, "nav must declare hashes");
    for (const [, hash] of hashes) {
      assert.ok(hash?.startsWith("#"), `nav hash "${hash}" must start with #`);
    }
  });

  it("every nav anchor targets a section id that exists in the page", () => {
    const content = read("lib/content.ts");
    const sections = read("components/public/home-sections.tsx");
    const navBlock = content.slice(content.indexOf("export const nav = ["));
    const hashes = [...navBlock.slice(0, navBlock.indexOf("];")).matchAll(/hash:\s*"#([^"]*)"/g)];
    for (const [, id] of hashes) {
      assert.ok(
        sections.includes(`id="${id}"`),
        `nav points at #${id} but no section renders id="${id}"`,
      );
    }
  });

  it("every navPages entry points at a route that exists", () => {
    const content = read("lib/content.ts");
    const block = content.slice(content.indexOf("export const navPages = ["));
    const paths = [...block.slice(0, block.indexOf("];")).matchAll(/path:\s*"\/([^"]*)"/g)];
    assert.ok(paths.length > 0, "navPages must declare at least one route");
    const real = realRouteSegments();
    for (const [, segment] of paths) {
      assert.ok(real.includes(segment ?? ""), `navPages points at /${segment}, which has no page`);
    }
  });
});

describe("the contact anchor resolves on every public route", () => {
  /**
   * The header CTA and the mobile bar use a RELATIVE "#contact". That is a
   * deliberate conversion decision — it keeps a reader on the page they are
   * reading — and it turns into a dead button the moment a route ships without
   * the target. So the target is a build-time requirement, not a convention.
   */
  const sources: Array<[string, string]> = [
    ["homepage", "components/public/home-sections.tsx"],
    ["topic page", "components/public/landing-sections.tsx"],
    ["services hub", "app/(public)/[locale]/servicii/page.tsx"],
    ["privacy notice", "app/(public)/[locale]/confidentialitate/page.tsx"],
  ];

  for (const [name, file] of sources) {
    it(`${name} renders id="contact"`, () => {
      assert.match(read(file), /id="contact"/, `${file} has no #contact target`);
    });
  }
});

describe("Gate A preconditions are enforced by code, not by a checklist", () => {
  const indexability = read("config/indexability.mjs");
  const gateOpen = /export const GATE_A_COMPLETE = true/.test(indexability);

  it("does not open while the privacy notice has no data controller", () => {
    if (!gateOpen) return;
    const privacy = read("app/(public)/[locale]/confidentialitate/page.tsx");
    assert.doesNotMatch(
      privacy,
      /const LEGAL_ENTITY: string \| null = null/,
      "Gate A is open but the privacy notice still names no controller (checklist A4)",
    );
  });

  it("does not open while a service is flagged as lacking a supporting photo", () => {
    if (!gateOpen) return;
    const content = read("lib/content.ts");
    assert.doesNotMatch(
      content,
      /imageConfirm:\s*CONFIRM/,
      "Gate A is open but a service still carries imageConfirm — it would be claimed in JSON-LD and llms.txt with no work to show",
    );
  });

  it("does not open while placeholder metrics would render", () => {
    if (!gateOpen) return;
    const content = read("lib/content.ts");
    assert.doesNotMatch(content, /value:\s*"—"/, "Gate A is open but a placeholder metric remains");
  });

  it("does not open while a visitor-facing CONFIRM_OWNER string would render", () => {
    if (!gateOpen) return;
    // The flag on the TYPE and the constant that defines it are fine; a value
    // assigned into rendered content is not.
    const content = read("lib/content.ts");
    assert.doesNotMatch(
      content,
      /(title|summary|label|body|quote|value):\s*(CONFIRM|"CONFIRM_OWNER")/,
      "Gate A is open but a rendered field is still a CONFIRM_OWNER placeholder",
    );
  });
});
