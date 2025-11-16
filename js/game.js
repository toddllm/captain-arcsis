// Main Game Loop for Captain Arcsis
// Core game state management and rendering

const Game = {
    canvas: null,
    ctx: null,
    lastTime: 0,
    deltaTime: 0,
    playTime: 0,

    state: 'menu', // menu, playing, paused, dialogue, boss_intro, game_over, victory
    currentLevel: 1,
    defeatedBosses: [],

    // Menu state
    menuSelection: 0,
    menuOptions: ['New Game', 'Continue', 'Controls'],

    // Pause menu
    pauseSelection: 0,
    pauseOptions: ['Resume', 'Save Game', 'Quit to Menu'],

    // Inventory display
    showInventory: false,

    init: function() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;

        // Initialize systems
        Input.init();
        Audio.init();
        Player.init(400, 300);

        // Check for existing save
        if (SaveSystem.hasSaveData()) {
            this.menuOptions[1] = 'Continue';
        } else {
            this.menuOptions[1] = 'Continue (No Save)';
        }

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    },

    gameLoop: function(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Cap delta time to prevent huge jumps
        if (this.deltaTime > 100) this.deltaTime = 100;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    },

    update: function(deltaTime) {
        // Resume audio context on any input
        if (Object.keys(Input.keys).some(k => Input.keys[k])) {
            Audio.resume();
        }

        switch (this.state) {
            case 'menu':
                this.updateMenu();
                break;

            case 'playing':
                this.updatePlaying(deltaTime);
                break;

            case 'paused':
                this.updatePaused();
                break;

            case 'dialogue':
                Dialogue.update(deltaTime);
                if (!Dialogue.isActive()) {
                    this.state = 'playing';
                }
                break;

            case 'boss_intro':
                if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
                    Bosses.activate();
                    this.state = 'playing';
                }
                break;

            case 'game_over':
                if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
                    this.state = 'menu';
                }
                break;

            case 'victory':
                if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
                    this.state = 'menu';
                }
                break;
        }

        Input.clearPressed();
    },

    updateMenu: function() {
        if (Input.wasJustPressed('ArrowUp') || Input.wasJustPressed('KeyW')) {
            this.menuSelection = (this.menuSelection - 1 + this.menuOptions.length) % this.menuOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('ArrowDown') || Input.wasJustPressed('KeyS')) {
            this.menuSelection = (this.menuSelection + 1) % this.menuOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
            this.selectMenuOption();
        }
    },

    selectMenuOption: function() {
        Audio.buttonPress();

        switch (this.menuSelection) {
            case 0: // New Game
                this.startNewGame();
                break;

            case 1: // Continue
                if (SaveSystem.hasSaveData()) {
                    this.loadGame();
                } else {
                    // No save data
                    Audio.playerHurt();
                }
                break;

            case 2: // Controls
                // Show controls (already shown at bottom)
                break;
        }
    },

    startNewGame: function() {
        // Reset everything
        Player.init(100, 300);
        Enemies.clear();
        Puzzles.clear();
        Bosses.clear();
        Combat.clear();
        Fairy.init();

        this.defeatedBosses = [];
        this.currentLevel = 1;
        this.playTime = 0;

        // Load forest area (intro)
        World.loadArea('forest');

        // Start intro dialogue
        this.state = 'dialogue';
        Dialogue.start('intro');
    },

    loadGame: function() {
        const saveData = SaveSystem.load();
        const gameData = SaveSystem.applyLoadData(saveData);

        if (gameData) {
            this.currentLevel = gameData.currentLevel;
            this.defeatedBosses = gameData.defeatedBosses;
            this.playTime = gameData.playTime;

            World.loadArea(gameData.currentArea);
            this.state = 'playing';
        }
    },

    updatePlaying: function(deltaTime) {
        this.playTime += deltaTime;

        // Check for pause
        if (Input.wasJustPressed('Escape')) {
            this.state = 'paused';
            Audio.menuSelect();
            return;
        }

        // Check for inventory toggle
        if (Input.wasJustPressed('KeyI')) {
            this.showInventory = !this.showInventory;
            Audio.menuSelect();
        }

        // Skip if inventory is open
        if (this.showInventory) {
            if (Input.wasJustPressed('Escape') || Input.wasJustPressed('KeyI')) {
                this.showInventory = false;
            }
            return;
        }

        // Update game entities
        Player.update(deltaTime, World);
        Enemies.update(deltaTime, Player);
        Fairy.update(deltaTime, Player);
        Bosses.update(deltaTime, Player);
        Puzzles.update(Player);
        Combat.update(deltaTime);

        // Check collisions
        Enemies.checkCollisions(Player);
        Bosses.checkCollisions(Player);

        // Check world updates (area transitions, coins)
        const nextArea = World.update(Player);
        if (nextArea) {
            this.transitionToArea(nextArea);
        }

        // Check button press in forest
        if (World.checkButtonPress(Player)) {
            Player.setFlag('button_pressed', true);
            Audio.buttonPress();
            this.state = 'dialogue';
            Dialogue.start('button_press');

            // After dialogue, transition to dungeon
            setTimeout(() => {
                if (Player.getFlag('button_pressed') && !Player.getFlag('entered_dungeon')) {
                    Player.setFlag('entered_dungeon', true);
                    this.transitionToArea('dungeon_1');

                    // Show fairy after entering dungeon
                    setTimeout(() => {
                        if (!Player.hasFairy) {
                            this.state = 'dialogue';
                            Dialogue.start('meet_fairy');
                        }
                    }, 1000);
                }
            }, 3000);
        }

        // Check for boss encounters
        if (Bosses.currentBoss && !Bosses.currentBoss.active && !Bosses.currentBoss.defeated) {
            const area = World.areas[World.currentArea];

            if (area.boss === 'origami_mirda' && !Player.getFlag('met_mirda')) {
                Player.setFlag('met_mirda', true);
                this.state = 'dialogue';
                Dialogue.start('origami_mirda_pre');
                setTimeout(() => {
                    this.state = 'boss_intro';
                }, 2000);
            } else if (area.boss === 'anizon' && !Player.getFlag('met_anizon')) {
                Player.setFlag('met_anizon', true);
                this.state = 'dialogue';
                Dialogue.start('anizon_pre');
                setTimeout(() => {
                    this.state = 'boss_intro';
                }, 2000);
            } else {
                this.state = 'boss_intro';
            }
        }

        // Check for boss defeat
        if (Bosses.isDefeated()) {
            const area = World.areas[World.currentArea];
            if (!this.defeatedBosses.includes(area.boss)) {
                this.defeatedBosses.push(area.boss);

                if (area.isFinalBoss) {
                    this.state = 'dialogue';
                    Dialogue.start('victory');
                } else if (area.nextArea) {
                    setTimeout(() => {
                        this.transitionToArea(area.nextArea);
                    }, 3000);
                }
            }
        }

        // Check for player death
        if (Player.hp <= 0) {
            this.state = 'game_over';
            Audio.gameOver();
        }

        // Auto-save
        SaveSystem.autoSave({
            currentLevel: this.currentLevel,
            currentArea: World.currentArea,
            defeatedBosses: this.defeatedBosses,
            playTime: this.playTime
        });
    },

    transitionToArea: function(areaName) {
        this.currentLevel++;
        World.loadArea(areaName);

        // First enemy encounters
        if (areaName === 'dungeon_1' && !Player.getFlag('first_zombie')) {
            Player.setFlag('first_zombie', true);
            setTimeout(() => {
                if (Fairy.active) {
                    Fairy.speak("Be careful! These enemies are tough!");
                }
            }, 2000);
        }

        if (areaName === 'dungeon_2' && !Player.getFlag('first_skeleton')) {
            Player.setFlag('first_skeleton', true);
            setTimeout(() => {
                this.state = 'dialogue';
                Dialogue.start('skeleton_encounter');
            }, 1000);
        }
    },

    updatePaused: function() {
        if (Input.wasJustPressed('Escape')) {
            this.state = 'playing';
            Audio.menuSelect();
            return;
        }

        if (Input.wasJustPressed('ArrowUp') || Input.wasJustPressed('KeyW')) {
            this.pauseSelection = (this.pauseSelection - 1 + this.pauseOptions.length) % this.pauseOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('ArrowDown') || Input.wasJustPressed('KeyS')) {
            this.pauseSelection = (this.pauseSelection + 1) % this.pauseOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
            this.selectPauseOption();
        }
    },

    selectPauseOption: function() {
        Audio.buttonPress();

        switch (this.pauseSelection) {
            case 0: // Resume
                this.state = 'playing';
                break;

            case 1: // Save Game
                SaveSystem.save({
                    currentLevel: this.currentLevel,
                    currentArea: World.currentArea,
                    defeatedBosses: this.defeatedBosses,
                    playTime: this.playTime
                });
                Fairy.speak("Game saved!");
                break;

            case 2: // Quit to Menu
                Audio.stopMusic();
                this.state = 'menu';
                break;
        }
    },

    showGameComplete: function() {
        this.state = 'victory';
    },

    render: function() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        switch (this.state) {
            case 'menu':
                this.renderMenu();
                break;

            case 'playing':
            case 'dialogue':
            case 'boss_intro':
                this.renderGame();
                break;

            case 'paused':
                this.renderGame();
                this.renderPauseMenu();
                break;

            case 'game_over':
                this.renderGameOver();
                break;

            case 'victory':
                this.renderVictory();
                break;
        }
    },

    renderMenu: function() {
        const ctx = this.ctx;

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAPTAIN ARCSIS', CONSTANTS.CANVAS_WIDTH / 2, 150);

        // Subtitle
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText('An 8-Bit Dungeon Adventure', CONSTANTS.CANVAS_WIDTH / 2, 190);

        // Menu options
        ctx.font = '24px monospace';
        this.menuOptions.forEach((option, i) => {
            if (i === this.menuSelection) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillText('> ' + option + ' <', CONSTANTS.CANVAS_WIDTH / 2, 300 + i * 50);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(option, CONSTANTS.CANVAS_WIDTH / 2, 300 + i * 50);
            }
        });

        // Save info
        if (SaveSystem.hasSaveData()) {
            const info = SaveSystem.getSaveInfo();
            if (info) {
                ctx.font = '14px monospace';
                ctx.fillStyle = '#888888';
                ctx.fillText(`Last Save: ${info.timestamp}`, CONSTANTS.CANVAS_WIDTH / 2, 480);
                ctx.fillText(`Level ${info.level} | ${info.coins} Coins | ${info.playTime}`, CONSTANTS.CANVAS_WIDTH / 2, 500);
            }
        }

        // Version info
        ctx.font = '12px monospace';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'right';
        ctx.fillText('v1.0.0 - Captain Arcsis Core', CONSTANTS.CANVAS_WIDTH - 10, CONSTANTS.CANVAS_HEIGHT - 10);
        ctx.textAlign = 'left';
        ctx.fillText('Yellow | Red | Green | Blue - Coming Soon!', 10, CONSTANTS.CANVAS_HEIGHT - 10);
    },

    renderGame: function() {
        const ctx = this.ctx;

        // Draw world
        World.draw(ctx);

        // Draw puzzle elements
        Puzzles.draw(ctx);

        // Draw enemies
        Enemies.draw(ctx);

        // Draw player
        Player.draw(ctx);

        // Draw fairy
        Fairy.draw(ctx);

        // Draw bosses
        Bosses.draw(ctx);

        // Draw combat effects
        Combat.draw(ctx);

        // Draw UI
        this.renderUI();

        // Draw dialogue
        if (this.state === 'dialogue') {
            Dialogue.draw(ctx);
        }

        // Boss intro screen
        if (this.state === 'boss_intro') {
            this.renderBossIntro();
        }

        // Draw inventory
        if (this.showInventory) {
            this.renderInventory();
        }
    },

    renderUI: function() {
        const ctx = this.ctx;

        // HEARTS DISPLAY (replaces HP bar)
        ctx.font = '12px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText('HEARTS:', 10, 22);

        // Draw hearts
        for (let i = 0; i < Player.maxHearts; i++) {
            const heartX = 80 + i * 40;
            const heartY = 10;

            if (i < Player.hearts) {
                // Full heart
                ctx.fillStyle = '#FF0000';
                this.drawHeart(ctx, heartX, heartY, 28, true);

                // Current heart HP bar (for the last heart)
                if (i === Player.hearts - 1) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(heartX - 2, heartY + 26, 32, 6);
                    ctx.fillStyle = '#FF6666';
                    ctx.fillRect(heartX, heartY + 27, 28 * (Player.hp / Player.heartHp), 4);
                }
            } else {
                // Empty heart
                ctx.fillStyle = '#444444';
                this.drawHeart(ctx, heartX, heartY, 28, false);
            }
        }

        // Special ability indicator (only when at full hearts)
        if (Player.canUseSpecial) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('SPECIAL READY! (R)', 10, 52);
        } else {
            ctx.fillStyle = '#666666';
            ctx.font = '12px monospace';
            ctx.fillText('SPECIAL: Need full hearts', 10, 52);
        }

        // Spin attack cooldown
        if (Player.spinCooldown > 0) {
            ctx.fillStyle = '#FF6600';
            ctx.fillText(`SPIN: ${Math.ceil(Player.spinCooldown / 1000)}s`, 10, 68);
        } else {
            ctx.fillStyle = '#FF6600';
            ctx.fillText('SPIN READY! (Shift+Space)', 10, 68);
        }

        // Dash cooldown
        if (Player.dashCooldown > 0) {
            ctx.fillStyle = '#00FFFF';
            ctx.fillText(`DASH: ${(Player.dashCooldown / 1000).toFixed(1)}s`, 10, 84);
        } else {
            ctx.fillStyle = '#00FFFF';
            ctx.fillText('DASH READY! (Q)', 10, 84);
        }

        // Fairy mana bar (if has fairy)
        const manaY = 100;
        if (Player.hasFairy) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(8, manaY, 154, 18);
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(10, manaY + 2, 150 * (Player.fairyMana / Player.maxFairyMana), 14);
            ctx.strokeStyle = '#FFB6C1';
            ctx.strokeRect(10, manaY + 2, 150, 14);
            ctx.fillStyle = '#FFB6C1';
            ctx.fillText(`MANA: ${Math.floor(Player.fairyMana)}`, 15, manaY + 14);
        }

        // Experience bar
        const expY = Player.hasFairy ? 124 : 100;
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, expY, 154, 18);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(10, expY + 2, 150 * (Player.exp / Player.expToNext), 14);
        ctx.strokeStyle = '#00FF00';
        ctx.strokeRect(10, expY + 2, 150, 14);
        ctx.fillStyle = '#00FF00';
        ctx.fillText(`LV ${Player.level} - ${Player.exp}/${Player.expToNext}`, 15, expY + 14);

        // Coins
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`COINS: ${Player.coins}`, 10, expY + 36);

        // Keys
        if (Player.keys > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText(`KEYS: ${Player.keys}`, 10, expY + 52);
        }

        // Max combo display
        if (Player.maxCombo > 1) {
            ctx.fillStyle = '#FF00FF';
            ctx.fillText(`MAX COMBO: ${Player.maxCombo}x`, 10, expY + 68);
        }

        // Equipment info (top right)
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`SWORD LV: ${Player.equipment.swordLevel}`, CONSTANTS.CANVAS_WIDTH - 10, 26);
        ctx.fillText(`SHIELD LV: ${Player.equipment.shieldLevel}`, CONSTANTS.CANVAS_WIDTH - 10, 46);

        // Power-up status
        let powerUpY = 66;
        if (Player.powerUps.damageBoost > 0) {
            ctx.fillStyle = '#FF4444';
            ctx.fillText(`DMG BOOST: ${Math.ceil(Player.powerUps.damageBoost / 1000)}s`, CONSTANTS.CANVAS_WIDTH - 10, powerUpY);
            powerUpY += 16;
        }
        if (Player.powerUps.speedBoost > 0) {
            ctx.fillStyle = '#44FF44';
            ctx.fillText(`SPD BOOST: ${Math.ceil(Player.powerUps.speedBoost / 1000)}s`, CONSTANTS.CANVAS_WIDTH - 10, powerUpY);
            powerUpY += 16;
        }
        if (Player.powerUps.shield > 0) {
            ctx.fillStyle = '#4444FF';
            ctx.fillText(`SHIELD: ${Math.ceil(Player.powerUps.shield / 1000)}s`, CONSTANTS.CANVAS_WIDTH - 10, powerUpY);
        }

        // Area name
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px monospace';
        ctx.fillText(World.getAreaName(), CONSTANTS.CANVAS_WIDTH / 2, 20);

        // Play time
        ctx.textAlign = 'right';
        ctx.font = '12px monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText(Utils.formatTime(this.playTime / 1000), CONSTANTS.CANVAS_WIDTH - 10, CONSTANTS.CANVAS_HEIGHT - 10);

        // Enemy count
        const enemyCount = Enemies.getCount();
        if (enemyCount > 0) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#FF6666';
            ctx.fillText(`Enemies: ${enemyCount}`, 10, CONSTANTS.CANVAS_HEIGHT - 10);
        }
    },

    // Helper function to draw heart shape
    drawHeart: function(ctx, x, y, size, filled) {
        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);

        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size * 0.5, size * 0.1, 0, size * 0.5);
        ctx.bezierCurveTo(size * 0.5, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);

        if (filled) {
            ctx.fill();
        } else {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    },

    renderPauseMenu: function() {
        const ctx = this.ctx;

        // Darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        // Pause title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CONSTANTS.CANVAS_WIDTH / 2, 200);

        // Menu options
        ctx.font = '20px monospace';
        this.pauseOptions.forEach((option, i) => {
            if (i === this.pauseSelection) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillText('> ' + option + ' <', CONSTANTS.CANVAS_WIDTH / 2, 280 + i * 40);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(option, CONSTANTS.CANVAS_WIDTH / 2, 280 + i * 40);
            }
        });
    },

    renderInventory: function() {
        const ctx = this.ctx;

        // Inventory window
        const invWidth = 400;
        const invHeight = 350;
        const invX = (CONSTANTS.CANVAS_WIDTH - invWidth) / 2;
        const invY = (CONSTANTS.CANVAS_HEIGHT - invHeight) / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(invX, invY, invWidth, invHeight);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(invX, invY, invWidth, invHeight);

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('INVENTORY', CONSTANTS.CANVAS_WIDTH / 2, invY + 35);

        // Stats
        ctx.font = '16px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';

        const statX = invX + 30;
        let statY = invY + 80;

        ctx.fillText(`Level: ${Player.level}`, statX, statY);
        statY += 25;
        ctx.fillText(`HP: ${Math.floor(Player.hp)}/${Player.maxHp}`, statX, statY);
        statY += 25;
        ctx.fillText(`Attack: ${Player.attack}`, statX, statY);
        statY += 25;
        ctx.fillText(`Defense: ${Player.defense}`, statX, statY);
        statY += 25;
        ctx.fillText(`Coins: ${Player.coins}`, statX, statY);
        statY += 25;
        ctx.fillText(`Keys: ${Player.keys}`, statX, statY);

        // Equipment
        statY += 40;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('EQUIPMENT:', statX, statY);
        ctx.fillStyle = '#FFFFFF';
        statY += 25;
        ctx.fillText(`Sword Level: ${Player.equipment.swordLevel}/10`, statX, statY);
        statY += 20;
        ctx.fillText(`  EXP: ${Player.equipment.swordExp}/${Player.equipment.swordExpToNext}`, statX, statY);
        statY += 25;
        ctx.fillText(`Shield Level: ${Player.equipment.shieldLevel}/10`, statX, statY);
        statY += 20;
        ctx.fillText(`  EXP: ${Player.equipment.shieldExp}/${Player.equipment.shieldExpToNext}`, statX, statY);

        // Close instruction
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.font = '14px monospace';
        ctx.fillText('Press I or ESC to close', CONSTANTS.CANVAS_WIDTH / 2, invY + invHeight - 20);
    },

    renderBossIntro: function() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FF0000';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS BATTLE!', CONSTANTS.CANVAS_WIDTH / 2, 200);

        if (Bosses.currentBoss) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px monospace';
            ctx.fillText(Bosses.currentBoss.name, CONSTANTS.CANVAS_WIDTH / 2, 280);
        }

        ctx.fillStyle = '#FFFF00';
        ctx.font = '16px monospace';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to begin!', CONSTANTS.CANVAS_WIDTH / 2, 400);
        }
    },

    renderGameOver: function() {
        const ctx = this.ctx;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FF0000';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CONSTANTS.CANVAS_WIDTH / 2, 250);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px monospace';
        ctx.fillText(`Level: ${Player.level}`, CONSTANTS.CANVAS_WIDTH / 2, 320);
        ctx.fillText(`Coins Collected: ${Player.coins}`, CONSTANTS.CANVAS_WIDTH / 2, 350);
        ctx.fillText(`Time: ${Utils.formatTime(this.playTime / 1000)}`, CONSTANTS.CANVAS_WIDTH / 2, 380);

        ctx.fillStyle = '#FFFF00';
        ctx.font = '16px monospace';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to return to menu', CONSTANTS.CANVAS_WIDTH / 2, 450);
        }
    },

    renderVictory: function() {
        const ctx = this.ctx;

        // Animated background
        const time = Date.now() * 0.001;
        const r = Math.floor(128 + Math.sin(time) * 64);
        const g = Math.floor(128 + Math.sin(time + 2) * 64);
        const b = Math.floor(128 + Math.sin(time + 4) * 64);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FFD700';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', CONSTANTS.CANVAS_WIDTH / 2, 150);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px monospace';
        ctx.fillText('Captain Arcsis has saved the day!', CONSTANTS.CANVAS_WIDTH / 2, 220);

        ctx.font = '18px monospace';
        ctx.fillText(`Final Level: ${Player.level}`, CONSTANTS.CANVAS_WIDTH / 2, 300);
        ctx.fillText(`Total Coins: ${Player.coins}`, CONSTANTS.CANVAS_WIDTH / 2, 330);
        ctx.fillText(`Time: ${Utils.formatTime(this.playTime / 1000)}`, CONSTANTS.CANVAS_WIDTH / 2, 360);
        ctx.fillText(`Sword Level: ${Player.equipment.swordLevel}`, CONSTANTS.CANVAS_WIDTH / 2, 390);
        ctx.fillText(`Shield Level: ${Player.equipment.shieldLevel}`, CONSTANTS.CANVAS_WIDTH / 2, 420);

        ctx.fillStyle = '#FFD700';
        ctx.font = '16px monospace';
        ctx.fillText('More adventures await in:', CONSTANTS.CANVAS_WIDTH / 2, 480);
        ctx.fillText('Captain Arcsis Yellow | Red | Green | Blue', CONSTANTS.CANVAS_WIDTH / 2, 505);

        ctx.fillStyle = '#FFFFFF';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to return to menu', CONSTANTS.CANVAS_WIDTH / 2, 560);
        }
    }
};

// Start the game when page loads
window.onload = function() {
    Game.init();
};
