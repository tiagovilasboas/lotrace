import { Imobiliario } from '@lotrace/shared';
import { Origins, Server } from 'boardgame.io/server';
import { loadConfig } from './config.ts';
import { createSqlClient } from './db/pool.ts';
import { PostgresMatchStorage } from './db/postgres-match-storage.ts';
import { registerRoomRoutes } from './http/room-routes.ts';
import { createRoomStore } from './rooms/room-store.ts';

const config = loadConfig();
const sql = config.databaseUrl
  ? createSqlClient(config.databaseUrl)
  : undefined;
const matchDb = sql ? new PostgresMatchStorage(sql) : undefined;
const store = createRoomStore();

const server = Server({
  games: [Imobiliario],
  origins: [...config.origins, Origins.LOCALHOST],
  ...(matchDb ? { db: matchDb } : {}),
});

registerRoomRoutes(server.router, store, Imobiliario, server.db);

void server.run({ port: config.port }, () => {
  console.info(
    `LotRace API on :${config.port} (rooms are in-memory; restart wipes them)`,
  );
});
