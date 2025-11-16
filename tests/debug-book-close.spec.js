// @ts-check
const { test, expect } = require('@playwright/test');

const SITE_URL = process.env.TEST_URL || 'https://d148t8mrj9hw61.cloudfront.net';

test.describe('Debug Book Close Issue', () => {
    test('should close book display when pressing E or Space', async ({ page }) => {
        // Set up console logging
        page.on('console', msg => console.log('BROWSER:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err));

        await page.goto(SITE_URL);
        await page.waitForTimeout(2000);

        // Take initial screenshot
        await page.screenshot({ path: 'test-results/01-game-loaded.png', fullPage: true });
        console.log('Screenshot 1: Game loaded (main menu)');

        // Check if canvas exists
        const canvas = page.locator('#gameCanvas');
        await expect(canvas).toBeVisible();

        // START NEW GAME - Press Enter or Space to select "New Game"
        console.log('Starting new game...');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'test-results/02-character-select.png', fullPage: true });
        console.log('Screenshot 2: Character selection screen');

        // SELECT CHARACTER - Press Space to confirm (default: Yellow/Magic)
        console.log('Selecting character...');
        await page.keyboard.press('Space');
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/03-game-started.png', fullPage: true });
        console.log('Screenshot 3: Game started (intro dialogue active)');

        // CLEAR INTRO DIALOGUE - Press E/Space multiple times to advance through all dialogue
        console.log('Clearing intro dialogue...');
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Space');
            await page.waitForTimeout(300);
        }

        await page.screenshot({ path: 'test-results/04-dialogue-cleared.png', fullPage: true });
        console.log('Screenshot 4: After clearing intro dialogue');

        // Check game state
        const gameState = await page.evaluate(() => {
            // @ts-ignore
            return typeof Game !== 'undefined' ? Game.state : 'Game not found';
        });
        console.log('Game state:', gameState);

        // Move player to the book location (book is at x:180, y:350 in forest)
        // Player starts at x:100, y:300
        // Need to move right (+80) and down (+50)
        console.log('Moving player toward book...');

        // Check player and book positions
        const positions = await page.evaluate(() => {
            // @ts-ignore
            return {
                player: { x: Player.x, y: Player.y },
                // @ts-ignore
                book: Puzzles.elements.find(e => e.type === 'book')
            };
        });
        console.log('Positions:', JSON.stringify(positions));

        // Move player toward book based on actual positions
        // Press right to move toward book (book at ~180, player at ~100, need +80)
        console.log('Moving right...');
        await page.keyboard.down('KeyD');
        await page.waitForTimeout(400); // Short hold
        await page.keyboard.up('KeyD');

        // Press down to reach book y position (book at ~350, player at ~300, need +50)
        console.log('Moving down...');
        await page.keyboard.down('KeyS');
        await page.waitForTimeout(300); // Short hold
        await page.keyboard.up('KeyS');

        // Check positions after moving
        const positionsAfter = await page.evaluate(() => {
            // @ts-ignore
            return {
                player: { x: Player.x, y: Player.y },
                // @ts-ignore
                book: Puzzles.elements.find(e => e.type === 'book')
            };
        });
        console.log('Positions after move:', JSON.stringify(positionsAfter));

        await page.screenshot({ path: 'test-results/05-after-moving.png', fullPage: true });
        console.log('Screenshot 5: After moving to book');

        // Press E to interact with book (if near it)
        console.log('Pressing E to interact...');
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'test-results/06-after-first-E.png', fullPage: true });
        console.log('Screenshot 6: After first E press (should open book)');

        // Check if book display is active via game state
        const bookActiveAfterOpen = await page.evaluate(() => {
            // @ts-ignore
            return typeof Puzzles !== 'undefined' ? Puzzles.bookDisplayActive : 'Puzzles not found';
        });
        console.log('Puzzles.bookDisplayActive after opening:', bookActiveAfterOpen);

        // Try pressing E again to close
        console.log('Pressing E to close book...');
        await page.keyboard.press('KeyE');
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'test-results/07-after-second-E.png', fullPage: true });
        console.log('Screenshot 7: After second E press (should close)');

        // Check if book is still active
        const bookActiveAfterE = await page.evaluate(() => {
            // @ts-ignore
            return typeof Puzzles !== 'undefined' ? Puzzles.bookDisplayActive : 'Puzzles not found';
        });
        console.log('Puzzles.bookDisplayActive after E to close:', bookActiveAfterE);

        // If still open, try Space
        if (bookActiveAfterE === true) {
            console.log('Book still open! Pressing Space to close...');
            await page.keyboard.press('Space');
            await page.waitForTimeout(500);

            await page.screenshot({ path: 'test-results/08-after-space.png', fullPage: true });
            console.log('Screenshot 8: After Space press');

            const bookActiveAfterSpace = await page.evaluate(() => {
                // @ts-ignore
                return Puzzles.bookDisplayActive;
            });
            console.log('Puzzles.bookDisplayActive after Space:', bookActiveAfterSpace);
        }

        // Check game state via console
        const bookActive = await page.evaluate(() => {
            // @ts-ignore
            return typeof Puzzles !== 'undefined' ? Puzzles.bookDisplayActive : 'Puzzles not found';
        });
        console.log('Puzzles.bookDisplayActive:', bookActive);

        // Check Input state
        const inputState = await page.evaluate(() => {
            // @ts-ignore
            if (typeof Input !== 'undefined') {
                return {
                    keys: Input.keys,
                    keyPressed: Input.keyPressed
                };
            }
            return 'Input not found';
        });
        console.log('Input state:', JSON.stringify(inputState));
    });
});
