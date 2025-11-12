'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';

interface Scene3DProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
  scrollVelocity: number;
  onAnimationsLoaded?: (animations: string[]) => void;
  onPlayAnimation?: (animationName: string) => void;
  onPlayRandomAnimation?: () => void;
  onPlayAnimationByInput?: (input: string) => void;
}

export default function Scene3D({
  mousePosition,
  scrollProgress,
  scrollVelocity,
  onAnimationsLoaded,
  onPlayAnimation,
  onPlayRandomAnimation,
  onPlayAnimationByInput
}: Scene3DProps) {
  const splineRef = useRef<any>(null);
  const [isRgbSplitActive, setIsRgbSplitActive] = useState(false);
  const [animations, setAnimations] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const rgbTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Animation control functions
  const stopAllAnimations = useCallback(() => {
    if (!splineRef.current?._animationControls) return;

    try {
      const animControls = splineRef.current._animationControls;
      Object.values(animControls.clipIdToAction).forEach((action: any) => {
        action.stop();
      });
      setCurrentAnimation(null);
      console.log('All animations stopped');
    } catch (error) {
      console.error('Error stopping animations:', error);
    }
  }, []);

  const playAnimation = useCallback((animationName: string) => {
    if (!splineRef.current?._animationControls) return;

    try {
      const animControls = splineRef.current._animationControls;

      // First, stop all animations
      Object.values(animControls.clipIdToAction).forEach((action: any) => {
        action.stop();
      });

      // Then play the requested animation
      if (animControls.clipIdToAction[animationName]) {
        const action = animControls.clipIdToAction[animationName];
        action.reset(); // Reset to beginning
        action.play();
        setCurrentAnimation(animationName);
        console.log('Playing animation:', animationName);
        return true;
      }
    } catch (error) {
      console.error('Error playing animation:', error);
    }
    return false;
  }, []);

  const playRandomAnimation = useCallback(() => {
    if (animations.length === 0) return;

    const randomIndex = Math.floor(Math.random() * animations.length);
    const randomAnimation = animations[randomIndex];
    playAnimation(randomAnimation);
  }, [animations, playAnimation]);

  const playAnimationByInput = useCallback((input: string) => {
    if (!input || input.length < 8) return false;

    const searchTerm = input.substring(0, 8).toLowerCase();
    const matchedAnimation = animations.find(anim =>
      anim.toLowerCase().includes(searchTerm)
    );

    if (matchedAnimation) {
      playAnimation(matchedAnimation);
      return true;
    }
    return false;
  }, [animations, playAnimation]);

  // Handle Spline load event
  const onLoad = (spline: any) => {
    splineRef.current = spline;
    console.log('Spline scene loaded successfully');

    // Get animations
    try {
      if (spline._animationControls) {
        const animControls = spline._animationControls;
        console.log('Animation Controls:', animControls);

        if (animControls.clipIdToAction) {
          const animationNames = Object.keys(animControls.clipIdToAction);
          console.log('Available animations:', animationNames);
          setAnimations(animationNames);

          // Notify parent component about available animations
          if (onAnimationsLoaded) {
            onAnimationsLoaded(animationNames);
          }

          // Auto-play first animation
          if (animationNames.length > 0) {
            setTimeout(() => {
              playAnimation(animationNames[0]);
            }, 1000); // Wait 1 second before auto-playing
          }
        }
      }
    } catch (error) {
      console.error('Error accessing animations:', error);
    }
  };

  // Expose animation controls to parent component
  useEffect(() => {
    if (onPlayAnimation) {
      // This will be called from parent component
      // We need to create a way to trigger animations from outside
    }
  }, [onPlayAnimation]);

  // Handle external animation triggers
  useEffect(() => {
    // Store functions in a global object for easier access
    (window as any).scene3DControls = {
      playRandomAnimation,
      playAnimationByInput,
      playAnimation,
      stopAllAnimations,
      animations,
      currentAnimation
    };
  }, [playRandomAnimation, playAnimationByInput, playAnimation, stopAllAnimations, animations, currentAnimation]);

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
  // Keep size constant until section 2 (around 0.33 scroll progress)
  const section2Threshold = 0.33; // End of section 2 (2 out of 6 sections)
  const section3Threshold = 0.4; // Start of section 3 (40% progress)

  // Only start scaling after section 2
  const adjustedScrollProgress = Math.max(0, scrollProgress - section2Threshold);
  const normalizedScrollProgress = adjustedScrollProgress / (1 - section2Threshold);

  const opacity = Math.max(0, 1 - normalizedScrollProgress * 2); // Fade out faster
  const scale = scrollProgress <= section2Threshold ? 1.1 : Math.max(0.3, 1.1 - normalizedScrollProgress * 1.5); // Smaller size (1.0) until section 2
  const translateY = scrollProgress <= section2Threshold ? -scrollProgress * 300 : -scrollProgress * 250 + 50; // Move up by 250px at full scroll, offset by 50px down

  // Smooth doge positioning transition from center to left
  const dogeTransitionRange = section3Threshold - section2Threshold; // 0.07 range
  const dogeTransitionProgress = Math.min(1, Math.max(0, (scrollProgress - section2Threshold) / dogeTransitionRange));
  const dogeTranslateX = `${dogeTransitionProgress * -25}%`; // Smoothly move from 0% to -25%

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

        {/* Logo Image - Behind Doge Model at Head Part with RGB Split Effect - Hidden in section 3+ */}
        {scrollProgress < section3Threshold && (
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
        )}

      {/* Section 3+ Headline Text with RGB Split Effect - Smooth Transition */}
      {scrollProgress >= section2Threshold && (
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: `translateX(-50%) translateY(${translateY + (1 - dogeTransitionProgress) * 30}px) scale(${scale * (0.9 + dogeTransitionProgress * 0.1)})`,
          width: 'auto',
          height: 'auto',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: opacity * dogeTransitionProgress,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
        }}
      >
        {/* RGB Split Effect Container */}
        <div style={{ position: 'relative', display: 'inline-block', fontFamily:'var(--font-aktiv)' }}>
              {/* RGB Split Layers - Only show when active */}
              {isRgbSplitActive && (
                <>
                  {/* Red Channel */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-8px',
                      width: 'auto',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Aktiv Grotesk Ex Trial',
                      fontWeight: '800',
                      fontStyle: 'italic',
                      fontSize: '122px',
                      lineHeight: '100%',
                      letterSpacing: '-4.28px',
                      textAlign: 'center',
                      color: '#ff0000',
                      mixBlendMode: 'screen',
                      filter: 'brightness(1.5)',
                      opacity: 0.8,
                      whiteSpace: 'nowrap',
                    }}
                    className="rgb-split-red"
                  >
                    Mint sDOGE
                  </div>

                  {/* Green Channel */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 'auto',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Aktiv Grotesk Ex Trial',
                      fontWeight: '800',
                      fontStyle: 'italic',
                      fontSize: '122px',
                      lineHeight: '100%',
                      letterSpacing: '-4.28px',
                      textAlign: 'center',
                      color: '#00ff00',
                      mixBlendMode: 'screen',
                      filter: 'brightness(1.5)',
                      opacity: 0.8,
                      whiteSpace: 'nowrap',
                    }}
                    className="rgb-split-green"
                  >
                    Mint sDOGE
                  </div>

                  {/* Blue Channel */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '8px',
                      width: 'auto',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Aktiv Grotesk Ex Trial',
                      fontWeight: '800',
                      fontStyle: 'italic',
                      fontSize: '122px',
                      lineHeight: '100%',
                      letterSpacing: '-4.28px',
                      textAlign: 'center',
                      color: '#0000ff',
                      mixBlendMode: 'screen',
                      filter: 'brightness(1.5)',
                      opacity: 0.8,
                      whiteSpace: 'nowrap',
                    }}
                    className="rgb-split-blue"
                  >
                    Mint sDOGE
                  </div>
                </>
              )}

              {/* Main Text */}
              <div
                style={{
                  position: 'relative',
                  width: 'auto',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Aktiv Grotesk Ex Trial',
                  fontWeight: '800',
                  fontStyle: 'italic',
                  fontSize: '122px',
                  lineHeight: '100%',
                  letterSpacing: '-4.28px',
                  textAlign: 'center',
                  color: '#ffffff',
                  filter: isRgbSplitActive ? 'brightness(1.1)' : 'brightness(1)',
                  whiteSpace: 'nowrap',
                }}
              >
                Mint sDOGE
              </div>
            </div>
          </div>
        )}

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
            transform: `translateX(${dogeTranslateX}) translateY(${translateY}px) scale(${scale})`,
            transformOrigin: scrollProgress >= section3Threshold ? 'left center' : 'center center',
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

