import type { RoomView, SessionPayload } from '@imobiliario/shared';
import { useCallback, useEffect, useState } from 'react';
import { roomRepository } from '@/lib/repositories/room-repository.ts';
import {
  clearSession,
  readSession,
  writeSession,
} from '@/lib/session/session-storage.ts';

type UseRoomResult = {
  room: RoomView | null;
  session: SessionPayload | null;
  error: string | null;
  busy: boolean;
  createRoom: (nickname: string) => Promise<SessionPayload>;
  joinRoom: (code: string, nickname: string) => Promise<SessionPayload>;
  startGame: () => Promise<void>;
  leave: () => void;
};

export function useRoom(code?: string): UseRoomResult {
  const [room, setRoom] = useState<RoomView | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(() =>
    readSession(),
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = useCallback((nextRoom: RoomView, nextSession: SessionPayload | null) => {
    setRoom(nextRoom);
    if (nextSession) {
      writeSession(nextSession);
      setSession(nextSession);
    }
  }, []);

  useEffect(() => {
    if (!code) {
      return undefined;
    }
    if (session?.matchID && session.credentials) {
      return undefined;
    }
    const token = readSession()?.token;
    let cancelled = false;

    const tick = async (): Promise<void> => {
      try {
        const payload = await roomRepository.get(code, token);
        if (cancelled) {
          return;
        }
        apply(payload.room, payload.session ?? readSession());
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'error');
        }
      }
    };

    void tick();
    const id = window.setInterval(() => {
      void tick();
    }, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [apply, code, session?.credentials, session?.matchID]);

  const createRoom = async (nickname: string): Promise<SessionPayload> => {
    setBusy(true);
    setError(null);
    try {
      const payload = await roomRepository.create(nickname);
      if (!payload.session) {
        throw new Error('Sessão inválida');
      }
      apply(payload.room, payload.session);
      return payload.session;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error';
      setError(message);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const joinRoom = async (
    joinCode: string,
    nickname: string,
  ): Promise<SessionPayload> => {
    setBusy(true);
    setError(null);
    try {
      const payload = await roomRepository.join(joinCode, nickname);
      if (!payload.session) {
        throw new Error('Sessão inválida');
      }
      apply(payload.room, payload.session);
      return payload.session;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error';
      setError(message);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const startGame = async (): Promise<void> => {
    if (!session) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const payload = await roomRepository.start(session.code, session.token);
      apply(payload.room, payload.session);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'error';
      setError(message);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const leave = (): void => {
    clearSession();
    setSession(null);
    setRoom(null);
  };

  return { room, session, error, busy, createRoom, joinRoom, startGame, leave };
}
