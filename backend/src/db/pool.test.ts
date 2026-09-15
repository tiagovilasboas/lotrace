import { describe, expect, it } from 'vitest';
import { shouldUseSsl } from './pool.ts';

describe('shouldUseSsl', () => {
  it('skips SSL for localhost and Railway private hosts', (): void => {
    expect(shouldUseSsl('postgresql://u:p@localhost:5432/lotrace')).toBe(false);
    expect(
      shouldUseSsl('postgresql://u:p@postgres.railway.internal:5432/railway'),
    ).toBe(false);
  });

  it('honors sslmode in the connection string', (): void => {
    expect(
      shouldUseSsl('postgresql://u:p@db.example:5432/lotrace?sslmode=disable'),
    ).toBe(false);
    expect(
      shouldUseSsl(
        'postgresql://u:p@postgres.railway.internal:5432/railway?sslmode=require',
      ),
    ).toBe(true);
  });

  it('enables SSL for public hosts', (): void => {
    expect(
      shouldUseSsl('postgresql://u:p@hopper.proxy.rlwy.net:1234/railway'),
    ).toBe(true);
  });
});
