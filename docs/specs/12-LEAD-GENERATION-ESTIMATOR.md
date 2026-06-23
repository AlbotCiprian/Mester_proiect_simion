# Lead Generation & Estimator

## Canale de conversie

- apel;
- Viber;
- Telegram;
- email;
- formular rapid;
- callback;
- cerere avansată cu imagini;
- estimator orientativ.

## Formular rapid

Câmpuri P0:

- nume;
- telefon;
- localitate;
- serviciu;
- mesaj opțional;
- acord privind prelucrarea datelor.

Țintă: completare sub 45 secunde.

## Cerere avansată

Pași recomandați:

1. tip proprietate și lucrare;
2. cameră/suprafață/stare actuală;
3. format material și complexitate cunoscută;
4. localitate și termen;
5. imagini;
6. contact și canal preferat;
7. review și consimțământ.

Țintă: sub 90 secunde fără upload, sub 3 minute cu media.

## Estimator

### Input

- suprafață aproximativă;
- serviciu;
- format placă;
- stare suport;
- demontare;
- hidroizolație;
- localitate;
- urgență.

### Output

- interval orientativ sau nivel de complexitate;
- factori care pot schimba prețul;
- ce informații lipsesc;
- CTA pentru evaluare.

Nu emite ofertă contractuală, nu garantează termen și nu colectează date inutile înainte de rezultat.

## Upload

- upload direct și controlat în Vercel Blob;
- allowlist imagini și eventual PDF;
- limite per fișier și per cerere;
- progres, retry și anulare;
- scanare/validare MIME server-side;
- fișiere private sau cu acces controlat;
- cleanup pentru upload-uri neasociate.

## Anti-abuz

- Turnstile validat server-side;
- honeypot;
- rate limiting;
- idempotency key pentru submit;
- detecție duplicate rezonabilă;
- fără blocarea utilizatorilor legitimi după o singură eroare.

## Notifications

- salvarea DB este tranzacția principală;
- e-mail intern Resend;
- confirmare utilizator fără a expune date sensibile;
- Telegram opțional;
- retry și status pentru notificări;
- administratorul vede lead-ul chiar dacă notificarea eșuează.

## Tracking

Evenimente:

- `lead_form_started`;
- `lead_step_completed`;
- `lead_upload_started/completed`;
- `lead_form_submitted`;
- `estimate_started/completed`;
- `contact_click` cu canal și context.

Nu se trimit PII sau textul mesajului în analytics.

## Acceptance criteria

- validare server-side completă;
- submit idempotent;
- upload sigur;
- lead + source + UTM persistate;
- e-mail și fallback testate;
- mesaje RO/RU complete;
- accesibilitate și recovery după eroare.
