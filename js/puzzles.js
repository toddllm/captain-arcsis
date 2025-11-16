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

        // Check for interactions
        if (Input.wasJustPressed('KeyE')) {
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
                }
                Audio.buttonPress();
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
        }
    },

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
