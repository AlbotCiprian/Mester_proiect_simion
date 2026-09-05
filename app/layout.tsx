import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
import { getSiteText, site } from "@/lib/content";
import { SITE_URL, robotsMeta } from "@/lib/seo";

// Self-hosted at build time by next/font. Architectural editorial serif +
// geometric grotesk, both with Latin-ext (RO) and Cyrillic (RU) coverage. See spec 06.
// Source Serif 4: sturdier stroke modulation than a didone — survives white-on-dark
// over the hero video and reads as an atelier, not a template.
const display = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Derived from lib/content.ts so renaming the business is a one-file edit.
  title: {
    default: `${site.name} — ${getSiteText(defaultLocale).tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Montaj de gresie și faianță și renovări complete de baie în Chișinău și împrejurimi, " +
    "documentate cu fotografii din lucrări reale.",
  // One predicate governs indexability, in lib/seo.ts. `undefined` lets Next
  // omit the tag entirely once Gate A closes on the confirmed production host.
  robots: robotsMeta(),
  /**
   * Search Console verification, HTML-tag method.
   *
   * A second, independent path to verifying the site, because the DNS method
   * kept failing: the domain's nameservers are Vercel's, so the TXT record was
   * being added in a cPanel zone that nothing on the internet queries.
   *
   * The token is NOT a secret — Google's whole design is that it is published,
   * either in public DNS or in a public page. It still comes from an env var
   * rather than a literal so that a Preview deployment, which must never be
   * verified as the production site, simply does not carry the tag.
   *
   * Set GOOGLE_SITE_VERIFICATION in Vercel (Production) to the token Search
   * Console shows for a **URL prefix** property. Absent, Next omits the tag.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
