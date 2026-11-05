import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const ci = !!process.env['CI'];

/**
 * End-to-end tests of the platform itself (not of the course examples).
 * They run against the prerendered build: `npm run build`, then `npm run e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // More workers make the prerendered pages hydrate too slowly on a busy machine.
  workers: 2,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      // Locally the installed Chrome is enough; CI installs Playwright's Chromium.
      use: { ...devices['Desktop Chrome'], channel: ci ? undefined : 'chrome' },
    },
  ],
  webServer: {
    command: `npx serve dist/react-academy/browser -l ${port} --no-clipboard`,
    url: `http://localhost:${port}/de/`,
    reuseExistingServer: !ci,
  },
});
