import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright — visual capture for the LAYOUT board.
 *
 * Not a pixel-diff suite: it opens the mocked LAYOUT room, waits for the
 * board to mount and captures a screenshot for design review. The 56 rule
 * tests stay in shared/backend (vitest).
 *
 * webServer builds + serves the production bundle so the capture matches
 * what ships. No backend needed: /sala/LAYOUT is a local hotseat.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.output',
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'off',
  },
  projects: [
    {
      /* iPhone 13 viewport but rendered with Chromium (the only browser we
       * install) — we want the mobile layout, not WebKit specifically. */
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
