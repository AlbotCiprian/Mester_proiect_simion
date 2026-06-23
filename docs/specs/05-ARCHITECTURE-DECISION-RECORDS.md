# Architecture Decision Records

## ADR-001 — Next.js App Router pe Vercel Pro

**Status:** Accepted  
**Decizie:** aplicație full-stack Next.js, un singur deploy Vercel Pro.  
**Motiv:** SEO/SSR/ISR, preview deployments, integrare simplă și cost operațional redus.  
**Respins:** SPA + API separat, Angular + API, backend Go în MVP.  
**Consecință:** discipline stricte pentru Server/Client Components și runtime Node.

## ADR-002 — Monolit modular, nu microservicii

**Status:** Accepted  
**Decizie:** module de domeniu separate în același codebase.  
**Motiv:** business mic, trafic estimat moderat, aceeași echipă de dezvoltare.  
**Trigger de reevaluare:** nevoi independente de scalare, ownership separat sau SLA diferit demonstrat.

## ADR-003 — Neon PostgreSQL + Prisma

**Status:** Accepted  
**Decizie:** persistență relațională pentru conținut, lead-uri, audit și auth.  
**Motiv:** relații clare, query-uri administrative, integritate și reporting.  
**Consecință:** migrations controlate, pooling și branch DB pentru preview/staging când este necesar.

## ADR-004 — Vercel Blob pentru media

**Status:** Accepted  
**Decizie:** media și atașamente în Blob, metadata în PostgreSQL.  
**Motiv:** integrare nativă Vercel și simplitate operațională.  
**Consecință:** storage adapter intern și monitorizare cost/usage; fără binary în DB.

## ADR-005 — Frontend public custom

**Status:** Accepted  
**Decizie:** design system propriu pentru public; fără template și fără shadcn ca identitate vizuală.  
**Motiv:** diferențiere premium și control exact al experienței.  
**Consecință:** toate componentele publice trebuie documentate în design system.

## ADR-006 — Admin custom compact

**Status:** Accepted  
**Decizie:** backoffice construit în aceeași aplicație; primitive UI pot proveni din shadcn, dar sunt adaptate.  
**Motiv:** modele de conținut limitate și workflow clar; headless CMS enterprise este disproporționat.

## ADR-007 — Strategie static/ISR pentru public

**Status:** Accepted  
**Decizie:** pagina publică rămâne statică sau ISR când datele permit.  
**Motiv:** performanță, SEO, cost și reziliență.  
**Consecință:** CSP global nonce-based este evitat dacă forțează dynamic rendering nejustificat.

## ADR-008 — Better Auth pentru admin

**Status:** Proposed/Preferred  
**Decizie:** Better Auth cu sesiuni securizate și storage în DB; fallback Auth.js doar prin ADR dacă apar incompatibilități concrete.  
**Scope P0:** un administrator, rol extensibil, resetare sigură, sesiuni active și opțional 2FA.

## ADR-009 — Resend și Telegram pentru notificări

**Status:** Accepted  
**Decizie:** e-mail tranzacțional prin Resend; notificare Telegram opțională, necanonică.  
**Consecință:** lead-ul se salvează înaintea notificării; eșecul Telegram/email nu pierde lead-ul.

## ADR-010 — Turnstile + rate limiting

**Status:** Accepted  
**Decizie:** verificare server-side, honeypot și limite per IP/fingerprint logic.  
**Consecință:** UX fără CAPTCHA intruziv, dar protecție layered.

## ADR-011 — Multi-language cu prefix URL

**Status:** Accepted condiționat de conținut  
**Decizie:** RO și RU au rute explicite și conținut administrabil separat.  
**Consecință:** o traducere incompletă nu se publică; nu se face fallback silent care produce conținut mixt.

## ADR-012 — Estimator orientativ, nu ofertă automată

**Status:** Accepted  
**Decizie:** instrumentul explică factori și produce interval/eligibilitate, nu preț contractual.  
**Motiv:** variabilitate ridicată a suprafețelor și pregătirii.

## ADR-013 — No PII in analytics

**Status:** Accepted  
**Decizie:** evenimentele analytics nu includ nume, telefon, email, adresă, mesaj sau URL de fișier privat.

## Proces pentru ADR nou

Orice abatere de la deciziile de mai sus trebuie să specifice: problemă, alternative, cost, risc, impact SEO/performance/security, plan de migrare și criteriu măsurabil de succes.
