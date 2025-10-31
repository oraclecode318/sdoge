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
      const types: Array<'rgb' | 'shift' | 'flow' | 'scan' | 'all'> = ['rgb', 'shift', 'flow', 'scan', 'all'];
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

  const rgbShiftAmount = Math.floor(Math.random() * 10 + 5) * intensity;
  const shiftAmount = Math.floor(Math.random() * 30 + 10) * intensity;
  const scanLinePosition = Math.floor(Math.random() * 100);

  return (
    <>
      <style jsx>{`
        @keyframes glitch-rgb {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px);
          }
          40% {
            transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px);
          }
          60% {
            transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px);
          }
          80% {
            transform: translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px);
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

      {/* RGB Shift Layers */}
      {(glitchType === 'rgb' || glitchType === 'all') && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 9998,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              opacity: 0.8,
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 0, 0, 0.3) 0%, transparent 50%)`,
              transform: `translateX(${rgbShiftAmount}px)`,
              animation: 'glitch-rgb 0.1s infinite',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 9998,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              opacity: 0.8,
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(0, 255, 0, 0.3) 0%, transparent 50%)`,
              transform: `translateX(-${rgbShiftAmount / 2}px) translateY(${rgbShiftAmount / 2}px)`,
              animation: 'glitch-rgb 0.1s infinite',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 9998,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              opacity: 0.8,
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(0, 0, 255, 0.3) 0%, transparent 50%)`,
              transform: `translateX(-${rgbShiftAmount}px)`,
              animation: 'glitch-rgb 0.1s infinite',
            }}
          />
        </>
      )}

      {/* Horizontal Shift Lines */}
      {(glitchType === 'shift' || glitchType === 'all') && (
        <>
          {[...Array(5)].map((_, i) => {
            const randomTop = Math.random() * 100;
            const randomHeight = Math.random() * 5 + 2;
            const randomShift = (Math.random() - 0.5) * shiftAmount * 2;
            return (
              <div
                key={`shift-${i}`}
                style={{
                  position: 'fixed',
                  top: `${randomTop}%`,
                  left: 0,
                  width: '100%',
                  height: `${randomHeight}%`,
                  zIndex: 9999,
                  pointerEvents: 'none',
                  background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)`,
                  transform: `translateX(${randomShift}px)`,
                  boxShadow: `0 0 10px rgba(255, 255, 255, 0.5)`,
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
              height: '2px',
              zIndex: 9999,
              pointerEvents: 'none',
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
              animation: 'glitch-scan 0.1s linear infinite',
            }}
          />
          {[...Array(3)].map((_, i) => (
            <div
              key={`flow-${i}`}
              style={{
                position: 'fixed',
                top: `${Math.random() * 100}%`,
                left: 0,
                width: '100%',
                height: '1px',
                zIndex: 9999,
                pointerEvents: 'none',
                background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
              }}
            />
          ))}
        </>
      )}

      {/* Random Block Artifacts */}
      {glitchType === 'all' && (
        <>
          {[...Array(3)].map((_, i) => {
            const randomLeft = Math.random() * 80;
            const randomTop = Math.random() * 80;
            const randomWidth = Math.random() * 20 + 10;
            const randomHeight = Math.random() * 10 + 5;
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
                  background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                  mixBlendMode: 'overlay',
                  animation: 'glitch-blocks 0.05s steps(1) infinite',
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
            opacity: 0.15,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.1) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 3px
            )`,
            animation: 'glitch-rgb 0.05s infinite',
          }}
        />
      )}
    </>
  );
}

