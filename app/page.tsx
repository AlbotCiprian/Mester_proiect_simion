import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Root entry redirects to the default locale (ADR-011: explicit locale prefix).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
