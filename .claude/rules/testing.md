---
paths:
  - "tests/**/*"
  - "e2e/**/*"
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
  - "playwright.config.*"
  - "vitest.config.*"
---

# Testing rules

- Test behavior and contracts, not implementation trivia.
- Cover success, validation, authorization, empty, error, timeout, retry, and duplicate-submit states where relevant.
- Critical E2E paths: service discovery, project view, lead submission, upload, admin auth, content publication, and lead status updates.
- Include accessibility checks and mobile viewport coverage.
- Never declare a test passed unless it was executed and the result was observed.
