import { type ImobiliarioState } from '@lotrace/shared';
import { Canvas } from '@react-three/fiber';
import { useCallback, useRef, useState, type ReactElement } from 'react';
import { BoardPieces } from '@/features/game/pieces3d/BoardPieces.tsx';

type PiecesCanvasProps = {
  G: ImobiliarioState;
};

/**
 * PiecesCanvas — Three.js Canvas overlaid on the CSS 3D board.
 *
 * Responsibilities (SRP):
 *  - Set up <Canvas> with lights and camera
 *  - Measure the board DOM element to calculate world scale
 *  - Render <BoardPieces> with correct scale
 *
 * The canvas is pointer-events:none — all interactions stay in DOM.
 * Camera angle mirrors the CSS rotateX(30deg) board tilt.
 */
export function PiecesCanvas({ G }: PiecesCanvasProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Measure the board size once mounted and derive world scale
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const boardPx = Math.min(rect.width, rect.height);
    // World units = 7.56 spans the full board
    setScale(boardPx / 7.56);
  }, []);

  return (
    <div
      ref={measureRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        ref={containerRef}
        orthographic
        camera={{
          position: [0, 14, 10],
          zoom: scale * 0.82,
          near: 0.1,
          far: 100,
        }}
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 12, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[-4, 6, -4]} intensity={0.3} />

        {/* Pieces */}
        <BoardPieces G={G} scale={1} />
      </Canvas>
    </div>
  );
}
