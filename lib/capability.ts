// Shared client-side capability detection (spec 29 §9).
// Used by the cinematic hero AND the scroll-journey so the tier logic lives in one place.
// All non-standard APIs are feature-detected via optional chaining.

export interface Capability {
  reducedMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  lowMemory: boolean;
}

export function detectCapability(): Capability {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return { reducedMotion: false, saveData: false, coarsePointer: false, lowMemory: false };
  }
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: conn?.saveData === true,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    lowMemory: typeof mem === "number" && mem <= 4,
  };
}

// Scroll-journey: scrub (desktop), loop (touch/low-mem), or static (reduced/save-data).
export type JourneyMode = "scrub" | "loop" | "static";
export function journeyMode(c: Capability): JourneyMode {
  if (c.reducedMotion || c.saveData) return "static";
  if (c.coarsePointer || c.lowMemory) return "loop";
  return "scrub";
}

// A tier the device could run is still unavailable when the chapter has no media
// for it. Downgrade only — never promote a device into a heavier tier than the
// capability check allowed. See lib/journey.ts (JourneyMedia.scrub / .loop).
export function resolveJourneyMode(
  chosen: JourneyMode,
  media: { scrub: unknown | null; loop: unknown | null },
): JourneyMode {
  if (chosen === "scrub") {
    if (media.scrub) return "scrub";
    return media.loop ? "loop" : "static";
  }
  if (chosen === "loop") return media.loop ? "loop" : "static";
  return "static";
}

// Hero: autoplay the muted video, or keep the static poster.
export type HeroMode = "video" | "static";
export function heroMode(c: Capability): HeroMode {
  return c.reducedMotion || c.saveData ? "static" : "video";
}
