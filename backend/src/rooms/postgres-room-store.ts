import type { RoomStatus } from '@lotrace/shared';
import type { SqlClient } from '../db/sql.ts';
import {
  addGuest,
  createHostRoom,
  normalizeRoomCode,
  RoomError,
  type Room,
  type RoomPlayer,
  type RoomStore,
} from './room-store.ts';

type RoomRow = {
  code: string;
  status: string;
  players: unknown;
  match_id: string | null;
  created_at: string | number;
};

function isRoomPlayer(value: unknown): value is RoomPlayer {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const player = value as Record<string, unknown>;
  return (
    typeof player.seat === 'number' &&
    typeof player.nickname === 'string' &&
    typeof player.token === 'string' &&
    (player.credentials === null || typeof player.credentials === 'string')
  );
}

function isRoomStatus(value: unknown): value is RoomStatus {
  return value === 'lobby' || value === 'playing';
}

function rowToRoom(row: RoomRow): Room {
  if (!isRoomStatus(row.status)) {
    throw new RoomError('Sala com status inválido.', 500);
  }
  if (!Array.isArray(row.players) || !row.players.every(isRoomPlayer)) {
    throw new RoomError('Sala com jogadores inválidos.', 500);
  }
  return {
    code: row.code,
    status: row.status,
    players: row.players,
    matchID: row.match_id,
    createdAt: Number(row.created_at),
  };
}

export function createPostgresRoomStore(db: SqlClient): RoomStore {
  async function load(code: string): Promise<Room | undefined> {
    const { rows } = await db.query(
      `SELECT code, status, players, match_id, created_at FROM rooms WHERE code = $1`,
      [normalizeRoomCode(code)],
    );
    const row = rows[0] as RoomRow | undefined;
    return row ? rowToRoom(row) : undefined;
  }

  async function save(room: Room): Promise<void> {
    await db.query(
      `
      UPDATE rooms
      SET status = $2, players = $3::jsonb, match_id = $4, created_at = $5
      WHERE code = $1
      `,
      [
        room.code,
        room.status,
        JSON.stringify(room.players),
        room.matchID,
        room.createdAt,
      ],
    );
  }

  return {
    async create(nickname: string): Promise<{ room: Room; player: RoomPlayer }> {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const created = createHostRoom(nickname);
        const inserted = await db.query(
          `
          INSERT INTO rooms (code, status, players, match_id, created_at)
          VALUES ($1, $2, $3::jsonb, $4, $5)
          ON CONFLICT (code) DO NOTHING
          `,
          [
            created.room.code,
            created.room.status,
            JSON.stringify(created.room.players),
            created.room.matchID,
            created.room.createdAt,
          ],
        );
        if (inserted.rowCount > 0) {
          return created;
        }
      }
      throw new RoomError('Não foi possível criar a sala.', 500);
    },

    async join(
      code: string,
      nickname: string,
    ): Promise<{ room: Room; player: RoomPlayer }> {
      const room = await load(code);
      if (!room) {
        throw new RoomError('Sala não encontrada.', 404);
      }
      const player = addGuest(room, nickname);
      await save(room);
      return { room, player };
    },

    async get(code: string): Promise<Room | undefined> {
      return load(code);
    },

    async getByToken(code: string, token: string): Promise<RoomPlayer | undefined> {
      const room = await load(code);
      return room?.players.find((player) => player.token === token);
    },

    save,
  };
}
