import { createContext, useContext } from 'react';

/**
 * Seat-follow context — hotseat only.
 *
 * In the local hotseat (LayoutMatchScreen) two clients render side by side and
 * the visible seat is switched manually. When this context provides a handler,
 * GameBoard reports the active player on every turn change so the hotseat can
 * follow the current player automatically.
 *
 * Online matches (SocketIO) never provide this handler: each device is a fixed
 * player, so there is nothing to follow.
 */
export type SeatFollow = {
  /** Called when the active player changes, with the new current player id. */
  onActivePlayerChange: (currentPlayer: string) => void;
};

export const SeatFollowContext = createContext<SeatFollow | null>(null);

export function useSeatFollow(): SeatFollow | null {
  return useContext(SeatFollowContext);
}
