"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { submitLead } from "@/app/actions/lead";
import { phone } from "@/lib/content";
import {
  contactPreferenceLabels,
  contactPreferences,
  leadServiceLabels,
  leadServiceSlugs,
  type LeadFieldErrors,
  type LeadResult,
} from "@/lib/lead";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/public/ui";

/**
 * Client Component because it needs: per-field error rendering, a pending state,
 * focus management on the result, and the client-side timing signal used as a bot
 * trap. It degrades without JavaScript — `useActionState` posts the form natively,
 * the server action still runs, and the result renders on the response.
 */

const FIELD =
  "w-full rounded-xs border bg-canvas/5 px-3.5 py-3 text-[0.95rem] text-canvas placeholder:text-canvas/35 " +
  "transition-colors focus:bg-canvas/10 focus:outline-none";
const FIELD_OK = "border-canvas/25 focus:border-bronze-light";
const FIELD_ERR = "border-danger-light focus:border-danger-light";
const LABEL = "block text-xs font-semibold uppercase tracking-[0.16em] text-canvas/60";

export function LeadForm({ locale }: { locale: string }) {
  const [state, formAction] = useActionState<LeadResult | null, FormData>(submitLead, null);
  const uid = useId();
  const mountedAt = useRef<number>(0);
  const elapsedRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
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
        <p className="mt-4 text-xs text-canvas/45">Referință: {state.reference}</p>
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
          <p className="font-display text-xl text-canvas">Prea multe încercări</p>
          <p className="mt-3 text-canvas/75">
            Am primit deja câteva cereri de la tine. Mai încearcă peste câteva minute sau sună la{" "}
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
          Mai sunt câteva câmpuri de corectat mai jos.
        </div>
      ) : null}

      <form action={formAction} onInput={onFormInput} noValidate className="grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="sourcePath" value="/#contact" />
        <input ref={elapsedRef} type="hidden" name="elapsedMs" defaultValue="" />

        {/* Honeypot. Hidden from people, irresistible to form-filling scripts. */}
        <div className="sr-only-field" aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Nu completa acest câmp</label>
          <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
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
          <select
            id={`${uid}-service`}
            name="service"
            required
            defaultValue="renovari-bai"
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? `${uid}-service-err` : undefined}
            className={`${FIELD} ${errors.service ? FIELD_ERR : FIELD_OK} mt-2 appearance-none`}
          >
            {leadServiceSlugs.map((slug) => (
              <option key={slug} value={slug} className="bg-ink text-canvas">
                {leadServiceLabels[slug]}
              </option>
            ))}
          </select>
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

        <div>
          <label className={LABEL} htmlFor={`${uid}-pref`}>
            Cum preferi să te contactăm
          </label>
          <select
            id={`${uid}-pref`}
            name="contactPreference"
            defaultValue="telefon"
            className={`${FIELD} ${FIELD_OK} mt-2 appearance-none`}
          >
            {contactPreferences.map((p) => (
              <option key={p} value={p} className="bg-ink text-canvas">
                {contactPreferenceLabels[p]}
              </option>
            ))}
          </select>
        </div>

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
          <p className="mt-3 text-xs text-canvas/45">
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
        <p id={hintId} className="mt-1.5 text-xs text-canvas/45">
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
