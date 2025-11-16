// World System for Captain Arcsis
// Level generation and management

const World = {
    currentArea: 'forest',
    collisionMap: [],
    coins: [],
    decorations: [],
    transitions: [],

    areas: {
        // Starting area - Forest (before the button) - NOW WITH MONSTERS!
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
            // NOW WITH FOREST MONSTERS!
            enemies: [
                { type: 'forest_wolf', x: 550, y: 200 },
                { type: 'forest_wolf', x: 300, y: 400 },
                { type: 'corrupted_sprite', x: 650, y: 350 },
                { type: 'wild_boar', x: 200, y: 150 }
            ],
            // Tutorial book in forest
            puzzleElements: [
                {
                    type: 'book',
                    x: 180,
                    y: 350,
                    id: 'forest_guide',
                    title: 'A Traveler\'s Warning',
                    contents: 'BEWARE! This forest is no longer safe. Corrupted creatures roam these woods. I have left this note for any who follow. Use WASD to move carefully. That mysterious red button ahead... DO NOT PRESS IT! It is a trap set by the evil Anizon! If you must explore, prepare yourself for battle. May Lica, the Eternal Guardian, watch over you.'
                },
                {
                    type: 'pestle',
                    x: 250,
                    y: 320,
                    id: 'forest_pestle',
                    reward: 'health_potion'
                }
            ]
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
                { type: 'door', x: 750, y: 250, id: 'd1_exit', requiresKey: true },
                // IN-GAME BOOKS - Tutorial information!
                {
                    type: 'book',
                    x: 150,
                    y: 100,
                    id: 'combat_guide',
                    title: 'The Warrior\'s Combat Manual',
                    contents: 'Welcome, brave adventurer! To survive in these dark dungeons, you must master combat. Press SPACE or click to swing your sword. Hold SHIFT and press SPACE for a devastating SPIN ATTACK that pulls enemies toward you! Press Q to perform a quick DASH with invincibility frames. When your hearts are full, press R for your SPECIAL ABILITY - a powerful nova attack! Remember: even the weakest enemies here are dangerous. Fight wisely!'
                },
                {
                    type: 'book',
                    x: 550,
                    y: 380,
                    id: 'puzzle_guide',
                    title: 'Ancient Puzzle Lore',
                    contents: 'These dungeons are filled with ancient mechanisms. Press E to interact with objects around you. Levers toggle doors open and closed. Switches activate once and stay on. Keys are found throughout - collect them to unlock barred doors. Pressure plates activate when stepped upon. Look for glowing books like this one to learn more secrets. The way forward always requires careful observation!'
                }
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
            nextArea: 'void_dimension_1'
        },

        // NEW WORLD: VOID DIMENSION
        void_dimension_1: {
            name: 'Void Dimension - Rift Entrance',
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
                            row.push('void_wall');
                            collRow.push(1);
                        } else {
                            row.push('void_floor');
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
                { type: 'void_spawn', x: 300, y: 200 },
                { type: 'void_spawn', x: 500, y: 400 },
                { type: 'dimensional_wraith', x: 600, y: 150 },
                { type: 'reality_tear', x: 400, y: 350 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 200,
                    y: 150,
                    id: 'void_lore',
                    title: 'Whispers from the Void',
                    contents: 'This dimension exists between realities. The Void Weaver rules here, pulling apart the threads of existence. Beware: portals may appear randomly, warping you to unknown locations. The deeper you go, the more unstable reality becomes.'
                },
                { type: 'chest', x: 700, y: 100, id: 'void_chest1', contents: { type: 'coins', amount: 150 } }
            ],
            nextArea: 'void_dimension_core'
        },

        void_dimension_core: {
            name: 'Void Dimension - Core of Unmaking',
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
                            row.push('void_wall');
                            collRow.push(1);
                        } else {
                            row.push('void_floor');
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
            boss: 'void_weaver',
            nextArea: 'phoenix_sanctuary_1'
        },

        // NEW WORLD: PHOENIX SANCTUARY
        phoenix_sanctuary_1: {
            name: 'Phoenix Sanctuary - Burning Gates',
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
                            row.push('fire_wall');
                            collRow.push(1);
                        } else {
                            row.push('fire_floor');
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
                { type: 'fire_elemental', x: 350, y: 180 },
                { type: 'fire_elemental', x: 550, y: 380 },
                { type: 'ash_phoenix', x: 450, y: 250 },
                { type: 'ember_sprite', x: 250, y: 420 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 180,
                    y: 200,
                    id: 'phoenix_legend',
                    title: 'The Eternal Flame',
                    contents: 'The Phoenix Empress has burned for eons. She cannot truly die - each defeat only makes her stronger as she is reborn from the ashes. Legend says she has been defeated and reborn 1000 times. The key to victory? Overwhelming force before she can regenerate!'
                },
                { type: 'chest', x: 680, y: 120, id: 'phoenix_chest1', contents: { type: 'exp', amount: 800 } }
            ],
            nextArea: 'phoenix_sanctuary_throne'
        },

        phoenix_sanctuary_throne: {
            name: 'Phoenix Sanctuary - Throne of Rebirth',
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
                            row.push('fire_wall');
                            collRow.push(1);
                        } else {
                            row.push('fire_floor');
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
            boss: 'phoenix_empress',
            nextArea: 'frozen_wastes_1'
        },

        // NEW WORLD: FROZEN WASTES
        frozen_wastes_1: {
            name: 'Frozen Wastes - Glacier Entrance',
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
                            row.push('ice_wall');
                            collRow.push(1);
                        } else {
                            row.push('ice_floor');
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
                { type: 'frost_wraith', x: 320, y: 190 },
                { type: 'frost_wraith', x: 520, y: 390 },
                { type: 'ice_golem', x: 420, y: 280 },
                { type: 'blizzard_spirit', x: 600, y: 150 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 150,
                    y: 400,
                    id: 'frost_warning',
                    title: 'Survivor\'s Last Words',
                    contents: 'The cold... it seeps into your bones. The Frost Titan has ruled these wastes since the first winter. His ice armor is nearly impenetrable - only the hottest flames can melt it. I can feel my blood freezing... whoever reads this, turn back!'
                },
                { type: 'chest', x: 700, y: 450, id: 'frost_chest1', contents: { type: 'coins', amount: 200 } }
            ],
            nextArea: 'frozen_wastes_peak'
        },

        frozen_wastes_peak: {
            name: 'Frozen Wastes - Titan\'s Peak',
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
                            row.push('ice_wall');
                            collRow.push(1);
                        } else {
                            row.push('ice_floor');
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
            boss: 'frost_titan',
            nextArea: 'chaos_abyss_1'
        },

        // NEW WORLD: CHAOS ABYSS
        chaos_abyss_1: {
            name: 'Chaos Abyss - Serpent\'s Lair',
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
                            row.push('chaos_wall');
                            collRow.push(1);
                        } else {
                            row.push('chaos_floor');
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
                { type: 'chaos_spawn', x: 330, y: 210 },
                { type: 'chaos_spawn', x: 530, y: 370 },
                { type: 'madness_eye', x: 450, y: 160 },
                { type: 'venom_serpent', x: 280, y: 440 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 600,
                    y: 300,
                    id: 'chaos_madness',
                    title: 'Ravings of a Madman',
                    contents: 'Three heads... no wait, FIVE! It keeps GROWING! Cut one and two more appear! The venom... the madness... I can see colors that don\'t exist! The Chaos Serpent feeds on fear and confusion. Strategy is useless here - only OVERWHELMING DESTRUCTION can stop its regeneration!'
                },
                { type: 'chest', x: 100, y: 120, id: 'chaos_chest1', contents: { type: 'exp', amount: 1000 } }
            ],
            nextArea: 'chaos_abyss_heart'
        },

        chaos_abyss_heart: {
            name: 'Chaos Abyss - Heart of Madness',
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
                            row.push('chaos_wall');
                            collRow.push(1);
                        } else {
                            row.push('chaos_floor');
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
            boss: 'chaos_serpent',
            nextArea: 'temporal_nexus_1'
        },

        // NEW WORLD: TEMPORAL NEXUS
        temporal_nexus_1: {
            name: 'Temporal Nexus - Chrono Gateway',
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
                            row.push('time_wall');
                            collRow.push(1);
                        } else {
                            row.push('time_floor');
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
                { type: 'time_ghost', x: 340, y: 200 },
                { type: 'time_ghost', x: 540, y: 380 },
                { type: 'chrono_spider', x: 430, y: 270 },
                { type: 'paradox_entity', x: 600, y: 140 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 200,
                    y: 250,
                    id: 'temporal_paradox',
                    title: 'Notes from Tomorrow',
                    contents: 'If you\'re reading this, I\'ve already failed. The Time Warden controls all of time itself. He can rewind damage, freeze you in place, and even age you to dust instantly. The only weakness: his powers drain when he uses them too much. Force him to waste his temporal energy!'
                },
                { type: 'chest', x: 680, y: 100, id: 'time_chest1', contents: { type: 'coins', amount: 300 } }
            ],
            nextArea: 'temporal_nexus_core'
        },

        temporal_nexus_core: {
            name: 'Temporal Nexus - Infinity Chamber',
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
                            row.push('time_wall');
                            collRow.push(1);
                        } else {
                            row.push('time_floor');
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
            boss: 'time_warden',
            nextArea: 'secret_realm_entrance'
        },

        // SECRET REALM - Hidden content!
        secret_realm_entrance: {
            name: 'Secret Realm - The Hidden Path',
            width: 30,
            height: 22,
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];
                for (let y = 0; y < 22; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 30; x++) {
                        if (y === 0 || y === 21 || x === 0 || x === 29) {
                            row.push('secret_wall');
                            collRow.push(1);
                        } else {
                            row.push('secret_floor');
                            collRow.push(0);
                        }
                    }
                    map.push(row);
                    collisions.push(collRow);
                }
                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 350 },
            enemies: [
                { type: 'ancient_guardian', x: 400, y: 300 },
                { type: 'ancient_guardian', x: 600, y: 400 },
                { type: 'mystery_specter', x: 500, y: 200 }
            ],
            puzzleElements: [
                {
                    type: 'book',
                    x: 250,
                    y: 180,
                    id: 'ultimate_secret',
                    title: 'The Ultimate Power',
                    contents: 'You have found the Secret Realm! Here lie the most powerful abilities in existence. The Storm Oracle guards the way forward. Beyond lies treasures of unimaginable power - legendary weapons, ancient spells, and the key to unlocking your TRUE POTENTIAL! But beware: once you gain this power, you may never be the same...'
                },
                { type: 'chest', x: 800, y: 150, id: 'secret_chest1', contents: { type: 'exp', amount: 5000 } },
                { type: 'chest', x: 850, y: 500, id: 'secret_chest2', contents: { type: 'coins', amount: 1000 } },
                { type: 'chest', x: 150, y: 600, id: 'secret_chest3', contents: { type: 'mega_potion', amount: 3 } }
            ],
            nextArea: 'secret_realm_throne'
        },

        secret_realm_throne: {
            name: 'Secret Realm - Oracle\'s Domain',
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
                            row.push('secret_wall');
                            collRow.push(1);
                        } else {
                            row.push('secret_floor');
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
            boss: 'storm_oracle',
            isFinalBoss: true
        },

        // MOM'S PRISON - Special story area!
        mom_prison: {
            name: 'Anizon\'s Prison - The Cage of Despair',
            width: 50, // MUCH BIGGER!
            height: 36, // GINORMOUS MAZE
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                // Create massive dungeon floor
                for (let y = 0; y < 36; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 50; x++) {
                        if (y === 0 || y === 35 || x === 0 || x === 49) {
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

                // Create MASSIVE MAZE structure
                const mazeWalls = [
                    // Outer maze ring
                    [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12],
                    [5, 18], [5, 19], [5, 20], [5, 21], [5, 22], [5, 23], [5, 24],
                    [10, 5], [11, 5], [12, 5], [13, 5], [14, 5],
                    [20, 5], [21, 5], [22, 5], [23, 5], [24, 5], [25, 5],
                    [30, 5], [31, 5], [32, 5], [33, 5], [34, 5],
                    [40, 5], [41, 5], [42, 5], [43, 5], [44, 5],
                    // Inner corridors
                    [10, 10], [10, 11], [10, 12], [10, 13], [10, 14], [10, 15],
                    [15, 8], [15, 9], [15, 10], [15, 11], [15, 12],
                    [20, 10], [20, 11], [20, 12], [20, 13], [20, 14], [20, 15], [20, 16],
                    [25, 12], [25, 13], [25, 14], [25, 15], [25, 16], [25, 17], [25, 18],
                    [30, 10], [30, 11], [30, 12], [30, 13], [30, 14],
                    [35, 8], [35, 9], [35, 10], [35, 11], [35, 12], [35, 13],
                    [40, 12], [40, 13], [40, 14], [40, 15], [40, 16],
                    // Horizontal barriers
                    [12, 20], [13, 20], [14, 20], [15, 20], [16, 20], [17, 20],
                    [22, 22], [23, 22], [24, 22], [25, 22], [26, 22], [27, 22],
                    [32, 18], [33, 18], [34, 18], [35, 18], [36, 18], [37, 18],
                    // Dead ends and traps
                    [8, 28], [8, 29], [8, 30], [9, 30], [10, 30],
                    [18, 26], [18, 27], [18, 28], [19, 28], [20, 28],
                    [28, 25], [28, 26], [28, 27], [29, 27], [30, 27],
                    [38, 28], [38, 29], [38, 30], [39, 30], [40, 30],
                    // Central prison area walls
                    [22, 14], [23, 14], [24, 14], [26, 14], [27, 14], [28, 14],
                    [22, 15], [28, 15],
                    [22, 16], [28, 16],
                    [22, 17], [23, 17], [24, 17], [26, 17], [27, 17], [28, 17]
                ];

                mazeWalls.forEach(([wx, wy]) => {
                    if (wx > 0 && wx < 49 && wy > 0 && wy < 35) {
                        map[wy][wx] = 'wall';
                        collisions[wy][wx] = 1;
                    }
                });

                return { map, collisions };
            },
            spawnPlayer: { x: 64, y: 100 },
            enemies: [
                { type: 'skeleton_knight', x: 300, y: 200 },
                { type: 'skeleton_knight', x: 600, y: 350 },
                { type: 'armored_golem', x: 450, y: 500 },
                { type: 'ghost_warrior', x: 900, y: 400 },
                { type: 'ghost_warrior', x: 1200, y: 300 },
                { type: 'zombie', x: 800, y: 600 },
                { type: 'zombie', x: 1000, y: 700 }
            ],
            puzzleElements: [
                { type: 'prison_cell', x: 800, y: 480, id: 'mom_cell', hasMom: true },
                { type: 'chest', x: 1400, y: 200, id: 'prison_chest1', contents: { type: 'exp', amount: 500 } },
                { type: 'chest', x: 200, y: 900, id: 'prison_chest2', contents: { type: 'coins', amount: 200 } },
                { type: 'key', x: 1100, y: 800, id: 'prison_key' },
                { type: 'lever', x: 400, y: 700, id: 'prison_lever', linkedTo: 'prison_gate' },
                { type: 'door', x: 750, y: 400, id: 'prison_gate' }
            ],
            nextArea: 'dungeon_boss',
            hasMomPrison: true
        },

        // UNDERGROUND LABYRINTH - Massive maze system!
        underground_labyrinth_1: {
            name: 'Underground Labyrinth - Entrance',
            width: 60, // EVEN BIGGER!
            height: 45, // GINORMOUS!
            music: 'dungeon',
            generate: function() {
                const map = [];
                const collisions = [];

                // Create massive labyrinth
                for (let y = 0; y < 45; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 60; x++) {
                        if (y === 0 || y === 44 || x === 0 || x === 59) {
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

                // Generate PROCEDURAL MAZE using recursive backtracking
                const visited = {};
                const stack = [[2, 2]];
                visited['2,2'] = true;

                // Create grid of walls first
                for (let y = 1; y < 44; y += 2) {
                    for (let x = 1; x < 59; x += 2) {
                        map[y][x] = 'floor';
                        collisions[y][x] = 0;
                        if (y + 1 < 44) {
                            map[y + 1][x] = 'wall';
                            collisions[y + 1][x] = 1;
                        }
                        if (x + 1 < 59) {
                            map[y][x + 1] = 'wall';
                            collisions[y][x + 1] = 1;
                        }
                    }
                }

                // Carve passages
                while (stack.length > 0) {
                    const [cx, cy] = stack[stack.length - 1];
                    const neighbors = [];

                    const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];
                    for (let [dx, dy] of dirs) {
                        const nx = cx + dx;
                        const ny = cy + dy;
                        if (nx > 0 && nx < 59 && ny > 0 && ny < 44 && !visited[`${nx},${ny}`]) {
                            neighbors.push([nx, ny, dx / 2, dy / 2]);
                        }
                    }

                    if (neighbors.length > 0) {
                        const [nx, ny, wx, wy] = neighbors[Math.floor(Math.random() * neighbors.length)];
                        map[cy + wy][cx + wx] = 'floor';
                        collisions[cy + wy][cx + wx] = 0;
                        visited[`${nx},${ny}`] = true;
                        stack.push([nx, ny]);
                    } else {
                        stack.pop();
                    }
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 100, y: 100 },
            enemies: [
                { type: 'shadow_assassin', x: 500, y: 400 },
                { type: 'shadow_assassin', x: 800, y: 600 },
                { type: 'void_wraith', x: 1200, y: 300 },
                { type: 'nightmare_beast', x: 1500, y: 900 },
                { type: 'ghost_warrior', x: 400, y: 1000 },
                { type: 'armored_golem', x: 1000, y: 1100 }
            ],
            puzzleElements: [
                { type: 'chest', x: 1800, y: 200, id: 'lab1_chest1', contents: { type: 'coins', amount: 300 } },
                { type: 'chest', x: 300, y: 1200, id: 'lab1_chest2', contents: { type: 'health', amount: 200 } },
                { type: 'key', x: 1600, y: 1000, id: 'lab1_key' },
                { type: 'door', x: 1850, y: 1350, id: 'lab1_exit', requiresKey: true }
            ],
            nextArea: 'underground_labyrinth_2'
        },

        // DEEP UNDERGROUND - Multiple levels!
        underground_labyrinth_2: {
            name: 'Underground Labyrinth - Deep Caverns',
            width: 70, // MASSIVE!
            height: 50, // INCREDIBLY LARGE!
            music: 'shadow',
            generate: function() {
                const map = [];
                const collisions = [];

                for (let y = 0; y < 50; y++) {
                    const row = [];
                    const collRow = [];
                    for (let x = 0; x < 70; x++) {
                        if (y === 0 || y === 49 || x === 0 || x === 69) {
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

                // Create complex maze with multiple paths
                for (let i = 0; i < 200; i++) {
                    const wx = Utils.random(5, 64);
                    const wy = Utils.random(5, 44);
                    const length = Utils.random(3, 12);
                    const horizontal = Math.random() > 0.5;

                    for (let j = 0; j < length; j++) {
                        const nx = horizontal ? wx + j : wx;
                        const ny = horizontal ? wy : wy + j;
                        if (nx >= 1 && nx < 69 && ny >= 1 && ny < 49) {
                            map[ny][nx] = 'shadow_wall';
                            collisions[ny][nx] = 1;
                        }
                    }
                }

                // Ensure path from start to exit
                for (let x = 2; x < 68; x++) {
                    map[25][x] = 'shadow_floor';
                    collisions[25][x] = 0;
                }

                return { map, collisions };
            },
            spawnPlayer: { x: 100, y: 800 },
            enemies: [
                { type: 'nightmare_beast', x: 600, y: 600 },
                { type: 'nightmare_beast', x: 1400, y: 800 },
                { type: 'void_wraith', x: 900, y: 400 },
                { type: 'void_wraith', x: 1800, y: 500 },
                { type: 'shadow_assassin', x: 400, y: 1200 },
                { type: 'shadow_assassin', x: 1600, y: 1000 },
                { type: 'sky_dragon', x: 1100, y: 700 }
            ],
            puzzleElements: [
                { type: 'switch', x: 500, y: 200, id: 'lab2_switch1', linkedTo: 'lab2_gate1' },
                { type: 'door', x: 1000, y: 300, id: 'lab2_gate1' },
                { type: 'lever', x: 1500, y: 400, id: 'lab2_lever', linkedTo: 'lab2_exit' },
                { type: 'door', x: 2100, y: 1450, id: 'lab2_exit' },
                { type: 'chest', x: 2000, y: 200, id: 'lab2_chest', contents: { type: 'exp', amount: 1500 } }
            ],
            boss: 'shadow_king',
            nextArea: 'sky_citadel_1'
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
                    case 'prison_cell':
                        puzzleElem = Puzzles.createPrisonCell(elem.x, elem.y, elem.id, elem.hasMom);
                        break;
                    case 'book':
                        puzzleElem = Puzzles.createBook(elem.x, elem.y, elem.id, elem.title, elem.contents);
                        break;
                    case 'pestle':
                        puzzleElem = Puzzles.createPestle(elem.x, elem.y, elem.id, elem.reward);
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
