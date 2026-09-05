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

/**
 * The lead, shaped for reading rather than for storage.
 *
 * The owner opens this on a phone, usually while working. What he needs, in
 * this order: who it is, a number he can tap, what they want, and what they
 * wrote. Everything else is bookkeeping and belongs at the bottom in small
 * type — it was previously interleaved with the important fields at the same
 * visual weight, so a raw ISO timestamp sat directly under the customer's name.
 */
export interface LeadView {
  name: string;
  phoneE164: string;
  /** National form, e.g. "068 968 633". Null for a non-Moldovan number. */
  phoneNational: string | null;
  service: string;
  preference: string;
  email: string | null;
  locality: string | null;
  message: string | null;
  /** Bookkeeping, rendered as one muted block. */
  reference: string;
  source: string;
  page: string;
  receivedAt: string;
  consentVersion: string;
}

/**
 * Human time, in the timezone the owner actually lives in.
 *
 * The consent timestamp is stored and transmitted as UTC ISO — that is the
 * correct thing to RECORD, because it is unambiguous and it is the only proof
 * consent was given. It is the wrong thing to SHOW: "2026-09-05T22:19:22.712Z"
 * told him a lead arrived at 22:19 when his clock said 01:19.
 */
function formatReceived(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("ro-MD", {
      timeZone: "Europe/Chisinau",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    // A runtime without full ICU would throw rather than lose the lead.
    return iso;
  }
}

/** Exported for tests: pure, and the only way to check the mail without sending it. */
export function toView(lead: Lead, meta: LeadMeta): LeadView {
  // lead.phone is already E.164 — the schema transforms it, so no user-typed
  // string reaches here. The national form is shown as well because that is
  // what a caller reads out, and what the owner searches his mailbox for.
  const phoneNational = lead.phone.startsWith("+373")
    ? `0${lead.phone.slice(4)}`.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
    : null;

  return {
    name: lead.name,
    phoneE164: lead.phone,
    phoneNational,
    service: leadServiceLabels[lead.service] ?? lead.service,
    preference: contactPreferenceLabels[lead.contactPreference],
    email: lead.email ?? null,
    locality: lead.locality ?? null,
    message: lead.message ?? null,
    reference: meta.reference,
    source: LEAD_SOURCE_LABELS[meta.source],
    page: `${meta.locale} · ${meta.sourcePath}`,
    receivedAt: formatReceived(meta.consentAtIso),
    consentVersion: meta.consentVersion,
  };
}

/**
 * Plain-text alternative.
 *
 * Not a fallback nobody reads: it is what a phone notification previews, what a
 * screen reader gets in some clients, and what raises the spam score when it is
 * missing. It mirrors the HTML ordering so the two never tell different stories.
 */
export function renderText(v: LeadView): string {
  const out = [
    "CERERE NOUĂ DE PE SITE",
    v.receivedAt,
    "",
    `${v.name}`,
    `Telefon: ${v.phoneNational ? `${v.phoneNational}  (${v.phoneE164})` : v.phoneE164}`,
    `Preferă: ${v.preference}`,
    "",
    `Serviciu: ${v.service}`,
  ];
  if (v.locality) out.push(`Localitate: ${v.locality}`);
  if (v.email) out.push(`E-mail: ${v.email}  (poți răspunde direct la acest mesaj)`);
  if (v.message) out.push("", "Ce a scris:", v.message);
  out.push(
    "",
    "—",
    `Referință: ${v.reference} · Pagina: ${v.page} · Sursă: ${v.source}`,
    `Acord pentru prelucrarea datelor primit la ${v.receivedAt} (versiunea ${v.consentVersion}).`,
  );
  return out.join("\n");
}

/* ------------------------------------------------------------------ HTML */

/**
 * Deliberately old-fashioned HTML: nested tables, inline styles, no flexbox,
 * no <style> block, no web fonts, no images. Not nostalgia — Outlook renders
 * with Word's engine and silently drops most of the modern alternatives, and a
 * lead e-mail that renders as a stack of unstyled text is worse than a plain
 * one. Every cell carries its own background and colour so a client that
 * force-inverts for dark mode cannot leave dark text on a dark ground.
 */
const INK = "#1c1a17";
const MUTED = "#6b6257";
const LINE = "#e4ded4";
const CANVAS = "#f6f3ee";
const BRONZE = "#8a6a43";

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function label(text: string): string {
  return (
    `<div style="margin:0 0 4px;color:${MUTED};font:600 11px/1.4 ${FONT};` +
    `text-transform:uppercase;letter-spacing:.1em">${escapeHtml(text)}</div>`
  );
}

export function renderHtml(v: LeadView): string {
  const detail = (name: string, value: string) =>
    `<tr><td style="padding:0 0 14px">${label(name)}` +
    `<div style="color:${INK};font:400 16px/1.5 ${FONT}">${escapeHtml(value)}</div></td></tr>`;

  const rows: string[] = [detail("Serviciu", v.service)];
  if (v.locality) rows.push(detail("Localitate", v.locality));
  rows.push(detail("Preferă contact prin", v.preference));

  // The customer's own words, set apart. It is the only free text in the mail
  // and the thing that decides whether the job is worth a call back.
  const message = v.message
    ? `<tr><td style="padding:4px 0 18px">${label("Ce a scris")}` +
      `<div style="border-left:3px solid ${BRONZE};background:${CANVAS};padding:12px 14px;` +
      `color:${INK};font:400 16px/1.6 ${FONT};white-space:pre-wrap">${escapeHtml(v.message)}</div></td></tr>`
    : "";

  // mailto plus a plain statement that Reply works. Reply-To is set to this
  // address, so the fastest path is the one he already knows.
  const email = v.email
    ? `<tr><td style="padding:0 0 14px">${label("E-mail")}` +
      `<div style="font:400 16px/1.5 ${FONT}"><a href="mailto:${escapeHtml(v.email)}" ` +
      `style="color:${BRONZE};text-decoration:underline">${escapeHtml(v.email)}</a></div>` +
      `<div style="margin-top:4px;color:${MUTED};font:400 13px/1.5 ${FONT}">` +
      `Poți apăsa direct <strong>Reply</strong> — răspunsul ajunge la client.</div></td></tr>`
    : "";

  const phoneShown = v.phoneNational ?? v.phoneE164;

  return (
    `<div style="margin:0;padding:24px 12px;background:${CANVAS};font-family:${FONT}">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" ` +
    `style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse">` +
    `<tr><td style="background:#ffffff;border:1px solid ${LINE};padding:26px 24px">` +
    // --- header -------------------------------------------------------
    `<div style="color:${BRONZE};font:600 11px/1.4 ${FONT};text-transform:uppercase;letter-spacing:.14em">` +
    `Cerere nouă de pe site</div>` +
    `<div style="margin-top:4px;color:${MUTED};font:400 13px/1.5 ${FONT}">${escapeHtml(v.receivedAt)}</div>` +
    // --- who ----------------------------------------------------------
    `<div style="margin:18px 0 2px;color:${INK};font:700 26px/1.25 ${FONT}">${escapeHtml(v.name)}</div>` +
    // --- the call button, the single most important element ------------
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 22px">` +
    `<tr><td style="background:${BRONZE};border-radius:4px">` +
    `<a href="tel:${escapeHtml(v.phoneE164)}" ` +
    `style="display:block;padding:14px 22px;color:#ffffff;font:700 19px/1.2 ${FONT};text-decoration:none">` +
    `&#9742;&nbsp;&nbsp;${escapeHtml(phoneShown)}</a></td></tr></table>` +
    (v.phoneNational
      ? `<div style="margin:-14px 0 20px;color:${MUTED};font:400 13px/1.5 ${FONT}">` +
        `Format internațional: ${escapeHtml(v.phoneE164)}</div>`
      : "") +
    // --- what they want ------------------------------------------------
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;` +
    `border-top:1px solid ${LINE};padding-top:18px">` +
    `<tr><td style="height:18px"></td></tr>` +
    rows.join("") +
    message +
    email +
    `</table>` +
    // --- bookkeeping ---------------------------------------------------
    `<div style="margin-top:6px;padding-top:14px;border-top:1px solid ${LINE};` +
    `color:${MUTED};font:400 12px/1.7 ${FONT}">` +
    `Referință <strong style="color:${INK}">${escapeHtml(v.reference)}</strong> · ` +
    `Pagina ${escapeHtml(v.page)} · Sursă ${escapeHtml(v.source)}<br>` +
    `Acord pentru prelucrarea datelor primit la ${escapeHtml(v.receivedAt)} ` +
    `(versiunea ${escapeHtml(v.consentVersion)}).</div>` +
    `</td></tr></table></div>`
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

  const view = toView(lead, meta);

  /**
   * Name and NUMBER in the subject, in that order.
   *
   * The owner reads this first as a phone notification, on a lock screen, often
   * with dirty hands. Putting the number there means he can decide whether to
   * call back without unlocking anything, and it makes the mailbox searchable by
   * the number a caller reads out. The service comes last because it is the part
   * that survives truncation least usefully.
   */
  const subject = singleLine(
    `Cerere nouă · ${view.name} · ${view.phoneNational ?? view.phoneE164} · ${view.service}`,
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
        text: renderText(view),
        html: renderHtml(view),
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
