import Link from "next/link";
import { phone, publicChannels } from "@/lib/content";
import { Arrow, Button, Container } from "@/components/public/ui";

/**
 * The two conversion primitives, in one place.
 *
 * A tile setter is hired by phone. Every band on the site therefore offers the
 * SAME two actions in the same order — call, or send the form — so a visitor
 * never has to look for them, and so a change to the wording happens once.
 *
 * Server Components: these are links, not widgets. The only client behaviour on
 * the site's conversion path is the form itself.
 */

const hasPhone = publicChannels.some((c) => c.type === "phone");

/** Big, unmistakable phone link. `tel:` works on desktop too — it opens the
 *  handoff dialog — so it is not hidden behind a breakpoint. */
export function CallButton({
  variant = "bronze",
  className = "",
}: {
  variant?: "bronze" | "primary" | "ghost-light" | "secondary";
  className?: string;
}) {
  if (!hasPhone) return null;
  return (
    <Button href={`tel:${phone.e164}`} variant={variant} className={className}>
      <PhoneGlyph />
      {phone.display}
    </Button>
  );
}

export function PhoneGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        d="M2.5 5.5C2.5 4 3.7 3 5 3.2l1.5.2c.5.1.9.4 1 .9l.5 2c.1.5 0 1-.4 1.3l-1 .8c.8 1.6 2 2.8 3.6 3.6l.8-1c.3-.4.8-.5 1.3-.4l2 .5c.5.1.8.5.9 1l.2 1.5c.2 1.3-.8 2.5-2.3 2.5C8.4 17.6 2.9 12.1 2.5 5.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Mid-page conversion band.
 *
 * Placed after the proof (photographs, execution detail) and before the reader
 * has to scroll to the bottom. On a long page the footer form is a long way
 * away, and the moment someone is convinced is the moment they should be able
 * to act — not four screens later.
 */
export function ContactBand({
  locale,
  title,
  body,
}: {
  locale: string;
  title: string;
  body: string;
}) {
  return (
    <section className="joint-rule relative overflow-hidden bg-ink text-canvas">
      <div
        className="tile-grid tile-grid-fade pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />
      <Container className="relative py-14 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-display-3 text-canvas">{title}</h2>
            <p className="mt-3 text-base leading-relaxed text-canvas/75">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
            <CallButton variant="bronze" />
            {/* Bare hash: it resolves against the CURRENT page, so every route
                that renders an id="contact" keeps the visitor where they are. */}
            <Button href="#contact" variant="ghost-light">
              Cere o estimare <Arrow />
            </Button>
          </div>
        </div>
        <p className="mt-6 text-xs text-canvas/50">
          Fără obligații. Datele tale sunt folosite doar ca să îți răspundem — vezi{" "}
          <Link
            href={`/${locale}/confidentialitate`}
            className="underline underline-offset-4 hover:text-canvas"
          >
            politica de confidențialitate
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
