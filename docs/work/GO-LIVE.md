# Go-live runbook — `semidom.md`

Target: Vercel project **`semidom`** (`prj_I4TAUJdBB6MvDSnHA6hdjd49zlPm`), linked to
GitHub `AlbotCiprian/Mester_proiect_simion`, production branch `main`, auto-deploying
on every push.

---

> The owner-facing staged plan, in Romanian, is
> **[PLAN-SPRINTURI.md](PLAN-SPRINTURI.md)**. This file is the technical detail
> behind it.

## STOP — do this first

**Measured 2026-09-05, and it is the one thing that blocks everything else:**

```console
$ nslookup -type=SOA semidom.md ns1.vercel-dns.com
*** Query refused

$ curl -s "https://dns.google/resolve?name=semidom.md&type=NS"
status: NXDOMAIN   authority: ns.dns.md
```

Two facts, and the second one is the trap:

1. The `.md` registry has **not yet published** the delegation. TopHost said up to
   24 hours; that part is just waiting.
2. **Vercel has no DNS zone for `semidom.md`.** Its nameservers answer *Query
   refused*, not "no such record". Confirmed independently against the project
   API: `semidom` (`prj_I4TAUJdBB6MvDSnHA6hdjd49zlPm`) lists only
   `semidom.vercel.app` and the two generated aliases. The custom domain is
   simply not attached.

So the moment the registry does publish `ns1/ns2.vercel-dns.com`, the domain will
resolve to **nothing** — no website, no mail, no way to receive anything — until
the zone exists.

**Fix, one minute, do it now:** Vercel dashboard → project `semidom` → Settings →
Domains → Add → `semidom.md`. Vercel creates the zone, and because the domain is
already delegated to it, the apex records and the TLS certificate configure
themselves once propagation lands. Add `www.semidom.md` in the same screen and
set it to redirect to the apex.

Re-check with:

```bash
nslookup -type=SOA semidom.md ns1.vercel-dns.com     # must stop saying "refused"
curl -s "https://dns.google/resolve?name=semidom.md&type=NS"   # must list vercel-dns
```

---

## What changed, and why it matters

Delegating the nameservers to Vercel moved the **whole zone**, not just the web
records. TopHost's Zone Editor is no longer authoritative for this domain. That
is a legitimate choice — it makes the apex, the certificate and the www redirect
self-configuring, which is exactly what you want for a Vercel-hosted site — but it
means **every mail record must now be created in Vercel DNS**, and until they are,
mail to `@semidom.md` has nowhere to go.

The domain was bought without hosting, so no mailbox exists yet. That is actually
convenient: nothing is being broken, and the mailbox host is still an open choice.

---

## Stage 1 — the site answers on the domain

| # | Step | Where | Verify |
| --- | --- | --- | --- |
| 1.1 | Add `semidom.md` to the `semidom` project | Vercel → Settings → Domains | The zone stops answering "refused" |
| 1.2 | Add `www.semidom.md`, set it to **redirect to `semidom.md`** | same screen | One canonical host, no duplicate content |
| 1.3 | Wait for the registry to publish the delegation | nothing to do | `dns.google/resolve?name=semidom.md&type=NS` lists `vercel-dns` |
| 1.4 | Confirm the certificate issued | Vercel → Domains | `https://semidom.md/ro` returns 200, not a TLS error |
| 1.5 | Confirm `http://` redirects to `https://` | | `curl -sI http://semidom.md/ro` → 308 |

The apex needs **no manual A record** while Vercel holds the nameservers. If you
ever move the nameservers away, that changes — and so does everything below.

---

## Stage 2 — decide where the mailbox lives

`contact@semidom.md` has to be hosted somewhere, and that decision drives the MX
records. Vercel does not host mailboxes.

| Option | Cost | Setup | Notes |
| --- | --- | --- | --- |
| **Zoho Mail** free tier | free, 1 user, 5 GB | ~20 min | Good deliverability, real webmail and mobile apps. The usual choice for a one-person business. |
| **TopHost mail hosting** | paid add-on | ~15 min | Everything stays with one supplier and the support is in Romanian. Ask them for the MX, SPF and DKIM values. |
| **Google Workspace** | ~6 EUR/user/month | ~20 min | Best deliverability and the familiar interface; the only one with a real running cost. |

