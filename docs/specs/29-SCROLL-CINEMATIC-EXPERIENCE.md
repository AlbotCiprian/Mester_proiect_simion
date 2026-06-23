# 29 — Scroll Cinematic „Parcursul Renovării" (Master Prompt)

> **Status:** Proposed — necesită aprobarea proprietarului (Gate B — UX readiness).
> **Tip:** modul de experiență + master prompt de implementare.
> **Autoritate:** se subordonează `05-ARCHITECTURE-DECISION-RECORDS.md`, `06-FRONTEND-CREATIVE-DIRECTION.md`,
> `08-MOTION-IMMERSIVE-EXPERIENCE.md`, `21-PERFORMANCE-ACCESSIBILITY.md`. Nu introduce ADR nou; rămâne în
> limitele Variantei B (image-sequence / parallax cinematic) deja aprobate în spec 08.
> **Limbă:** RO/RU per `ADR-011`. **Indexare:** conținutul trebuie să rămână crawlabil (vezi §10).

Acest document descrie experiența **scroll-driven cinematic** prin care vizitatorul „parcurge" un apartament,
cameră cu cameră, și vede cum se pregătește și se pune teracota/placarea, cu **preț și informații contextuale
ancorate fiecărei camere**. Este scris ca **master prompt**: poate fi predat direct lui Claude Code pentru
implementare (vezi Anexa B).

---

## 1. Concept și narațiune

**Nume de lucru:** „Parcursul Renovării" (RO) / „Путь ремонта" (RU).

Ideea: o singură poveste verticală, continuă, în care **scroll-ul este camera de filmat**. Pe măsură ce
utilizatorul derulează:

1. **Intrare / promisiune** — un cadru calm al spațiului gol, headline + CTA în HTML (instant).
2. **Camera 1 — Baia premium** — se vede pregătirea suportului → hidroizolație → trasare → montaj teracotă →
   rost finisat. La final, suprafața „prinde viață".
