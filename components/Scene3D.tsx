'use client';

import React, { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function Scene3D({ mousePosition, scrollProgress, scrollVelocity }: { mousePosition: { x: number; y: number }, scrollProgress: number, scrollVelocity: number }) {
  const splineRef = useRef<any>(null);
  const [isRgbSplitActive, setIsRgbSplitActive] = React.useState(false);
  const rgbTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Handle Spline load event
  const onLoad = (spline: any) => {
    splineRef.current = spline;
    console.log('Spline scene loaded successfully');
  };

  // Optional: You can interact with the Spline scene based on scroll/mouse
  useEffect(() => {
    if (splineRef.current) {
      // You can manipulate the Spline scene here if needed
      // For example, adjust camera or object positions based on scrollProgress
      // splineRef.current.setVariable('scrollProgress', scrollProgress);
    }
  }, [scrollProgress, mousePosition]);

  // RGB Split Effect Random Trigger
  useEffect(() => {
    const triggerRgbSplit = () => {
      // Activate RGB split
      setIsRgbSplitActive(true);
      
      // Random duration between 100ms to 300ms
      const effectDuration = Math.floor(Math.random() * 200) + 100;
      
      setTimeout(() => {
        setIsRgbSplitActive(false);
      }, effectDuration);
      
      // Schedule next RGB split randomly between 1-3 seconds
      const nextDelay = Math.floor(Math.random() * 2000) + 1000;
      rgbTimeoutRef.current = setTimeout(triggerRgbSplit, nextDelay);
    };

    // Start the RGB split cycle
    const initialDelay = Math.floor(Math.random() * 2000) + 1000;
    rgbTimeoutRef.current = setTimeout(triggerRgbSplit, initialDelay);

    return () => {
      if (rgbTimeoutRef.current) {
        clearTimeout(rgbTimeoutRef.current);
      }
    };
  }, []);

  // Calculate opacity, scale, and position based on scroll progress
  // scrollProgress is typically 0 to 1, where 0 is top and 1 is scrolled down
  const opacity = Math.max(0, 1 - scrollProgress * 2); // Fade out faster
  const scale = Math.max(0.3, 1 - scrollProgress * 1.5); // Scale down but not completely to 0
  const translateY = -scrollProgress * 300; // Move up by 300px at full scroll

  // Calculate distortion amount based on scroll velocity
  const distortionScale = Math.min(Math.abs(scrollVelocity) * 200, 400);
  
  // Use a ref to track time for smooth wave animation
  const timeRef = useRef(0);
  
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <>
      {/* SVG Filter Definition for Water Wave Distortion */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Water Wave Filter - Big Waves */}
          <filter id="water-distortion-filter" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            {/* Create large smooth wave turbulence */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.002 0.004"
              numOctaves="2"
              seed="7"
              stitchTiles="stitch"
              result="largeTurbulence"
            >
              {/* Slow wave animation for big rolling waves */}
              <animate
                attributeName="baseFrequency"
                dur="25s"
                values="0.002 0.004;0.004 0.006;0.002 0.004"
                repeatCount="indefinite"
              />
            </feTurbulence>
            
            {/* Apply heavy smoothing for big smooth waves */}
            <feGaussianBlur in="largeTurbulence" stdDeviation="12" result="smoothBigWaves" />
            
            {/* Apply displacement for large wave effect */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothBigWaves"
              scale={distortionScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            
            {/* Final smoothing for fluid motion */}
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="final" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          filter: distortionScale > 0.1 ? 'url(#water-distortion-filter)' : 'none',
          willChange: 'filter',
        }}
      >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/image/bg1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />
      
      {/* Gradient Overlay - Behind Doge and Logo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '488px',
          background: 'linear-gradient(to bottom, #0a0a0a 0%, rgba(10, 10, 10, 0) 90%)',
          zIndex: -0.5,
          pointerEvents: 'none',
        }}
      />
      
      {/* Logo Image - Behind Doge Model at Head Part with RGB Split Effect */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
          width: 'auto',
          height: 'auto',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: opacity,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
        }}
      >
        {/* RGB Split Effect Container */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* RGB Split Layers - Only show when active */}
          {isRgbSplitActive && (
            <>
              {/* Red Channel */}
              <img
                src="/image/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-8px',
                  width: 'auto',
                  height: '200px',
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.5)',
                  opacity: 0.8,
                }}
                className="rgb-split-red"
              />
              
              {/* Green Channel */}
              <img
                src="/image/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 'auto',
                  height: '200px',
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.5)',
                  opacity: 0.8,
                }}
                className="rgb-split-green"
              />
              
              {/* Blue Channel */}
              <img
                src="/image/logo.png"
                alt=""
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '8px',
                  width: 'auto',
                  height: '200px',
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.5)',
                  opacity: 0.8,
                }}
                className="rgb-split-blue"
              />
            </>
          )}
          
          {/* Main Logo */}
          <img
            src="/image/logo.png"
            alt="Logo"
            style={{
              position: 'relative',
              width: 'auto',
              height: '200px',
              objectFit: 'contain',
              filter: isRgbSplitActive ? 'brightness(1.1)' : 'brightness(1)',
            }}
          />
        </div>
      </div>
      
      {/* CSS for RGB Split Effect */}
      <style jsx>{`
        .rgb-split-red {
          filter: brightness(1.5) contrast(1.2) url(#red-channel);
        }
        .rgb-split-green {
          filter: brightness(1.5) contrast(1.2) url(#green-channel);
        }
        .rgb-split-blue {
          filter: brightness(1.5) contrast(1.2) url(#blue-channel);
        }
      `}</style>
      
      {/* SVG Filters for RGB Channel Isolation */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="red-channel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="green-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="blue-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      
      {/* Spline Scene */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          height: '100%',
          opacity: opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
        }}
      >
        <Spline
          scene="/scene.splinecode"
          onLoad={onLoad}
        />
      </div>
      </div>
    </>
  );
}

