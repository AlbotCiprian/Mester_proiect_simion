# Frontend — Audit & Optimizări (roadmap)

> **Metodă:** audit multi-lentilă (6 agenți experți: performanță, accesibilitate, SEO, design/UX, calitate cod, conversie) peste codul real + spec-urile 06–21.
> **Scop:** listă prioritizată de **probleme de reparat** + **implementări/optimizări noi** ca să facem frontul „mai super".
> **Stare:** prototip P0 (homepage RO, RU = ComingSoon, conținut `CONFIRM_OWNER`, build `noindex`). Nimic din acest document nu cere publicarea de date neconfirmate.

---

## 0. Scorecard

| Lentilă | Scor /100 | Verdict |
|---|---:|---|
| Conversie / CRO | **38** | 🔴 Critic — funnel-ul nu are formular; toate CTA-urile se închid în buclă pe `#contact` |
| SEO / semantică | **52** | 🟠 Fundație lipsă (metadata per-locale, canonical/hreflang, robots/sitemap, JSON-LD) |
| Performanță / CWV | **68** | 🟡 Bună bază; lipsesc preload poster, preconnect, lazy la journey |
| Accesibilitate | **68** | 🟡 Bază solidă; lipsesc skip-link, `lang` per locale, contrast peste video |
| Design / UX | **72** | 🟢 Premium real; de variat ritmul, before/after interactiv, cadență tonuri |
| Calitate cod | **72** | 🟢 Curat; content layer ne-i18n, cod mort, zero teste |

**Cea mai mare pârghie:** conversia. Designul/UX-ul și fundația tehnică sunt bune, dar **un vizitator nu poate trimite o cerere** — toate butoanele duc la o secțiune cu… alte butoane.

---

## 1. Concluzie executivă

1. **Funnel-ul e închis în buclă.** Hero, header, sticky bar, estimator, portofoliu, FinalCta → toate `#contact`, iar `#contact` conține doar butoane (unul duce iar la `#contact`). **0% captură de lead by design.** → trebuie un **formular real** (spec 12).
2. **Canalele de contact sunt „moarte"** în prototip (`Mesaj` = `#`, `Sună` = număr fals) — trebuie degradate elegant către formular până confirmi datele.
3. **Analytics pe CTA lipsește** aproape peste tot → nu putem măsura ce convertește (spec 20).
4. **Fundația SEO lipsește** (metadata per-pagină, canonical, hreflang, robots, sitemap, JSON-LD) — de pregătit acum, gated pe `noindex`, ca la Gate A să fie doar „flip".
5. **Câștiguri rapide de performanță**: preload poster LCP, preconnect/self-host imagini, lazy la cele 60 de cadre journey.
6. **Accesibilitate**: skip-link, `lang` corect per locale, contrast peste video, target-uri 44px.

---

## 2. Prioritizare (top)

| # | Prioritate | Item | Efort | Lentilă |
|---|---|---|---|---|
| 1 | 🔴 P0 | Formular real QuickLead ca țintă `#contact` | L | Conversie |
| 2 | 🔴 P0 | Tracking `cta_click`/`contact_click` pe toate CTA-urile | M | Conversie |
| 3 | 🔴 P0 | Guard „canal live" — degradează `#`/numere false către formular | S | Conversie |
| 4 | 🟠 P1 | Skip-link + `<main id tabindex>` | S | A11y |
| 5 | 🟠 P1 | `<html lang>` per locale | M | A11y/SEO |
| 6 | 🟠 P1 | Controale focusabile scoase din subarborele `aria-hidden` (journey) | S | A11y |
| 7 | 🟠 P1 | Contrast text/CTA peste video + focus ring pe fundal închis | S | A11y |
| 8 | 🟠 P1 | Preload poster LCP + preconnect/self-host imagini | S | Perf |
| 9 | 🟠 P1 | Journey: încărcare lazy/windowed + suspendare rAF offscreen | M | Perf |
| 10 | 🟠 P1 | `generateMetadata` + canonical + hreflang + `metadataBase` din env | M | SEO |
| 11 | 🟠 P1 | `robots.ts` + `sitemap.ts` | M | SEO |
| 12 | 🟠 P1 | Fix flash header (solid→transparent) la hidratare | S | Design/Perf |
| 13 | 🟠 P1 | Target-uri 44px (sticky bar, pills locale) + switcher locale pe mobil | S | A11y/Design |

---

## 3. Detaliu pe lentile

### 3.1 Conversie / CRO — 38 🔴

**Puncte forte:** sticky bar mobil cu 3 acțiuni; `track()` PII-free bine arhitecturat; hero cu mesaj+CTA în primul viewport; trust strip devreme; canale tipizate în `lib/content.ts`.

