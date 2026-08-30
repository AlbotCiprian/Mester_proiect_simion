import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";
import { phone, site } from "@/lib/content";

/**
 * Global 404 — the one that fires for any path outside app/(public)/[locale]/,
 * e.g. "/zz". Without it Next serves its own bare English page, which on a
 * lead-generation site means a lost visitor with no way back and no phone number.
 *
 * It cannot use the locale layout (that layout is scoped to the [locale]
 * segment), so the chrome is intentionally minimal and self-contained.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-canvas px-5 py-24 text-center">
      <p className="kicker">Eroare 404</p>
      <h1 className="mt-5 max-w-xl text-display-2 text-ink">Pagina asta nu există</h1>
      <p className="mt-5 max-w-md text-lead text-ink-soft">
        Probabil linkul e vechi sau adresa a fost scrisă greșit. Poți porni de la pagina principală
        sau ne poți suna direct.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href={`/${defaultLocale}`}
          className="inline-flex min-h-12 items-center rounded-xs border border-ink bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink-soft"
        >
          Mergi la {site.shortName}
        </Link>
        <a
          href={`tel:${phone.e164}`}
          className="inline-flex min-h-12 items-center rounded-xs border border-line-strong px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Sună {phone.display}
        </a>
      </div>
    </main>
  );
}
