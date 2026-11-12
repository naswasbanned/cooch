# Cooch

**Party games for one phone.** Cooch is a mobile-first pass-and-play demo: the device moves around the table, each player gets a private reveal, and the group plays together. No accounts, no install, no backend.

Built with Next.js 16 (App Router), React 19, TypeScript, and Motion. It ships with two complete games — **Guess the Impostor** and **Werewolf** — plus a 12-game catalog, a searchable word bank, local history, favorites, bilingual UI, and a PWA offline shell.

| Guess the Impostor | Werewolf |
| --- | --- |
| ![Guess the Impostor art](public/art/games/impostor.svg) | ![Werewolf art](public/art/games/werewolf.svg) |

## Status

Demo complete. Two live games, ten catalog entries marked “soon”, and a production build that passes typecheck, lint, and all browser regression checks.

## Features

- **Pass-and-play privacy** — handoff screens, hold-to-reveal secret cards, and no game secrets visible under navigation.
- **Two real game engines** — complete setup, deal, play, vote, win-check, result, and replay flows.
- **Bilingual** — Indonesian is the default; English is a full second dictionary.
- **Persistent by design** — settings, favorites, history, active sessions, and per-game setup drafts live in `localStorage`.
- **Catalog and word bank** — search, category chips, player/duration/level filters, favorites, empty states, and 10 word categories with 100 words.
- **History and stats** — games played, longest session, citizen win rate, weekly streak, recent games, and a champions podium.
- **Settings** — language, light/night/system theme, text size, vibration, reduced motion, custom word categories, and clear-local-data.
- **PWA offline shell** — manifest, service worker, precached pages and art, offline home and word-bank search.
- **Motion with restraint** — page/section reveals, card feedback, nav and toast transitions, phase changes, and result celebrations.
- **Hand-authored art** — 12 game thumbnails, wave backgrounds, confetti, empty-state, and 404 illustrations in `public/art/`.

## Quick start

Requires **Node.js 20.9 or newer**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run start
```

Use a different port if needed:

```bash
npm run start -- -p 3100
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint (Next core-web-vitals + TypeScript). |
| `npm run typecheck` | Run `tsc --noEmit`. |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: resume banner, featured game, recently played, catalog, favorites. |
| `/games` | Full catalog with search, categories, and advanced filters. |
| `/games/[slug]` | Game detail, steps, roles, rules, similar games, and play CTA. |
| `/play/impostor/setup` | Impostor player names, impostor count, Chameleon, categories, timer, guess option. |
| `/play/werewolf/setup` | Werewolf composition, day timer, voting mode, tie rule, Hunter, moderator mode. |
| `/play/impostor` | Full Guess the Impostor pass-and-play session. |
| `/play/werewolf` | Full Werewolf pass-and-play session. |
| `/how-to` | Rules overview, leak-prevention tips, FAQ, and privacy link. |
| `/word-bank` | Searchable built-in word bank grouped by category. |
| `/history` | Local stats, streak, recent games, and champions podium. |
| `/settings` | Language, appearance, text size, vibration, reduced motion, categories, data. |
| `/privacy` | Plain-language local-data and privacy explanation. |
| `/gallery` | Component gallery for the design system. |
| `*` | Bilingual 404 page. |

## The games

### Guess the Impostor

3–20 players. One or more impostors get no secret word; citizens share one. Players give clues in order, discuss against a timer, then pass the phone for a secret vote. The group can eliminate a player, and an impostor may get one final guess at the word. Optional Chameleon mode gives one citizen a lookalike word without revealing that they are the Chameleon.

### Werewolf

5–20 players. Roles include Werewolves, Villagers, Seer, Doctor, and an optional Hunter. Night actions run Wolf → Doctor → Seer; morning announces the result; the day ends in a secret or hand-count vote. Ties follow the configured rule (no execution or revote). The Hunter can take one shot when eliminated. The UI switches to the night theme automatically during night phases and returns to the player’s theme afterwards.

Both games save an active session, so a reload can resume the current phase. Finished games are written to local history.

## Architecture