3. **Tranziție de cameră** — un plan de legătură (hol / cadru de trecere) mută privirea în camera următoare.
4. **Camera 2 — Bucătărie** — placare perete + pardoseală, alt ritm, alt material.
5. **Camera 3 — Living / hol** — teracotă/gresie de format mare, final de tip „totul placat".
6. **Final** — apartamentul finit + CTA puternic („Cere estimare pentru proiectul tău").

În fiecare cameră (capitol), pe lângă film, apare un **panou contextual** cu: serviciul aplicat, **prețul
orientativ „de la"**, materialele, durata estimată și o dovadă (before/after sau o metrică). Panoul este
ancorat (pinned) cât timp ești în acea cameră și dispare la tranziție.

> Diferențiatorul: nu e „un video mare", ci o **poveste segmentată pe camere**, fiecare cu propriul mesaj
> comercial. Combină emoția (cinematic) cu utilitatea (preț + serviciu exact acolo unde privești).

---

## 2. Principii de UX (obligatorii)

- **Content-first, nu motion-first.** Headline, sub-headline și CTA principal sunt în HTML și vizibile în
  primul viewport, înainte ca secvențele să fie gata (spec 08 §Principiu). Cinematicul este *enhancement*.
- **Mobile-first real.** Experiența se proiectează întâi pentru 360–414px portrait, apoi se îmbogățește pe
  desktop. Nu invers. Vezi §4.
- **Scroll nativ, niciodată „hijacked".** Nu blocăm/întârziem scroll-ul. Mapăm doar poziția de scroll la
  progresul secvenței. Fără „scroll jacking", fără capturarea wheel-ului (spec 06 anti-patterns).
- **Un singur moment dominant de motion per viewport** (spec 08 §Motion budget).
- **Fără autoplay cu sunet.** Sunet ambient doar opțional, oprit implicit, cu toggle accesibil.
- **Orice se poate citi fără animație.** Tot conținutul (text, preț, CTA, imagine reprezentativă) există
  semantic și funcționează cu JS dezactivat / reduced-motion / screen reader (vezi §9, §10).
- **Skip disponibil.** Link „Sari peste parcurs → vezi serviciile și prețurile" pentru utilizatorii grăbiți
  sau cei care folosesc tastatura.
- **Premium fără ostentație** (spec 06): lumină, crop, micro-translate; fără neon, glassmorphism, 3D decorativ,
  cursoare custom, loadere lungi.

---

## 3. Modelul de experiență

### 3.1 Structura în „capitole" (camere)

Fiecare cameră este un **capitol** = un container vertical înalt (scroll track) cu un strat **sticky** (pin)
care ține media + panoul contextual cât timp capitolul e activ.

```
[ Hero HTML instant ]
[ Capitol „Baie"      ] → track ~250–300vh, sticky stage 100vh
[ Tranziție           ] → track ~100vh (cross-fade / plan de legătură)
[ Capitol „Bucătărie" ]
[ Tranziție           ]
[ Capitol „Living"    ]
[ Final CTA HTML       ]
```

### 3.2 Mecanica de scroll → progres → cadru

- Pentru fiecare capitol calculăm `progress ∈ [0,1]` = cât de mult ai parcurs din track-ul capitolului.
- `progress` → `frameIndex = round(progress * (frameCount-1))` → desenăm cadrul pe `<canvas>` (vezi §6.3).
- Panoul contextual își animă starea pe **praguri de progres** (ex.: titlu la 0.05, preț la 0.25,
  before/after la 0.6, CTA la 0.85), folosind clamp + easing, nu „pop".
- Tranzițiile între camere = cross-fade între ultimul cadru al capitolului N și posterul capitolului N+1,
  plus un mic parallax pe text. Niciodată ecran negru lung.

### 3.3 Pricing și informație contextuală (per cameră)

În fiecare capitol, panoul (sticky, lateral pe desktop / jos pe mobil) afișează:

- **Serviciul** aplicat (link către pagina de serviciu).
- **Preț orientativ „de la X lei/m²"** — marcat `CONFIRM_OWNER`, cu unitate clară și „ce include" (spec 09
  §Prețuri, `ADR-012`: orientativ, nu ofertă). Disclaimer: „evaluarea finală depinde de suprafață și condiții".
- **Materiale / format** folosite în cadru.
- **Durată estimată** și **suprafață** (dacă sunt aprobate).
- **Dovadă:** un control before/after sau o metrică (spec 11).
- **CTA contextual:** „Cere estimare pentru baie" — pre-selectează serviciul/camera în formular (spec 12).

> Regulă: niciun preț, durată sau metrică nu se publică până nu e confirmat (Gate A). În prototip rămân
> placeholder vizibil marcate.

---

## 4. Strategia responsive (mobile-first ȘI desktop excelent)

Aceeași narațiune, două regii diferite. **Nu** scalăm pur și simplu desktopul pe mobil.

### 4.1 Mobile (portrait, 360–430px) — prioritar

- **Cadre în format portrait** (sau crop cu focal point) ca să umple ecranul fără benzi.
- **Panou contextual jos**, ca o „card sheet" semi-transparentă peste film, cu preț + CTA mereu la îndemână
  (one-hand reach). Maxim 3 acțiuni.
- **Mai puține cadre** per capitol (ex. 24–48) și rezoluție mai mică (lățime ~720–828px) → secvențe ușoare.
- **Tier-down automat:** pe device-uri slabe / `save-data` → în loc de scrubbing, un scurt **loop autoplay
  mut** la intrarea în viewport (IntersectionObserver) + panou static. Mai fluid decât scrubbing pe CPU slab.
- **Bară sticky de contact** (deja în site) rămâne accesibilă; nu se suprapune cu panoul capitolului.
- Touch: scroll natural; fără gesturi custom obligatorii.

### 4.2 Desktop (≥1024px)

- **Cadre landscape** la rezoluție mai mare (lățime ~1280–1920, în funcție de DPR, cu cap).
- **Split layout:** filmul ocupă o coloană mare; panoul contextual ancorat lateral (sticky), cu tipografie
  editorială generoasă (spec 06).
- **Parallax fin** pe text și pe un detaliu macro; **un minimap/floor-plan** discret (vezi §13) indică în ce
  cameră ești.
- Hover: lumină/crop subtil pe controale; nu pe film.

### 4.3 Tabletă

- Layout intermediar: panou jos sau lateral în funcție de orientare; set de cadre „mid".

### 4.4 Breakpoint-uri și „art direction"

- Folosim seturi de cadre diferite pe lățime (responsive sequences), nu un singur set scalat.
- `prefers-reduced-data`, `deviceMemory`, `hardwareConcurrency` și `connection.effectiveType` decid tier-ul.

---

## 5. Capability tiers și fallback (aliniat spec 08)

| Tier | Condiție | Experiență |
|---|---|---|
| A | desktop performant, conexiune bună | secvențe complete, parallax, minimap, before/after |
| B | laptop modest | cadre reduse, fără parallax greu |
| C | mobil | loop autoplay mut pe cameră, panou static + preț |
| D | reduced-motion / save-data / conexiune lentă | **galerie editorială statică**: 1 poster premium per cameră + text + preț + CTA |
| E | eroare media / JS off | conținut semantic complet (HTML): imagini `next/image`, prețuri, CTA, linkuri |

Fallback-ul D **nu** este o versiune „stricată": este o experiență editorială intenționată (imagini mari,
spațiu negativ, before/after side-by-side). E ce vede și un crawler și un screen reader.

