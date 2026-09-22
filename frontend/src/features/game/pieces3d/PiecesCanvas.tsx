import { type ImobiliarioState } from '@lotrace/shared';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { BoardPieces } from '@/features/game/pieces3d/BoardPieces.tsx';
import { TOTAL } from '@/features/game/pieces3d/lib/tile-positions.ts';

/* ─── Inner camera updater ──────────────────────────────────────
 * Lives inside <Canvas> so it has access to useThree().
 * Recalculates zoom whenever `boardPx` changes.
 ──────────────────────────────────────────────────────────────── */
function CameraSync({ boardPx }: { boardPx: number }): null {
  const { camera, size } = useThree();

  useEffect(() => {
    if (boardPx <= 0) return;
    // 1 world unit == 1 inner tile: zoom = board pixels / TOTAL world units.
    // Top-down camera means this maps the tile grid 1:1 onto the overlay.
    const zoom = boardPx / TOTAL;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [boardPx, camera, size]);

  return null;
}

/* ─── PiecesCanvas ──────────────────────────────────────────────
 * SRP: Canvas setup + measure + lights.
 * Camera angle matches CSS rotateX(30deg): position high + slightly back.
 ──────────────────────────────────────────────────────────────── */
type PiecesCanvasProps = { G: ImobiliarioState };

export function PiecesCanvas({ G }: PiecesCanvasProps): ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [boardPx, setBoardPx] = useState(0);

  // Measure once on mount and on resize
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = (): void => {
      const rect = el.getBoundingClientRect();
      setBoardPx(Math.min(rect.width, rect.height));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      /* The board itself is tilted by CSS rotateX(18deg). We mirror that
       * tilt on the overlay so the top-down 3D projection lines up 1:1 with
       * the tile grid AND leans with the board — no dual-angle mismatch. */
      className="pieces-overlay"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Canvas
        orthographic
        camera={{
          /* Near-top-down ortho: X/Z maps ~1:1 to the tile grid. A tiny Z
           * offset avoids the degenerate look-at when pointing straight down.
           * The visible tilt comes from the CSS rotateX on the wrapper. */
          position: [0, 20, 0.001],
          zoom: 40,   /* initial non-zero zoom; CameraSync will correct it */
          near: 0.1,
          far: 200,
        }}
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Sync camera zoom after measuring the board */}
        <CameraSync boardPx={boardPx} />

        {/* Lights */}
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[6, 14, 6]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <directionalLight position={[-4, 6, -4]} intensity={0.35} />

        {/* All 3D pieces — positions come from tile-positions.ts */}
        <BoardPieces G={G} />
      </Canvas>
    </div>
  );
}