**Probleme:**
- 🔴 **Critic — funnel dead-end.** [home-sections.tsx FinalCta:310-341] niciun `<form>` în repo; toate CTA → `#contact` → doar butoane (unul iar `#contact`). → **construiește formularul** (vezi 4.1).
- 🟠 **Zero analytics pe CTA** [ui.tsx Button; site-header; sticky-contact-bar; FinalCta/Estimator/Portfolio] → adaugă `cta_click {placement,action,locale,page_type}` și `contact_click {channel,placement}`.
- 🟠 **Canale moarte** [sticky-contact-bar.tsx; content.ts:72-74] `Mesaj`=`#`, `Sună`=`tel:+37300000000` → guard `isLive(channel)` + degradare la formular.
- 🟡 **Estimator fals** [home-sections.tsx:186-218] butonul „Calculează" nu calculează, duce la `#contact` → fă-l real (4.4) sau relabel onest „Cere o estimare".
- 🟡 **RU = 0% conversie** [page.tsx ComingSoon] → pune măcar telefon/Telegram + 1-câmp callback pe pagina RU.
- 🟢 **Hero secondary CTA** trimite trafic high-intent lateral spre galerie fără captură → fă-l clar subordonat + tracked.

### 3.2 SEO — 52 🟠

**Puncte forte:** un singur `<h1>`, HTML semantic, **zero JSON-LD fals** (corect cât e placeholder), `noindex` global, rutare `/ro`+`/ru` corectă, `alt` consecvent.

**Probleme:**
- 🟠 **`<html lang>` hardcodat `ro`** [layout.tsx:36] — RU va declara `ro` (WCAG 3.1.1 + semnal SEO greșit).
- 🟠 **Metadata doar în root** [niciun `generateMetadata`] — fără title/description/canonical per pagină/locale.
- 🟠 **Fără canonical / hreflang** — `/ro` și `/ru` vor concura ca duplicate.
- 🟠 **`metadataBase = localhost`** [layout.tsx:23] — toate URL-urile absolute rup în Preview/Prod → din env `NEXT_PUBLIC_SITE_URL`.
- 🟠 **Fără `robots.ts` / `sitemap.ts`**.
- 🟡 **Fără JSON-LD** (Organization/LocalBusiness/Service/WebSite) — corect absent acum, dar de pregătit **gated**.
- 🟡 **Linkuri = doar anchore** `#` pe o singură pagină → fără graf de linkuri (depinde de rutele reale).
- 🟢 Fără OG/Twitter/OG-image; fără favicon/manifest; fără 404/500 brandate.

### 3.3 Performanță / CWV — 68 🟡

**Puncte forte:** LCP = poster server-rendered (nu video/canvas); video corect demotat (preload metadata, autoplay gated, pauză pe `visibilitychange`); journey = progressive enhancement; `next/image` cu `sizes`; reduced-motion respectat; fonturi self-hosted.

**Probleme:**
- 🟠 **Poster LCP nepreîncărcat** [cinematic-hero.tsx:34-44] → `<link rel=preload as=image imagesrcset imagesizes fetchpriority=high>` în `<head>`.
- 🟠 **Fără preconnect la Unsplash** [toate imaginile service/portfolio remote] → `preconnect` sau, mai bine, **self-host placeholder-ele** în `/public`.
- 🟠 **Journey decodează 60 de cadre pe mount** [scroll-journey.tsx:44-56] → lazy via IntersectionObserver + windowing + eliberare la unmount.
- 🟡 **rAF journey rulează continuu** + 3 scroll listeners [hero/journey/header] → suspendă rAF offscreen; consolidează scroll.
- 🟡 **`next/image` fără AVIF/quality cap** [next.config.mjs] → `formats:["image/avif","image/webp"]`, `deviceSizes` tăiate, `quality≈70`.
- 🟡 **Subset cyrillic livrat degeaba** cât RU e nepublicat [layout.tsx] → `subsets:["latin","latin-ext"]` până la RU.
- 🟢 Header `backdrop-blur` pe bară fixă = repaint la scroll → preferă fundal solid + blur ca enhancement.

### 3.4 Accesibilitate (WCAG 2.2 AA) — 68 🟡

**Puncte forte:** un `<h1>`, landmark-uri labeled, video decorativ corect + Pause/Play `aria-pressed`, reduced-motion comprehensiv, iconuri `aria-hidden` + `sr-only`, `:focus-visible` global, `aria-current` pe locale.

