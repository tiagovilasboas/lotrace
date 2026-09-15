import type { BoardCell } from '@lotrace/shared';

const STATION_PREFIX = /^estação\s+/i;

export function tileCaption(cell: BoardCell): string {
  if (cell.kind === 'station') {
    return cell.name.replace(STATION_PREFIX, '');
  }
  if (cell.kind === 'goto-jail') {
    return 'Preso';
  }
  if (cell.name === 'Vila Madalena') {
    return 'Vila Mad.';
  }
  return cell.name;
}
