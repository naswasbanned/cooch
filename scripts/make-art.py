#!/usr/bin/env python3
"""Generate Cooch's hand-authored SVG art set (backgrounds, thumbnails, states)."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "art"
OUT.mkdir(parents=True, exist_ok=True)
GAMES = OUT / "games"
GAMES.mkdir(parents=True, exist_ok=True)


def doc(w, h, defs, body, label):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{label}">
<defs>
{defs}
</defs>
{body}
</svg>
'''


def sparkle(x, y, s, color, opacity=0.85):
    return (
        f'<path d="M{x} {y-s} C{x+s*0.18} {y-s*0.18} {x+s*0.18} {y-s*0.18} {x+s} {y} '
        f'C{x+s*0.18} {y+s*0.18} {x+s*0.18} {y+s*0.18} {x} {y+s} '
        f'C{x-s*0.18} {y+s*0.18} {x-s*0.18} {y+s*0.18} {x-s} {y} '
        f'C{x-s*0.18} {y-s*0.18} {x-s*0.18} {y-s*0.18} {x} {y-s} Z" '
        f'fill="{color}" opacity="{opacity}"/>'
    )


def dot(x, y, r, color, opacity=0.7):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" opacity="{opacity}"/>'


def soft_defs(extra=""):
    return f'''  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#2b1608" flood-opacity="0.24"/>
  </filter>
  <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
{extra}'''


def bg_gradient(c1, c2, angle="0"):
    return f'''  <linearGradient id="bg" x1="0" y1="0" x2="{1 if angle=="1" else 0}" y2="1">
    <stop offset="0" stop-color="{c1}"/>
    <stop offset="1" stop-color="{c2}"/>
  </linearGradient>
  <radialGradient id="halo" cx="50%" cy="42%" r="60%">
    <stop offset="0" stop-color="#fffaf1" stop-opacity="0.28"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0"/>
  </radialGradient>'''


def frame(c1, c2, label, extra_defs, scene, deco=""):
    body = f'''<rect width="800" height="600" fill="url(#bg)"/>
<rect width="800" height="600" fill="url(#halo)"/>
<circle cx="400" cy="300" r="260" fill="#fffaf1" opacity="0.05"/>
{scene}
{deco}'''
    return doc(800, 600, bg_gradient(c1, c2) + "\n" + soft_defs(extra_defs), body, label)


# ---------------------------------------------------------------- thumbnails

def thumb_impostor():
    extra = '''  <linearGradient id="front" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9b7bf0"/>
    <stop offset="1" stop-color="#4d34a3"/>
  </linearGradient>
  <linearGradient id="mask" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="1" stop-color="#ece6fc"/>
  </linearGradient>'''
    scene = f'''
<ellipse cx="400" cy="510" rx="250" ry="28" fill="#2b1608" opacity="0.18"/>
<g filter="url(#soft)">
  <rect x="196" y="160" width="210" height="310" rx="30" fill="#fffaf1" transform="rotate(-13 301 315)"/>
  <rect x="222" y="206" width="120" height="14" rx="7" fill="#dff0fd" transform="rotate(-13 301 315)"/>
  <rect x="222" y="238" width="150" height="14" rx="7" fill="#dff0fd" transform="rotate(-13 301 315)"/>
  <rect x="222" y="270" width="96" height="14" rx="7" fill="#dff0fd" transform="rotate(-13 301 315)"/>
  <rect x="394" y="160" width="210" height="310" rx="30" fill="#ffe6bf" transform="rotate(13 499 315)"/>
  <rect x="430" y="206" width="120" height="14" rx="7" fill="#ffd28a" transform="rotate(13 499 315)"/>
  <rect x="430" y="238" width="150" height="14" rx="7" fill="#ffd28a" transform="rotate(13 499 315)"/>
  <rect x="430" y="270" width="96" height="14" rx="7" fill="#ffd28a" transform="rotate(13 499 315)"/>
  <rect x="280" y="126" width="240" height="350" rx="34" fill="url(#front)" stroke="#ece6fc" stroke-opacity="0.35" stroke-width="3"/>
  <path d="M318 258 C342 224 376 224 400 250 C424 224 458 224 482 258 C482 306 452 338 400 338 C348 338 318 306 318 258 Z" fill="url(#mask)"/>
  <ellipse cx="360" cy="272" rx="19" ry="13" fill="#4d34a3"/>
  <ellipse cx="440" cy="272" rx="19" ry="13" fill="#4d34a3"/>
  <path d="M386 300 Q400 310 414 300" stroke="#7b5be0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M318 258 Q300 246 292 228 M482 258 Q500 246 508 228" stroke="#ece6fc" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>
</g>
{sparkle(600, 152, 22, "#ffd28a")}
{sparkle(196, 402, 16, "#fffaf1", 0.8)}
{sparkle(640, 372, 12, "#ffbf5e", 0.7)}
{dot(172, 210, 7, "#fffaf1", 0.6)}
{dot(620, 462, 5, "#fffaf1", 0.5)}
'''
    return frame("#7b5be0", "#4d34a3", "Guess the Impostor game art", extra, scene)


def thumb_werewolf():
    extra = '''  <linearGradient id="moon" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff3df"/>
    <stop offset="1" stop-color="#ffbf5e"/>
  </linearGradient>'''
    scene = f'''
<circle cx="596" cy="150" r="112" fill="#ffd28a" opacity="0.16" filter="url(#glow)"/>
<circle cx="596" cy="150" r="86" fill="url(#moon)"/>
<circle cx="568" cy="126" r="13" fill="#e8871a" opacity="0.25"/>
<circle cx="620" cy="170" r="9" fill="#e8871a" opacity="0.2"/>
<circle cx="628" cy="116" r="6" fill="#e8871a" opacity="0.2"/>
<g fill="#181738">
  <path d="M80 500 L150 350 L220 500 Z"/>
  <path d="M160 500 L235 320 L310 500 Z"/>
  <path d="M560 500 L630 365 L700 500 Z"/>
  <path d="M650 500 L720 330 L790 500 Z"/>
  <rect x="140" y="480" width="16" height="34" rx="6"/>
  <rect x="226" y="480" width="16" height="34" rx="6"/>
  <rect x="622" y="480" width="16" height="34" rx="6"/>
  <rect x="710" y="480" width="16" height="34" rx="6"/>
</g>
<path d="M0 500 Q200 470 400 500 T800 500 L800 600 L0 600 Z" fill="#0f0e26"/>
<g filter="url(#soft)">
  <path d="M250 470 C220 430 222 360 256 326 L226 214 L312 288 C340 276 380 278 410 296 L494 252 L472 352 L522 388 L474 424 C458 444 436 458 410 466 L380 494 L346 466 Z" fill="#3b3a78"/>
  <path d="M256 326 L300 296 L282 246 Z" fill="#2c2b5e"/>
  <path d="M410 296 L466 272 L456 332 Z" fill="#2c2b5e"/>
  <ellipse cx="322" cy="346" rx="13" ry="8" fill="#ffd28a" transform="rotate(-12 322 346)"/>
  <ellipse cx="398" cy="338" rx="13" ry="8" fill="#ffd28a" transform="rotate(-12 398 338)"/>
  <circle cx="508" cy="388" r="13" fill="#181738"/>
  <path d="M496 402 Q476 420 452 426" stroke="#181738" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M470 424 L458 444 L448 426 Z" fill="#fffaf1"/>
  <path d="M440 428 L430 446 L420 430 Z" fill="#fffaf1"/>
  <path d="M340 430 Q360 442 382 434" stroke="#181738" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.65"/>
  <path d="M272 386 L246 398 L268 410 Z" fill="#2c2b5e"/>
  <path d="M302 430 L286 452 L318 446 Z" fill="#2c2b5e"/>
</g>
{sparkle(160, 132, 16, "#fff3df", 0.8)}
{sparkle(330, 96, 10, "#fff3df", 0.6)}
{sparkle(700, 260, 12, "#fff3df", 0.6)}
{dot(520, 86, 4, "#fff3df", 0.7)}
{dot(120, 300, 5, "#fff3df", 0.5)}
{dot(680, 390, 4, "#fff3df", 0.5)}
'''
    return frame("#2c2b5e", "#181738", "Werewolf game art", extra, scene)


def thumb_spyfall():
    extra = '''  <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6244c8"/>
    <stop offset="1" stop-color="#4d34a3"/>
  </linearGradient>
  <linearGradient id="pin" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>'''
    scene = f'''
<g opacity="0.18" stroke="#fffaf1" stroke-width="3" stroke-dasharray="10 14">
  <path d="M60 180 Q200 120 340 180 T700 160" fill="none"/>
  <path d="M40 360 Q180 300 360 360 T760 330" fill="none"/>
</g>
<g filter="url(#soft)">
  <path d="M520 120 C590 120 636 172 636 236 C636 318 560 372 520 424 C480 372 404 318 404 236 C404 172 450 120 520 120 Z" fill="url(#pin)"/>
  <circle cx="520" cy="232" r="54" fill="#7b5be0"/>
  <circle cx="520" cy="232" r="22" fill="#fffaf1"/>
</g>
<g filter="url(#soft)">
  <path d="M208 462 C208 348 246 304 300 304 C354 304 392 348 392 462 Z" fill="url(#coat)"/>
  <path d="M260 304 L300 358 L340 304 L322 286 L300 306 L278 286 Z" fill="#fffaf1"/>
  <rect x="286" y="354" width="28" height="10" rx="5" fill="#ffbf5e"/>
  <rect x="286" y="386" width="28" height="10" rx="5" fill="#ffbf5e"/>
  <circle cx="300" cy="248" r="58" fill="#ffd9c4"/>
  <rect x="238" y="176" width="124" height="76" rx="18" fill="#2c2b5e"/>
  <ellipse cx="300" cy="176" rx="100" ry="22" fill="#2c2b5e"/>
  <rect x="238" y="228" width="124" height="14" fill="#ffbf5e"/>
  <rect x="254" y="238" width="40" height="22" rx="10" fill="#181738"/>
  <rect x="306" y="238" width="40" height="22" rx="10" fill="#181738"/>
  <path d="M294 248 L306 248" stroke="#181738" stroke-width="6" stroke-linecap="round"/>
  <path d="M272 284 Q300 296 328 284" stroke="#b8630c" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="430" cy="370" r="52" fill="#fffaf1" fill-opacity="0.12" stroke="#ffbf5e" stroke-width="14"/>
  <path d="M468 408 L512 452" stroke="#ffbf5e" stroke-width="18" stroke-linecap="round"/>
</g>
{sparkle(148, 180, 16, "#fffaf1", 0.8)}
{sparkle(660, 300, 12, "#ffd28a", 0.7)}
{dot(120, 420, 6, "#fffaf1", 0.5)}
{dot(690, 120, 5, "#fffaf1", 0.5)}
'''
    return frame("#6dbbf0", "#2380c6", "Spyfall game art", extra, scene)


def thumb_charades():
    extra = '''  <linearGradient id="maskA" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>
  <linearGradient id="maskB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9b7bf0"/>
    <stop offset="1" stop-color="#6244c8"/>
  </linearGradient>'''
    scene = f'''
<g opacity="0.2" stroke="#fffaf1" stroke-width="5" stroke-linecap="round">
  <path d="M110 200 L64 180 M110 260 L58 260 M110 320 L66 340"/>
  <path d="M690 200 L736 180 M690 260 L742 260 M690 320 L734 340"/>
</g>
<g filter="url(#soft)" transform="rotate(-9 320 310)">
  <path d="M200 280 C200 180 440 180 440 280 C440 408 320 462 320 462 C320 462 200 408 200 280 Z" fill="url(#maskA)"/>
  <ellipse cx="268" cy="280" rx="24" ry="32" fill="#ffa73a"/>
  <ellipse cx="372" cy="280" rx="24" ry="32" fill="#ffa73a"/>
  <path d="M256 352 Q320 406 384 352" stroke="#4f2a0c" stroke-width="16" fill="none" stroke-linecap="round"/>
</g>
<g filter="url(#soft)" transform="rotate(10 510 320)">
  <path d="M390 290 C390 190 630 190 630 290 C630 418 510 472 510 472 C510 472 390 418 390 290 Z" fill="url(#maskB)"/>
  <ellipse cx="458" cy="290" rx="24" ry="32" fill="#fffaf1"/>
  <ellipse cx="562" cy="290" rx="24" ry="32" fill="#fffaf1"/>
  <path d="M446 390 Q510 344 574 390" stroke="#181738" stroke-width="16" fill="none" stroke-linecap="round"/>
</g>
{sparkle(170, 150, 20, "#fffaf1", 0.9)}
{sparkle(650, 170, 14, "#fffaf1", 0.8)}
{sparkle(610, 450, 10, "#fffaf1", 0.7)}
{dot(130, 430, 6, "#fffaf1", 0.5)}
'''
    return frame("#ffd28a", "#ffa73a", "Charades game art", extra, scene)


def thumb_quiz():
    extra = '''  <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>
  <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4d34a3"/>
    <stop offset="1" stop-color="#2c2b5e"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <rect x="220" y="118" width="360" height="238" rx="34" fill="url(#card)"/>
  <path d="M348 232 C348 174 452 174 452 232 C452 276 404 284 404 326" stroke="#7b5be0" stroke-width="30" fill="none" stroke-linecap="round"/>
  <circle cx="404" cy="360" r="17" fill="#7b5be0"/>
  <rect x="164" y="396" width="472" height="130" rx="28" fill="url(#panel)"/>
  <circle cx="252" cy="444" r="52" fill="#fffaf1"/>
  <circle cx="252" cy="438" r="40" fill="#ef6666"/>
  <circle cx="400" cy="462" r="58" fill="#fffaf1"/>
  <circle cx="400" cy="456" r="46" fill="#ffa73a"/>
  <circle cx="548" cy="444" r="52" fill="#fffaf1"/>
  <circle cx="548" cy="438" r="40" fill="#2fb344"/>
</g>
{sparkle(178, 130, 18, "#fffaf1", 0.85)}
{sparkle(642, 238, 14, "#ffd28a", 0.8)}
{sparkle(660, 100, 10, "#fffaf1", 0.6)}
{dot(150, 320, 6, "#fffaf1", 0.5)}
{dot(680, 370, 5, "#fffaf1", 0.5)}
'''
    return frame("#7b5be0", "#2b8bd2", "Team Quiz game art", extra, scene)


def thumb_truth():
    extra = '''  <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe6bf"/>
    <stop offset="0.55" stop-color="#ffa73a"/>
    <stop offset="1" stop-color="#d24848"/>
  </linearGradient>
  <linearGradient id="heart" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fda4af"/>
    <stop offset="1" stop-color="#d24848"/>
  </linearGradient>'''
    scene = f'''
<ellipse cx="400" cy="510" rx="240" ry="26" fill="#2b1608" opacity="0.16"/>
<g filter="url(#soft)" transform="rotate(-11 280 310)">
  <rect x="150" y="150" width="260" height="330" rx="34" fill="#fffaf1"/>
  <path d="M280 206 C322 268 334 300 310 344 C350 334 362 292 350 246 C396 300 394 382 328 424 C262 466 208 404 230 350 C242 318 264 276 280 206 Z" fill="url(#flame)"/>
</g>
<g filter="url(#soft)" transform="rotate(11 520 310)">
  <rect x="390" y="150" width="260" height="330" rx="34" fill="#ffe6bf"/>
  <path d="M520 408 C520 408 438 358 438 298 C438 258 466 234 498 234 C512 234 520 242 520 242 C520 242 528 234 542 234 C574 234 602 258 602 298 C602 358 520 408 520 408 Z" fill="url(#heart)"/>
</g>
{sparkle(130, 150, 18, "#fffaf1", 0.85)}
{sparkle(670, 176, 14, "#fffaf1", 0.8)}
{sparkle(660, 470, 10, "#fffaf1", 0.6)}
{dot(110, 380, 6, "#fffaf1", 0.5)}
{dot(690, 340, 5, "#fffaf1", 0.5)}
'''
    return frame("#f58a8a", "#d24848", "Truth or Dare game art", extra, scene)


def thumb_mission():
    extra = '''  <linearGradient id="folder" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe6bf"/>
    <stop offset="1" stop-color="#ffbf5e"/>
  </linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#fff3df"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <path d="M180 208 L180 178 C180 162 192 150 208 150 L316 150 L342 184 L592 184 C608 184 620 196 620 212 L620 448 C620 464 608 476 592 476 L208 476 C192 476 180 464 180 448 Z" fill="url(#folder)"/>
  <rect x="228" y="252" width="344" height="190" rx="18" fill="url(#paper)"/>
  <path d="M228 270 L400 370 L572 270" stroke="#e8871a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M228 424 L350 340 M572 424 L450 340" stroke="#ffd28a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="400" cy="358" r="46" fill="#d24848"/>
  <circle cx="400" cy="358" r="32" fill="#ef6666"/>
  <path d="M388 358 L396 368 L414 346" stroke="#fffaf1" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g filter="url(#soft)" transform="rotate(18 614 228)">
  <circle cx="614" cy="190" r="34" fill="none" stroke="#ffbf5e" stroke-width="16"/>
  <path d="M614 224 L614 320" stroke="#ffbf5e" stroke-width="16" stroke-linecap="round"/>
  <path d="M614 300 L646 300 M614 322 L638 322" stroke="#ffbf5e" stroke-width="14" stroke-linecap="round"/>
</g>
{sparkle(150, 160, 16, "#ffd28a", 0.8)}
{sparkle(668, 120, 12, "#fffaf1", 0.7)}
{dot(120, 400, 6, "#ffd28a", 0.5)}
{dot(686, 470, 5, "#ffd28a", 0.5)}
'''
    return frame("#2c2b5e", "#4d34a3", "Secret Mission game art", extra, scene)


def thumb_speed():
    extra = '''  <linearGradient id="bolt" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff3df"/>
    <stop offset="0.5" stop-color="#ffd28a"/>
    <stop offset="1" stop-color="#ffa73a"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <circle cx="400" cy="322" r="158" fill="#fffaf1"/>
  <circle cx="400" cy="322" r="126" fill="#dcf6df"/>
  <circle cx="400" cy="322" r="126" fill="none" stroke="#1f8f31" stroke-width="10"/>
  <rect x="372" y="134" width="56" height="34" rx="12" fill="#1f8f31"/>
  <rect x="386" y="112" width="28" height="32" rx="10" fill="#176b25"/>
  <g stroke="#1f8f31" stroke-width="7" stroke-linecap="round">
    <path d="M400 230 L400 246"/>
    <path d="M490 322 L474 322"/>
    <path d="M310 322 L326 322"/>
    <path d="M464 258 L452 270"/>
    <path d="M336 258 L348 270"/>
  </g>
  <path d="M430 200 L322 346 L394 346 L352 466 L500 296 L420 296 Z" fill="url(#bolt)" stroke="#b8630c" stroke-width="5" stroke-linejoin="round"/>
  <path d="M400 322 L456 268" stroke="#1f8f31" stroke-width="12" stroke-linecap="round"/>
  <circle cx="400" cy="322" r="14" fill="#1f8f31"/>
</g>
<g filter="url(#soft)">
  <rect x="92" y="116" width="154" height="94" rx="26" fill="#fffaf1"/>
  <path d="M144 210 L128 244 L180 210 Z" fill="#fffaf1"/>
  <rect x="120" y="146" width="98" height="12" rx="6" fill="#4ccb5b"/>
  <rect x="120" y="170" width="70" height="12" rx="6" fill="#9fd3f8"/>
  <rect x="566" y="386" width="144" height="86" rx="24" fill="#fffaf1"/>
  <path d="M660 472 L676 504 L626 472 Z" fill="#fffaf1"/>
  <rect x="592" y="414" width="88" height="11" rx="5.5" fill="#4ccb5b"/>
  <rect x="592" y="436" width="56" height="11" rx="5.5" fill="#9fd3f8"/>
</g>
{sparkle(650, 150, 18, "#fffaf1", 0.85)}
{sparkle(170, 360, 12, "#fffaf1", 0.7)}
{dot(690, 280, 5, "#fffaf1", 0.5)}
'''
    return frame("#4ccb5b", "#1f8f31", "Speed Words game art", extra, scene)


def thumb_memory():
    extra = '''  <linearGradient id="back" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9b7bf0"/>
    <stop offset="1" stop-color="#4d34a3"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <g transform="rotate(-7 300 260)">
    <rect x="222" y="168" width="156" height="196" rx="24" fill="#fffaf1"/>
    {sparkle(300, 266, 46, "#ffa73a")}
  </g>
  <g transform="rotate(8 500 260)">
    <rect x="422" y="168" width="156" height="196" rx="24" fill="url(#back)"/>
    <path d="M500 206 L536 266 L500 326 L464 266 Z" fill="#ece6fc" opacity="0.75"/>
  </g>
  <g transform="rotate(6 300 420)">
    <rect x="222" y="328" width="156" height="196" rx="24" fill="url(#back)"/>
    <path d="M300 366 L336 426 L300 486 L264 426 Z" fill="#ece6fc" opacity="0.75"/>
  </g>
  <g transform="rotate(-8 500 420)">
    <rect x="422" y="328" width="156" height="196" rx="24" fill="#fffaf1"/>
    {sparkle(500, 426, 46, "#2fb344")}
  </g>
</g>
{sparkle(150, 180, 16, "#fffaf1", 0.8)}
{sparkle(666, 380, 12, "#ffd28a", 0.8)}
{dot(130, 440, 6, "#fffaf1", 0.5)}
{dot(680, 150, 5, "#fffaf1", 0.5)}
'''
    return frame("#7b5be0", "#4d34a3", "Memory Cards game art", extra, scene)


def thumb_tap():
    extra = '''  <linearGradient id="target" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>'''
    scene = f'''
<circle cx="400" cy="300" r="210" fill="#fffaf1" opacity="0.1"/>
<g filter="url(#soft)">
  <circle cx="400" cy="300" r="172" fill="url(#target)"/>
  <circle cx="400" cy="300" r="136" fill="#ef6666"/>
  <circle cx="400" cy="300" r="100" fill="#fffaf1"/>
  <circle cx="400" cy="300" r="64" fill="#ffa73a"/>
  <circle cx="400" cy="300" r="30" fill="#7b5be0"/>
  <path d="M400 210 L430 270 L400 390 L370 270 Z" fill="#ffe6bf" opacity="0.9"/>
</g>
<g fill="none" stroke="#fffaf1" stroke-width="6" stroke-linecap="round" opacity="0.75">
  <circle cx="400" cy="300" r="220" stroke-dasharray="4 22"/>
  <circle cx="400" cy="300" r="248" stroke-dasharray="3 26" opacity="0.5"/>
</g>
<path d="M610 420 C650 420 672 392 672 354" stroke="#fffaf1" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>
{sparkle(166, 170, 18, "#fffaf1", 0.85)}
{sparkle(648, 190, 14, "#ffd28a", 0.8)}
{dot(140, 420, 6, "#fffaf1", 0.5)}
{dot(676, 470, 5, "#fffaf1", 0.5)}
'''
    return frame("#6dbbf0", "#6244c8", "Quick Tap game art", extra, scene)


def thumb_tictactoe():
    extra = '''  <linearGradient id="board" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <rect x="214" y="114" width="372" height="372" rx="40" fill="url(#board)"/>
  <g stroke="#1f8f31" stroke-width="9" stroke-linecap="round" opacity="0.65">
    <path d="M338 142 L338 458"/>
    <path d="M462 142 L462 458"/>
    <path d="M242 238 L558 238"/>
    <path d="M242 362 L558 362"/>
  </g>
  <g stroke="#d24848" stroke-width="18" stroke-linecap="round">
    <path d="M272 168 L330 226 M330 168 L272 226"/>
    <path d="M472 292 L530 350 M530 292 L472 350"/>
    <path d="M272 392 L330 450 M330 392 L272 450"/>
  </g>
  <g fill="none" stroke="#7b5be0" stroke-width="16">
    <circle cx="400" cy="300" r="32"/>
    <circle cx="524" cy="190" r="32"/>
    <circle cx="276" cy="424" r="32"/>
  </g>
</g>
<path d="M272 168 L530 450" stroke="#ffd28a" stroke-width="12" stroke-linecap="round" opacity="0.65"/>
{sparkle(164, 154, 16, "#fffaf1", 0.85)}
{sparkle(650, 430, 12, "#fffaf1", 0.7)}
{dot(130, 330, 6, "#fffaf1", 0.5)}
{dot(676, 160, 5, "#fffaf1", 0.5)}
'''
    return frame("#4ccb5b", "#1f8f31", "Tic-Tac-Toe game art", extra, scene)


def thumb_chess():
    extra = '''  <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe6bf"/>
    <stop offset="1" stop-color="#ffbf5e"/>
  </linearGradient>
  <linearGradient id="piece" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>'''
    scene = f'''
<g filter="url(#soft)">
  <rect x="180" y="220" width="440" height="280" rx="26" fill="url(#board)"/>
  <g opacity="0.5">
    <rect x="180" y="220" width="110" height="70" fill="#7a4a1f"/>
    <rect x="400" y="220" width="110" height="70" fill="#7a4a1f"/>
    <rect x="290" y="290" width="110" height="70" fill="#7a4a1f"/>
    <rect x="510" y="290" width="110" height="70" fill="#7a4a1f"/>
    <rect x="180" y="360" width="110" height="70" fill="#7a4a1f"/>
    <rect x="400" y="360" width="110" height="70" fill="#7a4a1f"/>
    <rect x="290" y="430" width="110" height="70" fill="#7a4a1f"/>
    <rect x="510" y="430" width="110" height="70" fill="#7a4a1f"/>
  </g>
  <g transform="translate(286 126)">
    <path d="M34 54 L34 20 L54 20 L54 0 L74 0 L74 20 L94 20 L94 54 Z" fill="url(#piece)"/>
    <path d="M18 60 L110 60 L124 108 L4 108 Z" fill="url(#piece)"/>
    <path d="M12 112 L116 112 L132 188 L-4 188 Z" fill="url(#piece)"/>
    <rect x="-14" y="188" width="160" height="26" rx="12" fill="#fffaf1"/>
    <circle cx="64" cy="78" r="8" fill="#e8871a"/>
  </g>
  <g transform="translate(490 286)">
    <path d="M28 40 C28 14 52 0 76 0 C100 0 124 14 124 40 C124 60 112 76 96 86 L100 112 L52 112 L56 86 C40 76 28 60 28 40 Z" fill="#7b5be0"/>
    <path d="M34 116 L118 116 L128 178 L24 178 Z" fill="#7b5be0"/>
    <rect x="14" y="178" width="124" height="24" rx="12" fill="#6244c8"/>
    <circle cx="76" cy="42" r="16" fill="#ece6fc" opacity="0.7"/>
  </g>
</g>
{sparkle(160, 150, 16, "#fffaf1", 0.85)}
{sparkle(660, 190, 12, "#fffaf1", 0.7)}
{dot(130, 400, 6, "#fffaf1", 0.5)}
{dot(690, 360, 5, "#fffaf1", 0.5)}
'''
    return frame("#ffd28a", "#ffa73a", "Chess game art", extra, scene)


def thumb_memory_placeholder():
    return thumb_memory()


THUMBS = {
    "impostor": thumb_impostor,
    "werewolf": thumb_werewolf,
    "spyfall": thumb_spyfall,
    "tebak-gaya": thumb_charades,
    "kuis-tim": thumb_quiz,
    "jujur-berani": thumb_truth,
    "misi-rahasia": thumb_mission,
    "tebak-kata-kilat": thumb_speed,
    "kartu-memori": thumb_memory,
    "tangkas": thumb_tap,
    "tiga-sebaris": thumb_tictactoe,
    "catur": thumb_chess,
}

for slug, fn in THUMBS.items():
    (GAMES / f"{slug}.svg").write_text(fn(), encoding="utf-8")

# ---------------------------------------------------------------- backgrounds

def waves_sky():
    defs = '''  <linearGradient id="a" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fffaf1" stop-opacity="0.5"/>
    <stop offset="0.55" stop-color="#dff0fd" stop-opacity="0.28"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0.5"/>
  </linearGradient>
  <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#bfe2fb" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#fff3df" stop-opacity="0.3"/>
  </linearGradient>
  <linearGradient id="c" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffe6bf" stop-opacity="0.3"/>
    <stop offset="0.5" stop-color="#fffaf1" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#bfe2fb" stop-opacity="0.35"/>
  </linearGradient>
  <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fffaf1" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffd28a" stop-opacity="0.28"/>
    <stop offset="1" stop-color="#ffd28a" stop-opacity="0"/>
  </radialGradient>'''
    body = '''<rect width="1600" height="1200" fill="none"/>
<circle cx="1220" cy="160" r="330" fill="url(#glow2)"/>
<circle cx="280" cy="520" r="420" fill="url(#glow1)"/>
<path d="M0 760 C220 690 370 830 590 790 C810 750 960 650 1190 700 C1350 735 1490 790 1600 770 L1600 1200 L0 1200 Z" fill="url(#a)" opacity="0.8"/>
<path d="M0 870 C190 800 380 920 610 880 C840 840 1000 760 1230 805 C1390 835 1500 880 1600 860 L1600 1200 L0 1200 Z" fill="url(#b)" opacity="0.75"/>
<path d="M0 990 C230 920 430 1040 660 1000 C890 960 1060 890 1290 930 C1430 955 1530 985 1600 970 L1600 1200 L0 1200 Z" fill="url(#c)" opacity="0.8"/>
<path d="M0 1080 C260 1010 470 1120 700 1085 C930 1050 1110 990 1340 1020 C1460 1036 1540 1058 1600 1048 L1600 1200 L0 1200 Z" fill="#fffaf1" opacity="0.28"/>
<g fill="#fffaf1" opacity="0.5">
  <circle cx="180" cy="250" r="5"/>
  <circle cx="1450" cy="340" r="4"/>
  <circle cx="980" cy="220" r="6"/>
  <circle cx="520" cy="150" r="4"/>
</g>'''
    return doc(1600, 1200, defs, body, "Decorative sky waves")


def waves_night():
    defs = '''  <linearGradient id="a" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3b3a78" stop-opacity="0.65"/>
    <stop offset="0.5" stop-color="#8f8cc9" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#3b3a78" stop-opacity="0.65"/>
  </linearGradient>
  <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#212048" stop-opacity="0.8"/>
    <stop offset="1" stop-color="#3b3a78" stop-opacity="0.45"/>
  </linearGradient>
  <radialGradient id="moon" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffd28a" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#ffd28a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#8f8cc9" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#8f8cc9" stop-opacity="0"/>
  </radialGradient>'''
    body = '''<rect width="1600" height="1200" fill="none"/>
<circle cx="1250" cy="180" r="300" fill="url(#moon)"/>
<circle cx="1250" cy="180" r="86" fill="#ffd28a" opacity="0.7"/>
<circle cx="300" cy="500" r="430" fill="url(#glow)"/>
<path d="M0 780 C230 710 400 850 620 810 C840 770 1000 680 1220 720 C1380 750 1510 800 1600 780 L1600 1200 L0 1200 Z" fill="url(#a)" opacity="0.75"/>
<path d="M0 900 C240 830 430 960 660 920 C890 880 1060 800 1290 840 C1430 866 1530 900 1600 885 L1600 1200 L0 1200 Z" fill="url(#b)" opacity="0.8"/>
<path d="M0 1020 C260 950 470 1070 700 1030 C930 990 1110 930 1340 960 C1460 976 1540 998 1600 990 L1600 1200 L0 1200 Z" fill="#181738" opacity="0.85"/>
<g fill="#fff3df" opacity="0.55">
  <circle cx="200" cy="230" r="4"/>
  <circle cx="420" cy="140" r="5"/>
  <circle cx="760" cy="260" r="3"/>
  <circle cx="980" cy="120" r="4"/>
  <circle cx="1480" cy="380" r="5"/>
  <circle cx="680" cy="420" r="3"/>
</g>'''
    return doc(1600, 1200, defs, body, "Decorative night waves")


def waves_sun():
    defs = '''  <linearGradient id="a" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fffaf1" stop-opacity="0.55"/>
    <stop offset="0.5" stop-color="#fff3df" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0.55"/>
  </linearGradient>
  <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#e8871a" stop-opacity="0.18"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0.35"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fffaf1" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#fffaf1" stop-opacity="0"/>
  </radialGradient>'''
    body = '''<rect width="1600" height="800" fill="none"/>
<circle cx="280" cy="120" r="320" fill="url(#glow)"/>
<circle cx="1350" cy="680" r="280" fill="url(#glow)"/>
<path d="M0 420 C230 350 410 490 640 450 C870 410 1030 320 1260 360 C1400 384 1520 420 1600 405 L1600 800 L0 800 Z" fill="url(#a)" opacity="0.8"/>
<path d="M0 560 C250 490 440 620 680 580 C920 540 1090 460 1320 500 C1450 522 1540 548 1600 538 L1600 800 L0 800 Z" fill="url(#b)" opacity="0.75"/>
<path d="M0 680 C270 610 480 730 720 690 C960 650 1130 590 1360 620 C1470 634 1550 654 1600 648 L1600 800 L0 800 Z" fill="#fffaf1" opacity="0.3"/>
<g fill="#fffaf1" opacity="0.45">
  <circle cx="180" cy="220" r="5"/>
  <circle cx="1460" cy="260" r="4"/>
  <circle cx="900" cy="180" r="4"/>
</g>'''
    return doc(1600, 800, defs, body, "Decorative sun waves")


def confetti():
    defs = '''  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffd28a"/>
    <stop offset="1" stop-color="#7b5be0"/>
  </linearGradient>'''
    body = '''<rect width="800" height="600" fill="none"/>
<g opacity="0.5">
  <circle cx="90" cy="100" r="9" fill="#ffa73a"/>
  <circle cx="700" cy="150" r="7" fill="#7b5be0"/>
  <circle cx="160" cy="470" r="8" fill="#2fb344"/>
  <circle cx="650" cy="500" r="6" fill="#ef6666"/>
  <rect x="230" y="70" width="16" height="16" rx="4" fill="#7b5be0" transform="rotate(18 238 78)"/>
  <rect x="560" y="80" width="14" height="14" rx="4" fill="#ffa73a" transform="rotate(-20 567 87)"/>
  <rect x="100" y="330" width="14" height="14" rx="4" fill="#ef6666" transform="rotate(30 107 337)"/>
  <rect x="690" y="350" width="16" height="16" rx="4" fill="#2fb344" transform="rotate(-14 698 358)"/>
  <path d="M320 40 Q340 20 360 40" stroke="#ffa73a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M500 560 Q520 540 540 560" stroke="#7b5be0" stroke-width="5" fill="none" stroke-linecap="round"/>
</g>
<g fill="url(#g)" opacity="0.6">
  <path d="M400 120 C408 140 420 152 440 160 C420 168 408 180 400 200 C392 180 380 168 360 160 C380 152 392 140 400 120 Z"/>
  <path d="M120 240 C126 254 136 264 150 270 C136 276 126 286 120 300 C114 286 104 276 90 270 C104 264 114 254 120 240 Z" opacity="0.7"/>
  <path d="M680 420 C686 434 696 444 710 450 C696 456 686 466 680 480 C674 466 664 456 650 450 C664 444 674 434 680 420 Z" opacity="0.7"/>
</g>'''
    return doc(800, 600, defs, body, "Decorative confetti")


def empty_cards():
    defs = '''  <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ffe6bf"/>
  </linearGradient>
  <linearGradient id="grape" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9b7bf0"/>
    <stop offset="1" stop-color="#4d34a3"/>
  </linearGradient>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2b1608" flood-opacity="0.2"/>
  </filter>'''
    body = '''<rect width="640" height="420" fill="none"/>
<ellipse cx="320" cy="360" rx="220" ry="24" fill="#2b1608" opacity="0.12"/>
<g filter="url(#soft)">
  <rect x="130" y="120" width="170" height="220" rx="26" fill="url(#card)" transform="rotate(-12 215 230)"/>
  <rect x="340" y="120" width="170" height="220" rx="26" fill="url(#grape)" transform="rotate(12 425 230)"/>
  <circle cx="320" cy="230" r="76" fill="#fffaf1" opacity="0.92"/>
  <path d="M292 206 C292 178 348 178 348 206 C348 230 320 234 320 256" stroke="#7b5be0" stroke-width="14" fill="none" stroke-linecap="round"/>
  <circle cx="320" cy="278" r="9" fill="#7b5be0"/>
</g>
<g opacity="0.7">
  <path d="M98 90 C104 104 114 114 128 120 C114 126 104 136 98 150 C92 136 82 126 68 120 C82 114 92 104 98 90 Z" fill="#ffa73a"/>
  <path d="M540 80 C546 94 556 104 570 110 C556 116 546 126 540 140 C534 126 524 116 510 110 C524 104 534 94 540 80 Z" fill="#7b5be0" opacity="0.8"/>
  <circle cx="540" cy="320" r="7" fill="#2fb344"/>
  <circle cx="90" cy="300" r="6" fill="#ef6666"/>
</g>'''
    return doc(640, 420, defs, body, "Empty state illustration")


def not_found():
    defs = '''  <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9b7bf0"/>
    <stop offset="1" stop-color="#4d34a3"/>
  </linearGradient>
  <linearGradient id="mask" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffaf1"/>
    <stop offset="1" stop-color="#ece6fc"/>
  </linearGradient>
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2b1608" flood-opacity="0.2"/>
  </filter>'''
    body = '''<rect width="640" height="420" fill="none"/>
<ellipse cx="320" cy="362" rx="230" ry="24" fill="#2b1608" opacity="0.12"/>
<g filter="url(#soft)">
  <rect x="214" y="92" width="212" height="284" rx="30" fill="url(#card)" transform="rotate(-7 320 234)"/>
  <path d="M250 190 C270 164 300 164 320 186 C340 164 370 164 390 190 C390 230 366 256 320 256 C274 256 250 230 250 190 Z" fill="url(#mask)"/>
  <ellipse cx="288" cy="202" rx="16" ry="11" fill="#4d34a3"/>
  <ellipse cx="352" cy="202" rx="16" ry="11" fill="#4d34a3"/>
  <path d="M304 226 Q320 236 336 226" stroke="#7b5be0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M320 300 L338 330 L302 330 Z" fill="#ffd28a"/>
  <path d="M320 316 L320 342" stroke="#ffd28a" stroke-width="7" stroke-linecap="round"/>
</g>
<g filter="url(#soft)">
  <rect x="420" y="200" width="120" height="150" rx="20" fill="#fffaf1" transform="rotate(14 480 275)"/>
  <rect x="438" y="230" width="68" height="10" rx="5" fill="#dff0fd" transform="rotate(14 480 275)"/>
  <rect x="438" y="252" width="84" height="10" rx="5" fill="#dff0fd" transform="rotate(14 480 275)"/>
</g>
<g opacity="0.7">
  <path d="M120 110 C126 124 136 134 150 140 C136 146 126 156 120 170 C114 156 104 146 90 140 C104 134 114 124 120 110 Z" fill="#ffa73a"/>
  <path d="M540 80 C546 94 556 104 570 110 C556 116 546 126 540 140 C534 126 524 116 510 110 C524 104 534 94 540 80 Z" fill="#7b5be0" opacity="0.8"/>
  <circle cx="120" cy="300" r="6" fill="#ef6666"/>
  <circle cx="550" cy="330" r="7" fill="#2fb344"/>
</g>'''
    return doc(640, 420, defs, body, "Lost card illustration")


(OUT / "bg-waves-sky.svg").write_text(waves_sky(), encoding="utf-8")
(OUT / "bg-waves-night.svg").write_text(waves_night(), encoding="utf-8")
(OUT / "bg-waves-sun.svg").write_text(waves_sun(), encoding="utf-8")
(OUT / "confetti.svg").write_text(confetti(), encoding="utf-8")
(OUT / "empty-cards.svg").write_text(empty_cards(), encoding="utf-8")
(OUT / "not-found.svg").write_text(not_found(), encoding="utf-8")

print("wrote", len(list(OUT.rglob("*.svg"))), "svg files")
