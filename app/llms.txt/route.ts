import { INDEXABLE, absoluteUrl } from "@/lib/seo";
import { phone, services, site } from "@/lib/content";
import { landingPages } from "@/lib/landing";
import { defaultLocale } from "@/lib/i18n";

/**
 * A route handler rather than a static public/llms.txt, so the file is derived
 * from lib/content.ts and cannot drift away from what the site actually says.
 *
 * Honest framing: no major model provider has committed to consuming llms.txt.
 * It costs half an hour, nothing depends on it, and it is not a ranking factor.
 *
 * It 404s until Gate A closes — an unconfirmed fact sheet in machine-readable
 * form is worse than no fact sheet, because it is trivially quotable.
 */

export const dynamic = "force-static";

export function GET(): Response {
  if (!INDEXABLE) {
    return new Response("Not found", { status: 404 });
  }

  const home = absoluteUrl(`/${defaultLocale}`);

  const body = [
    `# ${site.name}`,
    "",
    `> ${site.tagline}. Montaj de gresie, faianță și renovări complete de baie în Republica Moldova.`,
    "",
    "## Servicii",
    ...services.map((s) => `- [${s.title}](${home}#servicii): ${s.summary}`),
    "",
    "## Pagini pe subiecte",
    ...landingPages.map(
      (page) => `- [${page.h1}](${absoluteUrl(`/${defaultLocale}/servicii/${page.slug}`)}): ${page.metaDescription}`,
    ),
    "",
    "## Proiecte",
    `- [Lucrări executate](${home}#proiecte): fotografii reale de la fața locului, pe etape — pregătirea suportului, hidroizolație, montaj și rost finisat.`,
    "",
    "## Contact",
    `- Telefon: ${phone.display}`,
    `- Formular: ${home}#contact`,
    "",
    // Deliberately absent: prices, warranty terms, covered localities and any
    // client detail. Nothing here may state a fact the site does not display.
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
