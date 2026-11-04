import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    // three.js lives in the lazily-loaded HeroScene chunk (desktop only), so its size is expected.
    chunkSizeWarningLimit: 1000,
  },
});
