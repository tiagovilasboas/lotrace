/**
 * LotRace — Isometric board icons
 *
 * Design principles:
 *  - Light source: top-left (highlight on top/left face, shadow on right/bottom)
 *  - Every piece readable at 20 px; crisp at 40 px
 *  - Piece tokens: wheels/shadow via CSS vars; illustration colours hardcoded
 *  - viewBox 0 0 32 32, overflow-visible for drop shadow
 */
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

/** Small elliptical ground shadow shared by every piece */
function GroundShadow(): ReactElement {
  return <ellipse cx="16" cy="29" rx="9.5" ry="1.8" fill="var(--piece-shadow)" />;
}

/* ─── House ────────────────────────────────────────────────────
   Compact cottage: ivory walls, warm-terracotta roof, dark door.
   Isometric: left=shadow wall, right=lit wall, top=roof triangle.
 ──────────────────────────────────────────────────────────────── */
export function HouseIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Left wall — shadow side */}
      <path d="M7 18 16 13.4 16 25.2 7 29Z" fill="#c8b89a" />
      {/* Right wall — lit side */}
      <path d="M16 13.4 25 18 25 29 16 25.2Z" fill="#f5edda" />
      {/* Roof left face */}
      <path d="M7 18 16 7.6 16 13.4Z" fill="#8c4a2f" />
      {/* Roof right face */}
      <path d="M16 7.6 25 18 16 13.4Z" fill="#b05a38" />
      {/* Roof ridge highlight */}
      <path d="M16 7.6 25 18 23.6 18.5 16 8.9Z" fill="#c96d45" opacity="0.7" />
      {/* Door (left wall) */}
      <path d="M13.4 21.2h1.8v4h-1.8z" fill="#5c3d1e" />
      {/* Window (right wall) */}
      <rect x="18.2" y="17.6" width="3" height="2.4" rx="0.3" fill="#aed6f1" opacity="0.9" />
      <path d="M18.2 18.8h3M19.7 17.6v2.4" stroke="#7fb3d3" strokeWidth="0.4" />
    </IsoSvg>
  );
}

/* ─── Hotel ────────────────────────────────────────────────────
   Tall building: dark-navy left, mid-navy right, flat roof with
   rooftop detail. Windows in rows on both faces.
 ──────────────────────────────────────────────────────────────── */
export function HotelIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Left face — shadow */}
      <path d="M8 14 16 9.6 16 27.4 8 31Z" fill="#1e3a5f" />
      {/* Right face — lit */}
      <path d="M16 9.6 24 14 24 31 16 27.4Z" fill="#2563a8" />
      {/* Roof top */}
      <path d="M8 14 16 9.6 24 14 16 18Z" fill="#3b82c4" />
      {/* Roof highlight edge */}
      <path d="M16 9.6 24 14 22.6 14.5 16 10.7Z" fill="#60a5d8" opacity="0.6" />
      {/* Left face windows — 3 rows × 1 */}
      <rect x="9.4" y="15.2" width="2.4" height="1.8" rx="0.3" fill="#93c5fd" opacity="0.8" />
      <rect x="9.4" y="18.4" width="2.4" height="1.8" rx="0.3" fill="#93c5fd" opacity="0.8" />
      <rect x="9.4" y="21.6" width="2.4" height="1.8" rx="0.3" fill="#93c5fd" opacity="0.6" />
      {/* Right face windows — 3 rows × 2 */}
      <rect x="17.2" y="14.6" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.75" />
      <rect x="20.2" y="15.8" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.75" />
      <rect x="17.2" y="18" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.6" />
      <rect x="20.2" y="19.2" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.6" />
      <rect x="17.2" y="21.4" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.5" />
      <rect x="20.2" y="22.6" width="2" height="1.6" rx="0.3" fill="#bfdbfe" opacity="0.5" />
      {/* Entrance canopy */}
      <path d="M13.2 27.4h5.6v1H13.2z" fill="#1a3050" />
      <path d="M13.2 26.2h5.6v1.2H13.2z" fill="#e4b44a" opacity="0.85" />
    </IsoSvg>
  );
}

/* ─── Station ──────────────────────────────────────────────────
   Railway station building: arched facade, clock tower, platform.
   Left=shadow stone, right=lit stone, tower on right side.
 ──────────────────────────────────────────────────────────────── */
