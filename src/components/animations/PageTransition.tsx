import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
