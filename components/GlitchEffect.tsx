'use client';

import React, { useEffect, useState, useRef } from 'react';

interface GlitchEffectProps {
  intensity?: number;
}

export default function GlitchEffect({ intensity = 1 }: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchType, setGlitchType] = useState<'rgb' | 'shift' | 'flow' | 'scan' | 'all'>('all');
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const triggerGlitch = () => {
      // Only TV rectangle artifacts and static noise
      setGlitchType('all');
      
      // Trigger glitch
      setIsGlitching(true);
      
      // Random duration between 200ms to 800ms (longer for more noticeable effect)
      const glitchDuration = Math.floor(Math.random() * 600) + 200;
      
      setTimeout(() => {
        setIsGlitching(false);
      }, glitchDuration);
      
      // Schedule next glitch randomly between 4-10 seconds
      const nextGlitchDelay = Math.floor(Math.random() * 6000) + 4000;
      timeoutRef.current = setTimeout(triggerGlitch, nextGlitchDelay);
    };

    // Start the glitch cycle
    const initialDelay = Math.floor(Math.random() * 6000) + 4000;
    timeoutRef.current = setTimeout(triggerGlitch, initialDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isGlitching) return null;

  return (
    <>
      <style jsx>{`
        @keyframes glitch-blocks {
          0% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
          20% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
          40% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
          60% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
          80% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
          100% {
            clip-path: inset(${Math.random() * 80}% 0 ${Math.random() * 20}% 0);
          }
        }
      `}</style>

      {/* Static Noise Overlay */}
      {glitchType === 'all' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9997,
            pointerEvents: 'none',
            opacity: 0.4,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.3) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.3) 3px
            ), repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 0px,
              transparent 1px,
              transparent 2px,
              rgba(255, 255, 255, 0.08) 3px
            )`,
            animation: 'glitch-blocks 0.1s steps(1) infinite',
          }}
        />
      )}
    </>
  );
}

