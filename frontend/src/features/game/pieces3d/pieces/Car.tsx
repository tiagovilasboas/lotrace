import { useRef, type ReactElement } from 'react';
import * as THREE from 'three';
import { carColor } from '@/features/game/pieces3d/lib/piece-colors.ts';

type CarProps = {
  position: [number, number, number];
  playerID: string;
  rotation?: number; // Y rotation in radians
};

const WHEEL_COLOR  = new THREE.Color('#1c1917');
const HUB_COLOR    = new THREE.Color('#d6d3d1');
const GLASS_COLOR  = new THREE.Color('#7dd3fc');

/**
 * Car — arcade side-view vehicle.
 * Body: rounded box, Roof: smaller rounded box, Windows: glass plane,
 * Wheels: 4 cylinders.
 */
export function Car({ position, playerID, rotation = 0 }: CarProps): ReactElement {
  const color = carColor(playerID);
  const ref = useRef<THREE.Group>(null);

  const [x, y, z] = position;

  return (
    <group ref={ref} position={[x, y + 0.04, z]} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <boxGeometry args={[0.38, 0.1, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Roof/cabin */}
      <mesh position={[0.02, 0.17, 0]} castShadow>
        <boxGeometry args={[0.2, 0.09, 0.17]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.11, 0.18, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.09, 0.07]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={0.82}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wheels — 4 cylinders */}
      {(
        [
          [0.12, 0, 0.11],
          [0.12, 0, -0.11],
          [-0.12, 0, 0.11],
          [-0.12, 0, -0.11],
        ] as [number, number, number][]
      ).map(([wx, wy, wz], i) => (
        <group key={i} position={[wx, wy, wz]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 12]} />
            <meshStandardMaterial color={WHEEL_COLOR} roughness={0.9} />
          </mesh>
          {/* Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.021]}>
            <cylinderGeometry args={[0.018, 0.018, 0.005, 8]} />
            <meshStandardMaterial color={HUB_COLOR} roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Ground shadow disc */}
      <mesh position={[0, -0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}
