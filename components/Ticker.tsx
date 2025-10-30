'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Ticker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const content = container.querySelector('.ticker-content') as HTMLElement;
    
    if (!content) return;

    // Clone the content multiple times for seamless loop
    const clone1 = content.cloneNode(true) as HTMLElement;
    const clone2 = content.cloneNode(true) as HTMLElement;
    container.appendChild(clone1);
    container.appendChild(clone2);

    const contentWidth = content.offsetWidth;

    gsap.to(container, {
      x: -contentWidth,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(container);
    };
  }, []);

  const tickerText = "** TVL 2.6% ** APR $38,449,783,518 ** TVL 2.6% ** APR $38,449,783,518 ** TVL 2.6% ** APR $38,449,783,518 ** APR $38,449,783,518";

  return (
    <div
    style={{ padding: '6px 0px' }}
    className="fixed py-2 px-4 bottom-0 left-0 right-0 z-50 bg-[#000000] overflow-hidden">
      <div ref={containerRef} className="flex whitespace-nowrap py-3 will-change-transform">
        <div className="ticker-content flex items-center py-4">
          {tickerText.split(' ').filter(word => word.length > 0).map((word, i) => (
            <span
              key={i}
              style={{ margin: '6px 4px', fontSize: '14px' }}
              className={`font-normal text-sm ${
                word.includes('$') ? 'text-white mx-5' : 'text-yellow-400 mx-3'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

