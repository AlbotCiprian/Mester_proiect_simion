import Link from "next/link";
import { channels } from "@/lib/content";

// Mobile-first conversion bar (spec 06 + 09): max three one-hand actions.
// Hidden on desktop where the header CTA is always visible.
export function StickyContactBar() {
  const phone = channels.find((c) => c.type === "phone");
  const messaging = channels.find((c) => c.type === "telegram") ?? channels.find((c) => c.type === "viber");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas-raised/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-[78rem] grid-cols-3 divide-x divide-line">
        <Link
          href={phone?.href ?? "#contact"}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-ink"
        >
          <BarIcon path="M2.5 5.5C2.5 4 3.7 3 5 3.2l1.5.2c.5.1.9.4 1 .9l.5 2c.1.5 0 1-.4 1.3l-1 .8c.8 1.6 2 2.8 3.6 3.6l.8-1c.3-.4.8-.5 1.3-.4l2 .5c.5.1.8.5.9 1l.2 1.5c.2 1.3-.8 2.5-2.3 2.5C8.4 17.6 2.9 12.1 2.5 5.5Z" />
          <span className="text-[0.68rem] font-semibold">Sună</span>
        </Link>
        <Link
          href={messaging?.href ?? "#contact"}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-ink"
        >
          <BarIcon path="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v6A2.5 2.5 0 0 1 14.5 14H8l-4 3v-3H5.5A2.5 2.5 0 0 1 3 11.5Z" />
          <span className="text-[0.68rem] font-semibold">Mesaj</span>
        </Link>
        <Link
          href="#contact"
          className="flex flex-col items-center justify-center gap-0.5 bg-bronze py-2.5 text-canvas-raised"
        >
          <BarIcon path="M10 2.5 12.4 7l5 .7-3.6 3.5.9 5L10 13.8 5.3 16.2l.9-5L2.6 7.7l5-.7Z" />
          <span className="text-[0.68rem] font-semibold">Cere ofertă</span>
        </Link>
      </div>
    </div>
  );
}

function BarIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
