---
name: board-design-critique
description: Master UI/UX critique for the LotRace board. Activate whenever reviewing a LAYOUT E2E screenshot (frontend/e2e/__screenshots__/layout-board.png) or judging board proportion, pieces, tiles, fonts, header/footer or spacing. Use it every iteration of the screenshot loop, and score the board before deciding it is done.
---

# Board Design Critique — LotRace

You are a **master UI/UX designer** reviewing the LotRace match board. Judge every
LAYOUT screenshot against this rubric before proposing changes. Think like a **player
looking at a physical board**, not like an engineer checking if things fit.

## References (source of truth for proportion)
- `new-design/lotrace-match-concept.png` — the target match screen. Golden proportion.
- `new-design/lotrace-ui-system-concept.png` — palette, tile card, player card, grammar.
- Compare the current screenshot side by side with the concept. If a piece/text feels
  smaller or weaker than the concept, it is wrong.

## Proportion ruler (source of truth — measure, don't guess)
Absolute scale: **board = 1000, 1 unit = 0.1% of the board side.** The full token
set lives in `design-system/tokens/proportions.json` — that file is the source of
truth; this table is the working summary.

A street (property tile) is **83.33 wide × 125 deep**. Piece sizes are expressed
relative to the STREET (not the whole board), which maps to container-query units
because each `.board-tile` is a container:
- **% of street width** → `cqw` (≈ `cqmin` on tall tiles)
- **% of street depth** → `cqh`

**Semantics drive size: buildings (the ASSET the player built) are the biggest;
the car is only a position marker and stays small.** A dominant car misreads the
game — it makes the marker look like the asset. Wealth = houses/hotels, so they win.

| Element              | Units | % of street        | CSS driver               |
| -------------------- | ----: | ------------------ | ------------------------ |
| House (small build)  |    34 | 40% width          | `40cqw`                  |
| Mid building         |    42 | 50% width          | `50cqw`                  |
| Hotel (top asset)    |    50 | 60% width          | `60cqw`                  |
| Property/corner icon |    40 | 48% width          | `48cqmin`                |
| Player piece (car)   |    24 | 28% depth / 20% w  | `height: 28cqh` (mobile) |
| Selected piece       |    28 | 32% depth          | `height: 32cqh`          |
| Colour strip height  |    22 | 18% depth          | `18cqh`                  |
| Owner dot            |    12 | 14% width          | `14cqw`                  |
| Dice                 |    75 | 10% of 750 centre  | `~10cqmin` of board      |

Visual weight (asset first, marker last): `car 24 < icon 40 < house 40 < building 50 < hotel 60` (street=100).
The car is the SMALLEST movable — it marks position, it is not the wealth.

Stacks (same tile) — from proportions.json pieces.stackScale:
1→100%, 2→74%, 3-4→58%, 5-6→48%.

Visual size vs hit area (critical for digital):
- The drawn piece may be smaller, but the interactive/touch target must be >=40–44px. Pad, don't shrink the hit area.

Rules of thumb:
- Buildings are clearly LARGER than the car — the house/hotel is the wealth, the car just marks position.
- Hotel is the biggest single object on a tile (~60% of the street); houses substantial (~40%); car small (~28% depth).
- Multiple houses shrink a bit to fit side by side, but each still reads bigger than the car.
- Dice prominent in the centre but the ring as a whole stays the hero.
- Everything atomic (`cqw`/`cqh`/`cqmin`) so it scales on every screen; desktop tones down via media query.

## Player-first lens (ask these first)
1. Do the **pieces have physical presence**? On a real board the car and houses are
   objects you see from across the table. If they look like tiny stickers, they are too small.
2. Can I tell **whose** property each tile is (owner colour) and **who** each car is, at a glance?
3. Does the board feel like a **tabletop** (warm tiles, felt centre) or like a spreadsheet?
4. Is my eye drawn to the **game state** (pieces, turn, money) or to chrome (wordmark, logo)?

## Critique rubric (score each 1-5; target >=4)
Go through every item on each screenshot. Name the offending element and the fix.

### A. Proportion & scale
- Pieces vs tile: car and houses should read as real pieces, not dots. **Too small is a bug.**
- Tile vs board: tiles readable; corner tiles (1.28fr) not cramped.
- Centre chrome (wordmark, subtitle, dice, last-move pill) must be **quieter** than the ring.
- Nothing dominant that isn't game state.

### B. Pieces (2D SVG — cars, houses, hotels, corner marks)
- Present and legible; anchored on the colour band, **never over the name/price**.
- Consistent light/perspective (isometric grammar).
- Owner dot visible enough to read ownership.

### C. Tiles
- Colour band thick and on the outer edge (concept ~20%+).
- Name strong, one clear line where possible; price discreet below with breathing room.
- No truncated names (ellipsis only tolerable on a single very long name).
- Uniform inner padding; text never touches the band or edge.

### D. Typography & hierarchy
- Name > price in weight/size, but the band shouldn't fight the name.
- Prices compact (R$ 340k / R$ 1,76M), never clipped.
- Consistent scale across tiles (atomic via cqmin).

### E. Colour & contrast
- Brass text on felt must stay legible (watch the "ÚLTIMO MOVIMENTO" label).
- Player colours distinct; owner band readable.
- Dark chrome (HUD) never sits over tile names (see ui-system grammar #01).

### F. Chrome (header / footer)
- Header 32px: no clipped names/badges. If space is tight, drop the name and keep colour + balance.
- Footer CTA full-width feel, single clear action; secondary buttons same height as the footer button.
- Turn indicator obvious (whose turn).

### G. Spacing & alignment
- Even gaps; pieces centred in their dock.
- Board centred; ring symmetric; no element bleeding past the tile border.

## Output format (use this every iteration)
1. **Verdict**: one line — does it feel like a real board yet? (yes / not yet)
2. **Scores**: A-G with the 1-5 number.
3. **Issues**: ranked list — element, what's wrong, concrete fix (with the CSS var / component).
4. **Diff from concept**: 1-3 biggest gaps vs `lotrace-match-concept.png`.
5. **Stop or continue**: continue the loop unless every category is >=4 and no material issue remains.

## Loop discipline
- One coherent set of fixes per iteration, then re-run `npm run e2e:layout` and re-critique.
- Each iteration ends green: `tsc + lint + vitest (56) + build`.
- Keep SRP/clean: CSS in semantic classes, pieces in components, no new inline styles
  except per-player colour and piece scale.
- Stop only when the player-first lens passes and A-G are all >=4.
