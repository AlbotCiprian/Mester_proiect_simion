# Contract operațional pentru Claude

## Misiune

Folosește acest pachet ca **sursă de adevăr pentru produs, design și arhitectură**. Construiește o platformă premium pentru servicii de montare gresie, faianță, teracotă și renovări de băi în Republica Moldova. Nu transforma proiectul într-un template generic și nu introduce infrastructură care nu este justificată de cerințe.

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

## Ordinea autorității documentelor

1. Instrucțiunea explicită curentă a proprietarului proiectului.
2. `05-ARCHITECTURE-DECISION-RECORDS.md` pentru deciziile tehnice blocate.
3. `28-MASTER-IMPLEMENTATION-PLAN.md` pentru secvența de execuție.
4. Documentul modulului implementat.
5. `23-TESTING-QUALITY-GATES.md` și `24-ROADMAP-BACKLOG-RISK.md`.
6. Research-ul din `docs/research/` și `27-SOURCE-REGISTER.md`.

## Reguli obligatorii

- Nu inventa servicii, prețuri, garanții, proiecte, recenzii, localități acoperite sau date legale.
- Orice valoare de business neconfirmată se marchează `CONFIRM_OWNER`.
- Nu folosi imagini ale concurenților și nu introduce media fără drepturi clare.
- Nu publica adrese exacte ale clienților și elimină metadatele GPS din media când este necesar.
- Nu stoca fișiere binare în PostgreSQL.
- Nu muta business logic în componente client.
- Nu crea API separat, worker separat sau microserviciu fără ADR nou și justificare măsurabilă.
- Nu folosi `any`, validări exclusiv client-side, secrete în browser sau loguri cu PII.
- Nu considera ruta ascunsă de login măsură de securitate.
- Nu considera click-ul pe telefon dovadă că apelul a fost efectiv realizat.
- Nu sacrifica HTML semantic, indexabilitatea sau fallback-ul pentru animații.
- Nu introduce `noindex` pe producție pentru paginile publice și nu permite indexarea Preview/Admin.

## Mod de lucru

Pentru fiecare modul:

1. Citește documentele dependente menționate în secțiunea „Dependențe”.
2. Enumeră ipotezele și elementele `CONFIRM_OWNER`.
3. Definește contractele de date, stările UI și criteriile de acceptare înainte de implementare.
4. Implementează incremental, fără refactorizări laterale necerute.
5. Rulează verificările modulului și quality gates globale.
6. Actualizează documentația doar când decizia sau contractul s-a schimbat.

## Gates

- **Gate A — Business readiness:** checklist-ul din `26-OWNER-DISCOVERY-CHECKLIST.md` are datele critice completate.
- **Gate B — UX readiness:** direcția din `06-FRONTEND-CREATIVE-DIRECTION.md` și sistemul din `07-DESIGN-SYSTEM-UI-UX.md` sunt aprobate.
- **Gate C — Data readiness:** modelul conceptual și politicile media sunt validate.
- **Gate D — Release readiness:** toate criteriile P0 și testele critice sunt verzi.

## Definition of Done global

Un task nu este „done” doar pentru că funcționează local. Trebuie să fie testat, accesibil, securizat, instrumentat analytics unde este cazul, documentat și compatibil cu Preview/Production pe Vercel.

## Baza documentară

Acest document derivă din brief-ul inițial și din raportul de research incluse în directorul `docs/research/`. Sursele externe sunt inventariate în `27-SOURCE-REGISTER.md`. Datele comerciale ale afacerii marcate `CONFIRM_OWNER` nu trebuie publicate înainte de confirmarea proprietarului.
