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
 * GATE A — the content switch.
 *
 * Flip to `true` ONLY when every one of these is answered and encoded:
 *   A1 brand name shown to customers        A4 legal entity for the privacy notice
 *   B1 exact list of services               B2 teracotă/sobe: yes or no
 *   B4 localities actually served           E1-E3 phone + which messengers exist
 *   G1 written right to publish the project photographs
 *
 * plus the fifteen technical preconditions in docs/work/GO-LIVE.md.
 *
 * A CONFIRM_OWNER comment does not stop a deploy; this boolean does.
 */
export const GATE_A_COMPLETE = false;

/**
 * Is the business content finished enough to stop warning visitors about it?
 *
 * Separate from GATE_A_COMPLETE on purpose. During the soft-launch the site is
 * deliberately unindexed while the owner shares the link by hand — and a banner
 * saying the content is provisional is exactly the wrong thing to show the
 * people he is trying to win. Gate A additionally requires the legal and consent
 * work; this only asks whether what is on screen is final.
 *
 * Flip when: the service list is confirmed (B1/B2), the localities are named
 * (B4), and the trust figures are either real or permanently removed.
 */
export const CONTENT_COMPLETE = false;

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
 *  3. Gate A is closed — no unverifiable claim is still on screen.
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
  return { indexable: true, reason: "production, host confirmed, Gate A closed" };
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