**Probleme:**
- 🟠 **Fără skip-link** + `<main>` fără `id/tabindex` [layout.tsx] (WCAG 2.4.1).
- 🟠 **Controale focusabile în subarbore `aria-hidden`** [scroll-journey.tsx:169 wrapper + link/CTA:192-226] (WCAG 4.1.2) → scoate-le din `aria-hidden` sau fă-le pur decorative (static-ul are deja CTA accesibil).
- 🟠 **`lang` greșit per locale** [layout.tsx:36] (3.1.1).
- 🟠 **Contrast text peste video** [cinematic-hero `text-canvas/55`; scroll-journey `text-canvas/45`] (1.4.3) → prag minim ~`/70` + plăcuță solidă pentru fine print.
- 🟡 **Focus ring bronze slab pe fundal închis** [globals.css:107-111] (1.4.11) → variantă `bronze-light`/dublu inel pe dark.
- 🟡 **Target-uri <44px** [sticky-contact-bar `py-2.5`; pills locale] + sticky bar fără landmark + destinații duplicate `#contact`.
- 🟢 Resume video pe refocus → persistă preferința de pause în sessionStorage.

### 3.5 Design / UX — 72 🟢

**Puncte forte:** sistem de tokens custom real (nu shadcn), motiv „rost", motion ca enhancement, journey progressive-enhancement, guvernanță `CONFIRM_OWNER`, scală fluidă + cifre tabulare.

**Probleme:**
- 🟠 **Flash header** solid→transparent la hidratare [site-header.tsx:14] → stare inițială transparentă pe rutele cu hero (prop `heroPresent`).
- 🟠 **Switcher locale absent pe mobil** [site-header.tsx:59 `hidden sm:flex`, lipsă din meniul mobil].
- 🟡 **Cadență tonuri ruptă** — Flagship `surface` + Journey `surface` adiacente [home-sections:84,350] → re-tonează (contract de secvență).
- 🟡 **Padding uniform** peste tot [ui.tsx Section py-20/28] → prop `density` (tight/default/loose) + 1 secțiune full-bleed de impact.
- 🟡 **Grile de carduri quasi-identice** [Services/PrecisionProof/Process] → variază scara; Process ca timeline pe „spină de rost".
- 🟡 **Lipsește before/after interactiv** (P0 în 06/07/08) — există doar side-by-side static → componentă cu divizor draggable + tastatură.
- 🟡 **Fără empty-states** la Reviews/Portfolio [map necondiționat] → ascunde secțiunea / filtrează recenzii fără sursă.
- 🟢 FAQ cu `+` text în loc de SVG coerent; `.tile-grid` 64px fix (ne-responsiv).

### 3.6 Calitate cod / arhitectură — 72 🟢

**Puncte forte:** contracte de date separate de UI, boundary server/client corect la hero (rights gate), `lib/capability.ts` partajat, `tsconfig` strict + `noUncheckedIndexedAccess`, `CONFIRM_OWNER` disciplinat.

**Probleme:**
- 🟠 **Content layer ne-i18n** [content.ts flat RO vs hero.ts deja `Record<Locale,…>`] → unifică pe `getContent(locale)` (blochează lansarea RO+RU).
- 🟡 **Stringuri RO hardcodate în componente** [home-sections, site-header, footer] → mută în content per-locale.
- 🟡 **Cod mort:** export `hero` în content.ts neutilizat; câmpuri `room/service/metrics/factors` în journey nefolosite.
- 🟡 **`max-w-[78rem]` duplicat în 5 locuri** → token `--container-site` / utilitar `.shell`.
- 🟡 **Logică de business în UI** (format preț duplicat; filtrare canale inline) → helpers în `lib`.
- 🟠 **Zero teste / zero tooling de test** → Vitest (lib) + Playwright + axe.
- 🟢 `key={i}` la reviews; `disclosureFor` fără `assertNever`.

---

## 4. Implementări noi recomandate (cele mai valoroase)

### 4.1 🔴 Formular QuickLead (ținta reală `#contact`) — [L]
Câmpuri (spec 12 P0): nume, telefon (`type=tel`, `inputmode=tel`), localitate (select din zone confirmate), serviciu (select din `services`), mesaj opțional, **consimțământ GDPR** nebifat. Server Action + **Zod** + **Turnstile** + honeypot + idempotency; stări inline error/success; `form_start`/`form_submit`. Înlocuiește butoanele din FinalCta; păstrează call/Telegram ca alternative. *Cea mai mare pârghie de pe site.*

### 4.2 🔴 Tracking CTA centralizat — [M]
`Button` primește `{event,placement,action}` (sau wrapper `TrackedCTA` client) → `cta_click`; sticky bar devine client → `contact_click {channel,placement:'sticky_bar'}`; footer + FinalCta la fel. Reutilizează `track()` (rămâne no-op până la GA4).

### 4.3 🟠 Fundație SEO „launch-ready", gated — [M]
`lib/seo/metadata.ts` (`buildMetadata({locale,path,title,description})` cu `metadataBase` din env, canonical self, `alternates.languages` doar pentru `publishedLocales`, OG/Twitter) + `generateMetadata` în layout/page; `app/robots.ts` + `app/sitemap.ts` dintr-un registru de rute; `lib/seo/jsonld.ts` cu **guard `CONFIRM_OWNER`** (nu emite NAP/rating/preț neconfirmat). Tot sub `noindex` acum.

