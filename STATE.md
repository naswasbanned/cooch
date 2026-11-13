# STATE — Cooch Next.js Demo

- Status: complete (frontend demo + art pass + Motion pass + desktop phone stage)
- Last update: 2026-11-13
- Mission: `MISSION.md`
- Source design: `design/` · Product notes: `PRD.md`, `DESIGN.md`

## Objective

Convert the static Cooch design sheet into a production-shaped Next.js + React + TypeScript
website: every page, real client-side Impostor and Werewolf games, bilingual ID/EN,
localStorage persistence, PWA, and no false claims about backend features.

## Completed

### Foundation
- Next.js 16.4.6 App Router, React 19.3.1, TypeScript 5.9; `npm run build` and
  `npm run typecheck` pass.
- Design tokens and BEM CSS copied into `app/styles/`; `app/globals.css` adds only
  app-level fixes (responsive sticky CTA, narrow navbar brand, Werewolf composition rows).
- Fredoka + Nunito via `next/font/google`, mapped to `--font-display` / `--font-body`.
- 44-icon sprite in `components/IconSprite.tsx`; typed `Icon` component.
- `eslint.config.mjs` (flat config, Next core-web-vitals + TypeScript).
  `npm run lint` exits 0 with 21 intentional `react-hooks/set-state-in-effect` warnings
  (localStorage hydration and pass-and-play stage resets run in effects).

### Pages
- `/` home: resume banner, featured card, recently played, searchable catalog, favorites.
- `/games` catalog: bilingual search, category chips, advanced players/duration/level
  filters, result count, reset, empty state.
- `/games/[slug]` detail for all 12 registry entries: steps, roles, rules dialog,
  similar games, sticky mobile CTA; “soon” games show a toast and have no play route.
- `/play/[slug]/setup` for both games: player names, roles/composition, word categories,
  timer, voting mode, tie rule, Doctor self-protection, Hunter, moderator mode, saved drafts.
- `/play/[slug]`: full pass-and-play game screens (see engines below).
- `/how-to` FAQ accordion, leak tips, privacy link.
- `/history`: real localStorage stats, streak, recent games, leaderboard, empty state.
- `/settings`: language, theme, text size, vibration, reduce motion, custom categories,
  clear local data, about.
- `/privacy`, `/not-found`, `/gallery` (component gallery), `/word-bank` (searchable
  built-in word bank grouped by category, with custom-category and setup links).

### Mobile polish (revision)
- Home/catalog card grids use one card per row below 768px, so cards no longer feel
  crowded at 375×667 or 320px; tablet/desktop columns are unchanged.
- Reveal cards and hold-to-confirm buttons prevent text selection, native callouts,
  child-element dragging, and `dragstart`, so holding no longer selects the card.
- Werewolf deal handoff now tells the table to put the phone in the middle and lets the
  named player pick it up while everyone else closes their eyes.
- The word bank is data-driven from `lib/words.ts` (10 categories, 100 words) and ready
  for future additions; custom categories remain available in Settings.
- Footer text and link groups are centered below 768px (brand, both link columns, and the
  bottom row), while tablet/desktop keep the left-aligned layout.

### Desktop phone stage (revision)
- Cooch stays a phone-width app on desktop: `components/DesktopStage.tsx` wraps every route in a
  physical phone shell at ≥768px instead of stretching the mobile layout across the viewport.
- A bilingual announcement sits beside the frame at ≥1024px and becomes a compact badge at
  768–1023px. It explains pass-and-play and offers a copy-link action with a toast.
- App breakpoints are now container queries keyed to `.phone-screen`, so layouts respond to the
  phone width rather than the desktop viewport. Viewport media queries remain only for the stage
  and frame itself.
- The global tab bar and toast viewport moved into the phone shell, outside the scrolling screen;
  the tab bar only appears on `/`, `/games`, `/settings`, and `/word-bank`. Route changes reset
  the phone scroll position.
- Dialogs are constrained to the phone screen, the stage gets a dark night-theme background, and
  the compact announcement no longer overlaps the frame at 768px.
- History stat labels were shortened and the narrow banner was tightened so the decorative icons
  stay inside their cards at 320px.

