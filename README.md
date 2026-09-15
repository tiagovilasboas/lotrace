# Imobiliário

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

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Deploy: Vercel → repo root (or `frontend/`). Railway → this repo, Dockerfile at `backend/Dockerfile`. Set `VITE_API_URL` (Vercel) to the Railway origin and `CORS_ORIGIN` (Railway) to the Vercel origin. In-memory rooms vanish on Railway restart.

## Layout

```
shared/     game rules and types (boardgame.io Game)
backend/    boardgame.io server + HTTP room codes
frontend/   Vite React PWA (Vercel)
```
