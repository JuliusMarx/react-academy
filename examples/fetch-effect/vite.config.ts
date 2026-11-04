import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // By default the dev server answers unknown paths with index.html (status 200), so a missing
  // /api/users/4.json would not be a 404. "mpa" turns that fallback off.
  appType: 'mpa',
});