### 4.4 🟡 Estimator real (sau relabel onest) — [L/S]
Map spec 12 (suprafață, serviciu, format, stare suport, hidroizolație, localitate, urgență) → interval orientativ + disclaimer ADR-012 + hand-off pre-completat către formular; `estimate_started`/`estimate_complete`. Fallback static = lista de factori actuală. *Variant rapid:* relabel „Cere o estimare" până se implementează.

### 4.5 🟡 Componentă Before/After accesibilă — [M]
Divizor draggable (pointer + săgeți, `role=slider`), etichete „Înainte/După" vizibile, fallback side-by-side (reduced-motion/no-JS). În Flagship + un proiect din portofoliu. *Cel mai persuasiv instrument pentru placări.*

### 4.6 🟡 Content layer pe locale — [L]
`getContent(locale): SiteContent` (RO complet, RU stub `CONFIRM_OWNER`), `home-sections` îl primește pentru `locale`-ul deja pasat. Seam curat pentru CMS (Neon/Prisma) ulterior. Rezolvă și stringurile RO hardcodate.

### 4.7 🟢 Tooling de test (Definition of Done) — [S/M]
Vitest pe `lib/` (capability tiers, rights gate, `isLocale`, helpers preț/canale) + Playwright + `@axe-core/playwright` (un `<h1>`, reduced-motion→static, RU=ComingSoon, header solid la scroll, `noindex`, axe fără violări critice).

### 4.8 🟢 Câștiguri rapide perf — [S]
Preload poster LCP + `web-vitals` în `track()`; self-host placeholder-e; AVIF + `quality` în `next.config.mjs`; drop subset cyrillic; suspendare rAF journey offscreen.

### 4.9 🟢 Polish design — [S–M]
Contract de cadență tonuri + `density` pe Section; Process ca timeline; strip „Materiale/finisaje" (macro-detalii); empty-states; scroll-reveal `.fade-up` (există, nefolosit); iconuri FAQ coerente.

---

## 5. Plan de execuție (step by step)

> Recomandare: pe milestone-uri mici, fiecare cu `lint`/`typecheck`/`build` verzi + commit.

**Sprint 1 — Conversie (deblochează scopul site-ului)**
1. `lib/content.ts`: `isLive(channel)` + helpers canale/preț; scoate exportul mort `hero`.
2. `TrackedCTA` + `cta_click`/`contact_click` peste tot; sticky bar → client.
3. **Formular QuickLead** (4.1) ca `#contact`; canale ne-live → formular.

**Sprint 2 — Accesibilitate & corecții (AA)**
4. Skip-link + `<main id="main" tabindex=-1>`; `scroll-margin-top` deja există.
5. Scoate CTA/skip din `aria-hidden` (journey).
6. `<html lang>` per locale (mută `<html>` în `[locale]` layout).
7. Contrast peste video (praguri + plăcuțe) + focus ring pe dark; target-uri 44px; switcher locale pe mobil; fix flash header.

**Sprint 3 — Fundație SEO (gated noindex)**
8. `metadataBase` env + `generateMetadata` + canonical/hreflang.
9. `robots.ts` + `sitemap.ts` din registru de rute.
10. `lib/seo/jsonld.ts` gated; OG image + favicon + 404/500 brandate.

**Sprint 4 — Performanță**
11. Preload poster + preconnect/self-host; AVIF/quality; drop cyrillic.
12. Journey lazy/windowed + rAF offscreen; web-vitals reporting.

**Sprint 5 — Conținut & i18n + teste**
13. `getContent(locale)` + mută stringurile RO; pregătește RU stub.
14. Vitest + Playwright + axe; (apoi) Lighthouse CI + bundle analyzer + media-size gate.

**Sprint 6 — Profunzime design**
15. Before/After interactiv; Process timeline; Materials strip; cadență tonuri/`density`; estimator real; empty-states; scroll-reveal.

---

## 6. CONFIRM_OWNER / blocaje

Conversia reală depinde de date de la proprietar (Gate A): **telefon/Viber/Telegram reale**, **zone deservite**, **servicii confirmate**, prețuri orientative, recenzii cu sursă, proiecte cu drept de publicare. Până atunci: formularul + canalele degradează elegant, prețurile rămân „la cerere", JSON-LD/rating nu se emit.

---

## 7. Note

- Auditul a fost rulat automat (workflow 6 lentile) pe codul de la commit-ul curent; scorurile sunt orientative.
- Nimic din acest plan nu publică date neconfirmate; toate adăugările SEO/structured-data sunt gated pe `CONFIRM_OWNER` + `noindex`.
- Ordinea poate fi ajustată; **Sprint 1 (conversie)** are cel mai mare ROI și e recomandat primul.
