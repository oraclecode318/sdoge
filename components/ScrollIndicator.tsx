'use client';

import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
    >
      <span className="text-yellow-400 text-sm font-medium uppercase tracking-wider">
        Scroll
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="text-yellow-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
}

