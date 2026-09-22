/**
 * FooterBar — 32px height, single line.
 * Avatar dot + title + action button.
 * Used when isActive=false (waiting) or as a minimal CTA bar.
 */
import type { ReactElement, ReactNode } from 'react';
import { tokenCssVar } from '@/features/game/player-tokens.ts';

type FooterBarProps = {
  playerID: string;
  title: string;
  children: ReactNode; // the CTA button
};

export function FooterBar({ playerID, title, children }: FooterBarProps): ReactElement {
  return (
    <div className="footerbar">
      {/* Player colour dot */}
      <span
        className="footerbar-dot"
        style={{ backgroundColor: tokenCssVar(playerID) }}
        aria-hidden
      />
      <span className="footerbar-title min-w-0 flex-1 truncate">{title}</span>
      {children}
    </div>
  );
}
