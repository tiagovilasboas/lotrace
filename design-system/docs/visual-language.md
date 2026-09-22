# LotRace — Visual Language

**Identity:** Tabletop Premium / City Night  
**Concept:** physical premium board game, night city, felt, paper, metal and racing lights — without looking like a SaaS and without copying Monopoly / Banco Imobiliário® visually.

---

## 1. Core Palette

These are the six brand primitives. Every other color in the system derives from them.

| Token | Hex | Role |
|---|---|---|
| `--lr-midnight` | `#061221` | Table surface, page background |
| `--lr-felt` | `#0E473A` | Board felt |
| `--lr-ivory` | `#F7F0DE` | Tile paper |
| `--lr-brass` | `#E4B44A` | Board frame, gold accent |
| `--lr-action` | `#3B82F6` | Primary CTA (LANÇAR DADOS) |
| `--lr-signal` | `#57D8FF` | Turn highlight — active player ring |

The board has two identities that must never bleed into each other:

- **Dark chrome** — HUD, actions, player cards: `--lr-midnight` family.
- **Warm board** — tiles, felt, pieces: `--lr-ivory` + `--lr-felt` family.

---

## 2. Visual Grammar

### 2.1 Dark Chrome
HUD and actions live in navy. Never render player names, cash amounts or CTA buttons on top of property tile names. The felt is for the board; the navy is for everything else.

```
Page:           --surface-table   (#061221)
HUD cards:      --surface-hud     (#0d2942)
Header bar:     --surface-hud-raised
Text on HUD:    --text-on-table   (#e8eef8)
Hint text:      --text-on-table-dim (60% opacity)
```

### 2.2 Warm Board
Tiles use ivory paper. The felt is green and textured with CSS-only gradients — no images. The outer board frame uses a brass/gold inset shadow.

```
Tile background:  --surface-tile   (#F7F0DE)
Board felt:       --surface-board  (#0E473A)
Board frame:      --border-board   (#E4B44A)  — 4px inset
City silhouette:  --surface-board-deep (#0b3a28)
```

Felt texture is CSS-only:
```css
background:
  radial-gradient(circle at 48% 30%, rgba(255,255,255,0.05), transparent 42%),
  radial-gradient(circle at 60% 80%,  rgba(0,0,0,0.12),     transparent 50%),
  var(--lr-felt);
```

### 2.3 SVG Pieces
Houses, hotels, stations and car tokens share the same imaginary light source: top-left.

- Highlight: lighter shade — top/left face.
- Base color: frontal plane.
- Shadow: 25–35% darker — lateral plane.
- Ground shadow: small ellipse at the base (`--piece-shadow`).
- Player car outline: `--piece-outline` (ivory) — 1.15px stroke.

All piece colors that are system-level (wheels, hubs, windows, shadows) reference CSS variables from `tokens/game.css`. Illustration colors internal to a piece (house roof green, hotel red, station blue) can be hardcoded SVG values since they are not themed.

### 2.4 Motion With Purpose
Animation fires only when communicating a turn change or piece movement. Never decorative.

| Moment | Animation | Token |
|---|---|---|
| Dice rolled | `lr-dice-roll` (560ms spring) | `--duration-roll` |
| Car arrives at tile | `lr-token-arrive` (320ms) | `--duration-arrive` |
| Active player card | `lr-turn-pulse` (1500ms breathing) | `--duration-pulse` |
| Active player ring | `lr-player-ring-pulse` (1.8s) | — |

All animations respect `prefers-reduced-motion`.

---

## 3. Layout Contract

```
┌─────────────────────────────────┐
│  Header bar (--surface-hud-raised)  │  z-index: --z-hud
│  Logo + ThemeToggle             │
├─────────────────────────────────┤
│  Player list (--surface-hud)    │  z-index: --z-hud
│  2–4 players: full cards        │
│  5–6 players: compact chips     │
├─────────────────────────────────┤
│                                 │
│  Board (--surface-board)        │  z-index: --z-board-tile
│  Hero visual — never covered    │    pieces: --z-board-piece
│  by HUD or action elements      │    tokens: --z-board-token
│                                 │
├─────────────────────────────────┤
│  Action bar (--surface-table)   │  z-index: --z-action-bar
│  Prompt card + CTA buttons      │
└─────────────────────────────────┘
```

Rules:
- Nothing important (property name, price) is ever covered by the car token or HUD.
- The action bar is sticky bottom — players always see their action without scrolling.
- `GameFxCanvas` sits above tokens (`--z-fx-canvas: 30`) with `pointer-events: none`.

---

## 4. Turn Highlight

The active player is communicated by **one visual system only**: the signal cyan ring.

```css
/* Active card */
box-shadow: 0 0 0 2px var(--lr-signal),
            0 0 18px rgba(87, 216, 255, 0.28);
border-color: var(--lr-signal);

/* Turn badge */
background: var(--turn-badge-bg);   /* --lr-signal */
color:      var(--turn-badge-text); /* #0c1a2e — dark on cyan */
```

