import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { ui } from "@/lib/ui-dict";
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
      {/* First focusable element on the page — it must precede the fixed header
          stack in DOM order, or a keyboard user tabs through the whole header
          before reaching it. */}
      <a
        href="#main"
        className="sr-only-field focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:h-auto focus:w-auto focus:rounded-xs focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        {ui(locale as Locale).nav.skipToContent}
      </a>

      {/* Fixed top stack so the cinematic hero can sit full-bleed behind a
          transparent header (spec 29 §4). Pages without a hero keep their own
          top padding so content is not hidden under it. */}
      <div className="fixed inset-x-0 top-0 z-50">
        <SiteHeader locale={locale as Locale} />
      </div>
      {/**
       * lang on the content wrapper, not on <html>.
       *
       * The <html> element lives in app/layout.tsx, which is the ROOT layout
       * and receives no params — Next gives a nested layout no way to change
       * an attribute on it. The supported fix is to make app/[locale]/layout.tsx
       * the root, which means deleting app/layout.tsx, app/page.tsx and
       * app/not-found.tsx and moving the / redirect into next.config. That is a
       * structural change to a live, indexed site and it is not worth making at
       * the same time as publishing a language.
       *
       * So: <html lang> stays "ro" and every word of content carries its real
       * language here. This is WCAG 3.1.2 (language of parts) satisfied for the
       * whole subtree — a screen reader pronounces the Russian pages correctly,
       * which is the actual user-facing benefit — while 3.1.1 (language of page)
       * stays imperfect. Google is told the language by hreflang regardless.
       *
       * TRACKED, not forgotten: fix it in its own change, with its own build
       * verification, once the launch has settled.
       */}
      <main id="main" tabIndex={-1} lang={locale}>
        {children}
      </main>
      <SiteFooter locale={locale as Locale} />
      <StickyContactBar locale={locale as Locale} />
      {/* Spacer so the mobile sticky bar never covers footer content. */}
      <div aria-hidden="true" className="h-16 bg-ink lg:hidden" />
    </>
  );
}
