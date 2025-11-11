'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
// import Ticker from '@/components/Ticker';
import HeroText from '@/components/HeroText';
import HeroInfoBoxes from '@/components/HeroInfoBoxes';
import LoadingScreen from '@/components/LoadingScreen';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import SectionProgressBar from '@/components/SectionProgressBar';
// import RippleEffect from '@/components/RippleEffect';
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

// Dynamic import for AnalogDecayOverlay to avoid SSR issues
const AnalogDecayOverlay = dynamic(() => import('@/components/AnalogDecayOverlay'), {
  ssr: false,
});

// Dynamic import for GlitchEffect
const GlitchEffect = dynamic(() => import('@/components/GlitchEffect'), {
  ssr: false,
});

export default function Home() {
  const mousePosition = useMousePosition();             
  const { scrollProgress, scrollVelocity } = useScrollProgress();

  return (
    <SmoothScroll>
      <CustomCursor />
      {/* <RippleEffect /> */}
      <LoadingScreen />
      <main className="relative bg-black overflow-x-hidden">
      {/* Three.js Scene */}
      <Suspense fallback={null}>
        <Scene3D mousePosition={mousePosition} scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />
      </Suspense>

      {/* Hero Text Overlay - Now rendered in 3D canvas */}
      {/* <HeroText scrollProgress={scrollProgress} /> */}

      {/* Header */}
      <Header />

      {/* Ticker at bottom */}
      {/* <Ticker /> */}

      {/* Section 1: Hero */}
      <section id="section-1" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-4xl md:text-6xl font-bold text-center">
          {/* <div className="opacity-0 animate-fade-in">Hero Section</div> */}
        </div>
        {/* Left and Right Info Boxes with Ruler Milestones */}
        <HeroInfoBoxes />
      </section>

      {/* Section 2 */}
      <section id="section-2" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-3xl md:text-5xl font-normal text-center">
          <div className="text-[#ffd841] text-6xl md:text-8xl font-normal mb-4">02</div>
          <div>Section Two</div>
        </div>
      </section>

      {/* Section 3 */}
      <section id="section-3" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-3xl md:text-5xl font-normal text-center">
          <div className="text-[#ffd841] text-6xl md:text-8xl font-normal mb-4">03</div>
          <div>Section Three</div>
        </div>
      </section>

      {/* Section 4 */}
      <section id="section-4" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-3xl md:text-5xl font-normal text-center">
          <div className="text-[#ffd841] text-6xl md:text-8xl font-normal mb-4">04</div>
          <div>Section Four</div>
        </div>
      </section>

      {/* Section 5 */}
      <section id="section-5" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-3xl md:text-5xl font-normal text-center">
          <div className="text-[#ffd841] text-6xl md:text-8xl font-normal mb-4">05</div>
          <div>Section Five</div>
        </div>
      </section>

      {/* Section 6 */}
      <section id="section-6" className="relative z-20 h-screen flex items-center justify-center pointer-events-none">
        <div className="text-white text-3xl md:text-5xl font-normal text-center">
          <div className="text-[#ffd841] text-6xl md:text-8xl font-normal mb-4">06</div>
          <div>Section Six</div>
        </div>
      </section>

      {/* Section Progress Bar */}
      <SectionProgressBar totalSections={6} startFromSection={2} />
      </main>
      
      {/* Analog Decay Effect Overlay - applies to entire screen */}
      <Suspense fallback={null}>
        <AnalogDecayOverlay />
      </Suspense>
      
      {/* Glitch Effect - triggers randomly every 4-10 seconds */}
      <Suspense fallback={null}>
        <GlitchEffect />
      </Suspense>
    </SmoothScroll>
  );
}
