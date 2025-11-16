import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function FastTrack3D() {
  const textRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      textRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
      
      const material = textRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      }
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.4}
      >
        <Center>
          <Text3D
            ref={textRef}
            font="/fonts/helvetiker_bold.typeface.json"
            size={1.5}
            height={0.4}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.03}
            bevelOffset={0}
            bevelSegments={8}
          >
            FastTrack
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.1}
            />
          </Text3D>
        </Center>

        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={1.54}
            height={0.4}
            curveSegments={32}
          >
            FastTrack
            <meshBasicMaterial
              color="#00f5ff"
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </Text3D>
        </Center>
      </Float>

      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#bf40bf" />
      <pointLight position={[0, -5, 5]} intensity={0.8} color="#00ff88" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#00f5ff"
        castShadow
      />
      
      <group ref={particlesRef} rotation-y={0}>
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = (i / 50) * Math.PI * 2;
          const radius = 8 + Math.random() * 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 8;
          
          return (
            <mesh
              key={i}
              position={[x, y, z]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial
                color={['#00f5ff', '#bf40bf', '#00ff88'][i % 3]}
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

