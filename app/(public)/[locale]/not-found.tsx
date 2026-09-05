import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";
import { phone } from "@/lib/content";
import { ui } from "@/lib/ui-dict";
import { Container, Kicker } from "@/components/public/ui";

/**
 * 404 inside the locale layout, so a wrong URL keeps the header, footer and
 * contact bar instead of dropping the visitor onto a bare page. A lost visitor
 * on a lead-gen site should still be one tap from the phone number.
 *
 * BILINGUAL, and not by preference. `not-found.tsx` is a Next special file: it
 * receives no `params`, so it cannot know which locale the visitor was in — a
 * Russian visitor was being shown "Pagina asta nu există" in Romanian.
 *
 * The alternatives were worse. Reading the locale from headers() would make the
 * segment dynamic and cost the static prerender; parsing the URL client-side
 * would flash the wrong language first. Showing both is what an airport sign
 * does, it is correct for every visitor, and each block carries its own `lang`
 * so a screen reader pronounces both properly (WCAG 3.1.2).
 */
export default function LocaleNotFound() {
  return (
    <div className="bg-canvas pb-24 pt-32 sm:pt-36">
      <Container className="max-w-[44rem]">
        {locales.map((locale, index) => (
          <Block key={locale} locale={locale} first={index === 0} />
        ))}
      </Container>
    </div>
  );
}

function Block({ locale, first }: { locale: Locale; first: boolean }) {
  const t = ui(locale);
  return (
    <section
      lang={locale}
      className={first ? "" : "mt-12 border-t border-line pt-12"}
    >
      <Kicker>{t.notFound.kicker}</Kicker>
      <h1 className="mt-5 text-display-2 text-ink">{t.notFound.title}</h1>
      <p className="mt-5 text-lead text-ink-soft">{t.notFound.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/${locale === defaultLocale ? defaultLocale : locale}`}
          className="inline-flex min-h-12 items-center rounded-xs border border-ink bg-ink px-6 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-ink-soft"
        >
          {t.notFound.back}
        </Link>
        <a
          href={`tel:${phone.e164}`}
          className="inline-flex min-h-12 items-center gap-2 rounded-xs border border-line-strong px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          {t.cta.call} {phone.display}
        </a>
      </div>
    </section>
  );
}
