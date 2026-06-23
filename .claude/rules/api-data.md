---
paths:
  - "app/api/**/*.ts"
  - "lib/server/**/*.ts"
  - "lib/data/**/*.ts"
  - "prisma/**/*"
---

# API and data rules

- Validate all external input server-side with a schema.
- Keep authorization checks next to protected operations.
- Use Prisma/PostgreSQL for relational data and Vercel Blob for binaries.
- Define transaction boundaries for multi-record writes.
- Use explicit pagination, stable ordering, and indexed filters for admin lists.
- Do not log form content, phone numbers, email addresses, addresses, tokens, or signed URLs.
- Record migration and retention implications before schema changes.
