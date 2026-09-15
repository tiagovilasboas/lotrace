import { describe, expect, it } from 'vitest';
import { randomInviteCode } from './codes.ts';

const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

describe('invite codes', () => {
  it('uses length 6 by default', (): void => {
    expect(randomInviteCode()).toHaveLength(6);
  });

  it('honors an explicit length', (): void => {
    expect(randomInviteCode(8)).toHaveLength(8);
    expect(randomInviteCode(4)).toHaveLength(4);
  });

  it('draws only from the unambiguous alphabet', (): void => {
    expect(INVITE_ALPHABET).not.toMatch(/[01IO]/);
    expect(INVITE_ALPHABET).toHaveLength(32);

    const samples = Array.from({ length: 80 }, () => randomInviteCode(12)).join(
      '',
    );
    expect(samples.length).toBeGreaterThan(0);
    for (const char of samples) {
      expect(INVITE_ALPHABET).toContain(char);
    }
  });
});
