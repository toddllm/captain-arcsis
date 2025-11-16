// Player Character - Captain Arcsis

const Player = {
    x: 400,
    y: 300,
    width: 32,
    height: 40,
    speed: CONSTANTS.PLAYER_SPEED,
    direction: 'down',
    frame: 0,

    // Stats - Now using HEARTS system!
    hearts: 3,
    maxHearts: 3,
    hp: CONSTANTS.PLAYER_BASE_HP,
    maxHp: CONSTANTS.PLAYER_BASE_HP,
    heartHp: 100, // HP per heart
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

    // Arcsis Spin Attack
    spinning: false,
    spinCooldown: 0,
    spinDuration: 0,
    spinRadius: 150,
    spinDamageMultiplier: 5,
    caughtEnemies: [],

    // Special Ability (requires full hearts)
    specialAbilityCharge: 0,
    specialAbilityCooldown: 0,
    canUseSpecial: true,

    // Dash ability
    dashing: false,
    dashCooldown: 0,
    dashDuration: 0,
    dashDirection: { x: 0, y: 0 },
    dashSpeed: 12,

    // Combo system
    comboCount: 0,
    comboTimer: 0,
    maxCombo: 0,

    // Power-ups
    powerUps: {
        damageBoost: 0,
        speedBoost: 0,
        shield: 0
    },

    // Fairy companion
    hasFairy: false,
    fairyMana: 100,
    maxFairyMana: 100,

    // Quest progress
    questFlags: {},

    init: function(x, y) {
        this.x = x || 400;
        this.y = y || 300;
        this.hearts = 3;
        this.hp = this.heartHp;
        this.frame = 0;
        this.comboCount = 0;
        this.maxCombo = 0;
        this.spinning = false;
        this.dashing = false;
        this.caughtEnemies = [];
    },

    update: function(deltaTime, world) {
        // Update timers
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }

        if (this.spinCooldown > 0) {
            this.spinCooldown -= deltaTime;
        }

        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }

        if (this.specialAbilityCooldown > 0) {
            this.specialAbilityCooldown -= deltaTime;
        }

        // Update combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
            }
        }

        // Update power-ups
        if (this.powerUps.damageBoost > 0) {
            this.powerUps.damageBoost -= deltaTime;
        }
        if (this.powerUps.speedBoost > 0) {
            this.powerUps.speedBoost -= deltaTime;
        }
        if (this.powerUps.shield > 0) {
            this.powerUps.shield -= deltaTime;
        }

        // Update special ability availability (requires full hearts)
        this.canUseSpecial = (this.hearts === this.maxHearts);

        if (this.invincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
            }
        }

        // Handle spinning attack
        if (this.spinning) {
            this.spinDuration -= deltaTime;
            if (this.spinDuration <= 0) {
                this.finishSpinAttack();
            } else {
                this.updateSpinAttack(deltaTime);
            }
            return; // Can't do anything else while spinning
        }

        // Handle dashing
        if (this.dashing) {
            this.dashDuration -= deltaTime;
            if (this.dashDuration <= 0) {
                this.dashing = false;
            } else {
                // Move in dash direction
                const newX = this.x + this.dashDirection.x * this.dashSpeed;
                const newY = this.y + this.dashDirection.y * this.dashSpeed;

                if (!this.checkWorldCollision(newX, this.y, world)) {
                    this.x = newX;
                }
                if (!this.checkWorldCollision(this.x, newY, world)) {
                    this.y = newY;
                }

                this.x = Utils.clamp(this.x, 0, CONSTANTS.CANVAS_WIDTH - this.width);
                this.y = Utils.clamp(this.y, 0, CONSTANTS.CANVAS_HEIGHT - this.height);
            }
            return; // Can't do anything else while dashing
        }

        if (this.hitStun > 0) {
            this.hitStun -= deltaTime;
            return; // Can't move during hit stun
        }

        // Handle movement (no jumping!)
        let dx = 0;
        let dy = 0;

        const currentSpeed = this.speed + (this.powerUps.speedBoost > 0 ? 2 : 0);

        if (Input.isPressed('KeyW') || Input.isPressed('ArrowUp')) {
            dy = -currentSpeed;
            this.direction = 'up';
        }
        if (Input.isPressed('KeyS') || Input.isPressed('ArrowDown')) {
            dy = currentSpeed;
            this.direction = 'down';
        }
        if (Input.isPressed('KeyA') || Input.isPressed('ArrowLeft')) {
            dx = -currentSpeed;
            this.direction = 'left';
        }
        if (Input.isPressed('KeyD') || Input.isPressed('ArrowRight')) {
            dx = currentSpeed;
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

        // Handle ARCSIS SPIN ATTACK (Space + Shift simultaneously)
        if (Input.isPressed('Space') && Input.isPressed('ShiftLeft') && this.spinCooldown <= 0 && !this.spinning) {
            this.startSpinAttack();
        }
        // Handle normal attack input
        else if (Input.wasJustPressed('Space') && this.attackCooldown <= 0 && !this.spinning) {
            this.startAttack();
        }

        // Handle dash (Q key)
        if (Input.wasJustPressed('KeyQ') && this.dashCooldown <= 0 && (dx !== 0 || dy !== 0)) {
            this.startDash(dx, dy);
        }

        // Handle special ability (R key) - requires full hearts!
        if (Input.wasJustPressed('KeyR') && this.canUseSpecial && this.specialAbilityCooldown <= 0) {
            this.useSpecialAbility();
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
        let baseDamage = this.attack + (this.equipment.swordLevel * 5);

        // Power-up boost
        if (this.powerUps.damageBoost > 0) {
            baseDamage *= 1.5;
        }

        // Combo multiplier
        if (this.comboCount > 0) {
            baseDamage *= (1 + this.comboCount * 0.1);
        }

        const variance = Utils.random(-2, 2);
        return Math.max(1, Math.floor(baseDamage + variance));
    },

    takeDamage: function(damage) {
        if (this.invincible) return 0;

        // Power-up shield protection
        if (this.powerUps.shield > 0) {
            damage = Math.floor(damage * 0.5);
        }

        // Shield reduces damage based on evolution level
        const shieldReduction = this.equipment.shieldLevel * 2;
        const actualDamage = Math.max(1, damage - this.defense - shieldReduction);

        this.hp -= actualDamage;
        this.invincible = true;
        this.invincibilityTimer = CONSTANTS.INVINCIBILITY_FRAMES;
        this.hitStun = CONSTANTS.HIT_STUN_DURATION;

        // Check if heart is lost
        if (this.hp <= 0 && this.hearts > 1) {
            this.hearts--;
            this.hp = this.heartHp; // Refill HP for next heart
            Audio.heartLost();

            // Lose special ability when not at full hearts
            this.canUseSpecial = false;
        } else if (this.hp <= 0 && this.hearts <= 1) {
            this.hearts = 0;
            this.hp = 0;
            Audio.playerHurt();
            return -1; // Player died
        } else {
            Audio.playerHurt();
        }

        // Level up shield through use
        this.equipment.shieldExp += actualDamage;
        this.checkShieldEvolution();

        return actualDamage;
    },

    heal: function(amount) {
        this.hp = Math.min(this.heartHp, this.hp + amount);
    },

    healHeart: function() {
        if (this.hearts < this.maxHearts) {
            this.hearts++;
            this.hp = this.heartHp;
        }
    },

    // ARCSIS SPIN ATTACK - The signature move!
    startSpinAttack: function() {
        this.spinning = true;
        this.spinDuration = 800; // 0.8 seconds of spin
        this.spinCooldown = 5000; // 5 second cooldown
        this.caughtEnemies = [];
        Audio.spinAttack();
    },

    updateSpinAttack: function(deltaTime) {
        // Pull in nearby enemies
        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height / 2;

        // This will be called from Enemies.checkCollisions
        // The spin attack pulls enemies toward center
    },

    finishSpinAttack: function() {
        // Launch all caught enemies upward, then crash them together
        // This creates the ultra damage effect
        this.spinning = false;

        // The actual damage calculation happens in Enemies.checkCollisions
        // when it detects the spin attack finished
    },

    getSpinAttackHitbox: function() {
        return {
            x: this.x + this.width / 2 - this.spinRadius,
            y: this.y + this.height / 2 - this.spinRadius,
            width: this.spinRadius * 2,
            height: this.spinRadius * 2
        };
    },

    // Dash ability
    startDash: function(dx, dy) {
        this.dashing = true;
        this.dashDuration = 150; // 150ms dash
        this.dashCooldown = 1000; // 1 second cooldown

        // Normalize dash direction
        const length = Math.sqrt(dx * dx + dy * dy);
        this.dashDirection = {
            x: dx / length,
            y: dy / length
        };

        Audio.dash();
        this.invincible = true;
        this.invincibilityTimer = 200; // Brief invincibility during dash
    },

    // Special ability (ONLY when at full 3 hearts!)
    useSpecialAbility: function() {
        if (!this.canUseSpecial) return;

        // ARCSIS NOVA - Massive area damage + heal
        this.specialAbilityCooldown = 15000; // 15 second cooldown

        Audio.specialCharge();

        // Create massive explosion effect
        Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'arcsis_nova');

        // Damage will be applied in Enemies.checkCollisions
        // Also grants temporary damage boost
        this.powerUps.damageBoost = 5000; // 5 seconds of damage boost
    },

    // Add to combo
    addCombo: function() {
        this.comboCount++;
        this.comboTimer = 2000; // 2 seconds to maintain combo
        if (this.comboCount > this.maxCombo) {
            this.maxCombo = this.comboCount;
        }
        Audio.comboHit(this.comboCount);
    },

    // Collect power-up
    collectPowerUp: function(type) {
        Audio.powerUpCollect();

        switch (type) {
            case 'damage':
                this.powerUps.damageBoost = 10000; // 10 seconds
                break;
            case 'speed':
                this.powerUps.speedBoost = 10000; // 10 seconds
                break;
            case 'shield':
                this.powerUps.shield = 10000; // 10 seconds
                break;
            case 'heart':
                this.healHeart();
                break;
        }
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

        // Draw dash trail
        if (this.dashing) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(this.x - this.dashDirection.x * 20, this.y - this.dashDirection.y * 20, this.width, this.height);
            ctx.globalAlpha = this.invincible ? 0.5 : 1;
        }

        Sprites.drawArcsis(ctx, this.x, this.y, this.direction, this.frame, this.equipment);

        ctx.globalAlpha = 1;

        // Draw spin attack effect
        if (this.spinning) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const spinProgress = (800 - this.spinDuration) / 800;

            // Draw spinning vortex
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(spinProgress * Math.PI * 8); // 4 full rotations

            // Vortex rings
            for (let i = 0; i < 3; i++) {
                const radius = this.spinRadius * (0.3 + i * 0.3) * spinProgress;
                ctx.strokeStyle = `rgba(255, ${100 + i * 50}, 0, ${0.8 - i * 0.2})`;
                ctx.lineWidth = 4 - i;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw pull lines
            ctx.strokeStyle = '#FF6600';
            ctx.lineWidth = 2;
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
                ctx.lineTo(Math.cos(angle) * this.spinRadius, Math.sin(angle) * this.spinRadius);
                ctx.stroke();
            }

            ctx.restore();
        }

        // Draw attack effect
        if (this.attacking) {
            Sprites.drawSlash(ctx, this.x + this.width / 2, this.y + this.height / 2, this.direction, (200 - this.attackCooldown) / 20);
        }

        // Draw combo counter
        if (this.comboCount > 1) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.comboCount}x COMBO!`, this.x + this.width / 2, this.y - 20);
        }

        // Draw power-up indicators
        if (this.powerUps.damageBoost > 0) {
            ctx.fillStyle = '#FF4444';
            ctx.fillRect(this.x - 2, this.y - 8, 8, 8);
        }
        if (this.powerUps.speedBoost > 0) {
            ctx.fillStyle = '#44FF44';
            ctx.fillRect(this.x + 10, this.y - 8, 8, 8);
        }
        if (this.powerUps.shield > 0) {
            ctx.fillStyle = '#4444FF';
            ctx.fillRect(this.x + 22, this.y - 8, 8, 8);
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
            hearts: this.hearts,
            maxHearts: this.maxHearts,
            hp: this.hp,
            heartHp: this.heartHp,
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
            maxCombo: this.maxCombo,
            questFlags: Utils.clone(this.questFlags)
        };
    },

    loadSaveData: function(data) {
        Object.assign(this, data);
        this.canUseSpecial = (this.hearts === this.maxHearts);
    }
};
