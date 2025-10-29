'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import AnalogDecayEffect from './AnalogDecayEffect';

function BackgroundGrid() {
  const gridRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 2;

      // Draw vertical lines with varying gaps
      let x = 0;
      while (x < canvas.width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        x += 40 + Math.random() * 20;
      }

      // Draw horizontal lines with varying gaps
      let y = 0;
      while (y < canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        y += 30 + Math.random() * 20;
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      
      if (gridRef.current.material instanceof THREE.MeshBasicMaterial) {
        gridRef.current.material.map = texture;
        gridRef.current.material.needsUpdate = true;
      }
    }
  }, []);

  return (
    <mesh ref={gridRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#1a1a1a" transparent opacity={0.95} />
    </mesh>
  );
}

function DogeModel({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/3d/doge_v_4.glb');
  const [clonedScene] = useState(() => scene.clone());

  useEffect(() => {
    // Traverse and adjust materials with color
    clonedScene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          
          // Add golden/yellow color to the doge
          material.color = new THREE.Color(0xbfb05e); // Yellow color
          material.roughness = 0.4;
          material.metalness = 0.2;
          
          // Add slight glow effect
          material.emissive = new THREE.Color(0xffaa00);
          material.emissiveIntensity = 0.15;
          
          // Make material respond better to light
          material.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!modelRef.current) return;

    // Mouse follow for head rotation
    const targetRotationY = mousePosition.x * 0.5;
    const targetRotationX = -mousePosition.y * 0.3;

    modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.05;
    modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.05;

    // Scroll-based distortion
    const distortAmount = Math.abs(scrollProgress) * 2;
    const baseScale = 1.5; // 2 * 1.4
    modelRef.current.scale.x = baseScale + Math.sin(distortAmount) * 0.3;
    modelRef.current.scale.y = baseScale - Math.sin(distortAmount) * 0.2;
    modelRef.current.scale.z = baseScale + Math.cos(distortAmount) * 0.2;

    // Slight idle animation
    modelRef.current.position.y = -2.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={modelRef} position={[0, -2.2, 0]} scale={2.5}>
      <primitive object={clonedScene} />
    </group>
  );
}

function SDOGEText({ scrollProgress }: { scrollProgress: number }) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!textRef.current) return;

    // Distortion based on scroll
    const distortion = Math.abs(scrollProgress) * 3;
    textRef.current.scale.x = 1 + Math.sin(distortion) * 0.5;
    textRef.current.scale.y = 1 - Math.sin(distortion) * 0.3;
  });

  return (
    <group position={[0, 1.8, -2]}>
      <mesh ref={textRef}>
        <planeGeometry args={[8, 2]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9}
          depthTest={true}
          depthWrite={false}
        >
          <canvasTexture 
            attach="map" 
            image={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 256;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 180px Orbitron, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('sDOGE', canvas.width / 2, canvas.height / 2);
              }
              return canvas;
            })()} 
          />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

function SceneContent({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Camera movements based on scroll
    camera.position.z = 5 + scrollProgress * 2;
    camera.position.y = -scrollProgress * 1;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      {/* Background Grid */}
      <BackgroundGrid />
      
      {/* Lighting - Much brighter for clarity */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 2, 2]} intensity={2} color="#ffffff" distance={15} />
      <spotLight
        position={[0, 8, 5]}
        angle={0.6}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
      />

      <DogeModel mousePosition={mousePosition} scrollProgress={scrollProgress} />
      <SDOGEText scrollProgress={scrollProgress} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.3 + Math.abs(scrollProgress) * 0.3}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={[
            0.0005 + Math.abs(scrollProgress) * 0.002,
            0.0005 + Math.abs(scrollProgress) * 0.002
          ] as [number, number]}
          blendFunction={BlendFunction.NORMAL}
        />
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.02}
          bokehScale={1.5}
        />
        <Glitch
          delay={new THREE.Vector2(1.5, 3.5)}
          duration={new THREE.Vector2(0.1, 0.3)}
          strength={new THREE.Vector2(0.2 + Math.abs(scrollProgress), 0.4 + Math.abs(scrollProgress))}
          mode={GlitchMode.SPORADIC}
          active={scrollProgress > 0.1}
          ratio={0.85}
        />
        <AnalogDecayEffect />
      </EffectComposer>
    </>
  );
}

export default function Scene3D({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.8,
      }}
    >
      <color attach="background" args={['#1a1a1a']} />
      <fog attach="fog" args={['#1a1a1a', 30, 50]} />
      <SceneContent mousePosition={mousePosition} scrollProgress={scrollProgress} />
    </Canvas>
  );
}

