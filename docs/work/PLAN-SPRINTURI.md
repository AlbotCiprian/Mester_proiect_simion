# SemiDom — plan de lansare pe sprinturi

Ultima actualizare: **2026-09-05**. Acest fișier este planul operațional.
Runbook-ul tehnic de DNS și mail este `GO-LIVE.md`; întrebările către proprietar
sunt în `OWNER-DATA-REQUEST.md`; deciziile sunt în `DECISIONS.md`.

---

## 0. Unde suntem acum, în trei propoziții

Site-ul este **terminat funcțional și construiește curat**: 44 de pagini
statice, 123 de teste verzi, 15 pagini noi de conținut pe cuvinte-cheie, politică
de confidențialitate completă cu operator identificat, formular de lead cu
anti-abuz și livrare prin Resend.

Site-ul **nu este încă vizibil pe `semidom.md`**, pentru că domeniul nu a fost
adăugat în proiectul Vercel — deci zona DNS nu există.

Site-ul **nu poate încă primi lead-uri**, pentru că `contact@semidom.md` nu are
cutie poștală și cheia Resend nu este configurată în Vercel.

---

## 1. Ce s-a livrat în acest sprint

| # | Livrabil | Stare |
|---|---|---|
| 1 | Bannerul „Site în lucru" scos de peste tot, împreună cu mecanismul care îl genera | ✅ |
| 2 | 15 pagini SEO pe subiecte, sub `/ro/servicii/<slug>`, plus pagina-hub `/ro/servicii` | ✅ |
| 3 | Toate cele 15 în `sitemap.xml` (18 URL-uri în total) și în `llms.txt` | ✅ |
| 4 | `robots.txt` optimizat: permisiv pentru căutare și asistenți, blocant pentru 20 de crawlere care consumă resurse fără să aducă clienți | ✅ |
| 5 | Retuș de conversie: telefonul în header pe desktop și mobil, bară mobilă cu numărul afișat, CTA la mijloc de pagină, formular pe fiecare pagină | ✅ |
| 6 | Politica de confidențialitate: operator identificat (persoană fizică), IDNP ascuns implicit cu buton de afișare, secțiune dedicată cookie-urilor | ✅ |
| 7 | Gate A deschis — site-ul devine indexabil în momentul în care variabilele de mediu sunt setate pe Vercel | ✅ |
| 8 | Structured data: `Service`, `FAQPage`, `BreadcrumbList` pe fiecare pagină nouă | ✅ |
| 9 | 32 de teste noi care blochează exact greșelile scumpe: titluri duplicate, prețuri inventate, localități neconfirmate, linkuri interne moarte, fotografii lipsă | ✅ |

**Verificat, nu presupus:** `npm run verify` → typecheck curat, lint curat,
123/123 teste, build cu 44 de pagini. Server pornit local și verificat:
`/ro/servicii` → 200, o pagină de subiect → 200, slug inexistent → 404,
`/ru/servicii/...` → 404, sitemap → 18 URL-uri, zero `CONFIRM_OWNER` în HTML,
IDNP prezent o singură dată și închis implicit.

---

## Sprint 1 — Domeniul răspunde (30 de minute, blochează tot restul)

> **Aceasta este singura sarcină urgentă.** Măsurat azi, 2026-09-05:
> `ns1.vercel-dns.com` răspunde **„Query refused"** pentru `semidom.md`, iar
> proiectul Vercel `semidom` are doar domeniile `*.vercel.app`. Nameserverele
> sunt delegate corect către Vercel, dar **Vercel nu are zonă DNS pentru
> domeniu** — deci în clipa în care registrul `.md` publică delegarea, domeniul
> nu va rezolva nicăieri. Nici site, nici mail.

| Pas | Ce faci | Unde | Cum verifici |
|---|---|---|---|
| 1.1 | Adaugi `semidom.md` | Vercel → proiectul `semidom` → Settings → Domains → Add | Zona nu mai răspunde „refused" |
| 1.2 | Adaugi `www.semidom.md` și îl setezi **redirect către `semidom.md`** | același ecran | Un singur host canonic |
| 1.3 | Aștepți publicarea delegării de la registru | nimic de făcut | `nslookup -type=NS semidom.md 8.8.8.8` listează `vercel-dns` |
| 1.4 | Confirmi certificatul TLS | Vercel → Domains | `https://semidom.md/ro` → 200 |

