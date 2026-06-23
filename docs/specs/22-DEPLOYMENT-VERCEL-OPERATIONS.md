# Deployment & Operations — Vercel

## Plan

- Vercel Pro pentru producție comercială;
- GitHub repository când implementarea este autorizată;
- `main` production, `develop` integration opțional, feature branches;
- Preview deployment per PR;
- Production promotion controlat.

## Environments

### Development

- DB local/dev Neon;
- Blob dev separat;
- Resend sandbox/test recipient;
- analytics disabled/debug.

### Preview

- noindex și deployment protection unde este posibil;
- DB branch/staging fără PII production;
- Blob preview namespace;
- e-mail restricționat;
- Turnstile test keys.

### Production

- domeniu final;
- Neon production;
- Blob production;
- Resend verified domain;
- analytics/consent real;
- monitoring și alerts.

## Environment variables

Categorii:

- DB URLs și pooling;
- auth secrets;
- Blob tokens;
- Resend keys/from addresses;
- Turnstile keys;
- Telegram webhook/token optional;
- analytics IDs;
- app URL și canonical host.

Secretele nu se copiază în client și nu se reutilizează între medii.

## Database migrations

1. migration generată și review-uită;
2. aplicată pe dev;
3. testată pe preview/staging;
4. backup/checkpoint production;
5. deploy compatibil forward/backward;
6. migration production;
7. smoke tests;
8. rollback logic documentată.

## Revalidation

Admin publish declanșează revalidarea exactă pentru entitate, colecție, sitemap și paginile care o referențiază. Nu se face full rebuild pentru orice editare minoră dacă tag revalidation este suficientă.

## Cron/maintenance

- cleanup upload orphans;
- reminder/notification retries;
- sitemap/llms refresh dacă nu este on-demand;
- retention/anonymization jobs;
- health checks.

Cron-urile trebuie idempotente, observabile și protejate.

## Rollback

- rollback deployment Vercel;
- compatibilitate DB cu versiunea anterioară pentru schimbări riscante;
- feature flags pentru funcții noi;
- media deletion cu grace period;
- incident log și postmortem pentru incidente relevante.

## Monitoring

- Vercel logs/Speed Insights;
- uptime monitor extern `CONFIRM_TECH`;
- error tracking recomandat;
- alerte e-mail/Telegram pentru lead notification failure și auth anomalies;
- cost/usage monitor pentru Neon, Blob și Vercel.

## Domain & launch

- `.md` recomandat pentru local relevance, denumire `CONFIRM_OWNER`;
- DNS, www/non-www canonical;
- SSL;
- SPF/DKIM/DMARC pentru e-mail;
- GSC/Bing verification;
- redirect-uri și 404 audit;
- soft launch înaintea promovării.

## Acceptance criteria

- medii izolate;
- Preview neindexabil;
- restore DB testat;
- rollback verificat;
- env vars documentate fără valori;
- production smoke test și alerting funcțional.
