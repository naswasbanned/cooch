# Persona Rationale (Phase 3)

Persona: `persona/persona.md`. Primary: **Host santai** (17-30, phone in one hand, dark noisy room, wants to start in < 60 s). Secondary: **Penyelenggara acara** (laptop/projector, reads rules first) and **Pemain baru** (holds the phone only for their turn).

Scope decided with the user (2026-11-11):
- Pages use **sample data**. Game logic (roles, timers, votes, storage) is built later with the backend. JS in this phase only switches screens, toggles UI state, and filters the static catalog.
- The two games are **examples of a template**. Every game page follows the same structure so new games only add content (see section 4).
- Cover most pages now, including nice-to-haves (Riwayat, Pengaturan), so the Next.js migration is one pass.

## 1. Persona → design rules

| Persona characteristic | Design implication | Concrete decision |
| --- | --- | --- |
| Phone 360-430 px, one hand, passed around | Main actions must sit in the thumb zone | Mobile: fixed bottom tab bar on browse pages; fixed bottom `sticky-cta` on detail/setup; in-game primary button always at the bottom of the screen, full width (`btn--block btn--xl`) |
| Read from arm's length, dark and noisy room | Large text and numbers, high contrast | Secrets 40 px (`--text-3xl`), player names and timers `--text-4xl`. All text pairs ≥ 4.5:1 (DESIGN-GUIDE §2). Night screens use the night theme, not a dimmed light theme |
| Wants to start in < 60 s, friends are waiting (low attention during setup) | Fewest steps, everything pre-filled | Setup opens with PRD defaults; one "Mulai" button. Names are optional and sit in a closed "Nama pemain (opsional)" section; advanced host options sit in a closed accordion (progressive disclosure). Home → card → "Mulai Main" → "Mulai": 3 taps to the first handover |
| Secrets must not leak while the phone changes hands | Nothing secret on screen during transitions | "Serahkan HP ke {nama}" handover screen before every card. Card is covered until held. "Sudah dibaca" is disabled until the card was opened. Night-action handovers say "Serahkan ke Werewolf", never a name |
| Medium-high digital literacy, but new players join | Familiar patterns, literal labels | Icons always have a visible text label (tab bar, game bar "Menu"/"Aturan"). Buttons say what happens ("Aku Rani, buka", "Eksekusi Andi") |
| New player doesn't know the rules | Rules reachable at any moment | "Aturan" button in the game bar on every play screen opens a short rules sheet. Detail page has rules tabs before starting |
| Indonesian, casual | Short, friendly copy | "kamu", short sentences, no jargon. English labels only for proper role names (Werewolf, Seer, Doctor) |
| Accessibility: not color-only, text can be enlarged | Status uses icon + text; scalable type | Badges/alerts carry icons and words. Everything sized in rem; "Teks besar" setting scales the root size. `prefers-reduced-motion` handled by base.css |
| Organizer on laptop/projector (secondary) | Desktop must not feel like a stretched phone | Browse pages use the 2/3/4-column card grid and desktop navbar. Play screens stay in a centered phone-width column (`--size-phone`) so the layout reads the same on a shared screen |
| Session must survive closing the tab (PRD risk) | Offer resume | Home shows a "Game belum selesai" banner with "Lanjutkan" |

## 2. Information architecture

All files in `design/pages/`. Template pages are marked **(T)**: one file per game today, one dynamic route in Next.js later.

| Page | File | Future route | Why it exists |
| --- | --- | --- | --- |
| Beranda | `index.html` | `/` | Catalog home: resume, popular, new, categories. Value prop visible in 5 s |
| Semua Game | `games.html` | `/games` | Search + filters (players, duration, difficulty, category) as the catalog grows (PRD 5) |
| Detail game (T) | `game-impostor.html`, `game-werewolf.html` | `/games/[slug]` | Description, rules, players, duration, screenshots, similar games (PRD 5) |
| Setup sesi (T) | `setup-impostor.html`, `setup-werewolf.html` | `/games/[slug]/setup` | Players + game-specific options from the module schema (PRD 2, 5) |
| Main (T) | `play-impostor.html`, `play-werewolf.html` | `/play/[slug]` | Screen flow: reveal → game phases → result |
| Cara Main | `how-to.html` | `/how-to` | Explains pass-and-play and anti-leak once, for new players and organizers |
| Riwayat | `history.html` | `/history` | Local recap and device leaderboard (PRD "Nanti", built as preview) |
| Pengaturan | `settings.html` | `/settings` | Language, theme, sound, text size, custom word categories, local data |
| Privasi | `privacy.html` | `/privacy` | Footer link; states no account, data stays on the device |
| 404 | `404.html` | not-found | Recovery to home or catalog |