---

## 6. Arhitectură tehnică

### 6.1 Stack

- Next.js App Router, TypeScript strict (existent).
- **Engine de scroll:** se recomandă **GSAP + ScrollTrigger** pentru pin + scrub robust cross-browser
  (permis explicit în spec 08 §Motion budget pentru „secvențe controlate"), cu guard pe `prefers-reduced-motion`.
  Alternativă fără dependențe: `IntersectionObserver` + `position: sticky` + handler `scroll` pasiv + `rAF`.
  *Decizie recomandată:* GSAP ScrollTrigger pentru fiabilitate; o singură bibliotecă de motion (nu dublăm).
- **Randare film:** `<canvas>` 2D cu **image-sequence** (vezi §6.3). NU scrubbing pe `<video>.currentTime`
  (jank pe iOS Safari, seeking neuniform). Video rămâne doar pentru tier C (loop autoplay) și ca sursă din
  care extragem cadrele.
- Componente client izolate (`"use client"`), încărcate cu `dynamic(() => ..., { ssr: false })` și suspendate
  offscreen (spec 21 §Performance controls).

### 6.2 Contract de date (un capitol)

Conținutul vine din stratul de content (acum placeholder, ulterior din CMS/Neon — spec 13/15).

```ts
interface JourneyChapter {
  id: string;                 // "baie", "bucatarie", "living"
  room: string;              // eticheta camerei (RO/RU)
  title: string;             // titlu narativ
  step: string;              // ex. "Pregătire → hidroizolație → montaj → rost"
  sequence: {
    frameCount: number;
    // seturi responsive de cadre, generate din video (vezi §7)
    sources: { maxWidth: number; dir: string; ext: "avif" | "webp" }[];
    posterSrc: string;        // primul cadru, optimizat (LCP-safe dacă e above the fold)
    videoLoopSrc?: string;    // pentru tier C (autoplay mut, scurt)
  };
  serviceSlug: string;        // link spre /servicii/{slug}
  price: {                    // CONFIRM_OWNER
    from: number | null;
    unit: "lei/m²" | "lei/proiect" | null;
    includes: string[];
    factors: string[];
    confirm: "CONFIRM_OWNER";
  };
  proof?: { beforeSrc: string; afterSrc: string; alt: string };
  metrics?: { value: string; label: string; confirm: "CONFIRM_OWNER" }[];
  cta: { label: string; servicePreselect: string };
  reveal: { titleAt: number; priceAt: number; proofAt: number; ctaAt: number }; // praguri 0..1
}
```

### 6.3 Image-sequence pe canvas (nucleul tehnic)

1. La intrarea capitolului în viewport (IO, `rootMargin` generos), **preîncarcă** cadrele setului potrivit de
   lățime; folosește `img.decode()` pentru a evita decode-jank.
2. Pe scroll: într-un singur `rAF`, calculează `targetFrame` și **interpolează** (lerp) frame-ul curent spre
   target → senzație fluidă chiar dacă cadrele „sar".
3. Desenează pe `<canvas>` cu `object-fit: cover` logic (calcul manual al dreptunghiului sursă/destinație),
   `devicePixelRatio` cu **cap la 2** pentru memorie.
4. **Memory management:** ține în memorie doar cadrele capitolului activ ± 1; eliberează (`img.src=""`,
   drop referințe) capitolele depărtate. Cap total de memorie pe mobil.
5. Suspendă `rAF` când capitolul e offscreen sau tabul e în background (`visibilitychange`).

### 6.4 Încărcare progresivă

- Posterul fiecărei camere se încarcă primul (mic, AVIF/WebP).
- Cadrele intermediare se încarcă în fundal după `requestIdleCallback` / la apropierea de capitol.
- Cadrele „cheie" (start/mijloc/final) au prioritate ca să existe ceva de desenat imediat.

---

## 7. Pipeline de assets (open-source acum → real la producție)

### 7.1 Principiu de conținut

- **Producție:** conform spec 06, toate cadrele trebuie să fie **reale** (lucrările echipei). Se filmează
  walkthrough-uri per camera (wide → medium → detail) și before/after cu poziții comparabile. → `CONFIRM_OWNER`.
- **Prototip (acum):** folosim **video open-source** (Mixkit/Pexels/Coverr — licențe libere, fără watermark)
  ca stand-in, marcat clar ca demonstrativ. Nu folosim media de la concurenți (CLAUDE.md).
- **NU** folosim cadre generate AI pentru producție (contrazice principiul „cadre reale"); doar, eventual,
  pentru moodboard intern.

### 7.2 De la video la secvență de cadre (cu `ffmpeg`)

`ffmpeg` nu este instalat global → folosește binarul din `ffmpeg-static` (devDependency) sau instalează-l.
Exemple (de adaptat per clip):

```bash
# 1) Extrage cadre la ~12 fps, lățime 1280 (desktop), format webp de calitate
ffmpeg -i lucrare-baie.mp4 -vf "fps=12,scale=1280:-2" -qscale:v 6 \
  public/sequences/baie/1280/frame-%04d.webp

# 2) Set mobil portrait: crop centrat 9:16 + scale 828
ffmpeg -i lucrare-baie.mp4 -vf "fps=12,crop=ih*9/16:ih,scale=828:-2" \
  public/sequences/baie/828/frame-%04d.webp

# 3) Poster (primul cadru) + loop scurt mut pentru tier C
ffmpeg -i lucrare-baie.mp4 -vframes 1 public/sequences/baie/poster.webp
ffmpeg -i lucrare-baie.mp4 -t 6 -an -movflags +faststart -vf "scale=720:-2" \
  public/sequences/baie/loop.mp4
```

### 7.3 Structură de foldere

```
public/sequences/
  baie/      { poster.webp, loop.mp4, 828/frame-*.webp, 1280/frame-*.webp }
  bucatarie/ { ... }
  living/    { ... }
```

### 7.4 Buget de greutate (țintă)

- Per cameră: **24–60 cadre**; AVIF/WebP; țintă < ~1.2–1.8 MB/cameră pe mobil, < ~3–4 MB pe desktop.
- Total experiență încărcată progresiv; **nimic** din asta nu intră în LCP (LCP = poster/HTML).
- Numerele KB exacte devin **CI budgets** după primul prototip (spec 21 §Performance budgets).

---

## 8. Buget de performanță și ținte

- **CWV (spec 21):** LCP ≤ 2.5s (din poster/HTML, nu din canvas/secvență), INP ≤ 200ms, CLS ≤ 0.1.
- Canvas/secvențele se încarcă **după** conținutul de bază; offscreen suspendat.
- `next/image` cu dimensiuni explicite pentru toate imaginile statice; rezervăm spațiul (fără CLS).
- Fonturi subset/preload (deja configurat).
- Verificare: Lighthouse + field data; secvențele nu degradează INP în timpul scroll-ului (test cu CPU throttle).

---

## 9. Accesibilitate (WCAG 2.2 AA)

- **Echivalent non-animat complet** (tier D/E): fiecare cameră = `<section>` cu heading, text, preț, imagine,
  before/after side-by-side, CTA — totul în DOM, citibil cu screen reader.
- `canvas` este `aria-hidden="true"` (decorativ); informația reală e în HTML alături.
- `prefers-reduced-motion: reduce` → fără scrub/parallax; afișăm galeria statică.
- **Skip link** „Sari peste parcurs" la începutul experienței.
- Focus order logic; tot conținutul accesibil prin scroll/tastatură; niciun conținut „prins" în canvas.
- before/after: control cu pointer + tastatură + butoane, etichete „Înainte/După" vizibile (spec 08).
- Touch targets ≥ 44×44; contrast AA pe panouri (text peste film → folosim plăci/scrim, nu text direct pe foto).
- Sunet (dacă există) implicit oprit, cu control; fără autoplay audio.
- `lang` corect per locale.

---

## 10. SEO

- Experiența este **enhancement**: conținutul real (camere, servicii, prețuri, proiect) există în HTML
  server-rendered și este **crawlabil**; nimic comercial nu trăiește doar în canvas/JS.
- Headings semantice per cameră; linkuri interne reale către `/servicii/{slug}` și `/proiecte/{slug}`.
- Structured data: `HomeAndConstructionBusiness` + eventual `Service`/`Offer` doar cu date reale (fără prețuri
  inventate). Imagini cu `alt` contextual.
- Preview/prototip rămâne `noindex` până la Gate A (spec 18/22).

---

## 11. Analytics și CRO (spec 20)

Evenimente (fără PII, `ADR-013`):

- `journey_start` { device_tier, locale }
- `journey_chapter_view` { chapter_id, service_id }
- `journey_price_view` { chapter_id, service_id }
- `journey_beforeafter_interact` { chapter_id }
- `cta_click` { placement: "journey_{chapter}", action, locale, page_type }
- `journey_complete` { chapters_viewed, reached_end: bool }
- `journey_skip` { from_chapter }

CRO: testăm ordinea camerelor, momentul de apariție a prețului, varianta CTA „estimare" vs „trimite poze".

---

## 12. Reguli pentru pricing contextual

- Toate prețurile = `CONFIRM_OWNER` până la confirmare; afișate ca „de la … / orientativ", cu unitate și
  „ce include", plus disclaimer și **data actualizării** (spec 09).
- Estimatorul/prețurile nu sunt ofertă contractuală (`ADR-012`).
- Dacă proprietarul nu confirmă un preț pentru o cameră → afișăm „Estimare la cerere", nu o cifră inventată.

---

## 13. Idei senior suplimentare (recomandate)

1. **Minimap / floor-plan wayfinding** (desktop): un mic plan al apartamentului în colț; camera activă se
   evidențiază pe măsură ce scrollezi. Premium și orientează utilizatorul.
2. **„Cost meter" per cameră:** o bară discretă care se „umple" cu intervalul orientativ pe măsură ce camera
   se finalizează — leagă emoția de buget.
3. **Before/after integrat în scroll:** în interiorul camerei, un segment în care derularea face „wipe" de la
   starea inițială la cea finită (nu doar slider manual).
4. **Macro-detalii de precizie între camere:** plan apropiat pe rost/nivel laser → reîntărește mesajul de
   calitate (spec 06 „Precision proof").
5. **CTA persistent care se adaptează:** „Cere estimare pentru {cameră}" pre-selectează camera/serviciul în
   formular (leagă experiența de conversie — spec 12).
6. **Toggle sunet ambient** (off implicit): șantier discret/ambient, pentru imersiune opțională.
7. **„Skip the journey"** + un rezumat-listă al camerelor cu prețuri (pentru cei pragmatici și pentru SEO).
8. **Theming subtil per cameră:** mică deplasare de paletă (mai cald în living, mai rece în baie) păstrând
   sistemul de tokens.
9. **Save & share:** la final, „Trimite-mi parcursul pe WhatsApp/Telegram" (P2).
10. **Reduced-motion ca experiență premium**, nu ca degradare (galerie editorială cu spațiu negativ).

---

## 14. Integrare cu restul site-ului

Experiența NU este tot site-ul; este o piesă de impact pe **homepage** (sau o pagină dedicată
`/{locale}/parcurs`), între hero-ul HTML și restul narațiunii. Restul site-ului (deja specificat) rămâne:

- **Homepage** (spec 09): hero → trust → servicii → *parcursul cinematic* → proiect flagship → proces →
  estimator → portofoliu → recenzii → FAQ → CTA.
- **Servicii & pagini locale** (spec 10), **Portofoliu/Case studies** (spec 11), **Estimator/Lead** (spec 12),
  **Admin/CMS** (spec 13), **CRM** (spec 14), **Date/Neon** (spec 15), **Media/Blob** (spec 16),
  **Auth/Security** (spec 17), **SEO** (spec 18), **i18n** (spec 19), **Analytics** (spec 20),
  **Performanță/A11y** (spec 21), **Deploy** (spec 22), **Testing** (spec 23).
- Camerele din parcurs **link-uiesc** către paginile de serviciu și proiect reale; prețurile contextuale
  reflectă aceeași sursă de adevăr ca pagina „Prețuri".

---

## 15. Faze de implementare

- **P0 (prototip, acum):** o pagină/secțiune cu **1 cameră** (Baia) funcțională end-to-end pe video
  open-source: poster instant → image-sequence pe canvas (desktop) + loop pe mobil → panou contextual cu preț
  placeholder → fallback reduced-motion. Build verde, noindex.
- **P1:** 3 camere + tranziții + minimap + before/after + analytics + seturi responsive complete.
- **P2:** footage real al echipei, optimizări de memorie avansate, save/share, eventual sunet ambient.

---

## 16. Criterii de acceptare

- Headline + CTA vizibile instant, înainte de orice secvență; LCP nu provine din canvas/video.
- Scroll nativ, fără jank perceptibil la CPU throttling 4x; INP ≤ 200ms în timpul scroll-ului.
- Tier-uri A–E funcționale; `prefers-reduced-motion` și `save-data` respectate automat.
- Tot conținutul (camere, prețuri, CTA) citibil cu JS off / screen reader; skip link funcțional.
- Fără CLS din film/poster; fără autoplay cu sunet.
- Niciun preț/metrică neconfirmat publicat ca real (toate `CONFIRM_OWNER` în prototip).
- Greutatea per cameră în bugetul agreat; offscreen suspendat; memoria nu crește nelimitat la scroll lung.
- Mobile UX: preț + CTA la îndemână cu o mână; nu se suprapun cu bara sticky.

## 17. Matrice QA

Chrome/Edge/Firefox desktop · Safari macOS · **Safari iOS** · Chrome Android · device low/mid · 360px &
zoom 200% · slow 4G + CPU 4x · reduced-motion + save-data · tab background/foreground · resize/orientation ·
media fail/timeout · keyboard-only + screen reader smoke.

## 18. Riscuri și mitigări

| Risc | Mitigare |
|---|---|
| Greutate mare (multe cadre) | seturi responsive, AVIF/WebP, lazy per capitol, bugete CI |
| iOS memory / seeking jank | image-sequence pe canvas (nu video.currentTime), cap DPR, eliberare cadre |
| Jank la scroll | rAF unic, lerp, listeners pasivi, suspendare offscreen |
| SEO ascuns în canvas | conținut real în HTML, canvas doar decorativ |
| Mentenanță cadre | structură clară de foldere + script de generare repetabil |
| Conținut neconfirmat | tot `CONFIRM_OWNER` până la Gate A; „estimare la cerere" ca fallback |

## 19. Întrebări deschise / CONFIRM_OWNER

- Câte camere și ce ordine? (recomandat 3: baie → bucătărie → living)
- Prețuri orientative reale per serviciu/cameră + unitate + „ce include".
- Există footage real al lucrărilor sau plan de producție video? (până atunci: open-source stand-in)
- Pagină dedicată `/parcurs` sau integrat în homepage?

---

## Anexa A — Exemplu de date (placeholder, prototip)

```ts
const baie: JourneyChapter = {
  id: "baie",
  room: "Baie",
  title: "Baie premium, placată la milimetru",
  step: "Pregătire → hidroizolație → trasare → montaj → rost",
  sequence: {
    frameCount: 48,
    sources: [
      { maxWidth: 640, dir: "/sequences/baie/828", ext: "webp" },
      { maxWidth: 4096, dir: "/sequences/baie/1280", ext: "webp" },
    ],
    posterSrc: "/sequences/baie/poster.webp",
    videoLoopSrc: "/sequences/baie/loop.mp4",
  },
  serviceSlug: "renovari-bai",
  price: { from: null, unit: "lei/m²", includes: ["hidroizolație", "montaj", "rost"], factors: ["suprafață", "format placă", "stare suport"], confirm: "CONFIRM_OWNER" },
  proof: { beforeSrc: "/sequences/baie/before.webp", afterSrc: "/sequences/baie/after.webp", alt: "Baie înainte și după (demonstrativ)" },
  metrics: [{ value: "—", label: "m² placați", confirm: "CONFIRM_OWNER" }],
  cta: { label: "Cere estimare pentru baie", servicePreselect: "renovari-bai" },
  reveal: { titleAt: 0.05, priceAt: 0.3, proofAt: 0.6, ctaAt: 0.85 },
};
```

## Anexa B — Master prompt pentru implementare (de predat lui Claude Code)

> Lucrează în Plan mode întâi. Implementează experiența „Parcursul Renovării" conform `29-SCROLL-CINEMATIC-
> EXPERIENCE.md`, respectând `06`, `08`, `21` și ADR-urile. Livrează **P0**: o singură cameră (Baia),
> mobile-first, cu:
> 1. hero HTML neschimbat (content-first); secțiunea de parcurs vine după.
> 2. componentă client `JourneyChapter` încărcată cu `dynamic(ssr:false)`, image-sequence pe `<canvas>`
>    condusă de scroll (GSAP ScrollTrigger sau IO+rAF+lerp), poster instant, suspendare offscreen.
> 3. panou contextual sticky cu serviciu + preț `CONFIRM_OWNER` + before/after + CTA contextual.
> 4. tier-uri: desktop = scrub; mobil slab/`save-data` = loop autoplay mut; `prefers-reduced-motion` = galerie
>    statică; JS off = HTML semantic complet.
> 5. assets din video open-source via `ffmpeg-static`, în `public/sequences/baie/` (vezi §7.2).
> 6. analytics events din §11; fără PII.
> Criterii: §16. QA: §17. Nu publica prețuri/metrice neconfirmate. Build verde, `noindex`. Commit + raport;
> push doar cu aprobare.

## Anexa C — Note de implementare rapide

- Listeners de scroll **pasivi**; calcul în `rAF`; un singur loop.
- `canvas` cu `devicePixelRatio` cap 2; recalcul la `resize`/`orientationchange` (debounced).
- Preîncărcare cu `img.decode()`; eliberare cadre offscreen.
- Detectare tier: `matchMedia('(prefers-reduced-motion: reduce)')`, `navigator.connection?.saveData`,
  `navigator.deviceMemory`, `navigator.hardwareConcurrency`.
- `dynamic(() => import(...), { ssr: false })` + `Suspense` cu posterul ca fallback.
