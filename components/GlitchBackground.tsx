'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders/GlitchShader';

interface GlitchBackgroundProps {
  scrollProgress: number;
}

export default function GlitchBackground({ scrollProgress }: GlitchBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      distortion: { value: 0 },
      rgbShift: { value: 0 },
      tDiffuse: { value: null },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    
    uniforms.time.value = state.clock.elapsedTime;
    uniforms.distortion.value = Math.abs(scrollProgress) * 5;
    uniforms.rgbShift.value = Math.abs(scrollProgress) * 3;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

