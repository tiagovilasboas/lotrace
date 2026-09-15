FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

# pg is pure JavaScript; no extra alpine packages (libpq) are required.
RUN npm ci --omit=dev --workspace=@lotrace/shared --workspace=@lotrace/backend

COPY shared ./shared
COPY backend ./backend

ENV NODE_ENV=production
EXPOSE 8000

WORKDIR /app/backend
CMD ["npx", "tsx", "src/index.ts"]
