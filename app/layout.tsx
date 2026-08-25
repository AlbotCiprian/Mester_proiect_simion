import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
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
  title: {
    default: "Atelier Teracota — placări și renovări de baie",
    template: "%s · Atelier Teracota",
  },
  description:
    "Montaj de gresie, faianță și teracotă și renovări complete de baie în Moldova. Previzualizare de design (conținut provizoriu).",
  // One predicate governs indexability, in lib/seo.ts. `undefined` lets Next
  // omit the tag entirely once Gate A closes on the confirmed production host.
  robots: robotsMeta(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
