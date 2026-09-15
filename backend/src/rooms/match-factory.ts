import { GAME_NAME, type ImobiliarioSetupData } from '@imobiliario/shared';
import type { Game, StorageAPI } from 'boardgame.io';
import { createMatch } from 'boardgame.io/internal';
import { randomToken } from './codes.ts';
import type { Room } from './room-store.ts';
import { RoomError } from './room-store.ts';

export type MatchDatabase = StorageAPI.Async | StorageAPI.Sync;

export async function startRoomMatch(
  room: Room,
  game: Game,
  db: MatchDatabase,
): Promise<void> {
  if (room.status !== 'lobby') {
    throw new RoomError('Esta partida já começou.', 409);
  }

  const setupData: ImobiliarioSetupData = {
    nicknames: room.players.map((player) => player.nickname),
  };
  const match = createMatch({
    game,
    numPlayers: room.players.length,
    setupData,
    unlisted: true,
  });

  if ('setupDataError' in match) {
    throw new RoomError(match.setupDataError, 400);
  }

  const matchID = room.code;
  await db.createMatch(matchID, match);

  for (const player of room.players) {
    const credentials = randomToken();
    const slot = match.metadata.players[player.seat];
    if (!slot) {
      throw new RoomError('Assento inválido na partida.', 500);
    }
    slot.name = player.nickname;
    slot.credentials = credentials;
    player.credentials = credentials;
  }

  await db.setMetadata(matchID, match.metadata);
  room.matchID = matchID;
  room.status = 'playing';
}

export { GAME_NAME };
