# 29 — Full-Window Cinematic Hero „Apartament Premium" (REVISED · FINAL)

> **Status:** Proposed — necesită Gate A (drepturi media) și Gate B (UX readiness).
> **Tip:** modul de experiență hero + master prompt de implementare. **Acesta este documentul unic și final** pentru hero-ul cinematic P0.
> **Supersedare:** înlocuiește, pentru P0, abordarea image-sequence / scroll-driven din `docs/specs/29-SCROLL-CINEMATIC-EXPERIENCE.md` (marcată „Superseded for P0"; experiența „Parcursul Renovării" este **demotată** la o secțiune de dovadă mai jos în pagină — vezi §1.2 și §18).
> **Autoritate (fișiere reale):** `docs/specs/05-ARCHITECTURE-DECISION-RECORDS.md`, `docs/specs/06-FRONTEND-CREATIVE-DIRECTION.md`, `docs/specs/08-MOTION-IMMERSIVE-EXPERIENCE.md`, `docs/specs/09-PUBLIC-WEBSITE-MODULE.md`, `docs/specs/16-MEDIA-VERCEL-BLOB.md`, `docs/specs/17-AUTH-SECURITY-PRIVACY.md`, `docs/specs/18-SEO-LOCAL-SEO-SEMANTIC.md`, `docs/specs/19-CONTENT-I18N-EDITORIAL.md`, `docs/specs/20-ANALYTICS-KPI-CRO.md`, `docs/specs/21-PERFORMANCE-ACCESSIBILITY.md`, `docs/specs/22-DEPLOYMENT-VERCEL-OPERATIONS.md`, `CLAUDE.md`.
> **Limbă:** RO/RU per `ADR-011`. **Indexare:** prototipul este global `noindex` (`app/layout.tsx`); producția devine indexabilă la Gate A (vezi §14).
> **Media:** videoul este **furnizat separat de proprietar** (nu este generat de Claude Code și nu există un document `34-…` în repo — orice referință la el a fost eliminată). Până la livrare, `publicationAllowed = false` și se randează fallback-ul aprobat (§6, §16).

---

## 0. Cum se folosește acest document

- Este **sursa unică de adevăr** pentru hero-ul homepage în P0 și poate fi predat ca **master prompt** (Anexa B).
- Conține și o secțiune **„Impact asupra codului existent"** (§18) cu fișierele reale care se modifică — pentru că în repo există deja un hero HTML și experiența Journey (image-sequence) care trebuie reconciliate, nu doar „adăugate".
- Toate căile, numele de fișiere de spec și convențiile reflectă **codul real** (Next.js 15 App Router, TypeScript strict, Tailwind v4, fără CSS Modules, componente sub `components/public/`, content tipizat în `lib/`).

---

## 1. Decizia de produs

### 1.1 Ce construim

Homepage-ul începe cu un **hero cinematic full-window**: un video de fundal (apartament premium finisat — teracotă, gresie, marmură, baie, living, bucătărie) care ocupă **întregul prim viewport**. Videoul este **atmosferă decorativă**; mesajul comercial, headline-ul, CTA-urile și tot conținutul indexabil rămân **HTML semantic, server-rendered**.

### 1.2 Ce NU facem în P0 (pentru hero) și ce devine din Journey

Pentru **hero** nu folosim: scroll-scrubbing, image-sequence, `<canvas>`, capitole pe camere, minimap, before/after, GSAP ScrollTrigger.

**Important — coliziune reală:** aceste mecanisme **există deja implementate** în repo ca secțiunea „Parcursul Renovării" (`components/public/journey/*`, `lib/journey.ts`, `public/sequences/baie/*`), montată în `components/public/home-sections.tsx` imediat după `TrustStrip`. Acest document **nu le șterge tacit**. Decizie:

- **Hero-ul video devine primul viewport și singurul moment de motion dominant „above the fold"** (`08` §Motion budget: „maximum un moment motion dominant per viewport").
- **Journey se păstrează, dar demotat** ca secțiune de dovadă mai jos în pagină (sub servicii/flagship), nu lângă hero. Astfel cele două experiențe grele nu se stivuiesc.
- Tier-ul de scrub al Journey rămâne acceptabil pentru că nu mai este în primul viewport; rămân toate fallback-urile lui.
- Alternativă (dacă proprietarul preferă simplitate maximă): Journey poate fi parcat (eliminat din `HomeSections`) și readus la P1. Recomandarea acestui document: **păstrează-l demotat**.

> Motiv: `06` cere o singură poveste flagship coerentă, nu spectacol stivuit; `08` interzice mai multe momente de motion dominant per viewport.

---

## 2. Poziționare în homepage (compoziție reală)

