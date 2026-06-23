# Performance & Accessibility

## Core Web Vitals targets

- LCP ≤ 2.5 s la p75;
- INP ≤ 200 ms;
- CLS ≤ 0.1.

Țintele se verifică în field data după lansare și în lab înainte de release.

## Performance budgets

| Template | JS client inițial | Media above fold | Principiu |
|---|---:|---:|---|
| homepage standard | minim, justificat | un poster LCP optimizat | cinematic lazy |
| homepage immersive | încărcare după bază | cadre progresive | capability tiers |
| service page | foarte redus | o imagine principală | static/ISR |
| project page | gallery lazy | cover + thumbnails | media progressive |
| lead flow | doar UI necesar | fără media decorativă grea | INP prioritar |
| admin | mai mare acceptabil | funcțional | code splitting |

Valorile KB exacte se stabilesc după primul prototype și devin CI budgets.

## Performance controls

- Server Components implicit;
- dynamic import pentru galerie/motion/admin tools;
- `next/image` și dimensiuni explicite;
- font subset/preload controlat;
- third-party scripts după consent și interaction/idle;
- cache tags și ISR;
- suspendare canvas/sequence offscreen;
- query DB selectiv și paginat;
- upload direct către Blob.

## WCAG 2.2 AA

- semantic HTML și landmarks;
- heading hierarchy;
- skip link;
- keyboard navigation;
- focus visible;
- contrast;
- labels și instructions;
- error identification și recovery;
- 44×44 touch targets;
- reduced motion;
- captions/transcript pentru video relevant;
- control autoplay;
- alt text contextual;
- before/after și lightbox accesibile;
- language attributes per locale.

## Reduced motion

- poster/static layout în loc de sequence;
- tranziții simple fără parallax;
- niciun conținut sau CTA nu dispare;
- preferința este respectată fără toggle obligatoriu.

## Test matrix

- Chrome/Edge/Firefox desktop;
- Safari macOS;
- Safari iOS;
- Chrome Android;
- device mid-range și low-end simulation;
- 320px width, zoom 200%, text enlargement;
- slow 4G și CPU throttling;
- keyboard only și screen reader smoke tests.

## CI/QA

- Lighthouse pe template-uri reprezentative;
- axe automated + manual audit;
- bundle analysis;
- image size checks;
- no layout shift screenshots;
- real device QA înainte de production.

## Acceptance criteria

- fără probleme critice de accesibilitate;
- formular complet keyboard-only;
- motion fallback complet;
- LCP nu este canvas/video greu;
- no JS error în navigare normală;
- paginile standard respectă budgets aprobate.
