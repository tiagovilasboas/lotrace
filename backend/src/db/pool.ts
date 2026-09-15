import { Pool } from 'pg';
import type { SqlClient, SqlQueryResult } from './sql.ts';

export function shouldUseSsl(connectionString: string): boolean {
  const lower = connectionString.toLowerCase();
  if (/[?&]sslmode=(disable|allow)/.test(lower)) {
    return false;
  }
  if (/[?&]sslmode=(require|verify-ca|verify-full|prefer)/.test(lower)) {
    return true;
  }

  try {
    const host = new URL(connectionString.replace(/^postgres(ql)?:/i, 'http:'))
      .hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.railway.internal')
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

export function createSqlClient(connectionString: string): SqlClient {
  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString)
      ? { rejectUnauthorized: false }
      : undefined,
  });

  pool.on('error', (error: Error) => {
    console.error('Postgres pool error', error);
  });

  return {
    async query(text: string, values?: unknown[]): Promise<SqlQueryResult> {
      const result = await pool.query(text, values);
      return {
        rows: result.rows,
        rowCount: result.rowCount ?? 0,
      };
    },
  };
}
