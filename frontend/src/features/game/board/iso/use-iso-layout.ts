import { useEffect, useRef, useState, type RefObject } from 'react';
import { placedCells } from '@/features/game/board/iso/draw-board.ts';
import {
  fitIso,
  tileToScreen,
  type IsoConfig,
  type ScreenPoint,
} from '@/features/game/board/iso/iso-projection.ts';

const RING_SPAN = 7;

export type IsoLayout = {
  cfg: IsoConfig;
  boxW: number;
  boxH: number;
  /** Screen centre (logical px) of each cell by board index. */
  tileCentres: Record<number, ScreenPoint>;
};

/**
 * Measures a wrapper element and computes the shared isometric layout: the
 * IsoConfig plus the on-screen centre of every tile. The canvas and the DOM
 * text overlay both consume this so they stay perfectly aligned without
 * duplicating the fit maths.
 */
export function useIsoLayout(wrapRef: RefObject<HTMLElement | null>): IsoLayout | null {
  const [layout, setLayout] = useState<IsoLayout | null>(null);
  const cells = useRef(placedCells());

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = (): void => {
      const rect = wrap.getBoundingClientRect();
      const boxW = Math.max(1, rect.width);
      const boxH = Math.max(1, rect.height);
      const cfg = fitIso(RING_SPAN, RING_SPAN, boxW, boxH, {
        fill: 1.06,
        ratio: 0.72,
        headroom: 0.04,
      });
      const tileCentres: Record<number, ScreenPoint> = {};
      for (const { cell, col, row } of cells.current) {
        const c = tileToScreen(col, row, cfg);
        // Anchor the label on the tile's front edge (toward the camera), not
        // its centre, so tall buildings rising from the centre don't cover it.
        tileCentres[cell.index] = { x: c.x, y: c.y + cfg.tileH * 0.32 };
      }
      setLayout({ cfg, boxW, boxH, tileCentres });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [wrapRef]);

  return layout;
}

export { RING_SPAN };