```text
app/                    Next.js routes, layout, manifest, global styles
components/             UI, game screens, setup panels, motion primitives
components/play/        Impostor and Werewolf screen flows
components/motion/      MotionProvider, Reveal, reduced-motion hook
lib/game/               Pure typed game engines and state transitions
lib/                    settings, storage, session, history, favorites, i18n, words
public/art/             Hand-authored SVG art and backgrounds
public/sw.js            PWA offline shell
scripts/make-art.py     Art generator used for the SVG set
design/                 Original static design sheet
```

The game engines in `lib/game/` are deliberately pure state transitions. The UI calls them through a small action API, which is the seam a future backend can replace without rewriting the screens.

## Data and privacy

- No accounts, analytics, backend calls, or cloud sync.
- All player data stays in this browser’s `localStorage`.
- Stored keys cover settings, favorites, history, the active session, and per-game setup drafts.
- “Clear local data” in Settings removes all `cooch.*` keys.
- The privacy page explains the local-only model in plain language.

## Motion and accessibility

- Motion uses `LazyMotion` with `domAnimation` and `strict`, so only `m.*` components are used and drag/layout features stay out of the bundle.
- Page and section reveals, card hover/tap, nav and toast transitions, hold/reveal feedback, phase changes, and result celebrations all use Motion.
- The app’s **Kurangi gerak / Reduce motion** setting and the OS `prefers-reduced-motion` preference are both respected. Transform animations, hover lifts, floating loops, and gesture effects are disabled while content stays visible and usable.
- CSS still handles simple hover/press states, focus rings, and the chunky button edge.
- Semantic headings, labels, live regions, a skip link, and visible focus states are present throughout the flows.

## PWA

- `app/manifest.ts` provides the install metadata and icon.
- `public/sw.js` precaches the main pages, wave backgrounds, all 12 game thumbnails, empty-state/404 art, the icon, and the manifest.
- The cache version is `cooch-v5`.
- Registration is production-only. Offline reload works after one controlled online visit; it is not a first-load offline app.

## Verification snapshot

Verified on 2026-11-12 against the production build:

- `npm run typecheck` — pass.
- `npm run lint` — 0 errors, 21 intentional `react-hooks/set-state-in-effect` warnings (localStorage hydration and pass-and-play stage resets).
- `npm run build` — pass; all routes prerender or render as expected.
- Browser checks at 390×844 and 320×844 in Indonesian and English: all routes load, no horizontal overflow, and no unexpected console errors.
- Full Impostor and Werewolf flows, Chameleon privacy, wrong/correct guesses, Hunter, tie/revote, hand-count voting, resume gates, history, favorites, setup drafts, and result screens: pass.
- PWA offline home, cached card art, wave backgrounds, and offline word-bank search: pass.
- Motion checks: page reveal settles, card hover lifts, mobile nav opens/closes, toast enters/exits, and reduced-motion disables the hover lift: pass.
- Art and layout checks at 375px, 390px, and 1440px: pass.

The Playwright scripts used for these checks live outside the repository and are not committed as an automated test suite.

## Known limitations

- **No backend.** There are no accounts, online rooms, cloud sync, or server-side validation. Clearing site data removes all local progress.
- **Only two games are playable.** The other ten catalog entries are metadata-only “soon” placeholders.
- **PWA offline is not first-load offline.** The service worker must control the page after one online visit and a production build.
- **Placeholder contact email.** `halo@cooch.example` in the privacy page must be replaced before launch.
- **Art is hand-authored SVG.** The Gemini image models available during the build returned HTTP 429 with a free-tier quota of 0, so the 18 SVGs are the deliberate fallback.
- **Vibration depends on the device.** `navigator.vibrate` is used only when supported and enabled; iOS Safari may ignore it.
- **No committed automated test suite.** Browser regression checks are external scripts, not part of `npm test`.

## Project documents

- `MISSION.md` — objective, non-negotiables, acceptance criteria.
- `STATE.md` — implementation record, verification results, decisions, and limitations.
- `PRD.md` — product requirements.
- `DESIGN.md` — design system, screens, and interaction decisions.
- `design/` — original static design sheet used for visual parity.

Cooch is a finished frontend demo with a clear backend seam — not a claim of a live service.