Apex-ul **nu are nevoie de înregistrare A manuală** cât timp Vercel ține
nameserverele. TopHost nu mai este autoritar pentru acest domeniu (D-023).

---

## Sprint 2 — Mail-ul funcționează (1 oră, blochează lead-urile)

### 2.1. Alege unde stă cutia poștală

Vercel nu găzduiește cutii poștale. `contact@semidom.md` trebuie găzduit undeva,
iar decizia asta determină înregistrările MX.

| Opțiune | Cost | Recomandare |
|---|---|---|
| **Zoho Mail** — nivel gratuit | 0, 1 utilizator, 5 GB | ✅ alegerea normală pentru o afacere de o persoană |
| TopHost mail hosting | add-on plătit | totul la un singur furnizor, suport în română |
| Google Workspace | ~6 EUR/lună | cea mai bună livrabilitate, singura cu cost recurent |

### 2.2. Înregistrările DNS, toate în Vercel

**Vercel → Domains → `semidom.md` → DNS Records.**

| Tip | Nume | Valoare | Rol |
|---|---|---|---|
| MX | `@` | de la furnizorul de mail, cu prioritățile lui | unde ajunge mailul |
| TXT | `@` | SPF combinat, vezi mai jos | cine poate trimite ca `semidom.md` |
| TXT/CNAME | selectorul DKIM al furnizorului | de la furnizor | semnează mailul din cutia poștală |
| MX | `send` | de la Resend | bounce handling Resend |
| TXT | `send` | de la Resend | SPF pentru return-path Resend |
| TXT | `resend._domainkey` | de la Resend | semnează mailurile de lead |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:contact@semidom.md` | rapoarte, fără efect asupra livrării |

**Capcana SPF.** Un domeniu poate avea **exact un** record SPF la apex. Două
înseamnă autentificare eșuată — mai rău decât zero. Se combină:

```text
v=spf1 include:<furnizorul-tău-de-mail> include:amazonses.com ~all
```

Resend trimite prin Amazon SES, dar **citește includul exact din panoul Resend**
— diferă pe regiuni. Resend își pune SPF-ul pe subdomeniul `send.semidom.md`, deci
în practică de obicei nu se ciocnește cu SPF-ul apexului.

### 2.3. Resend

1. Resend → Domains → Add `semidom.md`, regiunea cea mai apropiată de Moldova.
2. Creezi în Vercel DNS fiecare record pe care ți-l afișează Resend, exact.
3. Aștepți statusul **Verified**.
4. Creezi o cheie API **cu drept doar de trimitere** (sending only), nu full access.

> ⚠️ **Cheia `re_EYZf7EP3_...` care apare într-o captură de ecran trimisă anterior
> trebuie revocată acum.** O cheie văzută într-o imagine este o cheie compromisă.
> Generează una nouă, sending-only, și pune-o doar în Vercel.

**Adresa expeditor: `SemiDom <noreply@semidom.md>`, nu `contact@`.** A trimite de
la aceeași adresă la care livrezi este un declanșator clasic de filtru de spam și
face ca răspunsurile să se întoarcă în propria cutie a formularului. `noreply@`
nu are nevoie de cutie poștală, doar de înregistrările DNS de mai sus.

---

## Sprint 3 — Variabilele de mediu pe Vercel (15 minute)

**Scope: Production**, dacă rândul nu spune altceva. Vercel pune implicit
variabila în toate mediile — restrânge fiecare deliberat.

| Variabilă | Scope | Valoare |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | `https://semidom.md` — fără slash final |
| `CONFIRMED_PRODUCTION_HOST` | Production | `semidom.md` — doar hostul, litere mici |
| `RESEND_API_KEY` | Production | cheia sending-only. **Preview nu primește cheie** — un deploy de preview nu are voie să trimită mail |
| `LEAD_FROM_EMAIL` | Production | `SemiDom <noreply@semidom.md>` |
| `LEAD_TO_EMAIL` | Production | `contact@semidom.md` |
| `LEAD_FORM_SECRET` | Production **și** Preview, **valori diferite** | șir aleator lung; altfel HMAC-ul cade pe o valoare implicită publică |
| `IP_HASH_SALT` | Production **și** Preview, **valori diferite** | șir aleator lung; altfel hash-ul de IP cade pe o valoare implicită publică |
| `LEAD_CONSENT_VERSION` | Production | `2026-09-05` — versiunea politicii, călătorește cu fiecare lead |

