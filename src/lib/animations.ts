import type { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  },
  exit: { 
    opacity: 0, 
    y: -50,
    transition: { duration: 0.4 }
  }
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: 100, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    filter: 'blur(10px)',
    transition: { duration: 0.5 }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: { 
    scale: 1, 
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
  exit: { 
    scale: 0, 
    rotate: 180,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export const floatAnimation: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0,245,255,0.5)',
      '0 0 40px rgba(0,245,255,0.8)',
      '0 0 20px rgba(0,245,255,0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const rotateGlow: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -10,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: '0 0 30px rgba(0,245,255,0.8)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

export const sidebarVariants: Variants = {
  collapsed: { width: 80 },
  expanded: { width: 280 },
};

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 100
    }
  }),
  hover: { x: 8, scale: 1.05 },
  tap: { scale: 0.95 }
};

export const pageTransition: Variants = {
  initial: { opacity: 0, x: 100, filter: 'blur(10px)' },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    filter: 'blur(10px)',
    transition: {
      duration: 0.5
    }
  }
};

export const blockchainCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    rotateX: -15 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100 
    }
  },
  hover: { 
    y: -10, 
    rotateY: 5,
    boxShadow: '0 20px 60px rgba(0,245,255,0.4)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

export const miningAnimation: Variants = {
  idle: { scale: 1, rotate: 0 },
  mining: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    boxShadow: [
      '0 0 20px rgba(0,245,255,0.5)',
      '0 0 60px rgba(0,245,255,1)',
      '0 0 20px rgba(0,245,255,0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};
