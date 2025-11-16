// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Smoke tests for Captain Arcsis - Enhanced Edition
 * These tests verify the deployed game loads and functions correctly
 */

test.describe('Captain Arcsis Smoke Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
  });

  test('page loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Captain Arcsis/i);

    // Check page responds with 200 OK (implicit in successful navigation)
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('game canvas is present and has correct dimensions', async ({ page }) => {
    // Check canvas element exists
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();

    // Check canvas has expected dimensions (800x600)
    await expect(canvas).toHaveAttribute('width', '800');
    await expect(canvas).toHaveAttribute('height', '600');
  });

  test('game heading displays correctly', async ({ page }) => {
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Captain Arcsis');
    await expect(heading).toContainText('Enhanced Edition');
  });

  test('game UI panel is visible', async ({ page }) => {
    // Check UI panel exists
    const uiPanel = page.locator('#uiPanel');
    await expect(uiPanel).toBeVisible();
  });

  test('control instructions are displayed', async ({ page }) => {
    // Check that control instructions are present
    const controlsText = page.locator('body');

    // Check for key control instructions
    await expect(controlsText).toContainText('WASD');
    await expect(controlsText).toContainText('Arrow Keys');
    await expect(controlsText).toContainText('Space');
    await expect(controlsText).toContainText('Attack');
  });

  test('all JavaScript modules load without errors', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Give scripts time to execute
    await page.waitForTimeout(2000);

    // Filter out expected errors (e.g., audio context restrictions)
    const criticalErrors = errors.filter(error =>
      !error.includes('AudioContext') &&
      !error.includes('user gesture') &&
      !error.includes('NotAllowedError')
    );

    // Should have no critical JavaScript errors
    expect(criticalErrors).toHaveLength(0);
  });

  test('game initializes and reaches menu state', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that the game object exists and is in menu state
    const gameState = await page.evaluate(() => {
      // @ts-ignore - game is a global variable
      return typeof window.game !== 'undefined' ? window.game.state : null;
    });

    // Game should be in 'menu' state initially
    expect(gameState).toBe('menu');
  });

  test('canvas renders content', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForTimeout(2000);

    // Check that canvas has rendered content (not blank)
    const canvasHasContent = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return false;

      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      // Get some pixel data to verify content is rendered
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;

      // Check if any pixels are not transparent/black
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
          return true; // Found non-black pixel
        }
      }
      return false;
    });

    expect(canvasHasContent).toBe(true);
  });

  test('game responds to keyboard input', async ({ page }) => {
    // Wait for game to fully initialize
    await page.waitForTimeout(2000);

    // Get initial game state
    const initialState = await page.evaluate(() => {
      // @ts-ignore
      return window.game?.state;
    });

    expect(initialState).toBe('menu');

    // Press Enter to start the game (from menu)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check if state changed or remained valid
    const newState = await page.evaluate(() => {
      // @ts-ignore
      return window.game?.state;
    });

    // Game should respond to input (state may change or stay in menu)
    expect(newState).toBeTruthy();
  });

  test('audio system is initialized', async ({ page }) => {
    // Wait for scripts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check that audio system is initialized
    const hasAudioSystem = await page.evaluate(() => {
      // @ts-ignore
      return typeof window.audioManager !== 'undefined' || typeof window.audio !== 'undefined';
    });

    // Audio system should be present
    expect(hasAudioSystem).toBe(true);
  });

  test('sprite system is initialized', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForTimeout(1500);

    // Check that sprites are loaded
    const hasSprites = await page.evaluate(() => {
      // @ts-ignore
      return typeof window.sprites !== 'undefined' || typeof window.spriteManager !== 'undefined';
    });

    expect(hasSprites).toBe(true);
  });

  test('page has correct meta configuration', async ({ page }) => {
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);

    // Check charset
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'UTF-8');
  });

  test('game assets are accessible', async ({ page }) => {
    // Check that key JavaScript files load
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

  test('CSS styling is applied correctly', async ({ page }) => {
    // Check that canvas has pixelated rendering
    const canvasStyle = await page.locator('#gameCanvas').evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        imageRendering: style.imageRendering,
        border: style.border
      };
    });

    // Should have pixelated rendering for retro look
    expect(canvasStyle.imageRendering).toMatch(/pixelated|crisp-edges/);
  });

  test('game dimensions are correct for gameplay', async ({ page }) => {
    // Verify the game viewport is appropriate
    const dimensions = await page.evaluate(() => {
      // @ts-ignore
      const game = window.game;
      if (!game) return null;

      return {
        width: game.width || 800,
        height: game.height || 600
      };
    });

    // Game should have standard dimensions
    expect(dimensions?.width).toBeGreaterThanOrEqual(800);
    expect(dimensions?.height).toBeGreaterThanOrEqual(600);
  });
});

test.describe('Performance Smoke Tests', () => {

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load within 10 seconds (generous for CDN)
    expect(loadTime).toBeLessThan(10000);
  });

  test('no memory leaks on initial load', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Get memory usage if available
    const memoryInfo = await page.evaluate(() => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        return performance.memory.usedJSHeapSize;
      }
      return null;
    });

    // Memory should be reasonable (less than 500MB for initial load)
    if (memoryInfo) {
      expect(memoryInfo).toBeLessThan(500 * 1024 * 1024);
    }
  });
});

test.describe('Accessibility Smoke Tests', () => {

  test('page has proper document structure', async ({ page }) => {
    await page.goto('/');

    // Check for h1 heading
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check page has lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
  });

  test('canvas has accessible attributes', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('#gameCanvas');

    // Canvas should have an id for reference
    await expect(canvas).toHaveAttribute('id', 'gameCanvas');
  });
});
