import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Root entry redirects to the default locale (ADR-011: explicit locale prefix).
// Permanent, not temporary: a 307 leaves "/" as a separate crawlable URL that
// competes with "/ro" for the same content.
export default function RootPage() {
  permanentRedirect(`/${defaultLocale}`);
}
