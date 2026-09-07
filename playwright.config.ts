import { defineConfig, devices } from '@playwright/test'

const local = process.env.E2E_LOCAL === '1'

export default defineConfig({
  testDir: './e2e',
  webServer: local
    ? {
        command: 'node scripts/serve.mjs 4173',
        url: 'http://localhost:4173/',
        reuseExistingServer: true,
      }
    : undefined,
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['Pixel 7'] },
  ],
})
