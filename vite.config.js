import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'AxonWebflow',
      fileName: 'main',
      formats: ['iife']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          'gsap': 'gsap',
          'ScrollTrigger': 'ScrollTrigger'
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    },
    target: 'es2015',
    sourcemap: false
  },
  define: {
    // Ensure these are treated as globals
    'gsap': 'gsap',
    'ScrollTrigger': 'ScrollTrigger',
    'THREE': 'THREE'
  }
});

