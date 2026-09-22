import { BOARD, isHotel, MAX_HOUSES, type ImobiliarioState } from '@lotrace/shared';
import { type ReactElement } from 'react';
import { ringCellSide, type RingSide } from '@/features/game/board/ring-geometry.ts';
import { tileWorldPosition } from '@/features/game/pieces3d/lib/tile-positions.ts';
import { Car } from '@/features/game/pieces3d/pieces/Car.tsx';
import { GoArch } from '@/features/game/pieces3d/pieces/GoArch.tsx';
import { Hotel } from '@/features/game/pieces3d/pieces/Hotel.tsx';
import { House } from '@/features/game/pieces3d/pieces/House.tsx';
import { JailBlock } from '@/features/game/pieces3d/pieces/JailBlock.tsx';
import { Station } from '@/features/game/pieces3d/pieces/Station.tsx';
import { Tree } from '@/features/game/pieces3d/pieces/Tree.tsx';

type BoardPiecesProps = {
  G: ImobiliarioState;
};

/** Uniform up-scale of every 3D piece (+50% vs the base geometry). */
const PIECE_SCALE = 1.5;

/** Car Y rotation (radians) so it faces along its ring side,
 *  mirroring the 2D tokenRotateClass. */
function carRotationForSide(side: RingSide): number {
  switch (side) {
    case 'south':
      return 0;
    case 'west':
      return Math.PI / 2;
    case 'north':
      return Math.PI;
    case 'east':
      return -Math.PI / 2;
  }
}

/**
 * BoardPieces — positions all 3D pieces based on game state.
 * Piece geometries are in world units (1 unit ≈ 1 inner tile width).
 * Camera zoom (in PiecesCanvas) maps world units to screen pixels.
 * Everything is wrapped in a single scaled group so pieces grow together.
 */
export function BoardPieces({ G }: BoardPiecesProps): ReactElement {
  return (
    <group scale={PIECE_SCALE}>
      {/* ── Corner static pieces ──────────────────────────────── */}
      <GoArch   position={tileWorldPosition(0)} />
      <JailBlock position={tileWorldPosition(6)} />
      <Tree     position={tileWorldPosition(12)} />

      {/* ── Stations ──────────────────────────────────────────── */}
      {[4, 9, 15, 20].map((idx) => (
        <Station key={idx} position={tileWorldPosition(idx)} />
      ))}

      {/* ── Houses / hotels on owned properties ──────────────── */}
      {BOARD.map((cell) => {
        if (cell.kind !== 'property') return null;
        const count = G.houses[cell.index] ?? 0;
        if (count === 0) return null;
        const base = tileWorldPosition(cell.index);

        if (isHotel(count)) {
          return <Hotel key={cell.index} position={base} />;
        }

        const houses = Math.min(MAX_HOUSES, count);
        return Array.from({ length: houses }, (_, i) => {
          const offset = (i - (houses - 1) / 2) * 0.12;
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
          const base = tileWorldPosition(player.position);
          /* Spread up to 4 cars on the same tile */
          const ox = (i % 2 === 0 ? -1 : 1) * 0.12;
          const oz = (i < 2 ? -1 : 1) * 0.12;
          return (
            <Car
              key={player.id}
              playerID={player.id}
              position={[base[0] + ox, base[1], base[2] + oz]}
              rotation={carRotationForSide(ringCellSide(player.position))}
            />
          );
        })}
    </group>
  );
}
