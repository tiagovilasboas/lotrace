import { test, expect } from '@playwright/test';

/**
 * Interaction flows — clicks the real buttons in the LAYOUT hotseat and
 * captures the resulting UI states for design review (Phase 2).
 *
 * The mock (buildLayoutMockState) starts with the viewer on the "roll" stage,
 * so we can drive real transitions by clicking. Dice are random, so instead of
 * asserting a specific outcome we capture whatever state the click produced —
 * the point is to review how each interaction state LOOKS. Rule correctness is
 * covered by the 56 vitest tests.
 */
const SHOTS = 'e2e/__screenshots__';

async function openBoard(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/sala/LAYOUT');
  await page.waitForSelector('[data-testid="board-canvas"]', { timeout: 30_000 });
  await expect
    .poll(async () => page.locator('.board-tile-label').count(), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(20);
  await page.evaluate(() => document.fonts.ready);
}

test('roll state — the primary CTA before rolling', async ({ page }) => {
  await openBoard(page);
  // Footer shows the roll CTA.
  await expect(page.getByRole('button', { name: 'Lançar dados' })).toBeVisible();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS}/state-roll.png` });
});

test('after roll — the resulting turn state', async ({ page }) => {
  await openBoard(page);
  const roll = page.getByRole('button', { name: 'Lançar dados' });
  await roll.click();
  // Let the roll animation settle and the next stage render.
  await page.waitForTimeout(1_200);
  await page.screenshot({ path: `${SHOTS}/state-after-roll.png` });
});
