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
    // zoom = pixels per world unit × fudge factor so board fills the canvas
    const zoom = (boardPx / TOTAL) * 0.88;
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
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Canvas
        orthographic
        camera={{
          /* High-angle ortho — mirrors CSS rotateX(30deg) */
          position: [0, 16, 10],
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
