// Player Character - Captain Arcsis

const Player = {
    x: 400,
    y: 300,
    width: 32,
    height: 40,
    speed: CONSTANTS.PLAYER_SPEED,
    direction: 'down',
    frame: 0,

    // Stats
    hp: CONSTANTS.PLAYER_BASE_HP,
    maxHp: CONSTANTS.PLAYER_BASE_HP,
    attack: CONSTANTS.PLAYER_BASE_ATTACK,
    defense: CONSTANTS.PLAYER_BASE_DEFENSE,

    // Experience and level
    level: 1,
    exp: 0,
    expToNext: CONSTANTS.EXP_BASE,

    // Equipment
    equipment: {
        swordLevel: 1,
        shieldLevel: 1,
        swordExp: 0,
        shieldExp: 0,
        swordExpToNext: 50,
        shieldExpToNext: 50
    },

    // Inventory
    coins: 0,
    keys: 0,
    items: [],

    // Combat state
    attacking: false,
    attackCooldown: 0,
    invincible: false,
    invincibilityTimer: 0,
    hitStun: 0,

    // Fairy companion
    hasFairy: false,
    fairyMana: 100,
    maxFairyMana: 100,

    // Quest progress
    questFlags: {},

    init: function(x, y) {
        this.x = x || 400;
        this.y = y || 300;
        this.hp = this.maxHp;
        this.frame = 0;
    },

    update: function(deltaTime, world) {
        // Update timers
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }

        if (this.invincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
            }
        }

        if (this.hitStun > 0) {
            this.hitStun -= deltaTime;
            return; // Can't move during hit stun
        }

        // Handle movement (no jumping!)
        let dx = 0;
        let dy = 0;

        if (Input.isPressed('KeyW') || Input.isPressed('ArrowUp')) {
            dy = -this.speed;
            this.direction = 'up';
        }
        if (Input.isPressed('KeyS') || Input.isPressed('ArrowDown')) {
            dy = this.speed;
            this.direction = 'down';
        }
        if (Input.isPressed('KeyA') || Input.isPressed('ArrowLeft')) {
            dx = -this.speed;
            this.direction = 'left';
        }
        if (Input.isPressed('KeyD') || Input.isPressed('ArrowRight')) {
            dx = this.speed;
            this.direction = 'right';
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        // Check collision before moving
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!this.checkWorldCollision(newX, this.y, world)) {
            this.x = newX;
        }
        if (!this.checkWorldCollision(this.x, newY, world)) {
            this.y = newY;
        }

        // Keep player in bounds
        this.x = Utils.clamp(this.x, 0, CONSTANTS.CANVAS_WIDTH - this.width);
        this.y = Utils.clamp(this.y, 0, CONSTANTS.CANVAS_HEIGHT - this.height);

        // Update animation frame
        if (dx !== 0 || dy !== 0) {
            this.frame++;
        }

        // Handle attack input
        if (Input.wasJustPressed('Space') && this.attackCooldown <= 0) {
            this.startAttack();
        }

        // Regenerate fairy mana
        if (this.hasFairy && this.fairyMana < this.maxFairyMana) {
            this.fairyMana = Math.min(this.maxFairyMana, this.fairyMana + deltaTime * 0.01);
        }
    },

    checkWorldCollision: function(x, y, world) {
        if (!world || !world.collisionMap) return false;

        // Check corners of player hitbox
        const checkPoints = [
            { x: x + 4, y: y + this.height - 4 }, // Bottom left
            { x: x + this.width - 4, y: y + this.height - 4 }, // Bottom right
            { x: x + 4, y: y + this.height / 2 }, // Middle left
            { x: x + this.width - 4, y: y + this.height / 2 } // Middle right
        ];

        for (let point of checkPoints) {
            const tileX = Math.floor(point.x / CONSTANTS.TILE_SIZE);
            const tileY = Math.floor(point.y / CONSTANTS.TILE_SIZE);

            if (world.collisionMap[tileY] && world.collisionMap[tileY][tileX]) {
                return true;
            }
        }

        return false;
    },

    startAttack: function() {
        this.attacking = true;
        this.attackCooldown = CONSTANTS.ATTACK_COOLDOWN;
        Audio.swordSwing();

        // Attack ends after short duration
        setTimeout(() => {
            this.attacking = false;
        }, 200);
    },

    getAttackHitbox: function() {
        const range = 40 + (this.equipment.swordLevel * 2);

        switch (this.direction) {
            case 'right':
                return {
                    x: this.x + this.width,
                    y: this.y,
                    width: range,
                    height: this.height
                };
            case 'left':
                return {
                    x: this.x - range,
                    y: this.y,
                    width: range,
                    height: this.height
                };
            case 'up':
                return {
                    x: this.x,
                    y: this.y - range,
                    width: this.width,
                    height: range
                };
            case 'down':
                return {
                    x: this.x,
                    y: this.y + this.height,
                    width: this.width,
                    height: range
                };
        }
    },

    calculateDamage: function() {
        const baseDamage = this.attack + (this.equipment.swordLevel * 5);
        const variance = Utils.random(-2, 2);
        return Math.max(1, baseDamage + variance);
    },

    takeDamage: function(damage) {
        if (this.invincible) return 0;

        // Shield reduces damage based on evolution level
        const shieldReduction = this.equipment.shieldLevel * 2;
        const actualDamage = Math.max(1, damage - this.defense - shieldReduction);

        this.hp -= actualDamage;
        this.invincible = true;
        this.invincibilityTimer = CONSTANTS.INVINCIBILITY_FRAMES;
        this.hitStun = CONSTANTS.HIT_STUN_DURATION;

        Audio.playerHurt();

        // Level up shield through use
        this.equipment.shieldExp += actualDamage;
        this.checkShieldEvolution();

        if (this.hp <= 0) {
            this.hp = 0;
            return -1; // Player died
        }

        return actualDamage;
    },

    heal: function(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    },

    addExp: function(amount) {
        this.exp += amount;

        // Level up sword through use
        this.equipment.swordExp += Math.floor(amount / 2);
        this.checkSwordLevel();

        while (this.exp >= this.expToNext) {
            this.levelUp();
        }
    },

    levelUp: function() {
        this.exp -= this.expToNext;
        this.level++;
        this.expToNext = Math.floor(CONSTANTS.EXP_BASE * Math.pow(CONSTANTS.EXP_MULTIPLIER, this.level - 1));

        // Increase stats
        this.maxHp += 10;
        this.hp = this.maxHp; // Full heal on level up
        this.attack += 2;
        this.defense += 1;

        Audio.levelUp();
    },

    checkSwordLevel: function() {
        while (this.equipment.swordExp >= this.equipment.swordExpToNext && this.equipment.swordLevel < 10) {
            this.equipment.swordExp -= this.equipment.swordExpToNext;
            this.equipment.swordLevel++;
            this.equipment.swordExpToNext = Math.floor(50 * Math.pow(1.8, this.equipment.swordLevel - 1));
            Audio.levelUp();
        }
    },

    checkShieldEvolution: function() {
        while (this.equipment.shieldExp >= this.equipment.shieldExpToNext && this.equipment.shieldLevel < 10) {
            this.equipment.shieldExp -= this.equipment.shieldExpToNext;
            this.equipment.shieldLevel++;
            this.equipment.shieldExpToNext = Math.floor(50 * Math.pow(2, this.equipment.shieldLevel - 1));
            Audio.levelUp();
        }
    },

    addCoins: function(amount) {
        this.coins += amount;
        Audio.coinCollect();
    },

    addKey: function() {
        this.keys++;
    },

    useKey: function() {
        if (this.keys > 0) {
            this.keys--;
            return true;
        }
        return false;
    },

    setFlag: function(flag, value) {
        this.questFlags[flag] = value;
    },

    getFlag: function(flag) {
        return this.questFlags[flag] || false;
    },

    draw: function(ctx) {
        // Flash when invincible
        if (this.invincible && Math.floor(this.invincibilityTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        Sprites.drawArcsis(ctx, this.x, this.y, this.direction, this.frame, this.equipment);

        ctx.globalAlpha = 1;

        // Draw attack effect
        if (this.attacking) {
            Sprites.drawSlash(ctx, this.x + this.width / 2, this.y + this.height / 2, this.direction, (200 - this.attackCooldown) / 20);
        }
    },

    getHitbox: function() {
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 8
        };
    },

    getSaveData: function() {
        return {
            x: this.x,
            y: this.y,
            hp: this.hp,
            maxHp: this.maxHp,
            attack: this.attack,
            defense: this.defense,
            level: this.level,
            exp: this.exp,
            expToNext: this.expToNext,
            equipment: Utils.clone(this.equipment),
            coins: this.coins,
            keys: this.keys,
            items: [...this.items],
            hasFairy: this.hasFairy,
            fairyMana: this.fairyMana,
            maxFairyMana: this.maxFairyMana,
            questFlags: Utils.clone(this.questFlags)
        };
    },

    loadSaveData: function(data) {
        Object.assign(this, data);
    }
};
