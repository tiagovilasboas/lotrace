import type { LogEntry, Server, State, StorageAPI } from 'boardgame.io';
import { Async } from 'boardgame.io/internal';
import { ensureSchema } from './schema.ts';
import type { SqlClient } from './sql.ts';

type MatchRow = {
  initial_state: unknown;
  state: unknown;
  metadata: unknown;
  log: unknown;
};

type MatchListRow = {
  id: string;
  metadata: unknown;
};

function jsonParam(value: unknown): string {
  return JSON.stringify(value);
}

function deltaLogParam(deltalog: LogEntry[] | undefined): string | null {
  if (!deltalog || deltalog.length === 0) {
    return null;
  }
  return jsonParam(deltalog);
}

function isMatchData(value: unknown): value is Server.MatchData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const data = value as Record<string, unknown>;
  return typeof data.gameName === 'string' && typeof data.updatedAt === 'number';
}

function matchesListFilter(
  metadata: Server.MatchData,
  opts: StorageAPI.ListMatchesOpts | undefined,
): boolean {
  if (!opts) {
    return true;
  }
  if (opts.gameName !== undefined && metadata.gameName !== opts.gameName) {
    return false;
  }
  if (opts.where === undefined) {
    return true;
  }
  if (opts.where.isGameover !== undefined) {
    const isGameover = metadata.gameover !== undefined;
    if (isGameover !== opts.where.isGameover) {
      return false;
    }
  }
  if (
    opts.where.updatedBefore !== undefined &&
    metadata.updatedAt >= opts.where.updatedBefore
  ) {
    return false;
  }
  if (
    opts.where.updatedAfter !== undefined &&
    metadata.updatedAt <= opts.where.updatedAfter
  ) {
    return false;
  }
  return true;
}

export class PostgresMatchStorage extends Async {
  public constructor(private readonly db: SqlClient) {
    super();
  }

  public async connect(): Promise<void> {
    await ensureSchema(this.db);
  }

  public override async createMatch(
    matchID: string,
    opts: StorageAPI.CreateMatchOpts,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO matches (id, game_name, initial_state, state, metadata, log, updated_at)
      VALUES ($1, $2, $3::jsonb, $3::jsonb, $4::jsonb, '[]'::jsonb, $5)
      ON CONFLICT (id) DO UPDATE SET
        game_name = EXCLUDED.game_name,
        initial_state = EXCLUDED.initial_state,
        state = EXCLUDED.state,
        metadata = EXCLUDED.metadata,
        log = '[]'::jsonb,
        updated_at = EXCLUDED.updated_at
      `,
      [
        matchID,
        opts.metadata.gameName,
        jsonParam(opts.initialState),
        jsonParam(opts.metadata),
        Date.now(),
      ],
    );
  }

  public async setState(
    matchID: string,
    state: State,
    deltalog?: LogEntry[],
  ): Promise<void> {
    const delta = deltaLogParam(deltalog);
    await this.db.query(
      `
      INSERT INTO matches (id, game_name, state, log, updated_at)
      VALUES ($1, '', $2::jsonb, COALESCE($3::jsonb, '[]'::jsonb), $4)
      ON CONFLICT (id) DO UPDATE SET
        state = EXCLUDED.state,
        log = CASE
          WHEN $3::jsonb IS NULL THEN matches.log
          ELSE COALESCE(matches.log, '[]'::jsonb) || $3::jsonb
        END,
        updated_at = EXCLUDED.updated_at
      `,
      [matchID, jsonParam(state), delta, Date.now()],
    );
  }

  public async setMetadata(
    matchID: string,
    metadata: Server.MatchData,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO matches (id, game_name, metadata, log, updated_at)
      VALUES ($1, $2, $3::jsonb, '[]'::jsonb, $4)
      ON CONFLICT (id) DO UPDATE SET
        game_name = EXCLUDED.game_name,
        metadata = EXCLUDED.metadata,
        updated_at = EXCLUDED.updated_at
      `,
      [matchID, metadata.gameName, jsonParam(metadata), Date.now()],
    );
  }

  public async fetch<O extends StorageAPI.FetchOpts>(
    matchID: string,
    opts: O,
  ): Promise<StorageAPI.FetchResult<O>> {
    const result = {} as StorageAPI.FetchFields;
    const { rows } = await this.db.query(
      `SELECT initial_state, state, metadata, log FROM matches WHERE id = $1`,
      [matchID],
    );
    const row = rows[0] as MatchRow | undefined;
    if (!row) {
      return result as StorageAPI.FetchResult<O>;
    }
    if (opts.state) {
      result.state = row.state as State;
    }
    if (opts.metadata) {
      result.metadata = row.metadata as Server.MatchData;
    }
    if (opts.log) {
      result.log = Array.isArray(row.log) ? (row.log as LogEntry[]) : [];
    }
    if (opts.initialState) {
      result.initialState = row.initial_state as State;
    }
    return result as StorageAPI.FetchResult<O>;
  }

  public async wipe(matchID: string): Promise<void> {
    await this.db.query(`DELETE FROM matches WHERE id = $1`, [matchID]);
  }

  public override async listMatches(
    opts?: StorageAPI.ListMatchesOpts,
  ): Promise<string[]> {
    const { rows } = await this.db.query(`SELECT id, metadata FROM matches`);
    return (rows as MatchListRow[])
      .filter((row) => isMatchData(row.metadata) && matchesListFilter(row.metadata, opts))
      .map((row) => row.id);
  }
}
