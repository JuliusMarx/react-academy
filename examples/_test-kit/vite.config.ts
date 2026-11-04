import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mutantSwap, vitestShim } from './vite.testing';

// The preview runs your tests in the browser: "vitest" resolves to a small compatible runner.
export default defineConfig({
  plugins: [vitestShim(), mutantSwap(), react()],
});
