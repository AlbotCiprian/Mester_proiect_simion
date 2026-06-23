# Frontend Creative Direction — modul public custom

## Concept final recomandat: **Precision Atelier**

O combinație între căldura materialelor naturale și precizia geometrică a plăcilor. Experiența trebuie să pară editorială, arhitecturală și construită special pentru această echipă, nu pentru „orice firmă de construcții”.

## Personalitatea vizuală

- precisă, calmă, sigură;
- premium fără ostentație;
- bazată pe dovezi și detalii;
- modernă, dar familiară publicului local;
- umană: meșterul și procesul real nu sunt ascunse în spatele unui brand steril.

## Paletă conceptuală

- **Canvas:** alb mineral / crem cald;
- **Surface:** travertin deschis și gri calcar;
- **Ink:** grafit foarte închis;
- **Accent:** bronz oxidat sau teracotă controlată;
- **Success/Status:** tonuri funcționale discrete, separate de paleta de brand.

Valorile exacte se stabilesc în design tokens după testarea contrastului WCAG. Accentul nu trebuie folosit pe suprafețe mari.

## Tipografie

- Display editorial serif, cu suport complet RO/RU, folosită selectiv pentru titluri și citate.
- Sans geometric/grotesk cu lizibilitate excelentă pentru UI și corp.
- Fonturile trebuie self-hosted sau livrate prin mecanism optimizat, cu subset-uri controlate.
- Nu se folosesc mai mult de două familii și trei-patru greutăți efective.

## Compoziție

- grid inspirat de rosturi și module ceramice;
- margini generoase și mult spațiu negativ;
- imagini care rup controlat gridul doar în momente de impact;
- macro-detalii tehnice alternate cu cadre de ansamblu;
- secțiuni narative, nu colecții de carduri identice.

## Hero homepage

### Desktop performant

- poster real imediat;
- headline clar și CTA în HTML;
- image-sequence/parallax încărcat progresiv după conținutul esențial;
- indicator discret de scroll;
- trust facts confirmate integrate fără a acoperi lucrarea.

### Mobil

- imagine sau video scurt optimizat;
- fără scrubbing greu și fără text peste zone vizual aglomerate;
- CTA primar vizibil fără scroll;
- bară de contact sticky după primul viewport.

## Stil componente publice

- butoane cu forme ferme, nu „pill” peste tot;
- cardurile sunt editoriale, cu diferențe de scară și ritm;
- iconuri lineare custom/coerente, nu mixuri de librării;
- separatoare inspirate din linii de rost;
- before/after tratat ca instrument de dovadă, nu gimmick;
- formularele au suprafețe calme, labels persistente și feedback clar.

## Homepage narrative

1. Intrarea în spațiu / promisiunea.
2. Dovada rapidă: experiență, garanție, zonă, proiecte.
3. Servicii prioritare.
4. Un proiect flagship spus ca poveste.
5. Detalii de precizie și standard de execuție.
6. Procesul de lucru.
7. Estimare/cerere ghidată.
8. Portofoliu selectat.
9. Recenzii verificabile.
10. FAQ și CTA final.

## Fotografie și media

- toate cadrele trebuie să fie reale în producție;
- corecție de perspectivă și white balance consistent;
- nu se elimină defecte reale în mod înșelător;
- alternanță: wide, medium, detail, process;
- înainte/durante/după cu poziții comparabile unde este posibil;
- fețele și datele personale apar doar cu consimțământ.

## Interacțiuni

- hover bazat pe lumină, crop și micro-translate, nu pe bounce;
- tranziții 180–500 ms, în funcție de importanță;
- scroll motion legat de narațiune, nu aplicat fiecărei secțiuni;
- feedback tactil vizual pe butoane și controale;
- reduced motion păstrează hierarchy fără animații.

## Anti-patterns interzise

- hero cu stock photo generic și overlay albastru;
- secțiuni compuse exclusiv din carduri identice;
- gradient neon, glassmorphism excesiv, text 3D decorativ;
- loader lung înainte de a vedea conținutul;
- video autoplay cu sunet;
- scroll hijacking;
- cursor custom care afectează utilizarea;
- elemente care par butoane, dar nu sunt interactive.

## Deliverables de design înainte de build

- moodboard și art direction;
- două variante de hero și una de fallback mobil;
- homepage desktop + mobil;
- service page, project page și lead flow;
- admin shell separat;
- tokens și component states;
- prototype pentru motion critic;
- audit contrast, touch targets și reduced motion.

## Criteriu de acceptare

O captură fără logo trebuie să fie recognoscibilă ca aparținând unui atelier premium de placare/renovare, nu unui SaaS, magazin sau template de construcții.