Navigation: desktop navbar (Beranda, Semua Game, Cara Main, Riwayat + Pengaturan icon). Mobile: bottom tab bar (Beranda, Game, Riwayat, Atur) plus navbar menu for Cara Main. Detail/setup/play pages hide the tab bar so the main action owns the bottom of the screen.

## 3. Main task flow

```
Beranda ─(tap game card)→ Detail ─("Mulai Main")→ Setup (defaults) ─("Mulai")→ Play
                                                                                │
   Play: Serahkan HP ke X → Tahan kartu → Sudah dibaca → (repeat per player) ───┘
         → game phases → Hasil → "Main lagi" (same settings, back to first handover)
Shortcut: Beranda "Lanjutkan" banner → Play at the saved phase.
```

Play screens are `<section data-screen="...">`. Open any screen directly with a hash, e.g. `play-impostor.html#vote`.

**Guess the Impostor:** `handover-1` → `reveal-1` → `handover-2` → `reveal-2` (impostor) → `order` → `discuss` → `vote` → `guess` → `result`.
**Werewolf:** `handover-1` → `reveal-1` (Seer) → `handover-2` → `reveal-2` (Werewolf) → `pack` → `night` → `night-wolf` → `night-doctor` → `night-seer` → `seer-result` → `morning` → `day` → `vote` → `hunter` → `result`. Night screens switch to `data-theme="night"`.

## 4. Template contract (adding a new game)

Each template page has the same skeleton. Only blocks marked `<!-- game: ... -->` change per game.

| Page | Platform (same for all games) | Game module slot |
| --- | --- | --- |
| Detail | breadcrumb, header layout, meta badges, stat row, rules tabs shell, screenshots row, similar games, sticky CTA | media variant + icon, copy, tab contents |
| Setup | page header, "Pemain" section (stepper + optional names), sticky "Mulai" bar | "Pengaturan game" fieldset(s) and the advanced accordion, generated from the module's settings schema |
| Play | game bar (Menu, title, phase, Aturan), handover + reveal screens, timer, pick-list voting, result screen, menu/rules/exit modals | role/word content and game-specific phase screens |
| Catalog card | card component | `data-*` metadata (players, duration, difficulty, tags) |

## 5. Wireframes (section order and components)

