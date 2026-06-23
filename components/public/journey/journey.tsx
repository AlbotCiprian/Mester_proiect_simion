import { JourneyStatic } from "@/components/public/journey/journey-static";
import ScrollJourney from "@/components/public/journey/scroll-journey";

// Progressive enhancement wrapper (spec 29):
// - JourneyStatic is always in the HTML (SEO / no-JS / reduced-motion / screen reader).
// - ScrollJourney mounts on the client and, only on capable devices, reveals the
//   cinematic canvas/loop experience and hides the static block via the
//   [data-journey="enhanced"] CSS toggle (see app/globals.css).
export function Journey() {
  return (
    <div id="journey-baie">
      <JourneyStatic />
      <ScrollJourney />
    </div>
  );
}
