import { type ReactElement } from 'react';
import * as THREE from 'three';

type JailBlockProps = { position: [number, number, number] };

const STONE_MID  = new THREE.Color('#6e6a64');
const STONE_DARK = new THREE.Color('#4e4a46');
const STONE_TOP  = new THREE.Color('#9e9a94');
const BAR_COLOR  = new THREE.Color('#1a1714');

/**
 * JailBlock — stone cell with iron bar front face.
 */
export function JailBlock({ position }: JailBlockProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.38, 0.3, 0.3]} />
        <meshStandardMaterial color={STONE_MID} roughness={0.9} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.3]} />
        <meshStandardMaterial color={STONE_TOP} roughness={0.85} />
      </mesh>
      {/* Shadow side */}
      <mesh position={[-0.19, 0.15, 0]}>
        <boxGeometry args={[0.005, 0.3, 0.3]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      {/* Iron bars — front face (4 vertical bars) */}
      {[-0.12, -0.04, 0.04, 0.12].map((bz, i) => (
        <mesh key={i} position={[0.19, 0.15, bz]}>
          <cylinderGeometry args={[0.012, 0.012, 0.28, 6]} />
          <meshStandardMaterial color={BAR_COLOR} roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {/* Horizontal cross-bar */}
      <mesh position={[0.19, 0.2, 0]}>
        <boxGeometry args={[0.005, 0.018, 0.3]} />
        <meshStandardMaterial color={BAR_COLOR} roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}
