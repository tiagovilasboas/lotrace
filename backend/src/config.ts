const DEFAULT_ORIGIN = 'http://localhost:5173';

/**
 * Parse one CORS_ORIGIN token: exact origin, JS regex literal, or skip.
 * A lone `*` is never treated as allow-all.
 */
function parseOriginPart(part: string): string | RegExp | undefined {
  if (part === '*') {
    return undefined;
  }

  if (!part.startsWith('/')) {
    return part;
  }

  const lastSlash = part.lastIndexOf('/');
  if (lastSlash <= 0) {
    return part;
  }

  const pattern = part.slice(1, lastSlash);
  const flags = part.slice(lastSlash + 1);
  if (pattern.length === 0) {
    return undefined;
  }

  try {
    return new RegExp(pattern, flags);
  } catch {
    return undefined;
  }
}

export function parseOrigins(raw: string | undefined): (string | RegExp)[] {
  const source = raw && raw.trim().length > 0 ? raw : DEFAULT_ORIGIN;
  const parts = source
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const origins: (string | RegExp)[] = [];
  for (const part of parts) {
    const parsed = parseOriginPart(part);
    if (parsed !== undefined) {
      origins.push(parsed);
    }
  }
  return origins;
}

export type ServerConfig = {
  port: number;
  origins: (string | RegExp)[];
  databaseUrl: string | undefined;
};

function readOptionalEnv(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export function loadConfig(): ServerConfig {
  const port = Number.parseInt(process.env.PORT ?? '8000', 10);
  return {
    port: Number.isNaN(port) ? 8000 : port,
    origins: parseOrigins(process.env.CORS_ORIGIN),
    databaseUrl: readOptionalEnv(process.env.DATABASE_URL),
  };
}
