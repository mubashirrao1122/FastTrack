import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Search, Users } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import MagneticButton from '@/components/animations/MagneticButton';
import StatusOrb from '@/components/3d/StatusOrb';
import type { Student } from '@/lib/blockchain';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useApp } from '@/context/AppContext';
import StudentModal from '@/components/modals/StudentModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function Students() {
  const { state, addStudent, updateStudent, deleteStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null,
  });

  const filteredStudents = state.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    rollNumber: string;
    email: string;
    departmentId: string;
    classId: string;
    phone: string;
  }) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, data);
    } else {
      await addStudent(data);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setDeleteDialog({ isOpen: true, student });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.student) {
      await deleteStudent(deleteDialog.student.id);
      setDeleteDialog({ isOpen: false, student: null });
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-neon-green';
    if (percentage >= 50) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-heading font-bold text-neon-cyan"
          >
            Students
          </motion.h1>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-card pl-12 pr-4 py-3 rounded-xl w-64 text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 transition-all"
              />
            </div>

            <MagneticButton
              onClick={handleAdd}
              className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 text-neon-green border border-neon-green/50 hover:bg-neon-green/10 transition-all"
            >
              <Plus size={20} />
              <span className="font-semibold">Add Student</span>
            </MagneticButton>
          </div>
        </div>

        {/* Loading */}
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
        {!state.loading && filteredStudents.length === 0 && searchQuery === '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-2xl text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-cyan/10 flex items-center justify-center">
              <Users size={48} className="text-neon-cyan" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">No Students Yet</h3>
            <p className="text-gray-400 mb-6">Add your first student to get started</p>
            <MagneticButton
              onClick={handleAdd}
              className="glass-card px-6 py-3 rounded-xl inline-flex items-center gap-2 text-neon-green border border-neon-green/50 hover:bg-neon-green/10 transition-all"
            >
              <Plus size={20} />
              <span className="font-semibold">Add Student</span>
            </MagneticButton>
          </motion.div>
        )}

        {/* Students Grid */}
        {!state.loading && filteredStudents.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden"
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <StatusOrb isValid={student.attendancePercentage >= 75} size={0.5} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-heading font-bold text-white truncate">
                        {student.name}
                      </h3>
                      <p className="text-neon-cyan font-mono text-sm">{student.rollNumber}</p>
                      <p className="text-gray-400 text-xs truncate">{student.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Class:</span>
                      <span className="text-white font-semibold truncate ml-2">{student.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Department:</span>
                      <span className="text-white font-semibold truncate ml-2">{student.departmentName}</span>
                    </div>
                  </div>

                  <div className="glass-card p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Attendance:</span>
                      <span className={`font-bold ${getAttendanceColor(student.attendancePercentage)}`}>
                        {student.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${student.attendancePercentage}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${
                          student.attendancePercentage >= 75
                            ? 'bg-neon-green'
                            : student.attendancePercentage >= 50
                            ? 'bg-neon-yellow'
                            : 'bg-neon-red'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(student)}
                      className="flex-1 glass-card py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                    >
                      <Edit size={16} />
                      <span className="text-sm font-semibold">Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteClick(student)}
                      className="flex-1 glass-card py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-neon-red hover:bg-neon-red/10 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-semibold">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        departments={state.departments}
        classes={state.classes}
        student={selectedStudent}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, student: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Student?"
        message={`Are you sure you want to delete "${deleteDialog.student?.name}"? This will remove all their attendance records from the blockchain. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={state.loading}
      />
    </PageTransition>
  );
}
