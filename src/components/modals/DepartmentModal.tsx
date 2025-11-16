import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Department } from '@/lib/blockchain';
import { slideUp } from '@/lib/animations';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; code: string; description: string; hod: string }) => Promise<void>;
  department?: Department | null;
}

export default function DepartmentModal({ isOpen, onClose, onSave, department }: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hod: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        code: department.code,
        description: department.description,
        hod: department.hod,
      });
    } else {
      setFormData({ name: '', code: '', description: '', hod: '' });
    }
    setErrors({});
  }, [department, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.code.trim()) newErrors.code = 'Department code is required';
    if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'Code must be 2-10 characters';
    }
    if (!formData.hod.trim()) newErrors.hod = 'Head of Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={department ? 'Edit Department' : 'Add New Department'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department Name */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Department Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            placeholder="e.g., Computer Science"
          />
          {errors.name && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Department Code */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Department Code *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all uppercase"
            placeholder="e.g., CS"
            maxLength={10}
          />
          {errors.code && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.code}
            </p>
          )}
        </motion.div>

        {/* Head of Department */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Head of Department *
          </label>
          <input
            type="text"
            value={formData.hod}
            onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            placeholder="e.g., Dr. John Smith"
          />
          {errors.hod && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.hod}
            </p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all resize-none"
            placeholder="Brief description of the department..."
            rows={3}
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 rounded-lg font-semibold glass-card hover:bg-white/10 transition-all"
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-linear-to-r from-neon-cyan to-neon-purple rounded-lg font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,245,255,0.5)] hover:shadow-[0_0_40px_rgba(0,245,255,0.7)] transition-all"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={18} />
                </motion.div>
                <span>Mining Block...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{department ? 'Update' : 'Create'} Department</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
