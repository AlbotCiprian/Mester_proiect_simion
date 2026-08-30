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

/*
 * Crawlers we explicitly WANT, recorded here rather than emitted as directives.
 *
 * Under RFC 9309 a named user-agent group REPLACES the "*" group entirely, so
 * giving each of these its own `Allow: /` would silently exempt exactly the
 * crawlers that matter most from any future site-wide rule. They are already
 * allowed by the permissive "*" group.
 *
 *   Search:     Googlebot, Googlebot-Image, Bingbot, YandexBot, Applebot,
 *               DuckDuckBot
 *               - YandexBot is not optional here: Russian-speaking Chisinau
 *                 uses Yandex meaningfully.
 *   Messengers: facebookexternalhit, Twitterbot, TelegramBot, WhatsApp, Viber
 *               - leads arrive through shared links; blocking these kills every
 *                 preview card, which is a direct conversion loss.
 *   Assistants: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot,
 *               Google-Extended, Applebot-Extended, meta-externalagent, Amazonbot
 *               - being quotable in an answer to "cine montează gresie în
 *                 Chișinău" is upside with a referral path.
 *               - Google-Extended controls AI training only; it has no effect on
 *                 Search indexing or ranking in either direction.
 */

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    // Preview, local, and production until Gate A closes. No Sitemap line:
    // advertising a sitemap for a site that must not be indexed is incoherent.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      // One permissive group for everyone not named below.
      //
      // No `Disallow` entries at all: `/api/` does not exist, and `/*?*` would
      // block every ?gclid= / ?fbclid= landing the day ads or a Facebook share
      // start — an own goal. Never /_next/static or /_next/image either: Google
      // must fetch CSS, JS and images to render the page, and blocking them
      // breaks mobile-friendly evaluation and Core Web Vitals attribution.
      { userAgent: "*", allow: "/" },

      // Crawl-delay only under Bingbot. Googlebot has never supported it, and
      // Yandex deprecated it in favour of its Webmaster crawl-rate setting.
      // ALLOWED_AGENTS and AI_AGENTS are documented below but NOT emitted as
      // their own groups: under RFC 9309 a named group replaces the "*" group
      // entirely, so an `Allow: /` group per agent would silently discard any
      // future site-wide rule for exactly the crawlers that matter most.
      { userAgent: "Bingbot", allow: "/", crawlDelay: 10 },

      ...SEO_TOOL_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
