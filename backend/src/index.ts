import { Imobiliario } from '@lotrace/shared';
import { Origins, Server } from 'boardgame.io/server';
import { loadConfig } from './config.ts';
import { createSqlClient } from './db/pool.ts';
import { PostgresMatchStorage } from './db/postgres-match-storage.ts';
import { registerRoomRoutes } from './http/room-routes.ts';
import { createPostgresRoomStore } from './rooms/postgres-room-store.ts';
import { createRoomStore } from './rooms/room-store.ts';

function storageLabel(durable: boolean): string {
  return durable
    ? 'Postgres rooms and matches'
    : 'in-memory rooms and matches; set DATABASE_URL to persist';
}

async function main(): Promise<void> {
  const config = loadConfig();
  const db = config.databaseUrl
    ? createSqlClient(config.databaseUrl)
    : undefined;
  const matchDb = db ? new PostgresMatchStorage(db) : undefined;
  const store = db ? createPostgresRoomStore(db) : createRoomStore();

  const server = Server({
    games: [Imobiliario],
    origins: [...config.origins, Origins.LOCALHOST],
    ...(matchDb ? { db: matchDb } : {}),
  });

  registerRoomRoutes(server.router, store, Imobiliario, server.db);

  await server.run({ port: config.port }, () => {
    console.info(`LotRace API on :${config.port} (${storageLabel(Boolean(db))})`);
  });
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
