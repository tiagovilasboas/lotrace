import { type ReactElement, type ReactNode } from 'react';
import { MatchChromeContext } from '@/features/game/lib/match-chrome.ts';

export function MatchChromeProvider({
  chrome,
  children,
}: {
  chrome: ReactNode;
  children: ReactNode;
}): ReactElement {
  return (
    <MatchChromeContext.Provider value={chrome}>{children}</MatchChromeContext.Provider>
  );
}
