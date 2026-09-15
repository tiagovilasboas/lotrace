import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  type RoomView,
  type SessionPayload,
} from '@imobiliario/shared';
import type { Room, RoomPlayer } from './room-store.ts';

export function toRoomView(room: Room): RoomView {
  return {
    code: room.code,
    status: room.status,
    matchID: room.matchID,
    minPlayers: MIN_PLAYERS,
    maxPlayers: MAX_PLAYERS,
    players: room.players.map((player) => ({
      seat: player.seat,
      nickname: player.nickname,
      isHost: player.seat === 0,
    })),
  };
}

export function toSession(room: Room, player: RoomPlayer): SessionPayload {
  return {
    code: room.code,
    token: player.token,
    playerID: String(player.seat),
    nickname: player.nickname,
    isHost: player.seat === 0,
    credentials: player.credentials,
    matchID: room.matchID,
  };
}
