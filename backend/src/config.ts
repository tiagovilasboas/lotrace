function parseOrigins(raw: string | undefined): (string | RegExp)[] {
  const fallback = 'http://localhost:5173';
  const parts = (raw && raw.trim().length > 0 ? raw : fallback)
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return parts;
}

export type ServerConfig = {
  port: number;
  origins: (string | RegExp)[];
};

export function loadConfig(): ServerConfig {
  const port = Number.parseInt(process.env.PORT ?? '8000', 10);
  return {
    port: Number.isNaN(port) ? 8000 : port,
    origins: parseOrigins(process.env.CORS_ORIGIN),
  };
}
