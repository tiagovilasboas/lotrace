/**
 * LotRace — Isometric board pieces
 *
 * Rules:
 *  - Light source: top-left → highlight on top+left face, shadow on right+bottom
 *  - Every icon legible at 20px, crisp at 40px
 *  - Shared piece tokens (wheel, shadow, outline) via CSS vars
 *  - Illustration colours (house roof, hotel walls, etc.) hardcoded in SVG — by design
 *  - viewBox 0 0 32 32, overflow-visible for drop shadow
 */
import type { ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

import type { CSSProperties } from 'react';

type IsoIconProps = { className?: string; style?: CSSProperties };

function IsoSvg({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('shrink-0 overflow-visible drop-shadow-sm', className)}
      style={style}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* Shared elliptical ground shadow */
function Shadow(): ReactElement {
  return <ellipse cx="16" cy="29" rx="9.5" ry="1.8" fill="var(--piece-shadow)" />;
}

/* ─── House ─────────────────────────────────────────────────────
   Isometric cottage: ivory walls, terracotta roof, door + window.
   Left face = shadow, right face = lit, roof = top plane.
─────────────────────────────────────────────────────────────────*/
export function HouseIso({ className, style }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className} style={style}>
      <Shadow />
      <path d="M7 18 16 13.4 16 25.2 7 29Z"          fill="#c0ae90" />  {/* left wall  */}
      <path d="M16 13.4 25 18 25 29 16 25.2Z"         fill="#f0e6cc" />  {/* right wall */}
      <path d="M7 18 16 7.6 16 13.4Z"                 fill="#7a3c24" />  {/* roof left  */}
      <path d="M16 7.6 25 18 16 13.4Z"                fill="#a04e30" />  {/* roof right */}
      <path d="M16 7.6 25 18 23.5 18.6 16 8.8Z"      fill="#b85c38" opacity="0.7" /> {/* ridge */}
      <rect x="13" y="21" width="2" height="4.2" rx="0.4" fill="#4a2e10" />  {/* door */}
      <rect x="18" y="17.5" width="3.2" height="2.6" rx="0.3" fill="#a8d4f0" opacity="0.9" /> {/* window */}
      <path d="M18 18.8h3.2M19.6 17.5v2.6" stroke="#7ab0d4" strokeWidth="0.4" />
    </IsoSvg>
  );
}

/* ─── Hotel ──────────────────────────────────────────────────────
   Tall building, dark-navy left + lit right, grid of windows, brass canopy.
─────────────────────────────────────────────────────────────────*/
export function HotelIso({ className, style }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className} style={style}>
      <Shadow />
      <path d="M8 13.6 16 9.4 16 27.6 8 31Z"          fill="#1a3356" />  {/* left  */}
      <path d="M16 9.4 24 13.6 24 31 16 27.6Z"         fill="#2460a8" />  {/* right */}
      <path d="M8 13.6 16 9.4 24 13.6 16 17.6Z"        fill="#3882c4" />  {/* roof  */}
      <path d="M16 9.4 24 13.6 22.6 14.1 16 10.5Z"    fill="#5ea5dc" opacity="0.55" />
      {/* Left windows */}
      <rect x="9.4" y="15" width="2.4" height="1.8" rx="0.3" fill="#8cc8f8" opacity="0.8" />
      <rect x="9.4" y="18.2" width="2.4" height="1.8" rx="0.3" fill="#8cc8f8" opacity="0.7" />
      <rect x="9.4" y="21.4" width="2.4" height="1.8" rx="0.3" fill="#8cc8f8" opacity="0.55" />
      {/* Right windows */}
      <rect x="17" y="14.4" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.75" />
      <rect x="20.2" y="15.6" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.75" />
      <rect x="17" y="17.8" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.6" />
      <rect x="20.2" y="19" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.6" />
      <rect x="17" y="21.2" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.45" />
      <rect x="20.2" y="22.4" width="2.2" height="1.8" rx="0.3" fill="#c0deff" opacity="0.45" />
      {/* Brass canopy */}
      <path d="M13 27.6h6v1H13z" fill="#162840" />
      <path d="M13 26.4h6v1.2H13z" fill="var(--lr-brass)" opacity="0.88" />
    </IsoSvg>
  );
}

