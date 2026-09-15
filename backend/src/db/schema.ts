import type { SqlClient } from './sql.ts';

export async function ensureSchema(db: SqlClient): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      code TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      players JSONB NOT NULL,
      match_id TEXT,
      created_at BIGINT NOT NULL
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      game_name TEXT NOT NULL DEFAULT '',
      initial_state JSONB,
      state JSONB,
      metadata JSONB,
      log JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at BIGINT NOT NULL
    )
  `);
}
