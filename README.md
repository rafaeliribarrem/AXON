# AXON Webflow Bundle

CDN-ready bundle for custom Webflow interactions and animations.

## Quick Start

### Build

```bash
npm install
npm run build
```

The bundle will be generated in `dist/main.iife.js`.

### Deploy to JSDelivr

1. Push to GitHub
2. Create a release (optional, for versioning)
3. Use JSDelivr URL in Webflow:

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/dist/main.iife.js"></script>
```

## Features

- Custom cursor with hover states
- Hamburger menu toggle
- Page transition effects
- CRT monitor shader overlay
- Pixelate image reveal
- Typewriter text animation
- SVG flash animations
- Pixel burst particle effects

## Dependencies

This bundle expects the following libraries to be loaded via CDN:

- GSAP (GreenSock)
- ScrollTrigger (GSAP plugin)
- Three.js
- CDG Anim Framework

See `INTEGRATION.md` for complete setup instructions.

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview (if needed)
npm run preview
```

## License

MIT

