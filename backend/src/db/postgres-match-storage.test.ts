import type { LogEntry, Server, State } from 'boardgame.io';
import { describe, expect, it, vi } from 'vitest';
import { PostgresMatchStorage } from './postgres-match-storage.ts';
import type { SqlClient } from './sql.ts';

const initialState = { G: { n: 0 }, ctx: {}, plugins: {}, _undo: [], _redo: [], _stateID: 0 } as unknown as State;
const nextState = { ...initialState, _stateID: 1 } as unknown as State;

const metadata: Server.MatchData = {
  gameName: 'lotrace',
  players: { 0: { id: 0, name: 'Ana' } },
  createdAt: 10,
  updatedAt: 20,
};

function createClient(
  impl: (text: string, values?: unknown[]) => Promise<{ rows: unknown[]; rowCount: number }>,
): SqlClient {
  return {
    query: vi.fn(impl),
  };
}

describe('PostgresMatchStorage', () => {
  it('bootstraps schema on connect', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 0 }));
    const storage = new PostgresMatchStorage(db);

    await storage.connect();

    const sql = vi.mocked(db.query).mock.calls.map(([text]) => String(text));
    expect(sql.some((text) => text.includes('CREATE TABLE IF NOT EXISTS rooms'))).toBe(
      true,
    );
    expect(sql.some((text) => text.includes('CREATE TABLE IF NOT EXISTS matches'))).toBe(
      true,
    );
  });

  it('stores initial state, current state, and metadata on createMatch', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 1 }));
    const storage = new PostgresMatchStorage(db);

    await storage.createMatch('ABC123', { initialState, metadata });

    const [sql, values] = vi.mocked(db.query).mock.calls[0] ?? [];
    expect(sql).toContain('INSERT INTO matches');
    expect(values?.[0]).toBe('ABC123');
    expect(values?.[1]).toBe('lotrace');
    expect(values?.[2]).toBe(JSON.stringify(initialState));
    expect(values?.[3]).toBe(JSON.stringify(metadata));
  });

  it('appends deltalog when setState receives entries', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 1 }));
    const storage = new PostgresMatchStorage(db);
    const deltalog = [{ _stateID: 1, turn: 1, phase: 'play' }] as unknown as LogEntry[];

    await storage.setState('ABC123', nextState, deltalog);

    const [sql, values] = vi.mocked(db.query).mock.calls[0] ?? [];
    expect(sql).toContain('|| $3::jsonb');
    expect(values?.[2]).toBe(JSON.stringify(deltalog));
  });

  it('fetches requested fields and returns empty result when missing', async (): Promise<void> => {
    const db = createClient(async () => ({
      rows: [
        {
          initial_state: initialState,
          state: nextState,
          metadata,
          log: [{ turn: 1 }],
        },
      ],
      rowCount: 1,
    }));
    const storage = new PostgresMatchStorage(db);

    const found = await storage.fetch('ABC123', {
      state: true,
      metadata: true,
      log: true,
      initialState: true,
    });

    expect(found.state).toEqual(nextState);
    expect(found.metadata).toEqual(metadata);
    expect(found.log).toEqual([{ turn: 1 }]);
    expect(found.initialState).toEqual(initialState);

    const emptyDb = createClient(async () => ({ rows: [], rowCount: 0 }));
    const empty = await new PostgresMatchStorage(emptyDb).fetch('NOPE', {
      state: true,
    });
    expect(empty).toEqual({});
  });

  it('lists match ids using metadata filters', async (): Promise<void> => {
    const db = createClient(async () => ({
      rows: [
        { id: 'keep', metadata },
        { id: 'other-game', metadata: { ...metadata, gameName: 'other' } },
        {
          id: 'over',
          metadata: { ...metadata, gameover: { winner: '0' }, updatedAt: 50 },
        },
        { id: 'stale', metadata: null },
      ],
      rowCount: 4,
    }));
    const storage = new PostgresMatchStorage(db);

    await expect(
      storage.listMatches({ gameName: 'lotrace', where: { isGameover: false } }),
    ).resolves.toEqual(['keep']);
  });

  it('wipes a match row', async (): Promise<void> => {
    const db = createClient(async () => ({ rows: [], rowCount: 1 }));
    const storage = new PostgresMatchStorage(db);

    await storage.wipe('ABC123');

    const [sql, values] = vi.mocked(db.query).mock.calls[0] ?? [];
    expect(sql).toContain('DELETE FROM matches');
    expect(values).toEqual(['ABC123']);
  });
});
