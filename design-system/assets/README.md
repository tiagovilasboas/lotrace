# Assets

Standalone SVGs for Figma, iPhone Files, or `@/design-system` in the app.

| Path | Use |
| --- | --- |
| `brand/favicon.svg` | PWA + browser tab (felt `#1b4d3e`) |
| `brand/app-icon.svg` | Source for 192/512 PNG exports |
| `tokens/car-top-down.svg` | Player token template (`currentColor`) |
| `tokens/car-seat-*.svg` | Six seat colors (see `tokens/player-seats.json`) |
| `pieces/*.svg` | Isometric board glyphs (32×32 viewBox) |

React implementations live in **lotrace** `IsoIcons.tsx` / `CarToken.tsx` — keep paths in sync with these files.
