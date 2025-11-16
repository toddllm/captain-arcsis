// World System for Captain Arcsis
// Level generation and management

const World = {
    currentArea: 'forest',
    collisionMap: [],
    coins: [],
    decorations: [],
    transitions: [],

    areas: {
        // Starting area - Forest (before the button)
        forest: {
            name: 'Enchanted Forest',
            width: 25,
            height: 18,
            music: 'forest',
            generate: function() {
                const map = [];
                const collisions = [];

                // Create forest floor
                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        // Edges are trees
                        if (y < 2 || y > 15 || x < 2 || x > 22) {
                            row.push('tree');
                            collRow.push(1);
                        } else {
                            row.push('grass');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Add some trees in the middle
                const treePositions = [
                    [5, 5], [8, 7], [15, 4], [18, 8], [10, 12], [20, 10]
                ];
                treePositions.forEach(([tx, ty]) => {
                    map[ty][tx] = 'tree';
                    collisions[ty][tx] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 100, y: 300 },
            button: { x: 400, y: 280 },
            enemies: []
        },

        // Dungeon levels
        dungeon_1: {
            name: 'Dark Dungeon - Level 1',
            width: 25,
            height: 18,
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        // Walls around edges
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('wall');
                            collRow.push(1);
                        } else {
                            row.push('floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Add internal walls for maze-like structure
                const walls = [
                    [5, 3], [5, 4], [5, 5], [5, 6],
                    [10, 8], [10, 9], [10, 10], [10, 11], [10, 12],
                    [15, 2], [15, 3], [15, 4],
                    [15, 13], [15, 14], [15, 15],
                    [20, 6], [20, 7], [20, 8], [20, 9]
                ];

                walls.forEach(([wx, wy]) => {
                    map[wy][wx] = 'wall';
                    collisions[wy][wx] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'zombie', x: 200, y: 200 },
                { type: 'zombie', x: 350, y: 400 },
                { type: 'dark_slime', x: 500, y: 150 },
                { type: 'dungeon_bat', x: 600, y: 300 }
            ],
            puzzleElements: [
                { type: 'chest', x: 700, y: 100, id: 'd1_chest1', contents: { type: 'coins', amount: 30 } },
                { type: 'key', x: 400, y: 450, id: 'd1_key1' },
                { type: 'door', x: 750, y: 250, id: 'd1_exit', requiresKey: true }
            ],
            fairySpawn: { x: 150, y: 200 },
            nextArea: 'dungeon_2'
        },

        dungeon_2: {
            name: 'Dark Dungeon - Level 2',
            width: 25,
            height: 18,
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('wall');
                            collRow.push(1);
                        } else {
                            row.push('floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // More complex walls
                const walls = [
                    [4, 4], [4, 5], [4, 6], [5, 6], [6, 6],
                    [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8],
                    [12, 10], [12, 11], [12, 12], [12, 13], [12, 14],
                    [18, 5], [19, 5], [20, 5], [20, 6], [20, 7], [20, 8],
                    [6, 12], [7, 12], [8, 12], [9, 12]
                ];

                walls.forEach(([wx, wy]) => {
                    map[wy][wx] = 'wall';
                    collisions[wy][wx] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'skeleton_knight', x: 300, y: 200 },
                { type: 'zombie', x: 450, y: 350 },
                { type: 'zombie', x: 550, y: 150 },
                { type: 'ghost_warrior', x: 650, y: 400 }
            ],
            puzzleElements: [
                { type: 'switch', x: 100, y: 450, id: 'd2_switch1', linkedTo: 'd2_door1' },
                { type: 'door', x: 400, y: 100, id: 'd2_door1' },
                { type: 'chest', x: 700, y: 450, id: 'd2_chest1', contents: { type: 'health', amount: 50 } },
                { type: 'lever', x: 680, y: 200, id: 'd2_lever1', linkedTo: 'd2_exit' },
                { type: 'door', x: 750, y: 280, id: 'd2_exit' }
            ],
            nextArea: 'dungeon_3'
        },

        dungeon_3: {
            name: 'Dark Dungeon - Level 3',
            width: 25,
            height: 18,
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('wall');
                            collRow.push(1);
                        } else {
                            row.push('floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 400, y: 450 },
            enemies: [
                { type: 'skeleton_knight', x: 200, y: 200 },
                { type: 'skeleton_knight', x: 600, y: 200 },
                { type: 'armored_golem', x: 400, y: 300 }
            ],
            puzzleElements: [
                { type: 'chest', x: 100, y: 100, id: 'd3_chest1', contents: { type: 'exp', amount: 200 } }
            ],
            boss: 'origami_mirda',
            nextArea: 'dungeon_boss'
        },

        dungeon_boss: {
            name: 'Throne of Destruction',
            width: 25,
            height: 18,
            music: 'boss',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('wall');
                            collRow.push(1);
                        } else {
                            row.push('floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 400, y: 500 },
            enemies: [],
            boss: 'anizon',
            isFinalBoss: false // Changed to false - Anizon is RECURRING!
        }
    },

    // Generate INFINITE procedural dungeon levels!
    generateDungeonLevel: function(levelNumber) {
        const areaName = `dungeon_${levelNumber}`;

        // Create procedural dungeon area
        const newArea = {
            name: `Dark Dungeon - Level ${levelNumber}`,
            width: 25,
            height: 18,
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                // Base floor/wall setup
                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('wall');
                            collRow.push(1);
                        } else {
                            row.push('floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Procedurally add walls based on level number
                const numWalls = 10 + levelNumber * 2;
                for (let i = 0; i < numWalls; i++) {
                    const wx = Utils.random(3, 21);
                    const wy = Utils.random(3, 14);
                    const length = Utils.random(2, 5);
                    const horizontal = Math.random() > 0.5;

                    for (let j = 0; j < length; j++) {
                        const nx = horizontal ? wx + j : wx;
                        const ny = horizontal ? wy : wy + j;
                        if (nx >= 1 && nx < 24 && ny >= 1 && ny < 17) {
                            map[ny][nx] = 'wall';
                            collisions[ny][nx] = 1;
                        }
                    }
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [],
            puzzleElements: [],
            boss: 'anizon', // ANIZON APPEARS EVERY LEVEL!
            nextArea: `dungeon_${levelNumber + 1}`
        };

        // Generate scaling enemies based on level
        const enemyTypes = ['zombie', 'dark_slime', 'dungeon_bat', 'skeleton_knight', 'ghost_warrior', 'armored_golem'];
        const numEnemies = Math.min(3 + Math.floor(levelNumber / 2), 10);

        for (let i = 0; i < numEnemies; i++) {
            const typeIndex = Math.min(Math.floor(levelNumber / 3) + Utils.random(0, 2), enemyTypes.length - 1);
            newArea.enemies.push({
                type: enemyTypes[typeIndex],
                x: Utils.random(100, 650),
                y: Utils.random(100, 450)
            });
        }

        // Add puzzle elements
        const numChests = Math.min(levelNumber, 5);
        for (let i = 0; i < numChests; i++) {
            newArea.puzzleElements.push({
                type: 'chest',
                x: Utils.random(100, 700),
                y: Utils.random(100, 450),
                id: `d${levelNumber}_chest${i}`,
                contents: { type: 'coins', amount: 20 + levelNumber * 10 }
            });
        }

        // Add secret doors for Anizon's keys
        if (levelNumber >= 2) {
            newArea.puzzleElements.push({
                type: 'door',
                x: Utils.random(100, 700),
                y: Utils.random(100, 450),
                id: `secret_door_${levelNumber}`,
                requiresKey: true
            });
        }

        this.areas[areaName] = newArea;
        return newArea;
    },

    loadArea: function(areaName) {
        const area = this.areas[areaName];
        if (!area) return false;

        this.currentArea = areaName;

        // Generate map
        const { map, collisions } = area.generate();
        this.map = map;
        this.collisionMap = collisions;

        // Clear entities
        Enemies.clear();
        Puzzles.clear();
        Bosses.clear();
        this.coins = [];

        // Spawn enemies
        if (area.enemies) {
            area.enemies.forEach(enemyData => {
                Enemies.spawn(enemyData.x, enemyData.y, enemyData.type);
            });
        }

        // Add puzzle elements
        if (area.puzzleElements) {
            area.puzzleElements.forEach(elem => {
                let puzzleElem;
                switch (elem.type) {
                    case 'switch':
                        puzzleElem = Puzzles.createSwitch(elem.x, elem.y, elem.id, elem.linkedTo);
                        break;
                    case 'door':
                        puzzleElem = Puzzles.createDoor(elem.x, elem.y, elem.id, elem.requiresKey);
                        break;
                    case 'key':
                        puzzleElem = Puzzles.createKey(elem.x, elem.y, elem.id);
                        break;
                    case 'chest':
                        puzzleElem = Puzzles.createChest(elem.x, elem.y, elem.id, elem.contents);
                        break;
                    case 'lever':
                        puzzleElem = Puzzles.createLever(elem.x, elem.y, elem.id, elem.linkedTo);
                        break;
                    case 'pressure_plate':
                        puzzleElem = Puzzles.createPressurePlate(elem.x, elem.y, elem.id, elem.linkedTo);
                        break;
                }
                if (puzzleElem) {
                    Puzzles.addElement(puzzleElem);
                }
            });
        }

        // Spawn boss if present
        if (area.boss) {
            Bosses.spawn(area.boss);
        }

        // Scatter some coins
        this.generateCoins(area);

        // Set player position
        Player.x = area.spawnPlayer.x;
        Player.y = area.spawnPlayer.y;

        // Play music
        Audio.stopMusic();
        if (area.music === 'forest') {
            Audio.startForestMusic();
        } else if (area.music === 'dungeon') {
            Audio.startDungeonMusic();
        }

        return area;
    },

    generateCoins: function(area) {
        // Scatter coins around the level
        const numCoins = Utils.random(5, 15);

        for (let i = 0; i < numCoins; i++) {
            let x, y, attempts = 0;

            do {
                x = Utils.random(64, 700);
                y = Utils.random(64, 500);
                attempts++;
            } while (this.isColliding(x, y) && attempts < 20);

            if (attempts < 20) {
                this.coins.push({
                    x: x,
                    y: y,
                    collected: false,
                    frame: Utils.random(0, 60)
                });
            }
        }
    },

    isColliding: function(x, y) {
        const tileX = Math.floor(x / CONSTANTS.TILE_SIZE);
        const tileY = Math.floor(y / CONSTANTS.TILE_SIZE);

        if (tileY >= 0 && tileY < this.collisionMap.length &&
            tileX >= 0 && tileX < this.collisionMap[0].length) {
            return this.collisionMap[tileY][tileX] === 1;
        }

        return true;
    },

    update: function(player) {
        // Update coin animations and check collection
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.frame++;

                // Check if player collects coin
                if (Utils.distance(
                    coin.x, coin.y,
                    player.x + player.width / 2, player.y + player.height / 2
                ) < 30) {
                    coin.collected = true;
                    player.addCoins(CONSTANTS.COIN_VALUE);
                }
            }
        });

        // Remove collected coins
        this.coins = this.coins.filter(c => !c.collected);

        // Check area transitions
        const area = this.areas[this.currentArea];
        if (area.nextArea && Enemies.getCount() === 0 && !Bosses.currentBoss) {
            // Check if player is at exit
            const exitDoor = Puzzles.elements.find(e => e.id && e.id.includes('exit') && e.open);
            if (exitDoor) {
                const dist = Utils.distance(
                    Player.x + Player.width / 2, Player.y + Player.height / 2,
                    exitDoor.x + exitDoor.width / 2, exitDoor.y + exitDoor.height / 2
                );

                if (dist < 50) {
                    return area.nextArea; // Signal area transition
                }
            }
        }

        return null;
    },

    draw: function(ctx) {
        // Draw tiles
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const tile = this.map[y][x];
                const drawX = x * CONSTANTS.TILE_SIZE;
                const drawY = y * CONSTANTS.TILE_SIZE;

                switch (tile) {
                    case 'grass':
                        Sprites.drawForestGround(ctx, drawX, drawY);
                        break;
                    case 'tree':
                        Sprites.drawTree(ctx, drawX, drawY);
                        break;
                    case 'wall':
                        Sprites.drawDungeonWall(ctx, drawX, drawY);
                        break;
                    case 'floor':
                        Sprites.drawDungeonFloor(ctx, drawX, drawY);
                        break;
                }
            }
        }

        // Draw coins
        this.coins.forEach(coin => {
            if (!coin.collected) {
                Sprites.drawCoin(ctx, coin.x, coin.y, coin.frame);
            }
        });

        // Draw mysterious button (forest only)
        if (this.currentArea === 'forest') {
            const area = this.areas.forest;
            Sprites.drawButton(ctx, area.button.x, area.button.y, Player.getFlag('button_pressed'));
        }
    },

    getAreaName: function() {
        const area = this.areas[this.currentArea];
        return area ? area.name : 'Unknown';
    },

    checkButtonPress: function(player) {
        if (this.currentArea !== 'forest') return false;

        const area = this.areas.forest;
        const dist = Utils.distance(
            player.x + player.width / 2, player.y + player.height / 2,
            area.button.x, area.button.y
        );

        if (dist < 40 && Input.wasJustPressed('KeyE') && !player.getFlag('button_pressed')) {
            return true;
        }

        return false;
    }
};