/* ─── Station ────────────────────────────────────────────────────
   Stone station with clock tower and arched entrance.
─────────────────────────────────────────────────────────────────*/
export function StationIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      <path d="M5 24.2h22v2.8H5z" fill="#6e6560" />                        {/* platform */}
      <path d="M7 14.4 16 10.2 16 24.2 7 24.2Z"   fill="#9e9894" />       {/* main left */}
      <path d="M16 10.2 22 13 22 24.2 16 24.2Z"   fill="#d2cfc9" />       {/* main right */}
      <path d="M7 14.4 16 10.2 22 13 13.4 17.2Z"  fill="#e4e2de" />       {/* roof */}
      <path d="M16 10.2 22 13 20.8 13.5 16 11.2Z" fill="#f4f3f0" opacity="0.55" />
      {/* Clock tower */}
      <path d="M19.6 8 23.4 10 23.4 24.2 19.6 24.2Z" fill="#6e6560" />
      <path d="M23.4 10 26.4 11.4 26.4 24.2 23.4 24.2Z" fill="#9e9894" />
      <path d="M19.6 8 23.4 10 26.4 11.4 22.8 9.4Z" fill="#4e4a46" />
      <ellipse cx="22.6" cy="14.6" rx="1.8" ry="1.6" fill="#f2f0ec" />
      <ellipse cx="22.6" cy="14.6" rx="1.3" ry="1.2" fill="#e4e2de" />
      <path d="M22.6 13.6v1M23.4 14.6h-.8" stroke="#1c1917" strokeWidth="0.45" strokeLinecap="round" />
      {/* Arch entrance */}
      <path d="M10.6 17.8v6.4h3.6v-6.4a1.8 1.8 0 0 0-3.6 0Z" fill="#4e4a46" />
      <rect x="16.8" y="15" width="3" height="2.4" rx="0.4" fill="#b8e4fc" opacity="0.8" />
    </IsoSvg>
  );
}

/* ─── Tax / IPTU / IR ────────────────────────────────────────────
   Red warning sign on a post — unmistakably "pay".
─────────────────────────────────────────────────────────────────*/
export function TaxIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      <rect x="14.8" y="18" width="2.4" height="9" rx="0.5" fill="#6e6560" />
      <rect x="15.6" y="18" width="1.6" height="9" rx="0.5" fill="#9e9894" />
      {/* Sign faces */}
      <path d="M8.4 7.4 16 3.8 16 18 8.4 21.2Z"      fill="#b01818" />
      <path d="M16 3.8 23.6 7.4 23.6 21.2 16 18Z"    fill="#e82020" />
      <path d="M8.4 7.4 16 3.8 23.6 7.4 16 10.6Z"    fill="#f06060" />
      <path d="M16 3.8 23.6 7.4 22.4 7.9 16 4.8Z"    fill="#f89090" opacity="0.55" />
      {/* ! left */}
      <rect x="11.4" y="9.8" width="1.8" height="5.2" rx="0.5" fill="#fff0f0" />
      <ellipse cx="12.3" cy="16.8" rx="1" ry="0.9" fill="#fff0f0" />
      {/* ! right */}
      <rect x="17.6" y="9.2" width="1.8" height="5.2" rx="0.5" fill="#fdd8d8" opacity="0.85" />
      <ellipse cx="18.5" cy="16.2" rx="1" ry="0.9" fill="#fdd8d8" opacity="0.85" />
    </IsoSvg>
  );
}

/* ─── Go / Partida ───────────────────────────────────────────────
   Green finish arch + brass stripe + directional arrow.
─────────────────────────────────────────────────────────────────*/
export function GoIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      {/* Left pillar */}
      <path d="M7.4 14 10.6 12.2 10.6 27.4 7.4 29Z"   fill="#125028" />
      <path d="M10.6 12.2 13.2 13.6 13.2 28.8 10.6 27.4Z" fill="#1e8040" />
      {/* Right pillar */}
      <path d="M18.8 10.8 22 9 22 24.2 18.8 25.6Z"    fill="#125028" />
      <path d="M22 9 24.6 10.4 24.6 25.6 22 24.2Z"    fill="#1e8040" />
      {/* Beam */}
      <path d="M7.4 13.8 10.6 12 22 8.8 18.8 10.6Z"   fill="#0e4020" />
      <path d="M7.4 11.4 10.6 9.6 22 6.4 18.8 8.2Z"   fill="#38c060" />
      <path d="M7.4 11.4 7.4 13.8 18.8 10.6 18.8 8.2Z" fill="#1a6a32" />
      <path d="M7.4 12.2 7.4 13 18.8 9.4 18.8 8.6Z"   fill="var(--lr-brass)" opacity="0.85" />
      {/* Arrow */}
      <path d="M12 26.8h8m0 0-2.4-2m2.4 2-2.4 2"
        fill="none" stroke="var(--lr-brass)" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" />
    </IsoSvg>
  );
}

