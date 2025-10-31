'use client';

import React, { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function Scene3D({ mousePosition, scrollProgress, scrollVelocity }: { mousePosition: { x: number; y: number }, scrollProgress: number, scrollVelocity: number }) {
  const splineRef = useRef<any>(null);

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

  // Calculate opacity, scale, and position based on scroll progress
  // scrollProgress is typically 0 to 1, where 0 is top and 1 is scrolled down
  const opacity = Math.max(0, 1 - scrollProgress * 2); // Fade out faster
  const scale = Math.max(0.3, 1 - scrollProgress * 1.5); // Scale down but not completely to 0
  const translateY = -scrollProgress * 300; // Move up by 300px at full scroll

  // Calculate distortion amount based on scroll velocity
  const distortionScale = Math.min(Math.abs(scrollVelocity) * 150, 300);
  
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
              baseFrequency="0.003 0.005"
              numOctaves="2"
              seed="7"
              stitchTiles="stitch"
              result="largeTurbulence"
            >
              {/* Slow wave animation for big rolling waves */}
              <animate
                attributeName="baseFrequency"
                dur="25s"
                values="0.003 0.005;0.005 0.007;0.003 0.005"
                repeatCount="indefinite"
              />
            </feTurbulence>
            
            {/* Apply heavy smoothing for big smooth waves */}
            <feGaussianBlur in="largeTurbulence" stdDeviation="8" result="smoothBigWaves" />
            
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
      
      {/* Logo Image - Behind Doge Model at Head Part */}
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
        <img
          src="/image/logo.png"
          alt="Logo"
          style={{
            width: 'auto',
            height: '200px',
            objectFit: 'contain',
          }}
        />
      </div>
      
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

