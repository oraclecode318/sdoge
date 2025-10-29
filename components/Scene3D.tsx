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
          material.color = new THREE.Color(0xd4b857); // Brighter yellow/golden color
          material.roughness = 0.7; // Higher roughness for stronger shadows
          material.metalness = 0.0; // No metalness for maximum contrast
          
          // Remove emissive for natural lighting
          material.emissive = new THREE.Color(0x000000);
          material.emissiveIntensity = 0;
          
          // Enable shadow casting and receiving
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Make material respond to light properly
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
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Create canvas texture once
  useEffect(() => {
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
    textureRef.current = new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!textRef.current) return;

    // Distortion based on scroll
    const distortion = Math.abs(scrollProgress) * 3;
    textRef.current.scale.x = 1 + Math.sin(distortion) * 0.5;
    textRef.current.scale.y = 1 - Math.sin(distortion) * 0.3;

    // Update shader uniforms for glitch effect
    const material = textRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Glitch shader
  const glitchShader = {
    uniforms: {
      uTexture: { value: textureRef.current },
      uTime: { value: 0 },
      uGlitchIntensity: { value: 0.5 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uGlitchIntensity;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Glitch effect intensity varies over time
        float glitchStrength = step(0.95, random(vec2(floor(uTime * 3.0)))) * uGlitchIntensity;
        
        // RGB channel separation (like CSS text-shadow)
        float offsetR = glitchStrength * 0.02;
        float offsetG = glitchStrength * 0.01;
        float offsetB = glitchStrength * 0.015;
        
        // Sample RGB channels separately with offsets
        float r = texture2D(uTexture, uv + vec2(offsetR, 0.0)).r;
        float g = texture2D(uTexture, uv + vec2(-offsetG, 0.0)).g;
        float b = texture2D(uTexture, uv + vec2(-offsetB, 0.0)).b;
        
        // Random horizontal slicing (like CSS clip)
        float slice = step(0.98, random(vec2(floor(uv.y * 20.0), floor(uTime * 5.0))));
        uv.x += slice * (random(vec2(uTime)) - 0.5) * 0.05 * uGlitchIntensity;
        
        // Get base texture with glitched UV
        vec4 texColor = texture2D(uTexture, uv);
        
        // Mix RGB separated channels
        vec3 finalColor = vec3(r, g, b);
        
        // Use original alpha
        float alpha = texColor.a;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  };

  return (
    <group position={[0, 1.8, -2]}>
      <mesh ref={textRef}>
        <planeGeometry args={[8, 2]} />
        <shaderMaterial
          uniforms={glitchShader.uniforms}
          vertexShader={glitchShader.vertexShader}
          fragmentShader={glitchShader.fragmentShader}
          transparent
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SceneContent({ mousePosition, scrollProgress }: { mousePosition: { x: number; y: number }, scrollProgress: number }) {
  const { camera, scene } = useThree();

  useFrame(() => {
    // Camera movements based on scroll
    camera.position.z = 5 + scrollProgress * 2;
    camera.position.y = -scrollProgress * 1;
    
    // Smooth background color transition based on scroll
    // From dark gray (#1a1a1a) to light blue mixed (#4a6a8a)
    const startColor = new THREE.Color(0x1a1a1a); // Dark gray
    const endColor = new THREE.Color(0x4a6a8a);   // Light blue-gray
    
    const currentColor = startColor.clone().lerp(endColor, Math.min(scrollProgress, 1));
    scene.background = currentColor;
    
    // Update fog color to match background
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color = currentColor;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      {/* Background Grid */}
      <BackgroundGrid />
      
      {/* Lighting - Strong contrast setup */}
      {/* Very low ambient light - makes unlit areas dark */}
      <ambientLight intensity={0.15} color="#2a2a3a" />
      
      {/* Main top light - creates strong highlight on head */}
      <directionalLight 
        position={[0, 10, 3]} 
        intensity={5} 
        color="#ffffff"
        castShadow
      />
      
      {/* Front fill light - illuminates face */}
      <directionalLight 
        position={[2, 3, 6]} 
        intensity={2.5} 
        color="#fffbf0" 
      />
      
      {/* Side rim light for depth */}
      <directionalLight 
        position={[-5, 2, -2]} 
        intensity={1.2} 
        color="#4a6080" 
      />
      
      {/* Point light focused on head */}
      <pointLight 
        position={[0, 2, 3]} 
        intensity={2.5} 
        color="#fff8e7" 
        distance={8} 
        decay={2}
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
      shadows
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
        toneMappingExposure: 2.2,
      }}
    >
      <color attach="background" args={['#1a1a1a']} />
      <fog attach="fog" args={['#1a1a1a', 30, 50]} />
      <SceneContent mousePosition={mousePosition} scrollProgress={scrollProgress} />
    </Canvas>
  );
}

