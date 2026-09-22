/**
 * FooterBar — 32px height, single line.
 * Buttons are centred; optional title sits to the left, hint to the right.
 * Kept minimal so it fits the 32px footer.
 */
import type { ReactElement, ReactNode } from 'react';
import { tokenCssVar } from '@/features/game/player-tokens.ts';

type FooterBarProps = {
  playerID: string;
  title?: string;
  children: ReactNode; // the CTA button(s)
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

      {/* Optional title on the left */}
      {title ? <span className="footerbar-title">{title}</span> : <span className="flex-1" />}

      {/* Buttons — centred group */}
      <div className="footerbar-actions">{children}</div>
    </div>
  );
}