- **index:** navbar · hero (Mulai Main → #populer, Cara main) · resume alert · category chips · "Populer" card grid · "Baru ditambahkan" card grid · 3-step how-to cards · footer · tabbar
- **games:** navbar · page header · search input · filter chips (kategori) + selects (pemain, durasi, kesulitan) · result count · card grid · empty-state (hidden until no match) · pagination · footer · tabbar
- **game-[slug]:** navbar · breadcrumb · header (card__media art + title, text, badges, CTA) · stat row · tabs (Aturan/Peran/Tips) · screenshots · "Mirip dengan ini" card grid · footer · sticky-cta (mobile)
- **setup-[slug]:** navbar · breadcrumb · title · card "Pemain" (stepper, names) · card "Pengaturan game" (schema fields) · accordion "Pengaturan lanjutan" · sticky-cta "Mulai"
- **play-[slug]:** game-bar · one visible screen (handover / reveal / phase / pick-list / result) · modals (menu, aturan, akhiri)
- **how-to:** navbar · header · 3 numbered step cards · anti-leak tips alert · FAQ accordion · CTA · footer · tabbar
- **history:** navbar · header · stat-grid · streak · "Terakhir dimainkan" list · podium + rank list "Juara di HP ini" · footer · tabbar
- **settings:** navbar · header · cards: Tampilan (tema, teks besar), Bahasa, Suara (toggles), Kategori kata buatan (list + modal add), Data (hapus, modal confirm) · footer · tabbar
- **privacy / 404:** navbar · reading text or recovery panel · footer

## 6. New components in Phase 3

Locked components are used as-is. These are new, follow DESIGN-GUIDE, and read only tokens:

| Component | Where | UX reason |
| --- | --- | --- |
| `pick-list` | Voting, night actions, hunter | Large full-width rows (≥ 68 px) with avatar + name for choosing a player with one thumb; dead/blocked players disabled with a text reason |
| `game-bar` | All play screens | Constant place for Menu and Aturan with text labels; shows game + phase so a new player knows where the group is |
| `sticky-cta` | Detail, setup | Keeps the main action in the thumb zone on mobile; becomes a normal inline bar on desktop |
| `empty-state` | Catalog with no results | Explains why nothing shows and offers "Reset filter" instead of a blank grid |
| `pages.css` | All pages | Page layout only (sections, detail header, steps, screenshot row, play column, pinned play action tray). Contains one flagged override for a locked-component bug (see 8) |

Page scripts in `pages/js/`: `flow.js` (screen switching, night theme per screen, `#screen` deep links), `ui.js` (chip groups, favorite toggle), `catalog.js` (filters; `data-*` mirror the registry metadata), `setup.js` (name fields, composition suggestion, impostor max), `settings.js` (preference previews, custom category dialog). None contain game rules; results on play screens are sample data.

## 7. Validation (2026-11-11)

Checked with Playwright (Chromium) on all 13 HTML pages at 375 / 768 / 1280 / 1440 px.

**Persona checklist**

| Check | Result |
| --- | --- |
| Main task: open site → first secret card | 3 taps: game card → "Mulai Main" → "Mulai" (setup defaults need no input). The hero "Mulai Main" adds one scroll tap for first-time visitors |
| Main CTA visible without scrolling on mobile (375×812) | Home: hero "Mulai Main" visible. Detail and setup: sticky CTA always visible. Play: primary action pinned at the bottom of every screen |
| Readable at arm's length | Body 16 px min, secrets 40 px, names/timers up to 64 px. "Teks besar" scales the whole UI to 18 px root (tested: computed root 18 px) |
| Secrets cannot leak | Verified by script on every reveal: "Sudah dibaca" disabled until the card is held, secret visible only while held, card covered again on release and on every screen change. Night handovers name the role, never the player |
| Rules reachable anytime | "Aturan" in the game bar on every play screen; menu → rules tested |

**Heuristics**

- Hick: one primary action per play screen; setup shows 3-5 fields with the rest collapsed; catalog filters are 3 selects + 7 chips.
- Fitts: every interactive element measured ≥ 44 px tall (script check, 0 violations); primary actions 68 px and full width at the bottom.
- Feedback: phase label in the game bar updates per screen; confirm buttons name the target ("Eksekusi Fajar"); toasts for favorites, saved settings, new category.
- Error prevention: pick confirm disabled until a choice; dead/teammate players disabled with a text reason; destructive actions ("Akhiri game", "Hapus semua data") go through a confirm dialog; custom category form validates empty fields.
- Consistency: both games use the same template blocks (section 4).

**Accessibility**

- Contrast: all text pairs from DESIGN-GUIDE §2 (≥ 4.5:1) except the accepted `.btn--danger` (4.41:1). New components use only those pairs.
- Each page has exactly one `h1` and no skipped heading levels (script check). Play pages: game name is `h1`, each screen has an `h2` that receives focus on screen change.
- Every input, select, button, and link has an accessible name (script check, 0 missing). No duplicate ids.
- Status never by color only: badges/notes carry words ("Mati", "Kawanan", "Sudah").
- Skip link on every page. Keyboard: reveal card opens with Space/Enter (locked reveal.js), modals close with Esc.
- `prefers-reduced-motion` honored via base.css. No images; all icons are decorative with `aria-hidden`.

**Responsive:** 0 console errors, 0 failed requests, 0 horizontal scroll, 0 broken internal links or anchors on all 52 page × width combinations.

**Flows tested by script:** full Impostor flow (handover → reveal ×2 → order → clue → discuss with running timer → vote → guess → result → "Main lagi"); full Werewolf flow (reveal, pack, night ×3 roles with night theme on, Seer result shows the picked name, morning, day, vote, hunter, result); "Lihat peran saya lagi" returns to the screen it was opened from; deep link `#day`; setup composition 8 → 12 players (wolves 2→3, hunter 0→1, villagers recalculated, manual change recalculates); impostor max = floor(players / 3); catalog filters, search, empty state, reset, `?kategori=` preset; settings dialog validation and save.

## 8. Trade-offs and open points

- **Sample results:** play screens show fixed sample outcomes (e.g. the guess screen always names Bayu). Real outcomes come from the game engine/backend.
- **Loops are shortened:** the prototype shows 2 of N reveals and one night/day cycle, then jumps to the result.
- **Catalog shows 10 "Segera" games** next to 2 playable ones so the multi-game layout and filters can be reviewed; greyed cards look less lively than the moodboard.
- **Detail and setup hide the tab bar** so the main action owns the thumb zone. Navigation back is via navbar/breadcrumb.
- **Desktop play screens stay phone-width** (centered column) instead of using the full screen.
- **Locked component bug (needs your decision):** in `card.css` the whole-card link covers the favorite star, so it can't be clicked. `pages.css` works around it (media layer raised, clicks pass through except on the star). Approve to move the fix into `components/card/card.css`.
- **Contact email** `halo@cooch.example` on the privacy page is a placeholder.

## 9. PRD.md and DESIGN.md reconciliation audit (2026-11-11)

The user asked to resume Phase 3 against both product documents. The page prototypes were checked against the requirements below. `DESIGN.md` is the more specific visual/interaction contract where it differs from the broader PRD.

| Requirement | Phase 3 representation | Status / boundary |
| --- | --- | --- |
| Mobile-first catalog and three-tab navigation | `index.html`, `games.html`, `settings.html`; Beranda, Jelajah, Atur | Matches. The locked tabbar component also has these three destinations. |
| Dark-first UI, text narration, no voice | `body[data-theme="night"]`; Werewolf night screens use text | Matches DESIGN.md. PRD's optional voice is deferred by the later, explicit design decision. |
| Secret reveal and safe handoff | Both play prototypes include hold handoffs, covered cards, 15-second timeout, disabled completion until opened | Represented in the sample UI and scripts; generated roles/player data are not implemented. |
| Guess the Impostor variants and rounds | Setup includes Chameleon and role controls; play prototype includes clue, discussion, secret voting, reveal/guess and repeat round | Representative static scenario. Outcome calculation and actual randomization are deferred. |
| Werewolf core night/day loop | Setup and play prototype include role composition, Wolf/Doctor/Seer handoffs, morning, day, secret vote, execution, Hunter, second night | Representative static path. The full variable player-count state machine is not implemented in Phase 3. |
| Host options | Setup includes death-role reveal, tie behavior, day timer, vote mode, Doctor self-protection, and moderator mode | UI is represented. Narration voice is omitted per DESIGN.md; Seer-result style and additional toggles from PRD are not all surfaced. |
| Pause, rules, resume and destructive exit | Play pages include pause/rules dialogs and resume screen; home has a resume banner | Demonstration only; page refresh/session persistence is not implemented. |
| Living/dead status and secret-safe choices | Werewolf day screens show alive/dead labels; pick lists disable ineligible players | Static sample values; no game-state enforcement. |
| Setup constraints | Player bounds, composition suggestions, duplicate-name and role-count validation are implemented in setup scripts | Functional prototype behavior, not persisted settings. |
| Other PRD platform requirements | Favorites, history, settings, bilingual controls and offline-ready label appear in the page set | UI placeholders only where noted; no actual offline service worker or complete translation/persistence layer. |

### Phase 3 completion boundary

Phase 3 delivers page structure, copy, components, sample states, and front-end interactions. It does not deliver the game engine, randomized assignments, reliable persistent sessions, Wake Lock, orientation lock, sound, or complete variable-length game paths. Those are functional/runtime work, not visual-design prototype requirements; do not claim them as implemented during migration planning.

No locked Phase 1/2 component was changed as part of this reconciliation. The pre-existing card favorite overlay workaround and placeholder privacy contact remain open points.
