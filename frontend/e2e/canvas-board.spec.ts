import { test, expect } from '@playwright/test';

/**
 * Iso canvas board capture (Phase 3). Opens LAYOUT with the canvas renderer
 * flag and screenshots the result for design review. Readiness is the canvas
 * wrapper (the CSS ring's .board-tile does not exist in this mode).
 */
const SHOT = 'e2e/__screenshots__/canvas-board.png';

test('captures the iso canvas board', async ({ page }) => {
  await page.goto('/sala/LAYOUT?render=canvas');
  await page.waitForSelector('.board-area', { timeout: 30_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: SHOT, fullPage: false });
});
