export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform float distortion;
  uniform float rgbShift;
  varying vec2 vUv;

  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    
    // Glitch lines
    float glitchLine = step(0.98, random(vec2(time * 0.001, floor(uv.y * 10.0))));
    uv.x += glitchLine * (random(vec2(time)) - 0.5) * 0.05 * distortion;
    
    // Wave distortion
    float wave = sin(uv.y * 10.0 + time * 2.0) * distortion * 0.01;
    uv.x += wave;
    
    // RGB shift
    float r = texture2D(tDiffuse, uv + vec2(rgbShift * 0.01, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(rgbShift * 0.01, 0.0)).b;
    
    vec3 color = vec3(r, g, b);
    
    // Scanlines
    float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
    color -= scanline;
    
    // Vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

