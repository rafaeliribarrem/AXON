// Custom Cursor
(function() {
  'use strict';

  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  const defaultCursor = 'https://cdn.prod.website-files.com/68f62fcbc64d17f90e046dfa/6905079459f55e8c6f5dcfbb_cursor-interact.avif';
  const hoverCursor = 'https://cdn.prod.website-files.com/68f62fcbc64d17f90e046dfa/690507948080bd9a825974f5_cursor-auto.avif';

  cursor.style.backgroundImage = `url(${defaultCursor})`;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = (e.clientY + 2) + 'px';
  });

  const interactiveElements = document.querySelectorAll('a, button, input[type="submit"], input[type="button"], select, textarea, .clickable, [onclick]');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.backgroundImage = `url(${hoverCursor})`;
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.backgroundImage = `url(${defaultCursor})`;
    });
  });
})();

// Hamburger Toggle
(function () {
  "use strict";

  function initHamburgerToggle() {
    const button = document.querySelector(".nav_1_btn_wrap");
    const menuIcon = document.querySelector(".nav_hamburguer-menu");
    const exitIcon = document.querySelector(".nav_hamburguer-exit");

    if (!button) {
      console.warn("⚠️ Hamburger toggle: .nav_1_btn_wrap not found");
      return;
    }

    if (!menuIcon || !exitIcon) {
      console.warn(
        "⚠️ Hamburger toggle: Menu or exit icon not found. Expected classes: .nav_hamburguer-menu and .nav_hamburguer-exit"
      );
      return;
    }

    function updateIcons() {
      const isMenuOpen =
        button.classList.contains("w--open") ||
        document.querySelector(".w-nav-menu.w--open") !== null ||
        document.querySelector(".w-nav-overlay.w--open") !== null;

      if (isMenuOpen) {
        menuIcon.style.display = "none";
        exitIcon.style.display = "block";
      } else {
        menuIcon.style.display = "block";
        exitIcon.style.display = "none";
      }
    }
    updateIcons();

    const buttonObserver = new MutationObserver(updateIcons);
    buttonObserver.observe(button, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const menuOverlay = document.querySelector(".w-nav-overlay");
    if (menuOverlay) {
      const overlayObserver = new MutationObserver(updateIcons);
      overlayObserver.observe(menuOverlay, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    const menuElement = document.querySelector(".w-nav-menu");
    if (menuElement) {
      const menuObserver = new MutationObserver(updateIcons);
      menuObserver.observe(menuElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    window.addEventListener("beforeunload", () => {
      buttonObserver.disconnect();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHamburgerToggle);
  } else {
    initHamburgerToggle();
  }
})();

// Page Transition Grid
(function() {
  'use strict';

  function adjustGrid() {
    return new Promise((resolve) => {
      const transition = document.querySelector('.transition');
      if (!transition) {
        resolve();
        return;
      }

      const computedStyle = window.getComputedStyle(transition);
      const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns');
      const columns = gridTemplateColumns.split(' ').length;

      const blockSize = window.innerWidth / columns;
      const rowsNeeded = Math.ceil(window.innerHeight / blockSize);

      transition.style.gridTemplateRows = `repeat(${rowsNeeded}, ${blockSize}px)`;

      const totalBlocks = columns * rowsNeeded;

      transition.innerHTML = '';

      for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.classList.add('transition-block');
        transition.appendChild(block);
      }

      resolve();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Page transitions will not work.');
      return;
    }

    adjustGrid().then(() => {
      let pageLoadTimeline = gsap.timeline({
        onStart: () => {
          gsap.set(".transition", { background: "transparent" });
        },
        onComplete: () => {
          gsap.set(".transition", { display: "none" });
        },
        defaults: {
          ease: "linear"
        }
      });

      pageLoadTimeline.to(".transition-block", {
        opacity: 0,
        duration: 0.1,
        stagger: { amount: 0.75, from: "random" },
      }, 0.5);
    });

    const validLinks = Array.from(document.querySelectorAll("a")).filter(link => {
      const href = link.getAttribute("href") || "";
      const hostname = new URL(link.href, window.location.origin).hostname;

      return (
        hostname === window.location.hostname &&
        !href.startsWith("#") &&
        link.getAttribute("target") !== "_blank" &&
        !link.hasAttribute("data-transition-prevent")
      );
    });

    validLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const destination = link.href;

        gsap.set(".transition", { display: "grid" });
        gsap.fromTo(
          ".transition-block",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.001,
            ease: "linear",
            stagger: { amount: 0.5, from: "random" },
            onComplete: () => {
              window.location.href = destination;
            }
          }
        );
      });
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    });

    window.addEventListener('resize', adjustGrid);
  });
})();

