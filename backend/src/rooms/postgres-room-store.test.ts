import { describe, expect, it, vi } from 'vitest';
import type { SqlClient } from '../db/sql.ts';
import { createPostgresRoomStore } from './postgres-room-store.ts';
import { RoomError, type Room } from './room-store.ts';

function lobbyRow(overrides: Partial<{
  code: string;
  status: string;
  players: unknown;
  match_id: string | null;
  created_at: number;
}> = {}): Record<string, unknown> {
  return {
    code: 'ABC123',
    status: 'lobby',
    players: [
      {
        seat: 0,
        nickname: 'Ana',
        token: 'host-token',
        credentials: null,
      },
    ],
    match_id: null,
    created_at: 1_700_000_000_000,
    ...overrides,
  };
}

function createClient(
  impl: (text: string, values?: unknown[]) => Promise<{ rows: unknown[]; rowCount: number }>,
): SqlClient {
  return {
    query: vi.fn(impl),
  };
}

describe('postgres room store', () => {
  it('inserts a host lobby and returns the created room', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 1 }));
    const store = createPostgresRoomStore(db);

    const { room, player } = await store.create('  Ana  ');

    expect(player.seat).toBe(0);
    expect(player.nickname).toBe('Ana');
    expect(room.status).toBe('lobby');
    expect(db.query).toHaveBeenCalledTimes(1);
    const [sql, values] = vi.mocked(db.query).mock.calls[0] ?? [];
    expect(sql).toContain('INSERT INTO rooms');
    expect(values?.[0]).toBe(room.code);
    expect(values?.[1]).toBe('lobby');
  });

  it('retries insert when the invite code already exists', async (): Promise<void> => {
    let attempts = 0;
    const db = createClient(async () => {
      attempts += 1;
      return { rows: [], rowCount: attempts === 2 ? 1 : 0 };
    });
    const store = createPostgresRoomStore(db);

    const { room } = await store.create('Ana');

    expect(room.code).toHaveLength(6);
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('joins by loading and saving the lobby', async (): Promise<void> => {
    const row = lobbyRow();
    const db = createClient(async (text) => {
      if (text.includes('SELECT')) {
        return { rows: [row], rowCount: 1 };
      }
      return { rows: [], rowCount: 1 };
    });
    const store = createPostgresRoomStore(db);

    const { room, player } = await store.join('abc123', 'Bia');

    expect(player.seat).toBe(1);
    expect(player.nickname).toBe('Bia');
    expect(room.players).toHaveLength(2);
    expect(db.query).toHaveBeenCalledTimes(2);
    const update = vi.mocked(db.query).mock.calls[1];
    expect(update?.[0]).toContain('UPDATE rooms');
    expect(JSON.parse(String(update?.[1]?.[2]))).toHaveLength(2);
  });

  it('returns undefined when the room is missing', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 0 }));
    const store = createPostgresRoomStore(db);

    expect(await store.get('MISSING')).toBeUndefined();
  });

  it('rejects join when the room is not found', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 0 }));
    const store = createPostgresRoomStore(db);

    await expect(store.join('ZZZZZZ', 'Bia')).rejects.toBeInstanceOf(RoomError);
  });

  it('saves start mutations as JSON players and match id', async (): Promise<void> => {
    const room: Room = {
      code: 'ABC123',
      status: 'playing',
      players: [
        {
          seat: 0,
          nickname: 'Ana',
          token: 'host-token',
          credentials: 'cred-1',
        },
      ],
      matchID: 'ABC123',
      createdAt: 1_700_000_000_000,
    };
    const db = createClient(async () => ({ rows: [], rowCount: 1 }));
    const store = createPostgresRoomStore(db);

    await store.save(room);

    const [, values] = vi.mocked(db.query).mock.calls[0] ?? [];
    expect(values).toEqual([
      'ABC123',
      'playing',
      JSON.stringify(room.players),
      'ABC123',
      1_700_000_000_000,
    ]);
  });
});
