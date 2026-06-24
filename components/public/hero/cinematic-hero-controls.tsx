"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { HeroMediaDTO } from "@/lib/hero";
import { detectCapability, heroMode } from "@/lib/capability";
import { track } from "@/lib/analytics";

// Client island: mounts ONE <video> with a single, viewport-resolved src,
// gates autoplay by capability, and provides an accessible Pause/Play control.
// The decorative video sits behind the scrim/content; the poster (server-rendered)
// is the LCP and stays visible until the video paints.
export function CinematicHeroControls({
  media,
  copy,
  locale,
}: {
  media: HeroMediaDTO;
  copy: { pause: string; play: string };
  locale: Locale;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [src, setSrc] = useState<string | null>(null);
  const [objectPosition, setObjectPosition] = useState("50% 50%");
  const [autoplay, setAutoplay] = useState(false);
  const [playing, setPlaying] = useState(false);

  // 1) Resolve single source + tier on mount.
  useEffect(() => {
    const cap = detectCapability();
    const mode = heroMode(cap);
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setSrc(isMobile ? media.mobileMp4 : media.desktopMp4);
    setObjectPosition(isMobile ? media.mobileObjectPosition : media.desktopObjectPosition);
    track("hero_view", {
      locale,
      device_tier: mode === "static" ? "static" : isMobile ? "mobile" : "desktop",
      reduced_motion: cap.reducedMotion,
      save_data: cap.saveData,
      page_type: "home",
    });
    if (mode === "video") setAutoplay(true);
  }, [media, locale]);

  // 2) Attempt autoplay; keep poster on rejection. Pause when tab hidden.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src || !autoplay) return;
    let cancelled = false;

    v.play()
      .then(() => {
        if (cancelled) return;
        setPlaying(true);
        track("hero_video_play", { locale, page_type: "home" });
      })
      .catch(() => {
        if (cancelled) return;
        setPlaying(false);
        track("hero_video_autoplay_blocked", { locale, page_type: "home" });
      });

    const onVisibility = () => {
      if (document.hidden) {
        v.pause();
      } else if (!pausedByUser.current) {
        void v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src, autoplay, locale]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      pausedByUser.current = false;
      void v.play().then(() => {
        setPlaying(true);
        track("hero_video_resume", { locale, page_type: "home" });
      }).catch(() => {});
    } else {
      pausedByUser.current = true;
      v.pause();
      setPlaying(false);
      track("hero_video_pause", { locale, page_type: "home" });
    }
  }

  if (!src) return null;

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        style={{ objectPosition }}
        className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
      {autoplay ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? copy.pause : copy.play}
          className="absolute bottom-5 right-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-canvas/40 bg-ink/40 text-canvas backdrop-blur transition-colors hover:border-canvas hover:bg-ink/60"
        >
          {playing ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <rect x="5" y="4" width="3.4" height="12" rx="1" />
              <rect x="11.6" y="4" width="3.4" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M6 4.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 6 4.5Z" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
