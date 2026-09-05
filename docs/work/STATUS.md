# Project Status

## Current phase

**Public site feature-complete.** Brand confirmed (SemiDom), legal entity named,
Gate A OPEN, fifteen topic pages shipped, conversion pass done.

The site is still served `noindex` — deliberately. `indexability()` requires
`VERCEL_ENV=production` AND `NEXT_PUBLIC_SITE_URL` matching
`CONFIRMED_PRODUCTION_HOST`; neither is set on Vercel yet. It flips on the first
production deploy after they are, with no code change.

**The one blocking action, measured 2026-09-05:** `semidom.md` is NOT in the
Vercel project's domain list (`get_project` returns only the three
`*.vercel.app` hosts), so `ns1.vercel-dns.com` answers *Query refused* — there
is no DNS zone. The nameservers at TopHost are already delegated to Vercel, so
the moment the registry publishes the delegation the domain resolves to nothing
until it is added. See `PLAN-SPRINTURI.md` Sprint 1.

## Active milestone

Workstream 6 — launch. Content and code are done; what remains is DNS, mailbox,
Resend and the environment variables. Full staged plan: **[PLAN-SPRINTURI.md](PLAN-SPRINTURI.md)**.

## Completed

- Architecture and Product Discovery
- Modular specification package
- Claude Cowork and Claude Code operating model
- Milestone 0 — repository scaffolding and configuration hardening
- Frontend design prototype — "Precision Atelier" homepage (Workstream 1–2)
- **Real media integration (2026-08-18)** — every stock/AI/placeholder asset removed
- **Lead capture, security and SEO surface (2026-08-19)** — see `DECISIONS.md` D-009…D-017
- **SemiDom brand + post-audit fixes (2026-09-03)** — see `DECISIONS.md` D-018…D-021
- **Launch build (2026-09-05)** — Gate A opened, privacy notice completed with a
  named controller, fifteen topic pages, robots/llms policy, conversion pass;
  see `DECISIONS.md` D-022…D-028

## Media state

| Item | State |
| --- | --- |
| Owner originals | `docs/poze/poze reale/` (28 photos + `1.MP4`), plus `poza1`/`poza2` for exterior |
| Published assets | `public/images/proiecte/**` (30 files, 6 project slugs), `public/media/hero/`, `public/media/tur/` |
| Source of truth | `scripts/media-catalog.mjs` — mapping, RO alt text, focal points, stage |
| Rebuild command | `npm run media` (wipes and republishes; strips metadata, exports the clip) |
| EXIF/GPS | verified absent on all stills (`node scripts/_meta-probe.mjs <dir>`) |
| Video hygiene | audio track, `creation_time` and Core Media handler stripped on export |
| Removed | Unsplash hero, Pexels journey frames (122 files, ~12 MB), AI hero video, 8 of the 10 old photos |

Known limits of the supplied material: max 1280 px (messenger-compressed), one
landscape still, the only clip is 480×848. Consequences accepted in D-006: the
hero ships as a still and the 60-frame scroll-scrub tier stays retired. Both are
re-enabled by data alone once the originals or a proper shoot arrive (checklist G7).

## Lead capture

| Item | State |
| --- | --- |
| Endpoint | `app/actions/lead.ts` — one Server Action, no `/api/lead` beside it |
| Contract | `lib/lead.ts` — zod, E.164 phone transform, Romanian messages |
| Delivery | `lib/notify.ts` — Resend, 8s timeout, no `replyTo`/`cc`/`bcc` |
| Anti-abuse | honeypot (hard block), timing signal (observed only, D-012), per-IP attempt + submit budgets, per-instance ceiling, 2-minute idempotency |
| Rate limiting | in-memory, per instance — a documented **temporary floor**, not the ADR-010 control. Must not be reported as "rate limiting implemented" at the release gate |
| Privacy | IPs are HMAC-hashed before use; no name, phone, e-mail, locality or message ever reaches a log line |
| Without a key | form renders, validates, then reports `undelivered` and gives the phone number — never a fake confirmation |
| Verified | valid submit, invalid submit, and both **with JavaScript disabled** |

## Content pages

| Item | State |
| --- | --- |
| Topic pages | 15, at `/ro/servicii/<slug>`, plus the hub `/ro/servicii` |
| Content source | `lib/landing.ts` — one entry per page: intro, scope, execution order, pitfalls, gallery keys, FAQs, related slugs |
| Photograph registry | `lib/landing-photos.ts` — all 30 published stills, keyed, with the alt text from `scripts/media-catalog.mjs` |
| Rendering | `components/public/landing-sections.tsx` — Server Component; the FAQ uses native `<details>` |
| Structured data | `Service`, `FAQPage`, `BreadcrumbList`, `WebPage` per page; `ItemList` on the hub |
| Route safety | `dynamicParams = false`; sitemap and route both build paths from `landingSlugs` |
| Guarded by tests | duplicate titles/descriptions, thin intros, invented prices, warranty or response-time promises, unconfirmed localities, self-links, orphans in the related graph, missing photo files, missing `#contact` target |
| Deliberately absent | any price or price range, any warranty period, any locality beyond "Chișinău și împrejurimi", any review or rating |

## Conversion surface