### Art pass
- Hand-authored 18 SVGs in `public/art/`: 12 game thumbnails (4:3) in
  `public/art/games/`, three wavy backgrounds (`bg-waves-sky.svg`,
  `bg-waves-night.svg`, `bg-waves-sun.svg`), plus `confetti.svg`,
  `empty-cards.svg`, and `not-found.svg`.
- `GameMeta.art` carries each thumbnail; `GameCard` and `GameDetail` render it through
  `components/ArtImage.tsx`, a tiny SVG-safe `<img>` wrapper that intentionally bypasses
  the raster image optimizer. Cards keep the icon fallback if art is missing.
- Card art is absolutely positioned with `object-fit: cover`; corner badges and favorite
  buttons sit above it. Body, night theme, and footer use the wave SVGs as decorative
  backgrounds; empty states and the 404 page use the state illustrations.
- Art direction matches the token palette: warm cream surfaces, grape/sun/sky/leaf
  accents, chunky rounded shapes, no embedded text.
- The art is generated by `scripts/make-art.py`, so revisions can be made and the set
  regenerated. Gemini raster models were unavailable (HTTP 429, free-tier quota 0), so
  the final assets are hand-authored SVG rather than AI raster art.

### Motion pass
- `motion` (`motion/react`) is the only animation dependency. `components/motion/MotionProvider.tsx`
  wraps the app in `LazyMotion features={domAnimation} strict` plus `MotionConfig`, so only
  `m.*` components are used and the bundle excludes drag/layout features.
- `MotionConfig reducedMotion` is `"always"` when the app's “Kurangi gerak” setting is on,
  otherwise `"user"`. `useMotionReduced()` also disables gesture effects (`whileHover`/
  `whileTap`) and the handoff float, because MotionConfig does not suppress those itself.
- Shared `Reveal` primitive (`components/motion/Reveal.tsx`) fades/rises sections on first
  view, with optional `as="section"`/`as="article"` so flex/grid layouts keep their element.
- Page-level: `SiteShell` fades each route; home, catalog, detail, setup, how-to, history,
  settings, privacy, word-bank, gallery, and 404 reveal headers/sections.
- Component-level: game cards lift on hover and compress on tap (old CSS transforms removed
  to avoid conflicts); mobile nav opens/closes with height/opacity; active tab icon springs;
  toasts enter/exit; reveal cards scale/rotate while held; hold buttons compress; handoff
  icon floats; progress dots pop; game-bar phase label swaps; player rows and setup panels
  enter; history stats/streak/podium/list items stagger; word-bank categories stagger.
- Game flow: play content is keyed by phase/deal/vote index, so every screen change fades
  in; both result verdicts get the confetti art plus a spring trophy/role icon.
- Reduced motion keeps all content visible and interactive, but removes transforms,
  hover lifts, floating loops, and animation delays.

### Game engines (`lib/game/`)
- **Impostor** (`impostor.ts`): deal/reveal, clue order, discussion timer, secret
  pass-and-play voting, tally/tie, elimination, Chameleon privacy (card looks like a
  Citizen and never names the role), Impostor sees no word/category, optional word guess,
  win checks, result, replay, history entry.
- **Werewolf** (`werewolf.ts`): role deal, night order Wolf → Doctor → Seer, absent/dead
  role waits with random 3–8s delay, Doctor cannot repeat protection, configurable
  self-protection, morning announcement, secret or hand-count voting, tie rule
  (no execution or revote), Hunter shot, role reveal option, win checks, result, replay,
  history entry, automatic night theme override during night phases.
- Shared UI: hold-to-reveal cards, 500ms hold handoffs, timers with vibration,
  pause/alive/peek menus, resume and tab-switch host gates. Reveal/hold surfaces are
  non-selectable and non-draggable on mobile.

### Persistence and PWA
- localStorage keys in `lib/storage.ts`: settings, favorites, history, active session,
  per-game setup drafts. Clear-local-data removes all `cooch.*` keys.
- `app/manifest.ts`, `app/icon.svg`, `public/sw.js`; service worker registration only in
  production. Cache `cooch-v6` precaches the main pages, the three wave SVGs, all 12 game
  thumbnails, the empty-state/404 illustrations, `/icon.svg`, and the manifest; offline
  reload is verified after one controlled visit.
