import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { indexability, normalizeHost } from "@/config/indexability.mjs";

/**
 * The indexing switch is the highest-consequence boolean in the project and had
 * zero coverage — which is why a non-existent route sat in the sitemap and five
 * CONFIRM_OWNER strings sat in the DOM for a whole release.
 *
 * Two failure directions, both expensive and both silent:
 *  - indexable too early -> Google indexes placeholder content, and un-indexing
 *    is far slower than indexing;
 *  - still noindex after the cutover -> green build, successful deploy, invisible
 *    site, no error anywhere. A trailing slash is enough to cause it.
 */

const PROD = "production";
const HOST = "semidom.md";
const URL = `https://${HOST}`;

/** Mirrors the input of `indexability()`. Declared here rather than derived with
 *  `Parameters<>`, because the predicate lives in a .mjs whose inferred
 *  signature is not usable as a type. */
type IndexabilityInput = {
  vercelEnv?: string;
  siteUrl?: string;
  confirmedHost?: string;
  gateA?: boolean;
};

type Verdict = { indexable: boolean; reason: string; code: string };

const verdict = (input: IndexabilityInput): Verdict => indexability(input) as Verdict;

describe("indexability truth table", () => {
  const cases: Array<[string, IndexabilityInput, boolean]> = [
    ["all three conditions met", { vercelEnv: PROD, siteUrl: URL, confirmedHost: HOST, gateA: true }, true],
    ["gate A closed", { vercelEnv: PROD, siteUrl: URL, confirmedHost: HOST, gateA: false }, false],
    ["preview deployment", { vercelEnv: "preview", siteUrl: URL, confirmedHost: HOST, gateA: true }, false],
    ["development", { vercelEnv: "development", siteUrl: URL, confirmedHost: HOST, gateA: true }, false],
    ["no VERCEL_ENV at all", { siteUrl: URL, confirmedHost: HOST, gateA: true }, false],
    ["confirmed host unset", { vercelEnv: PROD, siteUrl: URL, gateA: true }, false],
    ["site url unset", { vercelEnv: PROD, confirmedHost: HOST, gateA: true }, false],
    [
      "host mismatch",
      { vercelEnv: PROD, siteUrl: "https://other.example.com", confirmedHost: HOST, gateA: true },
      false,
    ],
  ];

  for (const [name, input, expected] of cases) {
    it(`${expected ? "indexes" : "refuses"} — ${name}`, () => {
      const result = indexability(input);
      assert.equal(result.indexable, expected);
      assert.ok(result.reason.length > 0, "every verdict must explain itself");
    });
  }
});

describe("host comparison tolerates the ways the two variables get typed", () => {
  const equivalents = [
    ["scheme on both", `https://${HOST}`, `https://${HOST}`],
    ["scheme on one", `https://${HOST}`, HOST],
    ["trailing slash", `https://${HOST}/`, HOST],
    ["trailing path", `https://${HOST}/ro`, HOST],
    ["uppercase", `https://${HOST.toUpperCase()}`, HOST],
    ["mixed case confirmed", URL, HOST.toUpperCase()],
    ["surrounding whitespace", `  ${URL}  `, ` ${HOST} `],
    ["FQDN trailing dot", `https://${HOST}.`, HOST],
    ["http scheme", `http://${HOST}`, HOST],
  ] as const;

  for (const [name, siteUrl, confirmedHost] of equivalents) {
    it(`treats these as the same host — ${name}`, () => {
      const result = indexability({ vercelEnv: PROD, siteUrl, confirmedHost, gateA: true });
      assert.equal(result.indexable, true, result.reason);
    });
  }

  it("does NOT treat www as the same host", () => {
    // Different host, different certificate, different canonical. If the owner
    // wants www it must be stated, not inferred.
    const result = indexability({
      vercelEnv: PROD,
      siteUrl: `https://www.${HOST}`,
      confirmedHost: HOST,
      gateA: true,
    });
    assert.equal(result.indexable, false);
    assert.match(result.reason, /mismatch/);
  });

  it("does not treat a preview deployment host as the production host", () => {
    const result = indexability({
      vercelEnv: PROD,
      siteUrl: "https://mester-teracota-moldova-abc123.vercel.app",
      confirmedHost: HOST,
      gateA: true,
    });
    assert.equal(result.indexable, false);
  });
});

describe("the verdict code separates 'misconfigured' from 'not configured yet'", () => {
  /**
   * This suite exists because of a real, observed production failure.
   *
   * `lib/seo.ts` fails the build when Gate A is open on a production deployment
   * and the site would still be noindex. That guard was written for a TYPO —
   * two host variables that disagree by a scheme or a slash, which produces a
   * green build and an invisible site with no other signal.
   *
   * It could not tell a typo from "the owner has not opened the Vercel
   * dashboard yet". So the first production build after Gate A opened failed
   * with `CONFIRMED_PRODUCTION_HOST is unset`, and the project stayed
   * undeployable while the live site served stale code. Unset is SAFE: the site
   * ships noindex, which is what it must do before the domain is live.
   *
   * The code is what makes the two distinguishable, so it is asserted here
   * rather than left to a prose match on `reason`.
   */
  it("reports host-mismatch only when both variables are set and disagree", () => {
    const result = verdict({
      vercelEnv: PROD,
      siteUrl: "https://other.example.com",
      confirmedHost: HOST,
      gateA: true,
    });
    assert.equal(result.code, "host-mismatch");
  });

  it("reports host-unset — NOT host-mismatch — when the host is simply missing", () => {
    const result = verdict({ vercelEnv: PROD, siteUrl: URL, gateA: true });
    assert.equal(result.code, "host-unset");
    assert.notEqual(result.code, "host-mismatch", "an unset host must never fail a build");
  });

  it("reports site-url-unset when only the site URL is missing", () => {
    const result = verdict({ vercelEnv: PROD, confirmedHost: HOST, gateA: true });
    assert.equal(result.code, "site-url-unset");
  });

  it("reports gate-closed and not-production distinctly", () => {
    assert.equal(
      verdict({ vercelEnv: PROD, siteUrl: URL, confirmedHost: HOST, gateA: false }).code,
      "gate-closed",
    );
    assert.equal(
      verdict({ vercelEnv: "preview", siteUrl: URL, confirmedHost: HOST, gateA: true }).code,
      "not-production",
    );
  });

  it("reports ok when the site is indexable", () => {
    assert.equal(
      verdict({ vercelEnv: PROD, siteUrl: URL, confirmedHost: HOST, gateA: true }).code,
      "ok",
    );
  });

  it("lib/seo.ts throws on host-mismatch and only on host-mismatch", () => {
    // Read as text: importing lib/seo.ts pulls in `server-only`.
    const source = readFileSync(
      path.join(path.resolve(import.meta.dirname, ".."), "lib", "seo.ts"),
      "utf8",
    );
    assert.match(
      source,
      /verdict\.code === "host-mismatch"/,
      "the build guard must key off the mismatch code, not off !indexable",
    );
    assert.match(source, /console\.warn/, "an unconfigured production build must warn, not throw");
  });
});

describe("normalizeHost", () => {
  it("strips scheme, path, query, case and the trailing dot", () => {
    assert.equal(normalizeHost("HTTPS://Example.MD/ro?x=1"), "example.md");
  });

  it("strips credentials", () => {
    assert.equal(normalizeHost("https://user:pass@example.md"), "example.md");
  });

  it("returns an empty string for nothing", () => {
    assert.equal(normalizeHost(undefined), "");
    assert.equal(normalizeHost(""), "");
  });
});
