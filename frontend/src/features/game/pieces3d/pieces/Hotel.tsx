import { type ReactElement } from 'react';
import * as THREE from 'three';

type HotelProps = { position: [number, number, number] };

const BODY_COLOR   = new THREE.Color('#1e4080');
const SHADE_COLOR  = new THREE.Color('#132a54');
const ROOF_COLOR   = new THREE.Color('#2860b8');
const BRASS_COLOR  = new THREE.Color('#f0b83f');
const WINDOW_COLOR = new THREE.Color('#93c5fd');

/**
 * Hotel — tall building: navy box + window grid (emissive) + brass canopy.
 */
export function Hotel({ position }: HotelProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Main body */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.3]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.7} />
      </mesh>
      {/* Shadow side */}
      <mesh position={[-0.19, 0.24, 0]}>
        <boxGeometry args={[0.005, 0.48, 0.3]} />
        <meshStandardMaterial color={SHADE_COLOR} roughness={0.8} />
      </mesh>
      {/* Flat roof */}
      <mesh position={[0, 0.49, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.3]} />
        <meshStandardMaterial color={ROOF_COLOR} roughness={0.6} />
      </mesh>
      {/* Window grid — emissive blue panels */}
      {[-0.1, 0, 0.1].map((wz, i) =>
        [-0.08, 0.08, 0.24].map((wy, j) => (
          <mesh key={`w-${i}-${j}`} position={[0.19, wy, wz]}>
            <planeGeometry args={[0.06, 0.07]} />
            <meshStandardMaterial
              color={WINDOW_COLOR}
              emissive={WINDOW_COLOR}
              emissiveIntensity={0.4}
              roughness={0.2}
            />
          </mesh>
        ))
      )}
      {/* Brass canopy */}
      <mesh position={[0, 0.02, 0.16]}>
        <boxGeometry args={[0.24, 0.04, 0.04]} />
        <meshStandardMaterial color={BRASS_COLOR} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
