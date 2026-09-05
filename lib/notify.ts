import "server-only";

import { Resend } from "resend";
import { env, leadDeliveryConfigured, misplacedResendKeyVars, missingDeliveryVars } from "@/lib/env";
import { contactPreferenceLabels, leadServiceLabels, type Lead } from "@/lib/lead";
import { LEAD_SOURCE_LABELS, type LeadSource } from "@/lib/lead-source";

/**
 * Lead delivery. Email only — the owner decided against a datastore at P0
 * (docs/work/DECISIONS.md D-009), so this is the ONLY copy of a request.
 * Everything here is written on that assumption: fail loudly, never silently.
 */

export type DeliveryOutcome = "sent" | "not_configured" | "failed";

export interface LeadMeta {
  /** Short opaque id shown to the visitor and printed in the log line. */
  reference: string;
  locale: string;
  /** Page the request came from, for context in the email. */
  sourcePath: string;
  /** Which channel produced this lead, reduced to a closed allowlist. */
  source: LeadSource;
  /**
   * Consent must be demonstrable. With no datastore, this outbound email is the
   * ONLY record that consent was given, so the version and a server-side UTC
   * timestamp travel with every lead.
   */
  consentVersion: string;
  consentAtIso: string;
}

/**
 * Strip CR/LF before any value reaches a header-like field. Resend takes JSON so
 * classic SMTP header injection does not apply, but a newline in a subject still
 * mangles the message and is never legitimate input.
 */
function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

function buildRows(lead: Lead, meta: LeadMeta): Array<[string, string]> {
  // lead.phone is already E.164 — the schema transforms it, so no user-typed
  // string reaches this row.
  // Both formats: the owner searches his mailbox for whatever the caller reads
  // out, which is the national form, not E.164.
  const national = lead.phone.startsWith("+373")
    ? `0${lead.phone.slice(4)}`.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
    : null;

  const rows: Array<[string, string]> = [
    ["Nume", lead.name],
    ["Telefon", national ? `${lead.phone}  (${national})` : lead.phone],
    ["Preferă contact prin", contactPreferenceLabels[lead.contactPreference]],
    ["Serviciu", leadServiceLabels[lead.service] ?? lead.service],
  ];
  if (lead.email) rows.push(["E-mail", lead.email]);
  if (lead.locality) rows.push(["Localitate", lead.locality]);
  if (lead.message) rows.push(["Detalii", lead.message]);
  rows.push(["Sursă", LEAD_SOURCE_LABELS[meta.source]]);
  rows.push(["Referință", meta.reference]);
  rows.push(["Pagina", `${meta.locale} · ${meta.sourcePath}`]);
  rows.push(["Acord primit", `${meta.consentAtIso} (versiunea ${meta.consentVersion})`]);
  return rows;
}

function renderText(rows: Array<[string, string]>): string {
  return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
}

function renderHtml(rows: Array<[string, string]>): string {
  const cells = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="padding:6px 14px 6px 0;color:#6b6257;font:600 12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 0;color:#1c1a17;font:400 15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  return (
    `<div style="background:#f6f3ee;padding:28px">` +
    `<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4ded4;padding:26px">` +
    `<p style="margin:0 0 18px;color:#8a6a43;font:600 12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.14em">Cerere nouă de pe site</p>` +
    `<table style="border-collapse:collapse;width:100%">${cells}</table>` +
    `</div></div>`
  );
}

const SEND_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("TimeoutError")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (cause) => {
        clearTimeout(timer);
        reject(cause);
      },
    );
  });
}

/**
 * Deliver one lead. Never throws: the caller must be able to tell the visitor the
 * truth, and an exception here would surface as a generic 500 instead.
 */
export async function deliverLead(lead: Lead, meta: LeadMeta): Promise<DeliveryOutcome> {
  if (!leadDeliveryConfigured()) {
    // Say WHICH variable is missing. Names only — never a value.
    const missing = missingDeliveryVars().join(",");
    const misplaced = misplacedResendKeyVars();
    console.error(
      `[lead:${meta.reference}] delivery=not_configured missing=${missing}` +
        (misplaced.length
          ? ` hint=a_resend_looking_key_is_set_as:${misplaced.join(",")}_but_the_code_reads_RESEND_API_KEY`
          : ""),
    );
    return "not_configured";
  }

  const rows = buildRows(lead, meta);
  const subject = singleLine(
    `Cerere nouă · ${leadServiceLabels[lead.service] ?? lead.service} · ${lead.name}`,
  ).slice(0, 160);

  try {
    const resend = new Resend(env.resendApiKey);
    // The SDK exposes no abort signal, so the timeout is enforced by racing it.
    // A hung upstream must not hold the Server Action open until the platform
    // kills it — the visitor needs the "undelivered" branch and the phone number.
    const { error } = await withTimeout(
      resend.emails.send({
        /**
         * `from` is ALWAYS the configured sender and must live on a domain
         * verified in Resend. It is NOT the customer's address, and it must
         * never become one: Resend rejects an unverified sender outright, so
         * the mail would simply stop being delivered — and if it were somehow
         * accepted, sending as an address we do not control fails SPF and DKIM,
         * lands in spam, and burns the domain's sending reputation. This is the
         * single most common way a working contact form gets broken.
         */
        from: env.leadFromEmail!,
        to: [env.leadToEmail!],
        /**
         * `replyTo` IS the customer, when they gave an address.
         *
         * This reverses an earlier decision, deliberately. The old rule was "no
         * replyTo, because a submitter-controlled reply address lets an attacker
         * receive the owner's reply". That risk is real but small — the reply
         * contains a quote, not a secret — and it was being paid for with the
         * thing the owner actually needs every day: hitting Reply and reaching
         * the person who wrote in. Without it he has to retype the address from
         * the body of the mail, which is where it already is.
         *
         * Safe because the value is not free text: zod validated it as an
         * e-mail, `clean()` stripped control characters, and Resend takes JSON,
         * so there is no header to inject into. The address is also printed in
         * the body, so the owner can always see who he is about to answer.
         */
        ...(lead.email ? { replyTo: lead.email } : {}),
        subject,
        text: renderText(rows),
        html: renderHtml(rows),
        // Still no cc or bcc: nothing about a lead should reach a third party.
      }),
      SEND_TIMEOUT_MS,
    );

    if (error) {
      // Only the error CLASS is logged. The SDK error object can embed the
      // request payload, which is the customer's data.
      console.error(`[lead:${meta.reference}] resend rejected: ${error.name}`);
      return "failed";
    }
    return "sent";
  } catch (cause) {
    console.error(
      `[lead:${meta.reference}] delivery threw: ${cause instanceof Error ? cause.name : "unknown"}`,
    );
    return "failed";
  }
}
