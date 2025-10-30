'use client';

import { useState, useEffect } from 'react';

export function useScrollProgress() {
  // Initialize with current scroll position
  const [scrollProgress, setScrollProgress] = useState(() => {
    if (typeof window !== 'undefined') {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }
    return 0;
  });
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let rafId: number;

    // Set initial scroll progress immediately
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const initialProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    setScrollProgress(initialProgress);

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const deltaScroll = currentScrollY - lastScrollY;

      // Calculate velocity
      const velocity = deltaTime > 0 ? deltaScroll / deltaTime : 0;
      setScrollVelocity(velocity);

      // Calculate progress (0 to 1, then keeps going for extended scroll)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      setScrollProgress(progress);

      lastScrollY = currentScrollY;
      lastTime = currentTime;

      rafId = requestAnimationFrame(updateScroll);
    };

    rafId = requestAnimationFrame(updateScroll);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { scrollProgress, scrollVelocity };
}

