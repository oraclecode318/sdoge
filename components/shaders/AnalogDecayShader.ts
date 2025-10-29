export const AnalogDecayShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uGrain: { value: 0.3 },
    uScanlines: { value: 0.5 },
    uVignette: { value: 0.8 },
    uJitter: { value: 0.2 },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uScanlines;
    uniform float uVignette;
    uniform float uJitter;
    varying vec2 vUv;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Analog jitter
      float jitterAmount = (random(vec2(floor(uTime * 60.0))) - 0.5) * 0.002 * uJitter;
      uv.x += jitterAmount;
      
      // Sample texture
      vec4 color = texture2D(tDiffuse, uv);
      
      // Film grain
      float grain = random(uv * uTime) * uGrain;
      color.rgb += grain * 0.1;
      
      // Scanlines
      float scanline = sin(uv.y * 800.0) * 0.04 * uScanlines;
      color.rgb -= scanline;
      
      // Vignette
      vec2 vignetteUV = (uv - 0.5) * 2.0;
      float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uVignette;
      color.rgb *= vignette;
      
      gl_FragColor = color;
    }
  `
};