- No accounts, no network calls, no analytics.

## Verification (final)

Commands:
- `npm run lint` — exit 0 (0 errors, 21 intentional warnings).
- `npm run typecheck` — pass.
- `npm run build` — pass; all routes prerender/SSG as expected.

Browser checks (Playwright, Chromium, production build at `http://localhost:3100`):
- 2026-11-13 desktop revision:
  - `cooch-regression.js` — route sweep at 1440×900 and 390×844, phone frame/mobile stage,
    no horizontal overflow, phone-scroll and fixed tab bar, route scroll reset, modal fit,
    toast containment, night stage, short desktop viewports, 320px, nav menu, sticky CTA:
    **pass**.
  - `cooch-impostor-flow.js` — setup → deal → clue → discussion → secret vote → result →
    replay at 1440×900 and 390×844: **pass**.
  - `cooch-impostor-guess-flow.js` — 9 players/3 impostors, wrong guess → next round →
    correct guess → evil win, session clear, history entry: **pass**.
  - `cooch-werewolf-flow.js` — Hunter enabled; reveal → Wolf/Doctor/Seer night → Hunter
    killed → Hunter shot → day vote → village win → replay at 1440×900 and 390×844:
    **pass**.
  - `cooch-fix-check.js` — history stat icons stay inside banners at 1440 and 320; compact
    and full announcements do not overlap the phone frame at 768/1024: **pass**.
  - `cooch-pwa-v6.js` — `cooch-v6` cache with 26 precached entries; offline home renders
    13 cards with no broken art, offline word bank renders 12 categories: **pass**.
  - `cooch-prod-smoke.js` — against `https://cooch.vercel.app`: phone frame and note at
    1440×900, copy-link toast, no tab bar on game detail, plain mobile stage at 390×844,
    `cooch-v6` service worker, no console errors: **pass**.
- Earlier checks (2026-11-12):
- `/tmp/opencode/cooch-impostor-flow.js` — full flow, Chameleon privacy, correct and
  wrong guesses, citizen elimination, history: **pass**.
- `/tmp/opencode/cooch-werewolf-targeted.js` — pause/alive/peek, night theme reset,
  absent/dead roles, hand-count vote, tie/revote, no-execution tie, Hunter, tab-switch
  resume, host roles: **pass**.
- `/tmp/opencode/cooch-settings-pwa.js` — settings persistence, clear data, PWA/offline:
  **pass**.
- `/tmp/opencode/cooch-setup-flow.js` — setup → play integration for both games: **pass**.
- `/tmp/opencode/cooch-catalog.js` — search (ID/EN), category chips, advanced filters,
  reset, empty state, favorites persistence, badge presentation: **pass**.
- `/tmp/opencode/cooch-misc.js` — game detail/rules, soon toast, home resume banner,
  recently played, resume gate: **pass**.
- `/tmp/opencode/cooch-revision-1.js` — 375×667 one-card-per-row layout, reveal/hold
  selection and drag prevention, Werewolf table handoff copy, word bank search/empty
  state/links/320px layout: **pass**.
- `/tmp/opencode/cooch-art-check.js` — home/catalog/detail art, 404 and empty-state
  illustrations, sky/night wave backgrounds, no broken SVGs, no overflow: **pass**.
- `/tmp/opencode/cooch-art-visual.js` — visual review at 375px, 390px, and 1440px
  (home, catalog, detail, footer, empty state, night theme): **pass**.
- `/tmp/opencode/cooch-pwa-v5.js` — `cooch-v5` precaches the shell and the full art set;
  offline home renders cached card art and waves; offline `/word-bank` search works:
  **pass**.
- `/tmp/opencode/cooch-motion-check.js` — page reveal settles, card hover lifts, mobile
  nav opens/closes, toast enters/exits, and reduced-motion disables the hover lift:
  **pass**.
- `/tmp/opencode/cooch-footer-align.js` — footer is centered at 375px and 320px, stays
  left-aligned at 1024px, no overflow: **pass**.
- Route sweep at 390×844 and 320×844 in Indonesian and English (now including
  `/word-bank`): all routes return the expected status, no horizontal overflow, no
  unexpected console errors. `/does-not-exist` correctly returns HTTP 404 and one expected
  document-level console error.

