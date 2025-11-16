import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Class, Department } from '@/lib/blockchain';
import { slideUp } from '@/lib/animations';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; code: string; departmentId: string; semester: number; section: string }) => Promise<void>;
  departments: Department[];
  classData?: Class | null;
}

export default function ClassModal({ isOpen, onClose, onSave, departments, classData }: ClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    semester: 1,
    section: 'A',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        code: classData.code,
        departmentId: classData.departmentId,
        semester: classData.semester,
        section: classData.section,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        departmentId: departments[0]?.id || '',
        semester: 1,
        section: 'A',
      });
    }
    setErrors({});
  }, [classData, departments, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.code.trim()) newErrors.code = 'Class code is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (formData.semester < 1 || formData.semester > 8) newErrors.semester = 'Semester must be 1-8';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
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
      title={classData ? 'Edit Class' : 'Add New Class'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department Selection */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Department *
          </label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
          >
            <option value="" disabled>Select a department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id} className="bg-gray-900">
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.departmentId}
            </p>
          )}
        </motion.div>

        {/* Class Name */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Class Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            placeholder="e.g., Data Structures"
          />
          {errors.name && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Class Code */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Class Code *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all uppercase"
            placeholder="e.g., CS201"
          />
          {errors.code && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.code}
            </p>
          )}
        </motion.div>

        {/* Semester and Section */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={slideUp}>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">
              Semester *
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            />
            {errors.semester && (
              <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-neon-red rounded-full" />
                {errors.semester}
              </p>
            )}
          </motion.div>

          <motion.div variants={slideUp}>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">
              Section *
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all uppercase"
              placeholder="e.g., A"
              maxLength={2}
            />
            {errors.section && (
              <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-neon-red rounded-full" />
                {errors.section}
              </p>
            )}
          </motion.div>
        </div>

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
                <span>{classData ? 'Update' : 'Create'} Class</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
