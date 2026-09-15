import { getCell, type GameLogEvent, type PlayerState } from '@lotrace/shared';

function nameOf(players: Record<string, PlayerState>, id: string): string {
  return players[id]?.nickname ?? id;
}

export function formatEvent(
  event: GameLogEvent,
  players: Record<string, PlayerState>,
): string {
  switch (event.type) {
    case 'roll':
      return `${nameOf(players, event.playerID)} tirou ${event.die1}+${event.die2}`;
    case 'move':
      return event.passedGo
        ? `${nameOf(players, event.playerID)} passou na Partida`
        : `${nameOf(players, event.playerID)} parou em ${getCell(event.to).name}`;
    case 'buy':
      return `${nameOf(players, event.playerID)} comprou ${getCell(event.cell).name}`;
    case 'buy-house':
      return `${nameOf(players, event.playerID)} construiu em ${getCell(event.cell).name}`;
    case 'skip-buy':
      return `${nameOf(players, event.playerID)} passou de ${getCell(event.cell).name}`;
    case 'rent':
      return `${nameOf(players, event.playerID)} pagou R$${event.amount} para ${nameOf(players, event.ownerID)}`;
    case 'tax':
      return `${nameOf(players, event.playerID)} pagou R$${event.amount} de taxa`;
    case 'salary':
      return `${nameOf(players, event.playerID)} recebeu R$${event.amount}`;
    case 'jail':
      if (event.reason === 'goto' || event.reason === 'doubles') {
        return `${nameOf(players, event.playerID)} foi preso`;
      }
      if (event.reason === 'pay') {
        return `${nameOf(players, event.playerID)} pagou a fiança`;
      }
      if (event.reason === 'free') {
        return `${nameOf(players, event.playerID)} saiu da prisão`;
      }
      return `${nameOf(players, event.playerID)} espera na prisão`;
    case 'bankrupt':
      return `${nameOf(players, event.playerID)} faliu`;
  }
}

export function latestEventText(
  events: GameLogEvent[],
  players: Record<string, PlayerState>,
): string | null {
  const event = events[events.length - 1];
  if (!event) {
    return null;
  }
  return formatEvent(event, players);
}
