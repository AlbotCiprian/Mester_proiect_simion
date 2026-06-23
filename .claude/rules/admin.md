---
paths:
  - "app/(admin)/**/*.{ts,tsx}"
  - "components/admin/**/*.{ts,tsx}"
---

# Admin rules

- Optimize for clarity, keyboard use, desktop, and tablet workflows.
- shadcn/ui primitives are permitted only after visual customization.
- Every destructive action needs confirmation and a recoverability strategy where feasible.
- Enforce authentication and authorization server-side; hidden routes are not security.
- Never expose lead PII in analytics, client logs, error messages, or URLs.
- Lists must define loading, empty, error, filtered, and permission-denied states.
