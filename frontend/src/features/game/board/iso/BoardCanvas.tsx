import { useEffect, useRef, type ReactElement } from 'react';
import { readBoardPalette } from '@/features/game/board/iso/board-palette.ts';
import { drawBoard, RING_SPAN } from '@/features/game/board/iso/draw-board.ts';
import { fitIso } from '@/features/game/board/iso/iso-projection.ts';

/**
 * BoardCanvas — isometric board ground (Phase 3.2).
 * Draws felt + ring tiles + colour accents on a <canvas>, sized to its box
 * (ResizeObserver) and scaled for devicePixelRatio so it stays crisp on mobile.
 * Pieces (3.3) and the text overlay (3.4) come next.
 */
export function BoardCanvas(): ReactElement {
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

      // Taller ratio fills a portrait box better; headroom leaves the top
      // for buildings to rise into (SimCity BuildIt city feel, Phase 3.3).
      const cfg = fitIso(RING_SPAN, RING_SPAN, boxW, boxH, {
        fill: 0.98,
        ratio: 0.62,
        headroom: 0.14,
      });
      const palette = readBoardPalette();
      drawBoard(ctx, cfg, palette, boxW, boxH);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="board-canvas-wrap" data-testid="board-canvas">
      <canvas ref={canvasRef} className="board-canvas" aria-hidden />
    </div>
  );
}
