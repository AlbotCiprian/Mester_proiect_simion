---
paths:
  - "app/(public)/**/*.{ts,tsx}"
  - "components/public/**/*.{ts,tsx}"
  - "components/marketing/**/*.{ts,tsx}"
  - "styles/**/*.css"
---

# Public frontend rules

- Read `docs/specs/06-FRONTEND-CREATIVE-DIRECTION.md`, `07-DESIGN-SYSTEM-UI-UX.md`, and `08-MOTION-IMMERSIVE-EXPERIENCE.md` before editing.
- Implement a custom editorial interface, not a generic construction template.
- Do not use shadcn/ui as the public visual language.
- Use semantic HTML and Server Components by default.
- Client Components must have a documented interaction requirement.
- Every visual effect needs a static and reduced-motion fallback.
- Core service text, CTA, navigation, and project content must remain usable without animation.
- Images require meaningful alt text or an explicit decorative role.
- Prevent layout shifts by reserving media dimensions.
