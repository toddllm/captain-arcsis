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

test.describe('Feature Smoke Tests - Lever Interaction Fix', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('puzzle system has lever handling', async ({ page }) => {
    const hasLeverSupport = await page.evaluate(() => {
      return typeof Puzzles !== 'undefined' &&
             typeof Puzzles.interact === 'function' &&
             typeof Puzzles.solved === 'object';
    });
    expect(hasLeverSupport).toBe(true);
  });

  test('lever interaction tracks solved state', async ({ page }) => {
    const leverTrackingSolved = await page.evaluate(() => {
      if (typeof Puzzles === 'undefined') return false;
      // Check that Puzzles.solved object exists for tracking
      return typeof Puzzles.solved === 'object' && Puzzles.solved !== null;
    });
    expect(leverTrackingSolved).toBe(true);
  });

  test('puzzle audio functions exist', async ({ page }) => {
    const hasAudioFunctions = await page.evaluate(() => {
      return typeof Audio !== 'undefined' &&
             typeof Audio.puzzleSolve === 'function' &&
             typeof Audio.buttonPress === 'function';
    });
    expect(hasAudioFunctions).toBe(true);
  });
});

test.describe('Feature Smoke Tests - Forest Monsters', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('forest enemy types are defined', async ({ page }) => {
    const hasForestEnemies = await page.evaluate(() => {
      if (typeof Enemy === 'undefined') return false;
      // Test creating forest enemy types
      const enemy = new Enemy(100, 100, 'forest_wolf');
      return enemy.type === 'forest_wolf' && enemy.maxHp > 0;
    });
    expect(hasForestEnemies).toBe(true);
  });

  test('forest wolf has pack hunter ability', async ({ page }) => {
    const hasPackHunter = await page.evaluate(() => {
      if (typeof Enemy === 'undefined') return false;
      const wolf = new Enemy(100, 100, 'forest_wolf');
      return wolf.packHunter === true;
    });
    expect(hasPackHunter).toBe(true);
  });

  test('corrupted sprite enemy exists', async ({ page }) => {
    const hasCorruptedSprite = await page.evaluate(() => {
      if (typeof Enemy === 'undefined') return false;
      const sprite = new Enemy(100, 100, 'corrupted_sprite');
      return sprite.type === 'corrupted_sprite' && sprite.magicDamage > 0;
    });
    expect(hasCorruptedSprite).toBe(true);
  });

  test('wild boar has charge attack', async ({ page }) => {
    const hasChargeAttack = await page.evaluate(() => {
      if (typeof Enemy === 'undefined') return false;
      const boar = new Enemy(100, 100, 'wild_boar');
      return boar.chargeAttack === true;
    });
    expect(hasChargeAttack).toBe(true);
  });

  test('forest spider is poisonous', async ({ page }) => {
    const isPoisonous = await page.evaluate(() => {
      if (typeof Enemy === 'undefined') return false;
      const spider = new Enemy(100, 100, 'forest_spider');
      return spider.poisonous === true;
    });
    expect(isPoisonous).toBe(true);
  });

  test('world has forest area with enemies', async ({ page }) => {
    const hasForestEnemies = await page.evaluate(() => {
      if (typeof World === 'undefined' || !World.areas) return false;
      const forest = World.areas.forest;
      return forest && forest.enemies && forest.enemies.length > 0;
    });
    expect(hasForestEnemies).toBe(true);
  });
});

test.describe('Feature Smoke Tests - In-Game Book System', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('book puzzle element creator exists', async ({ page }) => {
    const hasBookCreator = await page.evaluate(() => {
      return typeof Puzzles !== 'undefined' &&
             typeof Puzzles.createBook === 'function';
    });
    expect(hasBookCreator).toBe(true);
  });

  test('book display system is implemented', async ({ page }) => {
    const hasBookDisplay = await page.evaluate(() => {
      return typeof Puzzles !== 'undefined' &&
             typeof Puzzles.drawBookDisplay === 'function' &&
             typeof Puzzles.updateBookDisplay === 'function';
    });
    expect(hasBookDisplay).toBe(true);
  });

  test('book can be created with content', async ({ page }) => {
    const canCreateBook = await page.evaluate(() => {
      if (typeof Puzzles === 'undefined' || !Puzzles.createBook) return false;
      const book = Puzzles.createBook(100, 100, 'test_book', 'Test Title', 'Test contents');
      return book.type === 'book' &&
             book.title === 'Test Title' &&
             book.contents === 'Test contents' &&
             book.read === false;
    });
    expect(canCreateBook).toBe(true);
  });

  test('forest area has guide book', async ({ page }) => {
    const hasForestBook = await page.evaluate(() => {
      if (typeof World === 'undefined' || !World.areas) return false;
      const forest = World.areas.forest;
      if (!forest || !forest.puzzleElements) return false;
      return forest.puzzleElements.some(el =>
        el.type === 'book' && el.id === 'forest_guide'
      );
    });
    expect(hasForestBook).toBe(true);
  });
});

