# AGENTS.md

Contract for code agents working on **LotRace** (classic property board — not Monopoly® / Banco Imobiliário®).

## Stack

- Monorepo (npm workspaces): `shared/` · `backend/` · `frontend/`
- **shared**: boardgame.io `Game`, board, types, pure rules
- **backend**: boardgame.io `Server` + Koa HTTP rooms (in-memory)
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
| `npm test` | shared rule tests |
| `npm run build` | production bundles |

## MVP rules

- 24 cells, 2d6, buy or pay rent, pass Partida → R$200. **No auctions, no Chance deck, no hotels.**
- **Doubles:** after resolving movement/landing/buy for that roll, `die1 === die2` grants another roll in the same turn. Consecutive doubles are tracked on G. **3 doubles in a row** → jail (`JAIL_INDEX`, `inJail=true`, log reason `'doubles'`), counter cleared, turn ends; the third roll does not move. A non-doubles roll resets the counter. Jail exit stays pay/wait; doubles-while-leaving-jail is not required.
- **Houses:** from the `end` stage, `buyHouse` on a property you own if you hold the entire `colorGroup` monopoly, that cell has fewer than 4 houses, and you can afford it. Even-build: cannot add a house if another lot in the group has fewer houses. **House cost** = `Math.floor((cell.price ?? 0) / 2)`. **Rent** with houses: 0→1×, 1→2×, 2→3×, 3→4×, 4→5× base `cell.rent`. Stations and tax unchanged. Bankruptcy returns properties to the bank and clears houses.
- **Jail:** pay R$50 to leave and roll this turn, **or** skip movement up to **3 turns** then leave free.
- **Win:** last solvent player. Cannot pay rent/tax → bankrupt; properties return to the bank.

## Do

- Keep modules SRP-sized. Annotate exported function return types.
- Rooms are **in-memory**: a Railway restart wipes lobbies and matches.
- CORS via `CORS_ORIGIN`; frontend API via `VITE_API_URL`. No invented secrets.

## Don't

- Don't brand as Monopoly® or Banco Imobiliário®.
- Don't fetch from UI components. Don't put rules in React.
- Don't add accounts, hotels, or a card deck in v1.
- Don't commit `.env` or tokens.

Harness adapters are optional. If they conflict, **this file wins**.
