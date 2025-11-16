// Main Game Loop for Captain Arcsis - ENHANCED EDITION
// With Character Selection, Shop System, and Progressive Anizon Boss!

const Game = {
    canvas: null,
    ctx: null,
    lastTime: 0,
    deltaTime: 0,
    playTime: 0,

    state: 'menu', // menu, character_select, playing, paused, dialogue, boss_intro, game_over, victory, shop, skills
    currentLevel: 1,
    defeatedBosses: [],
    anizonDefeatHandled: false, // Guard to prevent event spam

    // Cooldown system for all events
    eventCooldowns: {},

    // Menu state
    menuSelection: 0,
    menuOptions: ['New Game', 'Continue', 'Controls'],

    // Character selection
    characterSelection: 0,
    characterOptions: ['YELLOW', 'RED', 'GREEN', 'BLUE'],

    // Pause menu
    pauseSelection: 0,
    pauseOptions: ['Resume', 'Shop', 'Skills', 'Save Game', 'Music: On', 'Quit to Menu'],

    // Shop state
    shopSelection: 0,
    shopItems: [],

    // Skills state
    skillSelection: 0,
    skillOptions: [],

    // Inventory display
    showInventory: false,

    // Notification system for visual feedback
    notification: '',
    notificationTimer: 0,
    notificationColor: '#00FF00',

    init: function() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        Input.init();
        Audio.init();
        Player.init(400, 300);

        if (SaveSystem.hasSaveData()) {
            this.menuOptions[1] = 'Continue';
        } else {
            this.menuOptions[1] = 'Continue (No Save)';
        }

        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    },

    gameLoop: function(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (this.deltaTime > 100) this.deltaTime = 100;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    },

    update: function(deltaTime) {
        if (Object.keys(Input.keys).some(k => Input.keys[k])) {
            Audio.resume();
        }

        // Update screen shake effect
        ScreenShake.update(deltaTime);

        // Update low health warning effect
        LowHealthWarning.update(deltaTime);

        // Update notification timer
        this.updateNotification(deltaTime);

        switch (this.state) {
            case 'menu':
                this.updateMenu();
                break;

            case 'character_select':
                this.updateCharacterSelect();
                break;

            case 'playing':
                this.updatePlaying(deltaTime);
                break;

            case 'paused':
                this.updatePaused();
                break;

            case 'shop':
                this.updateShop();
                break;

            case 'skills':
                this.updateSkills();
                break;

            case 'dialogue':
                // Allow closing book display even during dialogue
                if (Puzzles.bookDisplayActive) {
                    Puzzles.updateBookDisplay();
                }

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
                    // DEATH REWARD: Grant extra heart on death (max 7)
                    if (Player.maxHearts < CONSTANTS.MAX_HEARTS) {
                        Player.maxHearts++;
                        Player.permanentDeaths++;
                        console.log('[DEBUG] Death progression! maxHearts:', Player.maxHearts, 'permanentDeaths:', Player.permanentDeaths);
                        Fairy.speak(`Death makes you stronger! Max hearts: ${Player.maxHearts}/7`);

                        // CRITICAL: Save death progression immediately so it persists
                        SaveSystem.save({
                            currentLevel: this.currentLevel,
                            currentArea: World.currentArea,
                            defeatedBosses: this.defeatedBosses,
                            playTime: this.playTime
                        });
                        console.log('[DEBUG] Death progression saved to localStorage');
                    }
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
            case 0: // New Game - Go to character selection
                this.state = 'character_select';
                this.characterSelection = 3; // Default to Blue
                break;

            case 1: // Continue
                if (SaveSystem.hasSaveData()) {
                    this.loadGame();
                } else {
                    Audio.playerHurt();
                }
                break;

            case 2: // Controls
                break;
        }
    },

    updateCharacterSelect: function() {
        if (Input.wasJustPressed('ArrowLeft') || Input.wasJustPressed('KeyA')) {
            this.characterSelection = (this.characterSelection - 1 + this.characterOptions.length) % this.characterOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('ArrowRight') || Input.wasJustPressed('KeyD')) {
            this.characterSelection = (this.characterSelection + 1) % this.characterOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
            Audio.buttonPress();
            this.startNewGame(this.characterOptions[this.characterSelection]);
        }

        if (Input.wasJustPressed('Escape')) {
            this.state = 'menu';
            Audio.menuSelect();
        }
    },

    startNewGame: function(arcsisType = 'BLUE') {
        Player.init(100, 300, arcsisType);
        Enemies.clear();
        Puzzles.clear();
        Bosses.clear();
        Combat.clear();
        Fairy.init();

        this.defeatedBosses = [];
        this.currentLevel = 1;
        this.playTime = 0;

        World.loadArea('forest');

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

        if (Input.wasJustPressed('Escape')) {
            this.state = 'paused';
            this.pauseSelection = 0;
            Audio.menuSelect();
            return;
        }

        if (Input.wasJustPressed('KeyI')) {
            this.showInventory = !this.showInventory;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('KeyB')) {
            this.openShop();
            return;
        }

        if (Input.wasJustPressed('KeyK')) {
            this.openSkills();
            return;
        }

        if (this.showInventory) {
            if (Input.wasJustPressed('Escape') || Input.wasJustPressed('KeyI')) {
                this.showInventory = false;
            }
            return;
        }

        // Handle book display FIRST (highest priority for input)
        if (Puzzles.bookDisplayActive) {
            Puzzles.updateBookDisplay();
            return; // Skip all other updates while book is displayed
        }

        Player.update(deltaTime, World);
        Enemies.update(deltaTime, Player);
        Fairy.update(deltaTime, Player);
        Bosses.update(deltaTime, Player);

        // Check button press BEFORE puzzles (so 'E' key isn't consumed by puzzle interactions)
        const buttonPressed = World.checkButtonPress(Player);

        Puzzles.update(Player);
        Puzzles.updateBookDisplay(); // Handle in-game book reading
        Combat.update(deltaTime);

        Enemies.checkCollisions(Player);
        Bosses.checkCollisions(Player);

        const nextArea = World.update(Player);
        if (nextArea) {
            this.transitionToArea(nextArea);
        }

        if (buttonPressed) {
            Player.setFlag('button_pressed', true);
            Audio.buttonPress();
            this.state = 'dialogue';
            Dialogue.start('button_press');

            setTimeout(() => {
                if (Player.getFlag('button_pressed') && !Player.getFlag('entered_dungeon')) {
                    Player.setFlag('entered_dungeon', true);
                    this.transitionToArea('dungeon_1');

                    setTimeout(() => {
                        if (!Player.hasFairy) {
                            this.state = 'dialogue';
                            Dialogue.start('meet_fairy');
                        }
                    }, 1000);
                }
            }, 3000);
        }

        // Check for Anizon encounter at end of each dungeon level
        if (Bosses.currentBoss && !Bosses.currentBoss.active && !Bosses.currentBoss.defeated) {
            const area = World.areas[World.currentArea];

            if (area.boss === 'origami_mirda' && !Player.getFlag('met_mirda')) {
                Player.setFlag('met_mirda', true);
                this.state = 'dialogue';
                Dialogue.start('origami_mirda_pre');
                setTimeout(() => {
                    this.state = 'boss_intro';
                }, 2000);
            } else if (area.boss === 'anizon') {
                this.state = 'boss_intro';
            } else {
                this.state = 'boss_intro';
            }
        }

        // Check for boss defeat
        if (Bosses.isDefeated()) {
            const area = World.areas[World.currentArea];

            // Handle Anizon defeat specially
            if (Bosses.currentBoss && Bosses.currentBoss.type === 'anizon') {
                // CRITICAL FIX: Only handle defeat ONCE using a guard flag
                if (!this.anizonDefeatHandled) {
                    this.anizonDefeatHandled = true; // Prevent spam!
                    console.log('[DEBUG] Anizon defeated! Calling onAnizonDefeat once.');
                    Player.onAnizonDefeat();

                    // Anizon appears in EVERY level - transition to next with new Anizon
                    setTimeout(() => {
                        this.anizonDefeatHandled = false; // Reset for next encounter
                        if (area.nextArea) {
                            this.transitionToArea(area.nextArea);
                        } else {
                            // Loop back or generate endless dungeon
                            this.generateNextDungeonLevel();
                        }
                    }, 5000);
                }
            } else {
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
        }

        if (Player.hp <= 0) {
            this.state = 'game_over';
            Audio.gameOver();
        }

        SaveSystem.autoSave({
            currentLevel: this.currentLevel,
            currentArea: World.currentArea,
            defeatedBosses: this.defeatedBosses,
            playTime: this.playTime
        });
    },

    generateNextDungeonLevel: function() {
        // Generate endless dungeon levels with Anizon
        this.currentLevel++;
        const newAreaName = `dungeon_${this.currentLevel}`;

        // Create procedural dungeon area
        if (!World.areas[newAreaName]) {
            World.generateDungeonLevel(this.currentLevel);
        }

        World.loadArea(newAreaName);

        // Always spawn Anizon with progressive difficulty
        Bosses.spawnAnizon(Player);
    },

    transitionToArea: function(areaName) {
        this.currentLevel++;
        World.loadArea(areaName);

        // Spawn Anizon at end of every level
        if (areaName.includes('dungeon')) {
            Bosses.spawnAnizon(Player);
        }

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

    showNotification: function(message, color = '#FFFFFF') {
        this.notification = message;
        this.notificationTimer = 3000; // Show for 3 seconds
        this.notificationColor = color;
        Audio.saveGame(); // Play feedback sound
    },

    updateNotification: function(deltaTime) {
        if (this.notificationTimer > 0) {
            this.notificationTimer -= deltaTime;
            if (this.notificationTimer <= 0) {
                this.notification = '';
            }
        }
    },

    renderNotification: function() {
        if (!this.notification) return;

        const ctx = this.ctx;
        ctx.save();

        // Calculate fade based on timer
        const alpha = Math.min(1, this.notificationTimer / 500);

        // Draw notification box
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#000000';
        ctx.fillRect(CONSTANTS.CANVAS_WIDTH / 2 - 150, 50, 300, 50);
        ctx.strokeStyle = this.notificationColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(CONSTANTS.CANVAS_WIDTH / 2 - 150, 50, 300, 50);

        // Draw text
        ctx.fillStyle = this.notificationColor;
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.notification, CONSTANTS.CANVAS_WIDTH / 2, 82);

        ctx.restore();
    },

    updatePaused: function() {
        // Update music toggle label to reflect current state
        this.pauseOptions[4] = Audio.isMusicEnabled() ? 'Music: On' : 'Music: Off';

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

            case 1: // Shop
                this.openShop();
                break;

            case 2: // Skills
                this.openSkills();
                break;

            case 3: // Save Game
                console.log('[DEBUG] Save Game selected');
                const saveResult = SaveSystem.save({
                    currentLevel: this.currentLevel,
                    currentArea: World.currentArea,
                    defeatedBosses: this.defeatedBosses,
                    playTime: this.playTime
                });
                console.log('[DEBUG] Save result:', saveResult);
                if (saveResult) {
                    this.showNotification('GAME SAVED!', '#00FF00');
                    if (Fairy.active) {
                        Fairy.speak("Game saved!");
                    }
                } else {
                    this.showNotification('SAVE FAILED!', '#FF0000');
                }
                break;

            case 4: // Music Toggle
                const musicEnabled = Audio.toggleMusic();
                Fairy.speak(musicEnabled ? "Music enabled!" : "Music disabled!");
                break;

            case 5: // Quit to Menu
                Audio.stopMusic();
                this.state = 'menu';
                break;
        }
    },

    openShop: function() {
        this.state = 'shop';
        this.shopSelection = 0;
        this.updateShopItems();
        Audio.menuSelect();
    },

    updateShopItems: function() {
        const swordPrice = Math.floor(CONSTANTS.SHOP_PRICES.SWORD_BASE * Math.pow(CONSTANTS.SHOP_PRICES.SWORD_MULTIPLIER, Player.equipment.swordLevel - 1));
        const shieldPrice = Math.floor(CONSTANTS.SHOP_PRICES.SHIELD_BASE * Math.pow(CONSTANTS.SHOP_PRICES.SHIELD_MULTIPLIER, Player.equipment.shieldLevel - 1));

        this.shopItems = [
            { name: `Upgrade Sword (Lv.${Player.equipment.swordLevel + 1})`, price: swordPrice, action: 'sword' },
            { name: `Upgrade Shield (Lv.${Player.equipment.shieldLevel + 1})`, price: shieldPrice, action: 'shield' },
            { name: 'Health Potion', price: CONSTANTS.SHOP_PRICES.HEALTH_POTION, action: 'health_potion' },
            { name: 'Mana Potion', price: CONSTANTS.SHOP_PRICES.MANA_POTION, action: 'mana_potion' },
            { name: 'Mega Potion (Full Restore)', price: CONSTANTS.SHOP_PRICES.MEGA_POTION, action: 'mega_potion' },
            { name: 'Secret Key', price: CONSTANTS.SHOP_PRICES.KEY_PRICE, action: 'key' },
            { name: 'Close Shop', price: 0, action: 'close' }
        ];

        // Add spell unlocks
        const unlearnedSpells = Player.availableSpells.filter(s => !Player.learnedSpells.includes(s));
        unlearnedSpells.slice(0, 3).forEach((spell, i) => {
            const spellPrice = Math.floor(CONSTANTS.SHOP_PRICES.SPELL_UNLOCK_BASE * Math.pow(CONSTANTS.SHOP_PRICES.SPELL_UNLOCK_MULTIPLIER, i));
            this.shopItems.splice(-1, 0, {
                name: `Learn ${spell.charAt(0).toUpperCase() + spell.slice(1)} Spell`,
                price: spellPrice,
                action: `spell_${spell}`
            });
        });
    },

    updateShop: function() {
        if (Input.wasJustPressed('Escape')) {
            this.state = 'paused';
            Audio.menuSelect();
            return;
        }

        if (Input.wasJustPressed('ArrowUp') || Input.wasJustPressed('KeyW')) {
            this.shopSelection = (this.shopSelection - 1 + this.shopItems.length) % this.shopItems.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('ArrowDown') || Input.wasJustPressed('KeyS')) {
            this.shopSelection = (this.shopSelection + 1) % this.shopItems.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
            this.purchaseShopItem();
        }
    },

    purchaseShopItem: function() {
        const item = this.shopItems[this.shopSelection];

        if (item.action === 'close') {
            this.state = 'paused';
            Audio.menuSelect();
            return;
        }

        if (Player.spendCoins(item.price)) {
            Audio.shopPurchase();

            switch (item.action) {
                case 'sword':
                    Player.equipment.swordLevel++;
                    Player.updateSwordTier();
                    break;

                case 'shield':
                    Player.equipment.shieldLevel++;
                    Player.updateShieldTier();
                    break;

                case 'health_potion':
                    Player.potions.health++;
                    break;

                case 'mana_potion':
                    Player.potions.mana++;
                    break;

                case 'mega_potion':
                    Player.potions.mega++;
                    break;

                case 'key':
                    Player.keys++;
                    break;

                default:
                    if (item.action.startsWith('spell_')) {
                        const spellName = item.action.replace('spell_', '');
                        Player.learnSpell(spellName);
                        Audio.spellLearn();
                    }
            }

            this.updateShopItems();
        } else {
            Audio.playerHurt();
        }
    },

    openSkills: function() {
        this.state = 'skills';
        this.skillSelection = 0;
        this.updateSkillOptions();
        Audio.menuSelect();
    },

    updateSkillOptions: function() {
        this.skillOptions = Object.keys(Player.skills).map(skillName => ({
            name: skillName.replace(/([A-Z])/g, ' $1').trim(),
            key: skillName,
            level: Player.skills[skillName],
            maxLevel: 10
        }));
        this.skillOptions.push({ name: 'Close', key: 'close', level: 0, maxLevel: 0 });
    },

    updateSkills: function() {
        if (Input.wasJustPressed('Escape')) {
            this.state = 'paused';
            Audio.menuSelect();
            return;
        }

        if (Input.wasJustPressed('ArrowUp') || Input.wasJustPressed('KeyW')) {
            this.skillSelection = (this.skillSelection - 1 + this.skillOptions.length) % this.skillOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('ArrowDown') || Input.wasJustPressed('KeyS')) {
            this.skillSelection = (this.skillSelection + 1) % this.skillOptions.length;
            Audio.menuSelect();
        }

        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter')) {
            const skill = this.skillOptions[this.skillSelection];
            if (skill.key === 'close') {
                this.state = 'paused';
                Audio.menuSelect();
            } else if (Player.spendSkillPoint(skill.key)) {
                Audio.levelUp();
                this.updateSkillOptions();
            } else {
                Audio.playerHurt();
            }
        }
    },

    render: function() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        // Apply screen shake effect
        this.ctx.save();
        ScreenShake.apply(this.ctx);

        switch (this.state) {
            case 'menu':
                this.renderMenu();
                break;

            case 'character_select':
                this.renderCharacterSelect();
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

            case 'shop':
                this.renderGame();
                this.renderShop();
                break;

            case 'skills':
                this.renderGame();
                this.renderSkills();
                break;

            case 'game_over':
                this.renderGameOver();
                break;

            case 'victory':
                this.renderVictory();
                break;
        }

        // Restore context after screen shake
        this.ctx.restore();

        // Render notification on top of everything (not affected by screen shake)
        this.renderNotification();
    },

    renderMenu: function() {
        const ctx = this.ctx;

        ctx.fillStyle = '#FFD700';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAPTAIN ARCSIS', CONSTANTS.CANVAS_WIDTH / 2, 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText('ENHANCED EDITION', CONSTANTS.CANVAS_WIDTH / 2, 160);

        ctx.font = '12px monospace';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Yellow | Red | Green | Blue', CONSTANTS.CANVAS_WIDTH / 2, 190);
        ctx.fillStyle = '#FF0000';
        ctx.fillText('Infinite Sword & Shield Evolution!', CONSTANTS.CANVAS_WIDTH / 2, 210);
        ctx.fillStyle = '#FF00FF';
        ctx.fillText('ANIZON: Progressive Boss with Friends & Secrets!', CONSTANTS.CANVAS_WIDTH / 2, 230);

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

        if (SaveSystem.hasSaveData()) {
            const info = SaveSystem.getSaveInfo();
            if (info) {
                ctx.font = '14px monospace';
                ctx.fillStyle = '#888888';
                ctx.fillText(`Last Save: ${info.timestamp}`, CONSTANTS.CANVAS_WIDTH / 2, 480);
                ctx.fillText(`Level ${info.level} | ${info.coins} Coins | ${info.playTime}`, CONSTANTS.CANVAS_WIDTH / 2, 500);
            }
        }

        ctx.font = '12px monospace';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'right';
        ctx.fillText('v2.0.0 - Enhanced Edition', CONSTANTS.CANVAS_WIDTH - 10, CONSTANTS.CANVAS_HEIGHT - 10);
        ctx.textAlign = 'left';
        ctx.fillText('Press B for Shop | K for Skills', 10, CONSTANTS.CANVAS_HEIGHT - 10);
    },

    renderCharacterSelect: function() {
        const ctx = this.ctx;

        ctx.fillStyle = '#FFD700';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT YOUR ARCSIS', CONSTANTS.CANVAS_WIDTH / 2, 80);

        const cardWidth = 150;
        const cardHeight = 250;
        const startX = (CONSTANTS.CANVAS_WIDTH - cardWidth * 4 - 30) / 2;

        this.characterOptions.forEach((type, i) => {
            const x = startX + i * (cardWidth + 10);
            const y = 120;
            const typeData = CONSTANTS.ARCSIS_TYPES[type];
            const isSelected = i === this.characterSelection;

            // Card background
            ctx.fillStyle = isSelected ? typeData.color : '#333333';
            ctx.globalAlpha = isSelected ? 0.8 : 0.4;
            ctx.fillRect(x, y, cardWidth, cardHeight);
            ctx.globalAlpha = 1;

            // Border
            ctx.strokeStyle = isSelected ? '#FFFFFF' : '#666666';
            ctx.lineWidth = isSelected ? 4 : 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);

            // Character preview
            ctx.save();
            ctx.translate(x + cardWidth / 2 - 16, y + 40);
            const previewEquipment = { swordLevel: 1, shieldLevel: 1, swordRarity: 'COMMON', shieldRarity: 'COMMON' };
            Sprites.drawArcsis(ctx, 0, 0, 'down', 0, previewEquipment, type);
            ctx.restore();

            // Type name
            ctx.fillStyle = typeData.color;
            ctx.font = 'bold 18px monospace';
            ctx.fillText(type, x + cardWidth / 2, y + 120);

            // Specialty
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '14px monospace';
            ctx.fillText(typeData.specialty, x + cardWidth / 2, y + 145);

            // Description (wrapped)
            ctx.font = '10px monospace';
            const words = typeData.description.split(' ');
            let line = '';
            let lineY = y + 170;
            words.forEach(word => {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > cardWidth - 10) {
                    ctx.fillText(line, x + cardWidth / 2, lineY);
                    line = word + ' ';
                    lineY += 14;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line, x + cardWidth / 2, lineY);

            // Stats preview
            ctx.fillStyle = '#00FF00';
            ctx.font = '11px monospace';
            ctx.fillText(`ATK: ${typeData.bonuses.baseAttack || 10}`, x + cardWidth / 2, y + 220);
            ctx.fillText(`DEF: ${typeData.bonuses.baseDefense || 5}`, x + cardWidth / 2, y + 235);
        });

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText('Use LEFT/RIGHT to select, SPACE to confirm', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT - 50);
        ctx.fillText('Press ESC to go back', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT - 25);
    },

    renderGame: function() {
        const ctx = this.ctx;

        World.draw(ctx);
        Puzzles.draw(ctx);
        Enemies.draw(ctx);
        Player.draw(ctx);
        Fairy.draw(ctx);
        Bosses.draw(ctx);
        Combat.draw(ctx);

        this.renderUI();

        // Draw low health warning effect when on last heart
        const isLowHealth = Player.hearts <= 1 && Player.hp < Player.heartHp * 0.5;
        LowHealthWarning.draw(ctx, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT, isLowHealth);

        // Draw in-game book display (tutorial/lore books)
        Puzzles.drawBookDisplay(ctx);

        if (this.state === 'dialogue') {
            Dialogue.draw(ctx);
        }

        if (this.state === 'boss_intro') {
            this.renderBossIntro();
        }

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

        // Arcsis type indicator
        if (CONSTANTS.ARCSIS_TYPES && Player.arcsisType) {
            const typeColor = CONSTANTS.ARCSIS_TYPES[Player.arcsisType].color;
            ctx.fillStyle = typeColor;
            ctx.fillRect(220, 10, 60, 20);
            ctx.fillStyle = '#000000';
            ctx.font = '10px monospace';
            ctx.fillText(Player.arcsisType, 225, 23);
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
        ctx.font = '12px monospace';
        ctx.fillText(`LV ${Player.level} - ${Player.exp}/${Player.expToNext}`, 15, expY + 14);

        // Coins
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`COINS: ${Utils.formatNumber(Player.coins)}`, 10, expY + 36);

        // Keys
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`KEYS: ${Player.keys} | SECRET: ${Player.secretKeys}`, 10, expY + 52);

        // Potions
        ctx.fillStyle = '#FF6666';
        ctx.fillText(`HP:${Player.potions.health} MP:${Player.potions.mana} MEGA:${Player.potions.mega}`, 10, expY + 68);

        // Skill points
        if (Player.skillPoints > 0) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillText(`SKILL POINTS: ${Player.skillPoints}`, 10, expY + 84);
        }

        // Max combo display
        if (Player.maxCombo > 1) {
            ctx.fillStyle = '#FF00FF';
            ctx.fillText(`MAX COMBO: ${Player.maxCombo}x`, 10, expY + 100);
        }

        // Equipment info with rarity (top right)
        ctx.textAlign = 'right';
        const swordRarityColor = CONSTANTS.RARITY[Player.equipment.swordRarity].color;
        const shieldRarityColor = CONSTANTS.RARITY[Player.equipment.shieldRarity].color;

        ctx.fillStyle = swordRarityColor;
        ctx.fillText(`${Player.equipment.swordName}`, CONSTANTS.CANVAS_WIDTH - 10, 26);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`SWORD LV: ${Player.equipment.swordLevel}`, CONSTANTS.CANVAS_WIDTH - 10, 42);

        ctx.fillStyle = shieldRarityColor;
        ctx.fillText(`${Player.equipment.shieldName}`, CONSTANTS.CANVAS_WIDTH - 10, 62);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`SHIELD LV: ${Player.equipment.shieldLevel}`, CONSTANTS.CANVAS_WIDTH - 10, 78);

        // Anizon defeat counter
        if (Player.anizonDefeats > 0) {
            ctx.fillStyle = '#FF0000';
            ctx.fillText(`ANIZON DEFEATS: ${Player.anizonDefeats}`, CONSTANTS.CANVAS_WIDTH - 10, 98);
        }

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

        // Controls reminder
        ctx.textAlign = 'left';
        ctx.fillStyle = '#666666';
        ctx.fillText('B:Shop K:Skills 1:HP 2:MP 3:Mega', 10, CONSTANTS.CANVAS_HEIGHT - 10);

        // Enemy count
        const enemyCount = Enemies.getCount();
        if (enemyCount > 0) {
            ctx.fillStyle = '#FF6666';
            ctx.fillText(`Enemies: ${enemyCount}`, 10, CONSTANTS.CANVAS_HEIGHT - 26);
        }
    },

    // Helper function to draw heart shape
    drawHeart: function(ctx, x, y, size, filled) {
        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);

        ctx.beginPath();
        // Start at bottom point of heart
        ctx.moveTo(0, size * 0.35);
        // Left side curve (bottom to top-left bump)
        ctx.bezierCurveTo(-size * 0.1, size * 0.2, -size * 0.5, size * 0.05, -size * 0.5, -size * 0.15);
        // Top-left bump
        ctx.bezierCurveTo(-size * 0.5, -size * 0.4, -size * 0.25, -size * 0.45, 0, -size * 0.25);
        // Top-right bump
        ctx.bezierCurveTo(size * 0.25, -size * 0.45, size * 0.5, -size * 0.4, size * 0.5, -size * 0.15);
        // Right side curve (top-right bump to bottom)
        ctx.bezierCurveTo(size * 0.5, size * 0.05, size * 0.1, size * 0.2, 0, size * 0.35);
        ctx.closePath();

        if (filled) {
            ctx.fill();
        } else {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    },

    renderShop: function() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FFD700';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EQUIPMENT SHOP', CONSTANTS.CANVAS_WIDTH / 2, 60);

        ctx.fillStyle = '#FFD700';
        ctx.font = '20px monospace';
        ctx.fillText(`Your Coins: ${Utils.formatNumber(Player.coins)}`, CONSTANTS.CANVAS_WIDTH / 2, 100);

        ctx.font = '16px monospace';
        this.shopItems.forEach((item, i) => {
            const y = 150 + i * 35;
            const canAfford = Player.coins >= item.price;

            if (i === this.shopSelection) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillText('> ', CONSTANTS.CANVAS_WIDTH / 2 - 200, y);
            }

            ctx.fillStyle = canAfford ? '#FFFFFF' : '#666666';
            ctx.textAlign = 'left';
            ctx.fillText(item.name, CONSTANTS.CANVAS_WIDTH / 2 - 180, y);

            if (item.price > 0) {
                ctx.textAlign = 'right';
                ctx.fillStyle = canAfford ? '#FFD700' : '#666666';
                ctx.fillText(`${Utils.formatNumber(item.price)} coins`, CONSTANTS.CANVAS_WIDTH / 2 + 200, y);
            }
        });

        ctx.textAlign = 'center';
        ctx.fillStyle = '#888888';
        ctx.font = '14px monospace';
        ctx.fillText('SPACE to purchase, ESC to close', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT - 30);
    },

    renderSkills: function() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#00FF00';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SKILL TREE', CONSTANTS.CANVAS_WIDTH / 2, 60);

        ctx.fillStyle = '#FFFF00';
        ctx.font = '20px monospace';
        ctx.fillText(`Skill Points: ${Player.skillPoints}`, CONSTANTS.CANVAS_WIDTH / 2, 100);

        ctx.font = '14px monospace';
        this.skillOptions.forEach((skill, i) => {
            const y = 140 + i * 30;
            const isMaxed = skill.level >= skill.maxLevel;

            if (i === this.skillSelection) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillText('> ', CONSTANTS.CANVAS_WIDTH / 2 - 250, y);
            }

            ctx.fillStyle = isMaxed ? '#00FF00' : '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(skill.name, CONSTANTS.CANVAS_WIDTH / 2 - 230, y);

            if (skill.maxLevel > 0) {
                ctx.textAlign = 'right';
                ctx.fillStyle = isMaxed ? '#00FF00' : '#888888';

                // Level bar
                let levelBar = '[';
                for (let j = 0; j < skill.maxLevel; j++) {
                    levelBar += j < skill.level ? '=' : '-';
                }
                levelBar += `] ${skill.level}/${skill.maxLevel}`;

                ctx.fillText(levelBar, CONSTANTS.CANVAS_WIDTH / 2 + 250, y);
            }
        });

        ctx.textAlign = 'center';
        ctx.fillStyle = '#888888';
        ctx.font = '14px monospace';
        ctx.fillText('SPACE to upgrade, ESC to close', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT - 30);
    },

    renderPauseMenu: function() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CONSTANTS.CANVAS_WIDTH / 2, 180);

        ctx.font = '20px monospace';
        this.pauseOptions.forEach((option, i) => {
            if (i === this.pauseSelection) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillText('> ' + option + ' <', CONSTANTS.CANVAS_WIDTH / 2, 250 + i * 40);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(option, CONSTANTS.CANVAS_WIDTH / 2, 250 + i * 40);
            }
        });
    },

    renderInventory: function() {
        const ctx = this.ctx;

        const invWidth = 450;
        const invHeight = 400;
        const invX = (CONSTANTS.CANVAS_WIDTH - invWidth) / 2;
        const invY = (CONSTANTS.CANVAS_HEIGHT - invHeight) / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(invX, invY, invWidth, invHeight);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(invX, invY, invWidth, invHeight);

        ctx.fillStyle = '#FFD700';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAPTAIN ARCSIS - ' + Player.arcsisType, CONSTANTS.CANVAS_WIDTH / 2, invY + 35);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';

        const statX = invX + 30;
        let statY = invY + 70;

        ctx.fillText(`Level: ${Player.level}`, statX, statY); statY += 22;
        ctx.fillText(`HP: ${Math.floor(Player.hp)}/${Player.maxHp}`, statX, statY); statY += 22;
        ctx.fillText(`Attack: ${Player.attack}`, statX, statY); statY += 22;
        ctx.fillText(`Defense: ${Player.defense}`, statX, statY); statY += 22;
        ctx.fillText(`Crit Chance: ${Player.critChance}%`, statX, statY); statY += 22;
        ctx.fillText(`Dodge Chance: ${Player.dodgeChance}%`, statX, statY); statY += 22;
        ctx.fillText(`Coins: ${Utils.formatNumber(Player.coins)}`, statX, statY); statY += 22;
        ctx.fillText(`Keys: ${Player.keys} | Secret Keys: ${Player.secretKeys}`, statX, statY); statY += 30;

        ctx.fillStyle = '#FFD700';
        ctx.fillText('EQUIPMENT:', statX, statY); statY += 22;
        ctx.fillStyle = CONSTANTS.RARITY[Player.equipment.swordRarity].color;
        ctx.fillText(`${Player.equipment.swordName} (Lv.${Player.equipment.swordLevel})`, statX, statY); statY += 22;
        ctx.fillStyle = CONSTANTS.RARITY[Player.equipment.shieldRarity].color;
        ctx.fillText(`${Player.equipment.shieldName} (Lv.${Player.equipment.shieldLevel})`, statX, statY); statY += 30;

        ctx.fillStyle = '#FF69B4';
        ctx.fillText('LEARNED SPELLS:', statX, statY); statY += 22;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(Player.learnedSpells.join(', '), statX, statY); statY += 30;

        ctx.fillStyle = '#FF0000';
        ctx.fillText(`ANIZON DEFEATS: ${Player.anizonDefeats}`, statX, statY); statY += 22;
        if (Player.anizonFriends.length > 0) {
            ctx.fillStyle = '#9400D3';
            ctx.fillText(`Friends: ${Player.anizonFriends.join(', ')}`, statX, statY);
        }

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

            if (Bosses.currentBoss.type === 'anizon') {
                ctx.fillStyle = '#FFD700';
                ctx.font = '18px monospace';
                ctx.fillText(`HP: ${Utils.formatNumber(Bosses.currentBoss.maxHp)}`, CONSTANTS.CANVAS_WIDTH / 2, 320);
                ctx.fillText(`ATK: ${Bosses.currentBoss.attack} | DEF: ${Bosses.currentBoss.defense}`, CONSTANTS.CANVAS_WIDTH / 2, 345);
                ctx.fillStyle = '#FF0000';
                ctx.fillText('PREPARE FOR AN INCREDIBLE CHALLENGE!', CONSTANTS.CANVAS_WIDTH / 2, 380);
            }
        }

        ctx.fillStyle = '#FFFF00';
        ctx.font = '16px monospace';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to begin!', CONSTANTS.CANVAS_WIDTH / 2, 450);
        }
    },

    renderGameOver: function() {
        const ctx = this.ctx;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FF0000';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CONSTANTS.CANVAS_WIDTH / 2, 180);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px monospace';
        ctx.fillText(`Arcsis Type: ${Player.arcsisType}`, CONSTANTS.CANVAS_WIDTH / 2, 250);
        ctx.fillText(`Level: ${Player.level}`, CONSTANTS.CANVAS_WIDTH / 2, 280);
        ctx.fillText(`Coins: ${Utils.formatNumber(Player.coins)}`, CONSTANTS.CANVAS_WIDTH / 2, 310);
        ctx.fillText(`Anizon Defeats: ${Player.anizonDefeats}`, CONSTANTS.CANVAS_WIDTH / 2, 340);
        ctx.fillText(`Time: ${Utils.formatTime(this.playTime / 1000)}`, CONSTANTS.CANVAS_WIDTH / 2, 370);

        // Show death progression bonus
        if (Player.maxHearts < CONSTANTS.MAX_HEARTS) {
            ctx.fillStyle = '#00FF00';
            ctx.font = '24px monospace';
            const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
            ctx.save();
            ctx.translate(CONSTANTS.CANVAS_WIDTH / 2, 420);
            ctx.scale(pulseScale, pulseScale);
            ctx.fillText('DEATH BONUS: +1 MAX HEART!', 0, 0);
            ctx.restore();
            ctx.font = '16px monospace';
            ctx.fillText(`(${Player.maxHearts} -> ${Player.maxHearts + 1} / ${CONSTANTS.MAX_HEARTS})`, CONSTANTS.CANVAS_WIDTH / 2, 450);
        } else {
            ctx.fillStyle = '#888888';
            ctx.font = '16px monospace';
            ctx.fillText(`Max Hearts: ${Player.maxHearts}/${CONSTANTS.MAX_HEARTS} (MAXED!)`, CONSTANTS.CANVAS_WIDTH / 2, 420);
        }

        ctx.fillStyle = '#FFFF00';
        ctx.font = '16px monospace';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to claim bonus & return to menu', CONSTANTS.CANVAS_WIDTH / 2, 500);
        }
    },

    renderVictory: function() {
        const ctx = this.ctx;

        const time = Date.now() * 0.001;
        const r = Math.floor(128 + Math.sin(time) * 64);
        const g = Math.floor(128 + Math.sin(time + 2) * 64);
        const b = Math.floor(128 + Math.sin(time + 4) * 64);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

        ctx.fillStyle = '#FFD700';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', CONSTANTS.CANVAS_WIDTH / 2, 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px monospace';
        ctx.fillText(`Captain Arcsis ${Player.arcsisType} saves the day!`, CONSTANTS.CANVAS_WIDTH / 2, 180);

        ctx.font = '16px monospace';
        ctx.fillText(`Final Level: ${Player.level}`, CONSTANTS.CANVAS_WIDTH / 2, 250);
        ctx.fillText(`Total Coins: ${Utils.formatNumber(Player.coins)}`, CONSTANTS.CANVAS_WIDTH / 2, 280);
        ctx.fillText(`Anizon Defeated: ${Player.anizonDefeats} times!`, CONSTANTS.CANVAS_WIDTH / 2, 310);
        ctx.fillText(`Sword: ${Player.equipment.swordName} (Lv.${Player.equipment.swordLevel})`, CONSTANTS.CANVAS_WIDTH / 2, 340);
        ctx.fillText(`Shield: ${Player.equipment.shieldName} (Lv.${Player.equipment.shieldLevel})`, CONSTANTS.CANVAS_WIDTH / 2, 370);
        ctx.fillText(`Friends Unlocked: ${Player.anizonFriends.join(', ') || 'None'}`, CONSTANTS.CANVAS_WIDTH / 2, 400);
        ctx.fillText(`Secret Keys: ${Player.secretKeys}`, CONSTANTS.CANVAS_WIDTH / 2, 430);
        ctx.fillText(`Time: ${Utils.formatTime(this.playTime / 1000)}`, CONSTANTS.CANVAS_WIDTH / 2, 460);

        ctx.fillStyle = '#FFD700';
        ctx.font = '14px monospace';
        ctx.fillText('Challenge continues! Defeat more Anizons!', CONSTANTS.CANVAS_WIDTH / 2, 510);

        ctx.fillStyle = '#FFFFFF';
        const blink = Math.floor(Date.now() / 500) % 2;
        if (blink) {
            ctx.fillText('Press SPACE to return to menu', CONSTANTS.CANVAS_WIDTH / 2, 560);
        }
    }
};

window.onload = function() {
    Game.init();
};
