import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PageTransition from '@/components/animations/PageTransition';
import MagneticButton from '@/components/animations/MagneticButton';
import { mockStudents, mockClasses } from '@/lib/blockchain';
import type { Student } from '@/lib/blockchain';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function MarkAttendance() {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMining, setIsMining] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const studentsInClass = mockStudents.filter(s => s.classId === selectedClass);

  const toggleAttendance = (studentId: string) => {
    const currentStatus = attendanceMap[studentId] || 'absent';
    const newStatus = currentStatus === 'present' ? 'absent' : 
                      currentStatus === 'absent' ? 'late' : 'present';
    setAttendanceMap({ ...attendanceMap, [studentId]: newStatus });
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setIsMining(true);
    
    // Simulate mining
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsMining(false);
    
    toast.success('Attendance recorded on blockchain! 🎉', {
      duration: 4000,
    });
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-heading font-bold text-neon-yellow"
        >
          Mark Attendance
        </motion.h1>

        {/* Selection Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full glass-card px-4 py-3 rounded-xl border border-white/10 focus:border-neon-cyan/50 outline-none transition-all"
              >
                <option value="">Choose a class...</option>
                {mockClasses.map(cls => (
                  <option key={cls.id} value={cls.id} className="bg-cyber-dark">
                    {cls.name} ({cls.departmentName})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full glass-card px-4 py-3 rounded-xl border border-white/10 focus:border-neon-cyan/50 outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Students Grid */}
        {selectedClass && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedClass}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">
                  Students ({studentsInClass.length})
                </h2>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neon-green"></div>
                    <span className="text-gray-400">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neon-red"></div>
                    <span className="text-gray-400">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-neon-yellow"></div>
                    <span className="text-gray-400">Late</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {studentsInClass.map((student: Student) => {
                  const status = attendanceMap[student.id] || 'absent';
                  
                  return (
                    <motion.div
                      key={student.id}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAttendance(student.id)}
                      className={`
                        glass-card p-4 rounded-xl cursor-pointer
                        border-2 transition-all
                        ${status === 'present' ? 'border-neon-green bg-neon-green/10' : ''}
                        ${status === 'absent' ? 'border-neon-red bg-neon-red/10' : ''}
                        ${status === 'late' ? 'border-neon-yellow bg-neon-yellow/10' : ''}
                      `}
                    >
                      {/* Avatar */}
                      <motion.div
                        className={`
                          w-12 h-12 mx-auto mb-2 rounded-full
                          flex items-center justify-center font-bold
                          ${status === 'present' ? 'bg-neon-green/20 text-neon-green' : ''}
                          ${status === 'absent' ? 'bg-neon-red/20 text-neon-red' : ''}
                          ${status === 'late' ? 'bg-neon-yellow/20 text-neon-yellow' : ''}
                        `}
                        animate={{
                          boxShadow: status === 'present' 
                            ? ['0 0 0 rgba(0,255,136,0)', '0 0 20px rgba(0,255,136,0.5)', '0 0 0 rgba(0,255,136,0)']
                            : undefined
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {status === 'present' ? '✓' : status === 'late' ? '⚠' : '✗'}
                      </motion.div>

                      <div className="text-center">
                        <p className="font-semibold text-sm truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{student.rollNumber}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Submit Button */}
        {selectedClass && studentsInClass.length > 0 && !isMining && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <MagneticButton
              onClick={handleSubmit}
              className="glass-card px-8 py-4 rounded-2xl flex items-center gap-3 text-lg font-semibold border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 border-2 transition-all animate-pulse-glow"
            >
              <Save size={24} />
              <span>Save to Blockchain</span>
            </MagneticButton>
          </motion.div>
        )}
        
        {isMining && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-3 text-lg font-semibold border-gray-500 text-gray-400 border-2">
              <Loader2 className="animate-spin" size={24} />
              <span>Mining Block...</span>
            </div>
          </motion.div>
        )}

        {!selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">Select a class to mark attendance</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
