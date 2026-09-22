import { type ReactElement } from 'react';
import * as THREE from 'three';

type GoArchProps = { position: [number, number, number] };

const PILLAR_DARK  = new THREE.Color('#125028');
const PILLAR_LIGHT = new THREE.Color('#1e8040');
const BEAM_COLOR   = new THREE.Color('#38c060');
const BRASS_COLOR  = new THREE.Color('#f0b83f');

/**
 * GoArch — finish-line arch: two pillars + horizontal beam + brass stripe.
 */
export function GoArch({ position }: GoArchProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Left pillar */}
      <mesh position={[-0.15, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.36, 0.08]} />
        <meshStandardMaterial color={PILLAR_LIGHT} roughness={0.8} />
      </mesh>
      <mesh position={[-0.19, 0.18, 0]}>
        <boxGeometry args={[0.005, 0.36, 0.08]} />
        <meshStandardMaterial color={PILLAR_DARK} roughness={0.85} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[0.15, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.36, 0.08]} />
        <meshStandardMaterial color={PILLAR_LIGHT} roughness={0.8} />
      </mesh>
      <mesh position={[0.19, 0.18, 0]}>
        <boxGeometry args={[0.005, 0.36, 0.08]} />
        <meshStandardMaterial color={PILLAR_DARK} roughness={0.85} />
      </mesh>

      {/* Horizontal beam */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.42, 0.07, 0.08]} />
        <meshStandardMaterial color={BEAM_COLOR} roughness={0.75} />
      </mesh>
      {/* Beam top face */}
      <mesh position={[0, 0.415, 0]}>
        <boxGeometry args={[0.42, 0.005, 0.08]} />
        <meshStandardMaterial color={new THREE.Color('#52d870')} roughness={0.7} />
      </mesh>
      {/* Brass stripe */}
      <mesh position={[0, 0.38, 0.041]}>
        <planeGeometry args={[0.42, 0.025]} />
        <meshStandardMaterial color={BRASS_COLOR} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
