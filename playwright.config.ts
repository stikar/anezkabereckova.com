import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['Pixel 7'] },
  ],
})
