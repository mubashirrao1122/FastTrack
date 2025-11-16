import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, Calendar } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import BlockchainCube from '@/components/3d/BlockchainCube';
import FastTrack3D from '@/components/3d/FastTrack3D';
import PageTransition from '@/components/animations/PageTransition';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useApp } from '@/context/AppContext';

export default function Dashboard() {
  const { state } = useApp();

  const totalPresent = state.students.reduce((sum, s) => sum + s.totalPresent, 0);
  const totalRecords = state.students.reduce((sum, s) => sum + s.totalPresent + s.totalAbsent + s.totalLate, 0);
  const attendanceRate = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : '0.0';

  const stats = [
    {
      label: 'Total Students',
      value: state.students.length,
      icon: <Users className="w-8 h-8" />,
      color: '#00f5ff',
      change: '+12.5%',
    },
    {
      label: 'Departments',
      value: state.departments.length,
      icon: <Building2 className="w-8 h-8" />,
      color: '#bf40bf',
      change: '+8.2%',
    },
    {
      label: 'Active Classes',
      value: state.classes.length,
      icon: <Calendar className="w-8 h-8" />,
      color: '#00ff88',
      change: '+15.3%',
    },
    {
      label: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: '#ffcc00',
      change: '+2.1%',
    },
  ];
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* 3D FastTrack Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative h-[400px] rounded-3xl overflow-hidden glass-card border-2 border-neon-cyan/30"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-black via-gray-900 to-black" />
          
          {/* Animated grid pattern */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <FastTrack3D />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Canvas>

          {/* Subtitle overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-0 right-0 text-center z-10"
          >
            <p className="text-2xl text-neon-cyan font-body font-semibold mb-2">
              Blockchain-Powered Attendance
            </p>
            <p className="text-lg text-gray-400">
              Decentralized • Immutable • Transparent
            </p>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-2xl" />
          <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-neon-purple/50 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-neon-green/50 rounded-bl-2xl" />
          <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-neon-yellow/50 rounded-br-2xl" />
        </motion.div>

        {/* Stats Grid with 3D Cubes */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover="hover"
              initial="rest"
              className="glass-card p-6 rounded-2xl relative overflow-hidden perspective-1000"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    `radial-gradient(circle at 0% 0%, ${stat.color}40 0%, transparent 50%)`,
                    `radial-gradient(circle at 100% 100%, ${stat.color}40 0%, transparent 50%)`,
                    `radial-gradient(circle at 0% 0%, ${stat.color}40 0%, transparent 50%)`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    style={{ color: stat.color }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.change}
                  </motion.span>
                </div>

                <div>
                  <motion.p
                    className="text-5xl font-heading font-bold mb-2"
                    style={{ color: stat.color }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>

                {/* 3D Visual Indicator */}
                <div className="h-24 -mb-6 -mx-6">
                  <BlockchainCube
                    value={stat.value}
                    label=""
                    color={stat.color}
                    position={[0, 0, 0]}
                  />
                </div>
              </div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: `0 0 40px ${stat.color}00`,
                }}
                whileHover={{
                  boxShadow: `0 0 40px ${stat.color}60`,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-heading font-bold mb-6 text-neon-cyan">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Mark Attendance', path: '/attendance', color: '#00ff88' },
              { label: 'View Students', path: '/students', color: '#00f5ff' },
              { label: 'Explore Blockchain', path: '/explorer', color: '#bf40bf' },
            ].map((action, i) => (
              <motion.a
                key={action.label}
                href={action.path}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="glass-card p-6 rounded-xl text-center cursor-pointer group"
              >
                <motion.p
                  className="text-xl font-heading font-semibold"
                  style={{ color: action.color }}
                >
                  {action.label}
                </motion.p>
                <motion.div
                  className="mt-4 h-1 rounded-full"
                  style={{ backgroundColor: action.color }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h2 className="text-3xl font-heading font-bold mb-6 text-neon-purple">
            Recent Blockchain Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="glass-card p-4 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <motion.div
                    className="w-6 h-6 rounded-full bg-neon-green"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Block #{1234 + i} mined</p>
                  <p className="text-sm text-gray-400">Attendance recorded for CS-A Section</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neon-cyan font-mono">0x4a3b...f92c</p>
                  <p className="text-xs text-gray-500">{i + 2} minutes ago</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
