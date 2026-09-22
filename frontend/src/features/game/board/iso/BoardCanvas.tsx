import type { ImobiliarioState } from '@lotrace/shared';
import { useEffect, useRef, type ReactElement } from 'react';
import { useBoardAssets } from '@/features/game/board/iso/asset-images.ts';
import { readBoardPalette } from '@/features/game/board/iso/board-palette.ts';
import { BoardCanvasCenter } from '@/features/game/board/iso/BoardCanvasCenter.tsx';
import { BoardTextOverlay } from '@/features/game/board/iso/BoardTextOverlay.tsx';
import { drawBoard } from '@/features/game/board/iso/draw-board.ts';
import { useIsoLayout } from '@/features/game/board/iso/use-iso-layout.ts';

type BoardCanvasProps = {
  G: ImobiliarioState;
};

/**
 * BoardCanvas — isometric board (Phase 3.2–3.4).
 * The <canvas> paints the felt + tiles + buildings + cars; a DOM overlay
 * (BoardTextOverlay) draws tile names/prices on top, anchored to the same iso
 * layout so text stays crisp and accessible while the city is pixels.
 */
export function BoardCanvas({ G }: BoardCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const layout = useIsoLayout(wrapRef);
  const assetsTick = useBoardAssets();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layout) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cfg, boxW, boxH } = layout;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(boxW * dpr);
    canvas.height = Math.round(boxH * dpr);
    canvas.style.width = `${boxW}px`;
    canvas.style.height = `${boxH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawBoard(ctx, cfg, readBoardPalette(), boxW, boxH, G);
  }, [layout, G, assetsTick]);

  return (
    <div ref={wrapRef} className="board-canvas-wrap" data-testid="board-canvas">
      <canvas ref={canvasRef} className="board-canvas" aria-hidden />
      {layout ? <BoardTextOverlay layout={layout} /> : null}
      <BoardCanvasCenter dice={G.lastDice} events={G.log} players={G.players} />
    </div>
  );
}
