import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Building2 } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MagneticButton from '@/components/animations/MagneticButton';
import StatusOrb from '@/components/3d/StatusOrb';
import type { Department } from '@/lib/blockchain';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useApp } from '@/context/AppContext';
import DepartmentModal from '@/components/modals/DepartmentModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function Departments() {
  const { state, addDepartment, updateDepartment, deleteDepartment } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; department: Department | null }>({
    isOpen: false,
    department: null,
  });

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsModalOpen(true);
  };

  const handleSave = async (data: { name: string; code: string; description: string; hod: string }) => {
    if (selectedDepartment) {
      await updateDepartment(selectedDepartment.id, data);
    } else {
      await addDepartment(data);
    }
  };

  const handleDeleteClick = (dept: Department) => {
    setDeleteDialog({ isOpen: true, department: dept });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.department) {
      await deleteDepartment(deleteDialog.department.id);
      setDeleteDialog({ isOpen: false, department: null });
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-heading font-bold text-neon-cyan"
          >
            Departments
          </motion.h1>
          
          <MagneticButton
            onClick={handleAdd}
            className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 text-neon-green border border-neon-green/50 hover:bg-neon-green/10 transition-all"
          >
            <Plus size={20} />
            <span className="font-semibold">Add Department</span>
          </MagneticButton>
        </div>

        {/* Loading State */}
        {state.loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Empty State */}
        {!state.loading && state.departments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-2xl text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-cyan/10 flex items-center justify-center">
              <Building2 size={48} className="text-neon-cyan" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">No Departments Yet</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first department to the blockchain</p>
            <MagneticButton
              onClick={handleAdd}
              className="glass-card px-6 py-3 rounded-xl inline-flex items-center gap-2 text-neon-green border border-neon-green/50 hover:bg-neon-green/10 transition-all"
            >
              <Plus size={20} />
              <span className="font-semibold">Add Department</span>
            </MagneticButton>
          </motion.div>
        )}

        {/* Departments Grid */}
        {!state.loading && state.departments.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {state.departments.map((dept) => (
              <motion.div
                key={dept.id}
                variants={staggerItem}
                whileHover={{ y: -10, rotateY: 5 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden perspective-1000 transform-3d"
              >
                {/* Holographic Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-50"
                  animate={{
                    background: [
                      'linear-gradient(0deg, transparent, rgba(0,245,255,0.3), transparent)',
                      'linear-gradient(360deg, transparent, rgba(0,245,255,0.3), transparent)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-white">
                        {dept.name}
                      </h3>
                      <p className="text-neon-cyan font-mono text-sm">{dept.code}</p>
                    </div>
                    
                    {/* Status Orb */}
                    <div className="w-16 h-16 -mt-2">
                      <StatusOrb isValid={dept.isValid} size={0.5} />
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{dept.description}</p>

                  {/* HOD Info */}
                  <div className="text-sm">
                    <span className="text-gray-400">Head: </span>
                    <span className="text-white font-semibold">{dept.hod}</span>
                  </div>

                  {/* Blockchain Info */}
                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Blocks:</span>
                      <span className="text-neon-cyan font-semibold">{dept.blockchain.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <motion.span
                        className={`font-semibold ${dept.isValid ? 'text-neon-green' : 'text-neon-red'}`}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {dept.isValid ? '✓ Valid' : '✗ Invalid'}
                      </motion.span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Hash: {dept.blockchain[0]?.hash.slice(0, 16)}...
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(dept)}
                      className="flex-1 glass-card py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                    >
                      <Edit size={16} />
                      <span className="text-sm font-semibold">Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteClick(dept)}
                      className="flex-1 glass-card py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-neon-red hover:bg-neon-red/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-semibold">Delete</span>
                    </motion.button>
                  </div>
                </div>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ boxShadow: '0 0 20px rgba(0,245,255,0.2)' }}
                  whileHover={{ boxShadow: '0 0 60px rgba(0,245,255,0.4)' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        department={selectedDepartment}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, department: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Department?"
        message={`Are you sure you want to delete "${deleteDialog.department?.name}"? This will also remove all associated classes and students from the blockchain. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={state.loading}
      />
    </PageTransition>
  );
}

