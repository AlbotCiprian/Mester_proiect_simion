import "server-only";

import { env, isProductionDeployment } from "@/lib/env";
import { GATE_A_COMPLETE } from "@/lib/content";
import { defaultLocale, type Locale } from "@/lib/i18n";

/**
 * The single source of truth for "may a crawler index this?".
 *
 * Exactly four consumers: app/layout.tsx (metadata.robots), app/robots.ts,
 * app/sitemap.ts and app/llms.txt/route.ts. Nothing else may branch on
 * VERCEL_ENV for indexability — one predicate, one place.
 */

/** Fallback only. Real deployments set NEXT_PUBLIC_SITE_URL (see .env.example). */
const FALLBACK_URL = "http://localhost:3000";

export const SITE_URL = (env.siteUrl ?? FALLBACK_URL).replace(/\/+$/, "");

/**
 * The host we are allowed to index under. Until the owner fixes the subdomain
 * (A3) this stays unset, and an unset value keeps INDEXABLE false — a deployment
 * hash hostname must never end up baked into a canonical URL.
 */
const CONFIRMED_HOST = process.env.CONFIRMED_PRODUCTION_HOST?.trim();

function hostMatchesConfirmed(): boolean {
  if (!CONFIRMED_HOST) return false;
  try {
    return new URL(SITE_URL).host === CONFIRMED_HOST;
  } catch {
    return false;
  }
}

/**
 * Three independent conditions, all required:
 *  1. this is the production deployment, not a preview or a local run;
 *  2. it is served from the host the owner confirmed;
 *  3. Gate A is closed — no CONFIRM_OWNER placeholder is still on screen.
 */
export const INDEXABLE: boolean =
  isProductionDeployment() && hostMatchesConfirmed() && GATE_A_COMPLETE;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Self-referential canonical for a localized route. */
export function canonicalFor(locale: Locale = defaultLocale, path = ""): string {
  const suffix = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
  return absoluteUrl(`/${locale}${suffix}`);
}

/**
 * `robots` for Next metadata. Returns the noindex directive whenever the page
 * must stay out of the index; `undefined` lets Next omit the tag entirely.
 */
export function robotsMeta() {
  return INDEXABLE ? undefined : { index: false, follow: false };
}
