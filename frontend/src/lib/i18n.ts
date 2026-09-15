const messages = {
  appName: 'LotRace',
  tagline: 'Tabuleiro clássico para 2 a 6 jogadores.',
  nickname: 'Seu apelido',
  nicknamePlaceholder: 'Como te chamam na mesa',
  createRoom: 'Criar sala',
  joinRoom: 'Entrar na sala',
  roomCode: 'Código da sala',
  roomCodePlaceholder: 'ABC123',
  waiting: 'Aguardando o anfitrião…',
  players: 'Jogadores',
  startGame: 'Começar partida',
  inviteHint: 'Compartilhe o código. Mínimo 2 jogadores.',
  you: 'você',
  host: 'anfitrião',
  roll: 'Lançar dados',
  buy: 'Comprar',
  skip: 'Passar',
  endTurn: 'Encerrar turno',
  payJail: 'Pagar R$50 e sair',
  waitJail: 'Esperar (pula o movimento)',
  yourTurn: 'Sua vez',
  waitTurn: 'Vez de {name}',
  cash: 'Caixa',
  owned: 'Dono',
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
