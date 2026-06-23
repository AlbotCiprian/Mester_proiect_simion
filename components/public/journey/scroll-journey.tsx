"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { baie } from "@/lib/journey";
import { track } from "@/lib/analytics";

type Mode = "idle" | "scrub" | "loop";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function ScrollJourney() {
  const [mode, setMode] = useState<Mode>("idle");

  const rootId = "journey-baie";
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const animRef = useRef({ target: 0, current: 0, drawn: -1, raf: 0 });

  // 1) Tier detection — decide whether/how to enhance (spec 29 §5).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (mq.matches || conn?.saveData === true) return; // stay on static fallback

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const lowMem = typeof mem === "number" && mem <= 4;
    const chosen: Mode = coarse || lowMem ? "loop" : "scrub";

    setMode(chosen);
    document.getElementById(rootId)?.setAttribute("data-journey", "enhanced");
    track("journey_start", { device_tier: chosen, chapter_id: baie.id });

    return () => document.getElementById(rootId)?.removeAttribute("data-journey");
  }, []);

  // 2) Scroll → progress → frame/panel. Native scroll, passive listeners, single rAF.
  useEffect(() => {
    if (mode === "idle") return;
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const { count, dirDesktop, dirMobile, ext } = baie.frames;

    // Preload the right responsive frame set for scrub mode.
    if (mode === "scrub") {
      const dir = window.innerWidth >= 1024 ? dirDesktop : dirMobile;
      const imgs: HTMLImageElement[] = [];
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = `${dir}/frame-${String(i + 1).padStart(4, "0")}.${ext}`;
        imgs.push(img);
      }
      framesRef.current = imgs;
      const first = imgs[0];
      if (first) first.decode().then(() => drawFrame(0)).catch(() => {});
    }

    let reachedEnd = false;
    const onScroll = () => {
      const rect = trackEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      animRef.current.target = p;
      if (!reachedEnd && p > 0.97) {
        reachedEnd = true;
        track("journey_complete", { chapter_id: baie.id, reached_end: true });
      }
    };

    const loop = () => {
      const a = animRef.current;
      a.current += (a.target - a.current) * 0.16;
      if (Math.abs(a.target - a.current) < 0.0005) a.current = a.target;

      if (mode === "scrub") {
        const idx = Math.round(a.current * (count - 1));
        if (idx !== a.drawn) {
          drawFrame(idx);
          a.drawn = idx;
        }
      }
      updatePanel(a.current);
      a.raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      animRef.current.drawn = -1; // force redraw at new size
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    animRef.current.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current.raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 3) Loop video: play only while in view (battery/perf).
  useEffect(() => {
    if (mode !== "loop") return;
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [mode]);

  function drawFrame(idx: number) {
    const cv = canvasRef.current;
    const img = framesRef.current[idx];
    if (!cv || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
      dy = 0;
    } else {
      dw = w;
      dh = w / ir;
      dx = 0;
      dy = (h - dh) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function updatePanel(p: number) {
    const stages = baie.stages;
    const stageIdx = clamp(Math.floor(p * stages.length), 0, stages.length - 1);
    if (stageRef.current) {
      const label = stages[stageIdx] ?? "";
      if (stageRef.current.textContent !== label) stageRef.current.textContent = label;
    }
    if (meterRef.current) meterRef.current.style.width = `${Math.round(p * 100)}%`;
  }

  // Idle (reduced-motion / save-data / pre-mount): render nothing; static stays.
  if (mode === "idle") return <div className="journey-canvas" aria-hidden="true" />;

  const { price } = baie;

  return (
    <div className="journey-canvas" aria-hidden="true">
      <div ref={trackRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
          {/* Media layer */}
          {mode === "scrub" ? (
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={baie.frames.loop}
              poster={baie.frames.poster}
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}

          {/* Scrims for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/40 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/80" />

          {/* Skip link (accessibility / impatience) */}
          <Link
            href="#servicii"
            className="absolute right-4 top-4 z-10 rounded-xs border border-canvas/35 bg-ink/40 px-3 py-1.5 text-xs font-semibold text-canvas backdrop-blur transition-colors hover:border-canvas"
          >
            Sări peste parcurs
          </Link>

          {/* Contextual panel: bottom sheet on mobile, side card on desktop */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:inset-y-0 lg:right-0 lg:left-auto lg:flex lg:w-[30rem] lg:flex-col lg:justify-center">
            <div className="rounded-sm border border-canvas/15 bg-ink/55 p-5 backdrop-blur-md sm:p-7">
              <p className="kicker !text-bronze-light">{baie.kicker}</p>
              <h2 className="mt-3 font-display text-2xl text-canvas sm:text-3xl">{baie.title}</h2>

              {/* Live stage + cost meter, driven by scroll */}
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-canvas/60">
                Etapă: <span ref={stageRef} className="text-bronze-light">{baie.stages[0]}</span>
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-canvas/15">
                <div ref={meterRef} className="h-full w-0 bg-bronze-light transition-[width] duration-100" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-bronze-light">Preț orientativ</p>
              <p className="mt-1 text-xl font-semibold text-canvas">
                {price.from === null ? "La cerere" : `de la ${price.from} ${price.unit}`}{" "}
                <span className="text-xs font-normal text-canvas/60">(CONFIRM_OWNER)</span>
              </p>
              <p className="mt-1 text-xs text-canvas/65">Include: {price.includes.join(", ")}.</p>

              <Link
                href={baie.cta.href}
                onClick={() => track("cta_click", { placement: "journey_baie", action: "estimate", page_type: "home" })}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xs bg-bronze px-6 py-3 text-sm font-semibold text-canvas-raised transition-colors hover:bg-bronze-deep"
              >
                {baie.cta.label}
              </Link>
              <p className="mt-3 text-[0.68rem] text-canvas/45">{baie.attribution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
