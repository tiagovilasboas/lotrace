export function getServerUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw && raw.length > 0) {
    return raw.replace(/\/$/, '');
  }
  return window.location.origin;
}

export function apiUrl(path: string): string {
  return `${getServerUrl()}${path}`;
}
