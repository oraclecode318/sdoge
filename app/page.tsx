'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Ticker from '@/components/Ticker';
import HeroText from '@/components/HeroText';
import ScrollIndicator from '@/components/ScrollIndicator';
import LoadingScreen from '@/components/LoadingScreen';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import RippleEffect from '@/components/RippleEffect';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollProgress } from '@/hooks/useScrollProgress';

// Dynamic import for Scene3D to avoid SSR issues with Three.js
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-yellow-400 text-2xl font-bold">Loading...</div>
    </div>
  ),
});

export default function Home() {
  const mousePosition = useMousePosition();
  const { scrollProgress, scrollVelocity } = useScrollProgress();

  return (
    <SmoothScroll>
      <CustomCursor />
      <RippleEffect />
      <LoadingScreen />
      <main className="relative min-h-[300vh] bg-black overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Three.js Scene */}
      <Suspense fallback={null}>
        <Scene3D mousePosition={mousePosition} scrollProgress={scrollProgress} />
      </Suspense>

      {/* Hero Text Overlay - Now rendered in 3D canvas */}
      {/* <HeroText scrollProgress={scrollProgress} /> */}

      {/* Header */}
      <Header />

      {/* Scroll Indicator */}
      {scrollProgress < 0.1 && <ScrollIndicator />}

      {/* Ticker at bottom */}
      <Ticker />

      {/* Content sections for scroll */}
      <div className="relative z-20 pointer-events-none">
        <div className="h-screen" />
        <div className="h-screen flex items-center justify-center">
          <div className="text-white text-4xl font-bold opacity-0 animate-fade-in">
            {/* Additional content sections can go here */}
          </div>
        </div>
        <div className="h-screen" />
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 h-1 bg-yellow-200/40" style={{ width: '25%' }}>
        <div
          className="h-full bg-yellow-300/80 transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      </main>
    </SmoothScroll>
  );
}