// THREE.JS CRT Effect
(function() {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. CRT effect will not work.');
    return;
  }

  const isMobile = () => window.innerWidth < 768;

  const CONFIG = {
    scanlineOpacity: 0.07,
    scanlineCount: 2000,
    barrelPower: 1.006,
    barrelPowerMobile: 1.0,
    vignetteStrength: 0.5,
    vignetteStrengthMobile: 0,
    vignetteRadius: 0.7,
    vignetteRadiusMobile: 0,
    beamIntensity: 0,
    beamSpeed: 0,
    glowSize: 0,
    noiseAmount: 0.03,
    flickerAmount: 0.004,
    chromaticAberration: 0.1,
    brightness: 1
  };

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    premultipliedAlpha: false,
    antialias: false
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  renderer.domElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999999;
  `;

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      scanlineOpacity: { value: CONFIG.scanlineOpacity },
      scanlineCount: { value: CONFIG.scanlineCount },
      barrelPower: { value: isMobile() ? CONFIG.barrelPowerMobile : CONFIG.barrelPower },
      vignetteStrength: { value: CONFIG.vignetteStrength },
      vignetteRadius: { value: CONFIG.vignetteRadius },
      beamIntensity: { value: CONFIG.beamIntensity },
      beamSpeed: { value: CONFIG.beamSpeed },
      glowSize: { value: CONFIG.glowSize },
      noiseAmount: { value: CONFIG.noiseAmount },
      flickerAmount: { value: CONFIG.flickerAmount },
      chromaticAberration: { value: CONFIG.chromaticAberration },
      brightness: { value: CONFIG.brightness }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float time;
      uniform vec2 resolution;
      uniform float scanlineOpacity;
      uniform float scanlineCount;
      uniform float barrelPower;
      uniform float vignetteStrength;
      uniform float vignetteRadius;
      uniform float beamIntensity;
      uniform float beamSpeed;
      uniform float glowSize;
      uniform float noiseAmount;
      uniform float flickerAmount;
      uniform float chromaticAberration;
      uniform float brightness;

      varying vec2 vUv;

      vec2 barrelDistortion(vec2 coord, float power) {
        vec2 cc = coord - 0.5;
        float dist = dot(cc, cc);
        return coord + cc * dist * power;
      }

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
        vec2 uv = vUv;
        vec2 distortedUV = barrelDistortion(uv, barrelPower - 1.0);

        float edge = 0.0;
        if (distortedUV.x < 0.0 || distortedUV.x > 1.0 ||
            distortedUV.y < 0.0 || distortedUV.y > 1.0) {
          edge = 1.0;
        }

        float scanline = sin(distortedUV.y * scanlineCount) * scanlineOpacity;

        float beamPos = mod(time * beamSpeed, 1.0);
        float beamDist = abs(distortedUV.y - beamPos);
        float beam = smoothstep(glowSize, 0.0, beamDist) * beamIntensity;
        float beamTrail = smoothstep(glowSize * 2.5, glowSize * 0.5, beamDist) * beamIntensity * 0.2;

        float staticNoise = smoothNoise(distortedUV * 800.0 + time * 5.0) * noiseAmount;

        vec2 position = distortedUV - 0.5;
        float dist = length(position);
        float vignette = smoothstep(vignetteRadius, vignetteRadius - 0.3, dist);
        float edgeVignette = smoothstep(0.5, 0.7, dist) * vignetteStrength;

        float flicker = sin(time * 100.0) * flickerAmount;

        float darkness = 0.0;
        darkness += scanline;
        darkness += beam + beamTrail;
        darkness += staticNoise;
        darkness += edgeVignette;
        darkness += flicker;

        darkness *= vignette;
        darkness = mix(darkness, 1.0, edge);
        darkness *= brightness;

        gl_FragColor = vec4(0.0, 0.0, 0.0, darkness);
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    depthWrite: false
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    material.uniforms.resolution.value.set(width, height);

    material.uniforms.barrelPower.value = isMobile()
      ? CONFIG.barrelPowerMobile
      : CONFIG.barrelPower;
  }
  window.addEventListener('resize', onResize);

  function animate(time) {
    material.uniforms.time.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate(0);

  window.crtConfig = CONFIG;
  window.updateCRT = () => {
    Object.keys(CONFIG).forEach(key => {
      if (material.uniforms[key]) {
        material.uniforms[key].value = CONFIG[key];
      }
    });

    material.uniforms.barrelPower.value = isMobile()
      ? CONFIG.barrelPowerMobile
      : CONFIG.barrelPower;
  };
})();

// Pixelate Reveal
(function() {
  'use strict';

  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not loaded. Pixelate reveal will not work.');
      return;
    }

    const images = document.querySelectorAll('[data-pixelate-img]');
    if (images.length === 0) return;

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        pixelateReveal(img);
      } else {
        img.addEventListener('load', () => pixelateReveal(img));
        img.addEventListener('error', () => {
          console.warn('Failed to load image:', img.src);
        });
      }
    });

    function pixelateReveal(img) {
      const wrapper = img.parentElement;
      if (!wrapper) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: '2'
      });

      if (getComputedStyle(wrapper).position === 'static') {
        wrapper.style.position = 'relative';
      }

      img.style.opacity = '0';
      wrapper.appendChild(canvas);

      const pixelSizes = [50, 30, 20, 10, 5, 2, 1];

      drawPixelated(pixelSizes[0]);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      pixelSizes.forEach((size, i) => {
        tl.call(() => drawPixelated(size), null, i * 0.15);
      });

      tl.call(() => {
        canvas.remove();
        img.style.opacity = '1';
      });

      function drawPixelated(pixelSize) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, w, h);

        const smallW = Math.max(1, Math.ceil(w / pixelSize));
        const smallH = Math.max(1, Math.ceil(h / pixelSize));

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = smallW;
        tempCanvas.height = smallH;

        tempCtx.drawImage(img, 0, 0, smallW, smallH);
        ctx.drawImage(tempCanvas, 0, 0, w, h);
      }
    }
  });
})();

// Typewriter Effect
(function() {
  'use strict';

  console.log('Typewriter + ScrollTrigger loaded');

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not loaded. Typewriter effect will not work.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    function retroType(element, speed = 15) {
      const text = element.getAttribute('data-text') || element.textContent;
      const chars = text.split('');

      const originalHeight = element.offsetHeight;
      const originalWidth = element.offsetWidth;

      element.style.minHeight = `${originalHeight}px`;
      element.style.minWidth = `${originalWidth}px`;
      element.style.display = 'inline-block';

      element.textContent = '';
      element.style.visibility = 'visible';

      console.log(`Typing: "${text}"`);

      let index = 0;

      function typeChar() {
        if (index < chars.length) {
          element.textContent += chars[index];
          index++;

          const variation = Math.random() * 10 - 5;
          setTimeout(typeChar, speed + variation);
        } else {
          console.log('Typing complete!');
        }
      }

      setTimeout(typeChar, 100);
    }

    const elements = document.querySelectorAll('[data-typewriter]');
    console.log(`Found ${elements.length} typewriter elements`);

    elements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          console.log('Element in view - starting typewriter');
          retroType(el, 15);
        },
      });
    });
  });
})();

// SVG Flash Animation
(function() {
  'use strict';

  function animateSVGFlash() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not loaded. SVG flash animation will not work.');
      return;
    }

    const svg = document.querySelector('[data-hero-title]');
    if (!svg) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 80%',
        once: true
      }
    });

    gsap.set(svg, {
      opacity: 0,
      scale: 1.2,
      filter: 'brightness(0)'
    });

    tl
      .to(svg, { opacity: 1, filter: 'brightness(3)', duration: 0.05 })
      .to(svg, { opacity: 0, filter: 'brightness(0)', duration: 0.03 })
      .to(svg, { opacity: 1, filter: 'brightness(3)', duration: 0.05 })
      .to(svg, { opacity: 0, filter: 'brightness(0)', duration: 0.03 })
      .to(svg, { opacity: 1, filter: 'brightness(3)', duration: 0.05 })
      .to(svg, {
        scale: 1,
        filter: 'brightness(1)',
        duration: 0.4,
        ease: 'power2.out'
      });

    gsap.fromTo(svg,
      { opacity: 1 },
      {
        opacity: 0.4,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
        delay: 2
      }
    );
  }

  window.addEventListener('DOMContentLoaded', animateSVGFlash);
})();

// Pixel Burst Effect
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Pixel burst effect will not work.');
      return;
    }

    function pixelBurst(x, y) {
      const colors = ['#ffff00', '#ffaa00', '#ff6600', '#ffffff', '#ffdd00'];
      const particleCount = 8;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (360 / particleCount) * i + (Math.random() * 30 - 15);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() > 0.5 ? 8 : 6;

        particle.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          box-shadow: 0 0 4px ${color};
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          z-index: 9999;
        `;

        document.body.appendChild(particle);

        const distance = 40 + Math.random() * 40;
        const radians = angle * Math.PI / 180;

        gsap.to(particle, {
          x: Math.cos(radians) * distance,
          y: Math.sin(radians) * distance + 20,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: 'steps(8)',
          onComplete: () => particle.remove()
        });
      }
    }

    document.querySelectorAll('[data-pixel-burst]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        pixelBurst(e.clientX, e.clientY);
      });
    });
  });
})();

