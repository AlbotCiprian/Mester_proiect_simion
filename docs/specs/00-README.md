# Pachet de specificații — Meșter Teracotă Moldova

## Scop

Acest director conține planul modular complet pentru proiectarea și implementarea platformei. Fișierele sunt concepute pentru a fi oferite lui Claude, astfel încât implementarea să rămână coerentă și să nu piardă deciziile de produs, SEO, UX, securitate și operare.

## Decizii arhitecturale aprobate

- **Platformă:** website premium de lead generation + backoffice editorial/operațional compact; nu marketplace și nu microservicii.
- **Runtime și framework:** Next.js App Router, React, TypeScript strict și runtime Node.js pe Vercel.
- **Frontend public:** design 100% custom; fără template de construcții și fără aspect implicit shadcn/ui.
- **Admin:** interfață funcțională separată; shadcn/ui poate fi folosit doar ca set de primitive administrative, personalizat vizual.
- **Hosting și delivery:** Vercel Pro, cu Development, Preview și Production separate.
- **Bază de date:** Neon PostgreSQL atunci când funcția necesită persistență relațională; Prisma ORM și validare Zod.
- **Media:** Vercel Blob pentru imaginile, documentele și atașamentele controlate de platformă.
- **E-mail:** Resend pentru notificări și e-mail tranzacțional.
- **Anti-abuz:** Cloudflare Turnstile, honeypot, rate limiting și validare server-side.
- **Analytics:** GA4, Google Search Console, Vercel Web Analytics și Speed Insights; Microsoft Clarity doar după consimțământ și validare.
- **Strategie de randare:** Server Components implicit; pagini publice statice/ISR unde este posibil; Client Components doar pentru interactivitate reală.
- **Limbi:** română și rusă la lansare dacă proprietarul confirmă conținutul; engleza rămâne extensie opțională.
- **Principiu:** SEO, accesibilitatea, performanța și conversia au prioritate față de efectele vizuale.

## Conceptul de produs

Platforma este o **mașină de încredere și conversie** pentru o întreprindere locală: atrage trafic organic și referral, demonstrează calitatea prin proiecte reale, califică cererea și ajută administratorul să gestioneze conținutul și lead-urile.

## Structura documentelor

| Fișier | Rol |
|---|---|
| `CLAUDE.md` | contract de lucru și reguli globale |
| `01-PRODUCT-VISION-AND-SCOPE.md` | viziune, rezultate, scope și non-goals |
| `02-PERSONAS-JOBS-USER-JOURNEYS.md` | segmente, JTBD și trasee de conversie |
| `03-INFORMATION-ARCHITECTURE-AND-ROUTING.md` | sitemap, URL-uri, localizare și template-uri |
| `04-SYSTEM-ARCHITECTURE.md` | arhitectura aplicației și fluxurile tehnice |
| `05-ARCHITECTURE-DECISION-RECORDS.md` | decizii tehnice blocate și trade-off-uri |
| `06-FRONTEND-CREATIVE-DIRECTION.md` | art direction public custom, separat de admin |
| `07-DESIGN-SYSTEM-UI-UX.md` | tokens, componente, stări și reguli UX |
| `08-MOTION-IMMERSIVE-EXPERIENCE.md` | cinematic, scroll, fallback și motion budget |
| `09-PUBLIC-WEBSITE-MODULE.md` | homepage și paginile publice generale |
| `10-SERVICES-LOCAL-LANDING-PAGES.md` | servicii și pagini locale fără doorway pages |
| `11-PORTFOLIO-CASE-STUDIES.md` | proiecte, media, before/after și dovadă de execuție |
| `12-LEAD-GENERATION-ESTIMATOR.md` | formulare, estimator, upload și notificări |
| `13-ADMIN-CMS-MODULE.md` | backoffice editorial și operațional |
| `14-CRM-LEAD-PIPELINE.md` | stări lead, SLA, scoring și follow-up |
| `15-DATA-MODEL-NEON-POSTGRES.md` | entități, relații, indexuri și retenție |
| `16-MEDIA-VERCEL-BLOB.md` | upload, organizare, securitate și lifecycle media |
| `17-AUTH-SECURITY-PRIVACY.md` | auth, threat model, PII și conformitate |
| `18-SEO-LOCAL-SEO-SEMANTIC.md` | SEO tehnic, local, structured data și indexare |
| `19-CONTENT-I18N-EDITORIAL.md` | conținut RO/RU, traduceri și calendar editorial |
| `20-ANALYTICS-KPI-CRO.md` | evenimente, funnel, KPI și experimente CRO |
| `21-PERFORMANCE-ACCESSIBILITY.md` | performance budgets și WCAG 2.2 AA |
| `22-DEPLOYMENT-VERCEL-OPERATIONS.md` | medii, deploy, rollback, backup și observabilitate |
| `23-TESTING-QUALITY-GATES.md` | strategie de testare și criterii de release |
| `24-ROADMAP-BACKLOG-RISK.md` | roadmap SMART, P0/P1/P2 și registru de riscuri |
| `25-INNOVATION-DIFFERENTIATORS.md` | funcții diferențiatoare și potențial disruptiv |
| `26-OWNER-DISCOVERY-CHECKLIST.md` | întrebări și inventar necesar de la proprietar |
| `27-SOURCE-REGISTER.md` | surse și reguli de utilizare a research-ului |
| `28-MASTER-IMPLEMENTATION-PLAN.md` | ordine exactă de execuție pentru Claude |

## Ordinea recomandată de citire

1. `CLAUDE.md`
2. `01`–`05` pentru produs și arhitectură
3. `06`–`08` pentru frontend și experiență vizuală
4. documentul modulului implementat
5. `17`–`23` pentru cerințe transversale
6. `24`–`28` pentru prioritizare și execuție

## Scope de lansare recomandat

### P0 — lansare

- site public RO/RU;
- servicii și pagini SEO;
- portofoliu și studii de caz;
- formular rapid și cerere avansată cu imagini;
- admin custom pentru proiecte, servicii, recenzii, FAQ și lead-uri;
- Neon PostgreSQL, Vercel Blob, Resend și Turnstile;
- analytics, SEO tehnic, Local SEO, politici și securitate;
- design custom și motion adaptiv, fără 3D în critical path.

### P1 — creștere

- estimator ghidat;
- pipeline CRM complet și automatizări Telegram;
- blog și localități validate;
- dashboard-uri operaționale;
- modul diaspora și proiect updates;
- parteneriate cu magazine/designeri.

### P2 — semnătură premium

- experiență 3D sau tur 360°;
- Digital Renovation Passport;
- ofertare PDF și programare evaluări;
- call tracking și integrare telefonie;
- asistență AI controlată pentru descrieri/alt text.

## Baza documentară

Acest document derivă din brief-ul inițial și din raportul de research incluse în directorul `../research/`. Sursele externe sunt inventariate în `27-SOURCE-REGISTER.md`. Datele comerciale ale afacerii marcate `CONFIRM_OWNER` nu trebuie publicate înainte de confirmarea proprietarului.
