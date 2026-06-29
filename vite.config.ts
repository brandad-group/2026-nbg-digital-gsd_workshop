import { defineConfig } from 'vite';

export default defineConfig({
  // Kein Build-Target-Override nötig — Vite-Default passt zu ES2020
  test: {
    globals: true,
  },
});
