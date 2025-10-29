# sDOGE Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open in Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

That's it! 🎉

## 🎯 What You'll See

- **Hero Section**: Large "sDOGE" text with 3D Doge model
- **Interactive 3D**: Move your mouse to see the Doge follow your cursor
- **Scroll Effects**: Scroll down to see glitch and distortion effects
- **Header**: Navigation with "STAKE AND EARN" button
- **Ticker**: Bottom bar with scrolling TVL/APR data

## 🎮 Try These Interactions

1. **Move Mouse**: Watch the Doge's head and eyes track your movement
2. **Scroll Down**: See the text and model distort with RGB effects
3. **Keep Scrolling**: Watch elements glitch and dissolve
4. **Click Header Links**: Navigate to different sections
5. **Resize Window**: Check responsive design on mobile

## ⚡ Performance Tips

### If the site is running slow:

1. **Reduce Particle Count**
   - Open `components/ParticleField.tsx`
   - Change `particlesCount = 1000` to `500`

2. **Disable Some Effects**
   - Open `components/Scene3D.tsx`
   - Comment out `<Glitch />` or `<DepthOfField />` components

3. **Lower Post-Processing Quality**
   - In `Scene3D.tsx`, reduce bloom intensity from `0.5` to `0.3`

## 🎨 Quick Customizations

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --yellow: #ffed4e; /* Change to your brand color */
}
```

### Change Navigation Items
Edit `components/Header.tsx`:
```typescript
['HOME', 'DOCS', 'COMMUNITY', 'INVEST'] // Replace with your items
```

### Change Ticker Text
Edit `components/Ticker.tsx`:
```typescript
const tickerText = "Your custom text here";
```

### Use Different 3D Model
1. Place your `.glb` file in `/public/3d/`
2. Edit `components/Scene3D.tsx`:
```typescript
const { scene } = useGLTF('/3d/your-model.glb');
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3D model not loading
- Check the file path is correct: `/public/3d/doge_v_4.glb`
- Verify the file exists and isn't corrupted
- Check browser console for errors

### Scroll not smooth
- Lenis may conflict with other scroll libraries
- Check for errors in console
- Ensure no other smooth scroll scripts are running

### Build errors
```bash
npm run build
```
Check console output for specific errors

## 📱 Mobile Testing

Test on mobile devices:
```bash
# Find your local IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Access from mobile on same network
http://YOUR_IP:3000
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

## 📚 Next Steps

1. **Customize Content**: Replace placeholder text and links
2. **Add Pages**: Create additional pages in `/app` directory
3. **Connect API**: Fetch real TVL/APR data
4. **Add Wallet**: Integrate Web3 wallet connection
5. **SEO**: Update metadata in `app/layout.tsx`

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review component files for inline comments
- Check browser console for error messages
- Ensure all dependencies are installed correctly

## 🎉 You're Ready!

Your sDOGE landing page is now running. Experiment, customize, and make it your own!

---

**Pro Tip**: Open browser DevTools (F12) and go to the Performance tab to monitor frame rates and optimize if needed.

