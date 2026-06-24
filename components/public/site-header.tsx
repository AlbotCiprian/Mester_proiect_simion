"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { Button } from "@/components/public/ui";

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

  const shell = solid
    ? "site-header--solid border-b border-line/80 bg-canvas/85 backdrop-blur supports-[backdrop-filter]:bg-canvas/70"
    : "bg-gradient-to-b from-ink/45 to-transparent";
  const brand = solid ? "text-ink" : "text-canvas";
  const navLink = solid ? "text-ink-soft hover:text-ink" : "text-canvas/85 hover:text-canvas";
  const localeInactive = solid ? "text-muted hover:text-ink" : "text-canvas/70 hover:text-canvas";
  const localeActive = solid ? "bg-ink text-canvas" : "bg-canvas text-ink";
  const menuBtn = solid ? "border-line-strong text-ink" : "border-canvas/40 text-canvas";

  return (
    <header className={`transition-colors duration-300 ${shell}`}>
      <div className="mx-auto flex max-w-[78rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href={`/${locale}`} className="group flex items-baseline gap-2" aria-label={site.name}>
          <span className={`font-display text-xl font-semibold tracking-tight ${brand}`}>{site.name}</span>
          <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-bronze-light sm:inline">
            Atelier
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigație principală">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm font-medium transition-colors ${navLink}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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

          <div className="hidden sm:block">
            <Button href="#contact" variant="bronze">
              Cere o estimare
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xs border transition-colors lg:hidden ${menuBtn}`}
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
        <div id="mobile-menu" className="border-t border-line bg-canvas-raised lg:hidden">
          <nav className="mx-auto flex max-w-[78rem] flex-col px-5 py-3 sm:px-8" aria-label="Navigație mobilă">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 text-base font-medium text-ink-soft last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pb-2">
              <Button href="#contact" variant="bronze" className="w-full">
                Cere o estimare
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
