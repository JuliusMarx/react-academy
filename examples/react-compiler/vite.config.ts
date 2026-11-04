import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // The React Compiler memoizes components and values automatically at build time.
      babel: { plugins: ['babel-plugin-react-compiler'] },
    }),
  ],
});
