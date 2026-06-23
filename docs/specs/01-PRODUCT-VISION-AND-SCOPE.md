# Product Vision & Scope

## Viziune

Să transformăm un meșter/echipă locală cu proiecte reale într-un **brand digital premium, verificabil și ușor de contactat**, capabil să câștige căutări locale și să convertească vizitatorii în cereri calificate.

## North Star

**Numărul de lead-uri calificate generate lunar din canale organice și referral, care ajung la evaluare programată.**

Lead calificat înseamnă: serviciu relevant, localitate deservită, date de contact valide, interval realist și suficiente informații sau imagini pentru evaluare.

## Rezultate de business

1. Încredere în primele 10 secunde prin proiecte reale, experiență, garanție și proces.
2. Creșterea ponderii lead-urilor organice și reducerea dependenței de marketplace-uri.
3. Reducerea timpului de calificare prin cereri structurate și upload foto.
4. Actualizarea portofoliului fără intervenție de developer.
5. Trasabilitatea sursei lead-ului și a conversiei până la contract.

## Proposition

> Lucrări de placare și renovări de baie executate cu precizie, prezentate transparent și estimate rapid pe baza situației reale.

Textul final este `CONFIRM_OWNER`; nu publica promisiuni precum „cea mai bună echipă” sau „garanție X ani” fără dovadă.

## Scope funcțional

### Public

- homepage cinematic, dar rapid;
- servicii și localități validate;
- proiecte și studii de caz;
- before/after și detalii de execuție;
- prețuri orientative sau factori de cost, dacă sunt aprobate;
- proces, recenzii, FAQ, despre, contact;
- formular rapid, callback și cerere avansată;
- articole și ghiduri;
- RO/RU, eventual EN ulterior.

### Operațional

- administrare conținut;
- media library;
- inbox/pipeline lead-uri;
- note, status, sursă, follow-up și export;
- setări business și SEO;
- audit log și politici de retenție.

## Non-goals MVP

- marketplace pentru mai mulți meșteri;
- checkout sau plăți online;
- ERP complet;
- planificator de șantier complex;
- aplicație mobilă nativă;
- microservicii;
- preț final automat fără evaluare umană;
- AI care publică automat conținut fără aprobare.

## Principii de produs

- **Proof before promise:** proiecte și detalii reale înaintea sloganurilor.
- **Progressive disclosure:** formularul cere mai mult doar când utilizatorul alege cererea detaliată.
- **Mobile conversion first:** apel, mesagerie și ofertă accesibile cu o mână.
- **Owner-operable:** operațiunile uzuale trebuie realizate fără developer.
- **Evidence-aware:** fiecare recenzie, garanție și proiect trebuie să aibă sursă/consimțământ.
- **No dead features:** funcțiile care nu pot fi menținute de proprietar nu intră în P0.

## KPI inițiali

- conversie vizitator → lead;
- lead calificat / lead total;
- timp median până la primul contact;
- cereri cu imagini atașate;
- click telefon/Viber/Telegram;
- pagini serviciu care generează lead-uri;
- proiecte care asistă conversia;
- impresii, CTR și poziții locale;
- ofertă → contract și venit estimat pe sursă.

## Criterii de succes pentru lansare

- P0 complet și fără date inventate;
- minimum 6 proiecte publicabile sau un plan clar de producție media;
- minimum 3 servicii prioritare cu text unic în RO și RU;
- toate canalele de contact verificate;
- formulare, notificări și pipeline testate end-to-end;
- GSC, GA4, sitemap și Google Business Profile aliniate;
- Core Web Vitals în buget pe template-urile standard.

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

## Baza documentară

Acest document derivă din brief-ul inițial și din raportul de research incluse în directorul `../research/`. Sursele externe sunt inventariate în `27-SOURCE-REGISTER.md`. Datele comerciale ale afacerii marcate `CONFIRM_OWNER` nu trebuie publicate înainte de confirmarea proprietarului.
