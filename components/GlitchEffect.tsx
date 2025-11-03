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
      // Random glitch type
      const types: Array<'rgb' | 'shift' | 'flow' | 'scan' | 'all'> = ['shift', 'flow', 'scan', 'all'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setGlitchType(randomType);
      
      // Trigger glitch
      setIsGlitching(true);
      
      // Random duration between 100ms to 600ms
      const glitchDuration = Math.floor(Math.random() * 500) + 100;
      
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

  const shiftAmount = Math.floor(Math.random() * 80 + 40) * intensity;
  const scanLinePosition = Math.floor(Math.random() * 100);

  return (
    <>
      <style jsx>{`
        @keyframes glitch-rgb {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px);
          }
          40% {
            transform: translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px);
          }
          60% {
            transform: translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px);
          }
          80% {
            transform: translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitch-scan {
          0% {
            top: ${scanLinePosition}%;
          }
          100% {
            top: ${scanLinePosition + 10}%;
          }
        }

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

      {/* Short Horizontal Shift Lines */}
      {(glitchType === 'shift' || glitchType === 'all') && (
        <>
          {[...Array(12)].map((_, i) => {
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 70;
            const randomWidth = Math.random() * 20 + 10; // 10-30% width
            const randomHeight = Math.random() * 3 + 1; // 1-4% height
            const randomShift = (Math.random() - 0.5) * 20;
            return (
              <div
                key={`shift-${i}`}
                style={{
                  position: 'fixed',
                  top: `${randomTop}%`,
                  left: `${randomLeft}%`,
                  width: `${randomWidth}%`,
                  height: `${randomHeight}%`,
                  zIndex: 9999,
                  pointerEvents: 'none',
                  background: `rgba(255, 255, 255, 0.4)`,
                  transform: `translateX(${randomShift}px)`,
                  boxShadow: `0 0 10px rgba(255, 255, 255, 0.6)`,
                }}
              />
            );
          })}
        </>
      )}

      {/* Flow/Scan Lines */}
      {(glitchType === 'flow' || glitchType === 'scan' || glitchType === 'all') && (
        <>
          <div
            style={{
              position: 'fixed',
              top: `${scanLinePosition}%`,
              left: 0,
              width: '100%',
              height: '4px',
              zIndex: 9999,
              pointerEvents: 'none',
              background: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.6)',
              animation: 'glitch-scan 0.1s linear infinite',
            }}
          />
          {[...Array(6)].map((_, i) => (
            <div
              key={`flow-${i}`}
              style={{
                position: 'fixed',
                top: `${Math.random() * 100}%`,
                left: 0,
                width: '100%',
                height: '2px',
                zIndex: 9999,
                pointerEvents: 'none',
                background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
                boxShadow: `0 0 10px rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`,
              }}
            />
          ))}
        </>
      )}

      {/* Small Rectangle TV Glitch Artifacts */}
      {(glitchType === 'all' || glitchType === 'shift') && (
        <>
          {[...Array(20)].map((_, i) => {
            const randomLeft = Math.random() * 95;
            const randomTop = Math.random() * 95;
            const randomWidth = Math.random() * 8 + 2; // 2-10% width (small)
            const randomHeight = Math.random() * 6 + 2; // 2-8% height (small)
            const randomColor = Math.random() > 0.5 ? 
              `rgba(${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, 0.7)` : // White-ish
              `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, 0.8)`; // Dark
            return (
              <div
                key={`block-${i}`}
                style={{
                  position: 'fixed',
                  top: `${randomTop}%`,
                  left: `${randomLeft}%`,
                  width: `${randomWidth}%`,
                  height: `${randomHeight}%`,
                  zIndex: 9999,
                  pointerEvents: 'none',
                  background: randomColor,
                  mixBlendMode: 'overlay',
                  animation: 'glitch-blocks 0.05s steps(1) infinite',
                  border: `1px solid rgba(${Math.random() > 0.5 ? '255, 255, 255' : '0, 0, 0'}, 0.4)`,
                  boxShadow: `0 0 3px ${randomColor}`,
                }}
              />
            );
          })}
        </>
      )}

      {/* Tiny Pixel Artifacts - Like TV Dead Pixels */}
      {(glitchType === 'all' || glitchType === 'flow') && (
        <>
          {[...Array(40)].map((_, i) => {
            const randomLeft = Math.random() * 98;
            const randomTop = Math.random() * 98;
            const isWhite = Math.random() > 0.3;
            return (
              <div
                key={`pixel-${i}`}
                style={{
                  position: 'fixed',
                  top: `${randomTop}%`,
                  left: `${randomLeft}%`,
                  width: `${Math.random() * 2 + 0.5}%`, // 0.5-2.5% (very small)
                  height: `${Math.random() * 2 + 0.5}%`,
                  zIndex: 9999,
                  pointerEvents: 'none',
                  background: isWhite ? 
                    `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})` : 
                    `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, 0.9)`,
                  animation: 'glitch-blocks 0.03s steps(1) infinite',
                }}
              />
            );
          })}
        </>
      )}

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
            opacity: 0.2,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.15) 3px
            ), repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 0px,
              transparent 1px,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 3px
            )`,
            animation: 'glitch-rgb 0.05s infinite',
          }}
        />
      )}
    </>
  );
}

