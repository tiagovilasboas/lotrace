import { createContext, useContext, type ReactNode } from 'react';

export const MatchChromeContext = createContext<ReactNode>(null);

export function useMatchChrome(): ReactNode {
  return useContext(MatchChromeContext);
}
