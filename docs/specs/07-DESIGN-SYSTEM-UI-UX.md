# Design System & UI/UX

## Separarea sistemelor

1. **Public Design System:** expresiv, editorial, custom.
2. **Admin UI System:** densitate mai mare, funcțional, predictibil; poate folosi primitive shadcn personalizate.

Nu se copiază stilul adminului în frontend-ul public.

## Token layers

- foundation: culori, tipografie, spacing, grid, radius, elevation, motion;
- semantic: `surface-primary`, `text-muted`, `border-strong`, `action-primary`;
- component: tokens specifice doar când semantic layer nu este suficientă;
- responsive: dimensiuni fluide cu limite clare, nu breakpoint hacks repetate.

## Grid

- mobil: 4 coloane;
- tabletă: 8 coloane;
- desktop: 12 coloane;
- content max-width distinct pentru editorial, formulare și gallery;
- baseline spacing bazat pe multipli consistenți.

## Componente publice P0

- header / mobile nav;
- footer;
- primary/secondary/text CTA;
- service teaser;
- project feature și project card;
- trust metric;
- testimonial;
- process steps;
- before/after control;
- gallery/lightbox accesibil;
- FAQ accordion;
- form fields și file uploader;
- sticky contact bar;
- breadcrumb;
- locale switcher;
- consent banner.

## Stări obligatorii

Fiecare componentă interactivă documentează:

- default;
- hover;
- focus-visible;
- active/pressed;
- disabled;
- loading;
- success;
- error;
- empty;
- reduced motion;
- high zoom / text reflow.

## Form UX

- labels permanente, nu placeholder-only;
- input mode corect pentru telefon/email;
- formatarea telefonului nu blochează numere internaționale;
- validare după blur și la submit, fără zgomot la primul caracter;
- summary de erori și focus pe primul câmp invalid;
- upload cu progres, anulare, retry și preview;
- consimțământul nu este pre-bifat.

## Content density

- paginile comerciale: scanabile, cu blocuri scurte și dovezi;
- articolele: lungime de linie controlată și navigare în conținut;
- admin: tabele dense, filtre persistente și empty states cu acțiune.

## Accessibility built-in

- contrast AA pentru text și controale;
- focus vizibil pe toate temele;
- touch target minimum 44×44 CSS px;
- nu se transmite sens doar prin culoare;
- headings și landmarks semantice;
- dialogurile gestionează focusul și escape;
- before/after are alternativă controlabilă și descriere.

## Component governance

- nu se creează componentă nouă dacă un pattern existent poate fi extins coerent;
- variantele sunt explicite, nu clase arbitrare per pagină;
- orice excepție vizuală trebuie să aibă rol narativ;
- Storybook este recomandat pentru componente publice critice și admin forms, dar rămâne opțional la P0 dacă timpul nu permite.

## Design QA checklist

- desktop, tabletă și mobil real;
- zoom 200%;
- texte RO și RU lungi;
- contrast și focus;
- loading/empty/error;
- conținut fără imagini;
- imagine cu raport neașteptat;
- conexiune lentă și font fallback;
- reduced motion;
- Safari iOS și Chrome Android.