Numele sunt exact cele citite de cod (`lib/env.ts`, `app/actions/lead.ts`,
`config/indexability.mjs`). O literă greșită nu produce nicio eroare — produce
un site care tace.

> **Ordine importantă:** `LEAD_TO_EMAIL` poate fi temporar o adresă Gmail care
> există deja, dacă vrei să pornești site-ul înainte de a configura cutia
> poștală. Un lead livrat la Gmail este infinit mai bun decât un lead livrat la o
> adresă care nu există. Îl schimbi la `contact@semidom.md` când cutia e gata.

Cele două variabile de host se citesc **la build**. După ce le setezi, trebuie
un redeploy — nu se aplică deploy-ului existent.

**Ce se întâmplă când sunt setate:** `GATE_A_COMPLETE` este deja `true`, deci
în momentul redeploy-ului site-ul devine indexabil, `sitemap.xml` se populează
cu cele 18 URL-uri, `llms.txt` începe să răspundă și antetul `X-Robots-Tag:
noindex` dispare. Până atunci, site-ul rămâne deliberat neindexabil — asta este
plasa de siguranță, nu o eroare.

---

## Sprint 4 — Verificare înainte de a anunța pe cineva (30 de minute)

| # | Verificare | Rezultat așteptat |
|---|---|---|
| 4.1 | `https://semidom.md/ro` | 200, fără eroare TLS |
| 4.2 | `http://semidom.md/ro` | 308 către https |
| 4.3 | `https://www.semidom.md` | redirect către apex |
| 4.4 | `https://semidom.md/sitemap.xml` | 18 URL-uri, toate cu `https://semidom.md` |
| 4.5 | `https://semidom.md/robots.txt` | `Allow: /` + linia `Sitemap:` |
| 4.6 | View source pe `/ro` | **fără** `<meta name="robots" content="noindex">` |
| 4.7 | Trimiți formularul cu date reale | ajunge mail la `LEAD_TO_EMAIL` în sub un minut |
| 4.8 | Trimiți formularul **cu JavaScript dezactivat** | funcționează la fel |
| 4.9 | Deschizi `/ro` pe telefon | bara de jos afișează numărul; butonul „Cere ofertă" derulează în pagină |
| 4.10 | Deschizi o pagină de serviciu pe telefon | butonul din header derulează la formularul **din acea pagină** |
| 4.11 | `/ro/confidentialitate` | IDNP ascuns; se deschide la click; funcționează fără JS |

**Livrabilitatea în prima săptămână.** Un domeniu nou nu are reputație de
expeditor. Trimite-ți singur câteva lead-uri de test, deschide-le și marchează-le
„nu este spam" dacă ajung acolo. Nu trimite nimic în masă. Urmărește bounce-urile
în panoul Resend.

---

## Sprint 5 — Indexare (tu, după ce Sprint 4 e verde)

| # | Pas | Unde |
|---|---|---|
| 5.1 | Adaugi proprietatea `semidom.md` (Domain property, verificare TXT în Vercel DNS) | Google Search Console |
| 5.2 | Trimiți `https://semidom.md/sitemap.xml` | GSC → Sitemaps |
| 5.3 | Ceri indexarea manuală pentru `/ro` și pentru 3-4 pagini de servicii | GSC → URL Inspection |
| 5.4 | Adaugi și în Bing Webmaster Tools (importă din GSC, durează 2 minute) | Yandex contează local, adaugă-l și pe el |
| 5.5 | **Creezi Google Business Profile** | vezi nota de mai jos |

> **Google Business Profile aduce mai mult trafic local decât toate cele 15
> pagini la un loc**, pentru un meșter din Chișinău. Este gratuit, durează ~20 de
> minute și apare în Maps și în pachetul local. Este singura recomandare de
> marketing din acest document, pentru că raportul efort/rezultat nu se compară
> cu nimic altceva.

