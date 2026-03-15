import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 120000, // ✨ 120 วินาที เพราะมี slowMo + รอ Stripe
  reporter: 'html',

  use: {
    headless: false,
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 800,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});