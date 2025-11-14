// Custom Cursor
(() => {
	const cursor = document.querySelector(".custom-cursor");
	if (!cursor) return;

	const defaultCursor =
		"https://cdn.prod.website-files.com/68f62fcbc64d17f90e046dfa/6905079459f55e8c6f5dcfbb_cursor-interact.avif";
	const hoverCursor =
		"https://cdn.prod.website-files.com/68f62fcbc64d17f90e046dfa/690507948080bd9a825974f5_cursor-auto.avif";

	cursor.style.backgroundImage = `url(${defaultCursor})`;
	cursor.style.willChange = "transform";
	cursor.style.transform = "translate3d(0, 0, 0)";

	let rafId = null;
	let mouseX = 0;
	let mouseY = 0;

	function updateCursor() {
		cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
		rafId = null;
	}

	document.addEventListener(
		"mousemove",
		(e) => {
			mouseX = e.clientX;
			mouseY = e.clientY + 2;
			if (!rafId) {
				rafId = requestAnimationFrame(updateCursor);
			}
		},
		{ passive: true },
	);

	const selector =
		'a, button, .articles_cms_radio, input[type="submit"], input[type="button"], input[type="radio"], input[type="checkbox"], select, textarea, .clickable, [onclick], .w-button, .w-nav-link, .w-tab-link, .w-dropdown-toggle, .w-dropdown-link, .w-slider-arrow-left, .w-slider-arrow-right, .w-slider-dot, .w-pagination-previous, .w-pagination-next, .w-radio, .w-form-label, .bunny-player__big-btn, .bunny-player__playpause, .bunny-player__toggle-playpause, .bunny-player__toggle-mute, .bunny-player__toggle-fullscreen, [data-player-control]';

	const attachedElements = new WeakSet();
	let observerTimeout = null;

	function attachListeners() {
		const interactiveElements = document.querySelectorAll(selector);
		interactiveElements.forEach((el) => {
			if (attachedElements.has(el)) return;
			attachedElements.add(el);
		});
	}

	// Attach listeners to existing elements
	attachListeners();

	// Use event delegation for dynamically added elements (throttled)
	// This handles elements that are created after initial load or nested elements
	let currentHoverElement = null;

	document.addEventListener(
		"mouseover",
		(e) => {
			const target = e.target;
			// Check if target or any parent matches the selector
			const matchingElement = target?.closest?.(selector);
			if (matchingElement) {
				if (!attachedElements.has(matchingElement)) {
					attachListeners();
				}
				// Only update cursor if we're entering a new matching element
				if (currentHoverElement !== matchingElement) {
					currentHoverElement = matchingElement;
					cursor.style.backgroundImage = `url(${hoverCursor})`;
				}
			}
		},
		{ passive: true },
	);

	document.addEventListener(
		"mouseout",
		(e) => {
			const target = e.target;
			const relatedTarget = e.relatedTarget;
			// Check if we're leaving a matching element and not entering another one
			const matchingElement = target?.closest?.(selector);
			const enteringMatchingElement = relatedTarget?.closest?.(selector);
			if (matchingElement && !enteringMatchingElement) {
				currentHoverElement = null;
				cursor.style.backgroundImage = `url(${defaultCursor})`;
			} else if (enteringMatchingElement) {
				currentHoverElement = enteringMatchingElement;
			}
		},
		{ passive: true },
	);

	// Watch for new elements added to DOM (throttled)
	if (typeof MutationObserver !== "undefined") {
		const observer = new MutationObserver(() => {
			if (observerTimeout) return;
			observerTimeout = setTimeout(() => {
				attachListeners();
				observerTimeout = null;
			}, 100);
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Retry for Bunny Player elements that may be created after page load
	function retryBunnyPlayer() {
		const bunnyPlayers = document.querySelectorAll("[data-bunny-player-init]");
		if (bunnyPlayers.length > 0) {
			// Wait a bit for player controls to be initialized
			setTimeout(() => {
				attachListeners();
			}, 500);
		}
	}

	// Retry immediately and after page load
	retryBunnyPlayer();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", retryBunnyPlayer);
	}
	window.addEventListener("load", retryBunnyPlayer);
})();

// Hamburger Toggle
(() => {
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
(() => {
	function initCRTEffect() {
		if (typeof THREE === "undefined") {
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
			brightness: 1,
		};

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			premultipliedAlpha: false,
			antialias: false,
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
				resolution: {
					value: new THREE.Vector2(window.innerWidth, window.innerHeight),
				},
				scanlineOpacity: { value: CONFIG.scanlineOpacity },
				scanlineCount: { value: CONFIG.scanlineCount },
				barrelPower: {
					value: isMobile() ? CONFIG.barrelPowerMobile : CONFIG.barrelPower,
				},
				vignetteStrength: { value: CONFIG.vignetteStrength },
				vignetteRadius: { value: CONFIG.vignetteRadius },
				beamIntensity: { value: CONFIG.beamIntensity },
				beamSpeed: { value: CONFIG.beamSpeed },
				glowSize: { value: CONFIG.glowSize },
				noiseAmount: { value: CONFIG.noiseAmount },
				flickerAmount: { value: CONFIG.flickerAmount },
				chromaticAberration: { value: CONFIG.chromaticAberration },
				brightness: { value: CONFIG.brightness },
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
			depthWrite: false,
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
		window.addEventListener("resize", onResize);

		function animate(time) {
			material.uniforms.time.value = time * 0.001;
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}
		animate(0);

		window.crtConfig = CONFIG;
		window.updateCRT = () => {
			Object.keys(CONFIG).forEach((key) => {
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
		if (document.readyState === "complete") {
			setTimeout(initCRTEffect, 100);
		} else {
			window.addEventListener("load", () => setTimeout(initCRTEffect, 100));
		}
	}
})();

// Pixelate Reveal
(() => {
	window.addEventListener("load", () => {
		if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
			return;
		}

		const images = document.querySelectorAll("[data-pixelate-img]");
		if (images.length === 0) return;

		images.forEach((img) => {
			if (img.complete && img.naturalWidth > 0) {
				pixelateReveal(img);
			} else {
				img.addEventListener("load", () => pixelateReveal(img));
			}
		});

		function pixelateReveal(img) {
			const wrapper = img.parentElement;
			if (!wrapper) return;

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d", { willReadFrequently: false });
			const tempCanvas = document.createElement("canvas");
			const tempCtx = tempCanvas.getContext("2d");

			const maxSize = 1600;
			const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
			const wrapperRect = wrapper.getBoundingClientRect();

			const naturalWidth =
				img.naturalWidth || img.width || wrapperRect.width || 1;
			const naturalHeight =
				img.naturalHeight || img.height || wrapperRect.height || 1;
			const aspectRatio = naturalWidth / naturalHeight || 1;

			let displayWidth =
				(wrapperRect.width || img.clientWidth || naturalWidth) * pixelRatio;
			let displayHeight = displayWidth / aspectRatio;

			if (!displayWidth || !displayHeight) {
				displayWidth = naturalWidth;
				displayHeight = naturalHeight;
			}

			displayWidth = Math.min(maxSize, Math.max(32, Math.round(displayWidth)));
			displayHeight = Math.min(
				maxSize,
				Math.max(32, Math.round(displayHeight)),
			);

			canvas.width = displayWidth;
			canvas.height = displayHeight;

			if (displayWidth <= 32 || displayHeight <= 32) {
				img.style.opacity = "1";
				return;
			}

			Object.assign(canvas.style, {
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				objectFit: "cover",
				zIndex: "2",
			});

			if (getComputedStyle(wrapper).position === "static") {
				wrapper.style.position = "relative";
			}

			img.style.opacity = "0";
			wrapper.appendChild(canvas);

			// Reduced steps from 7 to 4 for better performance
			const pixelSizes = [40, 15, 5, 1];

			drawPixelated(pixelSizes[0]);

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: wrapper,
					start: "top 80%",
					toggleActions: "play none none none",
				},
			});

			// Faster timing: 0.1s between steps instead of 0.15s
			pixelSizes.forEach((size, i) => {
				tl.call(() => drawPixelated(size), null, i * 0.1);
			});

			tl.call(() => {
				canvas.remove();
				img.style.opacity = "1";
			});

			function drawPixelated(pixelSize) {
				const w = canvas.width;
				const h = canvas.height;

				ctx.imageSmoothingEnabled = false;
				ctx.clearRect(0, 0, w, h);

				const smallW = Math.max(1, Math.ceil(w / pixelSize));
				const smallH = Math.max(1, Math.ceil(h / pixelSize));

				tempCanvas.width = smallW;
				tempCanvas.height = smallH;
				tempCtx.imageSmoothingEnabled = false;
				tempCtx.clearRect(0, 0, smallW, smallH);

				tempCtx.drawImage(img, 0, 0, smallW, smallH);
				ctx.drawImage(tempCanvas, 0, 0, w, h);
			}
		}
	});
})();

// Typewriter Effect
(() => {
	window.addEventListener("DOMContentLoaded", () => {
		if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		function retroType(element, speed = 15) {
			const text = element.getAttribute("data-text") || element.textContent;
			const chars = text.split("");

			const originalHeight = element.offsetHeight;
			const originalWidth = element.offsetWidth;

			element.style.minHeight = `${originalHeight}px`;
			element.style.minWidth = `${originalWidth}px`;
			element.style.display = "inline-block";

			element.textContent = "";
			element.style.visibility = "visible";

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

		const elements = document.querySelectorAll("[data-typewriter]");

		elements.forEach((el) => {
			ScrollTrigger.create({
				trigger: el,
				start: "top 80%",
				once: true,
				onEnter: () => {
					retroType(el, 15);
				},
			});
		});
	});
})();

// SVG Flash Animation
(() => {
	function animateSVGFlash() {
		if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
			return;
		}

		const svg = document.querySelector("[data-hero-title]");
		if (!svg) return;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: svg,
				start: "top 80%",
				once: true,
			},
		});

		gsap.set(svg, {
			opacity: 0,
			scale: 1.2,
			filter: "brightness(0)",
		});

		tl.to(svg, { opacity: 1, filter: "brightness(3)", duration: 0.05 })
			.to(svg, { opacity: 0, filter: "brightness(0)", duration: 0.03 })
			.to(svg, { opacity: 1, filter: "brightness(3)", duration: 0.05 })
			.to(svg, { opacity: 0, filter: "brightness(0)", duration: 0.03 })
			.to(svg, { opacity: 1, filter: "brightness(3)", duration: 0.05 })
			.to(svg, {
				scale: 1,
				filter: "brightness(1)",
				duration: 0.4,
				ease: "power2.out",
			});

		gsap.fromTo(
			svg,
			{ opacity: 1 },
			{
				opacity: 0.4,
				duration: 0.7,
				repeat: -1,
				yoyo: true,
				ease: "steps(1)",
				delay: 2,
			},
		);
	}

	window.addEventListener("DOMContentLoaded", animateSVGFlash);
})();

