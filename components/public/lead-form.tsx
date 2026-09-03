"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { submitLead } from "@/app/actions/lead";
import { phone, publicChannels } from "@/lib/content";
// lib/lead-labels, NOT lib/lead: importing the schema module would pull zod into
// the client bundle (measured: +19.3 kB brotli) for six plain constants.
import {
  contactPreferenceLabels,
  contactPreferences,
  PREFERENCE_CHANNEL,
  leadServiceLabels,
  leadServiceSlugs,
  type ContactPreference,
  type LeadFieldErrors,
  type LeadResult,
} from "@/lib/lead-labels";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/public/ui";

/**
 * Client Component because it needs: per-field error rendering, a pending state,
 * focus management on the result, and the client-side timing signal used as a bot
 * trap. It degrades without JavaScript — `useActionState` posts the form natively,
 * the server action still runs, and the result renders on the response.
 */

// text-base is a hard requirement, not a preference: anything under 16px makes
// iOS Safari zoom the viewport on focus. `focus:outline-none` is deliberately
// ABSENT — the global :focus-visible ring is the only focus indicator these
// controls have, and FIELD_ERR's focus state is otherwise byte-identical to its
// resting state (WCAG 2.4.7). Fill and border are darkened so the control has a
// perceivable boundary against the panel (SC 1.4.11).
const FIELD =
  "w-full rounded-xs border bg-canvas/10 px-3.5 py-3 text-base text-canvas placeholder:text-canvas/60 " +
  "transition-colors focus:bg-canvas/15";
const FIELD_OK = "border-canvas/45 focus:border-bronze-light";
const FIELD_ERR = "border-danger-light focus:border-danger-light";
const LABEL = "block text-xs font-semibold uppercase tracking-[0.16em] text-canvas/60";

/**
 * Contact methods the owner has actually confirmed, in the site's own order.
 * Always non-empty: the phone is confirmed, and a lead form that cannot say how
 * it will reply is worse than one that offers a single option.
 */
const offeredPreferences: ContactPreference[] = (() => {
  const confirmed = contactPreferences.filter((p) =>
    publicChannels.some((c) => c.type === PREFERENCE_CHANNEL[p]),
  );
  return confirmed.length > 0 ? confirmed : ["telefon"];
})();

