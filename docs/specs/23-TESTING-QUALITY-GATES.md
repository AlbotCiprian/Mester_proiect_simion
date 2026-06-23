# Testing & Quality Gates

## Test pyramid

### Unit

- validări Zod;
- estimator rules;
- slug/canonical/hreflang helpers;
- status transitions;
- permission checks;
- analytics payload sanitization.

### Integration

- database repositories;
- lead creation transaction;
- Blob metadata flow;
- Resend/Telegram adapters;
- auth/session;
- revalidation after publish;
- webhook signatures/idempotency.

### E2E — Playwright

- homepage și locale navigation;
- service → project → lead;
- formular rapid;
- cerere avansată + upload;
- estimator;
- admin login/logout;
- CRUD project și publish;
- lead status/note/follow-up;
- permission/noindex;
- 404 și error recovery.

## Specialized testing

- axe și manual accessibility;
- Lighthouse/CWV budgets;
- structured data validation;
- sitemap/robots/llms;
- security headers;
- upload malformed/oversized/spoofed MIME;
- rate limit și duplicate submit;
- iOS Safari / Android Chrome;
- reduced motion și slow network;
- backup/restore;
- notification failure/retry;
- PII analytics audit.

## Release gates

### Gate 1 — Build integrity

- typecheck, lint, tests și build verzi;
- migration validată;
- fără secrete/scans critice.

### Gate 2 — Functional P0

- toate flows P0 funcționează;
- content și translations complete;
- admin și media operational.

### Gate 3 — Quality

- zero broken links;
- zero console errors în flows normale;
- accessibility fără critical/serious neacceptate;
- budgets respectate;
- schema/sitemap valide.

### Gate 4 — Operations

- backup și rollback;
- alerts;
- analytics;
- legal/consent;
- owner training și admin guide.

## Acceptance criteria globale

- paginile publice canonice sunt indexabile;
- admin și preview protejate/noindex;
- formularele și upload-ul sunt sigure;
- CTA tracking complet;
- fără PII în analytics/logs;
- fallback media și motion funcțional;
- toate afirmațiile comerciale sunt confirmate;
- documentația este actualizată.

## Bug severity

- S0: breach/data loss/site indisponibil — block release;
- S1: lead loss/auth bypass/form broken — block release;
- S2: funcție majoră degradată — fix înainte de launch sau acceptare explicită;
- S3: defect vizual minor — backlog cu termen;
- S4: enhancement.

## Test data

- date fictive marcate clar;
- fără copii neanonimizate de producție;
- fixtures RO/RU și imagini de test cu drepturi;
- cleanup după E2E.
