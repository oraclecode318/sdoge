'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Slight delay with spring animation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        position: 'fixed',
        width: '24px',
        height: '24px',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Image
        src="/image/doge.jpg"
        alt="Dogecoin cursor"
        width={24}
        height={24}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </motion.div>
  );
}

