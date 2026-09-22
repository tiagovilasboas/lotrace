import type { ImobiliarioState } from '@lotrace/shared';
import { useEffect, useRef, type ReactElement } from 'react';
import { readBoardPalette } from '@/features/game/board/iso/board-palette.ts';
import { drawBoard, RING_SPAN } from '@/features/game/board/iso/draw-board.ts';
import { fitIso } from '@/features/game/board/iso/iso-projection.ts';

type BoardCanvasProps = {
  G: ImobiliarioState;
};

/**
 * BoardCanvas — isometric board (Phase 3.2/3.3).
 * Draws felt + ring tiles + colour accents + buildings + cars on a <canvas>,
 * sized to its box (ResizeObserver) and scaled for devicePixelRatio so it stays
 * crisp on mobile. Re-renders when the game state changes. Text overlay is 3.4.
 */
export function BoardCanvas({ G }: BoardCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (): void => {
      const rect = wrap.getBoundingClientRect();
      const boxW = Math.max(1, rect.width);
      const boxH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Backing store in device pixels; CSS box in logical pixels.
      canvas.width = Math.round(boxW * dpr);
      canvas.height = Math.round(boxH * dpr);
      canvas.style.width = `${boxW}px`;
      canvas.style.height = `${boxH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Taller ratio fills a portrait box better; a little headroom lets the
      // (now moderate-height) buildings rise without huge empty felt on top.
      const cfg = fitIso(RING_SPAN, RING_SPAN, boxW, boxH, {
        fill: 0.98,
        ratio: 0.66,
        headroom: 0.08,
      });
      const palette = readBoardPalette();
      drawBoard(ctx, cfg, palette, boxW, boxH, G);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [G]);

  return (
    <div ref={wrapRef} className="board-canvas-wrap" data-testid="board-canvas">
      <canvas ref={canvasRef} className="board-canvas" aria-hidden />
    </div>
  );
}
