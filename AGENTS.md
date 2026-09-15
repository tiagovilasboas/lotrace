# AGENTS.md

Contract for code agents working on **LotRace** (classic property board — not Monopoly® / Banco Imobiliário®).

## Stack

- Monorepo (npm workspaces): `shared/` · `backend/` · `frontend/`
- **shared**: boardgame.io `Game`, board, types, pure rules
- **backend**: boardgame.io `Server` + Koa HTTP rooms (Postgres when `DATABASE_URL` is set; otherwise in-memory)
- **frontend**: Vite 6 + React 19 + Tailwind 4 PWA (Quinto-like: cards, big CTAs, PT-BR, light/dark)
- Node **22.12+**. No login — nickname + 6-char room code.

## Layers

`UI` → `hooks` → `lib/repositories` → HTTP. Rules stay in `shared/`. Transport (socket/HTTP) stays in `backend/`.

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | API `:8000` + Vite `:5173` |
| `npm run typecheck` | `tsc` in all workspaces |
| `npm run lint` | ESLint |
| `npm test` | shared + backend tests |
| `npm run build` | production bundles |

## MVP rules

- 24 cells, 2d6, buy or pay rent, pass Partida → R$200. **No houses, no auctions, no Chance deck.**
- **Jail:** pay R$50 to leave and roll this turn, **or** skip movement up to **3 turns** then leave free.
- **Win:** last solvent player. Cannot pay rent/tax → bankrupt; properties return to the bank.
- Doubles do not grant an extra roll.

## Do

- Keep modules SRP-sized. Annotate exported function return types.
- Rooms and matches are **durable** when `DATABASE_URL` is set (Railway Postgres). Local `npm run dev` without it keeps in-memory stores (restart wipes them). Never commit the URL value.
- CORS via `CORS_ORIGIN`; frontend API via `VITE_API_URL`. No invented secrets.

## Don't

- Don't brand as Monopoly® or Banco Imobiliário®.
- Don't fetch from UI components. Don't put rules in React.
- Don't add accounts, hotels, or a card deck in v1.
- Don't commit `.env` or tokens.

Harness adapters are optional. If they conflict, **this file wins**.
