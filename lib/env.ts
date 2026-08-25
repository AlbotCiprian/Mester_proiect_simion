import "server-only";

/**
 * Server-only environment access. Nothing here may be imported from a Client
 * Component — the `server-only` guard turns that into a build error rather than
 * a secret shipped to the browser (CLAUDE.md: "fără secrete în browser").
 *
 * Every value is optional on purpose: the site must build and run before the
 * owner has provisioned Resend, so features degrade instead of crashing.
 */

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export const env = {
  resendApiKey: read("RESEND_API_KEY"),
  /** Verified sender, e.g. "Atelier <contact@domeniu.md>". */
  leadFromEmail: read("LEAD_FROM_EMAIL"),
  /** Where new requests land — the owner's inbox. */
  leadToEmail: read("LEAD_TO_EMAIL"),
  /** Canonical origin. Vercel supplies VERCEL_PROJECT_PRODUCTION_URL automatically. */
  siteUrl:
    read("NEXT_PUBLIC_SITE_URL") ??
    (read("VERCEL_PROJECT_PRODUCTION_URL") ? `https://${read("VERCEL_PROJECT_PRODUCTION_URL")}` : undefined) ??
    (read("VERCEL_URL") ? `https://${read("VERCEL_URL")}` : undefined),
  vercelEnv: read("VERCEL_ENV"),
} as const;

/** True only when a lead can actually reach a human. */
export function leadDeliveryConfigured(): boolean {
  return Boolean(env.resendApiKey && env.leadFromEmail && env.leadToEmail);
}

/**
 * Production means the real deployment on the real domain. Preview builds and
 * local dev must never be indexable (spec 18/22).
 */
export function isProductionDeployment(): boolean {
  return env.vercelEnv === "production";
}
