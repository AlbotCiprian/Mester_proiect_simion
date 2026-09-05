"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contactHash, nav, navHref, navPages, phone, publicChannels, site } from "@/lib/content";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { Button } from "@/components/public/ui";
import { PhoneGlyph } from "@/components/public/cta";

// Two-state header (spec 29 §4): transparent (light-on-dark) over the cinematic
// hero, solid (ink-on-canvas) after a short scroll. Pages without a #cinematic-hero
// stay solid from the start.
export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("cinematic-hero");
    if (!hero) {
      setSolid(true);
      return;
    }
    const onScroll = () => {
      const next = window.scrollY > 8;
      setSolid((prev) => (prev !== next ? next : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The phone must be reachable from the header on every page. A tile setter is
  // hired by phone, and the number was previously visible only after scrolling
  // to the footer or opening the mobile menu.
  const phoneChannel = publicChannels.find((c) => c.type === "phone");

  const shell = solid
    ? "site-header--solid border-b border-line/80 bg-canvas/85 backdrop-blur supports-[backdrop-filter]:bg-canvas/70"
    : "bg-gradient-to-b from-ink/70 via-ink/40 to-transparent";
  const brand = solid ? "text-ink" : "text-canvas";
  const navLink = solid ? "text-ink-soft hover:text-ink" : "text-canvas hover:text-canvas";
  const localeInactive = solid ? "text-muted hover:text-ink" : "text-canvas/90 hover:text-canvas";
  const localeActive = solid ? "bg-ink text-canvas" : "bg-canvas text-ink";
  const menuBtn = solid ? "border-line-strong text-ink" : "border-canvas/60 text-canvas";
  // bronze-light is 2.15:1 on the solid header's canvas — a fail. bronze-deep is
  // 5.94:1 there, and bronze-light is 7.49:1 over the ink scrim.
  const descriptor = solid ? "text-bronze-deep" : "text-bronze-light";
  const phoneLink = solid
    ? "text-ink hover:text-bronze-deep"
    : "text-canvas hover:text-bronze-light";

  return (
    <header className={`transition-colors duration-300 ${shell}`}>
      <div className="mx-auto flex max-w-[78rem] items-center justify-between gap-4 px-5 py-4 sm:gap-6 sm:px-8 lg:px-10">
        <Link href={`/${locale}`} className="group flex items-baseline gap-2" aria-label={site.name}>
          <span className={`font-display text-xl font-semibold tracking-tight ${brand}`}>{site.name}</span>
          {/* Always visible, including on phones: "SemiDom" is abstract and
              carries no meaning without it. Sourced from lib/content.ts so the
              wordmark cannot drift from the brand definition. */}
          <span
            className={`whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.62rem] sm:tracking-[0.2em] ${descriptor}`}
          >
            {site.descriptorShort}
          </span>
        </Link>

        {/* xl, not lg: at 1024px six items plus the locale switch, the phone
            and the CTA no longer fit on one line without wrapping. Below xl the
            hamburger carries the same links. */}
        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-6" aria-label="Navigație principală">
          {navPages.map((item) => (
            <Link
              key={item.path}
              href={`/${locale}${item.path}`}
              className={`whitespace-nowrap text-sm font-medium transition-colors ${navLink}`}
            >
              {item.label}
            </Link>
          ))}
          {nav.map((item) => (
            <Link
              key={item.hash}
              href={navHref(locale, item.hash)}
              className={`whitespace-nowrap text-sm font-medium transition-colors ${navLink}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 text-xs sm:flex" aria-label="Limbă">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                aria-current={l === locale ? "true" : undefined}
                className={`rounded-xs px-2 py-1 font-semibold uppercase tracking-wide transition-colors ${
                  l === locale ? localeActive : localeInactive
                }`}
                title={localeLabels[l]}
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Desktop: the number spelled out, because people read it and dial on
              another device. Mobile: an icon-only tap target, because there the
              number is redundant next to the sticky "Sună" bar. */}
          {phoneChannel ? (
            <>
              <a
                href={phoneChannel.href}
                className={`hidden items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-colors sm:inline-flex ${phoneLink}`}
              >
                <PhoneGlyph />
                {phone.display}
              </a>
              <a
                href={phoneChannel.href}
                aria-label={`Sună la ${phone.display}`}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xs border transition-colors sm:hidden ${menuBtn}`}
              >
                <PhoneGlyph className="h-[1.15rem] w-[1.15rem]" />
              </a>
            </>
          ) : null}

          <div className="hidden sm:block">
            {/* Relative hash: every public route renders id="contact", so this
                scrolls in place instead of navigating back to the homepage. */}
            <Button href={contactHash} variant="bronze">
              Cere o estimare
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xs border transition-colors xl:hidden ${menuBtn}`}
          >
            <span className="sr-only">Meniu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-canvas-raised xl:hidden">
          <nav className="mx-auto flex max-w-[78rem] flex-col px-5 py-3 sm:px-8" aria-label="Navigație mobilă">
            {navPages.map((item) => (
              <Link
                key={item.path}
                href={`/${locale}${item.path}`}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 text-base font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            {nav.map((item) => (
              <Link
                key={item.hash}
                href={navHref(locale, item.hash)}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 text-base font-medium text-ink-soft"
              >
                {item.label}
              </Link>
            ))}
            {phoneChannel ? (
              <a
                href={phoneChannel.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-line/70 py-3 text-base font-semibold text-ink"
              >
                <PhoneGlyph />
                {phone.display}
              </a>
            ) : null}
            <div className="mt-3 pb-2">
              <Button href={contactHash} variant="bronze" className="w-full">
                Cere o estimare
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
