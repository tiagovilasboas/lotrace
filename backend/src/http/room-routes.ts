import type { Game } from 'boardgame.io';
import { bodyParser } from '@koa/bodyparser';
import { Server } from 'boardgame.io/server';
import {
  startRoomMatch,
  type MatchDatabase,
} from '../rooms/match-factory.ts';
import {
  assertHost,
  assertMinPlayers,
  RoomError,
  type RoomStore,
} from '../rooms/room-store.ts';
import { toRoomView, toSession } from '../rooms/room-view.ts';

type GameRouter = ReturnType<typeof Server>['router'];

function readNickname(body: unknown): string {
  if (typeof body !== 'object' || body === null) {
    return '';
  }
  const nickname = (body as { nickname?: unknown }).nickname;
  return typeof nickname === 'string' ? nickname : '';
}

function readToken(header: string | undefined, body: unknown): string {
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }
  if (typeof body === 'object' && body !== null) {
    const token = (body as { token?: unknown }).token;
    if (typeof token === 'string') {
      return token;
    }
  }
  return '';
}

export function registerRoomRoutes(
  router: GameRouter,
  store: RoomStore,
  game: Game,
  db: MatchDatabase,
): void {
  const parse = bodyParser();

  router.get('/health', (ctx) => {
    ctx.body = { ok: true };
  });

  router.get('/api/health', (ctx) => {
    ctx.body = { ok: true };
  });

  router.post('/api/rooms', parse, (ctx) => {
    try {
      const { room, player } = store.create(readNickname(ctx.request.body));
      ctx.status = 201;
      ctx.body = { room: toRoomView(room), session: toSession(room, player) };
    } catch (error) {
      handleError(ctx, error);
    }
  });

  router.post('/api/rooms/:code/join', parse, (ctx) => {
    try {
      const { room, player } = store.join(
        ctx.params.code ?? '',
        readNickname(ctx.request.body),
      );
      ctx.body = { room: toRoomView(room), session: toSession(room, player) };
    } catch (error) {
      handleError(ctx, error);
    }
  });

  router.get('/api/rooms/:code', (ctx) => {
    try {
      const code = ctx.params.code ?? '';
      const room = store.get(code);
      if (!room) {
        throw new RoomError('Sala não encontrada.', 404);
      }
      const token = readToken(ctx.get('authorization'), undefined);
      const player = token ? store.getByToken(code, token) : undefined;
      ctx.body = {
        room: toRoomView(room),
        session: player ? toSession(room, player) : null,
      };
    } catch (error) {
      handleError(ctx, error);
    }
  });

  router.post('/api/rooms/:code/start', parse, async (ctx) => {
    try {
      const code = ctx.params.code ?? '';
      const room = store.get(code);
      if (!room) {
        throw new RoomError('Sala não encontrada.', 404);
      }
      const token = readToken(ctx.get('authorization'), ctx.request.body);
      assertHost(room, token);
      assertMinPlayers(room);
      await startRoomMatch(room, game, db);
      const player = store.getByToken(code, token);
      ctx.body = {
        room: toRoomView(room),
        session: player ? toSession(room, player) : null,
      };
    } catch (error) {
      handleError(ctx, error);
    }
  });
}

function handleError(ctx: { status: number; body: unknown }, error: unknown): void {
  if (error instanceof RoomError) {
    ctx.status = error.status;
    ctx.body = { error: error.message };
    return;
  }
  ctx.status = 500;
  ctx.body = { error: 'Erro interno.' };
}
