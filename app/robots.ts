import type { MetadataRoute } from "next";
import { INDEXABLE, absoluteUrl } from "@/lib/seo";

/**
 * robots.txt is ADVISORY. It is a crawl-budget instrument, not access control
 * and not de-indexing: a URL you `Disallow` is a URL whose `noindex` Google can
 * never read, so it can stay listed as a bare link. Real controls live in the
 * X-Robots-Tag header (next.config.mjs), Vercel Deployment Protection on Preview,
 * and — for crawlers that ignore this file — the platform WAF.
 */

/** Bots that consume budget and send no customers. All of these document that
 *  they obey robots.txt, so these lines actually work. */
const SEO_TOOL_BOTS = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "DataForSeoBot",
  "PetalBot",
  "MegaIndex",
  "SeznamBot",
  // Bytespider has been repeatedly documented IGNORING robots.txt. The line is
  // kept for the well-behaved case, but only a WAF rule actually stops it.
  "Bytespider",
  // Bulk dataset harvesting with no referral path back to the business.
  "CCBot",
];

/**
 * Search and social crawlers that matter in this market. YandexBot is not
 * optional: Russian-speaking Chisinau uses Yandex meaningfully. The messenger
 * fetchers are here because leads arrive through shared links — blocking them
 * kills every preview card, which is a direct conversion loss.
 */
const ALLOWED_AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "YandexBot",
  "Applebot",
  "DuckDuckBot",
  "facebookexternalhit",
  "Twitterbot",
  "TelegramBot",
  "WhatsApp",
  "Viber",
];

/**
 * Assistant crawlers are ALLOWED. For a local trade business, being quotable in
 * an answer to "cine montează gresie în Chișinău" is upside with a referral path.
 * Note: Google-Extended controls AI training only — it has no effect on Search
 * indexing or ranking in either direction.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    // Preview, local, and production until Gate A closes. No Sitemap line:
    // advertising a sitemap for a site that must not be indexed is incoherent.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Never /_next/static or /_next/image: Google must fetch CSS, JS and
        // images to render the page, and blocking them breaks mobile-friendly
        // evaluation and Core Web Vitals attribution.
        disallow: ["/api/", "/*?*"],
      },
      ...ALLOWED_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
      // Crawl-delay only under Bingbot: Googlebot has never supported it and
      // Yandex deprecated it in favour of its Webmaster crawl-rate setting.
      { userAgent: "Bingbot", allow: "/", crawlDelay: 10 },
      ...SEO_TOOL_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: undefined,
  };
}
