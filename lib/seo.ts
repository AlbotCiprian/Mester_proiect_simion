import "server-only";

import { env } from "@/lib/env";
import { GATE_A_COMPLETE, indexabilityFromEnv } from "@/config/indexability.mjs";
import { defaultLocale, publishedLocales, type Locale } from "@/lib/i18n";

/**
 * Indexability, canonical URLs and the shared metadata helpers.
 *
 * The predicate itself lives in config/indexability.mjs so that next.config.mjs
 * — which cannot import TypeScript — decides the X-Robots-Tag header from the
 * same logic. One predicate, one place.
 */

/** Fallback only. Real deployments set NEXT_PUBLIC_SITE_URL (see .env.example). */
const FALLBACK_URL = "http://localhost:3000";

export const SITE_URL = (env.siteUrl ?? FALLBACK_URL).replace(/\/+$/, "");

const verdict = indexabilityFromEnv(GATE_A_COMPLETE);

export const INDEXABLE: boolean = verdict.indexable;

/**
 * Why the site is or is not indexable. Surfaced at build time because a silent
 * host mismatch is the highest-probability cutover failure: the build is green,
 * the deploy succeeds, and the site is invisible with no error anywhere.
 */
export const INDEXABLE_REASON: string = verdict.reason;

/**
 * Fail the build ONLY on a host MISMATCH.
 *
 * A mismatch means both variables are set and they disagree — by a scheme, a
 * trailing slash or a capital letter. That is a typo, it produces a green build
 * and a site nobody can find, and no other signal reports it. Worth stopping.
 *
 * Unset variables are a different thing entirely and this originally conflated
 * the two: the first production build after Gate A opened failed with
 * "CONFIRMED_PRODUCTION_HOST is unset" and made the project undeployable until
 * someone opened the Vercel dashboard — while the deployed site sat stale. Not
 * configured yet is SAFE: the site ships noindex, which is exactly what it
 * should do before the domain is live. So it warns, loudly, and builds.
 */
if (process.env.VERCEL_ENV === "production" && GATE_A_COMPLETE && !verdict.indexable) {
  if (verdict.code === "host-mismatch") {
    throw new Error(
      `[seo] ${verdict.reason}. Both host variables are set and they disagree, so this build ` +
        `would deploy a site Google can never index. Fix NEXT_PUBLIC_SITE_URL / ` +
        `CONFIRMED_PRODUCTION_HOST and redeploy — both are read at BUILD time.`,
    );
  }
  console.warn(
    `[seo] NOT INDEXABLE on a production deployment: ${verdict.reason}. ` +
      `Gate A is open, so this is the last thing standing between the site and Google. ` +
      `Set NEXT_PUBLIC_SITE_URL and CONFIRMED_PRODUCTION_HOST (Production scope) and redeploy.`,
  );
}

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Self-referential canonical for a localized route. */
export function canonicalFor(locale: Locale = defaultLocale, path = ""): string {
  const suffix = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
  return absoluteUrl(`/${locale}${suffix}`);
}

/**
 * `robots` for Next metadata.
 *
 * An UNPUBLISHED locale is noindex unconditionally — independent of Gate A.
 * Otherwise the /ru coming-soon stub (40 words of Romanian) would become
 * indexable the instant the site opens, competing with the page it stubs for.
 */
export function robotsMeta(locale?: Locale) {
  const localeIsPublished = locale ? publishedLocales.includes(locale) : true;
  if (!localeIsPublished) return { index: false, follow: false };
  return INDEXABLE ? undefined : { index: false, follow: false };
}