**Așteptări realiste, ca să nu tragi concluzii greșite:** indexarea primelor
pagini durează zile până la câteva săptămâni; poziționarea pe interogări
competitive („renovare baie Chișinău") durează luni. Paginile de nișă
(„hidroizolație baie", „duș fără prag", „montaj WC suspendat") vor aduce primele
vizite, pentru că au concurență mai mică și intenție mai clară.

---

## Sprint 6 — Ce rămâne blocat pe proprietar

Niciuna dintre acestea nu blochează lansarea. Toate cresc conversia sau reduc risc.

| # | Ce lipsește | Ce deblochează | Impact |
|---|---|---|---|
| E2/E3 | Numărul are WhatsApp? Viber? Există @username de Telegram? | al treilea buton din bara mobilă | mare — mulți preferă mesajul, nu apelul |
| B2 | **O singură fotografie cu teracotă** | pagina `/ro/servicii/teracota` capătă dovada proprie | mare pentru cuvântul-cheie „meșter teracotă" |
| G1 | Acordul scris de publicare a fotografiilor din lucrări | conformitate; fotografiile sunt deja publicate | mediu — risc juridic, nu tehnic |
| G3 | Trecerea ta prin cele 30 de fotografii: fețe, documente, numere de apartament, obiecte personale | conformitate | mediu |
| B7/D1 | Cifre pe care le poți dovedi: ani de experiență, număr de lucrări, garanție oferită | banda de încredere de pe prima pagină, acum goală | mare pentru conversie |
| G4 | 2-3 recenzii reale, cu numele clientului și acordul lui | secțiunea de recenzii, acum ascunsă | foarte mare pentru conversie |
| — | Traducerea în rusă, verificată de un vorbitor nativ | `/ru`, acum o pagină „în curând" | mare în Chișinău |

Regula rămâne cea din `CLAUDE.md`: **nu inventăm nimic**. O cifră neconfirmată
nu se rotunjește, secțiunea pur și simplu nu se randează.

---

## Sprint 7 — După lansare (opțional, în ordinea valorii)

1. **Analytics.** Vercel Web Analytics (fără cookie-uri, deci fără banner de
   consimțământ) înainte de GA4. Îți spune ce pagini aduc oameni și de unde.
   GA4 aduce cu el obligația unui banner de cookie-uri și o rescriere a
   secțiunii de cookie-uri din politică — de aceea nu este primul pas.
2. **Traducerea RU.** Cel mai mare câștig de audiență necucerit din Chișinău.
3. **Studii de caz pe proiect.** Ai 6 proiecte fotografiate pe etape; fiecare
   poate deveni o pagină proprie, care se poziționează singură.
4. **Promovarea CSP din Report-Only în enforcing**, după o rulare curată.
5. **Rate limiting persistent.** Cel actual este în memoria instanței — un plafon
   temporar documentat, nu controlul din ADR-010.

---

## Anexa A — răspunsul direct la întrebarea despre nameservere

> *„Ce nameservere să pun la TopHost?"*

**Le-ai pus deja corect:** `ns1.vercel-dns.com` și `ns2.vercel-dns.com`.
Nu mai schimba nimic la TopHost.

Ce a rămas nefăcut este **cealaltă jumătate a operațiunii**: delegarea
nameserverelor spune lumii „întreabă Vercel", dar Vercel nu are ce răspunde
până când domeniul nu este adăugat într-un proiect. Asta este Sprint 1, pasul
1.1, și durează un minut.

Consecința pe care merită să o știi: delegarea a mutat **toată zona**, nu doar
înregistrările web. Editorul de zonă din TopHost nu mai are efect asupra acestui
domeniu. Tot ce ține de mail — MX, SPF, DKIM, DMARC — se creează de acum în
Vercel (D-023).

---

## Anexa B — de ce nu apare niciun preț pe site

Regula este în `CLAUDE.md` și nu este negociabilă: nu inventăm prețuri,
garanții, recenzii sau localități. Un preț pe metru pătrat pus ca să umple o
pagină devine o promisiune publică pe care o vei renegocia la prima vizită, iar
în relația cu consumatorul asta contează.

Pagina `/ro/servicii/cat-costa-montajul-gresie-faianta` rezolvă aceeași intenție
de căutare **fără** să inventeze o cifră: explică exact ce mișcă prețul, în
ordinea impactului, și ce informații trebuie să dea clientul ca oferta să nu se
schimbe pe parcurs. Este mai util decât un număr fals și se poziționează pe
aceeași interogare.

În momentul în care îmi dai intervale pe care le poți susține, le pun.
