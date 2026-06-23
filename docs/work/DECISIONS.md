# Working Decisions

Permanent architecture decisions belong in `docs/specs/05-ARCHITECTURE-DECISION-RECORDS.md`.
This file records implementation-level decisions and pending proposals.

| ID | Date | Status | Decision | Reason | Affected modules | Approved by |
|---|---|---|---|---|---|---|
| D-001 | 2026-06-23 | Accepted | Single canonical `CLAUDE.md` (root, RO); removed duplicate `docs/specs/CLAUDE.md` and orphan `CLAUDE copy.md` | Only the root file is auto-loaded; avoid divergence | orchestration/config | owner |
| D-002 | 2026-06-23 | Accepted | Research consolidated under `docs/research/` (single copy); brief renamed to `MASTER_PROMPT_WEBSITE_PREMIUM.md`; `docs/specs/references/` removed | De-duplicate research; align with requested structure | docs | owner |
| D-003 | 2026-06-23 | Accepted | Added empty code scaffolding (`app/`, `components/`, `lib/`, `prisma/`, `public/`, `tests/`) + local config files; no product code before Gate A | Match requested repo tree while preserving Gate A | repo structure | owner |
| D-004 | 2026-06-24 | Accepted | Frontend design prototype started ahead of Gate A at owner's explicit request: Next.js 15 (App Router, TS strict) + Tailwind v4 tokens, custom "Precision Atelier" homepage. All copy is placeholder (CONFIRM_OWNER); imagery is open-source (Unsplash) stand-in; build is `noindex`. Production publication remains blocked by Gate A. | Owner wants an early visual; design direction (spec 06–09) can proceed on placeholders without inventing business claims | foundation, design-system, public-web | owner |
