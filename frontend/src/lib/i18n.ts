const messages = {
  appName: 'LotRace',
  tagline: 'Rola os dados. Compra a pista. Quebra a mesa.',
  nickname: 'Apelido',
  nicknamePlaceholder: 'Ex.: Tiago',
  createRoom: 'Criar mesa',
  joinRoom: 'Entrar com código',
  roomCode: 'Código',
  roomCodePlaceholder: '6 letras',
  waiting: 'Aguardando o anfitrião…',
  players: 'Jogadores',
  startGame: 'Começar partida',
  needMorePlayers: 'Falta mais {count} pra começar',
  inviteHint: 'Manda o código pro rolê. Precisa de pelo menos 2.',
  createNeedNickname: 'Coloca um apelido pra criar',
  joinNeedNicknameAndCode: 'Apelido + código de 6 pra entrar',
  homeMinPlayers: 'Começa com 2 pessoas. Até 6 na mesa.',
  you: 'você',
  host: 'anfitrião',
  roll: 'Lançar dados',
  rolling: 'Lançando…',
  dice: '2d6',
  diceAriaRolled: 'Dados {die1} e {die2}, total {total}',
  diceAriaEmpty: 'Dados ainda não lançados',
  buy: 'Comprar',
  skip: 'Passar',
  buyHouse: 'Construir casa',
  buyHouseOn: 'Construir em {name} · R${cost}',
  buyHotelOn: 'Erguer prédio em {name} · R${cost}',
  buyHousePick: 'Onde construir',
  endTurn: 'Encerrar turno',
  payJail: 'Pagar R$50 e sair',
  rollJail: 'Tentar nos dados',
  jailHint: 'Prisão: dados iguais saem. Sem sorte, {tries} tentativa(s). Na 3ª paga R$50 e anda.',
  yourTurn: 'Sua vez',
  waitTurn: 'Vez de {name}',
  cash: 'Caixa',
  owned: 'Dono',
  housesOnLot: '{count} casas',
  hotelOnLot: 'Prédio',
  free: 'Livre',
  winner: '{name} venceu!',
  bankrupt: 'Falido',
  connecting: 'Conectando à mesa…',
  errorGeneric: 'Algo deu errado. Tente de novo.',
  themeLight: 'Claro',
  themeDark: 'Escuro',
  copyCode: 'Copiar código',
  copied: 'Copiado',
  leave: 'Sair',
} as const;

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey, vars?: Record<string, string>): string {
  let value: string = messages[key];
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, replacement);
    }
  }
  return value;
}
