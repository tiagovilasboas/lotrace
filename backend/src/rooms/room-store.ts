import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  type RoomStatus,
} from '@lotrace/shared';
import { randomInviteCode, randomToken } from './codes.ts';

export type RoomPlayer = {
  seat: number;
  nickname: string;
  token: string;
  credentials: string | null;
};

export type Room = {
  code: string;
  status: RoomStatus;
  players: RoomPlayer[];
  matchID: string | null;
  createdAt: number;
};

export type RoomStore = {
  create: (nickname: string) => { room: Room; player: RoomPlayer };
  join: (code: string, nickname: string) => { room: Room; player: RoomPlayer };
  get: (code: string) => Room | undefined;
  getByToken: (code: string, token: string) => RoomPlayer | undefined;
};

const rooms = new Map<string, Room>();

function normalizeNickname(nickname: string): string {
  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 20) {
    throw new RoomError('Apelido deve ter entre 2 e 20 caracteres.', 400);
  }
  return trimmed;
}

export class RoomError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function createRoomStore(): RoomStore {
  return {
    create(nickname: string): { room: Room; player: RoomPlayer } {
      const name = normalizeNickname(nickname);
      let code = '';
      for (let attempt = 0; attempt < 8; attempt += 1) {
        code = randomInviteCode();
        if (!rooms.has(code)) {
          break;
        }
      }
      const player: RoomPlayer = {
        seat: 0,
        nickname: name,
        token: randomToken(),
        credentials: null,
      };
      const room: Room = {
        code,
        status: 'lobby',
        players: [player],
        matchID: null,
        createdAt: Date.now(),
      };
      rooms.set(code, room);
      return { room, player };
    },

    join(code: string, nickname: string): { room: Room; player: RoomPlayer } {
      const room = rooms.get(code.trim().toUpperCase());
      if (!room) {
        throw new RoomError('Sala não encontrada.', 404);
      }
      if (room.status !== 'lobby') {
        throw new RoomError('Esta partida já começou.', 409);
      }
      if (room.players.length >= MAX_PLAYERS) {
        throw new RoomError('Sala cheia (máximo 6).', 409);
      }
      const name = normalizeNickname(nickname);
      const player: RoomPlayer = {
        seat: room.players.length,
        nickname: name,
        token: randomToken(),
        credentials: null,
      };
      room.players.push(player);
      return { room, player };
    },

    get(code: string): Room | undefined {
      return rooms.get(code.trim().toUpperCase());
    },

    getByToken(code: string, token: string): RoomPlayer | undefined {
      const room = rooms.get(code.trim().toUpperCase());
      return room?.players.find((player) => player.token === token);
    },
  };
}

export function assertHost(room: Room, token: string): RoomPlayer {
  const player = room.players.find((item) => item.token === token);
  if (!player || player.seat !== 0) {
    throw new RoomError('Só o anfitrião pode começar a partida.', 403);
  }
  return player;
}

export function assertMinPlayers(room: Room): void {
  if (room.players.length < MIN_PLAYERS) {
    throw new RoomError('É preciso pelo menos 2 jogadores.', 400);
  }
}
