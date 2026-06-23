# Information Architecture & Routing

## Strategie URL

- Prefix de limbă explicit: `/ro/...`, `/ru/...`; `/en/...` doar după aprobarea conținutului.
- `/` redirecționează controlat către limba implicită sau folosește negociere cu fallback stabil.
- Slug-urile sunt localizate, stabile și mapate prin ID intern.
- Canonical este self-referential pentru fiecare versiune validă.
- `hreflang` include variantele disponibile și `x-default` doar când este justificat.

## Sitemap public propus

```text
/{locale}
/{locale}/servicii
/{locale}/servicii/{serviceSlug}
/{locale}/proiecte
/{locale}/proiecte/{projectSlug}
/{locale}/preturi
/{locale}/calculator-estimativ
/{locale}/despre
/{locale}/proces
/{locale}/recenzii
/{locale}/intrebari-frecvente
/{locale}/ghiduri
/{locale}/ghiduri/{articleSlug}
/{locale}/contact
/{locale}/cerere-oferta
/{locale}/localitati/{localitySlug}
/{locale}/confidentialitate
/{locale}/cookies
/{locale}/termeni
```

## Rute non-publice

```text
/admin
/admin/login
/admin/leads
/admin/projects
/admin/services
/admin/content
/admin/media
/admin/reviews
/admin/settings
/admin/audit
/api/*
/preview/*
```

Admin, preview, căutări interne și filtre parametrizate sunt `noindex` și excluse din sitemap.

## Template-uri

### Service page

- hero specific serviciului;
- problemă și rezultat;
- proiecte relevante;
- proces;
- factori de preț;
- FAQ;
- localități reale;
- CTA și formular contextual.

### Locality page

Se creează numai dacă există:

- serviciu real în zonă;
- exemple sau dovezi relevante;
- text unic și util;
- informații reale despre deplasare/disponibilitate.

Nu se publică pagini duplicate cu schimbarea automată a denumirii localității.

### Project page

- rezumat;
- challenge / approach / result;
- before/during/after;
- servicii și materiale;
- durată și suprafață dacă sunt aprobate;
- testimonial asociat;
- CTA „proiect similar”.

## Navigație globală

Desktop: Servicii, Proiecte, Proces, Prețuri, Despre, Contact, CTA ofertă.

Mobile: meniu scurt + bară sticky cu maximum trei acțiuni: apel, mesaj, ofertă.

## Internal linking

- serviciu ↔ proiecte relevante;
- articol ↔ serviciu principal și proiect;
- localitate ↔ servicii disponibile;
- proiect ↔ CTA cu serviciul preselectat;
- FAQ contextual, nu doar pagină centrală.

## Reguli de paginare și filtre

- filtrele portofoliului nu creează automat URL-uri indexabile;
- colecțiile importante pot primi landing-uri editoriale dedicate;
- paginarea are canonical corect și linkuri accesibile;
- parametrii tracking nu alterează canonical.

## Redirect policy

- orice schimbare de slug produce redirect 301;
- redirect-urile sunt centralizate și testate;
- nu se creează lanțuri de redirect;
- paginile eliminate cu înlocuitor relevant redirecționează; altfel 410 sau 404 util.

## Definition of Done

- toate paginile au owner, scop și CTA;
- nicio pagină publică nu este orfană;
- toate slugs sunt unice per locale;
- sitemap-ul conține doar URL-uri canonice indexabile;
- navigația este utilizabilă cu tastatura și pe mobil.
