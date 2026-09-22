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

  // The board (iso canvas by default) area must mount.
  await page.waitForSelector('.board-area', { timeout: 30_000 });
  await page.waitForSelector('[data-testid="board-canvas"]', { timeout: 15_000 });

  // Tile labels (DOM overlay) prove the board content rendered.
  await expect
    .poll(async () => page.locator('.board-tile-label').count(), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(20);

  // Wait for web fonts and let the canvas paint a few frames.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_200);

  await page.screenshot({ path: SCREENSHOT, fullPage: false });
});
