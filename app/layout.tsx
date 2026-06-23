import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";

// Self-hosted at build time by next/font. Display serif + geometric grotesk,
// both with Latin-ext (RO) and Cyrillic (RU) coverage. See spec 06.
const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Atelier Teracota — placări și renovări de baie",
    template: "%s · Atelier Teracota",
  },
  description:
    "Montaj de gresie, faianță și teracotă și renovări complete de baie în Moldova. Previzualizare de design (conținut provizoriu).",
  // Prototype build is never indexable until Gate A is complete (spec 18/22).
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
