# Motion & Immersive Experience

## Decizie pentru lansare

**Varianta B — image sequence / parallax cinematic bazat pe proiecte reale** este recomandarea P0/P1. Oferă diferențiere puternică, control mai bun al performanței și fallback simplu. Video cinematic poate fi folosit punctual. Scena 3D completă rămâne P2 după validarea traficului, a media și a bugetului.

## Principiu

Conținutul, headline-ul și CTA-ul apar înainte ca experiența imersivă să fie gata. Motion-ul îmbunătățește înțelegerea lucrării; nu este critical rendering path.

## Capability tiers

| Tier | Condiție | Experiență |
|---|---|---|
| A | desktop performant, conexiune bună | sequence completă, parallax, hotspot-uri limitate |
| B | laptop modest | cadre reduse, fără blur/efecte grele |
| C | mobil | video/image transition simplificat |
| D | reduced motion / save-data / conexiune lentă | poster static premium și CTA imediat |
| E | eroare media | fallback static complet funcțional |

## Motion budget

- animațiile nu blochează input-ul;
- maximum un moment motion dominant per viewport;
- fără multiple librării pentru aceeași problemă;
- GSAP/ScrollTrigger pentru secvențe controlate; CSS pentru microinteracțiuni;
- Motion doar unde simplifică stările UI și nu dublează GSAP.

## Hero sequence contract

- poster LCP optimizat;
- HTML semantic deasupra/în paralel cu media;
- preloading numai pentru cadrele inițiale necesare;
- restul încărcat după idle sau interacțiune;
- canvas/sequence suspendat în afara viewport-ului;
- scroll-ul nativ nu este capturat;
- progresul nu depinde de frame-perfect delivery.

## Before/after

- control cu pointer, tastatură și butoane;
- labels „Înainte” și „După” mereu vizibile;
- alternative side-by-side pentru reduced motion și screen readers;
- imaginile comparate au crop și perspectivă compatibile.

## 3D P2 — condiții de intrare

3D se aprobă numai dacă:

- există model/scan real de calitate;
- pagina standard trece CWV fără 3D;
- există buget de producție și mentenanță;
- fallback-urile sunt proiectate înaintea scenei;
- testele pe device-uri low/mid sunt acceptabile.

Tehnic: glTF/GLB, Meshopt/Draco, texturi comprimate, draw calls limitate, adaptive DPR, dynamic import și suspendarea randării.

## Teste

- CPU throttling și network slow 4G;
- Safari iOS și Chrome Android;
- tab background/foreground;
- resize/orientation;
- reduced motion și save-data;
- media fail / timeout;
- verificarea INP în timpul scroll-ului și al CTA-urilor.
