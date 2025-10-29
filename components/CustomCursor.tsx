'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    let trailId = 0;
    let movementTimer: NodeJS.Timeout;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      setIsMoving(true);
      
      // Add light trail
      const newTrail = {
        id: trailId++,
        x: e.clientX,
        y: e.clientY,
      };
      
      setTrails((prev) => [...prev, newTrail].slice(-8)); // Keep last 8 trails
      
      // Remove trail after animation
      setTimeout(() => {
        setTrails((prev) => prev.filter((t) => t.id !== newTrail.id));
      }, 800);

      clearTimeout(movementTimer);
      movementTimer = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clearTimeout(movementTimer);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Light trails */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: trail.x,
            top: trail.y,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 237, 78, 0.6) 0%, rgba(255, 237, 78, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 9998,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(4px)',
          }}
        />
      ))}

      {/* Main cursor circle with centered dot */}
      <motion.div
        ref={cursorRef}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 237, 78, 0.8)',
          backgroundColor: 'rgba(255, 237, 78, 0.1)',
          pointerEvents: 'none',
          zIndex: 9999,
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          boxShadow: isMoving 
            ? '0 0 20px rgba(255, 237, 78, 0.8), 0 0 40px rgba(255, 237, 78, 0.4), inset 0 0 10px rgba(255, 237, 78, 0.3)'
            : '0 0 10px rgba(255, 237, 78, 0.4), inset 0 0 5px rgba(255, 237, 78, 0.2)',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* Inner glow when moving */}
        {isMoving && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 237, 78, 0.4) 0%, transparent 70%)',
            }}
          />
        )}
        
        {/* Cursor dot center - now inside the circle */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 237, 78, 1)',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 5px rgba(255, 237, 78, 0.8)',
          }}
        />
      </motion.div>
    </>
  );
}

