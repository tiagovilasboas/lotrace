import { describe, expect, it } from 'vitest';
import { parseHex, shade, shadeRgba, toRgba } from './color-shade.ts';

describe('parseHex', () => {
  it('parses a full #rrggbb', () => {
    expect(parseHex('#46CF91')).toEqual({ r: 0x46, g: 0xcf, b: 0x91 });
  });

  it('parses a short #rgb', () => {
    expect(parseHex('#f0a')).toEqual({ r: 0xff, g: 0x00, b: 0xaa });
  });

  it('tolerates a missing hash', () => {
    expect(parseHex('46CF91')).toEqual({ r: 0x46, g: 0xcf, b: 0x91 });
  });

  it('falls back to grey on garbage', () => {
    expect(parseHex('nope')).toEqual({ r: 136, g: 136, b: 136 });
  });
});

describe('shade', () => {
  it('amount 0 is a no-op', () => {
    expect(shade('#402010', 0)).toEqual({ r: 0x40, g: 0x20, b: 0x10 });
  });

  it('positive amount lightens toward white', () => {
    const lit = shade('#000000', 0.5);
    expect(lit).toEqual({ r: 127.5, g: 127.5, b: 127.5 });
  });

  it('amount 1 reaches white', () => {
    expect(shade('#123456', 1)).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('negative amount darkens toward black', () => {
    expect(shade('#808080', -0.5)).toEqual({ r: 64, g: 64, b: 64 });
  });

  it('amount -1 reaches black', () => {
    expect(shade('#ffffff', -1)).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('toRgba', () => {
  it('rounds and clamps channels', () => {
    expect(toRgba({ r: 127.5, g: 300, b: -5 }, 0.8)).toBe('rgba(128, 255, 0, 0.8)');
  });

  it('defaults alpha to 1', () => {
    expect(toRgba({ r: 10, g: 20, b: 30 })).toBe('rgba(10, 20, 30, 1)');
  });
});

describe('shadeRgba', () => {
  it('shades and formats in one call', () => {
    expect(shadeRgba('#000000', 0.5, 0.5)).toBe('rgba(128, 128, 128, 0.5)');
  });
});
