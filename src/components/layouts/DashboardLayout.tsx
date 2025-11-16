import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ClipboardCheck, 
  Network,
  Menu,
  X
} from 'lucide-react';
import ParticleNetwork from '../3d/ParticleNetwork';
import { sidebarVariants, menuItemVariants } from '@/lib/animations';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} />, path: '/' },
  { id: 'departments', label: 'Departments', icon: <Building2 size={24} />, path: '/departments' },
  { id: 'students', label: 'Students', icon: <Users size={24} />, path: '/students' },
  { id: 'attendance', label: 'Mark Attendance', icon: <ClipboardCheck size={24} />, path: '/attendance' },
  { id: 'explorer', label: 'Blockchain Explorer', icon: <Network size={24} />, path: '/explorer' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cyber-darker text-white relative overflow-hidden">
      {/* Animated Background */}
      <ParticleNetwork />
      
      {/* Gradient Mesh */}
      <motion.div
        className="absolute inset-0 opacity-30 -z-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0,245,255,0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(191,64,191,0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(0,255,136,0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0,245,255,0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen glass-card border-r-2 border-r-neon-cyan/30 z-50"
      >
        <div className="p-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 mb-12"
            animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-2xl font-bold">
              F
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-2xl font-heading font-bold holographic-text"
              >
                FastTrack
              </motion.span>
            )}
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.id} to={item.path}>
                  <motion.div
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    className={`
                      relative flex items-center gap-3 p-3 rounded-lg
                      transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                        : 'hover:bg-white/10 text-gray-300'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-full bg-neon-cyan rounded-r"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {isActive && !isCollapsed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-neon-cyan animate-pulse"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 p-2 rounded-lg bg-neon-cyan/20 hover:bg-neon-cyan/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen p-8 custom-scrollbar overflow-y-auto"
      >
        {children}
      </motion.main>
    </div>
  );
}
