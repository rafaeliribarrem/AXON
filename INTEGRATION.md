# Webflow Integration Guide

This bundle contains all custom interaction scripts for your Webflow project. The bundle expects external libraries to be loaded via CDN.

## Bundle Information

- **File**: `dist/main.iife.js`
- **Size**: ~25.55 kB (8.04 kB gzipped)
- **Format**: IIFE (Immediately Invoked Function Expression)
- **Target**: ES2015+

## Required External Libraries

The following libraries must be loaded **before** this bundle:

1. **GSAP** (GreenSock Animation Platform)
2. **ScrollTrigger** (GSAP plugin)
3. **Three.js** (for CRT effect)
4. **CDG Anim Framework** (for animations)
5. **Swiper** (for carousel/slider functionality)
6. **Hls.js** (optional, for HLS video playback - only needed if using Bunny player with HLS)

## Installation in Webflow

### Step 1: Add External Libraries

In your Webflow project, go to **Project Settings > Custom Code > Head Code** and add:

```html
<!-- GSAP Core -->
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- GSAP ScrollTrigger Plugin -->
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Three.js (deferred for better initial load performance) -->
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- CDG Anim Framework -->
<script defer src="https://cdn.jsdelivr.net/gh/nshreve/cdg-framework@v1.1.2/anim/cdg-anim.min.js"></script>

<!-- Swiper (for carousels) -->
<script defer src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Hls.js (optional - only needed for HLS video playback) -->
<script defer src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```

### Step 2: Add Your Bundle via JSDelivr

After the external libraries, add your bundled script using JSDelivr:

**Option 1: From GitHub (Recommended)**
```html
<!-- Your Custom Bundle via JSDelivr -->
<script defer src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/dist/main.iife.js"></script>
```

**Option 2: From GitHub Release/Tag (Best for Production)**
```html
<!-- Your Custom Bundle via JSDelivr (versioned) -->
<script defer src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@v1.0.0/dist/main.iife.js"></script>
```

**Replace:**
- `YOUR_USERNAME` - Your GitHub username
- `YOUR_REPO` - Your repository name
- `@main` or `@v1.0.0` - Branch name or release tag

### Step 3: Load Order

The scripts must load in this exact order:

1. GSAP Core
2. ScrollTrigger Plugin
3. Three.js
4. CDG Anim Framework
5. Swiper
6. Hls.js (if using HLS video)
7. Your custom bundle (`main.iife.js`)

**Note:** All scripts use the `defer` attribute for optimal performance. This allows the HTML to parse while scripts download in parallel, and they execute in order after the DOM is ready. This significantly improves initial page load performance.

## Features Included

The bundle includes the following features:

1. **Custom Cursor** - Interactive cursor with hover states
2. **Hamburger Toggle** - Navigation menu icon switching
3. **CRT Effect** - Retro CRT monitor shader overlay (deferred for performance)
4. **Pixelate Reveal** - Scroll-triggered pixelation reveal for images
5. **Typewriter Effect** - Scroll-triggered typewriter text animation
6. **SVG Flash Animation** - Hero title flash and blink effect
7. **Pixel Burst** - Click-triggered particle burst effect
8. **Email Gate** - Scroll-triggered email capture modal with localStorage expiry
9. **Swiper Carousels** - Video and case study carousels
10. **Bunny Player** - Advanced HLS video player with custom controls

**Note:** Page Transitions (grid-based animation) has been removed for performance optimization.

## Required HTML Elements & Attributes

### Custom Cursor
- Element with class `.custom-cursor`

### Hamburger Menu
- Button with class `.nav_1_btn_wrap`
- Menu icon with class `.nav_hamburguer-menu`
- Exit icon with class `.nav_hamburguer-exit`

### Pixelate Reveal
- Images with attribute `data-pixelate-img`

### Typewriter
- Elements with attribute `data-typewriter`
- Optional: `data-text` attribute for custom text

### SVG Flash
- Element with attribute `data-hero-title`

### Pixel Burst
- Elements with attribute `data-pixel-burst` (typically buttons)

### Email Gate
- Hero section with attribute `[data-hero-section]`
- Email gate container with attribute `[data-email-gate]`
- Form block with class `.gate_form-block.w-form`
- Success message with class `.gate_sucess.w-form-done`

### Swiper Carousels
- Video carousel with class `.swiper-videos`
- Case study carousel with class `.swiper-cases`
- Navigation buttons with `[data-swiper="next-video"]`, `[data-swiper="prev-video"]`, etc.
- Pagination elements with `[data-swiper="pagination"]`, `[data-swiper="pagination-case"]`

### Bunny Player
- Player container with attribute `[data-bunny-player-init]`
- Video source via `data-player-src` attribute
- Various control elements with `[data-player-control]`, `[data-player-timeline]`, etc.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ support required
- WebGL support required for CRT effect

## Troubleshooting

### Features Not Working

1. **Check Console**: Open browser DevTools and check for warnings
2. **Verify Load Order**: Ensure external libraries load before the bundle
3. **Check Dependencies**: Verify all required libraries are loaded:
   ```javascript
   console.log(typeof gsap);        // Should be "object"
   console.log(typeof ScrollTrigger); // Should be "object"
   console.log(typeof THREE);       // Should be "object"
   ```

### CRT Effect Not Showing

- Ensure Three.js is loaded
- Check browser WebGL support
- Verify no CSS conflicts with z-index

## Performance Optimizations

The bundle includes several performance optimizations for faster initial page load:

### 1. **Deferred Script Loading**
All external libraries and the bundle use the `defer` attribute, allowing HTML parsing to continue while scripts download.

### 2. **Lazy CRT Effect Initialization**
The Three.js CRT effect (the most expensive operation) is deferred using `requestIdleCallback` or waits until after page load. This prevents blocking the initial render.

### 3. **Conditional Feature Initialization**
Each feature checks if required DOM elements exist before initializing, preventing unnecessary work.

### 4. **Optimized DOM Operations**
- Swiper initialization retry attempts reduced from 20 to 10
- Resize handlers are debounced where needed (150ms)

### 5. **Efficient Event Listeners**
Scroll and touch handlers use passive event listeners where possible for better scrolling performance.

### Performance Impact
These optimizations can reduce initial page load time by 300-800ms depending on device and network conditions.

## Rebuilding

To rebuild the bundle after making changes:

```bash
npm run build
```

The output will be in `dist/main.iife.js`.

## CDN Deployment with JSDelivr

### GitHub Setup

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
     git branch -M main
     git push -u origin main
     ```

3. **Create a Release** (for versioning):
   - Go to your GitHub repo
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0` (or your version)
   - Title: `v1.0.0`
   - Upload `dist/main.iife.js` as a release asset (optional, but recommended)

### JSDelivr URLs

**Latest from main branch:**
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/dist/main.iife.js
```

**Specific version (recommended for production):**
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@v1.0.0/dist/main.iife.js
```

**With minified version (if you add .min.js):**
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/dist/main.iife.min.js
```

### Updating the Bundle

1. Make changes to `src/main.js`
2. Rebuild: `npm run build`
3. Commit and push:
   ```bash
   git add dist/main.iife.js
   git commit -m "Update bundle"
   git push
   ```
4. For versioned releases, create a new GitHub release with the updated file

