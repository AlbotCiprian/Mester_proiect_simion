# Working Decisions

Permanent architecture decisions belong in `docs/specs/05-ARCHITECTURE-DECISION-RECORDS.md`.
This file records implementation-level decisions and pending proposals.

| ID | Date | Status | Decision | Reason | Affected modules | Approved by |
|---|---|---|---|---|---|---|
| D-001 | 2026-06-23 | Accepted | Single canonical `CLAUDE.md` (root, RO); removed duplicate `docs/specs/CLAUDE.md` and orphan `CLAUDE copy.md` | Only the root file is auto-loaded; avoid divergence | orchestration/config | owner |
| D-002 | 2026-06-23 | Accepted | Research consolidated under `docs/research/` (single copy); brief renamed to `MASTER_PROMPT_WEBSITE_PREMIUM.md`; `docs/specs/references/` removed | De-duplicate research; align with requested structure | docs | owner |
| D-003 | 2026-06-23 | Accepted | Added empty code scaffolding (`app/`, `components/`, `lib/`, `prisma/`, `public/`, `tests/`) + local config files; no product code before Gate A | Match requested repo tree while preserving Gate A | repo structure | owner |
