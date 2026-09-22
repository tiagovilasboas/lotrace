import { type ReactElement } from 'react';
import * as THREE from 'three';

type HouseProps = { position: [number, number, number] };

const WALL_COLOR  = new THREE.Color('#f0e6cc');
const SHADE_COLOR = new THREE.Color('#c8b890');
const ROOF_COLOR  = new THREE.Color('#8c4a2f');
const ROOF_LIGHT  = new THREE.Color('#b05a38');

/**
 * House — compact cottage: box body + triangular prism roof.
 * Size calibrated for a board tile (~0.6 world units wide).
 */
export function House({ position }: HouseProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.36, 0.24, 0.28]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
      </mesh>
      {/* Body shadow side */}
      <mesh position={[-0.18, 0.12, 0]}>
        <boxGeometry args={[0.005, 0.24, 0.28]} />
        <meshStandardMaterial color={SHADE_COLOR} roughness={0.9} />
      </mesh>
      {/* Roof — triangular prism via cylinder geometry with 3 segments */}
      <mesh position={[0, 0.31, 0]} rotation={[0, Math.PI / 6, 0]} castShadow>
        <cylinderGeometry args={[0, 0.24, 0.2, 3, 1]} />
        <meshStandardMaterial color={ROOF_COLOR} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Roof lit face */}
      <mesh position={[0, 0.31, 0.01]} rotation={[0, Math.PI / 6 + Math.PI, 0]}>
        <cylinderGeometry args={[0, 0.24, 0.2, 3, 1]} />
        <meshStandardMaterial color={ROOF_LIGHT} roughness={0.75} transparent opacity={0.6} side={THREE.FrontSide} />
      </mesh>
    </group>
  );
}
