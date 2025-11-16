import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { modalVariants } from '@/lib/animations';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const colors = {
    danger: {
      icon: 'text-neon-red',
      bg: 'bg-neon-red/10',
      border: 'border-neon-red/30',
      button: 'bg-neon-red hover:bg-neon-red/80',
      shadow: 'shadow-[0_0_30px_rgba(255,0,85,0.5)]',
    },
    warning: {
      icon: 'text-neon-yellow',
      bg: 'bg-neon-yellow/10',
      border: 'border-neon-yellow/30',
      button: 'bg-neon-yellow hover:bg-neon-yellow/80',
      shadow: 'shadow-[0_0_30px_rgba(255,204,0,0.5)]',
    },
    info: {
      icon: 'text-neon-cyan',
      bg: 'bg-neon-cyan/10',
      border: 'border-neon-cyan/30',
      button: 'bg-neon-cyan hover:bg-neon-cyan/80',
      shadow: 'shadow-[0_0_30px_rgba(0,245,255,0.5)]',
    },
  };

  const theme = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`glass-card border-2 ${theme.border} rounded-2xl w-full max-w-md pointer-events-auto ${theme.shadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className={`w-16 h-16 rounded-full ${theme.bg} border-2 ${theme.border} flex items-center justify-center mx-auto mb-4`}
                >
                  <AlertTriangle className={theme.icon} size={32} />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-heading font-bold text-white text-center mb-3">
                  {title}
                </h3>

                {/* Message */}
                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                  {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold glass-card hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelText}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onConfirm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 ${theme.button} rounded-lg font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles size={18} />
                        </motion.div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{confirmText}</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
