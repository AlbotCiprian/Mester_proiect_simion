// Lead contract. Shared by the client form (instant feedback) and the server
// action (the only validation that counts — CLAUDE.md forbids client-only checks).
//
// P0 scope: capture + notify. There is NO persistence layer, so nothing here may
// promise the visitor that their request is stored or tracked. See DECISIONS D-009.

import { z } from "zod";

// Plain constants and result types live in lib/lead-labels.ts, which imports no
// zod — that is what keeps zod out of the client bundle. Re-exported here so the
// server side has one import site.
export {
  contactPreferences,
  contactPreferenceLabels,
  leadServiceSlugs,
  leadServiceLabels,
} from "@/lib/lead-labels";
export type {
  ContactPreference,
  LeadServiceSlug,
  LeadFieldKey,
  LeadFieldErrors,
  LeadResult,
} from "@/lib/lead-labels";

import { contactPreferences, leadServiceSlugs } from "@/lib/lead-labels";
import type { LeadFieldErrors } from "@/lib/lead-labels";

/**
 * Control characters, bidi overrides and zero-width marks. Stripped from every
 * free-text field: they are never legitimate in a name or a locality, they can
 * disguise a string's real content, and `name.min(2)` would otherwise accept
 * two zero-width spaces as a valid name.
 *
 * TAB, LF and CR are deliberately EXCLUDED. They are ordinary whitespace, and
 * deleting them outright fused the words in every multi-line message. They are
 * folded to a single space by cleanLine(), and preserved by the message field.
 */
const INVISIBLE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

function clean(value: string): string {
  return value.normalize("NFC").replace(INVISIBLE, "").trim();
}

/** Same, but also collapses newlines — for fields that must stay one line. */
function cleanLine(value: string): string {
  return clean(value).replace(/\s+/g, " ");
}

/**
 * Moldovan numbers are written half a dozen ways (069..., 069 123 456,
 * +373 69 123 456). Normalize to E.164 rather than reject a real customer over
 * formatting. Returns null when the input is not a usable phone number.
 *
 * Mobile prefixes in MD are 6x and 7x. A bare 8-digit string starting with 0 is
 * a truncated national number, not a subscriber number — accepting it would hand
 * the owner an unreachable lead, which is worse than a validation error.
 */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-(). ]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return null;

  if (cleaned.startsWith("+")) {
    return /^\+[1-9]\d{7,14}$/.test(cleaned) ? cleaned : null;
  }
  if (/^00[1-9]\d{7,14}$/.test(cleaned)) return `+${cleaned.slice(2)}`;
  // National: 0 + 8 digits, mobile or landline.
  if (/^0[236789]\d{7}$/.test(cleaned)) return `+373${cleaned.slice(1)}`;
  // Subscriber only: 8 digits, must start with a real MD prefix.
  if (/^[236789]\d{7}$/.test(cleaned)) return `+373${cleaned}`;
  return null;
}

const M = {
  required: "Acest câmp este obligatoriu.",
  nameShort: "Scrie numele tău (minim 2 caractere).",
  nameLong: "Numele este prea lung.",
  phoneRequired: "Avem nevoie de un număr de telefon ca să te putem contacta.",
  phoneInvalid: "Numărul nu pare valid. Exemplu: 069 123 456.",
  emailInvalid: "Adresa de e-mail nu pare validă.",
  emailLong: "Adresa de e-mail este prea lungă.",
  serviceInvalid: "Alege un serviciu din listă.",
  localityLong: "Localitatea este prea lungă.",
  messageLong: "Textul este prea lung (maxim 1500 de caractere).",
  consent: "Fără acordul tău nu putem folosi datele ca să te contactăm.",
  emailNeeded: "Ai ales e-mailul ca metodă de contact — completează adresa.",
} as const;

const optionalLine = (max: number, tooLong: string) =>
  z
    .string()
    .transform(cleanLine)
    .refine((v) => v.length <= max, tooLong)
    .optional();

export const leadSchema = z
  .object({
    name: z
      .string({ error: M.required })
      .transform(cleanLine)
      .refine((v) => v.length >= 2, M.nameShort)
      .refine((v) => v.length <= 80, M.nameLong),

    /**
     * Transform, not refine: downstream code must never see the raw string.
     * `Lead["phone"]` is guaranteed E.164, so nothing user-typed can reach an
     * email subject or a tel: href.
     */
    phone: z
      .string({ error: M.phoneRequired })
      .min(1, M.phoneRequired)
      .transform((v, ctx) => {
        const e164 = normalizePhone(v);
        if (!e164) {
          ctx.addIssue({ code: "custom", message: M.phoneInvalid });
          return z.NEVER;
        }
        return e164;
      }),

    email: z
      .string()
      .transform(cleanLine)
      .refine((v) => v === "" || v.length <= 160, M.emailLong)
      .refine((v) => v === "" || z.email().safeParse(v).success, M.emailInvalid)
      .optional(),

    contactPreference: z.enum(contactPreferences).default("telefon"),

    service: z.enum(leadServiceSlugs, { error: M.serviceInvalid }),

    locality: optionalLine(80, M.localityLong),

    message: z
      .string()
      // Newlines survive here: this is the only place the visitor describes the
      // job, and paragraph breaks are how people write out a room.
      .transform((v) => clean(v).replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n"))
      .refine((v) => v.length <= 1500, M.messageLong)
      .optional(),

    consent: z.literal(true, { error: M.consent }),

    // Anti-abuse. Enforced silently in app/actions/lead.ts.
    website: z.string().max(0).optional(), // honeypot — must stay empty
    elapsedMs: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((v) => v.contactPreference !== "email" || Boolean(v.email), {
    message: M.emailNeeded,
    path: ["email"],
  });

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export function fieldErrorsFrom(error: z.ZodError<unknown>): LeadFieldErrors {
  const out: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      if (!(key in out)) out[key as keyof LeadFieldErrors] = issue.message;
    } else if (!out._form) {
      out._form = issue.message;
    }
  }
  // A parse can only fail with at least one issue; if every issue was pathless
  // and somehow empty, still give the form something to render.
  if (Object.keys(out).length === 0) out._form = M.required;
  return out;
}
