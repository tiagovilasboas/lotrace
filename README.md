# LotRace

Classic property board PWA for 2–6 players. Host creates a room; guests join by code.

Tabuleiro clássico para 2 a 6 jogadores. Host cria a sala; convidados entram por código.

## Start

Node.js **22.12+**.

```bash
npm install
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
npm run dev
```

Open `http://localhost:5173`. Create a room on one phone-sized window, join with the 6-character code on another.

**Layout hotseat:** room code `LAYOUT` opens a local 2-player board (no API) to validate match UI.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Deploy: Vercel → repo root (or `frontend/`). Railway → this repo, Dockerfile at `backend/Dockerfile`. Set `VITE_API_URL` (Vercel) to the Railway origin and `CORS_ORIGIN` (Railway) to the Vercel origin. Set `DATABASE_URL` on the Railway **api** service (already wired) so rooms and matches survive restarts. Local `npm run dev` without `DATABASE_URL` stays in-memory.

## Layout

```
shared/     game rules and types (boardgame.io Game)
backend/    boardgame.io server + HTTP room codes
frontend/   Vite React PWA (Vercel)
design-system/  tokens, assets and visual-language docs (source of truth)
```

## Design System

Identity: **Tabletop Premium / City Night** — felt board, brass frame, midnight HUD.

Token layers (imported by `frontend/src/index.css`):

| File | What it contains |
|---|---|
| `tokens/primitives.css` | Raw brand hex — Midnight, Felt, Ivory, Brass, Action, Signal |
| `tokens/semantic.css` | Intent mapping — surface, text, border, action, turn |
| `tokens/game.css` | Board, pieces, die, HUD tokens |
| `tokens/typography.css` | Sora 800 (brand) + Inter (UI) |
| `tokens/elevation.css` | Shadows + z-index layers |
| `tokens/motion.css` | Durations, easings, keyframes |

See [`design-system/docs/visual-language.md`](design-system/docs/visual-language.md) for the full identity spec.