export function StationIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Platform base */}
      <path d="M5 24h22v3H5z" fill="#78716c" />
      {/* Main building — left face */}
      <path d="M7 14.6 16 10.4 16 24 7 24Z" fill="#a8a29e" />
      {/* Main building — right face */}
      <path d="M16 10.4 22 13.2 22 24 16 24Z" fill="#d6d3d1" />
      {/* Roof */}
      <path d="M7 14.6 16 10.4 22 13.2 13.4 17.4Z" fill="#e7e5e4" />
      {/* Roof ridge */}
      <path d="M16 10.4 22 13.2 20.8 13.7 16 11.4Z" fill="#f5f5f4" opacity="0.6" />
      {/* Tower — left */}
      <path d="M19.6 8.2 23.4 10.2 23.4 24 19.6 24Z" fill="#78716c" />
      {/* Tower — right */}
      <path d="M23.4 10.2 26.4 11.6 26.4 24 23.4 24Z" fill="#a8a29e" />
      {/* Tower roof */}
      <path d="M19.6 8.2 23.4 10.2 26.4 11.6 22.8 9.6Z" fill="#57534e" />
      {/* Clock face on tower */}
      <ellipse cx="22.6" cy="14.6" rx="1.8" ry="1.6" fill="#f5f5f4" />
      <ellipse cx="22.6" cy="14.6" rx="1.4" ry="1.2" fill="#e7e5e4" />
      <path d="M22.6 13.6v1M23.4 14.6h-0.8" stroke="#1c1917" strokeWidth="0.45" strokeLinecap="round" />
      {/* Arched entrance */}
      <path d="M10.8 17.8 10.8 24 14.2 24 14.2 17.8 A1.7 1.7 0 0 0 10.8 17.8Z" fill="#57534e" />
      {/* Window */}
      <rect x="17" y="15.2" width="2.8" height="2.2" rx="0.4" fill="#bae6fd" opacity="0.8" />
    </IsoSvg>
  );
}

/* ─── Tax ──────────────────────────────────────────────────────
   Warning sign: isometric red sign board on a post, exclamation
   mark — unmistakably "pay up".
 ──────────────────────────────────────────────────────────────── */
export function TaxIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Post */}
      <rect x="14.8" y="18" width="2.4" height="9" rx="0.5" fill="#78716c" />
      <rect x="15.6" y="18" width="1.6" height="9" rx="0.5" fill="#a8a29e" />
      {/* Sign left face */}
      <path d="M8.4 7.6 16 4 16 18 8.4 21.2Z" fill="#b91c1c" />
      {/* Sign right face */}
      <path d="M16 4 23.6 7.6 23.6 21.2 16 18Z" fill="#ef4444" />
      {/* Sign top */}
      <path d="M8.4 7.6 16 4 23.6 7.6 16 10.8Z" fill="#f87171" />
      {/* Sign top highlight */}
      <path d="M16 4 23.6 7.6 22.4 8.1 16 5Z" fill="#fca5a5" opacity="0.55" />
      {/* Exclamation — shaft on left face */}
      <rect x="11.4" y="10" width="1.8" height="5.4" rx="0.5" fill="#fef2f2" />
      <ellipse cx="12.3" cy="17" rx="1" ry="0.9" fill="#fef2f2" />
      {/* Exclamation — shaft on right face */}
      <rect x="17.6" y="9.4" width="1.8" height="5.4" rx="0.5" fill="#fee2e2" opacity="0.85" />
      <ellipse cx="18.5" cy="16.4" rx="1" ry="0.9" fill="#fee2e2" opacity="0.85" />
    </IsoSvg>
  );
}

/* ─── Go (Partida) ─────────────────────────────────────────────
   Green finish-line arch with chequered flag feel.
   Two pillars + horizontal beam, green with gold accent.
 ──────────────────────────────────────────────────────────────── */
export function GoIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Left pillar */}
      <path d="M7.4 14 10.6 12.2 10.6 27.4 7.4 29Z" fill="#166534" />
      <path d="M10.6 12.2 13.2 13.6 13.2 28.8 10.6 27.4Z" fill="#22c55e" />
      {/* Right pillar */}
      <path d="M18.8 10.8 22 9 22 24.2 18.8 25.6Z" fill="#166534" />
      <path d="M22 9 24.6 10.4 24.6 25.6 22 24.2Z" fill="#22c55e" />
      {/* Arch beam — left face */}
      <path d="M7.4 14 10.6 12.2 22 9 18.8 10.8Z" fill="#15803d" />
      {/* Arch beam — top face */}
      <path d="M7.4 11.6 10.6 9.8 22 6.4 18.8 8.2Z" fill="#4ade80" />
      {/* Beam front face */}
      <path d="M7.4 11.6 7.4 14 18.8 10.8 18.8 8.2Z" fill="#16a34a" />
      {/* Gold stripe on beam */}
      <path d="M7.4 12.4 7.4 13.2 18.8 9.6 18.8 8.8Z" fill="#e4b44a" opacity="0.8" />
      {/* Arrow on ground */}
      <path
        d="M12 26.4h8m0 0-2.4-2m2.4 2-2.4 2"
        fill="none"
        stroke="#e4b44a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IsoSvg>
  );
}

/* ─── Jail (Visiting) ──────────────────────────────────────────
   Stone cell block: thick walls, visible iron bars on front face,
   small barred window. Reads "prison" not "abstract shape".
 ──────────────────────────────────────────────────────────────── */
