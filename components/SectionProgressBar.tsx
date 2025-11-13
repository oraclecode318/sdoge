'use client';

import { useEffect, useState } from 'react';

interface SectionProgressBarProps {
  totalSections: number;
  startFromSection?: number; // Section number to start showing progress (default: 2)
}

export default function SectionProgressBar({ totalSections, startFromSection = 2 }: SectionProgressBarProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3; // Use 1/3 from top for better detection
      let activeSection = 1;
      
      // Check sections from bottom to top
      for (let i = totalSections; i >= 1; i--) {
        const sectionElement = document.getElementById(`section-${i}`);
        if (sectionElement) {
          const sectionTop = sectionElement.offsetTop;
          const sectionHeight = sectionElement.offsetHeight;
          
          if (scrollPosition >= sectionTop) {
            activeSection = i;
            break;
          }
        }
      }

      setCurrentSection(activeSection);
      setIsVisible(activeSection >= startFromSection);
    };

    // Use both scroll and resize events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [totalSections, startFromSection]);

  if (!isVisible) return null;

  // Calculate progress: sections 2-5 (4 sections) = 0% to 100%
  const sectionsToShow = totalSections - startFromSection + 1;
  const currentProgress = Math.max(0, Math.min(100, ((currentSection - startFromSection + 1) / sectionsToShow) * 100));

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
      <div className="h-1 bg-gray-400/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#ffd841] transition-all duration-300 ease-out"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
}

