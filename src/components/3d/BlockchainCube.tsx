import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text } from '@react-three/drei';
import type { Mesh } from 'three';

interface BlockchainCubeProps {
  value: string | number;
  label: string;
  color?: string;
  position?: [number, number, number];
}

function RotatingCube({ value, label, color = '#00f5ff', position = [0, 0, 0] }: BlockchainCubeProps) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[2, 2, 2]} />
        <MeshDistortMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
      <Text
        position={[position[0], position[1] - 1.5, position[2]]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[position[0], position[1] - 2, position[2]]}
        fontSize={0.6}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron-bold.woff"
      >
        {value}
      </Text>
    </Float>
  );
}

export default function BlockchainCube({ value, label, color, position }: BlockchainCubeProps) {
  return (
    <div className="w-full h-64">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />
        <RotatingCube value={value} label={label} color={color} position={position} />
      </Canvas>
    </div>
  );
}
