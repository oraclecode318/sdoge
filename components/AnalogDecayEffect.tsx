'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, forwardRef, useEffect } from 'react';
import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const fragmentShader = `
  uniform float uTime;
  uniform float uGrain;
  uniform float uScanlines;
  uniform float uVignette;
  uniform float uJitter;
  uniform float uBleeding;
  uniform float uVSync;
  uniform float uIntensity;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 distortedUV = uv;
    
    // Analog Jitter - temporal instability
    float jitterAmount = (random(vec2(floor(uTime * 60.0))) - 0.5) * 0.003 * uJitter * uIntensity;
    distortedUV.x += jitterAmount;
    distortedUV.y += (random(vec2(floor(uTime * 30.0) + 1.0)) - 0.5) * 0.001 * uJitter * uIntensity;
    
    // VHS-style vertical sync roll
    float vsyncRoll = sin(uTime * 2.0 + uv.y * 100.0) * 0.02 * uVSync * uIntensity;
    float vsyncChance = step(0.95, random(vec2(floor(uTime * 4.0))));
    distortedUV.y += vsyncRoll * vsyncChance;
    
    vec4 color = inputColor;
    
    // Film grain
    float grain = random(distortedUV * uTime) * 0.075 * uGrain * uIntensity;
    color.rgb += grain;
    
    // Scanlines
    float scanlineFreq = 600.0 + uScanlines * 400.0;
    float scanlinePattern = sin(uv.y * scanlineFreq) * 0.5 + 0.5;
    float scanlineIntensity = 0.1 * uScanlines * uIntensity;
    color.rgb *= (1.0 - scanlinePattern * scanlineIntensity);
    
    // Horizontal lines
    float horizontalLines = sin(uv.y * scanlineFreq * 0.1) * 0.02 * uScanlines * uIntensity;
    color.rgb *= (1.0 - horizontalLines);
    
    // Vignetting
    vec2 vignetteUV = (uv - 0.5) * 2.0;
    float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uVignette * uIntensity;
    color.rgb *= vignette;
    
    outputColor = color;
  }
`;

class AnalogDecayEffectImpl extends Effect {
  constructor() {
    super('AnalogDecayEffect', fragmentShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uGrain', new Uniform(0.4)],        // Reduced from 0.35
        ['uBleeding', new Uniform(0.0)],
        ['uVSync', new Uniform(0.8)],
        ['uScanlines', new Uniform(0.9)],    // Reduced from 0.8
        ['uVignette', new Uniform(0.9)],     // Reduced from 0.9
        ['uJitter', new Uniform(0.3)],
        ['uIntensity', new Uniform(0.5)],    // Reduced from 0.5
      ]),
    });
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    (this.uniforms.get('uTime') as Uniform).value += deltaTime;
  }
}

const AnalogDecayEffect = forwardRef<any, {}>((props, ref) => {
  const effect = useRef<AnalogDecayEffectImpl | null>(null);

  useEffect(() => {
    effect.current = new AnalogDecayEffectImpl();
    return () => {
      effect.current?.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    if (effect.current) {
      effect.current.update(null, null, delta);
    }
  });

  if (!effect.current) return null;

  return <primitive ref={ref} object={effect.current} dispose={null} />;
});

AnalogDecayEffect.displayName = 'AnalogDecayEffect';

export default AnalogDecayEffect;

