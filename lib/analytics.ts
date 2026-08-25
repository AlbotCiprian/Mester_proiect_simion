/**
 * Lightweight, PII-free analytics dispatch (ADR-013, spec 20).
 * No-op until a GA4 tag exists; safe to call anywhere on the client.
 *
 * NEVER pass a name, phone number, e-mail address or message body. The debug
 * branch below prints whatever it is handed, and props are forwarded verbatim to
 * a third party the moment a tag is installed. Slugs, placements and counts only.
 */
type EventProps = Record<string, string | number | boolean | undefined>;

export function track(event: string, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (type: string, name: string, params: EventProps) => void;
  };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...props });
  if (typeof w.gtag === "function") w.gtag("event", event, props);
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
