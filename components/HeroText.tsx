'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface HeroTextProps {
  scrollProgress: number;
}

export default function HeroText({ scrollProgress }: HeroTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const distortion = Math.abs(scrollProgress) * 100;
    const opacity = Math.max(0, 1 - Math.abs(scrollProgress) * 2);

    gsap.to(textRef.current, {
      '--distort': distortion,
      opacity: opacity,
      duration: 0.1,
    });
  }, [scrollProgress]);

  const calculateTextStyle = () => {
    const distortAmount = Math.abs(scrollProgress) * 30;
    const rgbShift = Math.abs(scrollProgress) * 5;

    return {
      transform: `scaleX(${1 + Math.sin(distortAmount / 10) * 0.3}) scaleY(${1 - Math.sin(distortAmount / 10) * 0.2})`,
      textShadow: `
        ${rgbShift}px 0 0 rgba(255, 0, 0, 0.7),
        ${-rgbShift}px 0 0 rgba(0, 255, 255, 0.7),
        0 ${rgbShift}px 0 rgba(0, 255, 0, 0.5)
      `,
      filter: `blur(${Math.abs(scrollProgress) * 2}px)`,
    };
  };

  return (
    <div
      ref={textRef}
      className="fixed top-20 left-0 right-0 flex items-center justify-center pointer-events-none px-4"
      style={{ zIndex: 0 }}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-black tracking-tighter select-none"
        style={{
          ...calculateTextStyle(),
          color: '#ffffff',
        }}
      >
        sDOGE
      </motion.h1>
    </div>
  );
}

