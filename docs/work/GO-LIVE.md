# Go-live runbook — `<label>.xelacktech.com`

Target: Vercel project `mester-teracota-moldova`, custom domain on a subdomain of
`xelacktech.com`, DNS managed in cPanel.

> **The fact that governs every step below:** every route is build-time static.
> `INDEXABLE`, `robots.txt`, `sitemap.xml`, `llms.txt` and every `<meta robots>`
> are frozen into the build artifact. **Changing an environment variable in the
> Vercel dashboard does nothing until you redeploy.**

---

## Phase A — repo

1. `npm run verify` — typecheck, lint, tests, build. All four must pass.
2. Apply the brand name (see the table at the end of this file). Commit, push.
   Verify: `grep -rn "Atelier Teracota" app components lib` returns nothing.

## Phase B — Vercel, before any DNS change

3. **Environment variables, Production scope only.** Vercel defaults to all
   environments — narrow each one deliberately.

   | Variable | Scope | Value |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Production | `https://<label>.xelacktech.com` — no trailing slash |
   | `CONFIRMED_PRODUCTION_HOST` | Production | `<label>.xelacktech.com` — host only, lowercase |
   | `RESEND_API_KEY` | Production | Preview must have **no** key: a preview deploy must never send mail |
   | `LEAD_FROM_EMAIL` | Production | An address on a domain verified in Resend |
   | `LEAD_TO_EMAIL` | Production | A dedicated mailbox, not a personal inbox |
   | `LEAD_FORM_SECRET` | Production + Preview, different values | Otherwise the HMAC falls back to a public default |
   | `IP_HASH_SALT` | Production + Preview, different values | Otherwise IP hashing falls back to a public default |
   | `LEAD_CONSENT_VERSION` | Production | Otherwise every lead is stamped with the build-time default |

   The host comparison is normalised (scheme, trailing slash, case, credentials,
   trailing dot), so those cannot silently break it — but `www.` is deliberately
   **not** treated as the same host.

4. **Deployment Protection: ON for Preview, OFF for Production.** `app/robots.ts`
   assumes this; it is not verifiable from the repo.
   Verify: open a preview URL in a private window — it must prompt for auth.

5. **Redeploy production** and check the still-`.vercel.app` URL:
   - `/robots.txt` → `User-Agent: *` / `Disallow: /`
   - `/sitemap.xml` → empty `<urlset>`
   - `/llms.txt` → 404
   - `/ro` → `<meta name="robots" content="noindex, nofollow">` present
   - Submit the form once → the email arrives in `LEAD_TO_EMAIL` within 8s.
   - **Submit the identical form again → it must NOT claim success.**
   - Repeat once with JavaScript disabled.

## Phase C — DNS cutover in cPanel

6. **Lower the TTL first.** If a record for `<label>` already exists, set TTL to
   300 and wait out the old TTL *before* changing the target. Without this, a
   rollback is gated on the old TTL.

7. **Do not use cPanel's "Subdomains" tool.** It creates a document root *and* an
   A record pointing at the shared host, which conflicts with the CNAME and
   serves a cPanel default page. If it already exists, delete the A record for
   `<label>` in **Zone Editor**.

8. **Add the domain in Vercel first**, then in cPanel → Zone Editor → Add Record:
   - Type **CNAME**, Name `<label>`, Record: **exactly the target Vercel prints
     on the domain configuration screen** — read it from the dashboard, do not
     copy it from documentation.
   - TTL 300 during cutover.
   Verify: Vercel shows **Valid Configuration**.

9. **Check CAA on the parent.** `dig CAA xelacktech.com +short` — any CAA record
   must permit `letsencrypt.org`, or certificate issuance silently fails.

10. **Nothing may proxy the subdomain.** If Cloudflare or cPanel sits in front,
    set it to DNS-only. A proxy changes the header set and can collapse every
    visitor into one rate-limit bucket, turning a per-IP limit into a site-wide cap.

11. **After DNS resolves** — the checks that cannot be run earlier:
    1. `dig +short <label>.xelacktech.com` → the Vercel target; `https://…/ro` → 200
    2. `http://…/ro` → 308 to https
    3. `/ro` still carries `noindex` (Gate A is still closed)
    4. `curl -sI …/ro | grep -i cache-control` → the browser must receive
       `max-age=0, must-revalidate`, not a bare `s-maxage`
    5. `strict-transport-security: max-age=300`
    6. Real-device form submission on mobile data → email arrives
    7. Restore TTL to 3600 once stable

12. **Add the `.vercel.app` → subdomain redirect** in Vercel domain settings so
    the two hosts cannot compete.

## Phase D — indexing

Only after every precondition below. **The flip is cheap; the un-flip is not.**

### Preconditions for `GATE_A_COMPLETE = true`

