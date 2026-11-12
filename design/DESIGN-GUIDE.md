# Cooch Design Guide

Source: `moodboard/Screenshot_20261109_183428.png` (one image, three mobile screens: Profile, Onet game board, Leaderboard). Product context: `PRD.md` (multigame party platform, pass-and-play, Indonesian UI).

All values live in `tokens.css`. Components read semantic roles (`--color-surface`, `--color-primary`, ...), not the raw palette.

## 1. Visual character

**Warm, chunky, toy-like, cheerful, soft, tactile, friendly, casual.**

The moodboard reads like a mobile game lobby: a sky-blue backdrop, warm peach/cream panels, thick rounded buttons with a darker bottom edge that look pressable, blue tiles with a sunburst pattern, and heavy rounded headings in brown. Cooch keeps that toy-box feel but adapts it to a web platform used around a table by groups: large tap targets, high-contrast text, with a light default and a dark "night" theme only for Werewolf's night phase.

## 2. Color

Contrast measured with the WCAG formula on the token hex values.

| Role | Token | Hex | Use | Contrast |
| --- | --- | --- | --- | --- |
| Page background | `--color-bg` (sky-300), `--gradient-page` | #9fd3f8 | Backdrop behind everything | title cocoa-700: 5.87 |
| Panel | `--color-panel` (sun-300) | #ffd28a | Hero, big warm areas | text: 8.89, muted: 5.25 |
| Surface | `--color-surface` (sun-50) | #fffaf1 | Cards, sheets, lists | text: 12.1, muted: 7.14 |
| Text | `--color-text` (cocoa-800) | #4f2a0c | Body text | see above |
| Title | `--color-text-title` (cocoa-700) | #6b3a12 | Headings | |
| Numerals | `--color-text-number` (sky-800) | #1b4e7c | Stats, timers, scores | on surface: 8.32 |
| Primary | `--color-primary` (sun-400) + edge sun-600 | #ffbf5e | Main actions (Mulai Main) | cocoa-900 text: 9.33 |
| Secondary | `--color-secondary` (sky-700) + edge sky-900 | #1c64a0 | Secondary actions | white text: 6.21 |
| Accent | `--color-accent` (grape-600) | #6244c8 | Secret cards, rank 1, focus ring | white text: 6.6 |
| Tile | `--color-tile` (sky-600), `--gradient-tile` | #2380c6 | Game tiles, card art | white 24px bold: 4.22 (large text, passes 3:1) |
| Link | `--color-text-link` (sky-700) | #1c64a0 | Inline links | 5.98 |

**Semantic** (text on soft background):

| | Text | Soft bg | Contrast |
| --- | --- | --- | --- |
| Success | leaf-700 #176b25 | leaf-100 #dcf6df | 5.78 |
| Warning | sun-800 #955008 | sun-200 #ffe6bf | 5.05 |
| Error | coral-700 #a93030 | coral-100 #fde3e3 | 5.48 |
| Info | sky-700 #1c64a0 | sky-100 #dff0fd | 5.33 |

Form control borders use cocoa-500 (5.64 on surface) to meet the 3:1 non-text contrast rule.

**Night theme** (`[data-theme="night"]`): only semantic roles change, components stay the same. Text night-50 on night-800: 14.32. Muted night-300 on night-700: 4.95. Numerals sun-300 on night-700: 10.87.

**Known contrast gap:** `.btn--danger` uses white on coral-600 = 4.41:1. At the default 18px bold this is just below the large-text threshold (18.66px bold), and `.btn--sm` (14px) fails AA. See open questions.

Traceability: sky backdrop, peach panels, cream cards, brown titles, navy numerals, and blue tiles all come from the three moodboard screens. Grape comes from the "Fastest Time" card and the rank-1 podium; leaf from the Onet selection ring and rank-up arrows; coral from rank-3 and rank-down arrows; peach from the active tab-bar bubble. Night palette is new, required by the PRD.

## 3. Typography

| | Font | Fallback | Weights |
| --- | --- | --- | --- |
| Display (headings, numerals, buttons) | Fredoka (Google Fonts) | Baloo 2, ui-rounded, Nunito, system-ui | 600, 700 |
| Body | Nunito (Google Fonts) | ui-rounded, system-ui, Segoe UI | 500-800 |

