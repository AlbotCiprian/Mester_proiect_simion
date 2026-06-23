---
paths:
  - "app/api/**/*.ts"
  - "app/(admin)/**/*.{ts,tsx}"
  - "lib/auth/**/*.ts"
  - "lib/security/**/*.ts"
  - "prisma/**/*"
---

# Security rules

- Apply least privilege and deny-by-default to admin operations.
- Threat-model auth, uploads, preview access, lead PII, webhooks, rate abuse, IDOR, XSS, CSRF, and injection.
- Verify upload MIME, extension, size, ownership, and lifecycle server-side.
- Require replay protection or signature verification for webhooks.
- Keep Preview and Admin routes non-indexable.
- Never read or edit `.env*` files through the agent.
- A security requirement may not be removed to simplify implementation without explicit approval.
