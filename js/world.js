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
            nextArea: 'crystal_caverns_1'
        },

        // CRYSTAL CAVERNS - New World!
        crystal_caverns_1: {
            name: 'Crystal Caverns - Entrance',
            width: 25,
            height: 18,
            music: 'crystal',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('crystal_wall');
                            collRow.push(1);
                        } else {
                            row.push('crystal_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Crystal formations
                const crystals = [
                    [6, 4], [6, 5], [12, 6], [12, 7], [12, 8],
                    [18, 3], [18, 4], [18, 5], [8, 12], [8, 13]
                ];
                crystals.forEach(([cx, cy]) => {
                    map[cy][cx] = 'crystal_wall';
                    collisions[cy][cx] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'crystal_spider', x: 250, y: 150 },
                { type: 'crystal_spider', x: 450, y: 350 },
                { type: 'crystal_elemental', x: 600, y: 200 }
            ],
            puzzleElements: [
                { type: 'chest', x: 700, y: 100, id: 'cc1_chest', contents: { type: 'coins', amount: 100 } },
                { type: 'key', x: 350, y: 450, id: 'cc1_key' },
                { type: 'door', x: 750, y: 280, id: 'cc1_exit', requiresKey: true }
            ],
            nextArea: 'crystal_caverns_2'
        },

        crystal_caverns_2: {
            name: 'Crystal Caverns - Deep',
            width: 25,
            height: 18,
            music: 'crystal',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('crystal_wall');
                            collRow.push(1);
                        } else {
                            row.push('crystal_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'crystal_elemental', x: 300, y: 200 },
                { type: 'crystal_elemental', x: 500, y: 350 },
                { type: 'gem_golem', x: 400, y: 280 }
            ],
            puzzleElements: [
                { type: 'chest', x: 150, y: 100, id: 'cc2_chest', contents: { type: 'health', amount: 100 } }
            ],
            boss: 'crystal_guardian',
            nextArea: 'shadow_realm_1'
        },

        // SHADOW REALM - Dark and dangerous!
        shadow_realm_1: {
            name: 'Shadow Realm - Gateway',
            width: 25,
            height: 18,
            music: 'shadow',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('shadow_wall');
                            collRow.push(1);
                        } else {
                            row.push('shadow_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Shadow pillars
                const pillars = [
                    [5, 5], [10, 5], [15, 5], [20, 5],
                    [5, 12], [10, 12], [15, 12], [20, 12]
                ];
                pillars.forEach(([px, py]) => {
                    map[py][px] = 'shadow_wall';
                    collisions[py][px] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'shadow_assassin', x: 300, y: 180 },
                { type: 'shadow_assassin', x: 500, y: 400 },
                { type: 'void_wraith', x: 650, y: 250 }
            ],
            puzzleElements: [
                { type: 'switch', x: 200, y: 450, id: 'sr1_switch', linkedTo: 'sr1_door' },
                { type: 'door', x: 750, y: 280, id: 'sr1_exit' },
                { type: 'door', x: 600, y: 100, id: 'sr1_door' },
                { type: 'chest', x: 700, y: 100, id: 'sr1_chest', contents: { type: 'exp', amount: 500 } }
            ],
            nextArea: 'shadow_realm_2'
        },

        shadow_realm_2: {
            name: 'Shadow Realm - Abyss',
            width: 25,
            height: 18,
            music: 'shadow',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('shadow_wall');
                            collRow.push(1);
                        } else {
                            row.push('shadow_floor');
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
                { type: 'void_wraith', x: 200, y: 200 },
                { type: 'void_wraith', x: 600, y: 200 },
                { type: 'nightmare_beast', x: 400, y: 280 }
            ],
            puzzleElements: [
                { type: 'chest', x: 100, y: 100, id: 'sr2_chest', contents: { type: 'coins', amount: 200 } }
            ],
            boss: 'shadow_king',
            nextArea: 'sky_citadel_1'
        },

        // SKY CITADEL - The final challenges!
        sky_citadel_1: {
            name: 'Sky Citadel - Lower Halls',
            width: 25,
            height: 18,
            music: 'sky',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('sky_wall');
                            collRow.push(1);
                        } else {
                            row.push('sky_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                // Columns
                const columns = [
                    [4, 4], [4, 13], [12, 4], [12, 13], [20, 4], [20, 13]
                ];
                columns.forEach(([cx, cy]) => {
                    map[cy][cx] = 'sky_wall';
                    collisions[cy][cx] = 1;
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'wind_elemental', x: 250, y: 150 },
                { type: 'wind_elemental', x: 450, y: 400 },
                { type: 'thunder_knight', x: 600, y: 280 }
            ],
            puzzleElements: [
                { type: 'lever', x: 350, y: 100, id: 'sc1_lever', linkedTo: 'sc1_exit' },
                { type: 'door', x: 750, y: 280, id: 'sc1_exit' },
                { type: 'chest', x: 700, y: 450, id: 'sc1_chest', contents: { type: 'health', amount: 150 } }
            ],
            nextArea: 'sky_citadel_2'
        },

        sky_citadel_2: {
            name: 'Sky Citadel - Upper Halls',
            width: 25,
            height: 18,
            music: 'sky',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 18; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 25; x++) {
                        if (y === 0 || y === 17 || x === 0 || x === 24) {
                            row.push('sky_wall');
                            collRow.push(1);
                        } else {
                            row.push('sky_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 300 },
            enemies: [
                { type: 'thunder_knight', x: 300, y: 200 },
                { type: 'thunder_knight', x: 550, y: 350 },
                { type: 'sky_dragon', x: 400, y: 280 }
            ],
            puzzleElements: [
                { type: 'chest', x: 150, y: 450, id: 'sc2_chest', contents: { type: 'exp', amount: 1000 } }
            ],
            nextArea: 'sky_citadel_throne'
        },

        sky_citadel_throne: {
            name: 'Sky Citadel - Throne of Eternity',
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
                            row.push('sky_wall');
                            collRow.push(1);
                        } else {
                            row.push('sky_floor');
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
            boss: 'eternal_emperor',
            isFinalBoss: true
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
        } else if (area.music === 'crystal') {
            Audio.startCrystalMusic();
        } else if (area.music === 'shadow') {
            Audio.startShadowMusic();
        } else if (area.music === 'sky') {
            Audio.startSkyMusic();
        } else if (area.music === 'boss') {
            Audio.startBossMusic();
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
                    case 'crystal_wall':
                        this.drawCrystalWall(ctx, drawX, drawY);
                        break;
                    case 'crystal_floor':
                        this.drawCrystalFloor(ctx, drawX, drawY);
                        break;
                    case 'shadow_wall':
                        this.drawShadowWall(ctx, drawX, drawY);
                        break;
                    case 'shadow_floor':
                        this.drawShadowFloor(ctx, drawX, drawY);
                        break;
                    case 'sky_wall':
                        this.drawSkyWall(ctx, drawX, drawY);
                        break;
                    case 'sky_floor':
                        this.drawSkyFloor(ctx, drawX, drawY);
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

    // NEW TILE DRAWING FUNCTIONS
    drawCrystalWall: function(ctx, x, y) {
        ctx.fillStyle = '#66CCFF';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#88EEFF';
        ctx.fillRect(x + 4, y + 4, 12, 12);
        ctx.fillRect(x + 16, y + 16, 12, 12);
        ctx.strokeStyle = '#AAFFFF';
        ctx.strokeRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
    },

    drawCrystalFloor: function(ctx, x, y) {
        ctx.fillStyle = '#224466';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#336688';
        ctx.fillRect(x + 8, y + 8, 16, 16);
        // Sparkle effect
        if (Math.random() > 0.98) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + Utils.random(0, 28), y + Utils.random(0, 28), 2, 2);
        }
    },

    drawShadowWall: function(ctx, x, y) {
        ctx.fillStyle = '#110011';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#220022';
        ctx.fillRect(x + 2, y + 2, 28, 28);
        ctx.strokeStyle = '#440044';
        ctx.strokeRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
    },

    drawShadowFloor: function(ctx, x, y) {
        ctx.fillStyle = '#0A000A';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#1A001A';
        ctx.fillRect(x + 12, y + 12, 8, 8);
        // Dark mist effect
        if (Math.random() > 0.99) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#660066';
            ctx.fillRect(x + Utils.random(0, 24), y + Utils.random(0, 24), 8, 8);
            ctx.globalAlpha = 1;
        }
    },

    drawSkyWall: function(ctx, x, y) {
        ctx.fillStyle = '#AACCFF';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#BBDDFF';
        ctx.fillRect(x + 4, y + 8, 24, 16);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
    },

    drawSkyFloor: function(ctx, x, y) {
        ctx.fillStyle = '#88AADD';
        ctx.fillRect(x, y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
        ctx.fillStyle = '#99BBEE';
        ctx.fillRect(x + 6, y + 6, 20, 20);
        // Cloud wisps
        if (Math.random() > 0.97) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + Utils.random(0, 20), y + Utils.random(0, 20), 12, 4);
            ctx.globalAlpha = 1;
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
