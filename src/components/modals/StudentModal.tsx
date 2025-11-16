import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Student, Department, Class } from '@/lib/blockchain';
import { slideUp } from '@/lib/animations';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    rollNumber: string;
    email: string;
    departmentId: string;
    classId: string;
    phone: string;
  }) => Promise<void>;
  departments: Department[];
  classes: Class[];
  student?: Student | null;
}

export default function StudentModal({ isOpen, onClose, onSave, departments, classes, student }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    departmentId: '',
    classId: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter classes based on selected department
  const filteredClasses = formData.departmentId
    ? classes.filter((c) => c.departmentId === formData.departmentId)
    : classes;

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        departmentId: student.departmentId,
        classId: student.classId,
        phone: student.phone,
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        departmentId: departments[0]?.id || '',
        classId: '',
        phone: '',
      });
    }
    setErrors({});
  }, [student, departments, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.classId) newErrors.classId = 'Class is required';
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
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
      title={student ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Name */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            placeholder="e.g., John Doe"
          />
          {errors.name && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Roll Number and Email */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={slideUp}>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">
              Roll Number *
            </label>
            <input
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
              placeholder="e.g., 2024001"
            />
            {errors.rollNumber && (
              <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-neon-red rounded-full" />
                {errors.rollNumber}
              </p>
            )}
          </motion.div>

          <motion.div variants={slideUp}>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
              placeholder="e.g., john@example.com"
            />
            {errors.email && (
              <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-neon-red rounded-full" />
                {errors.email}
              </p>
            )}
          </motion.div>
        </div>

        {/* Phone */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            placeholder="e.g., +1 234 567 8900"
          />
          {errors.phone && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.phone}
            </p>
          )}
        </motion.div>

        {/* Department Selection */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Department *
          </label>
          <select
            value={formData.departmentId}
            onChange={(e) => {
              setFormData({ ...formData, departmentId: e.target.value, classId: '' });
            }}
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

        {/* Class Selection */}
        <motion.div variants={slideUp}>
          <label className="block text-sm font-semibold text-neon-cyan mb-2">
            Class *
          </label>
          <select
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
            disabled={!formData.departmentId}
          >
            <option value="" disabled>
              {formData.departmentId ? 'Select a class' : 'Select department first'}
            </option>
            {filteredClasses.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-gray-900">
                {cls.name} ({cls.code}) - Sem {cls.semester} {cls.section}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-neon-red text-sm mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-neon-red rounded-full" />
              {errors.classId}
            </p>
          )}
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
                <span>{student ? 'Update' : 'Create'} Student</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