Both are rounded sans fonts, matching the soft heavy headings in the moodboard ("Leaderboard", "Onet"). Body weight starts at 500 because 400 looks thin against the chunky UI.

Scale (rem): xs 0.75, sm 0.875, base 1, md 1.125, lg 1.25, xl 1.5, 2xl 2, 3xl 2.5, 4xl clamp(2.5 to 4), display clamp(3 to 5.5).
Line height: tight 1.1 (display), snug 1.3 (headings), normal 1.5 (body). Tracking: tight -0.01em for display, wide 0.04em for small uppercase labels.

## 4. Spacing and layout

- Base unit 4px. Scale: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px (`--space-*`).
- Container max-width 72rem (1152px), reading width 40rem, phone frame 430px (PRD upper mobile bound).
- Breakpoints (mobile-first): 48em / 768px (tablet layouts, desktop navbar), 64em / 1024px (gallery two-column), 80em / 1280px (4-column card grid). Verified at 375, 768, 1280, 1440.
- Tap targets: min 48px (`--size-tap`, PRD), large 56px, extra-large 68px for in-game action buttons.

## 5. Shape

- **Radius:** generous. 8 / 12 / 16 / 24 / 32 / 40 px plus pill and circle. Cards and sheets 24-32px, tiles 12-16px, chips pill. From the moodboard's phone-frame and panel corners.
- **Border:** 2px default, 3px for selected and emphasis states (Onet green selection ring, leaderboard "you" row outline).
- **Elevation:** warm brown-tinted shadows (`--rgb-warm-shadow`) instead of grey, plus a white inner top highlight. Buttons and tiles get a solid bottom edge (`--press-offset`, 3px) that collapses on press, copied in principle from the moodboard's chunky buttons.
- **Tilt:** sticker labels rotate -2deg, some cards +2deg ("Daily Streak" label, tilted "12" and "7" tiles).
- **Icons:** line icons, rounded caps, stroke 2 (2.6 bold), inline SVG sprite in `icons/icons.js`. The moodboard uses outline icons in the tab bar.
- **Images:** the moodboard relies on 3D avatars and illustrations. These are not copied. Cooch uses initial-letter avatars (PRD privacy, no photos), color blocks, and simple SVG for game art.

## 6. Density and feel

Spacious and calm in layout, playful in detail. One main action per screen, large numbers, short labels. Casual Indonesian copy ("Main bareng", "Edarkan HP"). Motion is short and bouncy (`--ease-bounce`) for presses, standard easing for panels, all disabled under `prefers-reduced-motion`.

## 7. Components

Navbar (desktop + mobile panel), Tabbar (mobile bottom nav, from moodboard), Footer, Button (primary/secondary/accent/ghost/danger, sizes, icon, loading, disabled, game action buttons), Hero (sunburst panel), Section heading + sticker label + link, Badge / chip / points / trend, Card (game card: featured, normal, coming soon, plain content), Stat (chips + stat cards), Form (stepper, input, error state, search, select, textarea, segmented, checkbox, radio, toggle, validation), Modal (bottom sheet on mobile, centered on desktop), Accordion, Tabs, Alert + Toast, Tooltip, Breadcrumb + Pagination, List (menu sheet, streak, podium, rank list), Tile grid + action bar (from Onet), Reveal card + handover screen + timer (PRD pass-and-play), Night theme demo.

All are in `gallery.html`. BEM class names, `data-*` JS hooks, one `init` function per component, no globals.

## 8. Decisions and conflicts for review

1. **Moodboard is mobile-app only.** Desktop layouts (navbar, card grid, footer) are extrapolated from the same tokens. Please review the 1280/1440 views closely.
2. **Night theme** is not in the moodboard. It is required by the PRD for Werewolf's night phase. Colors are a new navy/indigo set.
3. **Avatars:** moodboard uses 3D character avatars; Cooch uses initials to keep player data minimal (PRD) and avoid copied assets.
4. **Danger button contrast** (4.41:1) needs a decision: darken to coral-700 (about 6.6:1, less vivid) or keep coral-600 and enlarge the text.
