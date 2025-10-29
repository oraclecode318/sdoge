'use client';

import { useEffect, useRef } from 'react';

export default function RippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Array<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse move handler - create ripple on mouse move
    let lastX = 0;
    let lastY = 0;
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle ripple creation
      if (throttleTimer) return;
      
      // Exclude header area (top ~80px) and ticker area (bottom ~60px)
      const headerHeight = 80;
      const tickerHeight = 60;
      const isInHeader = e.clientY < headerHeight;
      const isInTicker = e.clientY > window.innerHeight - tickerHeight;
      
      if (isInHeader || isInTicker) {
        return; // Don't create ripples in header or ticker areas
      }
      
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only create ripple if mouse moved enough
      if (distance > 10) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 120,
          alpha: 0.8,
        });
        
        lastX = e.clientX;
        lastY = e.clientY;
        
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 50);
      }
      
      // Keep max 20 ripples
      if (ripplesRef.current.length > 20) {
        ripplesRef.current.shift();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create clipping region to exclude header and ticker
      const headerHeight = 80;
      const tickerHeight = 60;
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, headerHeight, canvas.width, canvas.height - headerHeight - tickerHeight);
      ctx.clip();

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 1.5;
        ripple.alpha -= 0.008;

        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          return false;
        }

        // Draw multiple wave rings to create water ripple effect
        const waveCount = 8;
        for (let i = 0; i < waveCount; i++) {
          const waveOffset = i * 20; // Distance between waves
          const waveRadius = ripple.radius - waveOffset;
          
          if (waveRadius > 5) {
            // Calculate wave intensity based on position
            const waveIntensity = Math.sin((ripple.radius - waveOffset) * 0.1) * 0.5 + 0.5;
            const waveAlpha = ripple.alpha * waveIntensity * (1 - i / waveCount);
            
            // Draw main wave ring
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 237, 78, ${waveAlpha * 0.6})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw inner highlight
            if (waveRadius > 8) {
              ctx.beginPath();
              ctx.arc(ripple.x, ripple.y, waveRadius - 2, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha * 0.3})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            
            // Draw outer shadow
            if (waveRadius > 8) {
              ctx.beginPath();
              ctx.arc(ripple.x, ripple.y, waveRadius + 2, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(100, 80, 0, ${waveAlpha * 0.2})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        return true;
      });

      ctx.restore(); // Restore the clipping region

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