// Pixel Burst Effect
(() => {
	document.addEventListener("DOMContentLoaded", () => {
		if (typeof gsap === "undefined") {
			return;
		}

		function pixelBurst(x, y) {
			const colors = ["#ffff00", "#ffaa00", "#ff6600", "#ffffff", "#ffdd00"];
			const particleCount = 8;

			for (let i = 0; i < particleCount; i++) {
				const particle = document.createElement("div");
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
				const radians = (angle * Math.PI) / 180;

				gsap.to(particle, {
					x: Math.cos(radians) * distance,
					y: Math.sin(radians) * distance + 20,
					opacity: 0,
					scale: 0,
					duration: 0.8,
					ease: "steps(8)",
					onComplete: () => particle.remove(),
				});
			}
		}

		document.querySelectorAll("[data-pixel-burst]").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				pixelBurst(e.clientX, e.clientY);
			});
		});
	});
})();

// Email Gate and Swiper
(() => {
	const EMAIL_GATE_CONFIG = {
		storageKey: "emailGateSubmitted",
		expiryDays: 7,
		hideDelay: 4000,
		animationDelay: 300,
		triggerThreshold: 0.5,
		scrollThrottleMs: 100,
	};

	const SWIPER_CONFIG = {
		videos: {
			selector: ".swiper-videos",
			navigation: {
				nextEl: '[data-swiper="next-video"]',
				prevEl: '[data-swiper="prev-video"]',
			},
			pagination: {
				el: '[data-swiper="pagination"]',
			},
			breakpoints: {
				478: { slidesPerView: 1, spaceBetween: 0 },
				768: { slidesPerView: 1, spaceBetween: 0 },
				992: { slidesPerView: 1, spaceBetween: 0 },
			},
			slidesPerView: 1,
			spaceBetween: 0,
		},
		cases: {
			selector: ".swiper-cases",
			navigation: {
				nextEl: '[data-swiper="next-case"]',
				prevEl: '[data-swiper="prev-case"]',
			},
			pagination: {
				el: '[data-swiper="pagination-case"]',
			},
			breakpoints: {
				478: { slidesPerView: 1, spaceBetween: 16 },
				768: { slidesPerView: 1, spaceBetween: 16 },
				992: { slidesPerView: 2, spaceBetween: 16 },
			},
			slidesPerView: 1,
			spaceBetween: 20,
		},
	};

	const SWIPER_RETRY_DELAY = 200;
	const SWIPER_MAX_ATTEMPTS = 10; // Reduced from 20 for better performance
	let swiperObserver = null;
	let swiperWaitStarted = false;

	function throttle(func, limit) {
		let inThrottle;
		return function (...args) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limit);
			}
		};
	}

	function saveWithExpiry(config) {
		const now = new Date();
		const item = {
			value: true,
			expiry: now.getTime() + config.expiryDays * 24 * 60 * 60 * 1000,
		};

		try {
			localStorage.setItem(config.storageKey, JSON.stringify(item));
			return true;
		} catch (error) {
			console.error("❌ Failed to save:", error);
			return false;
		}
	}

	function checkWithExpiry(config) {
		try {
			const itemStr = localStorage.getItem(config.storageKey);

			if (!itemStr) {
				return false;
			}

			if (itemStr === "true") {
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
		} catch {
			return false;
		}
	}

	function initSwiper(config) {
		if (typeof window.Swiper === "undefined") {
			return null;
		}

		const container = document.querySelector(config.selector);
		if (!container) {
			return null;
		}

		if (container.dataset.swiperInitialized === "true" && container.swiper) {
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
				disabledClass: "is-disabled",
			},
			pagination: {
				el: config.pagination.el,
				clickable: true,
				bulletClass: "swiper_bullet",
				bulletActiveClass: "is-active",
				renderBullet: (index, className) =>
					`<button class="${className}" aria-label="Slide ${index + 1}"></button>`,
			},
			breakpoints: config.breakpoints,
			keyboard: {
				enabled: true,
			},
			watchOverflow: true,
		};

		const instance = new window.Swiper(container, swiperConfig);
		container.dataset.swiperInitialized = "true";
		return instance;
	}

	function initEmailGate() {
		const hero = document.querySelector("[data-hero-section]");
		const gate = document.querySelector("[data-email-gate]");
		const formBlock = gate?.querySelector(".gate_form-block.w-form");
		const successMessage = gate?.querySelector(".gate_sucess.w-form-done");

		if (!hero || !gate || !formBlock) {
			console.error("❌ Missing required elements");
			return;
		}

		if (checkWithExpiry(EMAIL_GATE_CONFIG)) {
			gate.style.display = "none";
			return;
		}

		let savedScrollPosition = 0;
		let scrollTriggered = false;
		let successHandled = false;
		let checkInterval;

		gate.style.display = "none";

		window.showEmailGate = () => {
			savedScrollPosition =
				window.pageYOffset || document.documentElement.scrollTop;

			gate.style.display = "flex";

			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.width = "100%";
			document.body.style.top = `-${savedScrollPosition}px`;

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					gate.classList.add("active");
				});
			});
		};

		window.hideEmailGate = () => {
			gate.classList.remove("active");

			setTimeout(() => {
				gate.style.display = "none";

				document.body.style.removeProperty("overflow");
				document.body.style.removeProperty("position");
				document.body.style.removeProperty("width");
				document.body.style.removeProperty("top");

				window.scrollTo({
					top: savedScrollPosition,
					behavior: "auto",
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

			const hasClass = formBlock.classList.contains("w-form-done");
			const messageVisible = successMessage
				? window.getComputedStyle(successMessage).display !== "none"
				: false;

			if (hasClass || messageVisible) {
				window.handleEmailSuccess();
				observeSuccess.disconnect();
			}
		});

		observeSuccess.observe(formBlock, {
			attributes: true,
			attributeFilter: ["style", "class"],
		});

		if (successMessage) {
			observeSuccess.observe(successMessage, {
				attributes: true,
				attributeFilter: ["style", "class"],
			});
		}

		const checkSuccess = () => {
			if (successHandled) return;

			const hasClass = formBlock.classList.contains("w-form-done");
			const messageVisible = successMessage
				? window.getComputedStyle(successMessage).display !== "none"
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

				window.removeEventListener("scroll", throttledScrollHandler);
				window.removeEventListener("wheel", throttledScrollHandler);
				window.removeEventListener("touchmove", throttledScrollHandler);
			}
		};

		const throttledScrollHandler = throttle(
			checkScrollPastHero,
			EMAIL_GATE_CONFIG.scrollThrottleMs,
		);

		window.addEventListener("scroll", throttledScrollHandler, {
			passive: true,
		});
		window.addEventListener("wheel", throttledScrollHandler, { passive: true });
		window.addEventListener("touchmove", throttledScrollHandler, {
			passive: true,
		});

		checkScrollPastHero();
	}

	function initSwipers() {
		initSwiper(SWIPER_CONFIG.videos, "videos");
		initSwiper(SWIPER_CONFIG.cases, "cases");
	}

	function observeSwiperContainers() {
		if (swiperObserver || typeof MutationObserver === "undefined") {
			return;
		}

		swiperObserver = new MutationObserver(() => {
			initSwipers();
		});

		swiperObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	function waitForSwiper(attempt = 0) {
		if (typeof window.Swiper === "undefined") {
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
		window.addEventListener("load", initEmailGate);

		const startSwiperWait = () => {
			if (swiperWaitStarted) return;
			swiperWaitStarted = true;
			waitForSwiper();
		};

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", startSwiperWait);
		} else {
			startSwiperWait();
		}

		window.addEventListener("load", startSwiperWait);
	}

	init();
})();