Engineering — all **done** as of 2026-08-19 unless marked:

- [x] Retry after a failed delivery no longer claims success (D-014)
- [x] Message line breaks preserved (D-015)
- [x] `/proces` removed from the sitemap
- [x] Home page emits canonical, Open Graph, Twitter card and JSON-LD
- [x] Root description no longer says "Previzualizare de design"
- [x] Zero `CONFIRM_OWNER` strings and zero placeholder metrics in rendered HTML (D-016)
- [x] `/ru` carries `noindex` independently of Gate A
- [x] Branded 404 at both `/zz` and `/ro/zz`
- [x] One indexability predicate, shared with the build config, 20 tests (D-013)
- [ ] `serverActions.allowedOrigins` pinned to the final host (needs the host)
- [ ] Turnstile shipped, or the "rate limiting implemented" claim corrected at the gate

Owner — all still **open**:

- [ ] **A1** brand name · **A4** legal entity (renders in the privacy notice)
- [ ] **B1/B2** exact services, teracotă yes or no · **B4** localities served
- [ ] **E1–E3** phone confirmed, which messengers exist · **E4** destination inbox
- [ ] **G1** written right to publish the project photographs
- [ ] **G3** manual privacy pass over all 30 stills (faces, documents, plates, identifiable property)
- [ ] Host decision made explicitly: subdomain kept, or a `.md` domain bought
- [ ] Resend provisioned and a real test lead delivered end to end

### The flip

13. Set `GATE_A_COMPLETE = true` in `config/indexability.mjs`. One line, last step.
    Commit, push, deploy. If the two host variables disagree, **the build now fails
    loudly** instead of shipping an invisible site.
14. Verify on the live subdomain: `noindex` absent on `/ro`; `robots.txt` allows
    crawling and carries a `Sitemap:` line; every `<loc>` in the sitemap returns
    200 on the subdomain host; `/llms.txt` 200; canonical, `og:` and `ld+json`
    all present; `/ru` still `noindex`.
15. Search Console: DNS TXT verification in cPanel — **verify the subdomain as its
    own property, or use a DNS-verified Domain property**. A URL-prefix property
    on the parent reports nothing for a subdomain. Submit the sitemap.
16. Rich Results Test, Facebook Sharing Debugger, and send the link in WhatsApp.
17. After 48h of clean HTTPS: raise HSTS `max-age` 300 → 31536000 in
    `next.config.mjs`. **Never add `preload`** — the preload list accepts only
    apex domains, so from a subdomain it is inert, and acting on it would force
    HTTPS on every sibling of `xelacktech.com`.
18. After a clean CSP report-only run at 390px and 1440px (exercise the hamburger
    and the scroll-solid header): promote `Content-Security-Policy-Report-Only`
    to `Content-Security-Policy` and re-add `upgrade-insecure-requests`.

## Rollback

| Failure | Action |
| --- | --- |
| Bad deploy | Vercel Instant Rollback — promote the previous production deployment |
| Env misconfiguration | Fix the variable **and redeploy** — everything is baked at build time |
| DNS wrong | Restore the previous record in cPanel. This is why step 6 lowers TTL first |
| Certificate never issues | Remove the domain from Vercel, fix the CAA or the conflicting A record, re-add. `.vercel.app` keeps serving throughout |
| Indexed too early | `GATE_A_COMPLETE = false` and deploy — but Google does **not** un-index instantly, and `Disallow` prevents the crawl that would read the `noindex`. Use the Search Console Removals tool for a temporary block and keep robots.txt permissive so the `noindex` is readable |
| Lead delivery failing | Watch `delivery=` in Vercel runtime logs and the Resend dashboard for the first week. Any `failed` or `not_configured` is a same-day incident — a lost lead cannot be recovered |

---

## Applying the brand name

Only two places hardcode it; everything else derives from `site.name`.

| File | What changes |
| --- | --- |
| `lib/content.ts` | `site.name`, `site.shortName`, `site.tagline`; drop `site.confirm` once confirmed |
| `components/public/site-header.tsx` | The hardcoded `ATELIER` superscript beside the wordmark — delete it or make it the descriptor |
| `lib/hero.ts` | `heroCopy.ro.title` if "teracotă" leaves the brand; also the only place to put "Chișinău" in the `h1` |
| `app/(public)/[locale]/confidentialitate/page.tsx` | `LEGAL_ENTITY` and `CONTACT_EMAIL` (A4, E4) |
| Vercel env | `LEAD_FROM_EMAIL` display name; the subdomain label in both host variables |
| `docs/work/DECISIONS.md` | A new entry recording the name, the host and the reasoning |

`app/layout.tsx`, the footer, the header wordmark, `llms.txt` and the privacy page
already read `site.name` and need no edit.
