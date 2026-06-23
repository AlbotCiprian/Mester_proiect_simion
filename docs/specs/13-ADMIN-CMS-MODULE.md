# Admin & CMS Module

## Obiectiv

Backoffice simplu pentru utilizator non-tehnic, optimizat desktop/tabletă, care gestionează conținut, media și lead-uri fără a deveni un CMS general-purpose.

## Navigație admin

- Dashboard
- Lead-uri
- Proiecte
- Servicii și prețuri
- Recenzii
- Pagini / FAQ / Ghiduri
- Localități
- Media
- Setări business și SEO
- Audit / Sesiuni

## Dashboard P0

- lead-uri noi/necontactate;
- SLA depășit;
- următoarele follow-up-uri;
- proiecte draft/publicate;
- formulare eșuate/notificări eșuate;
- top surse și pagini, dacă datele există.

## Content workflow

Statusuri: Draft → Review → Scheduled optional → Published → Archived.

- preview înainte de publicare;
- validări pentru câmpurile SEO și traduceri;
- revalidare publică după publish;
- audit log pentru schimbări importante;
- autosave doar dacă este robust; altfel save explicit și draft recovery.

## Project editor

- date generale;
- servicii/tags;
- localizare generală;
- story blocks;
- media ordering și focal point;
- before/after pairing;
- consent state;
- traduceri;
- SEO și OG;
- featured/published.

## Media library

- upload;
- căutare și tag-uri;
- alt text per locale;
- usage references;
- detectare fișier mare;
- ștergere blocată dacă media este folosită;
- cleanup orphans controlat.

## Lead inbox

- listă, căutare, filtre;
- status, prioritate, sursă, localitate, serviciu;
- atașamente securizate;
- note interne;
- responsabil și next action;
- history timeline;
- export CSV cu autorizare.

## Settings

- NAP și date legale;
- program;
- service areas;
- canale contact;
- social links;
- feature flags;
- default SEO și consent versions;
- notificări.

## Permissions

P0: `OWNER_ADMIN`. Model extensibil pentru `CONTENT_EDITOR` și `LEAD_MANAGER`, dar nu se complică UI-ul până nu există utilizatori reali.

## UX admin

- tabele cu coloane configurate rezonabil;
- filtre persistente în URL;
- bulk actions limitate și confirmate;
- destructive actions cu context și undo/soft delete unde este posibil;
- toate stările au empty state util;
- mobile doar pentru acțiuni rapide, nu editor complex.

## Acceptance criteria

- un utilizator non-tehnic poate publica un proiect fără developer;
- lead-urile au istoric și nu pot fi accesate public;
- audit log pentru publish/delete/status;
- preview/admin `noindex`;
- sesiuni, logout global și recovery testate.
