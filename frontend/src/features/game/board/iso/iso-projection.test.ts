import { describe, it, expect } from 'vitest';
import {
  tileToScreen,
  withHeight,
  tileDiamond,
  depthKey,
  fitIso,
  type IsoConfig,
} from './iso-projection.ts';

const CFG: IsoConfig = { tileW: 100, tileH: 50, originX: 0, originY: 0 };

describe('tileToScreen', () => {
  it('maps the origin cell to the origin point', () => {
    expect(tileToScreen(0, 0, CFG)).toEqual({ x: 0, y: 0 });
  });

  it('moves right+down along +col', () => {
    expect(tileToScreen(1, 0, CFG)).toEqual({ x: 50, y: 25 });
  });

  it('moves left+down along +row', () => {
    expect(tileToScreen(0, 1, CFG)).toEqual({ x: -50, y: 25 });
  });

  it('col and row on the diagonal cancel on X and add on Y', () => {
    expect(tileToScreen(2, 2, CFG)).toEqual({ x: 0, y: 100 });
  });

  it('respects the origin offset', () => {
    const cfg = { ...CFG, originX: 10, originY: 20 };
    expect(tileToScreen(0, 0, cfg)).toEqual({ x: 10, y: 20 });
  });
});

describe('withHeight', () => {
  it('raises a point up the screen (subtracts Y)', () => {
    expect(withHeight({ x: 5, y: 100 }, 30)).toEqual({ x: 5, y: 70 });
  });

  it('height 0 is a no-op', () => {
    expect(withHeight({ x: 5, y: 100 }, 0)).toEqual({ x: 5, y: 100 });
  });
});

describe('tileDiamond', () => {
  it('returns four corners around the cell centre', () => {
    const [top, right, bottom, left] = tileDiamond(0, 0, CFG);
    expect(top).toEqual({ x: 0, y: -25 });
    expect(right).toEqual({ x: 50, y: 0 });
    expect(bottom).toEqual({ x: 0, y: 25 });
    expect(left).toEqual({ x: -50, y: 0 });
  });
});

describe('depthKey', () => {
  it('orders back-to-front by col+row', () => {
    expect(depthKey(0, 0)).toBeLessThan(depthKey(1, 0));
    expect(depthKey(1, 2)).toBe(depthKey(2, 1));
    expect(depthKey(3, 3)).toBeGreaterThan(depthKey(1, 1));
  });
});

describe('fitIso', () => {
  it('keeps the 2:1 iso ratio', () => {
    const cfg = fitIso(7, 7, 700, 700);
    expect(cfg.tileH).toBeCloseTo(cfg.tileW / 2);
  });

  it('produces a tile size that fits the box width', () => {
    const cfg = fitIso(7, 7, 700, 700);
    const span = 7 + 7;
    // Diamond width = span * tileW/2 must not exceed the box.
    expect((span * cfg.tileW) / 2).toBeLessThanOrEqual(700 + 0.001);
  });

  it('centres horizontally at half the box width', () => {
    const cfg = fitIso(7, 7, 700, 500);
    expect(cfg.originX).toBe(350);
  });
});
