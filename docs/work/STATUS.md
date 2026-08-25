# Project Status

## Current phase

Public site P0 complete and deployable. Still `noindex` — blocked on owner data, not on code.

## Active milestone

Workstream 5 — Public website P0. Lead capture shipped; content pages and RU deferred.

## Completed

- Architecture and Product Discovery
- Modular specification package
- Claude Cowork and Claude Code operating model
- Milestone 0 — repository scaffolding and configuration hardening
- Frontend design prototype — "Precision Atelier" homepage (Workstream 1–2)
- **Real media integration (2026-08-18)** — every stock/AI/placeholder asset removed
- **Lead capture, security and SEO surface (2026-08-19)** — see `DECISIONS.md` D-009…D-012

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

## Security and SEO surface

| Item | State |
| --- | --- |
| Headers | `next.config.mjs` — CSP (Report-Only), nosniff, frame-deny, COOP, Permissions-Policy, HSTS in production, `X-Robots-Tag: noindex` everywhere else. `x-powered-by` off |
| Image cost | `qualities: [75]` + pinned `deviceSizes`/`imageSizes` cuts the addressable transformation surface from ~96,000 to 420 |
| Indexability | one predicate, `INDEXABLE` in `lib/seo.ts` |
| robots.txt | `app/robots.ts` — `Disallow: /` until Gate A; then allow-list incl. YandexBot and messenger fetchers, deny SEO-tool crawlers, allow AI assistants |
| sitemap.xml | `app/sitemap.ts` — published locales only, real `lastModified`, empty until Gate A |
| llms.txt | `app/llms.txt/route.ts` — 404s until Gate A |
| Tests | `npm test` — 30 assertions over phone normalisation, schema, error mapping, rate limiter, IP handling |

## Blockers

Everything below is owner input, not engineering work. Full list, phrased for a
non-technical owner: **[docs/work/OWNER-DATA-REQUEST.md](OWNER-DATA-REQUEST.md)**.

- **A1/A4** brand name and legal entity — indexing under a name that later changes wastes the first months
- **B1/B2/B4** exact services, whether teracotă stays, localities served
- **E1–E4** phone confirmed; which of WhatsApp/Viber/Telegram exist; **the destination inbox**
- **G1** written right to publish the photographs (sending files is not consent)
- **G3** manual privacy pass over every still (faces, documents, plates, identifiable property)
- **T1–T5** `RESEND_API_KEY`, verified sending domain, final subdomain

Until then `GATE_A_COMPLETE` stays `false` in `lib/content.ts` and the site is not indexable.

## Next approved task

`TO_BE_APPROVED` — recommended order once data lands: wire Resend env → flip Gate A →
service pages (`/ro/servicii/*`) → project case studies → RU locale.

## Verification log

| Date | Milestone | Result | Evidence | Approved by |
| --- | --- | --- | --- | --- |
| 2026-06-23 | Milestone 0 — config & scaffolding | Done | local commit `chore: milestone 0` | owner |
| 2026-06-24 | Frontend prototype (WS 1–2) | Build green (6/6 static), dev verified | `next build` ok; `/ro` 200, `/`→`/ro` 307, `/ru` notice | owner |
| 2026-08-18 | Real media integration | Build green; typecheck + eslint clean; desktop + mobile visual pass | `next build`; headless Chrome capture at 1440×900 and 390×844 | owner |
| 2026-08-19 | Lead capture + security + SEO surface | Build green (9 routes); typecheck, eslint and 30/30 tests clean; form verified with and without JavaScript; headers and robots/sitemap/llms verified over HTTP | `npm run verify`; `curl -I /ro`; Playwright form + no-JS runs | owner |
