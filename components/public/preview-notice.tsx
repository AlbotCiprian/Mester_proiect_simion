// Honest prototype banner. The site is a design preview only:
// content and imagery are provisional placeholders (CONFIRM_OWNER) and the
// build is noindex until Gate A is complete (docs/specs/26-OWNER-DISCOVERY-CHECKLIST.md).
export function PreviewNotice() {
  return (
    <div className="bg-ink text-canvas/90">
      <div className="mx-auto flex max-w-[78rem] items-center gap-3 px-5 py-2 text-[0.72rem] sm:px-8 lg:px-10">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-bronze-light" aria-hidden="true" />
        <p className="leading-tight">
          <span className="font-semibold">Previzualizare design</span>{" "}
          — conținut și imagini provizorii (CONFIRM_OWNER), nimic nu este aprobat pentru publicare.
        </p>
      </div>
    </div>
  );
}
