/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  getFPS(): number {
    return this.fps;
  }

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  shouldReduceQuality(): boolean {
    return this.fps < 30;
  }
}

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  return cores < 4 || memory < 4 || isMobile();
};

export const getOptimalSettings = () => {
  const isLowEnd = isLowEndDevice();
  
  return {
    particleCount: isLowEnd ? 300 : 1000,
    bloomIntensity: isLowEnd ? 0.3 : 0.5,
    enableGlitch: !isLowEnd,
    enableDOF: !isLowEnd,
    shadowQuality: isLowEnd ? 'low' : 'high',
  };
};

