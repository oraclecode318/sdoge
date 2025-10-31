'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import AnalogDecayEffect from './AnalogDecayEffect';

export default function AnalogDecayOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        gl={{ 
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        {/* Empty scene - just for post-processing */}
        <EffectComposer>
          <AnalogDecayEffect />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

