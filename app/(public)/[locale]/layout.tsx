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
      <PreviewNotice />
      <SiteHeader locale={locale as Locale} />
      <main>{children}</main>
      <SiteFooter />
      <StickyContactBar />
      {/* Spacer so the mobile sticky bar never covers footer content. */}
      <div aria-hidden="true" className="h-16 lg:hidden" />
    </>
  );
}
