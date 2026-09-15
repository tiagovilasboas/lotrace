import { MAX_PLAYERS } from '@lotrace/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  assertHost,
  assertMinPlayers,
  createRoomStore,
  RoomError,
  type RoomStore,
} from './room-store.ts';

async function expectRoomError(
  run: () => unknown | Promise<unknown>,
  status: number,
  message: string,
): Promise<void> {
  try {
    await run();
    expect.fail('expected RoomError');
  } catch (error) {
    expect(error).toBeInstanceOf(RoomError);
    if (error instanceof RoomError) {
      expect(error.status).toBe(status);
      expect(error.message).toBe(message);
    }
  }
}

describe('room store', () => {
  let store: RoomStore;

  beforeEach(() => {
    store = createRoomStore();
  });

  it('creates a lobby with the host on seat 0', async (): Promise<void> => {
    const { room, player } = await store.create('  Ana  ');

    expect(player.seat).toBe(0);
    expect(player.nickname).toBe('Ana');
    expect(player.credentials).toBeNull();
    expect(player.token.length).toBeGreaterThan(0);
    expect(room.status).toBe('lobby');
    expect(room.matchID).toBeNull();
    expect(room.players).toEqual([player]);
    expect(room.code).toHaveLength(6);
    expect(await store.get(room.code)).toBe(room);
    expect(await store.getByToken(room.code, player.token)).toBe(player);
  });

  it('joins an existing room by code', async (): Promise<void> => {
    const created = await store.create('Ana');
    const { room, player } = await store.join(
      created.room.code.toLowerCase(),
      'Bia',
    );

    expect(player.seat).toBe(1);
    expect(player.nickname).toBe('Bia');
    expect(room.code).toBe(created.room.code);
    expect(room.players).toHaveLength(2);
    expect(await store.getByToken(room.code, player.token)).toBe(player);
  });

  it('rejects a seventh player when the room is full', async (): Promise<void> => {
    const { room } = await store.create('Host');
    for (let seat = 1; seat < MAX_PLAYERS; seat += 1) {
      await store.join(room.code, `P${seat}`);
    }

    expect(room.players).toHaveLength(MAX_PLAYERS);
    await expectRoomError(
      () => store.join(room.code, 'Late'),
      409,
      'Sala cheia (máximo 6).',
    );
  });

  it('rejects start by a non-host', async (): Promise<void> => {
    const { room, player: host } = await store.create('Ana');
    const { player: guest } = await store.join(room.code, 'Bia');

    expect(assertHost(room, host.token)).toBe(host);
    await expectRoomError(
      () => assertHost(room, guest.token),
      403,
      'Só o anfitrião pode começar a partida.',
    );
    await expectRoomError(
      () => assertHost(room, 'missing-token'),
      403,
      'Só o anfitrião pode começar a partida.',
    );
  });

  it('rejects start with fewer than 2 players', async (): Promise<void> => {
    const { room } = await store.create('Ana');

    await expectRoomError(
      () => assertMinPlayers(room),
      400,
      'É preciso pelo menos 2 jogadores.',
    );

    await store.join(room.code, 'Bia');
    expect(() => assertMinPlayers(room)).not.toThrow();
  });

  it('isolates rooms across store instances', async (): Promise<void> => {
    const other = createRoomStore();
    const { room } = await store.create('Ana');

    expect(await other.get(room.code)).toBeUndefined();
  });

  it('persists start mutations through save', async (): Promise<void> => {
    const { room, player } = await store.create('Ana');
    await store.join(room.code, 'Bia');
    room.status = 'playing';
    room.matchID = room.code;
    player.credentials = 'cred-1';

    await store.save(room);

    const saved = await store.get(room.code);
    expect(saved?.status).toBe('playing');
    expect(saved?.matchID).toBe(room.code);
    expect(await store.getByToken(room.code, player.token)).toMatchObject({
      credentials: 'cred-1',
    });
  });
});
