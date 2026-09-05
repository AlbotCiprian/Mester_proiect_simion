import assert from "node:assert/strict";
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
