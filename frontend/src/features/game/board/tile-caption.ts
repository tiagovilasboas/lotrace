import type { BoardCell } from '@lotrace/shared';

const CAPTION_LINES: Record<string, readonly string[]> = {
  Partida: ['PARTIDA'],
  Leblon: ['Leblon'],
  IPTU: ['IPTU'],
  Ipanema: ['Ipanema'],
  'Estação Rio': ['Estação', 'Rio'],
  Copacabana: ['Copacabana'],
  Visita: ['VISITA'],
  Jardins: ['Jardins'],
  'Vila Madalena': ['Vila', 'Madalena'],
  'Estação SP': ['Estação', 'SP'],
  Paulista: ['Paulista'],
  Pinheiros: ['Pinheiros'],
  Parque: ['Estacion.', 'Livre'],
  Recife: ['Recife'],
  Salvador: ['Salvador'],
  'Estação NE': ['Estação', 'NE'],
  Brasília: ['Brasília'],
  Savassi: ['Savassi'],
  'Vá preso': ['Vá', 'preso'],
  Batel: ['Batel'],
  'Estação Sul': ['Estação', 'Sul'],
  Floripa: ['Floripa'],
  IR: ['IR'],
  Moinhos: ['Moinhos'],
};

export function tileCaptionLines(cell: BoardCell): readonly string[] {
  return CAPTION_LINES[cell.name] ?? [cell.name];
}

export function tileCaption(cell: BoardCell): string {
  return tileCaptionLines(cell).join(' ');
}