/* ─── Jail / Visita ──────────────────────────────────────────────
   Stone cell with iron bars and barred window.
─────────────────────────────────────────────────────────────────*/
export function JailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      <path d="M7 16.2 16 11.4 16 27.4 7 31Z"   fill="#4e4a46" />
      <path d="M16 11.4 25 16.2 25 31 16 27.4Z"  fill="#6e6a64" />
      <path d="M7 16.2 16 11.4 25 16.2 16 20.4Z" fill="#9e9a94" />
      <path d="M16 11.4 25 16.2 23.6 16.8 16 12.6Z" fill="#cec8be" opacity="0.5" />
      {/* Bars left */}
      <path d="M9.2 17.8v10"  stroke="#1a1714" strokeWidth="1.1" opacity="0.7" />
      <path d="M11.4 16.8v10" stroke="#1a1714" strokeWidth="1.1" opacity="0.7" />
      <path d="M13.6 15.8v10" stroke="#1a1714" strokeWidth="1.1" opacity="0.7" />
      <path d="M9 20.4h5"    stroke="#1a1714" strokeWidth="0.8" opacity="0.5" />
      <path d="M9 23.6h5"    stroke="#1a1714" strokeWidth="0.8" opacity="0.5" />
      {/* Window right */}
      <rect x="17.8" y="15.4" width="4.4" height="3.4" rx="0.3" fill="#28221e" />
      <path d="M19.2 15.4v3.4M20.6 15.4v3.4M22.2 17.1h-4.4" stroke="#3a342e" strokeWidth="0.5" />
    </IsoSvg>
  );
}

/* ─── Park / Parque grátis ───────────────────────────────────────
   Round-canopy tree with brown trunk — distinct from GoIso arch.
─────────────────────────────────────────────────────────────────*/
export function ParkIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      <rect x="13.8" y="21.6" width="2.2" height="6.4" rx="0.6" fill="#5c3214" />
      <rect x="16"   y="21.6" width="1.6" height="6.4" rx="0.6" fill="#7a4820" />
      <ellipse cx="15.6" cy="19.8" rx="8.4" ry="5"   fill="#116030" />
      <ellipse cx="15.2" cy="18.2" rx="7.2" ry="4.2" fill="#1a8040" />
      <ellipse cx="14.4" cy="16"   rx="5.2" ry="3.2" fill="#40c060" />
      <ellipse cx="13.2" cy="14.6" rx="2.8" ry="1.8" fill="#80e090" opacity="0.55" />
    </IsoSvg>
  );
}

/* ─── Go-to-Jail ─────────────────────────────────────────────────
   Police car (top-down isometric) with red/blue sirens + cuffs.
─────────────────────────────────────────────────────────────────*/
export function GotoJailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <Shadow />
      <path d="M7.4 17 16 12.6 16 26 7.4 30Z"     fill="#162840" />
      <path d="M16 12.6 24.6 17 24.6 30 16 26Z"   fill="#1e4080" />
      <path d="M7.4 17 16 12.6 24.6 17 16 21Z"    fill="#2860b8" />
      {/* Sirens */}
      <ellipse cx="11.4" cy="14.8" rx="2.4" ry="1.4" fill="#e83030" />
      <ellipse cx="11.4" cy="14.2" rx="1.6" ry="1"   fill="#ff8080" />
      <ellipse cx="20.6" cy="13.2" rx="2.4" ry="1.4" fill="#2060e8" />
      <ellipse cx="20.6" cy="12.6" rx="1.6" ry="1"   fill="#80b0ff" />
      {/* Cuffs */}
      <circle cx="18.8" cy="20.6" r="2" fill="none" stroke="var(--lr-brass)" strokeWidth="1.2" />
      <circle cx="22.2" cy="22.2" r="2" fill="none" stroke="var(--lr-brass)" strokeWidth="1.2" />
      <path d="M20.4 21.2 21 22" stroke="var(--lr-brass)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Stripe */}
      <path d="M7.4 20.2 16 16.2 16 17.6 7.4 21.6Z"   fill="#f0ece4" opacity="0.32" />
      <path d="M16 16.2 24.6 20.2 24.6 21.6 16 17.6Z"  fill="#f0ece4" opacity="0.22" />
    </IsoSvg>
  );
}
