import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { HomeSections } from "@/components/public/home-sections";
import { Container } from "@/components/public/ui";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // No silent fallback to another language (ADR-011). Unpublished locales get
  // an honest notice instead of mixed-language content.
  if (!publishedLocales.includes(locale as Locale)) {
    return <ComingSoon />;
  }

  return <HomeSections />;
}

function ComingSoon() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="kicker">Русская версия</p>
      <h1 className="mt-5 text-3xl text-ink sm:text-4xl">Versiunea în limba rusă urmează</h1>
      <p className="mt-4 max-w-md text-muted">
        Conținutul în limba rusă se publică doar după traduceri verificate (CONFIRM_OWNER). Între timp,
        vezi varianta în limba română.
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-8 inline-flex items-center gap-2 rounded-xs border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
      >
        Mergi la versiunea RO
      </Link>
    </Container>
  );
}
