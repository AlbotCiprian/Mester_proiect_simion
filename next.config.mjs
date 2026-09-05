import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexabilityFromEnv } from "./config/indexability.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IS_PROD = process.env.VERCEL_ENV === "production";

/**
 * The SAME predicate lib/seo.ts uses for the meta tag. Previously this file had
 * its own condition (VERCEL_ENV !== "production"), which left production-before-
 * Gate-A protected by `Disallow: /` alone — and a disallowed URL is one whose
 * noindex Google can never read.
 *
 * X-Robots-Tag is emitted whenever the site is not indexable, so the instruction
 * travels on every response and a stray inbound link cannot bypass it.
 */
const {
  indexable: IS_INDEXABLE,
  reason: INDEXABILITY_REASON,
  code: INDEXABILITY_CODE,
} = indexabilityFromEnv();
console.log(`[build] indexable=${IS_INDEXABLE} code=${INDEXABILITY_CODE} (${INDEXABILITY_REASON})`);

/*
 * 'unsafe-inline' in script-src is a KNOWN, RECORDED GAP, not an oversight.
 * Next's App Router injects a per-build inline bootstrap and the RSC flight
 * payload, so hashes are impractical and a nonce would force per-request
 * rendering — which would cost /ro its static prerender.
 *
 * It is acceptable ONLY because this site renders zero user-generated content:
 * no dangerouslySetInnerHTML, no third-party scripts, no remote origins, and the
 * lead's text goes into an email, never into the DOM.
 *
 * REVISIT WITH AN ADR THE DAY GA4 LANDS — a third-party script origin is what
 * turns this from academic into real.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'", // Next inlines critical CSS; React injects <style>
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'", // next/font self-hosts — no Google origin needed
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  // NOTE: `upgrade-insecure-requests` is deliberately absent. Browsers ignore it
  // in a report-only policy and log a console warning on every page load. Add it
  // back in the same edit that promotes the header to enforcing.
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Report-Only first. Promote to "Content-Security-Policy" only after a clean
  // run with zero console violations on /ro at 390px and 1440px — the header,
  // the hamburger and the scroll-solid header are all hydration-dependent and
  // are how a broken script-src announces itself.
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const environmentHeaders = [
  // Ramp: 300 for 24-48h to prove nothing on semidom.md needs plain HTTP, then
  // 31536000.
  //
  // `preload` is deliberately absent, and the reason CHANGED with D-022: the
  // old note said the directive was inert because we sat on a subdomain.
  // semidom.md is an apex, so it would now be honoured — which is exactly why
  // it stays off. Submitting to the preload list is effectively irreversible
  // (removal takes months and ships to users only on browser updates), it
  // covers every future subdomain including a mail host, and it requires
  // max-age=31536000. Revisit only after the year-long max-age has run clean.
  ...(IS_PROD ? [{ key: "Strict-Transport-Security", value: "max-age=300" }] : []),
  ...(IS_INDEXABLE ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

/**
 * public/** filenames are NOT content-hashed — `npm run media` republishes to
 * identical paths — so `immutable` would pin a stale asset for a year. Bounded
 * staleness instead, until the media catalog hashes filenames.
 */
const assetCache = [
  { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A stray package-lock.json above this directory makes Next infer the wrong
  // workspace root and mis-trace the Server Action bundle.
  outputFileTracingRoot: __dirname,

  images: {
    formats: ["image/avif", "image/webp"],
    // Sources top out at 1280px and 576px is the most common width, so the
    // default arrays request 8-11 candidates per image, most of which produce
    // byte-identical output while still billing as separate transformations.
    deviceSizes: [640, 828, 1080, 1280],
    imageSizes: [256, 384, 576],
    // THE COST FIX. Left unset, `q` accepts any value 1-100, so the addressable
    // surface is 30 sources x 16 widths x 100 qualities x 2 formats = 96,000
    // billable transformations, every one constructible from a public URL.
    // Pinned: 30 x 7 x 1 x 2 = 420.
    //
    // 65, not 75: the same `q` applies to AVIF and WebP, and AVIF q75 sits well
    // above WebP q75 perceptually. Measured on the real gallery at the widths a
    // 390px DPR-2 phone requests: q75 = 655 KB, q65 = 402 KB, q55 = 251 KB.
    //
    // 65 rather than 55 because 55 visibly smeared the marble veining on
    // baie-cada-placata/01 and /02 (47% detail retention, PSNR 33.4 dB — below
    // the ~36 dB usually treated as artefact-free), and at DPR 2 the 828px
    // decode displays near 1:1. Every gallery image is lazy, so the extra
    // ~151 KB never touches LCP, and for a tile setter the photographs are the
    // product. The anti-abuse surface is unchanged: still one allowed value.
    qualities: [65],
    // 30 days, not a year: /_next/image cache keys embed unhashed source paths.
    minimumCacheTTL: 2592000,
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/media/**" }],
    // No remotePatterns, ever. An empty list is what keeps /_next/image from
    // being an open image proxy. dangerouslyAllowSVG stays false.
  },

  experimental: {
    serverActions: {
      // The 1MB default is absurd for a text form; the schema's maxima sum to <4KB.
      bodySizeLimit: "64kb",
      // Next already compares Origin against Host, so this is defence in depth.
      // Both the apex and www are listed because either can serve the form
      // depending on which one the visitor typed, and a redirect that happens
      // AFTER a POST would otherwise drop the submission.
      //
      // Same-origin is always allowed regardless, so preview deployments and the
      // .vercel.app aliases keep working without being listed here.
      allowedOrigins: ["semidom.md", "www.semidom.md"],
    },
  },

  async headers() {
    return [
      { source: "/:path*", headers: [...securityHeaders, ...environmentHeaders] },
      { source: "/images/:path*", headers: assetCache },
      { source: "/media/:path*", headers: assetCache },
    ];
  },
};

export default nextConfig;
