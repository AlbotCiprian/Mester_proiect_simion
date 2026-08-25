import { INDEXABLE } from "@/lib/seo";

/**
 * Honest prototype banner: the build is noindex and the business facts are still
 * placeholders (checklist A/B/E/G).
 *
 * Gated on the SAME predicate that governs indexing, so it disappears exactly
 * when the site becomes real — it can never survive into a public launch, and it
 * can never vanish while placeholders are still on screen.
 */
export function PreviewNotice() {
  if (INDEXABLE) return null;
  return (
    <div className="bg-ink text-canvas/90">
      <div className="mx-auto flex max-w-[78rem] items-center gap-3 px-5 py-2 text-[0.72rem] sm:px-8 lg:px-10">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-bronze-light" aria-hidden="true" />
        <p className="leading-tight">
          <span className="font-semibold">Previzualizare design</span>{" "}
          — fotografiile sunt lucrări reale, dar datele de business (denumire, preț, garanție)
          nu sunt încă finalizate. Pagina nu este indexată.
        </p>
      </div>
    </div>
  );
}
