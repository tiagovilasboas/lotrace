import { defineConfig } from 'vitest/config';

/**
 * Vitest for frontend unit tests (pure logic: iso projection, formatters, etc.).
 * Playwright specs live in e2e/ and must NOT be picked up here — they use a
 * different runner (@playwright/test).
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    environment: 'node',
  },
});