| Where | Actions |
| --- | --- |
| Header, desktop | phone number spelled out + "Cere o estimare" (relative `#contact`) |
| Header, mobile | phone icon button + CTA inside the menu |
| Hero | "Cere o estimare" + the phone, side by side, above the fold |
| Mid-page | `ContactBand` on the homepage and on every topic page, after the proof |
| Sticky bar, mobile | the number VISIBLE (not just "Sună") + "Cere ofertă", 64px targets, safe-area inset |
| Every route | its own `id="contact"` form section, so no CTA ever navigates away |
| Footer | large phone link + all 15 topic pages, linked sitewide |

## Security and SEO surface

| Item | State |
| --- | --- |
| Headers | `next.config.mjs` — CSP (Report-Only), nosniff, frame-deny, COOP, Permissions-Policy, HSTS in production, `X-Robots-Tag: noindex` everywhere else. `x-powered-by` off |
| Image cost | `qualities: [65]` + pinned `deviceSizes`/`imageSizes` cuts the addressable transformation surface from ~96,000 to 420 |
| Indexability | one predicate in `config/indexability.mjs`, shared by `lib/seo.ts` and `next.config.mjs` |
| robots.txt | `app/robots.ts` — `Disallow: /` while not indexable; then one permissive `*` group, `Crawl-delay: 10` for Bingbot, and `Disallow: /` for 20 named SEO-tool and dataset crawlers. Search engines, messenger link fetchers and AI assistants are covered by the `*` group by design: under RFC 9309 a named group REPLACES it, so giving them their own would exempt them from every future site-wide rule |
| sitemap.xml | `app/sitemap.ts` — 18 URLs (home, hub, privacy, 15 topic pages), published locales only, `lastModified` deliberately omitted, empty while not indexable |
| llms.txt | `app/llms.txt/route.ts` — 404s until Gate A |
| Tests | `npm test` — 123 assertions over phone normalisation, schema, error mapping, rate limiter, IP handling, indexability truth table, route/sitemap coupling, and the fifteen topic pages |

## Blockers

**Nothing blocks the launch that is engineering work.** The staged plan is
**[PLAN-SPRINTURI.md](PLAN-SPRINTURI.md)**; the owner-facing questions are
**[OWNER-DATA-REQUEST.md](OWNER-DATA-REQUEST.md)**.

Blocking the launch (owner actions, ~2 hours total):

1. Add `semidom.md` to the Vercel project — **the zone does not exist**, measured.
2. Choose and provision a mailbox host for `contact@semidom.md`; create MX, SPF,
   DKIM and DMARC in Vercel DNS.
3. Verify the domain in Resend; create a **sending-only** key.
   **Revoke `re_EYZf7EP3_…`** — it was visible in a shared screenshot.
4. Set the six environment variables, Production scope, then redeploy.

Not blocking the launch — conversion and compliance, Sprint 6:

- **E2/E3** which messengers exist on the number (unlocks the third mobile action)
- **B2** one terracotta photograph (the service is confirmed; the photo is not)
- **G1** written right to publish the project photographs
- **G3** his own privacy pass over the 30 stills
- **B7/D1** figures he can evidence — the trust strip renders nothing while empty
- **G4** real, sourced, consented reviews
- RU translation, verified by a native speaker

## Next approved task

Launch, in the order of `PLAN-SPRINTURI.md`: domain on Vercel → mailbox → Resend
→ environment variables → verification → Search Console. After launch, in value
order: Google Business Profile, RU translation, per-project case studies.

## Verification log

| Date | Milestone | Result | Evidence | Approved by |
| --- | --- | --- | --- | --- |
| 2026-06-23 | Milestone 0 — config & scaffolding | Done | local commit `chore: milestone 0` | owner |
| 2026-06-24 | Frontend prototype (WS 1–2) | Build green (6/6 static), dev verified | `next build` ok; `/ro` 200, `/`→`/ro` 307, `/ru` notice | owner |
| 2026-08-18 | Real media integration | Build green; typecheck + eslint clean; desktop + mobile visual pass | `next build`; headless Chrome capture at 1440×900 and 390×844 | owner |
| 2026-08-19 | Lead capture + security + SEO surface | Build green (8 routes); typecheck, eslint and 30/30 tests clean; form verified with and without JavaScript; headers and robots/sitemap/llms verified over HTTP | `npm run verify`; `curl -I /ro`; Playwright form + no-JS runs | owner |
| 2026-09-05 | Launch build — Gate A, 15 topic pages, privacy notice, conversion pass | Build green (44 static routes); typecheck, eslint and 123/123 tests clean; production-env build verified separately (`indexable=true`) | `npm run verify`; `next start` probes: hub 200, topic page 200, unknown slug 404, `/ru/servicii/*` 404, sitemap 18 URLs, zero `CONFIRM_OWNER` in rendered HTML, IDNP collapsed by default, canonical + JSON-LD present | owner |
| 2026-09-03 | SemiDom brand + nine-role audit fixes | Build green (8 routes); typecheck, eslint and 62/62 tests clean; form re-verified with and without JavaScript including the retry-after-failure path; brand and placeholder sweep clean on rendered HTML | `npm run verify`; Playwright form/retry/no-JS runs; `curl` route and header probes | owner |
