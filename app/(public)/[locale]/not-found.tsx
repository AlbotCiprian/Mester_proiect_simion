import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";
import { phone } from "@/lib/content";
import { Container, Kicker } from "@/components/public/ui";

/**
 * 404 inside the locale layout, so a wrong URL keeps the header, footer and
 * contact bar instead of dropping the visitor onto a bare page. A lost visitor
 * on a lead-gen site should still be one tap from the phone number.
 */
export default function LocaleNotFound() {
  return (
    <div className="bg-canvas pb-24 pt-32 sm:pt-36">
      <Container className="max-w-[44rem]">
        <Kicker>Eroare 404</Kicker>
        <h1 className="mt-5 text-display-2 text-ink">Pagina asta nu există</h1>
        <p className="mt-5 text-lead text-ink-soft">
          Probabil linkul e vechi sau adresa a fost scrisă greșit. Poți porni de la pagina
          principală sau ne poți suna direct.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${defaultLocale}`}
            className="inline-flex min-h-12 items-center rounded-xs border border-ink bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink-soft"
          >
            Mergi la pagina principală
          </Link>
          <a
            href={`tel:${phone.e164}`}
            className="inline-flex min-h-12 items-center rounded-xs border border-line-strong px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            Sună {phone.display}
          </a>
        </div>
      </Container>
    </div>
  );
}