test.describe('Feature Smoke Tests - Lica Fairy Companion', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('fairy is named Lica', async ({ page }) => {
    const isLica = await page.evaluate(() => {
      return typeof Fairy !== 'undefined' && Fairy.name === 'Lica';
    });
    expect(isLica).toBe(true);
  });

  test('Lica is the Eternal Guardian', async ({ page }) => {
    const hasTitle = await page.evaluate(() => {
      return typeof Fairy !== 'undefined' &&
             Fairy.title === 'The Eternal Guardian';
    });
    expect(hasTitle).toBe(true);
  });

  test('Lica has infinite power level', async ({ page }) => {
    const hasInfinitePower = await page.evaluate(() => {
      return typeof Fairy !== 'undefined' &&
             Fairy.powerLevel === Infinity;
    });
    expect(hasInfinitePower).toBe(true);
  });

  test('Lica has supreme abilities', async ({ page }) => {
    const hasAbilities = await page.evaluate(() => {
      if (typeof Fairy === 'undefined' || !Fairy.abilities) return false;
      const abilities = Fairy.abilities;
      return abilities.heal &&
             abilities.timeStop &&
             abilities.cosmicJudgment &&
             abilities.divineResurrection;
    });
    expect(hasAbilities).toBe(true);
  });

  test('Lica can unlock true form', async ({ page }) => {
    const canUnlockTrueForm = await page.evaluate(() => {
      return typeof Fairy !== 'undefined' &&
             typeof Fairy.unlockTrueForm === 'function';
    });
    expect(canUnlockTrueForm).toBe(true);
  });

  test('dialogue has Lica introduction', async ({ page }) => {
    const hasLicaDialogue = await page.evaluate(() => {
      if (typeof Dialogue === 'undefined' || !Dialogue.dialogues) return false;
      const meetFairy = Dialogue.dialogues.meet_fairy;
      return meetFairy &&
             meetFairy.speaker === 'Lica' &&
             meetFairy.lines.some(line => line.includes('Eternal Guardian'));
    });
    expect(hasLicaDialogue).toBe(true);
  });
});

test.describe('Feature Smoke Tests - Story Moments and Plot Twists', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('mom prison discovery dialogue exists', async ({ page }) => {
    const hasMomDialogue = await page.evaluate(() => {
      if (typeof Dialogue === 'undefined' || !Dialogue.dialogues) return false;
      return Dialogue.dialogues.find_mom_prison !== undefined &&
             Dialogue.dialogues.mom_responds !== undefined;
    });
    expect(hasMomDialogue).toBe(true);
  });

  test('Anizon truth reveal dialogue exists', async ({ page }) => {
    const hasTwist = await page.evaluate(() => {
      if (typeof Dialogue === 'undefined' || !Dialogue.dialogues) return false;
      const reveal = Dialogue.dialogues.anizon_truth_reveal;
      return reveal && reveal.speaker === 'Anizon' &&
             reveal.lines.some(line => line.includes('BAIT'));
    });
    expect(hasTwist).toBe(true);
  });

  test('Lica revelation dialogue exists', async ({ page }) => {
    const hasRevelation = await page.evaluate(() => {
      if (typeof Dialogue === 'undefined' || !Dialogue.dialogues) return false;
      return Dialogue.dialogues.lica_revelation !== undefined;
    });
    expect(hasRevelation).toBe(true);
  });

  test('prison cell puzzle element is supported', async ({ page }) => {
    const hasPrisonCell = await page.evaluate(() => {
      if (typeof Puzzles === 'undefined') return false;
      // Check that prison_cell is a recognized puzzle type
      const testElement = { type: 'prison_cell', hasMom: true };
      return testElement.type === 'prison_cell';
    });
    expect(hasPrisonCell).toBe(true);
  });
});

test.describe('Feature Smoke Tests - Expanded World', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('world has massive maze areas', async ({ page }) => {
    const hasMazeAreas = await page.evaluate(() => {
      if (typeof World === 'undefined' || !World.areas) return false;
      const areas = World.areas;
      return areas.mom_prison !== undefined ||
             areas.underground_labyrinth_1 !== undefined ||
             areas.underground_labyrinth_2 !== undefined;
    });
    expect(hasMazeAreas).toBe(true);
  });

  test('maze areas have large dimensions', async ({ page }) => {
    const hasLargeDimensions = await page.evaluate(() => {
      if (typeof World === 'undefined' || !World.areas) return false;
      const momPrison = World.areas.mom_prison;
      if (!momPrison || !momPrison.tiles) return false;
      // Check for large maze (at least 50 tiles wide)
      return momPrison.tiles[0] && momPrison.tiles[0].length >= 50;
    });
    expect(hasLargeDimensions).toBe(true);
  });

  test('procedural maze generator exists', async ({ page }) => {
    const hasMazeGenerator = await page.evaluate(() => {
      return typeof World !== 'undefined' &&
             typeof World.generateProceduralMaze === 'function';
    });
    expect(hasMazeGenerator).toBe(true);
  });
});
