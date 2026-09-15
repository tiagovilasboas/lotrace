import type { ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

type IsoIconProps = {
  className?: string;
};

function IsoSvg({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('shrink-0 overflow-visible drop-shadow-sm', className)}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

function GroundShadow(): ReactElement {
  return <ellipse cx="16" cy="28.6" rx="10.5" ry="2.1" fill="#1c1917" opacity="0.28" />;
}

export function HouseIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M7 16.2 16 11.4 16 19.6 7 24.2Z" fill="#166534" />
      <path d="M16 11.4 25 16.2 25 24.2 16 19.6Z" fill="#22c55e" />
      <path d="M7 16.2 16 8.2 25 16.2 16 11.4Z" fill="#4ade80" />
      <path d="M16 8.2 25 16.2 23.4 16.8 16 10.2Z" fill="#86efac" opacity="0.7" />
      <path d="M14.2 20.4v4.6l3.6-2v-4.6z" fill="#14532d" />
      <path d="M12.4 14.2h2.2v2.1h-2.2z" fill="#bbf7d0" opacity="0.85" />
    </IsoSvg>
  );
}

export function HotelIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M8 12.4 16 8.2 16 24.8 8 28.6Z" fill="#9f1239" />
      <path d="M16 8.2 24 12.4 24 28.6 16 24.8Z" fill="#e11d48" />
      <path d="M8 12.4 16 4.8 24 12.4 16 8.2Z" fill="#fb7185" />
      <path d="M16 4.8 24 12.4 22.6 12.9 16 6.2Z" fill="#fecdd3" opacity="0.55" />
      <path d="M11 14.6h2.1v2.1H11zm3.6-1.8h2.1v2.1h-2.1zM11 18.4h2.1v2.1H11zm3.6-1.8h2.1v2.1h-2.1zM11 22.2h2.1v2.1H11zm3.6-1.8h2.1v2.1h-2.1z" fill="#fde68a" />
      <path d="M17.8 21.2 16 22.1 16 25.4 19.8 23.4 19.8 20.2Z" fill="#7f1d1d" />
    </IsoSvg>
  );
}

export function StationIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M6 20.4h20v2.2H6z" fill="#44403c" />
      <circle cx="11.2" cy="22.8" r="2.3" fill="#1c1917" />
      <circle cx="20.8" cy="22.8" r="2.3" fill="#1c1917" />
      <circle cx="11.2" cy="22.8" r="0.8" fill="#d6d3d1" />
      <circle cx="20.8" cy="22.8" r="0.8" fill="#d6d3d1" />
      <path d="M7.4 13.2 16 9.2 24.6 13.2 24.6 20.2 7.4 20.2Z" fill="#0ea5e9" />
      <path d="M7.4 13.2 16 9.2 16 16.2 7.4 20.2Z" fill="#0369a1" />
      <path d="M16 9.2 24.6 13.2 22.8 13.8 16 10.4Z" fill="#7dd3fc" opacity="0.8" />
      <rect x="10.2" y="14.4" width="3.2" height="2.6" rx="0.4" fill="#e0f2fe" />
      <rect x="15.4" y="13.4" width="3.2" height="2.6" rx="0.4" fill="#e0f2fe" />
      <path d="M21.4 11.2h2.2v4.6h-2.2z" fill="#0f172a" />
      <path d="M20.6 10.2h3.8v1.4h-3.8z" fill="#f97316" />
    </IsoSvg>
  );
}

export function TaxIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <ellipse cx="12.4" cy="22.4" rx="6.2" ry="2.4" fill="#a16207" />
      <ellipse cx="12.4" cy="20.6" rx="6.2" ry="2.4" fill="#ca8a04" />
      <ellipse cx="12.4" cy="18.8" rx="6.2" ry="2.4" fill="#eab308" />
      <ellipse cx="12.4" cy="17.2" rx="6.2" ry="2.4" fill="#facc15" />
      <ellipse cx="12.4" cy="17.2" rx="3.4" ry="1.1" fill="#fef08a" opacity="0.8" />
      <path d="M17.2 10.4 25.4 14.2 25.4 22.6 17.2 18.8Z" fill="#fef3c7" />
      <path d="M17.2 10.4 25.4 14.2 23.8 14.8 17.2 11.6Z" fill="#fffbeb" />
      <path d="M19 13.2h4.2M19 15.4h4.2M19 17.6h3.1" stroke="#b45309" strokeWidth="0.7" strokeLinecap="round" />
    </IsoSvg>
  );
}

export function GoIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M13.4 8.2 15.6 7.2 15.6 25.4 13.4 26.4Z" fill="#365314" />
      <path d="M15.6 7.2 17.6 8.2 17.6 26.4 15.6 25.4Z" fill="#4d7c0f" />
      <path d="M16.8 8.4 27.4 13.6 16.8 16.2Z" fill="#22c55e" />
      <path d="M16.8 8.4 27.4 13.6 25.6 14.4 16.8 10.2Z" fill="#86efac" />
      <path d="M16.8 11.6 27.4 16.8 16.8 19.4Z" fill="#15803d" />
      <path d="M8.8 22.2 16.4 18.6 16.4 21.2 8.8 24.8Z" fill="#166534" />
    </IsoSvg>
  );
}

export function JailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M7 12.8 16 8.2 16 23.6 7 27.8Z" fill="#57534e" />
      <path d="M16 8.2 25 12.8 25 27.8 16 23.6Z" fill="#a8a29e" />
      <path d="M7 12.8 16 4.8 25 12.8 16 8.2Z" fill="#d6d3d1" />
      <path d="M10.2 14.4 10.2 25.2 12 24.4 12 13.8Z" fill="#1c1917" opacity="0.55" />
      <path d="M13.4 12.8 13.4 23.6 15.2 22.8 15.2 12.2Z" fill="#1c1917" opacity="0.55" />
      <path d="M17.6 12.8 17.6 23.8 19.4 24.6 19.4 13.6Z" fill="#1c1917" opacity="0.38" />
      <path d="M21.2 14.4 21.2 25.4 23 26.2 23 15.2Z" fill="#1c1917" opacity="0.38" />
    </IsoSvg>
  );
}

export function ParkIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M14.4 20.2 16 19.4 16 26.8 18.4 25.6 18.4 21.2 16 22.2Z" fill="#7c2d12" />
      <path d="M8.2 16.4 16 11.6 23.8 16.4 16 20.8Z" fill="#15803d" />
      <path d="M9.6 13.2 16 9.2 22.4 13.2 16 17Z" fill="#22c55e" />
      <path d="M11.4 10.4 16 7.4 20.6 10.4 16 13.2Z" fill="#4ade80" />
      <path d="M16 7.4 20.6 10.4 19.2 10.9 16 8.4Z" fill="#bbf7d0" opacity="0.7" />
    </IsoSvg>
  );
}

export function GotoJailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      <path d="M14.2 10.2 22.8 14.4 22.8 24.8 14.2 20.6Z" fill="#a8a29e" />
      <path d="M16.4 13.2v8.4M19.2 14.6v8.4M21.8 15.8v8.2" stroke="#1c1917" strokeWidth="1.1" opacity="0.5" />
      <path
        d="M6.4 16.2h8.8m0 0-3.2-3.2m3.2 3.2-3.2 3.2"
        fill="none"
        stroke="#e11d48"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IsoSvg>
  );
}
