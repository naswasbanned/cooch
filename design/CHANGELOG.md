# Changelog

## 2026-11-11 — Phase 3 PRD / DESIGN alignment audit
- Compared the existing Phase 3 pages and scripts with `PRD.md` and `DESIGN.md` after the user asked to resume this work.
- Confirmed three-item page tabbars, light-default styling, text-only narration, secret handoff/reveal, Guess the Impostor rounds, Werewolf sample night/day flow, and host-setting UI are already represented.
- Documented what is static prototype state versus implemented front-end behavior in `PERSONA-RATIONALE.md` §9. No locked Phase 1/2 component was modified.
- No gameplay logic or persistence was added: the earlier Phase 3 scope explicitly deferred those to backend/runtime work.

## 2026-11-11 — Phase 4 Next.js migration
- Froze the approved design in `design-baseline/` and added 13 statically imported React/TSX page views with shared React components in the Next.js App Router.
- Made the light theme the default, as requested. Night theme remains opt-in for Werewolf night screens. Settings now selects light by default.
- Removed the HTML parsing bridge, its dependency, and the duplicate `public/baseline/` tree. The baseline still supplies global CSS and existing page interaction scripts.
- Added `app/MIGRATION-MAP.md`. Production build and TypeScript checking pass. Earlier DOM, screenshot, and interaction checks predate the final JSX/light-theme conversion and are not claimed as final-version visual verification.
- Graphify code graph updated manually. Semantic indexing remains unavailable by user's code-only choice. Git hooks could not be installed because this workspace has no writable Git repository.

## 2026-11-11 — Phase 1 approved, Phase 2 closed without revisions
- All components: no changes. User: "All good you can proceed to the next phase".
- `.btn--danger`: kept white on coral-600 (4.41:1). This was listed as an open decision in DESIGN-GUIDE.md and accepted as-is with the approval.
- Created `LOCK`.

## 2026-11-11 — Phase 3 pages
- Added 13 pages in `pages/` (home, catalog, 2 game details, 2 setups, 2 play flows, how-to, history, settings, privacy, 404) with `pages.css` and `pages/js/*`.
- New components (not locked): `game-bar`, `pick-list`, `sticky-cta`, `empty-state`. Reasons in PERSONA-RATIONALE.md §6.
- Locked components: no file changed. One workaround for the card favorite-button overlay bug lives in `pages.css`, pending user approval to move into `card.css`.
- `persona/persona.md` marked as confirmed (user: "Yes use it for now").
