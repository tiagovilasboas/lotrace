# Contributing

Thanks for helping with LotRace.

## Setup

1. Fork and clone the repository.
2. Use **Node.js 22.12+**.
3. Install from the repo root: `npm install`.
4. Copy env examples:
   - `frontend/.env.example` → `frontend/.env`
   - `backend/.env.example` → `backend/.env`
5. Run `npm run dev` and open `http://localhost:5173`.
6. Optional: set `DATABASE_URL` in `backend/.env` to persist rooms and matches in Postgres. Leave it unset to keep the in-memory local fallback.

## Pull requests

- Branch from `main`. Conventional Commits in **English** (`feat(shared): …`).
- Keep changes layered: domain (`shared/`), transport (`backend/`), UI (`frontend/`).
- Do not commit `.env` files or secrets.
- CI must pass: typecheck, lint, tests, and build.

## Code style

- TypeScript strict. No `any` — use `unknown` and narrow.
- UI components are presentational; hooks/containers own state and call `lib/repositories/`.
- Game rules live in `shared/` only. Do not duplicate win/jail logic in the UI.
- PT-BR copy for the player-facing UI; English for docs, types, and comments.

## License

MIT. See `LICENSE`.
