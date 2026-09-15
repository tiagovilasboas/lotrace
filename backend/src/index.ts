import { Imobiliario } from '@lotrace/shared';
import { Origins, Server } from 'boardgame.io/server';
import { loadConfig } from './config.ts';
import { registerRoomRoutes } from './http/room-routes.ts';
import { createRoomStore } from './rooms/room-store.ts';

const config = loadConfig();
const store = createRoomStore();

const server = Server({
  games: [Imobiliario],
  origins: [...config.origins, Origins.LOCALHOST],
});

registerRoomRoutes(server.router, store, Imobiliario, server.db);

void server.run({ port: config.port }, () => {
  console.info(
    `Imobiliário API on :${config.port} (rooms are in-memory; restart wipes them)`,
  );
});
