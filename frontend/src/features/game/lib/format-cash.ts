export function formatCash(amount: number): string {
  return `R$ ${amount.toLocaleString('pt-BR')}`;
}

/**
 * Compact currency for tight spots (board tiles, header chips) where the
 * full value would overflow. Keeps one decimal for millions.
 *   1_760_000 -> "R$ 1,76M"   340_000 -> "R$ 340k"   80_000 -> "R$ 80k"
 *   950       -> "R$ 950"
 */
export function formatCashCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    // 1 decimal, but drop a trailing ",0" (3,0M -> 3M)
    const text = millions.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: millions >= 10 ? 0 : 2,
    });
    return `${sign}R$ ${text}M`;
  }

  if (abs >= 1_000) {
    const thousands = Math.round(abs / 1_000);
    return `${sign}R$ ${thousands}k`;
  }

  return `${sign}R$ ${abs.toLocaleString('pt-BR')}`;
}
