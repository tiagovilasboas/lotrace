import { getCell, type GameLogEvent, type PlayerState } from '@lotrace/shared';

export function playerName(
  players: Record<string, PlayerState>,
  id: string,
): string {
  return players[id]?.nickname ?? id;
}

export function formatEvent(
  event: GameLogEvent,
  players: Record<string, PlayerState>,
): string {
  const who = playerName(players, event.playerID);
  switch (event.type) {
    case 'roll':
      return `${who} tirou ${event.die1} e ${event.die2}`;
    case 'move':
      return event.passedGo
        ? `${who} passou na Partida (+R$200)`
        : `${who} parou em ${getCell(event.to).name}`;
    case 'buy':
      return `${who} comprou ${getCell(event.cell).name}`;
    case 'buy-house':
      return event.hotel
        ? `${who} ergueu um prédio em ${getCell(event.cell).name}`
        : `${who} construiu em ${getCell(event.cell).name}`;
    case 'skip-buy':
      return `${who} deixou ${getCell(event.cell).name} passar`;
    case 'rent':
      return `${who} pagou R$${event.amount} de aluguel para ${playerName(players, event.ownerID)}`;
    case 'tax':
      return `${who} pagou R$${event.amount} de taxa`;
    case 'salary':
      return `${who} recebeu R$${event.amount} na Partida`;
    case 'jail':
      if (event.reason === 'goto' || event.reason === 'doubles') {
        return `${who} foi preso`;
      }
      if (event.reason === 'pay') {
        return `${who} pagou a fiança e saiu`;
      }
      if (event.reason === 'free') {
        return `${who} saiu da prisão`;
      }
      return `${who} ficou na prisão`;
    case 'bankrupt':
      return `${who} faliu`;
  }
}

export function headlineEvent(
  events: GameLogEvent[],
): GameLogEvent | undefined {
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i];
    if (event && event.type !== 'roll') {
      return event;
    }
  }
  return events[events.length - 1];
}