## Known limitations (honest)

- **No backend.** There are no accounts, cloud sync, online rooms, or server-side
  validation. Every session, setup, favorite, and history entry lives in this browser's
  localStorage and can be lost by clearing site data. The typed game engines are the seam
  a backend can replace later.
- **Ten catalog entries are “soon”.** Only Guess the Impostor and Werewolf have engines
  and play routes; the other ten entries are metadata-only placeholders.
- **Word bank shows primary words only.** Chameleon lookalike words are intentionally not
  listed to avoid spoiling the secret pair; custom categories are managed separately in
  Settings.
- **PWA offline is not first-load offline.** The service worker must control the page
  after one online visit (and production build) before offline reload works. Service
  worker registration is intentionally disabled in development.
- **Placeholder contact email.** `halo@cooch.example` in `app/privacy/page.tsx` and
  `privacyDemoNote` must be replaced before launch.
- **Vibration depends on the device/browser.** `navigator.vibrate` is called only when
  supported and enabled; iOS Safari may ignore it.
- **Night theme is both a user setting and an automatic Werewolf override.** The default
  remains light; the override is reset when night phases end.
- **No automated test suite is committed.** Browser checks are external Playwright
  scripts in `/tmp/opencode/`; they are not part of the repository.
- **Art is hand-authored SVG, not AI raster art.** The Gemini image models exposed to
  the image-generation skill returned HTTP 429 with a free-tier quota of 0, so the 18
  SVG assets are the deliberate fallback. They are crisp, tiny, and palette-matched, but
  flat vector illustrations rather than painted 3D renders.
- **Lint warnings remain by design.** The 21 `set-state-in-effect` warnings document the
  localStorage hydration pattern; they are warnings, not build failures.

## Decisions

- Reuse design CSS + BEM classes instead of Tailwind for visual parity.
- Client-side engines with typed state and a reducer-like API so a backend can replace
  them without rewriting screens.
- Indonesian is the default language; English is a full second dictionary.
- Chameleon does not know its role; Impostor sees no category and no word
  (DESIGN.md §12 decisions).
- Hunter is optional and off by default; host can enable it in setup.
- Doctor cannot protect the same player two nights in a row; self-protection is a setup
  option.
- Vote modes: secret pass-and-play or hand count; ties follow the configured rule.
- Reveal cards require holding; handoffs require a 500ms hold to prevent accidental taps.
- Setup pages save drafts and navigate to `/play/[slug]?new=1`.
- Game art is hand-authored SVG exposed through `GameMeta.art`; `ArtImage` intentionally
  bypasses Next image optimization because the assets are vector, tiny, and already
  palette-matched.
- Animation uses Motion (`motion/react`, `LazyMotion` + `domAnimation` + `strict`, `m.*`
  only). CSS remains for simple hover/press states; Motion owns page/section entrances,
  card gestures, nav/toast transitions, phase changes, and result celebrations.
- Reduced motion is checked in two layers: MotionConfig skips transform animations, and
  `useMotionReduced()` disables gestures and loops that MotionConfig does not cover.
- Desktop is intentionally a phone stage, not a wide layout: the app keeps its mobile
  structure inside a phone frame and tells guests to open it on a real phone. App
  breakpoints use `@container app` on `.phone-screen`; viewport media queries are reserved
  for the stage/frame and reduced-motion preferences.
- The global tab bar and toast stack live outside the phone scroll area so they stay fixed
  to the shell; the tab bar only mounts on the four routes that opted into it.

## Deployment

- Public production URL: **https://cooch.vercel.app** — Vercel project
  `naufalaqilnasrullah2007-gmailcoms-projects/cooch`, GitHub `main` auto-deploy.
- `1f2d63e` deployed successfully; production serves `cooch-v6`, the desktop phone stage,
  and the bilingual note. A production smoke test at 1440×900 and 390×844 passed with no
  console errors.

## Blockers

- None.

## Next steps (post-demo)

1. Replace the placeholder contact email and review privacy copy for launch.
2. Add a backend adapter behind the existing game-engine/state boundary if online rooms,
   accounts, or cross-device history are wanted.
3. Move the external Playwright checks into the repository and add CI.
4. Implement one or more “soon” games using the registry + engine pattern.
