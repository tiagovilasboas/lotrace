import { type ReactElement } from 'react';
import * as THREE from 'three';

type TreeProps = { position: [number, number, number] };

const TRUNK_COLOR   = new THREE.Color('#5c3214');
const CANOPY_DARK   = new THREE.Color('#116030');
const CANOPY_MID    = new THREE.Color('#1a8040');
const CANOPY_LIGHT  = new THREE.Color('#40c060');

/**
 * Tree — park piece: brown trunk cylinder + 3 layered green spheres.
 */
export function Tree({ position }: TreeProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Trunk */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.055, 0.14, 8]} />
        <meshStandardMaterial color={TRUNK_COLOR} roughness={0.95} />
      </mesh>
      {/* Canopy base — widest, darkest */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <sphereGeometry args={[0.19, 12, 10]} />
        <meshStandardMaterial color={CANOPY_DARK} roughness={0.85} />
      </mesh>
      {/* Canopy mid */}
      <mesh position={[0.02, 0.35, 0.02]} castShadow>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={CANOPY_MID} roughness={0.8} />
      </mesh>
      {/* Canopy top highlight */}
      <mesh position={[-0.03, 0.42, -0.02]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={CANOPY_LIGHT} roughness={0.7} />
      </mesh>
    </group>
  );
}
