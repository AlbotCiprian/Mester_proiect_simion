import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Production = the real deployment. Everything else is noindex at the HEADER
 * level, which a stray inbound link cannot bypass — unlike robots.txt.
 */
const IS_PROD = process.env.VERCEL_ENV === "production";

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

const environmentHeaders = IS_PROD
  ? [
      // Ramp: 300 for 24-48h to prove nothing on the subdomain needs plain HTTP,
      // then 31536000. NEVER add `preload` — the preload list only accepts apex
      // domains, so from a subdomain the directive is inert, and acting on it
      // would force HTTPS on every sibling subdomain, which is not our call.
      { key: "Strict-Transport-Security", value: "max-age=300" },
    ]
  : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

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
    qualities: [75],
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
      // allowedOrigins is deliberately OMITTED until the final host is decided.
      // Next still compares Origin against Host. Pin it the moment the subdomain
      // is fixed: on a shared parent domain it is what stops a compromised
      // SIBLING subdomain of xelacktech.com being used as a launch point.
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
