import type { TurnStage } from '@lotrace/shared';
import { useCallback, useEffect, useRef, useState } from 'react';

const ROLL_BUSY_MIN_MS = 280;
const ROLL_BUSY_FALLBACK_MS = 800;

type UseRollBusyResult = {
  rollBusy: boolean;
  beginRoll: () => boolean;
};

export function useRollBusy(
  stage: TurnStage | undefined,
  isActive: boolean,
): UseRollBusyResult {
  const [rollBusy, setRollBusy] = useState(false);
  const rollStartedAtRef = useRef<number | null>(null);
  const rollLockRef = useRef(false);

  const clearBusy = useCallback((): void => {
    rollLockRef.current = false;
    rollStartedAtRef.current = null;
    setRollBusy(false);
  }, []);

  useEffect(() => {
    if (!isActive) {
      clearBusy();
    }
  }, [clearBusy, isActive]);

  useEffect(() => {
    if (!rollBusy) {
      return undefined;
    }

    if (stage !== 'roll' && stage !== 'jail') {
      const elapsed = Date.now() - (rollStartedAtRef.current ?? Date.now());
      const remaining = Math.max(0, ROLL_BUSY_MIN_MS - elapsed);
      const id = window.setTimeout(clearBusy, remaining);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(clearBusy, ROLL_BUSY_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [clearBusy, rollBusy, stage]);

  const beginRoll = useCallback((): boolean => {
    if (rollLockRef.current) {
      return false;
    }
    rollLockRef.current = true;
    rollStartedAtRef.current = Date.now();
    setRollBusy(true);
    return true;
  }, []);

  return { rollBusy, beginRoll };
}
