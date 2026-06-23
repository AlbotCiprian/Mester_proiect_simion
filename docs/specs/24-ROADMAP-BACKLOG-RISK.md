# Roadmap SMART, Backlog & Risk Register

## Faza 0 — Business readiness

**Obiectiv SMART:** în maximum 7 zile lucrătoare de la start, să fie confirmate serviciile, zonele, canalele, garanția, prețurile publicabile și inventarul media, cu minimum 90% din câmpurile critice din checklist completate.

- rezultat: brief business validat;
- dependență: proprietar;
- criteriu: niciun claim critic rămas ambiguu pentru P0;
- nu include: design sau cod.

## Faza 1 — UX, brand și content architecture

**Obiectiv SMART:** în 10 zile lucrătoare, să fie aprobate direcția Precision Atelier, sitemap-ul, wireframe-urile și contractele de conținut pentru homepage, service, project și lead flow.

## Faza 2 — Foundation

**Obiectiv SMART:** să fie pregătită fundația Next/Vercel/Neon/Blob, auth și design tokens, cu CI quality gates verzi și fără funcții publice netestate.

## Faza 3 — P0 public + lead

- homepage;
- servicii;
- proiecte;
- contact și formulare;
- SEO/I18N;
- media;
- analytics.

## Faza 4 — Admin + CRM

- CRUD conținut;
- lead inbox/pipeline;
- audit;
- notifications;
- owner acceptance testing.

## Faza 5 — Launch

- content final;
- legal;
- GSC/GBP;
- QA real devices;
- soft launch;
- monitoring 14 zile.

## Faza 6 — Growth

- blog/local SEO;
- estimator extins;
- diaspora mode;
- CRO;
- parteneriate;
- P2 immersive după date reale.

## Backlog prioritizat

### P0

- arhitectură și IA;
- design custom responsive;
- RO/RU;
- servicii și proiecte;
- lead capture/upload;
- admin;
- CRM minim;
- SEO/Local SEO;
- analytics;
- security/privacy;
- Vercel deployment și backups.

### P1

- estimator configurabil;
- workflow recenzii;
- Telegram notifications;
- content/blog;
- locality pages validate;
- diaspora remote mode;
- partner referral tracking;
- operational dashboards.

### P2

- 3D/360;
- Digital Renovation Passport;
- call tracking;
- scheduling;
- PDF quote;
- customer project portal;
- AI-assisted content cu approval.

## Risk register

| Risc | Impact | Prob. | Mitigare | Owner |
|---|---|---|---|---|
| media insuficientă/slabă | critic | mare | audit și reshoot înainte de design final | Business |
| servicii/claims neconfirmate | mare | mare | Gate 0 | Product |
| conținut RU slab | mare | medie | translator/reviewer uman | Content |
| overengineering | mare | medie | ADR și P0 strict | Tech |
| performanță afectată de motion | mare | medie | poster first, tiers, budgets | Frontend |
| spam/upload abuse | mare | mare | Turnstile, limits, validation | Security |
| lead notification failure | mare | medie | DB first, retry, dashboard | Backend |
| SEO local incoerent | mare | medie | NAP owner și launch checklist | SEO |
| cost media | mediu | medie | limits și usage monitor | Ops |
| admin prea complex | mediu | medie | user testing cu proprietarul | UX |

## Change control

Funcțiile noi nu intră în P0 doar pentru că sunt interesante. Trebuie să aibă user problem, owner, date necesare, cost, risc și criteriu de succes.
