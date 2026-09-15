import { describe, expect, it } from 'vitest';
import { parseOrigins } from './config.ts';

describe('parseOrigins', () => {
  it('keeps comma-separated exact origin strings', (): void => {
    expect(
      parseOrigins('https://lotrace.vercel.app, http://localhost:5173'),
    ).toEqual(['https://lotrace.vercel.app', 'http://localhost:5173']);
  });

  it('compiles JS regex literals and matches Vercel preview origins', (): void => {
    const origins = parseOrigins(
      'https://lotrace.vercel.app,/^https:\\/\\/lotrace(?:-[a-z0-9]+)*-tiagovilasboas-projects\\.vercel\\.app$/',
    );

    expect(origins).toHaveLength(2);
    expect(origins[0]).toBe('https://lotrace.vercel.app');
    expect(origins[1]).toBeInstanceOf(RegExp);

    const preview = origins[1] as RegExp;
    expect(preview.test('https://lotrace-xxxxx-tiagovilasboas-projects.vercel.app')).toBe(
      true,
    );
    expect(preview.test('https://evil.vercel.app')).toBe(false);
  });

  it('skips a lone * and never allows all origins', (): void => {
    expect(parseOrigins('*')).toEqual([]);
    expect(parseOrigins('https://lotrace.vercel.app, *')).toEqual([
      'https://lotrace.vercel.app',
    ]);
  });

  it('rejects an empty regex pattern', (): void => {
    expect(parseOrigins('//')).toEqual([]);
    expect(parseOrigins('https://lotrace.vercel.app,//i')).toEqual([
      'https://lotrace.vercel.app',
    ]);
  });
});
