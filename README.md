# sDOGE - Interactive 3D Landing Page

A stunning, interactive landing page featuring a 3D Doge model with advanced WebGL effects, scroll-based animations, and glitch transitions.

## 🎨 Features

- **3D Interactive Doge Model**: Eye and head tracking that follows mouse movements
- **Scroll-Based Effects**: Pierre.co-inspired distortion and deformation effects
- **RGB/Chromatic Aberration**: Glitchy CRT-style visual effects
- **Post-Processing Pipeline**: Bloom, depth of field, and glitch effects
- **Smooth Scrolling**: Lenis-powered smooth scroll experience
- **Particle System**: Dynamic particle field that reacts to scroll
- **Animated Ticker**: Infinite scrolling ticker with TVL and APR data
- **Responsive Design**: Fully responsive with mobile menu
- **Loading Screen**: Animated loading experience
- **Advanced Typography**: Google Fonts (Inter, Space Grotesk, Orbitron)

## 🚀 Tech Stack

- **Next.js 16** - React framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **React Three Postprocessing** - Post-processing effects
- **GSAP** - Professional-grade animation
- **Framer Motion** - React animation library
- **Lenis** - Smooth scroll library
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript** - Type safety

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Development

Open [http://localhost:3000](http://localhost:3000) to view the project.

The page will reload when you make changes. You may also see lint errors in the console.

## 📁 Project Structure

```
sdoge/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Ticker.tsx          # Bottom ticker bar
│   ├── Scene3D.tsx         # Three.js scene
│   ├── HeroText.tsx        # Hero text with effects
│   ├── ParticleField.tsx   # Particle system
│   ├── ScrollIndicator.tsx # Scroll hint
│   ├── LoadingScreen.tsx   # Loading animation
│   ├── SmoothScroll.tsx    # Lenis wrapper
│   ├── GlitchBackground.tsx # Glitch shader
│   └── shaders/
│       └── GlitchShader.ts # Custom GLSL shaders
├── hooks/
│   ├── useMousePosition.ts # Mouse tracking hook
│   └── useScrollProgress.ts # Scroll tracking hook
└── public/
    └── 3d/
        ├── doge_v_4.glb    # 3D Doge model
        └── doge_v_4.gltf   # 3D Doge model (GLTF)
```

## 🎮 Features Breakdown

### 3D Scene
- **Mouse Tracking**: Doge's head and eyes follow cursor movement
- **Scroll Deformation**: Mesh distortion based on scroll position and velocity
- **Dynamic Lighting**: Multiple light sources including spot, directional, and point lights
- **Material Enhancement**: Custom material properties for realistic appearance

### Visual Effects
- **Bloom**: Glow effect on bright areas
- **Chromatic Aberration**: RGB color separation
- **Depth of Field**: Cinematic focus effect
- **Glitch Effect**: Sporadic glitch distortion
- **Particle Field**: 1000+ particles with scroll-reactive behavior

### Scroll Effects
- **Text Distortion**: Hero text warps and stretches
- **RGB Shift**: Chromatic aberration increases with scroll
- **Camera Movement**: Parallax camera transitions
- **Progress Bar**: Visual scroll progress indicator
- **Dissolve Transition**: Elements fade and glitch out

### UI Components
- **Responsive Header**: Desktop and mobile navigation
- **Animated Buttons**: Hover and tap animations
- **Infinite Ticker**: Seamless looping data display
- **Loading Screen**: Progress-based loading animation

## 🛠️ Customization

### Modify 3D Model
Replace `/public/3d/doge_v_4.glb` with your own model. Update the path in `Scene3D.tsx`:

```typescript
const { scene } = useGLTF('/3d/your-model.glb');
```

### Adjust Colors
Edit the color scheme in `app/globals.css`:

```css
:root {
  --background: #000000;
  --foreground: #ffffff;
  --yellow: #ffed4e; /* Main accent color */
}
```

### Modify Ticker Content
Update the ticker text in `components/Ticker.tsx`:

```typescript
const tickerText = "Your custom text here";
```

### Change Fonts
Update fonts in `app/layout.tsx` using any Google Font:

```typescript
import { YourFont } from "next/font/google";
```

## 🎨 Effects Configuration

### Bloom Intensity
```typescript
<Bloom
  intensity={0.5} // Adjust 0-2
  luminanceThreshold={0.2}
  luminanceSmoothing={0.9}
/>
```

### Glitch Strength
```typescript
<Glitch
  delay={[1.5, 3.5]} // Time between glitches
  duration={[0.1, 0.3]} // Glitch duration
  strength={[0.2, 0.4]} // Distortion strength
/>
```

### Scroll Speed
```typescript
// In SmoothScroll.tsx
const lenis = new Lenis({
  duration: 1.2, // Adjust scroll duration
  wheelMultiplier: 1, // Mouse wheel sensitivity
});
```

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Performance Tips

1. **3D Model Optimization**: Keep GLB files under 5MB
2. **Particle Count**: Reduce from 1000 if performance is poor
3. **Post-Processing**: Disable effects on low-end devices
4. **Images**: Use WebP format for better compression

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Three.js
