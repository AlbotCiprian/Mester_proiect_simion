import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { PreviewNotice } from "@/components/public/preview-notice";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { StickyContactBar } from "@/components/public/sticky-contact-bar";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      {/* Fixed top stack so the cinematic hero can sit full-bleed behind a
          transparent header (spec 29 §4). Pages without a hero keep their own
          top padding so content is not hidden under it. */}
      <div className="fixed inset-x-0 top-0 z-50">
        <PreviewNotice />
        <SiteHeader locale={locale as Locale} />
      </div>
      {/* Skip link: the first focusable element on every page, so a keyboard
          user is not walked through the whole header stack on each route. */}
      <a
        href="#main"
        className="sr-only-field focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:h-auto focus:w-auto focus:rounded-xs focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        Sari la conținut
      </a>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale as Locale} />
      <StickyContactBar locale={locale} />
      {/* Spacer so the mobile sticky bar never covers footer content. */}
      <div aria-hidden="true" className="h-16 lg:hidden" />
    </>
  );
}