Do not use green (`--lr-felt` family) or yellow (`--lr-brass`) for turn state. Those belong to the board.

---

## 5. Typography Scale

| Role | Family | Size | Weight | Where |
|---|---|---|---|---|
| Display | Sora | 32–48px | 800 | LOTRACE wordmark, game over |
| Title | Sora | 20–24px | 800 | Section headers, room code |
| HUD | Inter | 14px | 700 | Player name, cash |
| Body | Inter | 14px | 500 | Prompts, hints |
| Tile name | Inter | `clamp(0.46rem, 16cqmin, 0.8rem)` | 700 | Property name on board |
| Tile price | Inter | `clamp(0.4rem, 12cqmin, 0.62rem)` | 600 | Price on board |
| Micro | Inter | 9px | 700 uppercase | Badge (VEZ), label (YOU) |
| Board label | Inter | 11px | 700 uppercase | LOTRACE center, ÚLTIMO MOVIMENTO |

Rules:
- `container-type: size` on every tile so `cqmin` units work correctly.
- Numbers: always `font-variant-numeric: tabular-nums`.
- Tile text: `text-overflow: ellipsis; white-space: nowrap` — never breaks mid-word.

---

## 6. Property Groups

Group colors are fixed — they are part of the game ruleset, not the brand palette.

| Group | Hex | Tailwind alias |
|---|---|---|
| Brown | `#955436` | `group-brown` |
| Sky | `#AAE0FA` | `group-sky` |
| Pink | `#D93A96` | `group-pink` |
| Orange | `#F7941D` | `group-orange` |
| Red | `#ED1B24` | `group-red` |
| Yellow | `#FEF200` | `group-yellow` |
| Green | `#1FB25A` | `group-green` |
| Navy | `#0072BB` | `group-navy` |

The color bar on a property tile uses the group color at full opacity. The tile body uses `--surface-tile` (ivory). Never invert.

---

## 7. Rendering Strategy

| Layer | Technology | What lives here |
|---|---|---|
| DOM + CSS | Tailwind + CSS variables | Layout, text, buttons, cards, HUD, accessibility, responsiveness |
| SVG | React + inline SVG | Board, car tokens, houses, hotels, stations, logos, city center, special icons |
| Canvas | `<GameFxCanvas>` `pointer-events:none` | Particle effects only: car trail, property buy burst, color-group confetti, victory rain |

Canvas is for **ephemeral effects only**. Never render board state, text, or UI on Canvas.

```
Board DOM
   ↓
SVG pieces   (--z-board-piece: 10 / --z-board-token: 20)
   ↓
GameFxCanvas (--z-fx-canvas: 30)  ← pointer-events: none
   ↓
HUD DOM      (--z-hud: 40)
   ↓
ActionBar    (--z-action-bar: 50)
```

---

## 8. Component Inventory

Components the DS should formally cover (priority order):

| Component | Status | Notes |
|---|---|---|
| `GameButton` | ✅ via `match-cta` / `match-secondary` | Primary + outline variants |
| `PlayerChip` | ✅ `PlayerList` | 2–4 full / 5–6 compact TBD |
| `PropertyTile` | ✅ `PropertyTile.tsx` | color bar + name + price |
| `CarToken` | ✅ | HUD + board + lobby sizes |
| `DiceDisplay` | ✅ | pseudo-3D CSS, no WebGL |
| `ActionBar` | ✅ | Prompt card + CTA |
| `BoardPiece` | ✅ `IsoIcons.tsx` | house, hotel, station, tax |
| `EventLog` | ✅ | last move text |
| `RoomCode` | 🔲 | 6-char lobby code display |
| `GameModal` | 🔲 | property detail, bankruptcy |
| `GamePrompt` | 🔲 | non-CTA overlay (buy confirm) |
| `Toast` | 🔲 | transient event notification |
| `StatusBadge` | 🔲 | bankrupt, in jail, etc. |
| `Money` | 🔲 | formatted R$ with tabular nums |
| `BottomActionBar` | 🔲 | sticky bar scaffold |

For each component, define states: `default / hover / pressed / disabled / focus / active-turn / danger`.

---

## 9. Anti-Patterns

- ❌ Hardcoded hex values in React components — use tokens.
- ❌ `text-white` or `text-slate-950` in components — use `text-on-table`, `text-on-tile`, `text-board-label`.
- ❌ `bg-sky-400` for turn state — use `bg-[color:var(--turn-highlight)]`.
- ❌ `color-mix(in srgb, var(--match-card) 88%, transparent)` inline — use `.surface-card`.
- ❌ Canvas for board state, property text, or UI chrome.
- ❌ DOM/CSS for particle trails or confetti.
- ❌ Three.js / WebGL for dice — pseudo-3D CSS is sufficient and matches the physical feel.
- ❌ Rendering the board as a `<canvas>` — SVG + React gives text, accessibility, and hit areas for free.
