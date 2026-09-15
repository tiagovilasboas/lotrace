import { MAX_PLAYERS } from '@lotrace/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  assertHost,
  assertMinPlayers,
  createRoomStore,
  RoomError,
  type RoomStore,
} from './room-store.ts';

function expectRoomError(
  run: () => unknown,
  status: number,
  message: string,
): void {
  try {
    run();
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

  it('creates a lobby with the host on seat 0', (): void => {
    const { room, player } = store.create('  Ana  ');

    expect(player.seat).toBe(0);
    expect(player.nickname).toBe('Ana');
    expect(player.credentials).toBeNull();
    expect(player.token.length).toBeGreaterThan(0);
    expect(room.status).toBe('lobby');
    expect(room.matchID).toBeNull();
    expect(room.players).toEqual([player]);
    expect(room.code).toHaveLength(6);
    expect(store.get(room.code)).toBe(room);
    expect(store.getByToken(room.code, player.token)).toBe(player);
  });

  it('joins an existing room by code', (): void => {
    const created = store.create('Ana');
    const { room, player } = store.join(created.room.code.toLowerCase(), 'Bia');

    expect(player.seat).toBe(1);
    expect(player.nickname).toBe('Bia');
    expect(room.code).toBe(created.room.code);
    expect(room.players).toHaveLength(2);
    expect(store.getByToken(room.code, player.token)).toBe(player);
  });

  it('rejects a seventh player when the room is full', (): void => {
    const { room } = store.create('Host');
    for (let seat = 1; seat < MAX_PLAYERS; seat += 1) {
      store.join(room.code, `P${seat}`);
    }

    expect(room.players).toHaveLength(MAX_PLAYERS);
    expectRoomError(
      () => store.join(room.code, 'Late'),
      409,
      'Sala cheia (máximo 6).',
    );
  });

  it('rejects start by a non-host', (): void => {
    const { room, player: host } = store.create('Ana');
    const { player: guest } = store.join(room.code, 'Bia');

    expect(assertHost(room, host.token)).toBe(host);
    expectRoomError(
      () => assertHost(room, guest.token),
      403,
      'Só o anfitrião pode começar a partida.',
    );
    expectRoomError(
      () => assertHost(room, 'missing-token'),
      403,
      'Só o anfitrião pode começar a partida.',
    );
  });

  it('rejects start with fewer than 2 players', (): void => {
    const { room } = store.create('Ana');

    expectRoomError(
      () => assertMinPlayers(room),
      400,
      'É preciso pelo menos 2 jogadores.',
    );

    store.join(room.code, 'Bia');
    expect(() => assertMinPlayers(room)).not.toThrow();
  });
});