```text
[ Header transparent peste hero → solid după prag ]
[ CinematicHero — video full-window, primul viewport ]   ← NOU (înlocuiește hero-ul HTML actual)
[ Trust strip ]
[ Servicii ]
[ Flagship / „Parcursul Renovării" (Journey, demotat) ]   ← mutat mai jos, nu lângă hero
[ Proces ]
[ Estimator / formular ]
[ Portofoliu ]
[ Recenzii ]
[ FAQ ]
[ CTA final ]
[ Footer ]
```

`CinematicHero` este prima secțiune din `<main>`, peste/în spatele header-ului transparent.

---

## 3. Obiectiv UX și principii

În primele ~3 secunde utilizatorul înțelege: (1) serviciul oferit, (2) poziționarea premium, (3) că poate cere rapid o estimare, (4) că videoul este atmosferă, nu singura sursă de informație.

Principii (obligatorii):

- **content-first** (headline + CTA în HTML, vizibile înainte ca videoul să fie gata);
- full-bleed, fără benzi; autoplay **doar muted**; scroll **nativ** (fără hijacking);
- fără loader fullscreen; fără text „baked" în video; fără sunet automat; fără CTA ascuns;
- nicio informație esențială nu depinde de redarea videoului;
- **premium fără ostentație** (`06`): serif editorial (token `--font-display`/Playfair existent), accent bronz folosit cu măsură, fără neon/glassmorphism/3D decorativ. Cadrul muted trebuie să arate **meșteșug real** (rost, aliniere), nu doar un apartament lucios — altfel pică criteriul `06` de recognoscibilitate.

---

## 4. Layout full-window

### Desktop

- `min-height: 100svh` (fallback `100vh`); media absolută `inset: 0`, `object-fit: cover`, `object-position` configurabil per breakpoint;
- conținut într-un container editorial aliniat stânga (≤ ~7–9 coloane); headline 2–3 rânduri; CTA-uri above the fold;
- indicator de scroll discret; buton Pause/Play vizibil.

### Mobil

- `min-height: 100svh`; respectă `env(safe-area-inset-*)`;
- **asset video portrait separat** (nu center-crop din desktop ca soluție finală);
- text în treimea inferioară, deasupra barei sticky de contact existente (`components/public/sticky-contact-bar.tsx`) — fără suprapunere;
- CTA principal ≥ 44×44; maximum două CTA-uri; Pause/Play accesibil cu o mână; scrim suficient.

### Header (modificare reală a `components/public/site-header.tsx`)

Starea actuală: header `"use client"` **mereu solid** (`bg-canvas/85 backdrop-blur border-b`, tokens întunecate pe fundal deschis) — ar fi **invizibil** peste un video întunecat. Cerințe de rescriere:

- adaugă o **stare transparent → solid** condusă de un `IntersectionObserver` pe hero (mai ieftin pentru INP decât un listener de scroll); prag ~64px / la ieșirea hero-ului din viewport;
- **peste hero (transparent):** logo/nav în tokens deschise (canvas), accent `bronze-light`, **fără** border-b (sau border estompat); CTA „Cere o estimare" cu contrast verificat;
- **după prag (solid):** revine la `bg-canvas/85` + tokens `ink`;
- contrast **AA verificat în ambele stări** pentru nav, locale switcher și CTA (text normal ≥ 4.5:1, text mare ≥ 3:1) peste cel mai luminos cadru al videoului;
- `@media (prefers-reduced-transparency: reduce)` → fundal solid;
- header-ul este **deja** client component (are `useState` pentru meniul mobil) → **nu** se adaugă o insulă nouă;
- **pagini fără hero** (ex. ruta RU „ComingSoon"): header-ul pornește **solid**, nu transparent peste o pagină deschisă.

---

## 5. Copy și i18n (aliniat la realitatea repo-ului)

**Realitate:** nu există un sistem de mesaje i18n. `lib/i18n.ts` definește doar locale (`ro`, `ru`), `defaultLocale='ro'`, `publishedLocales=['ro']`. Tot copy-ul este RO, tipizat în `lib/content.ts`. Ruta RU randează „ComingSoon". **Nu introducem o bibliotecă i18n** doar pentru hero (`CLAUDE.md`: fără infrastructură nejustificată).

Abordare concretă (consistentă cu `lib/content.ts` și `19`):

```ts
// lib/hero.ts (sau extindere a lib/content.ts)
export interface HeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  pause: string;
  play: string;
  scrollHint: string;
  mediaDisclosure: string;
}
// Doar `ro` în P0. `ru` rămâne absent (CONFIRM_OWNER) — RU este negublicat (publishedLocales).
export const heroCopy: Partial<Record<Locale, HeroCopy>> = {
  ro: {
    eyebrow: "Finisaje premium pentru spații care rămân",
    title: "Teracotă și placări executate cu precizie",
    description:
      "Transformăm băi și interioare complete prin pregătire corectă, aliniere atentă și finisaje curate, adaptate fiecărui proiect.",
    primaryCta: "Cere o estimare",
    secondaryCta: "Vezi proiectele",
    pause: "Oprește video",
    play: "Pornește video",
    scrollHint: "Descoperă serviciile",
    mediaDisclosure: "Vizual demonstrativ",
  },
};
```

Reguli de copy:

- copy-ul vine din stratul de content (`lib/...`), **nu** din componentă;
- **RU este în afara scope-ului P0** (homepage RU = „ComingSoon"); stringurile RU sunt `CONFIRM_OWNER` și se adaugă, verificate de vorbitor nativ, când RU intră în `publishedLocales` (`19`, `ADR-011`, fără pagină mixtă);
- nu afirma că apartamentul din video este executat de companie decât dacă este proiect real documentat (vezi truth table §16);
- afișează disclosure (`Vizual demonstrativ` / `Concept vizual`) conform `rightsStatus` — **obligatoriu**, nu opțional, când nu e `OWNED` documentat;
- **fără prețuri în hero**; hero-ul și trust strip-ul adiacent **nu** afișează ani de experiență, număr de proiecte, durată de garanție sau arii acoperite decât `CONFIRM_OWNER` (vezi flagurile existente din `lib/content.ts`).

---

## 6. Contractul de media (+ rights, realist)

### Structură (URL-uri din `public/`)

```text
public/media/hero/
  hero-finisaje-premium-desktop.mp4
  hero-finisaje-premium-mobile.mp4
  hero-finisaje-premium-desktop-poster.webp
  hero-finisaje-premium-mobile-poster.webp
```

- Pe disc: `public/media/hero/…`; URL public: `/media/hero/…` (regula Next: `public/` = web root). **Azi folderul nu există** — asseturile vin separat de proprietar.
- **Nume neutre, orientate pe serviciu** (nu identifică o proprietate/Airbnb). Numele de fișier, calea, `alt`, caption, metadata, structured data, OG și payload-ul de analytics **nu** conțin identificatorul unei proprietăți terțe (vezi §16).

### Tip (server-only) + fallback

```ts
// lib/hero.ts — tip rezolvat pe server; vezi §16 pentru enforcement
interface CinematicHeroMedia {
  desktopMp4: string;
  mobileMp4: string;
  desktopPoster: string; // LOCAL, LCP-safe
  mobilePoster: string;
  durationSeconds: number;
  rightsStatus: "OWNED" | "LICENSED" | "ORIGINAL_GENERATED" | "MOODBOARD_ONLY";
  publicationAllowed: boolean; // default false
  disclosure?: string; // derivat din rightsStatus (vezi §16), nu „free-typed"
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
}
```

- **Fallback** când `publicationAllowed !== true`: un **poster local aprobat** (nu un fișier inexistent). Până la livrarea hero-ului, fallback-ul trebuie să fie un asset real prezent în repo (ex. un poster local aprobat; nu hotlink remote, pentru LCP). `09`: „dacă media hero eșuează, posterul rămâne complet".

### Viitor — Vercel Blob (deviere ADR notată)

`ADR-004`/`16` impun Vercel Blob pentru media controlată, cu metadata în PostgreSQL, strip EXIF/GPS, allowlist MIME, stare de vizibilitate/consimțământ. Abordarea locală `public/media/hero/` este o **deviere deliberată, doar pentru P0**, care trebuie consemnată într-un ADR nou (vezi §19) și înlocuită prin: adăugarea host-ului Blob în `next.config.mjs` `remotePatterns`, înregistrare `MediaAsset` (provider/key, mime, checksum, vizibilitate, consimțământ, `rightsStatus`), strip EXIF. **Media negublicată NU stă în `public/`** (world-readable) — vezi §16.

---

## 7. Arhitectură frontend (convenții reale)

```text
components/public/hero/
  cinematic-hero.tsx            # Server Component: structură, copy, poster LCP, rezolvarea rights gate
  cinematic-hero-controls.tsx   # Client island minimal: play/pause, autoplay detection, single-source select, analytics

lib/
  hero.ts                       # config + tipuri (reutilizează CONFIRM/ConfirmFlag din lib/content.ts) + heroCopy
  capability.ts                 # detector de tier PARTAJAT (refactorizat din journey/scroll-journey.tsx)
```

- **Fără CSS Modules.** Stilizare cu utilitare Tailwind v4 + tokens `@theme` (`bg-ink`, `text-canvas`, `bronze`, `joint-rule`); primitive cu adevărat noi (full-bleed `100svh`, scrim, `object-position`) ca bloc `@layer utilities` în `app/globals.css` (exact cum a fost adăugat `.journey-canvas`).
- **Capability detector partajat:** extrage logica existentă din `components/public/journey/scroll-journey.tsx` (`matchMedia('(prefers-reduced-motion: reduce)')`, `navigator.connection?.saveData`, `navigator.deviceMemory`, `pointer: coarse`) în `lib/capability.ts`, folosit de **ambele** (hero + journey) — o singură implementare testată, fără duplicare.

### Markup orientativ (corectat)

```tsx
// cinematic-hero.tsx (Server Component)
<section className="relative min-h-[100svh] overflow-hidden bg-ink" aria-labelledby="hero-title">
  {/* LCP = poster EAGER (next/image priority + fetchpriority), NU <video poster> */}
  <Image
    src={poster}                 // poster rezolvat per viewport pe server (sau ambele cu media-conditioned <source> în <picture> numai pentru poster)
    alt=""                        // decorativ; informația e în copy
    fill priority
    sizes="100vw"
    className="absolute inset-0 -z-10 object-cover"
  />
  {publicationAllowed ? <CinematicHeroControls media={publicMediaDTO} copy={controlCopy} locale={locale} /> : null}
  <div aria-hidden className="absolute inset-0 -z-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/40 lg:bg-gradient-to-r lg:from-transparent lg:to-ink/80" />
  <Container className="relative flex min-h-[100svh] flex-col justify-center">
    <p className="kicker">{copy.eyebrow}</p>
    <h1 id="hero-title" className="...">{copy.title}</h1>
    <p>{copy.description}</p>
    <div>{/* PrimaryCTA #contact, SecondaryCTA #proiecte */}</div>
    {disclosure ? <p className="...">{disclosure}</p> : null}
  </Container>
  {/* ScrollHint: link real către #servicii sau aria-hidden */}
</section>
```

```tsx
// cinematic-hero-controls.tsx ("use client") — montează UN singur <video>, sursa aleasă client-side
<video
  ref={ref}
  muted playsInline loop
  preload="metadata"
  aria-hidden="true" tabIndex={-1}
  className="absolute inset-0 -z-[5] h-full w-full object-cover"
  // src rezolvat prin matchMedia (desktop vs mobile), NU prin <source media> (nesigur pe iOS)
/>
```

> Selectarea sursei se face **client-side cu `matchMedia`** (un singur `<video>`, un singur `src`), exact ca pattern-ul existent din `scroll-journey.tsx` (`window.innerWidth >= 1024 ? desktop : mobile`). `<source media>` este nesigur (iOS/Safari) și poate descărca assetul greșit sau ambele.

---

## 8. LCP și strategia de încărcare

Ordine: HTML semantic → **poster** → fonturi critice → video (după primul paint) → restul paginii.

Mecanica concretă (esențială — nu omite):

- **LCP-ul este posterul randat explicit** ca `next/image` cu `priority` + `fetchpriority="high"` + `sizes`, **NU** atributul nativ `<video poster>` (acela e prioritate joasă și apare abia după `metadata`). Posterul stă în spatele videoului prin CSS.
- preîncarcă **doar** posterul corect pentru viewport (next/image `priority` se ocupă; opțional `<link rel="preload" as="image" fetchpriority="high">`);
- `<video>`: `preload="metadata"` (nu `auto`), **fără poster concurent**, niciodată eager;
- **niciodată ambele video-uri** preîncărcate; un singur asset per viewport (matchMedia);
- nu schimba sursa repetat la resize;
- dacă autoplay eșuează → rămâne posterul (+ `hero_video_autoplay_blocked`);
- `visibilitychange`: pauză când tabul e hidden; opțional pauză când hero-ul e complet offscreen;
- dacă userul a apăsat Pause, reluarea nu îl surprinde;
- rezervă cutia hero (`100svh`/`100vh`) → **fără CLS**.

---

## 9. Capability tiers (detector partajat — `lib/capability.ts`)

| Tier | Condiție | Comportament |
|---|---|---|
| A | desktop bun, conexiune bună | desktop MP4 autoplay muted + poster |
| B | laptop modest | desktop MP4, fără efecte suplimentare |
| C | mobil bun | video portrait optimizat |
| D | `saveData` / 2g / slow-2g / memorie mică | **poster static**, fără descărcare video automată; play explicit opțional |
| E | `prefers-reduced-motion` | poster static, fără autoplay |
| F | eroare video / autoplay blocat / JS off | poster + HTML + CTA complet |

- `deviceMemory` / `navigator.connection` se folosesc **doar cu feature detection** (optional chaining) — exact pattern-ul deja existent în `scroll-journey.tsx`, mutat acum în `lib/capability.ts`.

---

## 10. Motion și controale

Videoul are > 5s ⇒ control Pause/Play obligatoriu (WCAG 2.2 SC 2.2.2):

- vizibil; ≥ 44×44; `aria-pressed`; etichetă din copy; nu doar la hover; persistă pe durata sesiunii; **oprește efectiv redarea** (nu doar UI-ul).

`prefers-reduced-motion: reduce`:

- autoplay **gate-uit în JS** (regula globală CSS din `app/globals.css` reduce animațiile/tranzițiile, dar **NU** oprește `<video>`); mirror pe pattern-ul din `scroll-journey.tsx`;
- posterul rămâne imaginea principală; fără scroll-hint animat (smooth-scroll e deja dezactivat global la reduced-motion); fără parallax.

---

## 11. Overlay și contrast

Folosește scrim-ul **bazat pe `ink`** deja folosit în site (consistență cu `scroll-journey.tsx` / Portfolio):

- mobil: gradient vertical `from-ink/85`; desktop: gradient orizontal `lg:to-ink/80`; ușoară reducere de luminozitate; fără blur greu.
- `object-position` configurabil per breakpoint (default desktop `50% 50%`, mobil `~58% 50%`), păstrând detaliul de meșteșug în cadru pe portrait.

Gate măsurabil de contrast:

- text normal ≥ 4.5:1, text mare ≥ 3:1, calculat față de **cea mai luminoasă regiune** sub fiecare bounding box de text/CTA, pe cadre eșantionate (primul/mijloc/ultimul + cadrele luminoase de marmură);
- dacă un eșantion pică → crește opacitatea scrim-ului sau pune o plăcuță solidă sub text;
- artefact de QA: screenshot-uri de contrast la Gate B / §20 (axe + audit manual, `21` CI/QA).

---

## 12. Performance budgets

Ținte: LCP ≤ 2.5s (din poster), INP ≤ 200ms, CLS ≤ 0.1.

| Asset | Țintă |
|---|---:|
| Poster desktop WebP | ≤ 300 KB |
| Poster mobil WebP | ≤ 220 KB |
| Video desktop | ≤ ~6–8 MB (legat de `durationSeconds` + bitrate țintă) |
| Video mobil | ≤ ~2–3 MB |
| JS suplimentar hero (island) | ≤ 15 KB gzip (include importul `lib/analytics.ts`) |

- leagă greutatea de `durationSeconds` (ex. ~12–14s) cu bitrate țintă; pe `saveData`/2g **fără** descărcare autoplay (tier D);
- aceste valori devin **CI budgets** (`21` CI/QA: bundle analysis + image size checks).
- dacă videoul depășește bugetul: reduce bitrate → scurtează loop-ul → elimină cadre repetitive → reduce rezoluția efectivă; **nu** compensa cu loader.

---

## 13. Accesibilitate (WCAG 2.2 AA)

- `<h1>` + copy în HTML; video **decorativ** (`aria-hidden="true"`, `tabIndex={-1}`);
- **Captions/transcript: nu se aplică** — videoul este pur decorativ, **fără sunet** și **fără text informativ baked** (regula „fără text baked"). Toată informația e în HTML. *Guard:* dacă media viitoare capătă narațiune sau text baked (P2 „video real al echipei"), captions/transcript devin **obligatorii** (`21` linia „captions/transcript pentru video relevant");
- Pause/Play accesibil (vezi §10); focus vizibil; **ordinea DOM = ordinea focus** (header → CTA principal → CTA secundar → Pause/Play → restul), fără `tabindex` pozitiv, fără reordonare CSS care desincronizează (WCAG 2.4.3);
- `ScrollHint` = fie link real focusabil (etichetat din `scrollHint`) către `#servicii`, fie `aria-hidden` decorativ;
- touch targets ≥ 44px; zoom 200%; fără autoplay audio; fără flash/strobe;
- `lang` corect per locale.

---

## 14. SEO

- copy hero **server-rendered**; **un singur `<h1>`** (cel din `CinematicHero`); după înlocuirea hero-ului HTML actual, verifică să nu rămână H1 duplicat sau pagină fără H1; secțiunile rămân `h2` (ex. `journey-static-title`); ordine header → h1 → h2;
- tot copy-ul comercial/keyword = **text DOM real** (nu baked în video, nu doar în poster); videoul `aria-hidden`, fără conținut indexabil;
- **canonical self-referențial** + **hreflang reciproc ro/ru** prin `metadata.alternates`; alternatele RU se emit **doar** când RU e în `publishedLocales` (nu promova o pagină RU inexistentă) (`18`);
- **indexare:** prototip = `noindex` global (`app/layout.tsx`); **producția homepage = indexabilă** (`CLAUDE.md`: fără `noindex` pe paginile publice de producție); Preview = `noindex` + deployment protection (`22`);
- `VideoObject` **doar** când: videoul e public pe URL stabil, thumbnail public stabil, `name`/`description` factuale **fără** identitatea proprietății, pagina conține vizibil videoul → **amânat la P2**;
- poster cu nume descriptiv pe serviciu, fără keyword stuffing, fără identificator de proprietate.

---

## 15. Analytics (reconciliat cu taxonomia reală)

Toate prin `track()` din `lib/analytics.ts`, **fără PII** (`ADR-013`: fără nume, telefon, email, adresă, mesaj, URL de fișier privat — și fără filename/path de proveniență). Chei **snake_case** (consistent cu `scroll-journey.tsx`).

- **CTA-uri hero → reutilizează `cta_click`** (nu evenimente custom):
  `track('cta_click', { placement: 'hero', action: 'estimate', locale, page_type: 'home' })` (primar) și `{ placement: 'hero', action: 'projects', … }` (secundar).
- **Ciclul de viață video** (prin același `track()`):
  `hero_view` (impression, once) · `hero_video_play` · `hero_video_autoplay_blocked` · `hero_video_pause` · `hero_video_resume` · `hero_scroll_past` (once).
- Parametri comuni: `locale`, `device_tier`, `reduced_motion`, `save_data`, `page_type:'home'`. `locale` se pasează ca **prop** din Server Component în client island (nu există context i18n client).
- **Consimțământ:** analytics hero sunt **neesențiale** → trec prin același dispatch gate-uit pe consimțământ (`20` §Consent); `track()` e no-op până există GA4/dataLayer.
- Adaugă aceste evenimente noi în tabelul de taxonomie din `docs/specs/20-ANALYTICS-KPI-CRO.md` (să fie „documented & validated in Preview").

---

## 16. Rights Gate (normativ — enforcement server-side)

> Regula CSS/JS de ascundere (ex. toggle-ul `[data-journey]`) **NU** este un control de securitate. Un video neautorizat tot poate fi descărcat dintr-un URL public prezent în sursă.

**MUST:**

1. Evaluarea drepturilor rulează **pe server** (Server Component / modul server), **înainte** de a emite vreun URL.
2. Dacă `rightsStatus === "MOODBOARD_ONLY"` **SAU** `publicationAllowed !== true` → serverul emite **zero** referințe la videoul/posterul gate-uit (fără `<source>`, fără `<video>`, fără preload, fără `data-attr`) și pune **fallback-ul aprobat**.
3. Către client island se trimite **doar** un DTO sanitizat: URL-uri publice deja aprobate (poster + mp4) + stringul de disclosure. **Niciodată** `rightsStatus`, URL-uri sursă interne sau identificatori de proprietar în bundle-ul client.
4. **Media negublicată NU stă în `public/`** (world-readable, crawlable indiferent de UI). Se stochează în namespace privat/draft cu acces server-mediat, semnat, expirabil (`16`: „nu se bazează autorizarea pe obscuritatea pathname-ului"). În P0, până la livrare: `publicationAllowed=false` + fallback local aprobat.
5. **Strip metadata** EXIF/GPS/XMP din poster **și** metadata de container din `.mp4`; verifică să nu existe nume/adresă/geolocație de proprietate. **Condiție de gate, nu opțional** (`CLAUDE.md`, `16`).

**Truth table `rightsStatus`:**

| rightsStatus | Poate publica? | Disclosure obligatoriu | Poate apărea lângă „proiect realizat"? |
|---|---|---|---|
| `OWNED` (proiect real documentat) | da | nu | da |
| `LICENSED` | da (dacă `publicationAllowed`) | **da** (`Vizual demonstrativ`) | nu |
| `ORIGINAL_GENERATED` | da (dacă `publicationAllowed`) | **da** (`Concept vizual`) | nu |
| `MOODBOARD_ONLY` | **niciodată** (indiferent de `publicationAllowed`) | n/a | nu |

- `disclosure` este **derivat din `rightsStatus`** (nu „free-typed"); când e cerut, respectă același contrast WCAG ca textul hero (§11), nu doar „discret";
- copy-ul care revendică autoratul companiei este permis **doar** dacă `rightsStatus === "OWNED"` cu referință de proiect documentată.

**Teste de regresie (obligatorii — §20):** (1) render production cu `publicationAllowed:false` ⇒ doar fallback, **niciun** URL gate-uit în HTML/bundle; (2) `MOODBOARD_ONLY` nu randează niciodată video; (3) disclosure prezent + conform contrast când `rightsStatus != OWNED`; (4) payload analytics fără nume/adresă/email/telefon/URL privat/filename de proveniență; (5) scan automat confirmă **fără** GPS/EXIF în poster/video livrat.

---

## 17. Fallback editorial

Fallback-ul nu arată ca o eroare. Conține: poster premium responsive (local, aprobat) · eyebrow · headline · descriere · CTA principal · CTA secundar · disclosure (dacă e cazul) · crop validat separat pe mobil/desktop.

---

## 18. Impact asupra codului existent (fișiere reale)

- `components/public/home-sections.tsx` — `HomeSections()` randează **întâi** `<CinematicHero/>`; **se elimină** hero-ul HTML actual (`Hero()`, grid split cu imagine Unsplash remote `priority`). Beneficiu: dispare o dependență LCP remote (Unsplash) — bine pentru performanță și pentru anti-pattern-ul `06` „fără stock generic". `<Journey/>` se **mută mai jos** (sub Servicii/Flagship), nu lângă hero.
- `components/public/site-header.tsx` — adaugă starea transparent→solid (vezi §4).
- `lib/content.ts` — sursă pentru `heroCopy` (sau `lib/hero.ts`); reutilizează `CONFIRM`/`ConfirmFlag`.
- `lib/journey.ts`, `components/public/journey/*`, `public/sequences/baie/*` — **rămân**, dar secțiunea e demotată; tier-ul scrub rămâne valid sub fold.
- `app/globals.css` — bloc nou `@layer utilities` pentru full-bleed/scrim/object-position.
- `next.config.mjs` — neschimbat pentru P0 local; la Blob (P1) se adaugă host-ul în `remotePatterns`.
- **Nou:** `components/public/hero/cinematic-hero.tsx`, `components/public/hero/cinematic-hero-controls.tsx`, `lib/hero.ts`, `lib/capability.ts`.
- `public/media/hero/` — **gol azi**; asseturi furnizate separat.

---

## 19. ADR necesar

Acest hero **deviază de la decizii aprobate**, deci necesită ADR nou (`CLAUDE.md`: orice abatere de la decizii blocate cere ADR):

- **ADR-014 — „Hero P0 = video muted full-window; image-sequence/Journey demotat":** problemă, alternative, impact SEO/performance/security, criteriu măsurabil de succes (ex. LCP ≤ 2.5s din poster, INP ≤ 200ms, conversie hero CTA). Suprascrie recomandarea „Varianta B P0" din `08`.
- **Notă de deviere `ADR-004`/`16`:** media locală în `public/media/hero/` doar pentru P0, cu pașii de migrare la Vercel Blob (host în `remotePatterns`, `MediaAsset` metadata, EXIF strip, namespace privat pentru draft).

---

## 20. Testing / QA

- Browsere: Chrome, Edge, Firefox, **Safari macOS**, **Safari iOS**, Chrome Android;
- Lățimi: 360/390/414/430 · 768/1024/1280/1440/1920; portrait/landscape;
- Stări: autoplay blocat · video 404 · poster 404 · slow 4G · save-data · reduced-motion · tab background/foreground · offscreen/on-screen · keyboard-only · screen-reader smoke · zoom 200% · header transparent→solid · **fără CLS** · CTA above fold · loop fără flash negru;
- **Rights gate:** cele 5 teste din §16;
- Gate-uri obligatorii de proiect: `npm run lint`, `npm run typecheck`, teste, `npm run build` — toate verzi.

---

## 21. Criterii de acceptare

- Hero-ul e primul element vizual major; ocupă tot viewportul fără benzi; desktop/mobil cu asseturi separate.
- Copy + CTA vizibile înainte de video; **posterul e LCP**, nu videoul; fără CLS.
- Autoplay muted + `playsInline` + loop; control Pause/Play funcțional; reduced-motion ⇒ poster static; save-data ⇒ fără video greu.
- Header cu contrast AA în ambele stări; fără text baked; **fără referințe la o proprietate/Airbnb** în nicio suprafață publică.
- **Rights gate enforce-uit server-side**; assetul gate-uit absent din HTML/bundle când nu e aprobat; disclosure derivat din `rightsStatus`.
- Un singur `<h1>`; canonical + hreflang corecte; prototip `noindex`.
- Analytics reconciliat (`cta_click` + `hero_*`), fără PII, gate-uit pe consimțământ.
- `lint` / `typecheck` / teste / `build` verzi. **Fără push / publicare fără aprobare explicită.**

---

## 22. Faze

- **P0 (acum):** hero full-window; desktop+mobile MP4 (furnizate de owner); postere locale; overlay; copy RO (RU CONFIRM_OWNER); 2 CTA; Pause/Play; capability tiers (detector partajat); rights gate server-side; analytics; testing; Journey demotat.
- **P1:** CMS pentru media/copy; Vercel Blob (+ `MediaAsset`); A/B pe headline; variante de poster; control editorial pentru disclosure; rute reale `/contact` `/proiecte` + estimator (`12`) pentru `service-preselect`.
- **P2:** video real al echipei/proiectelor (+ captions dacă apare narațiune); case study conectat; `VideoObject`; variante de campanie.

---

## Anexa A — Config exemplu (`lib/hero.ts`)

```ts
import { CONFIRM } from "@/lib/content";

export const cinematicHero = {
  media: {
    desktopMp4: "/media/hero/hero-finisaje-premium-desktop.mp4",
    mobileMp4: "/media/hero/hero-finisaje-premium-mobile.mp4",
    desktopPoster: "/media/hero/hero-finisaje-premium-desktop-poster.webp",
    mobilePoster: "/media/hero/hero-finisaje-premium-mobile-poster.webp",
    durationSeconds: 14,
    rightsStatus: "LICENSED",
    publicationAllowed: false, // rămâne false până la aprobare + rights manifest verificat
    // disclosure derivat din rightsStatus pe server (vezi §16), nu setat manual aici
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "58% 50%",
  },
  cta: {
    primary: { href: "#contact" },   // anchor existent (nu /contact — ruta nu există încă)
    secondary: { href: "#proiecte" },
  },
  fallbackPoster: "/media/hero/hero-finisaje-premium-desktop-poster.webp", // trebuie să fie un asset LOCAL real
} as const;
```

## Anexa B — Master prompt pentru Claude Code

```md
Lucrează în Plan Mode înainte de implementare. Nu genera video (este furnizat separat).

## Documente autoritare (citește integral)
- 29-SCROLL-CINEMATIC-EXPERIENCE-REVISED-FULL-WINDOW-VIDEO.md (acest document)
- CLAUDE.md
- docs/specs/05-ARCHITECTURE-DECISION-RECORDS.md
- docs/specs/06-FRONTEND-CREATIVE-DIRECTION.md
- docs/specs/08-MOTION-IMMERSIVE-EXPERIENCE.md
- docs/specs/09-PUBLIC-WEBSITE-MODULE.md
- docs/specs/16-MEDIA-VERCEL-BLOB.md
- docs/specs/17-AUTH-SECURITY-PRIVACY.md
- docs/specs/18-SEO-LOCAL-SEO-SEMANTIC.md
- docs/specs/19-CONTENT-I18N-EDITORIAL.md
- docs/specs/20-ANALYTICS-KPI-CRO.md
- docs/specs/21-PERFORMANCE-ACCESSIBILITY.md
- docs/specs/22-DEPLOYMENT-VERCEL-OPERATIONS.md

## Plan obligatoriu (înainte de cod)
1. inspectează components/public/home-sections.tsx (Hero + Journey), site-header.tsx, journey/*, lib/i18n.ts, lib/analytics.ts, lib/content.ts, app/(public)/[locale]/*, app/globals.css, next.config.mjs;
2. confirmă: nu există sistem i18n de mesaje; copy-ul stă tipizat în lib/; RU = ComingSoon (publishedLocales=['ro']);
3. confirmă coliziunea cu Journey și aplică decizia din §1.2 (hero video sus, Journey demotat);
4. prezintă lista fișierelor modificate + riscurile LCP/contrast/autoplay/mobile-crop/rights-gate.

## Cerințe (rezumat — detalii în corpul documentului)
- componente: components/public/hero/cinematic-hero.tsx (server) + cinematic-hero-controls.tsx (client island);
- config/tipuri în lib/hero.ts; detector partajat în lib/capability.ts (refactor din scroll-journey.tsx);
- Tailwind + @layer utilities în app/globals.css; FĂRĂ CSS Modules; FĂRĂ canvas/image-sequence/GSAP pentru hero;
- LCP = poster eager (next/image priority + fetchpriority), NU <video poster>; video preload=metadata, fără poster concurent;
- selectare sursă single client-side (matchMedia), nu <source media>;
- header transparent→solid (IO pe hero, contrast AA în ambele stări, prefers-reduced-transparency=solid);
- autoplay muted/loop/playsInline; gate JS pentru reduced-motion/save-data; Pause/Play accesibil (aria-pressed, ≥44px, i18n);
- rights gate SERVER-SIDE (vezi §16): assetul gate-uit absent din HTML/bundle când publicationAllowed!==true sau MOODBOARD_ONLY; DTO sanitizat la client; media negublicată NU în public/; strip EXIF/GPS; disclosure derivat din rightsStatus;
- copy din lib/ (RO; RU CONFIRM_OWNER, neimplementat în P0); fără prețuri/cifre neconfirmate în hero;
- analytics prin lib/analytics.ts: cta_click {placement:'hero',action,locale,page_type:'home'} + hero_view/hero_video_*; snake_case; consimțământ; fără PII;
- SEO: un singur <h1>, canonical+hreflang (RU doar dacă published), fără VideoObject în P0, fără identitate de proprietate nicăieri;
- CTA-uri: #contact / #proiecte (rutele dedicate + service-preselect = P1).

## ADR
Propune ADR-014 (hero video P0; Journey demotat) și nota de deviere ADR-004/16 (media locală P0 → Blob).

## Testare
Rulează lint, typecheck, teste, build; plus matricea §20 și cele 5 teste de rights gate (§16).

## Raport final
fișiere modificate · decizii de arhitectură · dimensiuni/codec assets · comportament desktop/mobil & tiers · status rights gate · rezultate lint/typecheck/test/build · limitări. NU face push și NU publica fără aprobare explicită.
```

## Anexa C — Note rapide de implementare

- Un singur `<video>`, sursă aleasă client-side (`matchMedia`); listeners pasivi; pauză pe `visibilitychange` și offscreen (IO).
- Poster = `next/image` `priority` + `fetchpriority="high"`; `<video>` fără poster concurent, `preload="metadata"`.
- Detector tier în `lib/capability.ts`: `matchMedia('(prefers-reduced-motion: reduce)')`, `navigator.connection?.saveData`, `navigator.deviceMemory`, `pointer: coarse` — totul cu optional chaining.
- Header: `IntersectionObserver` pe hero pentru starea transparent→solid; contrast verificat în ambele stări.
- Rights gate: decizie pe server; trimite doar DTO public la client; test că URL-ul gate-uit lipsește din HTML în production.
```
