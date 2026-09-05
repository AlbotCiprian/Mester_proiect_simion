import Link from "next/link";
import { publicChannels, nav, navHref, navPages, phone, site } from "@/lib/content";
import { defaultLocale, publishedLocales, type Locale } from "@/lib/i18n";
import { Container } from "@/components/public/ui";
import { PhoneGlyph } from "@/components/public/cta";

// Only pages that exist. "Cookies" is intentionally absent: the site sets no
// cookies, and the privacy page now says so in its own section — a separate
// page would only advertise a consent banner we do not need.
// "Termeni" stays blocked on a decision the owner has not made.
const legal = [{ label: "Confidențialitate", path: "/confidentialitate" }];

export function SiteFooter({ locale }: { locale: Locale }) {
  const linkLocale = publishedLocales.includes(locale) ? locale : defaultLocale;
  const phoneChannel = publicChannels.find((c) => c.type === "phone");

  return (
    <footer className="bg-ink text-canvas">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-canvas/70">{site.tagline}.</p>
            <p className="mt-4 text-sm text-canvas/55">{site.serviceArea}</p>

            {/* The number, large and first. It is the primary conversion action
                and it was previously one line item in a list of links. */}
            {phoneChannel ? (
              <a
                href={phoneChannel.href}
                className="mt-6 inline-flex items-center gap-2.5 font-display text-2xl font-semibold text-canvas transition-colors hover:text-bronze-light"
              >
                <PhoneGlyph className="h-5 w-5" />
                {phone.display}
              </a>
            ) : null}
          </div>

          <nav aria-label="Footer — pagini" className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canvas/50">Navigare</p>
            <ul className="mt-4 space-y-2.5">
              {navPages.map((item) => (
                <li key={item.path}>
                  <Link
                    href={`/${linkLocale}${item.path}`}
                    className="font-medium text-canvas/90 transition-colors hover:text-canvas"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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

        {/* The fifteen topic titles used to be listed here, sitewide, as the
            internal-linking layer. Removed at the owner's request: it was the
            longest block on the page and it read as a keyword list.

            The pages are NOT orphaned by this — "Servicii" is in the primary
            navigation, the hub links all fifteen with descriptions, each page
            links three siblings, and all fifteen are in the sitemap. The cost is
            that they are two clicks from the homepage instead of one, which is
            a slower first crawl and nothing more. */}

        <div className="mt-12 flex flex-col gap-4 border-t border-canvas/15 pt-6 text-xs text-canvas/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex flex-wrap gap-5">
            {legal.map((item) => (
              <li key={item.label}>
                {/* An unpublished locale has no legal pages, so the link must point
                    at one that does — otherwise /ru links to a 404. */}
                <Link
                  href={`/${linkLocale}${item.path}`}
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
