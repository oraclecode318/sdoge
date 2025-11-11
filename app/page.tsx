'use client';

import { Suspense, useState, useCallback } from 'react';
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
import { 
  FaPlay, 
  FaPause, 
  FaMusic, 
  FaGamepad, 
  FaRocket, 
  FaStar, 
  FaBolt, 
  FaFire, 
  FaMagic, 
  FaDice, 
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';

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
  
  // Animation state management
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [animationInput, setAnimationInput] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Animation control functions
  const handleAnimationsLoaded = useCallback((animations: string[]) => {
    console.log('Animations loaded in parent:', animations);
    setAvailableAnimations(animations);
  }, []);

  const handlePlayRandomAnimation = useCallback(() => {
    if ((window as any).scene3DControls) {
      (window as any).scene3DControls.playRandomAnimation();
    }
  }, []);

  const handlePlayAnimation = useCallback((animationName: string) => {
    if ((window as any).scene3DControls) {
      (window as any).scene3DControls.playAnimation(animationName);
    }
  }, []);

  const handleAnimationInputSubmit = useCallback(() => {
    if (animationInput && (window as any).scene3DControls) {
      const success = (window as any).scene3DControls.playAnimationByInput(animationInput);
      if (!success) {
        alert('No animation found matching the first 8 characters: ' + animationInput.substring(0, 8));
      } else {
        setAnimationInput(''); // Clear input on success
      }
    }
  }, [animationInput]);

  // Pagination logic for animation carousel
  const paginatedAnimations = availableAnimations.slice(1); // Skip first animation (auto-played)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(paginatedAnimations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentPageAnimations = paginatedAnimations.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  // Animation icons using React Icons
  const getAnimationIcon = useCallback((index: number) => {
    const IconComponent = [FaPlay, FaMusic, FaGamepad, FaRocket, FaStar, FaBolt, FaFire, FaMagic, FaDice, FaPause][index % 10];
    return <IconComponent className="text-sm" />;
  }, []);

  return (
    <SmoothScroll>
      <CustomCursor />
      {/* <RippleEffect /> */}
      <LoadingScreen />
      <main className="relative bg-black overflow-x-hidden">
      {/* Three.js Scene */}
      <Suspense fallback={null}>
        <Scene3D 
          mousePosition={mousePosition} 
          scrollProgress={scrollProgress} 
          scrollVelocity={scrollVelocity}
          onAnimationsLoaded={handleAnimationsLoaded}
        />
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
        
        {/* Animation Controls - Only visible in hero section */}
        {scrollProgress < 0.17 && (
          <>
            {/* Dice Icon Button - Bottom Left */}
            <div className="relative">
              <button
                onClick={handlePlayRandomAnimation}
                onMouseEnter={() => setHoveredButton('dice-random')}
                onMouseLeave={() => setHoveredButton(null)}
                className="fixed bottom-8 cursor-pointer left-8 w-14 h-14 bg-gradient-to-br from-[#ffd841] to-[#ff8c42] text-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 pointer-events-auto z-30 flex items-center justify-center"
                style={{
                  opacity: Math.max(0, 1 - (scrollProgress / 0.15)),
                  transform: `scale(${Math.max(0.8, 1 - (scrollProgress / 0.15) * 0.2)}) translateY(${scrollProgress * 50}px)`
                }}
              >
                <FaDice className="text-lg" />
              </button>
              
              {/* Custom Professional Tooltip for Dice */}
              {hoveredButton === 'dice-random' && (
                <div 
                  className="fixed bottom-24 left-8 px-4 py-3 bg-gradient-to-r from-gray-900 to-black border border-[#ffd841]/30 text-white text-sm font-medium rounded-lg shadow-2xl backdrop-blur-sm z-50 whitespace-nowrap"
                  style={{
                    opacity: Math.max(0, 1 - (scrollProgress / 0.15))
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <FaDice className="text-[#ffd841]" />
                    <span>Random Animation</span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ffd841]/30"></div>
                </div>
              )}
            </div>

            {/* Animation Carousel - Mid Bottom */}
            {paginatedAnimations.length > 0 && (
              <div 
                className="fixed bottom-8 left-1/2 flex items-center space-x-3 pointer-events-auto z-30 transition-all duration-300"
                style={{
                  opacity: Math.max(0, 1 - (scrollProgress / 0.15)),
                  transform: `translateX(-50%) translateY(${scrollProgress * 50}px) scale(${Math.max(0.8, 1 - (scrollProgress / 0.15) * 0.2)})`
                }}
              >
                {/* Previous Page Button */}
                <div className="relative">
                  <button
                    onClick={handlePrevPage}
                    onMouseEnter={() => !currentPage ? null : setHoveredButton('prev-page')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={currentPage === 0}
                    className="w-8 h-8 cursor-pointer rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ffd841] hover:text-black transition-all duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  
                  {/* Custom Professional Tooltip for Previous */}
                  {hoveredButton === 'prev-page' && currentPage > 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gradient-to-r from-gray-900 to-black border border-[#ffd841]/30 text-white text-sm font-medium rounded-lg shadow-2xl backdrop-blur-sm z-50 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FaChevronLeft className="text-[#ffd841]" />
                        <span>Previous Page</span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ffd841]/30"></div>
                    </div>
                  )}
                </div>

                {/* Animation Buttons */}
                <div className="flex space-x-2 relative">
                  {currentPageAnimations.map((animation, index) => {
                    const actualIndex = startIndex + index;
                    const buttonId = `animation-${actualIndex + 2}`;
                    return (
                      <div key={animation} className="relative">
                        <button
                          onClick={() => handlePlayAnimation(animation)}
                          onMouseEnter={() => setHoveredButton(buttonId)}
                          onMouseLeave={() => setHoveredButton(null)}
                          className="w-10 h-10 cursor-pointer rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ffd841] hover:text-black hover:scale-110 transition-all duration-300 flex items-center justify-center text-lg"
                        >
                          {getAnimationIcon(actualIndex)}
                        </button>
                        
                        {/* Custom Professional Tooltip */}
                        {hoveredButton === buttonId && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gradient-to-r from-gray-900 to-black border border-[#ffd841]/30 text-white text-sm font-medium rounded-lg shadow-2xl backdrop-blur-sm z-50 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-[#ffd841]">▶</span>
                              <span>Animation {actualIndex + 2}</span>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ffd841]/30"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <div className="relative">
                  <button
                    onClick={handleNextPage}
                    onMouseEnter={() => (currentPage >= totalPages - 1) ? null : setHoveredButton('next-page')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={currentPage >= totalPages - 1}
                    className="w-8 h-8 cursor-pointer rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ffd841] hover:text-black transition-all duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                  
                  {/* Custom Professional Tooltip for Next */}
                  {hoveredButton === 'next-page' && currentPage < totalPages - 1 && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gradient-to-r from-gray-900 to-black border border-[#ffd841]/30 text-white text-sm font-medium rounded-lg shadow-2xl backdrop-blur-sm z-50 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FaChevronRight className="text-[#ffd841]" />
                        <span>Next Page</span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ffd841]/30"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input Field and Send Button - Right Bottom */}
            <div 
              className="fixed bottom-8 right-8 flex items-center space-x-2 pointer-events-auto z-30 transition-all duration-300"
              style={{
                opacity: Math.max(0, 1 - (scrollProgress / 0.15)),
                transform: `translateY(${scrollProgress * 50}px) scale(${Math.max(0.8, 1 - (scrollProgress / 0.15) * 0.2)})`
              }}
            >
              <input
                type="text"
                value={animationInput}
                onChange={(e) => setAnimationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnimationInputSubmit()}
                placeholder="Enter secret code..."
                className="px-3 py-2 bg-black/50 backdrop-blur-sm border border-[#ffd841]/30 text-white rounded-lg focus:outline-none focus:border-[#ffd841] focus:ring-1 focus:ring-[#ffd841] text-sm w-40"
                maxLength={50}
              />
              <div className="relative">
                <button
                  onClick={handleAnimationInputSubmit}
                  onMouseEnter={() => animationInput.trim() ? setHoveredButton('send-button') : null}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={!animationInput.trim()}
                  className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#ffd841] to-[#ff8c42] text-black rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium text-sm"
                >
                  ▶
                </button>
                
                {/* Custom Professional Tooltip for Send Button */}
                {hoveredButton === 'send-button' && animationInput.trim() && (
                  <div className="absolute bottom-full mb-2 right-0 px-3 py-2 bg-gradient-to-r from-gray-900 to-black border border-[#ffd841]/30 text-white text-sm font-medium rounded-lg shadow-2xl backdrop-blur-sm z-50 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#ffd841]">▶</span>
                      <span>Play Animation</span>
                    </div>
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#ffd841]/30"></div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
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
