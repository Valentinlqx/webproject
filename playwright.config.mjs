import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  // Le site suit la langue du navigateur : les tests partent d'un navigateur français.
  use: { baseURL: 'http://localhost:4173', locale: 'fr-FR' },
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
