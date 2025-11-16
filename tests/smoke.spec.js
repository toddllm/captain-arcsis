// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Smoke tests for Captain Arcsis
 * These tests verify the deployed game loads and functions correctly
 */

test.describe('Captain Arcsis Smoke Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Captain Arcsis/i);
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('game canvas is present and has correct dimensions', async ({ page }) => {
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('width', '800');
    await expect(canvas).toHaveAttribute('height', '600');
  });

  test('control instructions are displayed', async ({ page }) => {
    const controls = page.locator('#controls');
    await expect(controls).toBeVisible();
    await expect(controls).toContainText('WASD');
    await expect(controls).toContainText('SPACE');
    await expect(controls).toContainText('Attack');
  });

  test('all JavaScript modules load without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const criticalErrors = errors.filter(error =>
      !error.includes('AudioContext') &&
      !error.includes('user gesture') &&
      !error.includes('NotAllowedError')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('game scripts are loaded', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verify all game scripts are present in DOM
    const scripts = await page.evaluate(() => {
      const scriptTags = Array.from(document.querySelectorAll('script[src]'));
      return scriptTags.map(s => s.getAttribute('src'));
    });

    expect(scripts).toContain('js/game.js');
    expect(scripts).toContain('js/player.js');
    expect(scripts).toContain('js/enemies.js');
  });

  test('canvas element is functional', async ({ page }) => {
    const canvas = page.locator('#gameCanvas');

    // Check canvas has a 2D context available
    const hasContext = await canvas.evaluate(el => {
      return el.getContext('2d') !== null;
    });

    expect(hasContext).toBe(true);
  });

  test('game assets are accessible', async ({ page }) => {
    const jsFiles = [
      '/js/game.js',
      '/js/player.js',
      '/js/enemies.js',
      '/js/combat.js',
      '/js/world.js'
    ];

    for (const file of jsFiles) {
      const response = await page.request.get(file);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('javascript');
    }
  });

  test('page has correct meta configuration', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);

    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'UTF-8');
  });

  test('CSS styling is applied correctly', async ({ page }) => {
    const canvasStyle = await page.locator('#gameCanvas').evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        imageRendering: style.imageRendering,
        border: style.border
      };
    });

    expect(canvasStyle.imageRendering).toMatch(/pixelated|crisp-edges/);
  });
});

test.describe('Performance Smoke Tests', () => {

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000);
  });
});
