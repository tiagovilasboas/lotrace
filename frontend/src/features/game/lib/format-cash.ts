export function formatCash(amount: number): string {
  return `R$ ${amount.toLocaleString('pt-BR')}`;
}
