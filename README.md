# Cooch

**Party games for one phone.** Cooch is a mobile-first pass-and-play demo: the device moves around the table, each player gets a private reveal, and the group plays together. No accounts, no install, no backend.

**Live demo:** [cooch.vercel.app](https://cooch.vercel.app)

Built with Next.js 16 (App Router), React 19, TypeScript, and Motion. It ships with two complete games — **Guess the Impostor** and **Werewolf** — plus a 12-game catalog, a searchable word bank, local history, favorites, bilingual UI, and a PWA offline shell.

| Guess the Impostor | Werewolf |
| --- | --- |
| ![Guess the Impostor art](public/art/games/impostor.svg) | ![Werewolf art](public/art/games/werewolf.svg) |

## Status

Demo complete. Two live games, ten catalog entries marked “soon”, and a production build that passes typecheck, lint, and all browser regression checks. On desktop the app stays inside a phone frame with a bilingual reminder to open it on a phone.

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
- **Desktop phone stage** — on wide screens Cooch stays at phone width inside a phone mockup, with a bilingual “best on a phone” note and a copy-link action. The app itself remains mobile-first.

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

## Desktop view

Cooch is a pass-and-play phone game, so the desktop site does not stretch the mobile layout across the screen. At 768px and wider the app sits inside a phone shell; from 1024px a bilingual note explains that the full experience is on a phone and offers a copy-link button. The app inside the frame is fully interactive, so the demo can still be tried on a desktop. Layout breakpoints are container queries on `.phone-screen`, not viewport media queries.

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
components/DesktopStage.tsx  Phone shell, desktop note, route scroll reset
components/PhoneScrollbar.tsx  Draggable overlay rail for the phone screen
components/SideScroll.tsx  Horizontal scroller with a custom draggable rail
components/play/        Impostor and Werewolf screen flows
components/motion/      MotionProvider, Reveal, reduced-motion hook
app/styles/desktop.css  Stage/frame, fixed tab bar and toast, modal sizing
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
- The phone and horizontal rows use custom candy rails instead of native scrollbars. The phone rail supports drag and Arrow/Page/Home/End keys, exposes ARIA `scrollbar` semantics, and is labelled in both languages; horizontal rails are draggable and leave taps to the cards underneath.
- Buttons and holdable cards never behave like text: selection, the iOS long-press callout, drag ghosting, and the mobile tap highlight are suppressed, while ordinary page copy remains selectable.
- Semantic headings, labels, live regions, a skip link, and visible focus states are present throughout the flows.

## PWA

- `app/manifest.ts` provides the install metadata and icon.
- `public/sw.js` precaches the main pages, wave backgrounds, all 12 game thumbnails, empty-state/404 art, the icon, and the manifest.
- The cache version is `cooch-v6`.
- Registration is production-only. Offline reload works after one controlled online visit; it is not a first-load offline app.

## Verification snapshot

Verified on 2026-11-13 against the production build:

- `npm run typecheck` — pass.
- `npm run lint` — 0 errors, 21 intentional `react-hooks/set-state-in-effect` warnings (localStorage hydration and pass-and-play stage resets).
- `npm run build` — pass; all routes prerender or render as expected.
- Desktop regression at 1440×900, short 1024/768 viewports, and 320×844: phone frame and mobile stage, no horizontal overflow, fixed tab bar, route scroll reset, modal fit, toast containment, night stage, nav menu, and sticky CTA: pass.
- Custom scrollbars at 1440×900 and 390×844: phone rail visible/tracking, thumb drag (vertical `0 → 1267`), keyboard Home/End, route reset, native rails hidden, shots/card/chip rails visible and draggable (horizontal `0 → 241`), chip clicks not blocked, mobile rails visible, ARIA label survives ID→EN: pass.
- Full Impostor flow at 1440×900 and 390×844: setup → deal → clue → discussion → secret vote → result → replay: pass.
- Impostor 9-player/3-impostor guess flow: wrong guess → next round → correct guess → evil win, session clear, and history entry: pass.
- Full Werewolf flow at 1440×900 and 390×844 with Hunter enabled: reveal → Wolf/Doctor/Seer night → Hunter killed → Hunter shot → day vote → village win → replay: pass.
- History stat icons stay inside their banners at 1440 and 320; compact and full desktop announcements do not overlap the phone frame at 768/1024: pass.
- PWA `cooch-v6`: 26 precached entries, offline home with 13 cards and no broken art, offline word bank with 12 categories: pass.
- Production smoke test at [cooch.vercel.app](https://cooch.vercel.app): phone frame and note at 1440×900, copy-link toast, game detail without the tab bar, plain mobile stage at 390×844, `cooch-v6` service worker, no console errors: pass.
- Production scrollbar check: phone rail visible with the thumb as the hit target, vertical drag `0 → 1267`, keyboard Home/End, shots rail visible with native scrollbar hidden, horizontal drag `0 → 201`, phone rail absent at 390px: pass.
- Selection check at 1440×900 and on production: buttons, hold buttons, pick cards, and reveal cards expose `user-select: none`, transparent tap highlight, and no drag ghost; drag selection stays empty on all of them, ordinary page text still selects, and hold-to-confirm still advances: pass.

Earlier verification (2026-11-12): PWA offline home, cached card art, wave backgrounds, offline word-bank search, Chameleon privacy, tie/revote, hand-count voting, resume gates, favorites, setup drafts, art, and motion checks: pass.

The Playwright scripts used for these checks live outside the repository and are not committed as an automated test suite.

## Known limitations

- **No backend.** There are no accounts, online rooms, cloud sync, or server-side validation. Clearing site data removes all local progress.
- **Only two games are playable.** The other ten catalog entries are metadata-only “soon” placeholders.
- **Desktop is intentionally phone-width.** There is no separate wide-screen layout; the app is shown inside a phone frame with a reminder to use a phone.
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
