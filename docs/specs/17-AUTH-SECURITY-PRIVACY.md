# Authentication, Security & Privacy

## Auth scope

- un administrator P0;
- Better Auth preferat;
- sesiuni server-side/DB;
- cookies `HttpOnly`, `Secure`, `SameSite` adecvat;
- password hashing modern;
- resetare cu token scurt și one-time;
- opțional 2FA/passkey după validarea UX.

## Threat model

| Amenințare | Control principal |
|---|---|
| brute force / credential stuffing | rate limit, lockout gradual, 2FA optional, audit |
| session theft | secure cookies, rotation, logout global |
| CSRF | same-site, token/origin validation unde este necesar |
| XSS | escaping, CSP compatibilă cu static delivery, fără HTML nesanitizat |
| SQL injection | Prisma/prepared queries + validation |
| IDOR | authorization per entity, nu doar rută |
| malicious upload | allowlist, MIME/magic bytes, size, private storage |
| spam/rate abuse | Turnstile, honeypot, rate limit, idempotency |
| draft exposure | auth, noindex, preview protection |
| webhook spoofing | signatures/secrets, timestamp și idempotency |
| PII leakage | redaction logs, analytics policy, least privilege |
| dependency vulnerability | lockfile, scanning și update policy |

## Security headers

- HSTS după validarea domeniului;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- CSP strictă și compatibilă cu ISR;
- frame-ancestors / clickjacking protection;
- headers diferite pentru admin dacă este necesar.

## Authorization

- server-side la fiecare mutație și read sensibil;
- rolurile nu sunt ascunse doar în UI;
- signed URLs au scope și expirare;
- exportul și ștergerea sunt acțiuni auditate;
- audit payload nu include secrete sau PII completă.

## Privacy by design

- formularele cer minimum necesar;
- adresă exactă doar când este necesară operațional;
- consimțământ separat pentru marketing, recenzie și publicarea proiectului;
- retenții configurate;
- proces de acces, rectificare și ștergere;
- procesatorii externi enumerați în politica de confidențialitate;
- documentele juridice verificate de specialist local.

## Logging

Nu se loghează:

- parole/tokenuri;
- payload complet al lead-ului;
- telefon/email integral în logs generale;
- URL privat semnat;
- conținut attachment.

Se loghează:

- request correlation ID;
- tipul erorii;
- actor/admin ID;
- entity ID;
- rezultat notificare;
- rate-limit/security events agregate.

## Backup și recovery

- Neon backup/PITR conform planului ales;
- export periodic pentru date critice;
- test de restore, nu doar existența backup-ului;
- inventar separat pentru Blob și metadata;
- rotație secret după incident.

## Security release gate

- auth și permissions E2E;
- upload abuse tests;
- CSP/headers audit;
- admin/preview noindex;
- PII analytics audit;
- dependency scan fără vulnerabilități critice cunoscute;
- incident contact și runbook documentat.
