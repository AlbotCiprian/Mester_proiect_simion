# Analytics, KPI & CRO

## Funnel

1. impression;
2. organic/social/referral click;
3. landing view;
4. service/project engagement;
5. CTA interaction;
6. form start;
7. lead submit;
8. contacted;
9. evaluation;
10. offer;
11. accepted;
12. completed;
13. review.

## Event taxonomy

| Event | Parametri acceptați |
|---|---|
| `cta_click` | placement, action, locale, page_type |
| `contact_click` | channel, placement, page_type |
| `project_view` | project_id, service_ids |
| `gallery_interaction` | project_id, interaction_type |
| `form_start` | form_type, source_page |
| `form_step_complete` | form_type, step |
| `form_submit` | form_type, service_id, locality_id, has_upload |
| `estimate_complete` | service_id, complexity_band |
| `locale_change` | from, to |

Nu se trimit PII, mesajul utilizatorului, adresa sau numele fișierelor private.

## Attribution

- first landing și current session source;
- UTM sanitizate și persistate în lead;
- referrer;
- Google Business Profile tracking UTM;
- partener/referral code controlat;
- call clicks distinct de calls completed.

## KPI dashboard

### Marketing

- organic users/impressions/CTR;
- rank/landing groups;
- conversion rate per page/service/locale;
- CTA distribution;
- content-assisted leads.

### Operations

- lead quality;
- time to contact;
- SLA breaches;
- status conversion;
- lost reasons;
- service/locality demand.

### Business

- accepted projects;
- estimated revenue per source;
- offer-to-contract rate;
- average project value, dacă este introdus;
- repeat/referral share.

## Tools

- GA4;
- Search Console;
- Vercel Web Analytics și Speed Insights;
- Looker Studio pentru agregare;
- Clarity doar cu consent și masking configurat;
- admin summary poate folosi agregări, nu replică toate dashboard-urile externe.

## CRO backlog

- hero proposition test;
- CTA „estimare” vs „trimite poze”;
- form short vs multi-step;
- proof order: proiect vs trust metrics;
- sticky CTA timing;
- service page project placement.

Testele necesită trafic suficient și o singură ipoteză clară. Nu se declară câștigător pe volume nesemnificative.

## Consent

- analytics neesențial conform politicii aprobate;
- mode/consent state respectat;
- events critice de funcționare nu includ tracking comercial ascuns;
- tag-urile terțe se încarcă controlat.

## Acceptance criteria

- evenimente documentate și validate în Preview;
- form submit nu se dublează;
- UTM ajunge în CRM;
- PII audit trecut;
- dashboard-ul diferențiază click-to-call de call tracking real.
