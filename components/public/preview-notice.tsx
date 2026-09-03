import { CONTENT_COMPLETE } from "@/config/indexability.mjs";

/**
 * Honest notice that some business details are still being finalised.
 *
 * Gated on CONTENT_COMPLETE, NOT on indexability. Those are different questions:
 * during the soft-launch the site is intentionally unindexed while the owner
 * shares the link by hand to win his first customers, and telling those exact
 * visitors that the content is provisional is the worst possible moment to say
 * it. The banner goes when the content is final; indexing waits for the legal work.
 */
export function PreviewNotice() {
  if (CONTENT_COMPLETE) return null;
  return (
    <div className="bg-ink text-canvas/90">
      <div className="mx-auto flex max-w-[78rem] items-center gap-3 px-5 py-2 text-[0.72rem] sm:px-8 lg:px-10">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-bronze-light" aria-hidden="true" />
        <p className="leading-tight">
          <span className="font-semibold">Site în lucru</span> — fotografiile sunt lucrări
          reale executate de noi. Prețurile și câteva detalii se completează în zilele următoare.
        </p>
      </div>
    </div>
  );
}
