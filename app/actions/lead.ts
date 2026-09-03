"use server";

import { createHmac, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { leadSchema, fieldErrorsFrom, type LeadResult } from "@/lib/lead";
import { clientIpFrom, hashIp, rateLimit } from "@/lib/rate-limit";
import { deliverLead } from "@/lib/notify";
import { isLocale, defaultLocale } from "@/lib/i18n";
import { resolveLeadSource, safePath } from "@/lib/lead-source";

/**
 * The only lead endpoint. One door, one set of controls — there is deliberately
 * no /api/lead route beside it.
 *
 * The client form runs the same zod schema for instant feedback; nothing it sends
 * is trusted here (CLAUDE.md: "nu folosi validări exclusiv client-side").
 */

/** Successful submissions per IP. Generous for a person, useless for a script. */
const SUBMIT_LIMIT = 5;
/** Parse attempts per IP — a typo must not consume a submission slot. */
const ATTEMPT_LIMIT = 15;
/** Per-instance ceiling. Above this we stop calling Resend at all. */
const INSTANCE_LIMIT = 60;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Below this, the submission was almost certainly scripted. It is recorded but
 * NOT acted on — see the note at the check itself.
 */
const MIN_FILL_MS = 1500;

/** Refuse absurd payloads before zod walks them. */
const MAX_FIELD_BYTES = 4000;

/** Window in which an identical resubmission is treated as the same request. */
const IDEMPOTENCY_MS = 120_000;

/**
 * Fingerprint -> the outcome that was actually achieved. Only DELIVERED requests
 * are recorded, which is the whole point: an earlier version registered the
 * fingerprint before attempting delivery and never rolled it back, so a visitor
 * whose lead failed and who pressed Submit again was told "Cererea a plecat" for
 * a lead nobody ever received. With no datastore that is permanent, silent
 * customer loss — exactly what the `undelivered` state exists to prevent.
 *
 * The residual risk is the reverse and is much cheaper: two submissions racing
 * in the same instant can both send, producing a duplicate email. The client
 * disables the button while the action is pending, and a duplicate email costs
 * nothing next to a lost customer.
 */
const delivered = new Map<string, { at: number; result: LeadResult }>();

function reference(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

/**
 * Same visitor, same phone, same service, inside two minutes = one request.
 * Replays the original outcome so a double-click or a no-JS refresh-resubmit
 * does not send twice. Keyed on an HMAC, so no phone number is held in memory.
 */
function recallDelivered(fingerprint: string): LeadResult | null {
  const now = Date.now();
  for (const [key, entry] of delivered) {
    if (entry.at + IDEMPOTENCY_MS <= now) delivered.delete(key);
  }
  return delivered.get(fingerprint)?.result ?? null;
}

function rememberDelivered(fingerprint: string, result: LeadResult): void {
  delivered.set(fingerprint, { at: Date.now(), result });
}

export async function submitLead(_prev: LeadResult | null, formData: FormData): Promise<LeadResult> {
  const ref = reference();

  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue; // no file uploads at P0
    if (value.length > MAX_FIELD_BYTES) {
      return { status: "invalid", errors: { message: "Textul este prea lung." } };
    }
    raw[key] = value;
  }

  // 1) Honeypot. A real browser never fills a field it cannot see. Answer as if
  //    everything went fine so a scripted submitter learns nothing.
  //
  //    The field is NOT called "website": that is one of the most commonly
  //    autofilled names in existence, and a password manager filling it would
  //    silently discard a real lead. It is display:none rather than merely
  //    off-screen for the same reason. The hit is logged so the false-positive
  //    rate is observable instead of assumed — this is the last remaining path
  //    that reports success without delivering anything.
  if (typeof raw.confirm_ref === "string" && raw.confirm_ref !== "") {
    console.warn(`[lead:${ref}] honeypot triggered, request discarded`);
    return { status: "success", reference: ref };
  }

  // 2) Timing signal — OBSERVED, not enforced.
  //    Browser autofill legitimately fills name, phone and e-mail instantly, so a
  //    real high-intent visitor can submit in well under a second. With no
  //    database, discarding such a request would lose a customer permanently and
  //    invisibly. The asymmetry is not close: one spam email costs nothing.
  //    The honeypot below stays a hard block because a hidden field that gets
  //    filled has no legitimate explanation.
  const elapsed = Number(raw.elapsedMs);
  const suspiciouslyFast = Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_MS;

  const requestHeaders = await headers();
  const ipKey = hashIp(clientIpFrom(requestHeaders));

  // 3) Attempt budget, charged before parsing so a flood of malformed payloads
  //    cannot be used to probe the schema for free.
  if (!rateLimit(`lead:attempt:${ipKey}`, ATTEMPT_LIMIT, WINDOW_MS).ok) {
    return { status: "rate_limited" };
  }

  // 4) Checkboxes arrive as "on" / absent; zod wants a real boolean.
  const parsed = leadSchema.safeParse({
    ...raw,
    consent: raw.consent === "on" || raw.consent === "true" || raw.consent === true,
  });
  if (!parsed.success) {
    return { status: "invalid", errors: fieldErrorsFrom(parsed.error) };
  }

  // 5) Idempotency FIRST. A repeat inside the window replays the outcome of a
  //    request that genuinely reached the owner. Checked BEFORE the submit
  //    budget: charging a slot for a replay meant that on a no-JS refresh-resubmit
  //    the one visitor whose lead HAD arrived was the one told they had tried too
  //    often. A request that FAILED is deliberately not recorded, so a retry is
  //    a real retry.
  const secret = process.env.LEAD_FORM_SECRET ?? "dev-secret-not-secret";
  const fingerprint = createHmac("sha256", secret)
    .update(`${ipKey}|${parsed.data.phone}|${parsed.data.service}`)
    .digest("base64url");
  const replay = recallDelivered(fingerprint);
  if (replay) return replay;

  // 6) Submission budget, charged only for payloads that were valid AND new.
  if (!rateLimit(`lead:submit:${ipKey}`, SUBMIT_LIMIT, WINDOW_MS).ok) {
    return { status: "rate_limited" };
  }

  // 7) Global ceiling: past this the instance stops spending on Resend.
  if (!rateLimit("lead:instance", INSTANCE_LIMIT, WINDOW_MS).ok) {
    console.warn(`[lead:${ref}] instance ceiling reached, refusing delivery`);
    return { status: "undelivered" };
  }

  const localeParam = typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : defaultLocale;

  const source = resolveLeadSource(
    typeof raw.utmSource === "string" ? raw.utmSource : undefined,
    typeof raw.referrer === "string" ? raw.referrer : undefined,
  );

  const outcome = await deliverLead(parsed.data, {
    reference: ref,
    locale: localeParam,
    source,
    sourcePath: safePath(typeof raw.sourcePath === "string" ? raw.sourcePath : undefined),
    consentVersion: process.env.LEAD_CONSENT_VERSION ?? "2026-08-19",
    consentAtIso: new Date().toISOString(),
  });

  // Log the OUTCOME only. Name, phone, e-mail, locality and message never touch
  // the logs (CLAUDE.md: "nu ... loguri cu PII"), and neither does the raw IP.
  console.info(
    `[lead:${ref}] service=${parsed.data.service} source=${source} ` +
      `msgBytes=${parsed.data.message?.length ?? 0} fast=${suspiciouslyFast} delivery=${outcome}`,
  );

  if (outcome !== "sent") {
    // No datastore means an undelivered lead is simply gone. Say so, and let the
    // UI hand the visitor the phone number instead of a fake confirmation.
    // Deliberately NOT remembered, so a retry is a real retry.
    return { status: "undelivered" };
  }

  const result: LeadResult = { status: "success", reference: ref };
  rememberDelivered(fingerprint, result);
  return result;
}
