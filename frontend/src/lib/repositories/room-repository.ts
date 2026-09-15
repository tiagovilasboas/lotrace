import type { RoomView, SessionPayload } from '@lotrace/shared';
import { apiUrl } from '../api-base.ts';

export type RoomResponse = {
  room: RoomView;
  session: SessionPayload | null;
};

async function parseError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof (body as { error: unknown }).error === 'string'
    ) {
      return (body as { error: string }).error;
    }
  } catch {
    /* fall through */
  }
  return `HTTP ${response.status}`;
}

async function request(
  path: string,
  init: RequestInit,
): Promise<RoomResponse> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as RoomResponse;
}

export const roomRepository = {
  create(nickname: string): Promise<RoomResponse> {
    return request('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  },

  join(code: string, nickname: string): Promise<RoomResponse> {
    return request(`/api/rooms/${encodeURIComponent(code)}/join`, {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  },

  get(code: string, token?: string): Promise<RoomResponse> {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return request(`/api/rooms/${encodeURIComponent(code)}`, {
      method: 'GET',
      headers,
    });
  },

  start(code: string, token: string): Promise<RoomResponse> {
    return request(`/api/rooms/${encodeURIComponent(code)}/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ token }),
    });
  },
};