Whichever you pick, you get from them: **MX hostnames and priorities**, an **SPF
include**, and a **DKIM record**. Those three go into Vercel DNS in Stage 3.

> Do not skip this by pointing `contact@` at a Gmail address. The form sends *from*
> `semidom.md`; if the domain has no mail setup at all, the whole thing is fragile
> and looks unprofessional on a business card.

---

## Stage 3 — DNS records in Vercel

All of these are created at **Vercel → Domains → `semidom.md` → DNS Records**.

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| MX | `@` | *from your mail provider*, with their priorities | Where mail for `@semidom.md` is delivered |
| TXT | `@` | the merged SPF — see below | Which servers may send as `semidom.md` |
| TXT/CNAME | *provider's DKIM selector* | *from your mail provider* | Signs outgoing mailbox mail |
| MX | `send` | *from Resend* | Resend's bounce handling |
| TXT | `send` | *from Resend* | SPF for Resend's return-path |
| TXT | `resend._domainkey` | *from Resend* | Signs the lead emails |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact@semidom.md` | Start in report-only |

**Every value marked *from …* must be copied out of that provider's dashboard.**
Do not take them from documentation or from this file — they are per-account and
they change.

### The SPF record — the one that bites

A domain may have **exactly one** SPF TXT record at the apex. Publishing two makes
authentication fail outright, which is worse than having none. Merge them:

```text
v=spf1 include:<your-mail-provider> include:amazonses.com ~all
```

Resend sends through Amazon SES, so `include:amazonses.com` is what covers it —
but read the exact include Resend shows you, because it can differ by region.

Two things that make this easier than it looks: Resend puts its SPF on the
`send.semidom.md` subdomain, so in practice it usually does **not** collide with
your mailbox provider's apex SPF; and DKIM, which is what actually authenticates
the `From:` domain, uses different selectors per provider and never collides.

Keep the total DNS lookups in the SPF chain under **10** — each `include:` can
itself expand. Two includes is comfortably safe.

### DMARC

Start at `p=none`. It changes nothing about delivery and simply mails you reports.
Move to `p=quarantine` only after a couple of weeks of clean reports, and only once
both the mailbox and Resend are signing correctly.

---

## Stage 4 — Resend

1. Resend → Domains → Add `semidom.md`, pick the region closest to Moldova.
2. Resend prints a set of DNS records. Create each one in Vercel DNS exactly as shown.
3. Wait for Resend to show the domain **Verified**.
4. Create an API key **scoped to sending only**, not a full-access key.

> ⚠️ **Revoke `re_EYZf7EP3_…` first.** That key was visible in a screenshot
> shared in chat, which makes it compromised regardless of who saw it. Delete it
> in the Resend dashboard, then create the sending-only replacement. It is not in
> the repository — that was checked — so revoking it costs nothing but the
> minute it takes.

**Sending address:** use `SemiDom <noreply@semidom.md>`, not `contact@semidom.md`.
Sending from the same address you deliver to is a well-known spam-filter trigger,
and it makes replies loop back into the form's own mailbox. `noreply@` needs no
mailbox — only the DNS records above.

**Deliverability, first week.** A brand-new domain has no sending reputation. Send
yourself several test leads, open them, and mark them "not spam" if they land
there. Do not send anything bulk. Watch the Resend dashboard for bounces.

---

## Stage 5 — Vercel environment variables

**Production scope only** unless the row says otherwise. Vercel defaults to all
environments — narrow each one deliberately.

| Variable | Scope | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://semidom.md` — no trailing slash |
| `CONFIRMED_PRODUCTION_HOST` | Production | `semidom.md` — host only, lowercase |
| `RESEND_API_KEY` | Production | The send-only key. Preview must have **no** key: a preview deployment must never be able to send mail. |
| `LEAD_FROM_EMAIL` | Production | `SemiDom <noreply@semidom.md>` |
| `LEAD_TO_EMAIL` | Production | `contact@semidom.md` — **or any mailbox that already exists**, see below |
| `LEAD_FORM_SECRET` | Production + Preview, **different values** | Any long random string. Otherwise the HMAC falls back to a public default. |
| `IP_HASH_SALT` | Production + Preview, **different values** | Any long random string. Otherwise IP hashing falls back to a public default. |
| `LEAD_CONSENT_VERSION` | Production | e.g. `2026-09-05` |

