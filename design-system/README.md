# LotRace Design System

**Identity:** Tabletop Premium / City Night — physical premium board game, night city, felt, paper, metal and racing lights.

Mirror of [lotrace-design-system](https://github.com/tiagovilasboas/lotrace-design-system). The `design-system/` directory in this repo is the vendored/built copy consumed by the game. The upstream repo is the source of truth; copy from there to refresh.

---

## Token Architecture

Tokens are layered. Import them in this exact order — each layer depends on the one above.

```
tokens/
├── primitives.css   — raw brand values (hex, no semantics)
├── semantic.css     — maps primitives to intent (surface, text, border, action)
├── game.css         — domain tokens (board, pieces, die, HUD)
├── typography.css   — font families and scale
├── elevation.css    — shadows and z-index layers
└── motion.css       — durations, easings, keyframes
```

`frontend/src/index.css` imports all six files and bridges them into Tailwind 4's `@theme` so every token is available as a utility class.

**Rule:** components consume `semantic.css` or `game.css` tokens only. Never reference `primitives.css` variables directly in a component (they exist so semantic tokens can be updated in one place).

---

## Core Palette

| Token | Hex | Role |
|---|---|---|
| `--lr-midnight` | `#061221` | Table background |
| `--lr-felt` | `#0E473A` | Board felt |
| `--lr-ivory` | `#F7F0DE` | Tile paper |
| `--lr-brass` | `#E4B44A` | Board frame |
| `--lr-action` | `#3B82F6` | Primary CTA |
| `--lr-signal` | `#57D8FF` | Active turn |

---

## Rendering Strategy

Three layers. Each has a single responsibility and must not be mixed.

### DOM + CSS
Layout, text, buttons, cards, HUD, badges, modals, accessibility, responsiveness.

- Uses Tailwind 4 utility classes bridged from CSS tokens.
- Felt texture via `radial-gradient` in CSS — no background images.
- Board frame via `inset box-shadow` in brass — no border images.

### SVG
Board tiles, car tokens, houses, hotels, stations, logos, city center silhouette, special icons.

- All React components render inline SVG.
- Piece colors that are system-level (wheels, shadows, windows) reference CSS variables.
- Illustration colors internal to a piece (house green, hotel red) can be hardcoded inside the SVG.
- Advantages over Canvas: native text, responsive layout, hit areas, accessibility, easy animation via CSS/WAAPI.

```
<!-- correct -->
<ellipse fill="var(--piece-shadow)" />
<path fill="currentColor" stroke="var(--piece-outline)" />

<!-- wrong -->
<ellipse fill="#1c1917" opacity="0.28" />
```

### Canvas
Ephemeral particle effects only. `pointer-events: none`. Positioned absolute over the board.

| Effect | Trigger |
|---|---|
| Car trail glow | Piece movement |
| Property buy burst | `buyProperty` move |
| Color group confetti | Monopoly completed |
| Victory rain | Game over |

**Never** use Canvas for: board state, property names, player info, dice faces, HUD elements.

Stack order:

```
Board DOM          z: --z-board-tile  (1)
SVG pieces         z: --z-board-piece (10) / --z-board-token (20)
GameFxCanvas       z: --z-fx-canvas   (30) ← pointer-events: none
HUD DOM            z: --z-hud         (40)
ActionBar          z: --z-action-bar  (50)
GameModal          z: --z-modal       (60)
Toast              z: --z-toast       (70)
```

---

## Assets

```
assets/
├── brand/
│   ├── app-icon.svg     — app icon (works at 24px and full splash)
│   └── favicon.svg
├── pieces/
│   ├── corner-go.svg
│   ├── corner-goto-jail.svg
│   ├── corner-jail.svg
│   ├── corner-park.svg
│   ├── hotel.svg
│   ├── house.svg
│   ├── station.svg
│   └── tax.svg
└── tokens/
    ├── car-seat-0-rose.svg     — player 0 car (top-down, rose)
    ├── car-seat-1-emerald.svg
    ├── car-seat-2-amber.svg
    ├── car-seat-3-violet.svg
    ├── car-seat-4-cyan.svg
    ├── car-seat-5-fuchsia.svg
    └── car-top-down.svg        — generic / neutral
```

All pieces use the same imaginary light source: **top-left**. Highlight on top/left face, shadow on lateral plane.

---

## Docs

```
docs/
├── visual-language.md   — identity, grammar, layout contract, anti-patterns
├── components.md        — component inventory and state specs  (TODO)
├── motion.md            — animation principles and Canvas FX guide  (TODO)
└── accessibility.md     — WCAG targets, focus management, reduced-motion  (TODO)
```

Start with [`docs/visual-language.md`](docs/visual-language.md) for the full design rationale.

---

## Refreshing from Upstream

```bash
# Copy token files
cp -r lotrace-design-system/tokens/* design-system/tokens/

# Copy assets
cp -r lotrace-design-system/assets/* design-system/assets/

# Keep IsoIcons.tsx paths aligned with assets/pieces/*.svg
```

After copying tokens, verify `frontend/src/index.css` imports still resolve and run:

```bash
node_modules/.bin/tsc --noEmit -p frontend/tsconfig.json
node_modules/.bin/vitest run
```
