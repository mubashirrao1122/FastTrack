import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

interface StatusOrbProps {
  isValid: boolean;
  size?: number;
}

function AnimatedOrb({ isValid, size = 2 }: StatusOrbProps) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[size, 32, 32]}>
        <MeshDistortMaterial
          color={isValid ? '#00ff88' : '#ff0055'}
          metalness={1}
          roughness={0}
          distort={0.6}
          speed={5}
          emissive={isValid ? '#00ff88' : '#ff0055'}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Sparkles
        count={50}
        scale={size * 3}
        size={2}
        speed={0.4}
        color={isValid ? '#00ff88' : '#ff0055'}
      />
    </Float>
  );
}

export default function StatusOrb({ isValid, size }: StatusOrbProps) {
  return (
    <div className="w-full h-48">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedOrb isValid={isValid} size={size} />
      </Canvas>
    </div>
  );
}