export function LeadForm({ locale }: { locale: string }) {
  const [state, formAction] = useActionState<LeadResult | null, FormData>(submitLead, null);
  const uid = useId();
  const mountedAt = useRef<number>(0);
  const elapsedRef = useRef<HTMLInputElement>(null);
  const pathRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const utmRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
    // Attribution, captured on mount. Read here rather than on the server
    // because a statically prerendered page has no request context. All three
    // are untrusted and are reduced to an allowlist in the Server Action.
    if (pathRef.current) pathRef.current.value = window.location.pathname;
    if (referrerRef.current) referrerRef.current.value = document.referrer.slice(0, 300);
    if (utmRef.current) {
      utmRef.current.value = new URLSearchParams(window.location.search).get("utm_source") ?? "";
    }
  }, []);

  // Move focus to the outcome so a screen reader and a keyboard user both land on
  // it, instead of being left at the bottom of a form that appears unchanged.
  useEffect(() => {
    if (!state) return;
    statusRef.current?.focus();
    if (state.status === "success") track("lead_submit_success", { locale, page_type: "home" });
    else track("lead_submit_error", { locale, reason: state.status, page_type: "home" });
  }, [state, locale]);

  /**
   * Runs on every input event in the form. Keeps the timing signal current, so
   * it measures how long the visitor actually spent rather than how quickly they
   * reached the first field. Without JS the field stays empty and the server
   * skips the check entirely.
   */
  function onFormInput() {
    if (elapsedRef.current && mountedAt.current) {
      elapsedRef.current.value = String(Date.now() - mountedAt.current);
    }
    if (startedRef.current) return;
    startedRef.current = true;
    track("lead_start", { locale, page_type: "home" });
  }

  if (state?.status === "success") {
    return (
      <Outcome tone="success" innerRef={statusRef} live="status">
        <p className="font-display text-2xl text-canvas">Cererea a plecat spre noi.</p>
        <p className="mt-3 text-canvas/75">
          Revenim cu un răspuns la numărul lăsat. Dacă vrei mai repede, sună direct la{" "}
          <a className="font-semibold text-bronze-light underline underline-offset-4" href={`tel:${phone.e164}`}>
            {phone.display}
          </a>
          .
        </p>
        <p className="mt-4 text-xs text-canvas/60">Referință: {state.reference}</p>
      </Outcome>
    );
  }

  const errors: LeadFieldErrors = state?.status === "invalid" ? state.errors : {};

  return (
    <div>
      {/* Failure paths get the phone number, never a soothing message: with no
          database behind the form, an undelivered request is simply lost. */}
      {state?.status === "undelivered" ? (
        <Outcome tone="danger" innerRef={statusRef} live="alert" className="mb-8">
          <p className="font-display text-xl text-canvas">Nu am putut trimite cererea.</p>
          <p className="mt-3 text-canvas/75">
            A fost o problemă tehnică la trimitere, iar cererea ta nu a ajuns la noi. Te rugăm sună la{" "}
            <a className="font-semibold text-bronze-light underline underline-offset-4" href={`tel:${phone.e164}`}>
              {phone.display}
            </a>{" "}
            — răspundem direct.
          </p>
        </Outcome>
      ) : null}

      {state?.status === "rate_limited" ? (
        <Outcome tone="danger" innerRef={statusRef} live="alert" className="mb-8">
          <p className="font-display text-xl text-canvas">Prea multe trimiteri într-un timp scurt</p>
          <p className="mt-3 text-canvas/75">
            Formularul limitează numărul de trimiteri, așa că ultima nu a fost procesată. Mai
            încearcă peste câteva minute sau sună direct la{" "}
            <a className="font-semibold text-bronze-light underline underline-offset-4" href={`tel:${phone.e164}`}>
              {phone.display}
            </a>
            .
          </p>
        </Outcome>
      ) : null}

      {state?.status === "invalid" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-sm border border-danger-light/50 bg-danger-light/10 p-4 text-sm text-danger-light"
        >
          {/* Falls back to any error whose field is not rendered inline —
              otherwise the banner says "correct the fields below" while every
              visible field looks clean and nothing can be corrected. */}
          {unrenderedError(errors) ?? "Mai sunt câteva câmpuri de corectat mai jos."}
        </div>
      ) : null}

      <form action={formAction} onInput={onFormInput} noValidate className="grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="locale" value={locale} />
        <input ref={pathRef} type="hidden" name="sourcePath" defaultValue="/" />
        <input ref={referrerRef} type="hidden" name="referrer" defaultValue="" />
        <input ref={utmRef} type="hidden" name="utmSource" defaultValue="" />
        <input ref={elapsedRef} type="hidden" name="elapsedMs" defaultValue="" />

        {/* Honeypot. `hidden`, not merely off-screen: a visually-hidden input is
            still reachable by password managers, and one filling it would silently
            discard a real lead. The name avoids every common autofill token for
            the same reason. */}
        <div hidden aria-hidden="true">
          <label htmlFor={`${uid}-confirm-ref`}>Nu completa acest câmp</label>
          <input
            id={`${uid}-confirm-ref`}
            name="confirm_ref"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Field
          id={`${uid}-name`}
          name="name"
          label="Nume"
          required
          autoComplete="name"
          placeholder="Ion Popescu"
          error={errors.name}
        />

        <Field
          id={`${uid}-phone`}
          name="phone"
          label="Telefon"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="069 123 456"
          error={errors.phone}
          hint="Îl folosim doar ca să revenim cu un răspuns."
        />

        <div>
          <label className={LABEL} htmlFor={`${uid}-service`}>
            Ce ai de făcut <Req />
          </label>
          <div className="relative mt-2">
            <select
              id={`${uid}-service`}
              name="service"
              required
              defaultValue="renovari-bai"
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={errors.service ? `${uid}-service-err` : undefined}
              className={`${FIELD} ${errors.service ? FIELD_ERR : FIELD_OK} appearance-none pr-10`}
            >
              {leadServiceSlugs.map((slug) => (
                <option key={slug} value={slug} className="bg-ink text-canvas">
                  {leadServiceLabels[slug]}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
          <FieldError id={`${uid}-service-err`} message={errors.service} />
        </div>

        <Field
          id={`${uid}-locality`}
          name="locality"
          label="Localitate"
          autoComplete="address-level2"
          placeholder="Chișinău, sect. Botanica"
          error={errors.locality}
        />

        {/* Only channels the owner has CONFIRMED. Offering Viber or Telegram
            while publicChannels hides them everywhere else would promise a reply
            on a channel that may not exist. With one confirmed channel there is
            nothing to choose, so the field becomes a hidden input. */}
        {offeredPreferences.length > 1 ? (
          <div>
            <label className={LABEL} htmlFor={`${uid}-pref`}>
              Cum preferi să te contactăm
            </label>
            <div className="relative mt-2">
              <select
                id={`${uid}-pref`}
                name="contactPreference"
                defaultValue={offeredPreferences[0]}
                className={`${FIELD} ${FIELD_OK} appearance-none pr-10`}
              >
                {offeredPreferences.map((p) => (
                  <option key={p} value={p} className="bg-ink text-canvas">
                    {contactPreferenceLabels[p]}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>
        ) : (
          <input type="hidden" name="contactPreference" value={offeredPreferences[0]} />
        )}

        <Field
          id={`${uid}-email`}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="opțional"
          error={errors.email}
        />

        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor={`${uid}-message`}>
            Detalii
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            maxLength={1500}
            placeholder="Suprafața aproximativă, starea încăperii, termenul dorit…"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${uid}-message-err` : undefined}
            className={`${FIELD} ${errors.message ? FIELD_ERR : FIELD_OK} mt-2 resize-y`}
          />
          <FieldError id={`${uid}-message-err`} message={errors.message} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-canvas/75">
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
              className="mt-1 h-5 w-5 flex-none accent-bronze"
            />
            {/* A checkbox cannot discharge the information duty on its own: the
                notice has to be reachable from the point of collection. */}
            <span>
              Am citit{" "}
              <Link
                href={`/${locale}/confidentialitate`}
                className="font-medium text-bronze-light underline underline-offset-4"
              >
                politica de confidențialitate
              </Link>{" "}
              și sunt de acord să fiu contactat în legătură cu această cerere. Datele nu sunt
              folosite în alt scop și nu sunt transmise mai departe. <Req />
            </span>
          </label>
          <FieldError id={`${uid}-consent-err`} message={errors.consent} />
        </div>

        <div className="sm:col-span-2">
          <SubmitButton />
          <p className="mt-3 text-xs text-canvas/60">
            Preferi să vorbești direct? Sună la{" "}
            <a className="text-canvas/70 underline underline-offset-4" href={`tel:${phone.e164}`}>
              {phone.display}
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border border-bronze-deep bg-bronze-deep px-6 py-3.5 text-sm font-semibold tracking-wide text-canvas-raised transition-colors hover:bg-bronze disabled:cursor-progress disabled:opacity-70"
    >
      {pending ? "Se trimite…" : "Trimite cererea"}
      {pending ? null : <Arrow />}
    </button>
  );
}

function Req() {
  return (
    <span className="text-bronze-light" aria-hidden="true">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-danger-light">
      {message}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  error,
  hint,
  required,
  type = "text",
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div>
      <label className={LABEL} htmlFor={id}>
        {label} {required ? <Req /> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`${FIELD} ${error ? FIELD_ERR : FIELD_OK} mt-2`}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-canvas/60">
          {hint}
        </p>
      ) : null}
      <FieldError id={errId} message={error} />
    </div>
  );
}

function Outcome({
  tone,
  children,
  innerRef,
  live,
  className = "",
}: {
  tone: "success" | "danger";
  children: React.ReactNode;
  innerRef: React.RefObject<HTMLDivElement | null>;
  live: "status" | "alert";
  className?: string;
}) {
  const border = tone === "success" ? "border-success-light/40" : "border-danger-light/40";
  const bg = tone === "success" ? "bg-success-light/10" : "bg-danger-light/10";
  return (
    <div
      ref={innerRef}
      tabIndex={-1}
      role={live}
      aria-live={live === "alert" ? "assertive" : "polite"}
      className={`rounded-sm border ${border} ${bg} p-6 sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

/** Keys the form renders inline; anything else must surface in the banner. */
const INLINE_ERROR_KEYS = new Set([
  "name",
  "phone",
  "email",
  "service",
  "locality",
  "message",
  "consent",
]);

function unrenderedError(errors: LeadFieldErrors): string | null {
  for (const [key, message] of Object.entries(errors)) {
    if (!INLINE_ERROR_KEYS.has(key) && message) return message;
  }
  return null;
}

/** Replacement affordance for `appearance-none` selects. */
function Chevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-canvas/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
