import { type ReactElement } from 'react';
import * as THREE from 'three';

type StationProps = { position: [number, number, number] };

const STONE_LIGHT = new THREE.Color('#d2cfc9');
const STONE_DARK  = new THREE.Color('#9e9894');
const STONE_BASE  = new THREE.Color('#6e6560');
const CLOCK_COLOR = new THREE.Color('#f2f0ec');

/**
 * Station — railway building: main hall + clock tower + platform.
 */
export function Station({ position }: StationProps): ReactElement {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Platform base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.44, 0.04, 0.34]} />
        <meshStandardMaterial color={STONE_BASE} roughness={0.9} />
      </mesh>
      {/* Main hall */}
      <mesh position={[-0.04, 0.14, 0]} castShadow>
        <boxGeometry args={[0.3, 0.24, 0.28]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.85} />
      </mesh>
      {/* Hall roof */}
      <mesh position={[-0.04, 0.27, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0, 0.22, 0.1, 4, 1]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Clock tower */}
      <mesh position={[0.14, 0.22, 0]} castShadow>
        <boxGeometry args={[0.13, 0.4, 0.13]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.85} />
      </mesh>
      {/* Tower roof */}
      <mesh position={[0.14, 0.43, 0]}>
        <cylinderGeometry args={[0, 0.1, 0.1, 4, 1]} />
        <meshStandardMaterial color={STONE_BASE} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0.08, 0.27, 0]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color={CLOCK_COLOR} roughness={0.3} />
      </mesh>
    </group>
  );
}
