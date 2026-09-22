import { isHotel, MAX_HOUSES, type ImobiliarioState } from '@lotrace/shared';
import { type ReactElement } from 'react';
import { tileWorldPosition } from '@/features/game/pieces3d/lib/tile-positions.ts';
import { Car } from '@/features/game/pieces3d/pieces/Car.tsx';
import { GoArch } from '@/features/game/pieces3d/pieces/GoArch.tsx';
import { Hotel } from '@/features/game/pieces3d/pieces/Hotel.tsx';
import { House } from '@/features/game/pieces3d/pieces/House.tsx';
import { JailBlock } from '@/features/game/pieces3d/pieces/JailBlock.tsx';
import { Station } from '@/features/game/pieces3d/pieces/Station.tsx';
import { Tree } from '@/features/game/pieces3d/pieces/Tree.tsx';
import { BOARD } from '@lotrace/shared';

type BoardPiecesProps = {
  G: ImobiliarioState;
  scale: number; // world units per px (from PiecesCanvas)
};

/**
 * BoardPieces — positions all 3D pieces on the board.
 * Reads game state (players, houses) and maps to world positions.
 * No logic, just rendering delegation.
 */
export function BoardPieces({ G, scale }: BoardPiecesProps): ReactElement {
  const s = scale; // shorthand

  return (
    <>
      {/* ── Corner markers ────────────────────────────────────── */}
      <GoArch position={tileWorldPosition(0).map(v => v * s) as [number,number,number]} />
      <JailBlock position={tileWorldPosition(6).map(v => v * s) as [number,number,number]} />
      <Tree position={tileWorldPosition(12).map(v => v * s) as [number,number,number]} />

      {/* ── Station markers ───────────────────────────────────── */}
      {[4, 9, 15, 20].map((idx) => (
        <Station key={idx} position={tileWorldPosition(idx).map(v => v * s) as [number,number,number]} />
      ))}

      {/* ── Houses / hotels on owned properties ──────────────── */}
      {BOARD.map((cell) => {
        if (cell.kind !== 'property') return null;
        const count = G.houses[cell.index] ?? 0;
        if (count === 0) return null;
        const base = tileWorldPosition(cell.index).map(v => v * s) as [number,number,number];

        if (isHotel(count)) {
          return <Hotel key={cell.index} position={base} />;
        }

        const houses = Math.min(MAX_HOUSES, count);
        return Array.from({ length: houses }, (_, i) => {
          // Spread houses slightly along Z so they don't overlap
          const offset = (i - (houses - 1) / 2) * 0.1 * s;
          return (
            <House
              key={`${cell.index}-${i}`}
              position={[base[0], base[1], base[2] + offset]}
            />
          );
        });
      })}

      {/* ── Player cars ───────────────────────────────────────── */}
      {Object.values(G.players)
        .filter((p) => !p.bankrupt)
        .map((player, i) => {
          const base = tileWorldPosition(player.position).map(v => v * s) as [number,number,number];
          // Offset multiple cars on same tile
          const offsetX = (i % 2 === 0 ? -1 : 1) * 0.08 * s;
          const offsetZ = (i < 2 ? -1 : 1) * 0.08 * s;
          return (
            <Car
              key={player.id}
              playerID={player.id}
              position={[base[0] + offsetX, base[1], base[2] + offsetZ]}
            />
          );
        })}
    </>
  );
}
