import type { ReactElement } from 'react';

export function HomeTrackPreview(): ReactElement {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg
        viewBox="0 0 120 120"
        className="size-28 pointer-events-none"
        focusable="false"
      >
        <defs>
          <linearGradient id="home-track-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="55%" stopColor="var(--success)" />
            <stop offset="100%" stopColor="var(--accent-foreground)" />
          </linearGradient>
        </defs>
        <rect
          x="18"
          y="18"
          width="84"
          height="84"
          rx="20"
          fill="var(--border)"
        />
        <rect
          x="32"
          y="32"
          width="56"
          height="56"
          rx="12"
          fill="var(--page)"
        />
        <rect
          x="25"
          y="25"
          width="70"
          height="70"
          rx="16"
          fill="none"
          stroke="url(#home-track-line)"
          strokeWidth="2.25"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="60" cy="25" r="4" fill="var(--primary)" />
        <circle cx="95" cy="60" r="4" fill="var(--success)" />
        <circle cx="42" cy="95" r="4" fill="var(--accent-foreground)" />
      </svg>
    </div>
  );
}
