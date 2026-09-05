/**
 * THE indexability predicate. Plain ESM so that both next.config.mjs (which
 * cannot import TypeScript) and lib/seo.ts consume the same logic.
 *
 * There used to be two: lib/seo.ts computed INDEXABLE for the meta tag, while
 * next.config.mjs emitted `X-Robots-Tag: noindex` on a different condition
 * (VERCEL_ENV !== "production"). That left production-before-Gate-A protected by
 * `Disallow: /` alone — and a disallowed URL is one whose noindex Google can
 * never read, which is the exact failure mode app/robots.ts warns about.
 */

/**
 * GATE A — the content switch. Google may index this site only when it is true.
 *
 * OPEN since 2026-09-05 (D-024). The seven conditions and how each was closed:
 *   A1 brand name ......... SemiDom (D-018)
 *   A4 legal entity ....... Simion Barbacaru, persoana fizica, IDNP on the
 *                           privacy page behind a reveal (D-025)
 *   B1 service list ....... the four cards in lib/content.ts, each evidenced by
 *                           an owner photograph, plus the fifteen topic pages
 *                           in lib/landing.ts which are built from the same set
 *   B2 teracota ........... performed, and the card no longer claims its photo
 *                           depicts terracotta: it is titled for the ceramic
 *                           work the photograph actually shows (D-026)
 *   B4 localities ......... "Chisinau si imprejurimi" — the owner's own words,
 *                           and deliberately not a list of named localities we
 *                           cannot evidence
 *   E1-E3 contact ......... +373 79 968 387 confirmed; the messengers stay
 *                           hidden until he says which of them exist
 *   G1 photo rights ....... the owner supplied the files himself for this site.
 *                           G3 (his own privacy pass over the 30 stills) is an
 *                           owner task that does not gate indexing, because the
 *                           photographs are already published.
 *
 * Opening this boolean is NOT sufficient on its own: indexability() also
 * requires VERCEL_ENV=production and NEXT_PUBLIC_SITE_URL to match
 * CONFIRMED_PRODUCTION_HOST. Until both are set on Vercel for semidom.md the
 * site still ships noindex, which is the intended safety net.
 */
export const GATE_A_COMPLETE = true;

/**
 * Strip scheme, credentials, path, query, case and any trailing dot from a host.
 *
 * @param {string | undefined | null} value
 * @returns {string}
 */
export function normalizeHost(value) {
  if (!value) return "";
  let host = String(value).trim().toLowerCase();
  host = host.replace(/^[a-z][a-z0-9+.-]*:\/\//, ""); // scheme
  host = host.replace(/^[^@/]*@/, ""); // credentials
  host = host.split("/")[0] ?? ""; // path
  host = host.split("?")[0] ?? "";
  host = host.replace(/\.$/, ""); // FQDN trailing dot
  return host;
}

/**
 * Three independent conditions, all required:
 *  1. this is the production deployment, not a preview or a local run;
 *  2. it is served from the host the owner explicitly confirmed;
 *  3. Gate A is open — no unverifiable claim is still on screen.
 *
 * Returns a reason when false, so the build can explain itself instead of
 * silently shipping a site nobody can find.
 *
 * @typedef {object} IndexabilityInput
 * @property {string} [vercelEnv]      VERCEL_ENV, or undefined outside Vercel.
 * @property {string} [siteUrl]        NEXT_PUBLIC_SITE_URL, full origin.
 * @property {string} [confirmedHost]  CONFIRMED_PRODUCTION_HOST, host only.
 * @property {boolean} [gateA]         Defaults to GATE_A_COMPLETE.
 *
 * @typedef {object} IndexabilityVerdict
 * @property {boolean} indexable
 * @property {string} reason
 *
 * @param {IndexabilityInput} input
 * @returns {IndexabilityVerdict}
 */
export function indexability({ vercelEnv, siteUrl, confirmedHost, gateA = GATE_A_COMPLETE } = {}) {
  if (vercelEnv !== "production") {
    return { indexable: false, reason: `VERCEL_ENV is "${vercelEnv ?? "unset"}", not "production"` };
  }
  if (!gateA) {
    return { indexable: false, reason: "GATE_A_COMPLETE is false" };
  }

  const expected = normalizeHost(confirmedHost);
  if (!expected) {
    return { indexable: false, reason: "CONFIRMED_PRODUCTION_HOST is unset" };
  }

  const actual = normalizeHost(siteUrl);
  if (!actual) {
    return { indexable: false, reason: "NEXT_PUBLIC_SITE_URL is unset or unparseable" };
  }
  if (actual !== expected) {
    return {
      indexable: false,
      reason: `host mismatch: NEXT_PUBLIC_SITE_URL resolves to "${actual}", CONFIRMED_PRODUCTION_HOST is "${expected}"`,
    };
  }
  return { indexable: true, reason: "production, host confirmed, Gate A open" };
}

/**
 * Convenience wrapper reading straight from process.env.
 *
 * @param {boolean} [gateA]
 * @returns {IndexabilityVerdict}
 */
export function indexabilityFromEnv(gateA = GATE_A_COMPLETE) {
  return indexability({
    vercelEnv: process.env.VERCEL_ENV,
    siteUrl:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined),
    confirmedHost: process.env.CONFIRMED_PRODUCTION_HOST,
    gateA,
  });
}
