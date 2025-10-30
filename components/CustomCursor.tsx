'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isVisible, setIsVisible] = useState(true);
  
  // Slight delay with spring animation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Hide dogecoin icon in header (top ~70px) and ticker (bottom ~70px) areas
      const isInHeader = e.clientY < 70;
      const isInTicker = e.clientY > window.innerHeight - 70;
      
      setIsVisible(!isInHeader && !isInTicker);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        position: 'fixed',
        width: '32px',
        height: '32px',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Image
        src="/image/cursor.png"
        alt="Dogecoin cursor"
        width={72}
        height={72}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </motion.div>
  );
}