> **`LEAD_TO_EMAIL` does not have to wait for the mailbox.** Point it at an
> address that already works — a personal Gmail, anything — and change it once
> `contact@semidom.md` is provisioned. A lead delivered to Gmail is infinitely
> better than a lead delivered to an address that bounces, and this is the one
> variable whose misconfiguration loses customers silently. The *sending* domain
> still has to be verified in Resend either way.

> **Everything is baked at build time.** Changing a variable in the dashboard does
> nothing until you redeploy. After setting these, trigger a redeploy.

The host comparison tolerates a scheme, a trailing slash, case and a trailing dot —
but `www.semidom.md` is deliberately **not** treated as the same host as
`semidom.md`. Use the apex in both variables.

---

## Stage 6 — verify before announcing anything

```bash
curl -sI https://semidom.md/ro                    # 200
curl -sI http://semidom.md/ro                     # 308 to https
curl -sI https://www.semidom.md/ro                # redirect to apex
curl -s  https://semidom.md/robots.txt            # Allow: / + a Sitemap: line
curl -s  https://semidom.md/sitemap.xml           # 18 <loc> entries, all https://semidom.md
curl -sI https://semidom.md/llms.txt              # 200
curl -s  https://semidom.md/ro | grep 'name="robots"'   # NOTHING — absence is correct
curl -s  https://semidom.md/ru | grep 'name="robots"'   # noindex, nofollow (unpublished locale)
curl -sI https://semidom.md/ro/servicii/hidroizolatie-baie   # 200
curl -sI https://semidom.md/ro/servicii/inexistent           # 404
curl -sI https://semidom.md/ro | grep -i strict-transport   # max-age=300
curl -sI https://semidom.md/ro | grep -i x-robots-tag        # NOTHING — absence is correct
```

Then the form, by hand:

- Submit once → the email arrives at `contact@semidom.md` within 8 seconds, and
  **not** in the spam folder.
- **Submit the identical form again → it must NOT claim success.** This is the
  regression check for D-014; a retry after a failure must be a real retry.
- Repeat once with JavaScript disabled in the browser.
- Submit once from a phone on mobile data, so the rate limiter sees a real client IP.

---

## Stage 7 — indexing

Only after every precondition. **The flip is cheap; the un-flip is not** — Google
does not de-index on demand, and `Disallow` prevents the very crawl that would read
the `noindex`.

### Engineering — complete

- [x] Retry after a failed delivery no longer claims success (D-014)
- [x] Message line breaks preserved (D-015)
- [x] Sitemap contains only routes that exist, asserted by a test that also
      couples it to the route's own `generateStaticParams`
- [x] Canonical, Open Graph, Twitter card and JSON-LD on every public page
- [x] Zero `CONFIRM_OWNER` strings and zero placeholder metrics in rendered HTML
- [x] `/ru` carries `noindex` independently of Gate A
- [x] Branded 404 at both levels; unknown topic slugs 404 (`dynamicParams = false`)
- [x] One indexability predicate, shared with the build config
- [x] `serverActions.allowedOrigins` pinned to `semidom.md` and `www.semidom.md`
- [x] Fifteen topic pages, hub, internal linking, `Service`/`FAQPage`/`BreadcrumbList`
- [x] Every route renders an `id="contact"` target, asserted by a test
- [ ] Turnstile shipped, or the "rate limiting implemented" claim corrected at the gate

### Gate A — OPEN since 2026-09-05 (D-024)

`GATE_A_COMPLETE = true`. The site is still `noindex` until BOTH host variables
are set on Vercel for a production deployment; that is the remaining safety net
and it is intentional. If they disagree by a scheme, a slash or a capital letter
the **build fails loudly** rather than shipping an invisible site.

