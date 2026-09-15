export type SqlQueryResult = {
  rows: unknown[];
  rowCount: number;
};

export type SqlClient = {
  query: (text: string, values?: unknown[]) => Promise<SqlQueryResult>;
};
