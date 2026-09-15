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

- 24 cells, 2d6, buy or pay rent, pass Partida → R$200. **No auctions, no Chance deck.**
- **Cash:** start with **R$2500**. Unimproved monopoly rent is **2×** the base. Stations pay 25/50/100/200 by how many the owner holds. IPTU R$200, IR R$100.
- **Doubles:** after resolving movement/landing/buy for that roll, `die1 === die2` grants another roll in the same turn. Consecutive doubles are tracked on G. **3 doubles in a row** → jail (`JAIL_INDEX`, `inJail=true`, log reason `'doubles'`), counter cleared, turn ends; the third roll does not move. A non-doubles roll resets the counter.
- **Buildings:** from the `end` stage, `buyHouse` on a property you own if you hold the entire `colorGroup` monopoly, the cell is below a hotel (`HOTEL_LEVEL` 5), and you can afford it. Even-build across the group. **House/hotel cost** is by color band: brown/sky R$50, pink/orange R$100, red/yellow R$150, green/navy R$200. Rent uses each lot’s ladder (0–4 houses, then hotel). Bankruptcy returns properties to the bank and clears buildings.
- **Jail:** pay R$50 then roll this turn, **or** try 2d6 — doubles leave and move (no extra turn). A failed roll stays in jail. On the **3rd** try, pay R$50 and move with that roll (bankrupt if you cannot pay).
- **Win:** last solvent player. Cannot pay rent/tax → bankrupt; properties return to the bank.

## Do

- Keep modules SRP-sized. Annotate exported function return types.
- Rooms and matches are **durable** when `DATABASE_URL` is set (Railway Postgres). Local `npm run dev` without it keeps in-memory stores (restart wipes them). Never commit the URL value.
- CORS via `CORS_ORIGIN`; frontend API via `VITE_API_URL`. No invented secrets.
- Match UI is mobile-first: the board is the hero (`min(100%, 100dvh − chrome)`), HUD chips overlay the top, CTAs sit in a sticky bottom bar, events announce on the felt.

## Don't

- Don't brand as Monopoly® or Banco Imobiliário®.
- Don't fetch from UI components. Don't put rules in React.
- Don't add accounts or a card deck in v1.
- Don't commit `.env` or tokens.

Harness adapters are optional. If they conflict, **this file wins**.
