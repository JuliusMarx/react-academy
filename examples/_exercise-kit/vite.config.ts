import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Exercises reload the whole page on every save, so the checks run again from a clean start. */
function reloadOnSave(): Plugin {
  return {
    name: 'exercise-reload-on-save',
    handleHotUpdate({ server }) {
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default defineConfig({
  plugins: [react(), reloadOnSave()],
});
