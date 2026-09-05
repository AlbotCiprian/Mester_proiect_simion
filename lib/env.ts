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

/**
 * Names the Resend key may be stored under, in priority order.
 *
 * `RESEND_API_KEY` is canonical and is what the documentation says. `RESEND_token`
 * is accepted because that is the name the key is actually stored under in the
 * Vercel Production environment, and the owner set it as a **Secret** — a Vercel
 * secret cannot be read back after saving, so renaming it means re-pasting a key
 * nobody can retrieve any more. Accepting both costs one line; making the owner
 * revoke and regenerate a working key to satisfy a naming convention does not.
 *
 * Add a name here rather than adding a second lookup somewhere else: this array
 * is also what missingDeliveryVars() reports, so the diagnostics stay honest.
 */
const RESEND_KEY_NAMES = ["RESEND_API_KEY", "RESEND_token"] as const;

function readFirst(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = read(name);
    if (value) return value;
  }
  return undefined;
}

export const env = {
  resendApiKey: readFirst(RESEND_KEY_NAMES),
  /** Verified sender, e.g. "SemiDom <contact@domeniu.md>". */
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

/** The three things a lead needs in order to reach a human. */
const DELIVERY_VARS = ["RESEND_API_KEY", "LEAD_FROM_EMAIL", "LEAD_TO_EMAIL"] as const;

/**
 * Which of the delivery variables are missing, by NAME.
 *
 * The log line used to say only `delivery=not_configured`, which is true and
 * useless: it cost a round-trip to discover that the key had been set under a
 * different variable name. A missing variable is the single most likely reason
 * a live form silently stops producing leads, so the log says which one.
 *
 * Names only. The values are secrets and never appear in a log line.
 */
export function missingDeliveryVars(): string[] {
  const present: Record<(typeof DELIVERY_VARS)[number], boolean> = {
    RESEND_API_KEY: Boolean(env.resendApiKey),
    LEAD_FROM_EMAIL: Boolean(env.leadFromEmail),
    LEAD_TO_EMAIL: Boolean(env.leadToEmail),
  };
  return DELIVERY_VARS.filter((name) => !present[name]).map((name) =>
    // Report every accepted spelling, so someone reading the log knows the key
    // may equally be set under the alias rather than the canonical name.
    name === "RESEND_API_KEY" ? RESEND_KEY_NAMES.join("|") : name,
  );
}

/** True only when a lead can actually reach a human. */
export function leadDeliveryConfigured(): boolean {
  return missingDeliveryVars().length === 0;
}

/**
 * A key that looks like a Resend key but is sitting under a name nothing reads.
 *
 * Checked because it has already happened: the key was set as a differently
 * named variable and the form reported `not_configured` with no hint why.
 * Reports the VARIABLE NAME only — never the value, not even a prefix.
 */
export function misplacedResendKeyVars(): string[] {
  if (env.resendApiKey) return [];
  const known: readonly string[] = RESEND_KEY_NAMES;
  return Object.entries(process.env)
    .filter(
      ([name, value]) =>
        !known.includes(name) &&
        typeof value === "string" &&
        /^re_[A-Za-z0-9]/.test(value.trim()),
    )
    .map(([name]) => name)
    .sort();
}

/**
 * Production means the real deployment on the real domain. Preview builds and
 * local dev must never be indexable (spec 18/22).
 */
export function isProductionDeployment(): boolean {
  return env.vercelEnv === "production";
}
