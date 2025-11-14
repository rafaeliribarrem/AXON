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

  const interactiveElements = document.querySelectorAll('a, button, label, .articles_cms_radio, input[type="submit"], input[type="button"], input[type="radio"], select, textarea, .clickable, [onclick]');

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
      return;
    }

    if (!menuIcon || !exitIcon) {
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

// Page Transition Grid (DISABLED)
// This feature has been removed for performance optimization

// THREE.JS CRT Effect
(function() {
  'use strict';

  function initCRTEffect() {
    if (typeof THREE === 'undefined') {
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
  }

  // Defer CRT initialization for better initial page load performance
  if (window.requestIdleCallback) {
    requestIdleCallback(initCRTEffect, { timeout: 2000 });
  } else {
    // Fallback: initialize after page load
    if (document.readyState === 'complete') {
      setTimeout(initCRTEffect, 100);
    } else {
      window.addEventListener('load', () => setTimeout(initCRTEffect, 100));
    }
  }
})();

// Pixelate Reveal
(function() {
  'use strict';

  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    const images = document.querySelectorAll('[data-pixelate-img]');
    if (images.length === 0) return;

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        pixelateReveal(img);
      } else {
        img.addEventListener('load', () => pixelateReveal(img));
      }
    });

    function pixelateReveal(img) {
      const wrapper = img.parentElement;
      if (!wrapper) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      // Limit canvas size for better performance (max 2000px)
      const maxSize = 2000;
      let canvasWidth = img.naturalWidth;
      let canvasHeight = img.naturalHeight;

      if (canvasWidth > maxSize || canvasHeight > maxSize) {
        const ratio = Math.min(maxSize / canvasWidth, maxSize / canvasHeight);
        canvasWidth = Math.floor(canvasWidth * ratio);
        canvasHeight = Math.floor(canvasHeight * ratio);
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

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

      // Reduced steps from 7 to 4 for better performance
      const pixelSizes = [40, 15, 5, 1];

      drawPixelated(pixelSizes[0]);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      // Faster timing: 0.1s between steps instead of 0.15s
      pixelSizes.forEach((size, i) => {
        tl.call(() => drawPixelated(size), null, i * 0.1);
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

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
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

      let index = 0;

      function typeChar() {
        if (index < chars.length) {
          element.textContent += chars[index];
          index++;

          const variation = Math.random() * 10 - 5;
          setTimeout(typeChar, speed + variation);
        }
      }

      setTimeout(typeChar, 100);
    }

    const elements = document.querySelectorAll('[data-typewriter]');

    elements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
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

// Email Gate and Swiper
(function() {
  'use strict';

  const EMAIL_GATE_CONFIG = {
    storageKey: 'emailGateSubmitted',
    expiryDays: 7,
    hideDelay: 4000,
    animationDelay: 300,
    triggerThreshold: 0.5,
    scrollThrottleMs: 100
  };

  const SWIPER_CONFIG = {
    videos: {
      selector: '.swiper-videos',
      navigation: {
        nextEl: '[data-swiper="next-video"]',
        prevEl: '[data-swiper="prev-video"]'
      },
      pagination: {
        el: '[data-swiper="pagination"]'
      },
      breakpoints: {
        478: { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 1, spaceBetween: 0 },
        992: { slidesPerView: 1, spaceBetween: 0 }
      },
      slidesPerView: 1,
      spaceBetween: 0
    },
    cases: {
      selector: '.swiper-cases',
      navigation: {
        nextEl: '[data-swiper="next-case"]',
        prevEl: '[data-swiper="prev-case"]'
      },
      pagination: {
        el: '[data-swiper="pagination-case"]'
      },
      breakpoints: {
        478: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 1, spaceBetween: 16 },
        992: { slidesPerView: 2, spaceBetween: 16 }
      },
      slidesPerView: 1,
      spaceBetween: 20
    }
  };

  const SWIPER_RETRY_DELAY = 200;
  const SWIPER_MAX_ATTEMPTS = 10; // Reduced from 20 for better performance
  let swiperObserver = null;
  let swiperWaitStarted = false;

  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function saveWithExpiry(config) {
    const now = new Date();
    const item = {
      value: true,
      expiry: now.getTime() + (config.expiryDays * 24 * 60 * 60 * 1000)
    };

    try {
      localStorage.setItem(config.storageKey, JSON.stringify(item));
      return true;
    } catch (e) {
      console.error('❌ Failed to save:', e);
      return false;
    }
  }

  function checkWithExpiry(config) {
    try {
      const itemStr = localStorage.getItem(config.storageKey);

      if (!itemStr) {
        return false;
      }

      if (itemStr === 'true') {
        saveWithExpiry(config);
        return true;
      }

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(config.storageKey);
        return false;
      }

      return item.value === true;

    } catch (e) {
      return false;
    }
  }

  function initSwiper(config, name) {
    if (typeof window.Swiper === 'undefined') {
      return null;
    }

    const container = document.querySelector(config.selector);
    if (!container) {
      return null;
    }

    if (container.dataset.swiperInitialized === 'true' && container.swiper) {
      return container.swiper;
    }

    const swiperConfig = {
      slidesPerView: config.slidesPerView,
      spaceBetween: config.spaceBetween,
      loop: false,
      speed: 600,
      navigation: {
        nextEl: config.navigation.nextEl,
        prevEl: config.navigation.prevEl,
        disabledClass: 'is-disabled'
      },
      pagination: {
        el: config.pagination.el,
        clickable: true,
        bulletClass: 'swiper_bullet',
        bulletActiveClass: 'is-active',
        renderBullet: function (index, className) {
          return `<button class="${className}" aria-label="Slide ${index + 1}"></button>`;
        }
      },
      breakpoints: config.breakpoints,
      keyboard: {
        enabled: true
      },
      watchOverflow: true
    };

    const instance = new window.Swiper(container, swiperConfig);
    container.dataset.swiperInitialized = 'true';
    return instance;
  }

  function initEmailGate() {
    const hero = document.querySelector('[data-hero-section]');
    const gate = document.querySelector('[data-email-gate]');
    const formBlock = gate?.querySelector('.gate_form-block.w-form');
    const successMessage = gate?.querySelector('.gate_sucess.w-form-done');

    if (!hero || !gate || !formBlock) {
      console.error('❌ Missing required elements');
      return;
    }

    if (checkWithExpiry(EMAIL_GATE_CONFIG)) {
      gate.style.display = 'none';
      return;
    }

    let savedScrollPosition = 0;
    let scrollTriggered = false;
    let successHandled = false;
    let checkInterval;

    gate.style.display = 'none';

    window.showEmailGate = () => {
      savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      gate.style.display = 'flex';

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${savedScrollPosition}px`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gate.classList.add('active');
        });
      });
    };

    window.hideEmailGate = () => {
      gate.classList.remove('active');

      setTimeout(() => {
        gate.style.display = 'none';

        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('top');

        window.scrollTo({
          top: savedScrollPosition,
          behavior: 'auto'
        });
      }, EMAIL_GATE_CONFIG.animationDelay);
    };

    window.handleEmailSuccess = () => {
      if (successHandled) return;
      successHandled = true;

      saveWithExpiry(EMAIL_GATE_CONFIG);

      setTimeout(() => {
        window.hideEmailGate();
      }, EMAIL_GATE_CONFIG.hideDelay);
    };

    const observeSuccess = new MutationObserver(() => {
      if (successHandled) return;

      const hasClass = formBlock.classList.contains('w-form-done');
      const messageVisible = successMessage
        ? window.getComputedStyle(successMessage).display !== 'none'
        : false;

      if (hasClass || messageVisible) {
        window.handleEmailSuccess();
        observeSuccess.disconnect();
      }
    });

    observeSuccess.observe(formBlock, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    if (successMessage) {
      observeSuccess.observe(successMessage, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    const checkSuccess = () => {
      if (successHandled) return;

      const hasClass = formBlock.classList.contains('w-form-done');
      const messageVisible = successMessage
        ? window.getComputedStyle(successMessage).display !== 'none'
        : false;

      if (hasClass || messageVisible) {
        window.handleEmailSuccess();
        if (checkInterval) clearInterval(checkInterval);
      }
    };

    const checkScrollPastHero = () => {
      if (scrollTriggered) return;

      const heroRect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * EMAIL_GATE_CONFIG.triggerThreshold;

      if (heroRect.bottom <= triggerPoint) {
        scrollTriggered = true;

        window.showEmailGate();

        checkInterval = setInterval(checkSuccess, 300);

        window.removeEventListener('scroll', throttledScrollHandler);
        window.removeEventListener('wheel', throttledScrollHandler);
        window.removeEventListener('touchmove', throttledScrollHandler);
      }
    };

    const throttledScrollHandler = throttle(checkScrollPastHero, EMAIL_GATE_CONFIG.scrollThrottleMs);

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('wheel', throttledScrollHandler, { passive: true });
    window.addEventListener('touchmove', throttledScrollHandler, { passive: true });

    checkScrollPastHero();
  }

  function initSwipers() {
    initSwiper(SWIPER_CONFIG.videos, 'videos');
    initSwiper(SWIPER_CONFIG.cases, 'cases');
  }

  function observeSwiperContainers() {
    if (swiperObserver || typeof MutationObserver === 'undefined') {
      return;
    }

    swiperObserver = new MutationObserver(() => {
      initSwipers();
    });

    swiperObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function waitForSwiper(attempt = 0) {
    if (typeof window.Swiper === 'undefined') {
      if (attempt >= SWIPER_MAX_ATTEMPTS) {
        return;
      }

      setTimeout(() => waitForSwiper(attempt + 1), SWIPER_RETRY_DELAY);
      return;
    }

    initSwipers();
    observeSwiperContainers();
  }

  function init() {
    window.addEventListener('load', initEmailGate);

    const startSwiperWait = () => {
      if (swiperWaitStarted) return;
      swiperWaitStarted = true;
      waitForSwiper();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startSwiperWait);
    } else {
      startSwiperWait();
    }

    window.addEventListener('load', startSwiperWait);
  }

  init();
})();

// Bunny Player
(function() {
  'use strict';

  function initBunnyPlayer() {
    var players = document.querySelectorAll('[data-bunny-player-init]');

    if (players.length === 0) {
      return;
    }

    players.forEach(function(player) {
      var src = player.getAttribute('data-player-src');
      if (!src) {
        return;
      }

      var video = player.querySelector('video');
      if (!video) {
        return;
      }

      try {
        if (!video.paused) video.pause();
      } catch(e) {
        // Ignore pause errors
      }

      // Don't remove src if it's already set and working
      if (video.src && video.src !== src) {
        try {
          video.removeAttribute('src');
          video.load();
        } catch(e) {
          // Ignore reset errors
        }
      }

      function setStatus(s) {
        if (player.getAttribute('data-player-status') !== s) {
          player.setAttribute('data-player-status', s);
        }
      }
      function setMutedState(v) {
        video.muted = !!v;
        player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
      }
      function setFsAttr(v) { player.setAttribute('data-player-fullscreen', v ? 'true' : 'false'); }
      function setActivated(v) { player.setAttribute('data-player-activated', v ? 'true' : 'false'); }
      if (!player.hasAttribute('data-player-activated')) setActivated(false);

      // Set initial status
      if (!player.hasAttribute('data-player-status')) {
        setStatus('idle');
      }

      var timeline = player.querySelector('[data-player-timeline]');
      var progressBar = player.querySelector('[data-player-progress]');
      var bufferedBar = player.querySelector('[data-player-buffered]');
      var handle = player.querySelector('[data-player-timeline-handle]');
      var timeDurationEls = player.querySelectorAll('[data-player-time-duration]');
      var timeProgressEls = player.querySelectorAll('[data-player-time-progress]');

      var updateSize = player.getAttribute('data-player-update-size');
      var lazyMode = player.getAttribute('data-player-lazy');
      var isLazyTrue = lazyMode === 'true';
      var isLazyMeta = lazyMode === 'meta';
      var autoplay = player.getAttribute('data-player-autoplay') === 'true';
      var initialMuted = player.getAttribute('data-player-muted') === 'true';

      var pendingPlay = false;

      if (autoplay) { setMutedState(true); video.loop = true; } else { setMutedState(initialMuted); }

      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.playsInline = true;
      if (typeof video.disableRemotePlayback !== 'undefined') video.disableRemotePlayback = true;
      if (autoplay) video.autoplay = false;

      var isSafariNative = !!video.canPlayType('application/vnd.apple.mpegurl');
      var canUseHlsJs = !!(window.Hls && Hls.isSupported()) && !isSafariNative;

      if (updateSize === 'true' && !isLazyMeta) {
        if (isLazyTrue) {
          // Do nothing
        } else {
          var prev = video.preload;
          video.preload = 'metadata';
          var onMeta2 = function() {
            setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
            video.removeEventListener('loadedmetadata', onMeta2);
            video.preload = prev || '';
          };
          video.addEventListener('loadedmetadata', onMeta2, { once: true });
          video.src = src;
        }
      }

      function fetchMetaOnce() {
        getSourceMeta(src, canUseHlsJs).then(function(meta){
          if (meta.width && meta.height) setBeforeRatio(player, updateSize, meta.width, meta.height);
          if (timeDurationEls.length && isFinite(meta.duration) && meta.duration > 0) {
            setText(timeDurationEls, formatTime(meta.duration));
          }
          readyIfIdle(player, pendingPlay);
        });
      }

      var isAttached = false;
      var userInteracted = false;
      var lastPauseBy = '';
      function attachMediaOnce() {
        if (isAttached) {
          return;
        }
        isAttached = true;

        if (player._hls) {
          try {
            player._hls.destroy();
          } catch(e) {
            // Ignore HLS destruction errors
          }
          player._hls = null;
        }

        if (isSafariNative) {
          video.preload = (isLazyTrue || isLazyMeta) ? 'auto' : video.preload;
          video.src = src;
          video.addEventListener('loadedmetadata', function() {
            readyIfIdle(player, pendingPlay);
            if (updateSize === 'true') setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
            if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
          }, { once: true });
        } else if (canUseHlsJs) {
          try {
            var hls = new Hls({ maxBufferLength: 10 });
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, function() {
              hls.loadSource(src);
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              readyIfIdle(player, pendingPlay);
              if (updateSize === 'true') {
                var lvls = hls.levels || [];
                var best = bestLevel(lvls);
                if (best && best.width && best.height) setBeforeRatio(player, updateSize, best.width, best.height);
              }
            });
            hls.on(Hls.Events.LEVEL_LOADED, function(e, data) {
              if (data && data.details && isFinite(data.details.totalduration)) {
                if (timeDurationEls.length) setText(timeDurationEls, formatTime(data.details.totalduration));
              }
            });
            hls.on(Hls.Events.ERROR, function(event, data) {
              console.error('❌ Bunny Player: HLS error', data);
              if (data.fatal) {
                switch(data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error('❌ Bunny Player: Network error, trying to recover');
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error('❌ Bunny Player: Media error, trying to recover');
                    hls.recoverMediaError();
                    break;
                  default:
                    console.error('❌ Bunny Player: Fatal error, destroying HLS');
                    hls.destroy();
                    break;
                }
              }
            });
            player._hls = hls;
          } catch(e) {
            console.error('❌ Bunny Player: Error initializing HLS:', e);
            // Fallback to direct src
            video.src = src;
          }
        } else {
          video.src = src;
        }
      }

      if (isLazyMeta) {
        fetchMetaOnce();
        video.preload = 'none';
      } else if (isLazyTrue) {
        video.preload = 'none';
      } else {
        attachMediaOnce();
      }

      function togglePlay() {
        userInteracted = true;
        if (video.paused || video.ended) {
          if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
          pendingPlay = true;
          lastPauseBy = '';
          setStatus('loading');
          safePlay(video);
        } else {
          lastPauseBy = 'manual';
          video.pause();
        }
      }

      function toggleMute() {
        video.muted = !video.muted;
        player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
      }

      function isFsActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
      function enterFullscreen() {
        if (player.requestFullscreen) return player.requestFullscreen();
        if (video.requestFullscreen) return video.requestFullscreen();
        if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === 'function') return video.webkitEnterFullscreen();
      }
      function exitFullscreen() {
        if (document.exitFullscreen) return document.exitFullscreen();
        if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        if (video.webkitDisplayingFullscreen && typeof video.webkitExitFullscreen === 'function') return video.webkitExitFullscreen();
      }
      function toggleFullscreen() { if (isFsActive() || video.webkitDisplayingFullscreen) exitFullscreen(); else enterFullscreen(); }
      document.addEventListener('fullscreenchange', function() { setFsAttr(isFsActive()); });
      document.addEventListener('webkitfullscreenchange', function() { setFsAttr(isFsActive()); });
      video.addEventListener('webkitbeginfullscreen', function() { setFsAttr(true); });
      video.addEventListener('webkitendfullscreen', function() { setFsAttr(false); });

      player.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-player-control]');
        if (!btn || !player.contains(btn)) return;
        var type = btn.getAttribute('data-player-control');
        if (type === 'play' || type === 'pause' || type === 'playpause') togglePlay();
        else if (type === 'mute') toggleMute();
        else if (type === 'fullscreen') toggleFullscreen();
      });

      function updateTimeTexts() {
        if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
        if (timeProgressEls.length) setText(timeProgressEls, formatTime(video.currentTime));
      }
      video.addEventListener('timeupdate', updateTimeTexts);
      video.addEventListener('loadedmetadata', function(){ updateTimeTexts(); maybeSetRatioFromVideo(player, updateSize, video); });
      video.addEventListener('loadeddata', function(){ maybeSetRatioFromVideo(player, updateSize, video); });
      video.addEventListener('playing', function(){ maybeSetRatioFromVideo(player, updateSize, video); });
      video.addEventListener('durationchange', updateTimeTexts);

      var rafId;
      function updateProgressVisuals() {
        if (!video.duration) return;
        var playedPct = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + playedPct) + '%)';
        if (handle) handle.style.left = playedPct + '%';
      }
      function loop() {
        updateProgressVisuals();
        if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
      }

      function updateBufferedBar() {
        if (!bufferedBar || !video.duration || !video.buffered.length) return;
        var end = video.buffered.end(video.buffered.length - 1);
        var buffPct = (end / video.duration) * 100;
        bufferedBar.style.transform = 'translateX(' + (-100 + buffPct) + '%)';
      }
      video.addEventListener('progress', updateBufferedBar);
      video.addEventListener('loadedmetadata', updateBufferedBar);
      video.addEventListener('durationchange', updateBufferedBar);

      video.addEventListener('play', function() {
        setActivated(true);
        cancelAnimationFrame(rafId);
        loop();
        setStatus('playing');
      });
      video.addEventListener('playing', function() {
        pendingPlay = false;
        setStatus('playing');
      });
      video.addEventListener('pause', function() {
        pendingPlay = false;
        cancelAnimationFrame(rafId);
        updateProgressVisuals();
        setStatus('paused');
      });
      video.addEventListener('waiting', function() {
        setStatus('loading');
      });
      video.addEventListener('canplay', function() {
        readyIfIdle(player, pendingPlay);
      });
      video.addEventListener('ended', function() {
        pendingPlay = false;
        cancelAnimationFrame(rafId);
        updateProgressVisuals();
        setStatus('paused');
        setActivated(false);
      });
      video.addEventListener('error', function(e) {
        console.error('❌ Bunny Player: Video error', e);
        console.error('❌ Bunny Player: Error code:', video.error ? video.error.code : 'unknown');
        console.error('❌ Bunny Player: Error message:', video.error ? video.error.message : 'unknown');
        setStatus('error');
      });
      video.addEventListener('loadstart', function() {
        setStatus('loading');
      });
      video.addEventListener('loadeddata', function() {
        // Data loaded
      });

      if (timeline) {
        var dragging = false, wasPlaying = false, targetTime = 0, lastSeekTs = 0, seekThrottle = 180, rect = null;
        window.addEventListener('resize', function() { if (!dragging) rect = null; });
        function getFractionFromX(x) {
          if (!rect) rect = timeline.getBoundingClientRect();
          var f = (x - rect.left) / rect.width; if (f < 0) f = 0; if (f > 1) f = 1; return f;
        }
        function previewAtFraction(f) {
          if (!video.duration) return;
          var pct = f * 100;
          if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + pct) + '%)';
          if (handle) handle.style.left = pct + '%';
          if (timeProgressEls.length) setText(timeProgressEls, formatTime(f * video.duration));
        }
        function maybeSeek(now) {
          if (!video.duration) return;
          if ((now - lastSeekTs) < seekThrottle) return;
          lastSeekTs = now; video.currentTime = targetTime;
        }
        function onPointerDown(e) {
          if (!video.duration) return;
          dragging = true; wasPlaying = !video.paused && !video.ended; if (wasPlaying) video.pause();
          player.setAttribute('data-timeline-drag', 'true'); rect = timeline.getBoundingClientRect();
          var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now());
          timeline.setPointerCapture && timeline.setPointerCapture(e.pointerId);
          window.addEventListener('pointermove', onPointerMove, { passive: false });
          window.addEventListener('pointerup', onPointerUp, { passive: true });
          e.preventDefault();
        }
        function onPointerMove(e) {
          if (!dragging) return;
          var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now()); e.preventDefault();
        }
        function onPointerUp() {
          if (!dragging) return;
          dragging = false; player.setAttribute('data-timeline-drag', 'false'); rect = null; video.currentTime = targetTime;
          if (wasPlaying) safePlay(video); else { updateProgressVisuals(); updateTimeTexts(); }
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        }
        timeline.addEventListener('pointerdown', onPointerDown, { passive: false });
        if (handle) handle.addEventListener('pointerdown', onPointerDown, { passive: false });
      }

      var hoverTimer;
      var hoverHideDelay = 3000;
      function setHover(state) {
        if (player.getAttribute('data-player-hover') !== state) {
          player.setAttribute('data-player-hover', state);
        }
      }
      function scheduleHide() { clearTimeout(hoverTimer); hoverTimer = setTimeout(function() { setHover('idle'); }, hoverHideDelay); }
      function wakeControls() { setHover('active'); scheduleHide(); }
      player.addEventListener('pointerdown', wakeControls);
      document.addEventListener('fullscreenchange', wakeControls);
      document.addEventListener('webkitfullscreenchange', wakeControls);
      var trackingMove = false;
      function onPointerMoveGlobal(e) {
        var r = player.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) wakeControls();
      }
      player.addEventListener('pointerenter', function() {
        wakeControls();
        if (!trackingMove) { trackingMove = true; window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true }); }
      });
      player.addEventListener('pointerleave', function() {
        setHover('idle'); clearTimeout(hoverTimer);
        if (trackingMove) { trackingMove = false; window.removeEventListener('pointermove', onPointerMoveGlobal); }
      });

      if (autoplay) {
        var io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            var inView = entry.isIntersecting && entry.intersectionRatio > 0;

            if (inView) {
              if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();

              if (video.paused) {
                lastPauseBy = '';
                pendingPlay = true;
                setStatus('loading');
                safePlay(video);
              } else {
                setStatus('playing');
              }
            } else {
              if (!video.paused && !video.ended) {
                lastPauseBy = 'io';
                video.pause();
                setStatus('paused');
              }
            }
          });
        }, { threshold: 0.1 });

        io.observe(player);
      }
    });

    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function formatTime(sec) {
      if (!isFinite(sec) || sec < 0) return '00:00';
      var s = Math.floor(sec), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
      return h > 0 ? (h + ':' + pad2(m) + ':' + pad2(r)) : (pad2(m) + ':' + pad2(r));
    }
    function setText(nodes, text) { nodes.forEach(function(n){ n.textContent = text; }); }

    function bestLevel(levels) {
      if (!levels || !levels.length) return null;
      return levels.reduce(function(a, b) { return ((b.width||0) > (a.width||0)) ? b : a; }, levels[0]);
    }

    function safePlay(video) {
      var p = video.play();
      if (p && typeof p.then === 'function') p.catch(function(){});
    }

    function readyIfIdle(player, pendingPlay) {
      if (!pendingPlay &&
          player.getAttribute('data-player-activated') !== 'true' &&
          player.getAttribute('data-player-status') === 'idle') {
        player.setAttribute('data-player-status', 'ready');
      }
    }

    function setBeforeRatio(player, updateSize, w, h) {
      if (updateSize !== 'true' || !w || !h) return;
      var before = player.querySelector('[data-player-before]');
      if (!before) return;
      before.style.paddingTop = (h / w * 100) + '%';
    }
    function maybeSetRatioFromVideo(player, updateSize, video) {
      if (updateSize !== 'true') return;
      var before = player.querySelector('[data-player-before]');
      if (!before) return;
      var hasPad = before.style.paddingTop && before.style.paddingTop !== '0%';
      if (!hasPad && video.videoWidth && video.videoHeight) {
        setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
      }
    }

    function resolveUrl(base, rel) { try { return new URL(rel, base).toString(); } catch(_) { return rel; } }

    function getSourceMeta(src, useHlsJs) {
      return new Promise(function(resolve) {
        if (useHlsJs && window.Hls && Hls.isSupported()) {
          try {
            var tmp = new Hls();
            var out = { width: 0, height: 0, duration: NaN };
            var haveLvls = false, haveDur = false;

            tmp.on(Hls.Events.MANIFEST_PARSED, function(e, data) {
              var lvls = (data && data.levels) || tmp.levels || [];
              var best = bestLevel(lvls);
              if (best && best.width && best.height) { out.width = best.width; out.height = best.height; haveLvls = true; }
            });
            tmp.on(Hls.Events.LEVEL_LOADED, function(e, data) {
              if (data && data.details && isFinite(data.details.totalduration)) { out.duration = data.details.totalduration; haveDur = true; }
            });
            tmp.on(Hls.Events.ERROR, function(){ try { tmp.destroy(); } catch(_) {} resolve(out); });
            tmp.on(Hls.Events.LEVEL_LOADED, function(){ try { tmp.destroy(); } catch(_) {} resolve(out); });

            tmp.loadSource(src);
            return;
          } catch(_) {
            resolve({ width:0, height:0, duration:NaN });
            return;
          }
        }

        function parseMaster(masterText) {
          var lines = masterText.split(/\r?\n/);
          var bestW = 0, bestH = 0, firstMedia = null, lastInf = null;
          for (var i=0;i<lines.length;i++) {
            var line = lines[i];
            if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
              lastInf = line;
            } else if (lastInf && line && line[0] !== '#') {
              if (!firstMedia) firstMedia = line.trim();
              var m = /RESOLUTION=(\d+)x(\d+)/.exec(lastInf);
              if (m) {
                var w = parseInt(m[1],10), h = parseInt(m[2],10);
                if (w > bestW) { bestW = w; bestH = h; }
              }
              lastInf = null;
            }
          }
          return { bestW: bestW, bestH: bestH, media: firstMedia };
        }
        function sumDuration(mediaText) {
          var dur = 0, re = /#EXTINF:([\d.]+)/g, m;
          while ((m = re.exec(mediaText))) dur += parseFloat(m[1]);
          return dur;
        }

        fetch(src, { credentials: 'omit', cache: 'no-store' }).then(function(r){
          if (!r.ok) throw new Error('master');
          return r.text();
        }).then(function(master){
          var info = parseMaster(master);
          if (!info.media) { resolve({ width: info.bestW||0, height: info.bestH||0, duration: NaN }); return; }
          var mediaUrl = resolveUrl(src, info.media);
          return fetch(mediaUrl, { credentials: 'omit', cache: 'no-store' }).then(function(r){
            if (!r.ok) throw new Error('media');
            return r.text();
          }).then(function(mediaText){
            resolve({ width: info.bestW||0, height: info.bestH||0, duration: sumDuration(mediaText) });
          });
        }).catch(function(){ resolve({ width:0, height:0, duration:NaN }); });
      });
    }
  }

  // Initialize on DOM ready or if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initBunnyPlayer();
    });
  } else {
    initBunnyPlayer();
  }
})();

