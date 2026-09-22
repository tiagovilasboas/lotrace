# LotRace Design System

**Identity:** Tabletop Premium / City Night — physical premium board game, night city, felt, paper, metal and racing lights.

> This `design-system/` directory **is the source of truth**. The external repo
> [`lotrace-design-system`](https://github.com/tiagovilasboas/lotrace-design-system)
> is now outdated — the token architecture, palette, and visual language here are
> significantly ahead of it. Do not sync from upstream.

---

## Token Architecture

Six layered CSS files. Import in this exact order — each layer builds on the one above.

```
tokens/
├── primitives.css   — raw brand hex (Midnight, Felt, Ivory, Brass, Action, Signal)
├── semantic.css     — maps primitives to intent (surface, text, border, action, turn)
├── game.css         — board, pieces, die, HUD domain tokens
├── typography.css   — Sora 800 (brand/headlines) + Inter (UI), full scale
├── elevation.css    — semantic shadows and z-index layers
└── motion.css       — durations, easings, keyframes (lr- prefix)
```

`frontend/src/index.css` imports all six and bridges every token into Tailwind 4's
`@theme` so they're available as utility classes (`bg-surface-table`, `text-on-table`, etc.).

**Rule:** components consume `semantic.css` or `game.css` tokens only.
Never reference `primitives.css` variables directly in a component.

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

| Layer | Technology | Responsibility |
|---|---|---|
| DOM + CSS | Tailwind + CSS tokens | Layout, text, buttons, HUD, accessibility |
| SVG | React inline SVG | Board, pieces, tokens, icons, city silhouette |
| Canvas | `<GameFxCanvas>` pointer-events:none | Particles, trail, confetti only |

Never put board state or UI chrome on Canvas. Never put trails or confetti in DOM.

---

## Assets

```
assets/
├── brand/        app-icon.svg, favicon.svg
├── pieces/       corner-go, corner-goto-jail, corner-jail, corner-park,
│                 hotel, house, station, tax
└── tokens/       car-seat-{0-5}-{color}.svg, car-top-down.svg
```

All pieces share the same light source: **top-left**.
Highlight on top/left face, shadow on lateral plane.

---

## Docs

```
docs/
├── visual-language.md   — identity, grammar, layout contract, anti-patterns ✅
├── components.md        — component inventory and state specs  (TODO)
├── motion.md            — animation principles and Canvas FX guide  (TODO)
└── accessibility.md     — WCAG targets, focus management, reduced-motion  (TODO)
```

Start with [`docs/visual-language.md`](docs/visual-language.md).
