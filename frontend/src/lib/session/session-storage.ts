import type { SessionPayload } from '@lotrace/shared';

const KEY = 'lotrace.session';

export function readSession(): SessionPayload | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

export function writeSession(session: SessionPayload): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}
