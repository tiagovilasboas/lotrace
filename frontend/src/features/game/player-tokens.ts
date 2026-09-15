const TOKEN_COLORS = [
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
];

export function tokenClass(playerID: string): string {
  return TOKEN_COLORS[Number(playerID) % TOKEN_COLORS.length] ?? TOKEN_COLORS[0];
}