- [x] **A1** brand — SemiDom (D-018) · **A3** domain — semidom.md (D-022)
- [x] **A4** legal entity — Simion Barbacaru, persoană fizică, IDNP published
      behind a reveal in the privacy notice (D-025)
- [x] **B1** service list — four cards, each evidenced by owner photography, plus
      fifteen topic pages built from the same material
- [x] **B2** teracotă — performed; the card is now named for the photograph it
      actually has, and the page says so in its own FAQ (D-026)
- [x] **B4** localities — "Chișinău și împrejurimi", his own words; a test blocks
      any named locality we cannot evidence

### Owner — not blocking indexing, but worth money

- [ ] **E2/E3** which of WhatsApp, Viber, Telegram exist on the number — unlocks
      the third action in the mobile bar
- [ ] **B2** one terracotta photograph, so that page carries its own proof
- [ ] **G1** written permission to publish the project photographs
- [ ] **G3** privacy pass over the 30 stills — faces, documents, plates, property
- [ ] **B7/D1** figures he can evidence; the trust strip renders nothing while empty
- [ ] **G4** real, sourced, consented reviews
- [ ] Resend verified and a real test lead delivered end to end

### The flip

There is no code flip left. It happens the moment a production deployment has
`NEXT_PUBLIC_SITE_URL=https://semidom.md` and `CONFIRMED_PRODUCTION_HOST=semidom.md`.
Both are read at BUILD time, so set them and then redeploy.

1. Verify on the live domain, with the probes in Stage 6.
2. Search Console: add `semidom.md` as a **Domain property** (DNS TXT — the record
   goes in Vercel DNS now, not TopHost). Submit the sitemap.
3. Rich Results Test, Facebook Sharing Debugger, and send the link to yourself in
   WhatsApp to confirm the preview card renders.
4. Create the **Google Business Profile**. For a tradesman in Chișinău it will
   out-earn all fifteen pages combined, and it is free.
5. After 48 hours of clean HTTPS: raise HSTS `max-age` from 300 to 31536000 in
   `next.config.mjs`. On an apex domain `preload` becomes possible — but do not
   add it until you are certain every future subdomain will be HTTPS, because it
   is effectively irreversible.
6. After a clean CSP report-only run at 390px and 1440px: promote
   `Content-Security-Policy-Report-Only` to `Content-Security-Policy` and re-add
   `upgrade-insecure-requests`.

---

## Rollback

| Failure | Action |
| --- | --- |
| Bad deploy | Vercel Instant Rollback — promote the previous production deployment. Seconds, no DNS involved. |
| Env misconfiguration | Fix the variable **and redeploy** — everything is baked at build time |
| Site unreachable after delegation | Almost certainly the zone does not exist: add the domain to the Vercel project |
| Mail stops working | Check the MX records in Vercel DNS. The zone moved; TopHost's Zone Editor no longer applies to this domain. |
| Certificate never issues | Check for a CAA record on the apex that excludes Let's Encrypt |
| Lead delivery failing | Watch `delivery=` in the Vercel runtime logs and the Resend dashboard daily for the first week. Any `failed` or `not_configured` is a same-day incident — a lost lead cannot be recovered. |
| Indexed too early | `GATE_A_COMPLETE = false`, push — or, faster, clear `CONFIRMED_PRODUCTION_HOST` in Vercel and redeploy. Then Search Console **Removals** for a temporary block, and keep `robots.txt` permissive so the `noindex` is actually readable. |

---

## Applying a future rename

`site.name` / `site.shortName` / `site.descriptorShort` in `lib/content.ts` is the
single source. `app/layout.tsx`, the footer, the header wordmark, `llms.txt`, the
JSON-LD graph and the privacy notice all derive from it. The two things that need a
human decision are the descriptor beside the wordmark
(`components/public/site-header.tsx`) and the hero `h1` (`lib/hero.ts`).

`.env.example` is excluded from agent file access by the `.env*` permission rule, so
its two host lines are updated by hand.
