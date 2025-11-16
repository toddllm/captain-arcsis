// Puzzle System for Captain Arcsis
// Environmental puzzles with switches, keys, and doors

const Puzzles = {
    elements: [],
    solved: {},

    // Puzzle element types
    createSwitch: function(x, y, id, linkedTo) {
        return {
            type: 'switch',
            x: x,
            y: y,
            width: 32,
            height: 32,
            id: id,
            linkedTo: linkedTo, // ID of door/element this controls
            activated: false
        };
    },

    createDoor: function(x, y, id, requiresKey = false) {
        return {
            type: 'door',
            x: x,
            y: y,
            width: 32,
            height: 48,
            id: id,
            requiresKey: requiresKey,
            open: false
        };
    },

    createPressurePlate: function(x, y, id, linkedTo) {
        return {
            type: 'pressure_plate',
            x: x,
            y: y,
            width: 32,
            height: 8,
            id: id,
            linkedTo: linkedTo,
            pressed: false
        };
    },

    createKey: function(x, y, id) {
        return {
            type: 'key',
            x: x,
            y: y,
            width: 24,
            height: 24,
            id: id,
            collected: false
        };
    },

    createChest: function(x, y, id, contents) {
        return {
            type: 'chest',
            x: x,
            y: y,
            width: 32,
            height: 32,
            id: id,
            contents: contents, // { type: 'coins', amount: 50 } or { type: 'health', amount: 30 }
            opened: false
        };
    },

    createLever: function(x, y, id, linkedTo) {
        return {
            type: 'lever',
            x: x,
            y: y,
            width: 16,
            height: 32,
            id: id,
            linkedTo: linkedTo,
            pulled: false
        };
    },

    createMovableBlock: function(x, y, id) {
        return {
            type: 'movable_block',
            x: x,
            y: y,
            width: 32,
            height: 32,
            id: id
        };
    },

    createPrisonCell: function(x, y, id, hasMom = false) {
        return {
            type: 'prison_cell',
            x: x,
            y: y,
            width: 64,
            height: 48,
            id: id,
            hasMom: hasMom,
            opened: false
        };
    },

    createBook: function(x, y, id, title, contents) {
        return {
            type: 'book',
            x: x,
            y: y,
            width: 24,
            height: 32,
            id: id,
            title: title,
            contents: contents,
            read: false
        };
    },

    createPestle: function(x, y, id, reward = 'health_potion') {
        return {
            type: 'pestle',
            x: x,
            y: y,
            width: 32,
            height: 32,
            id: id,
            reward: reward, // What the pestle gives when activated
            activated: false
        };
    },

    addElement: function(element) {
        this.elements.push(element);
    },

    update: function(player) {
        // Check pressure plates
        this.elements.forEach(element => {
            if (element.type === 'pressure_plate') {
                const wasPressed = element.pressed;
                element.pressed = Utils.collides(player.getHitbox(), element);

                if (element.pressed !== wasPressed) {
                    const linkedElement = this.getElementById(element.linkedTo);
                    if (linkedElement && linkedElement.type === 'door') {
                        linkedElement.open = element.pressed;
                        Audio.puzzleSolve();
                    }
                }
            }
        });

        // Check for interactions (but not if book display is active)
        if (Input.wasJustPressed('KeyE') && !this.bookDisplayActive) {
            this.checkInteractions(player);
        }
    },

    checkInteractions: function(player) {
        const interactRange = 50;
        const playerCenter = {
            x: player.x + player.width / 2,
            y: player.y + player.height / 2
        };

        this.elements.forEach(element => {
            const elementCenter = {
                x: element.x + element.width / 2,
                y: element.y + element.height / 2
            };

            const dist = Utils.distance(playerCenter.x, playerCenter.y, elementCenter.x, elementCenter.y);

            if (dist <= interactRange) {
                this.interact(element, player);
            }
        });
    },

    interact: function(element, player) {
        switch (element.type) {
            case 'switch':
                if (!element.activated) {
                    element.activated = true;
                    const linkedElement = this.getElementById(element.linkedTo);
                    if (linkedElement && linkedElement.type === 'door') {
                        linkedElement.open = true;
                    }
                    Audio.puzzleSolve();
                    this.solved[element.id] = true;
                }
                break;

            case 'lever':
                element.pulled = !element.pulled;
                const linkedElement = this.getElementById(element.linkedTo);
                if (linkedElement && linkedElement.type === 'door') {
                    linkedElement.open = element.pulled;
                    if (element.pulled) {
                        Audio.puzzleSolve();
                        this.solved[element.id] = true;
                        Fairy.speak("The lever opened the door! Great job!");
                    } else {
                        Audio.buttonPress();
                    }
                } else {
                    Audio.buttonPress();
                }
                break;

            case 'door':
                if (element.requiresKey && !element.open) {
                    if (player.useKey()) {
                        element.open = true;
                        Audio.puzzleSolve();
                        this.solved[element.id] = true;
                    } else {
                        Fairy.speak("You need a key to open this door!");
                    }
                }
                break;

            case 'key':
                if (!element.collected) {
                    element.collected = true;
                    player.addKey();
                    Audio.coinCollect();
                    Fairy.speak("Got a key! Use it to open locked doors!");
                }
                break;

            case 'chest':
                if (!element.opened) {
                    element.opened = true;
                    if (element.contents.type === 'coins') {
                        player.addCoins(element.contents.amount);
                        Fairy.speak(`Found ${element.contents.amount} coins!`);
                    } else if (element.contents.type === 'health') {
                        player.heal(element.contents.amount);
                        Fairy.speak(`Recovered ${element.contents.amount} HP!`);
                    } else if (element.contents.type === 'exp') {
                        player.addExp(element.contents.amount);
                        Fairy.speak(`Gained ${element.contents.amount} experience!`);
                    }
                    Audio.puzzleSolve();
                    this.solved[element.id] = true;
                }
                break;

            case 'prison_cell':
                if (!element.opened && element.hasMom) {
                    if (player.hasAnizonHeartKey) {
                        element.opened = true;
                        Audio.puzzleSolve();
                        this.solved[element.id] = true;
                        Dialogue.start('mom_rescue_success');
                        player.momRescued = true;
                    } else {
                        Dialogue.start('find_mom_prison');
                        player.foundMom = true;
                    }
                }
                break;

            case 'book':
                if (!element.read) {
                    element.read = true;
                    this.showBookContents(element);
                    Audio.dialogueBeep();
                    Fairy.speak(`"${element.title}" - Ancient knowledge revealed!`);
                }
                break;

            case 'pestle':
                if (!element.activated) {
                    element.activated = true;
                    // Grant reward based on type
                    if (element.reward === 'health_potion') {
                        player.potions.health++;
                        Fairy.speak("You ground herbs with the pestle! Got a Health Potion!");
                    } else if (element.reward === 'mana_potion') {
                        player.potions.mana++;
                        Fairy.speak("You ground mystic crystals! Got a Mana Potion!");
                    } else if (element.reward === 'mega_potion') {
                        player.potions.mega++;
                        Fairy.speak("Ancient alchemy! Got a Mega Potion!");
                    }
                    Audio.puzzleSolve();
                    this.solved[element.id] = true;
                }
                break;
        }
    },

    // IN-GAME BOOK SYSTEM - Replaces tutorial popups!
    showBookContents: function(book) {
        this.currentBook = book;
        this.bookDisplayActive = true;
        this.bookDisplayTimer = 0;
    },

    drawBookDisplay: function(ctx) {
        if (!this.bookDisplayActive || !this.currentBook) return;

        ctx.save();

        // Book background
        const bookWidth = 600;
        const bookHeight = 400;
        const bookX = (CONSTANTS.CANVAS_WIDTH - bookWidth) / 2;
        const bookY = (CONSTANTS.CANVAS_HEIGHT - bookHeight) / 2;

        // Parchment background
        ctx.fillStyle = '#F4E4BC';
        ctx.fillRect(bookX, bookY, bookWidth, bookHeight);

        // Book border (leather)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.strokeRect(bookX, bookY, bookWidth, bookHeight);

        // Inner border (gold)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(bookX + 15, bookY + 15, bookWidth - 30, bookHeight - 30);

        // Title
        ctx.font = 'bold 24px serif';
        ctx.fillStyle = '#8B0000';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentBook.title, CONSTANTS.CANVAS_WIDTH / 2, bookY + 50);

        // Decorative line under title
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bookX + 100, bookY + 60);
        ctx.lineTo(bookX + bookWidth - 100, bookY + 60);
        ctx.stroke();

        // Book contents
        ctx.font = '16px serif';
        ctx.fillStyle = '#2C1810';
        ctx.textAlign = 'left';

        const maxWidth = bookWidth - 60;
        const lineHeight = 24;
        const words = this.currentBook.contents.split(' ');
        let line = '';
        let y = bookY + 100;

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                ctx.fillText(line, bookX + 30, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, bookX + 30, y);

        // Close instruction
        ctx.font = '14px monospace';
        ctx.fillStyle = '#666666';
        ctx.textAlign = 'center';
        ctx.fillText('Press E or SPACE to close', CONSTANTS.CANVAS_WIDTH / 2, bookY + bookHeight - 25);

        ctx.restore();
    },

    updateBookDisplay: function() {
        if (this.bookDisplayActive) {
            if (Input.wasJustPressed('KeyE') || Input.wasJustPressed('Space')) {
                this.bookDisplayActive = false;
                this.currentBook = null;
            }
        }
    },

    bookDisplayActive: false,
    currentBook: null,

    getElementById: function(id) {
        return this.elements.find(e => e.id === id);
    },

    checkCollision: function(x, y, width, height) {
        for (let element of this.elements) {
            // Check closed doors
            if (element.type === 'door' && !element.open) {
                if (Utils.collides(
                    { x, y, width, height },
                    element
                )) {
                    return true;
                }
            }

            // Check movable blocks
            if (element.type === 'movable_block') {
                if (Utils.collides(
                    { x, y, width, height },
                    element
                )) {
                    return true;
                }
            }
        }
        return false;
    },

    draw: function(ctx) {
        this.elements.forEach(element => {
            this.drawElement(ctx, element);
        });
    },

    drawElement: function(ctx, element) {
        ctx.save();

        switch (element.type) {
            case 'switch':
                ctx.fillStyle = element.activated ? '#00FF00' : '#FF0000';
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(element.x + 8, element.y + 8, 16, 16);
                break;

            case 'door':
                if (!element.open) {
                    ctx.fillStyle = element.requiresKey ? '#8B4513' : '#4A4A4A';
                    ctx.fillRect(element.x, element.y, element.width, element.height);

                    if (element.requiresKey) {
                        // Keyhole
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(element.x + 12, element.y + 20, 8, 12);
                        ctx.fillRect(element.x + 14, element.y + 18, 4, 4);
                    } else {
                        // Handle
                        ctx.fillStyle = '#FFD700';
                        ctx.fillRect(element.x + 4, element.y + 20, 6, 10);
                    }
                } else {
                    // Open door (lighter, frame only)
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(element.x, element.y, element.width, element.height);
                }
                break;

            case 'pressure_plate':
                ctx.fillStyle = element.pressed ? '#00FF00' : '#808080';
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.strokeStyle = '#FFFFFF';
                ctx.strokeRect(element.x, element.y, element.width, element.height);
                break;

            case 'key':
                if (!element.collected) {
                    ctx.fillStyle = '#FFD700';
                    // Key head
                    ctx.fillRect(element.x + 4, element.y + 2, 12, 12);
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(element.x + 8, element.y + 6, 4, 4);
                    // Key shaft
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(element.x + 8, element.y + 14, 4, 10);
                    // Key teeth
                    ctx.fillRect(element.x + 12, element.y + 18, 6, 2);
                    ctx.fillRect(element.x + 12, element.y + 22, 4, 2);
                }
                break;

            case 'chest':
                if (!element.opened) {
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(element.x, element.y + 8, element.width, 24);
                    ctx.fillStyle = '#654321';
                    ctx.fillRect(element.x, element.y, element.width, 12);
                    // Lock
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(element.x + 12, element.y + 10, 8, 8);
                } else {
                    // Open chest
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(element.x, element.y + 12, element.width, 20);
                    // Open lid
                    ctx.fillStyle = '#654321';
                    ctx.fillRect(element.x - 4, element.y, element.width + 8, 8);
                    // Empty inside
                    ctx.fillStyle = '#2C1810';
                    ctx.fillRect(element.x + 2, element.y + 14, element.width - 4, 16);
                }
                break;

            case 'lever':
                ctx.fillStyle = '#4A4A4A';
                ctx.fillRect(element.x, element.y + 16, element.width, 16);
                ctx.fillStyle = '#8B4513';
                if (element.pulled) {
                    ctx.fillRect(element.x + 4, element.y + 8, 8, 12);
                } else {
                    ctx.fillRect(element.x + 4, element.y, 8, 16);
                }
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(element.x + 2, element.pulled ? element.y + 6 : element.y - 2, 12, 6);
                break;

            case 'movable_block':
                ctx.fillStyle = '#696969';
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(element.x, element.y, element.width, element.height);
                // Arrows indicating pushable
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(element.x + 12, element.y + 4, 8, 4);
                ctx.fillRect(element.x + 12, element.y + 24, 8, 4);
                ctx.fillRect(element.x + 4, element.y + 12, 4, 8);
                ctx.fillRect(element.x + 24, element.y + 12, 4, 8);
                break;

            case 'prison_cell':
                // Draw prison cell
                ctx.fillStyle = '#2C2C2C';
                ctx.fillRect(element.x, element.y, element.width, element.height);

                if (!element.opened) {
                    // Prison bars
                    ctx.fillStyle = '#4A4A4A';
                    for (let i = 0; i < 8; i++) {
                        ctx.fillRect(element.x + i * 8, element.y, 4, element.height);
                    }

                    // If mom is inside, show her silhouette
                    if (element.hasMom) {
                        ctx.fillStyle = '#FFB6C1';
                        ctx.fillRect(element.x + 24, element.y + 12, 16, 28);
                        ctx.fillStyle = '#8B4513';
                        ctx.fillRect(element.x + 28, element.y + 8, 8, 8);
                        // Glow effect
                        ctx.strokeStyle = '#FF69B4';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
                    }
                } else {
                    // Open cell
                    ctx.strokeStyle = '#4A4A4A';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(element.x, element.y, element.width, element.height);
                }
                break;

            case 'book':
                if (!element.read) {
                    // Ancient book
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(element.x, element.y, element.width, element.height);

                    // Book spine
                    ctx.fillStyle = '#654321';
                    ctx.fillRect(element.x, element.y, 4, element.height);

                    // Gold decorations
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(element.x + 8, element.y + 4, 12, 2);
                    ctx.fillRect(element.x + 8, element.y + 26, 12, 2);
                    ctx.fillRect(element.x + 10, element.y + 12, 8, 8);

                    // Magical glow
                    if (Math.sin(Date.now() * 0.005) > 0) {
                        ctx.strokeStyle = '#FFFF00';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
                    }
                } else {
                    // Read book (faded)
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    ctx.globalAlpha = 1;
                }
                break;

            case 'pestle':
                if (!element.activated) {
                    // Mortar (bowl)
                    ctx.fillStyle = '#8B8B8B';
                    ctx.fillRect(element.x + 4, element.y + 16, 24, 16);
                    ctx.fillStyle = '#6B6B6B';
                    ctx.fillRect(element.x + 6, element.y + 18, 20, 12);

                    // Pestle (grinding stick)
                    ctx.fillStyle = '#D2B48C';
                    ctx.fillRect(element.x + 12, element.y + 2, 8, 20);
                    ctx.fillStyle = '#8B7355';
                    ctx.fillRect(element.x + 10, element.y, 12, 6);

                    // Herbs/ingredients in mortar
                    ctx.fillStyle = '#228B22';
                    ctx.fillRect(element.x + 10, element.y + 20, 4, 4);
                    ctx.fillRect(element.x + 16, element.y + 22, 3, 3);
                    ctx.fillRect(element.x + 20, element.y + 21, 3, 3);

                    // Magical glow indicating interactable
                    if (Math.sin(Date.now() * 0.004) > 0) {
                        ctx.strokeStyle = '#00FF00';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
                    }
                } else {
                    // Used pestle (faded, empty)
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = '#8B8B8B';
                    ctx.fillRect(element.x + 4, element.y + 16, 24, 16);
                    ctx.fillStyle = '#6B6B6B';
                    ctx.fillRect(element.x + 6, element.y + 18, 20, 12);
                    ctx.fillStyle = '#D2B48C';
                    ctx.fillRect(element.x + 12, element.y + 2, 8, 20);
                    ctx.globalAlpha = 1;
                }
                break;
        }

        ctx.restore();
    },

    clear: function() {
        this.elements = [];
    },

    getSaveData: function() {
        return {
            solved: Utils.clone(this.solved),
            elements: this.elements.map(e => ({
                id: e.id,
                activated: e.activated,
                open: e.open,
                pressed: e.pressed,
                collected: e.collected,
                opened: e.opened,
                pulled: e.pulled,
                x: e.x,
                y: e.y
            }))
        };
    },

    loadSaveData: function(data) {
        this.solved = data.solved || {};
        data.elements.forEach(savedElement => {
            const element = this.getElementById(savedElement.id);
            if (element) {
                Object.assign(element, savedElement);
            }
        });
    }
};
