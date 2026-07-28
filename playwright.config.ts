import { defineConfig, devices } from '@playwright/test'

// Both projects are chromium — Pixel 7 just adds the mobile viewport, touch
// and UA, so the same specs cover desktop and mobile without duplication.
export default defineConfig({
  testDir: './e2e',
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['Pixel 7'] },
  ],
})
