import { test, expect } from '@playwright/test';

/**
 * LAYOUT board capture.
 *
 * Opens the mocked 4-player hotseat (no backend) and screenshots the full
 * board so the layout can be reviewed as an image. Deterministic mock →
 * stable capture. This asserts the scene mounts, not pixels.
 */
const SCREENSHOT = 'e2e/__screenshots__/layout-board.png';

test('captures the LAYOUT board for design review', async ({ page }) => {
  await page.goto('/sala/LAYOUT');

  // Board frame must mount.
  await page.waitForSelector('.board-square', { timeout: 30_000 });

  // All 24 ring tiles must render (proves the ring content is there).
  await expect
    .poll(async () => page.locator('.board-tile').count(), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(20);

  // Wait for web fonts and let the 3D canvas paint a few frames.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_500);

  await page.screenshot({ path: SCREENSHOT, fullPage: false });
});
