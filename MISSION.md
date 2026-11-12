# MISSION — Cooch Next.js Demo

## Objective
Convert the completed Cooch design sheet (static HTML/CSS in `design/`) into a production-shaped Next.js + React + TypeScript app. Build every website page from `PRD.md` and `DESIGN.md`, migrate all design components, and ship a full demo that is ready to connect to a backend.

## Non-negotiables
- Mobile-first pass-and-play; light theme default; night theme only for Werewolf night.
- Bilingual Indonesian (default) and English; no accounts; localStorage persistence; PWA/offline intent.
- Reuse the design tokens and BEM component CSS for visual parity.
- Real client-side game logic for Guess the Impostor and Werewolf, with a clean seam for a future backend.
- Every page from PRD/DESIGN exists: home, catalog, game detail, setup, play, how-to, history, settings, privacy, 404, plus a component gallery.
- No claiming unimplemented backend features. Document limitations honestly.

## Acceptance
1. `npm run build` passes (lint + TypeScript).
2. All routes render without runtime errors.
3. Impostor: setup → reveal → clue turn → discussion → secret voting → elimination/guess → win check → result → replay.
4. Werewolf: setup → reveal → night actions → day → vote → execution → hunter → win check → result → replay.
5. Settings (language, theme, text size, vibration, reduced motion, clear data) work and persist.
6. History, favorites, resume session, and catalog search/filter work from localStorage.
7. PWA manifest + service worker present.

## Status
See `STATE.md` for live progress.
