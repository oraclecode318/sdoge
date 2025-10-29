'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GhostEffectProps {
  mousePosition: { x: number; y: number };
  enabled?: boolean;
}

export default function GhostEffect({ mousePosition, enabled = true }: GhostEffectProps) {
  const particlesRef = useRef<THREE.Points | null>(null);
  const trailsRef = useRef<THREE.Group>(null);
  const particleData = useRef<Array<{
    velocity: THREE.Vector3;
    life: number;
    decay: number;
  }>>([]);

  const maxParticles = 30;

  useEffect(() => {
    if (!enabled) return;

    // Initialize particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    for (let i = 0; i < maxParticles; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Orange/yellow glow color
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.6;
      colors[i * 3 + 2] = 0.2;

      sizes[i] = 0;

      particleData.current[i] = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
        life: 0,
        decay: 0.015 + Math.random() * 0.01
      };
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    if (trailsRef.current) {
      trailsRef.current.add(points);
    }
    particlesRef.current = points;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [enabled]);

  useFrame((state) => {
    if (!enabled || !particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

    // Spawn new particles near mouse position
    const mouseX = mousePosition.x * 10;
    const mouseY = mousePosition.y * 6;

    for (let i = 0; i < maxParticles; i++) {
      const data = particleData.current[i];

      if (data.life <= 0) {
        // Respawn particle - much less frequently
        if (Math.random() < 0.02) {
          positions[i * 3] = mouseX + (Math.random() - 0.5) * 1;
          positions[i * 3 + 1] = mouseY + (Math.random() - 0.5) * 1;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1;
          data.life = 1.0;
          sizes[i] = 0.02 + Math.random() * 0.03;
        }
      } else {
        // Update existing particle
        data.life -= data.decay;
        positions[i * 3] += data.velocity.x;
        positions[i * 3 + 1] += data.velocity.y;
        positions[i * 3 + 2] += data.velocity.z;
        sizes[i] = data.life * (0.02 + Math.random() * 0.03);
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });

  if (!enabled) return null;

  return <group ref={trailsRef} />;
}

