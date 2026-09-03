import Link from "next/link";
import { publicChannels, nav, navHref, site } from "@/lib/content";
import { defaultLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { Container } from "@/components/public/ui";

// Only pages that exist. "Cookies" is intentionally absent: the site sets no
// cookies, so the page would only advertise a consent banner we do not need.
// "Termeni" is blocked on the legal entity (checklist A4).
const legal = [{ label: "Confidențialitate", path: "/confidentialitate" }];

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-ink text-canvas">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-canvas/70">{site.tagline}.</p>
            <p className="mt-4 text-sm text-canvas/55">
              {site.serviceArea}
            </p>
          </div>

          <nav aria-label="Footer — pagini" className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canvas/50">Navigare</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.hash}>
                  <Link
                    href={navHref(locale, item.hash)}
                    className="text-canvas/80 transition-colors hover:text-canvas"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canvas/50">Contact</p>
            <ul className="mt-4 space-y-2.5">
              {publicChannels.map((c) => (
                <li key={c.type}>
                  <Link href={c.href} className="text-canvas/80 transition-colors hover:text-canvas">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-canvas/15 pt-6 text-xs text-canvas/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex flex-wrap gap-5">
            {legal.map((item) => (
              <li key={item.label}>
                {/* An unpublished locale has no legal pages, so the link must point
                    at one that does — otherwise /ru links to a 404. */}
                <Link
                  href={`/${publishedLocales.includes(locale) ? locale : defaultLocale}${item.path}`}
                  className="transition-colors hover:text-canvas"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
