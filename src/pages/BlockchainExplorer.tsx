import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Box, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import PageTransition from '@/components/animations/PageTransition';
import { mockDepartments } from '@/lib/blockchain';
import { staggerContainer, staggerItem } from '@/lib/animations';

function BlockchainVisualization() {
  const departments = mockDepartments;
  
  return (
    <>
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf40bf" />
      
      {/* Department Blocks */}
      {departments.map((dept, i) => (
        <Float key={dept.id} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <Box
            args={[3, 3, 3]}
            position={[i * 8 - 8, 5, 0]}
          >
            <meshStandardMaterial
              color="#00f5ff"
              metalness={0.8}
              roughness={0.2}
              emissive="#00f5ff"
              emissiveIntensity={0.3}
            />
            <Html position={[0, 0, 2]} center>
              <div className="glass-card px-4 py-2 rounded-lg text-center whitespace-nowrap pointer-events-none">
                <div className="text-neon-cyan font-bold text-sm">{dept.name}</div>
                <div className="text-xs text-gray-400">{dept.code}</div>
              </div>
            </Html>
          </Box>
        </Float>
      ))}

      {/* Class Level Blocks */}
      {departments.map((dept, i) => (
        <Float key={`class-${dept.id}`} speed={1.5} rotationIntensity={0.2}>
          <Box
            args={[2, 2, 2]}
            position={[i * 8 - 8, 0, -3]}
          >
            <meshStandardMaterial
              color="#bf40bf"
              metalness={0.8}
              roughness={0.2}
              emissive="#bf40bf"
              emissiveIntensity={0.3}
            />
          </Box>
        </Float>
      ))}

      {/* Student Level Blocks */}
      {departments.map((dept, i) => (
        <Float key={`student-${dept.id}`} speed={1} rotationIntensity={0.1}>
          <Box
            args={[1.5, 1.5, 1.5]}
            position={[i * 8 - 8, -4, 0]}
          >
            <meshStandardMaterial
              color="#00ff88"
              metalness={0.8}
              roughness={0.2}
              emissive="#00ff88"
              emissiveIntensity={0.3}
            />
          </Box>
        </Float>
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxDistance={50}
        minDistance={10}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} intensity={1.5} levels={9} mipmapBlur />
      </EffectComposer>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full"
      />
    </div>
  );
}

export default function BlockchainExplorer() {
  const departments = mockDepartments;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl font-heading font-bold holographic-text">
            Blockchain Explorer
          </h1>
          <p className="text-gray-400">
            Interactive 3D Visualization of the Attendance Blockchain
          </p>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-2xl h-[600px] relative overflow-hidden"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
              <BlockchainVisualization />
            </Canvas>
          </Suspense>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 left-6 glass-card p-4 rounded-xl space-y-2"
          >
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-neon-cyan rounded"></div>
                <span>Departments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-neon-purple rounded"></div>
                <span>Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-neon-green rounded"></div>
                <span>Students</span>
              </div>
            </div>
          </motion.div>

          {/* Controls Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 right-6 glass-card p-4 rounded-xl space-y-1 text-sm"
          >
            <h3 className="font-semibold mb-2">Controls</h3>
            <p className="text-gray-400">🖱️ Drag to rotate</p>
            <p className="text-gray-400">🔍 Scroll to zoom</p>
            <p className="text-gray-400">👆 Click to explore</p>
          </motion.div>
        </motion.div>

        {/* Block Details */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-heading font-bold">{dept.name}</h3>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${dept.isValid ? 'bg-neon-green' : 'bg-neon-red'}`}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Blocks:</span>
                  <span className="text-neon-cyan font-semibold">{dept.blockchain.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain Status:</span>
                  <span className={dept.isValid ? 'text-neon-green' : 'text-neon-red'}>
                    {dept.isValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
                <div className="glass-card p-2 rounded font-mono text-xs">
                  <div className="text-gray-500 mb-1">Genesis Hash:</div>
                  <div className="text-neon-cyan truncate">
                    {dept.blockchain[0]?.hash.slice(0, 32)}...
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full glass-card py-2 rounded-lg text-neon-purple hover:bg-neon-purple/10 transition-colors"
              >
                View Full Chain →
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