// Bunny Player
const initBunnyPlayers = () => {
	const players = document.querySelectorAll("[data-bunny-player-init]");
	if (!players.length) {
		return;
	}

	const pad2 = (value) => (value < 10 ? `0${value}` : `${value}`);

	const formatTime = (seconds) => {
		if (!Number.isFinite(seconds) || seconds < 0) {
			return "00:00";
		}

		const totalSeconds = Math.floor(seconds);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const remainingSeconds = totalSeconds % 60;

		return hours > 0
			? `${hours}:${pad2(minutes)}:${pad2(remainingSeconds)}`
			: `${pad2(minutes)}:${pad2(remainingSeconds)}`;
	};

	const setText = (nodes, text) => {
		nodes.forEach((node) => {
			node.textContent = text;
		});
	};

	const bestLevel = (levels) => {
		if (!levels || !levels.length) {
			return null;
		}
		return levels.reduce(
			(best, level) => ((level.width || 0) > (best.width || 0) ? level : best),
			levels[0],
		);
	};

	const safePlay = (video) => {
		const playPromise = video.play();
		if (playPromise && typeof playPromise.then === "function") {
			playPromise.catch(() => {});
		}
	};

	const readyIfIdle = (player, pendingPlay) => {
		if (
			!pendingPlay &&
			player.getAttribute("data-player-activated") !== "true" &&
			player.getAttribute("data-player-status") === "idle"
		) {
			player.setAttribute("data-player-status", "ready");
		}
	};

	const setBeforeRatio = (player, updateSize, width, height) => {
		if (updateSize !== "true" || !width || !height) {
			return;
		}
		const before = player.querySelector("[data-player-before]");
		if (before) {
			before.style.paddingTop = `${(height / width) * 100}%`;
		}
	};

	const maybeSetRatioFromVideo = (player, updateSize, video) => {
		if (updateSize !== "true") {
			return;
		}
		const before = player.querySelector("[data-player-before]");
		if (!before) {
			return;
		}
		const hasPadding =
			before.style.paddingTop && before.style.paddingTop !== "0%";
		if (!hasPadding && video.videoWidth && video.videoHeight) {
			setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
		}
	};

	const resolveUrl = (base, relative) => {
		try {
			return new URL(relative, base).toString();
		} catch {
			return relative;
		}
	};

	const getSourceMeta = (src, useHlsJs) =>
		new Promise((resolve) => {
			if (useHlsJs && window.Hls && Hls.isSupported()) {
				try {
					const tempHls = new Hls();
					const output = { width: 0, height: 0, duration: Number.NaN };

					tempHls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
						const levels = data?.levels || tempHls.levels || [];
						const best = bestLevel(levels);
						if (best?.width && best.height) {
							output.width = best.width;
							output.height = best.height;
						}
					});

					tempHls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
						if (data?.details && Number.isFinite(data.details.totalduration)) {
							output.duration = data.details.totalduration;
						}
					});

					const endAndResolve = () => {
						try {
							tempHls.destroy();
						} catch {
							/* ignore */
						}
						resolve(output);
					};

					tempHls.on(Hls.Events.ERROR, endAndResolve);
					tempHls.on(Hls.Events.LEVEL_LOADED, endAndResolve);

					tempHls.loadSource(src);
					return;
				} catch {
					resolve({ width: 0, height: 0, duration: Number.NaN });
					return;
				}
			}

			const parseMaster = (masterText) => {
				const lines = masterText.split(/\r?\n/);
				let bestWidth = 0;
				let bestHeight = 0;
				let firstMedia = null;
				let lastInfo = null;

				lines.forEach((line) => {
					if (line.startsWith("#EXT-X-STREAM-INF:")) {
						lastInfo = line;
					} else if (lastInfo && line && line[0] !== "#") {
						if (!firstMedia) {
							firstMedia = line.trim();
						}

						const match = /RESOLUTION=(\d+)x(\d+)/.exec(lastInfo);
						if (match) {
							const width = Number.parseInt(match[1], 10);
							const height = Number.parseInt(match[2], 10);
							if (width > bestWidth) {
								bestWidth = width;
								bestHeight = height;
							}
						}

						lastInfo = null;
					}
				});

				return { bestWidth, bestHeight, media: firstMedia };
			};

			const sumDuration = (mediaText) => {
				let duration = 0;
				const regex = /#EXTINF:([\\d.]+)/g;
				let matchResult = regex.exec(mediaText);

				while (matchResult !== null) {
					duration += Number.parseFloat(matchResult[1]);
					matchResult = regex.exec(mediaText);
				}

				return duration;
			};

			fetch(src, { credentials: "omit", cache: "no-store" })
				.then((response) => {
					if (!response.ok) {
						throw new Error("master");
					}
					return response.text();
				})
				.then((master) => {
					const info = parseMaster(master);
					if (!info.media) {
						resolve({
							width: info.bestWidth || 0,
							height: info.bestHeight || 0,
							duration: Number.NaN,
						});
						return;
					}

					const mediaUrl = resolveUrl(src, info.media);
					return fetch(mediaUrl, { credentials: "omit", cache: "no-store" })
						.then((response) => {
							if (!response.ok) {
								throw new Error("media");
							}
							return response.text();
						})
						.then((mediaText) => {
							resolve({
								width: info.bestWidth || 0,
								height: info.bestHeight || 0,
								duration: sumDuration(mediaText),
							});
						});
				})
				.catch(() => {
					resolve({ width: 0, height: 0, duration: Number.NaN });
				});
		});

	players.forEach((player) => {
		const src = player.getAttribute("data-player-src");
		const video = player.querySelector("video");
		if (!src || !video) {
			return;
		}

		try {
			if (!video.paused) video.pause();
		} catch {
			/* ignore */
		}

		if (video.src && video.src !== src) {
			try {
				video.removeAttribute("src");
				video.load();
			} catch {
				/* ignore */
			}
		}

		const setStatus = (status) => {
			if (player.getAttribute("data-player-status") !== status) {
				player.setAttribute("data-player-status", status);
			}
		};

		const setMutedState = (value) => {
			video.muted = Boolean(value);
			player.setAttribute("data-player-muted", video.muted ? "true" : "false");
		};

		const setFullscreenAttr = (value) => {
			player.setAttribute("data-player-fullscreen", value ? "true" : "false");
		};

		const setActivated = (value) => {
			player.setAttribute("data-player-activated", value ? "true" : "false");
		};

		if (!player.hasAttribute("data-player-activated")) {
			setActivated(false);
		}

		if (!player.hasAttribute("data-player-status")) {
			setStatus("idle");
		}

		const timeline = player.querySelector("[data-player-timeline]");
		const progressBar = player.querySelector("[data-player-progress]");
		const bufferedBar = player.querySelector("[data-player-buffered]");
		const handle = player.querySelector("[data-player-timeline-handle]");
		const timeDurationEls = player.querySelectorAll(
			"[data-player-time-duration]",
		);
		const timeProgressEls = player.querySelectorAll(
			"[data-player-time-progress]",
		);

		const updateSize = player.getAttribute("data-player-update-size");
		const lazyMode = player.getAttribute("data-player-lazy");
		const isLazyTrue = lazyMode === "true";
		const isLazyMeta = lazyMode === "meta";
		const autoplay = player.getAttribute("data-player-autoplay") === "true";
		const initialMuted = player.getAttribute("data-player-muted") === "true";

		let pendingPlay = false;

		if (autoplay) {
			setMutedState(true);
			video.loop = true;
		} else {
			setMutedState(initialMuted);
		}

		video.setAttribute("muted", "");
		video.setAttribute("playsinline", "");
		video.setAttribute("webkit-playsinline", "");
		video.playsInline = true;

		if (typeof video.disableRemotePlayback !== "undefined") {
			video.disableRemotePlayback = true;
		}

		if (autoplay) {
			video.autoplay = false;
		}

		const isSafariNative = Boolean(
			video.canPlayType("application/vnd.apple.mpegurl"),
		);
		const canUseHlsJs = Boolean(
			window.Hls && Hls.isSupported() && !isSafariNative,
		);

		if (updateSize === "true" && !isLazyMeta && !isLazyTrue) {
			const prevPreload = video.preload;
			const handleMetadata = () => {
				setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
				video.removeEventListener("loadedmetadata", handleMetadata);
				video.preload = prevPreload || "";
			};
			video.preload = "metadata";
			video.addEventListener("loadedmetadata", handleMetadata, { once: true });
			video.src = src;
		}

		const fetchMetaOnce = () => {
			getSourceMeta(src, canUseHlsJs).then((meta) => {
				if (meta.width && meta.height) {
					setBeforeRatio(player, updateSize, meta.width, meta.height);
				}

				if (
					timeDurationEls.length &&
					Number.isFinite(meta.duration) &&
					meta.duration > 0
				) {
					setText(timeDurationEls, formatTime(meta.duration));
				}

				readyIfIdle(player, pendingPlay);
			});
		};

		let isAttached = false;

		const attachMediaOnce = () => {
			if (isAttached) {
				return;
			}

			isAttached = true;

			if (player._hls) {
				try {
					player._hls.destroy();
				} catch {
					/* ignore */
				}
				player._hls = null;
			}

			if (isSafariNative) {
				video.preload = isLazyTrue || isLazyMeta ? "auto" : video.preload;
				video.src = src;
				video.addEventListener(
					"loadedmetadata",
					() => {
						readyIfIdle(player, pendingPlay);
						if (updateSize === "true") {
							setBeforeRatio(
								player,
								updateSize,
								video.videoWidth,
								video.videoHeight,
							);
						}
						if (timeDurationEls.length) {
							setText(timeDurationEls, formatTime(video.duration));
						}
					},
					{ once: true },
				);
			} else if (canUseHlsJs) {
				try {
					const hls = new Hls({ maxBufferLength: 10 });
					hls.attachMedia(video);
					hls.on(Hls.Events.MEDIA_ATTACHED, () => {
						hls.loadSource(src);
					});
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						readyIfIdle(player, pendingPlay);
						if (updateSize === "true") {
							const best = bestLevel(hls.levels || []);
							if (best?.width && best.height) {
								setBeforeRatio(player, updateSize, best.width, best.height);
							}
						}
					});
					hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
						if (
							data?.details &&
							Number.isFinite(data.details.totalduration) &&
							timeDurationEls.length
						) {
							setText(timeDurationEls, formatTime(data.details.totalduration));
						}
					});
					hls.on(Hls.Events.ERROR, (_, data) => {
						console.error("❌ Bunny Player: HLS error", data);
						if (data.fatal) {
							switch (data.type) {
								case Hls.ErrorTypes.NETWORK_ERROR:
									console.error(
										"❌ Bunny Player: Network error, trying to recover",
									);
									hls.startLoad();
									break;
								case Hls.ErrorTypes.MEDIA_ERROR:
									console.error(
										"❌ Bunny Player: Media error, trying to recover",
									);
									hls.recoverMediaError();
									break;
								default:
									console.error("❌ Bunny Player: Fatal error, destroying HLS");
									hls.destroy();
									break;
							}
						}
					});
					player._hls = hls;
				} catch {
					console.error("❌ Bunny Player: Error initializing HLS");
					video.src = src;
				}
			} else {
				video.src = src;
			}
		};

		if (isLazyMeta) {
			fetchMetaOnce();
			video.preload = "none";
		} else if (isLazyTrue) {
			video.preload = "none";
		} else {
			attachMediaOnce();
		}

		const togglePlay = () => {
			if (video.paused || video.ended) {
				if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
				pendingPlay = true;
				setStatus("loading");
				safePlay(video);
			} else {
				video.pause();
			}
		};

		const toggleMute = () => {
			video.muted = !video.muted;
			player.setAttribute("data-player-muted", video.muted ? "true" : "false");
		};

		const isFullscreenActive = () =>
			Boolean(document.fullscreenElement || document.webkitFullscreenElement);

		const enterFullscreen = () => {
			if (player.requestFullscreen) return player.requestFullscreen();
			if (video.requestFullscreen) return video.requestFullscreen();
			if (
				video.webkitSupportsFullscreen &&
				typeof video.webkitEnterFullscreen === "function"
			) {
				return video.webkitEnterFullscreen();
			}
			return undefined;
		};

		const exitFullscreen = () => {
			if (document.exitFullscreen) return document.exitFullscreen();
			if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
			if (
				video.webkitDisplayingFullscreen &&
				typeof video.webkitExitFullscreen === "function"
			) {
				return video.webkitExitFullscreen();
			}
			return undefined;
		};

		const toggleFullscreen = () => {
			if (isFullscreenActive() || video.webkitDisplayingFullscreen) {
				exitFullscreen();
			} else {
				enterFullscreen();
			}
		};

		document.addEventListener("fullscreenchange", () =>
			setFullscreenAttr(isFullscreenActive()),
		);
		document.addEventListener("webkitfullscreenchange", () =>
			setFullscreenAttr(isFullscreenActive()),
		);
		video.addEventListener("webkitbeginfullscreen", () =>
			setFullscreenAttr(true),
		);
		video.addEventListener("webkitendfullscreen", () =>
			setFullscreenAttr(false),
		);

		player.addEventListener("click", (event) => {
			const control = event.target.closest("[data-player-control]");
			if (!control || !player.contains(control)) {
				return;
			}

			const type = control.getAttribute("data-player-control");
			if (type === "play" || type === "pause" || type === "playpause") {
				togglePlay();
			} else if (type === "mute") {
				toggleMute();
			} else if (type === "fullscreen") {
				toggleFullscreen();
			}
		});

		const updateTimeTexts = () => {
			if (timeDurationEls.length) {
				setText(timeDurationEls, formatTime(video.duration));
			}
			if (timeProgressEls.length) {
				setText(timeProgressEls, formatTime(video.currentTime));
			}
		};

		video.addEventListener("timeupdate", updateTimeTexts);
		video.addEventListener("loadedmetadata", () => {
			updateTimeTexts();
			maybeSetRatioFromVideo(player, updateSize, video);
		});
		video.addEventListener("loadeddata", () =>
			maybeSetRatioFromVideo(player, updateSize, video),
		);
		video.addEventListener("playing", () =>
			maybeSetRatioFromVideo(player, updateSize, video),
		);
		video.addEventListener("durationchange", updateTimeTexts);

		let rafId;
		const updateProgressVisuals = () => {
			if (!video.duration) {
				return;
			}
			const playedPercent = (video.currentTime / video.duration) * 100;
			if (progressBar) {
				progressBar.style.transform = `translateX(${playedPercent - 100}%)`;
			}
			if (handle) {
				handle.style.left = `${playedPercent}%`;
			}
		};

		const loop = () => {
			updateProgressVisuals();
			if (!video.paused && !video.ended) {
				rafId = requestAnimationFrame(loop);
			}
		};

		const updateBufferedBar = () => {
			if (!bufferedBar || !video.duration || !video.buffered.length) {
				return;
			}
			const end = video.buffered.end(video.buffered.length - 1);
			const percent = (end / video.duration) * 100;
			bufferedBar.style.transform = `translateX(${percent - 100}%)`;
		};

		video.addEventListener("progress", updateBufferedBar);
		video.addEventListener("loadedmetadata", updateBufferedBar);
		video.addEventListener("durationchange", updateBufferedBar);

		video.addEventListener("play", () => {
			setActivated(true);
			cancelAnimationFrame(rafId);
			loop();
			setStatus("playing");
		});

		video.addEventListener("playing", () => {
			pendingPlay = false;
			setStatus("playing");
		});

		video.addEventListener("pause", () => {
			pendingPlay = false;
			cancelAnimationFrame(rafId);
			updateProgressVisuals();
			setStatus("paused");
		});

		video.addEventListener("waiting", () => {
			setStatus("loading");
		});

		video.addEventListener("canplay", () => {
			readyIfIdle(player, pendingPlay);
		});

		video.addEventListener("ended", () => {
			pendingPlay = false;
			cancelAnimationFrame(rafId);
			updateProgressVisuals();
			setStatus("paused");
			setActivated(false);
		});

		video.addEventListener("error", (error) => {
			console.error("❌ Bunny Player: Video error", error);
			console.error(
				"❌ Bunny Player: Error code:",
				video.error ? video.error.code : "unknown",
			);
			console.error(
				"❌ Bunny Player: Error message:",
				video.error ? video.error.message : "unknown",
			);
			setStatus("error");
		});

		video.addEventListener("loadstart", () => {
			setStatus("loading");
		});

		if (timeline) {
			let dragging = false;
			let wasPlaying = false;
			let targetTime = 0;
			let lastSeekTimestamp = 0;
			const seekThrottle = 180;
			let boundingRect = null;

			const refreshBoundingRect = () => {
				boundingRect = timeline.getBoundingClientRect();
			};

			const getFractionFromX = (x) => {
				if (!boundingRect) {
					refreshBoundingRect();
				}
				let fraction = (x - boundingRect.left) / boundingRect.width;
				if (fraction < 0) fraction = 0;
				if (fraction > 1) fraction = 1;
				return fraction;
			};

			const previewAtFraction = (fraction) => {
				if (!video.duration) {
					return;
				}
				const percent = fraction * 100;
				if (progressBar) {
					progressBar.style.transform = `translateX(${percent - 100}%)`;
				}
				if (handle) {
					handle.style.left = `${percent}%`;
				}
				if (timeProgressEls.length) {
					setText(timeProgressEls, formatTime(fraction * video.duration));
				}
			};

			const maybeSeek = (timestamp) => {
				if (!video.duration || timestamp - lastSeekTimestamp < seekThrottle) {
					return;
				}
				lastSeekTimestamp = timestamp;
				video.currentTime = targetTime;
			};

			const onPointerDown = (event) => {
				if (!video.duration) return;
				dragging = true;
				wasPlaying = !video.paused && !video.ended;
				if (wasPlaying) {
					video.pause();
				}
				player.setAttribute("data-timeline-drag", "true");
				refreshBoundingRect();
				const fraction = getFractionFromX(event.clientX);
				targetTime = fraction * video.duration;
				previewAtFraction(fraction);
				maybeSeek(performance.now());
				if (timeline.setPointerCapture) {
					timeline.setPointerCapture(event.pointerId);
				}
				window.addEventListener("pointermove", onPointerMove, {
					passive: false,
				});
				window.addEventListener("pointerup", onPointerUp, { passive: true });
				event.preventDefault();
			};

			const onPointerMove = (event) => {
				if (!dragging) return;
				const fraction = getFractionFromX(event.clientX);
				targetTime = fraction * video.duration;
				previewAtFraction(fraction);
				maybeSeek(performance.now());
				event.preventDefault();
			};

			const onPointerUp = () => {
				if (!dragging) return;
				dragging = false;
				player.setAttribute("data-timeline-drag", "false");
				boundingRect = null;
				video.currentTime = targetTime;
				if (wasPlaying) {
					safePlay(video);
				} else {
					updateProgressVisuals();
					updateTimeTexts();
				}
				window.removeEventListener("pointermove", onPointerMove);
				window.removeEventListener("pointerup", onPointerUp);
			};

			timeline.addEventListener("pointerdown", onPointerDown, {
				passive: false,
			});
			if (handle) {
				handle.addEventListener("pointerdown", onPointerDown, {
					passive: false,
				});
			}

			window.addEventListener("resize", () => {
				if (!dragging) {
					boundingRect = null;
				}
			});
		}

		let hoverTimer;
		const hoverHideDelay = 3000;

		const setHover = (state) => {
			if (player.getAttribute("data-player-hover") !== state) {
				player.setAttribute("data-player-hover", state);
			}
		};

		const scheduleHide = () => {
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => setHover("idle"), hoverHideDelay);
		};

		const wakeControls = () => {
			setHover("active");
			scheduleHide();
		};

		player.addEventListener("pointerdown", wakeControls);
		document.addEventListener("fullscreenchange", wakeControls);
		document.addEventListener("webkitfullscreenchange", wakeControls);

		let trackingMove = false;

		const handlePointerMoveGlobal = (event) => {
			const rect = player.getBoundingClientRect();
			if (
				event.clientX >= rect.left &&
				event.clientX <= rect.right &&
				event.clientY >= rect.top &&
				event.clientY <= rect.bottom
			) {
				wakeControls();
			}
		};

		player.addEventListener("pointerenter", () => {
			wakeControls();
			if (!trackingMove) {
				trackingMove = true;
				window.addEventListener("pointermove", handlePointerMoveGlobal, {
					passive: true,
				});
			}
		});

		player.addEventListener("pointerleave", () => {
			setHover("idle");
			clearTimeout(hoverTimer);
			if (trackingMove) {
				trackingMove = false;
				window.removeEventListener("pointermove", handlePointerMoveGlobal);
			}
		});

		if (autoplay) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const inView = entry.isIntersecting && entry.intersectionRatio > 0;

						if (inView) {
							if ((isLazyTrue || isLazyMeta) && !isAttached) {
								attachMediaOnce();
							}

							if (video.paused) {
								pendingPlay = true;
								setStatus("loading");
								safePlay(video);
							} else {
								setStatus("playing");
							}
						} else if (!video.paused && !video.ended) {
							video.pause();
							setStatus("paused");
						}
					});
				},
				{ threshold: 0.1 },
			);

			observer.observe(player);
		}
	});
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initBunnyPlayers);
} else {
	initBunnyPlayers();
}