export function JailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Left face */}
      <path d="M7 16.4 16 11.6 16 27.4 7 31Z" fill="#57534e" />
      {/* Right face */}
      <path d="M16 11.6 25 16.4 25 31 16 27.4Z" fill="#78716c" />
      {/* Top */}
      <path d="M7 16.4 16 11.6 25 16.4 16 20.6Z" fill="#a8a29e" />
      {/* Top highlight */}
      <path d="M16 11.6 25 16.4 23.6 16.9 16 12.8Z" fill="#d6d3d1" opacity="0.5" />
      {/* Bars on left face — 4 vertical bars */}
      <path d="M9.2 17.8 9.2 27.8" stroke="#1c1917" strokeWidth="1" opacity="0.7" />
      <path d="M11.4 16.8 11.4 26.8" stroke="#1c1917" strokeWidth="1" opacity="0.7" />
      <path d="M13.6 15.8 13.6 25.8" stroke="#1c1917" strokeWidth="1" opacity="0.7" />
      {/* Horizontal cross-bars */}
      <path d="M9 20.4h5" stroke="#1c1917" strokeWidth="0.8" opacity="0.5" />
      <path d="M9 23.6h5" stroke="#1c1917" strokeWidth="0.8" opacity="0.5" />
      {/* Barred window on right face */}
      <rect x="17.8" y="15.4" width="4.4" height="3.4" rx="0.3" fill="#292524" />
      <path d="M19.2 15.4v3.4M20.6 15.4v3.4M22.2 17.1h-4.4" stroke="#44403c" strokeWidth="0.5" />
    </IsoSvg>
  );
}

/* ─── Park (Free Parking) ──────────────────────────────────────
   Stylised tree: round canopy in two green tones, brown trunk,
   clean and distinct from GoIso.
 ──────────────────────────────────────────────────────────────── */
export function ParkIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Trunk left */}
      <rect x="13.8" y="21.6" width="2.2" height="6.4" rx="0.6" fill="#6b3f1e" />
      {/* Trunk right */}
      <rect x="16" y="21.6" width="1.6" height="6.4" rx="0.6" fill="#8b5a2b" />
      {/* Canopy shadow base (large ellipse) */}
      <ellipse cx="15.6" cy="20" rx="8.6" ry="5.2" fill="#15803d" />
      {/* Canopy mid */}
      <ellipse cx="15.2" cy="18.4" rx="7.4" ry="4.4" fill="#16a34a" />
      {/* Canopy top highlight */}
      <ellipse cx="14.4" cy="16.2" rx="5.4" ry="3.4" fill="#4ade80" />
      {/* Canopy specular */}
      <ellipse cx="13.2" cy="14.8" rx="2.8" ry="1.8" fill="#86efac" opacity="0.55" />
    </IsoSvg>
  );
}

/* ─── Go-to-Jail ───────────────────────────────────────────────
   Police car top view (siren lights) + handcuffs icon.
   Clear: "you're being arrested."
 ──────────────────────────────────────────────────────────────── */
export function GotoJailIso({ className }: IsoIconProps): ReactElement {
  return (
    <IsoSvg className={className}>
      <GroundShadow />
      {/* Car body left */}
      <path d="M7.4 17.2 16 12.8 16 26 7.4 30Z" fill="#1e3a5f" />
      {/* Car body right */}
      <path d="M16 12.8 24.6 17.2 24.6 30 16 26Z" fill="#2563a8" />
      {/* Car roof */}
      <path d="M7.4 17.2 16 12.8 24.6 17.2 16 21Z" fill="#3b82c4" />
      {/* Siren left — red */}
      <ellipse cx="11.4" cy="15" rx="2.4" ry="1.4" fill="#ef4444" />
      <ellipse cx="11.4" cy="14.4" rx="1.6" ry="1" fill="#fca5a5" />
      {/* Siren right — blue */}
      <ellipse cx="20.6" cy="13.4" rx="2.4" ry="1.4" fill="#3b82f6" />
      <ellipse cx="20.6" cy="12.8" rx="1.6" ry="1" fill="#93c5fd" />
      {/* Handcuff circles on car side (right face) */}
      <circle cx="18.8" cy="20.8" r="2" fill="none" stroke="#e4b44a" strokeWidth="1.2" />
      <circle cx="22.2" cy="22.4" r="2" fill="none" stroke="#e4b44a" strokeWidth="1.2" />
      <path d="M20.4 21.4 21 22" stroke="#e4b44a" strokeWidth="1.2" strokeLinecap="round" />
      {/* White stripe on car */}
      <path d="M7.4 20.4 16 16.4 16 17.8 7.4 21.8Z" fill="#f5f5f4" opacity="0.35" />
      <path d="M16 16.4 24.6 20.4 24.6 21.8 16 17.8Z" fill="#f5f5f4" opacity="0.25" />
    </IsoSvg>
  );
}
