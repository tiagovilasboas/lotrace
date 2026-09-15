import { afterEach, describe, expect, it } from 'vitest';
import { loadConfig, parseOrigins } from './config.ts';

const original = {
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
};

function restoreEnv(name: 'PORT' | 'CORS_ORIGIN' | 'DATABASE_URL'): void {
  const value = original[name];
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

afterEach(() => {
  restoreEnv('PORT');
  restoreEnv('CORS_ORIGIN');
  restoreEnv('DATABASE_URL');
});

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

describe('loadConfig', () => {
  it('treats blank DATABASE_URL as unset', (): void => {
    process.env.DATABASE_URL = '   ';
    expect(loadConfig().databaseUrl).toBeUndefined();
  });

  it('reads DATABASE_URL when set', (): void => {
    process.env.DATABASE_URL = 'postgresql://lotrace@localhost:5432/lotrace';
    expect(loadConfig().databaseUrl).toBe(
      'postgresql://lotrace@localhost:5432/lotrace',
    );
  });
});
