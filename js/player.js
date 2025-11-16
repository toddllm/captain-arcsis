// Player Character - Captain Arcsis ENHANCED EDITION
// With Color Variants, Infinite Equipment Evolution, Spell Learning, and More!

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
    permanentDeaths: 0, // Track total deaths for progression

    // Arcsis Type (YELLOW, RED, GREEN, BLUE)
    arcsisType: 'BLUE', // Default type
    typeBonuses: null,

    // Stats
    hp: CONSTANTS.PLAYER_BASE_HP,
    maxHp: CONSTANTS.PLAYER_BASE_HP,
    heartHp: 100, // HP per heart
    attack: CONSTANTS.PLAYER_BASE_ATTACK,
    defense: CONSTANTS.PLAYER_BASE_DEFENSE,
    critChance: CONSTANTS.CRIT_CHANCE_BASE,
    dodgeChance: 0,

    // Experience and level (INFINITE SCALING)
    level: 1,
    exp: 0,
    expToNext: CONSTANTS.EXP_BASE,

    // INFINITE Equipment Evolution System
    equipment: {
        // Sword - INFINITE LEVELS
        swordLevel: 1,
        swordExp: 0,
        swordExpToNext: 50,
        swordRarity: 'COMMON',
        swordName: 'Rusty Blade',
        swordKills: 0,
        swordCombo: 0,
        maxCombo: 0,

        // Shield - INFINITE LEVELS
        shieldLevel: 1,
        shieldExp: 0,
        shieldExpToNext: 50,
        shieldRarity: 'COMMON',
        shieldName: 'Wooden Buckler',
        shieldBlocks: 0,
        perfectBlocks: 0
    },

    // Spell Learning System
    learnedSpells: ['light'], // Start with basic light spell
    availableSpells: ['heal', 'blast', 'shield', 'fireball', 'icestorm', 'lightning', 'earthquake', 'teleport', 'timestop', 'meteor'],
    spellProgress: {}, // Progress towards learning each spell
    selectedSpell: 0,

    // Inventory
    coins: 0,
    keys: 0,
    secretKeys: 0, // Special keys from Anizon
    items: [],
    potions: {
        health: 3,
        mana: 3,
        mega: 0
    },

    // Combat state
    attacking: false,
    attackCooldown: 0,
    invincible: false,
    invincibilityTimer: 0,
    hitStun: 0,
    comboTimer: 0,
    currentCombo: 0,
    lastCritical: false,

    // Status Effects
    statusEffects: [],

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

    // ULTIMATE SYSTEM - Multiple ultimates to unlock!
    currentUltimate: 'arcsis_nova',
    unlockedUltimates: ['arcsis_nova'],
    ultimateData: {
        arcsis_nova: {
            name: 'Arcsis Nova',
            description: 'Massive explosion that damages all enemies',
            cooldown: 15000,
            unlockCost: 0
        },
        void_rift: {
            name: 'Void Rift',
            description: 'Open a rift that pulls and damages enemies',
            cooldown: 20000,
            unlockCost: 500
        },
        phoenix_rebirth: {
            name: 'Phoenix Rebirth',
            description: 'Revive with full health when killed (once per battle)',
            cooldown: 60000,
            unlockCost: 750
        },
        frost_apocalypse: {
            name: 'Frost Apocalypse',
            description: 'Freeze all enemies and deal massive damage',
            cooldown: 25000,
            unlockCost: 1000
        },
        chaos_storm: {
            name: 'Chaos Storm',
            description: 'Summon random devastating effects',
            cooldown: 18000,
            unlockCost: 1200
        },
        time_rewind: {
            name: 'Time Rewind',
            description: 'Rewind your health to 3 seconds ago',
            cooldown: 30000,
            unlockCost: 1500
        },
        lightning_avatar: {
            name: 'Lightning Avatar',
            description: 'Transform into pure lightning for 5 seconds',
            cooldown: 35000,
            unlockCost: 2000
        }
    },
    healthHistory: [], // For time rewind ultimate

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

    // Sword trail effect
    swordTrail: [],
    maxTrailLength: 8,

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

    // Anizon Encounter Tracking
    anizonDefeats: 0,
    anizonFriends: [], // Friends unlocked from Anizon
    secretsUnlocked: [],
    hasAnizonHeartKey: false, // Special key to unlock mom's prison cell

    // Skill Points and Skill Tree
    skillPoints: 0,
    skills: {
        // Combat Skills
        swordMastery: 0,      // +10% sword damage per level
        shieldMastery: 0,     // +10% shield effectiveness per level
        criticalStrike: 0,    // +5% crit chance per level
        comboMaster: 0,       // +2s combo window per level
        lifesteal: 0,         // 5% lifesteal per level

        // Magic Skills
        manaPool: 0,          // +20 max mana per level
        spellPower: 0,        // +15% spell damage per level
        fastCasting: 0,       // -10% cooldown per level
        manaRegen: 0,         // +50% mana regen per level

        // Survival Skills
        vitality: 0,          // +25 max HP per level
        regeneration: 0,      // +1 HP/s per level
        dodgeRoll: 0,         // +3% dodge chance per level
        lastStand: 0          // 10% chance to survive fatal hit per level
    },

    // Achievements
    achievements: [],
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    enemiesKilled: 0,
    bossesDefeated: 0,
    secretsFound: 0,
    maxLevelReached: 1,

    // Quest progress
    questFlags: {},

    init: function(x, y, arcsisType = 'BLUE') {
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
        this.setArcsisType(arcsisType);
        this.statusEffects = [];
        this.currentCombo = 0;
        this.comboTimer = 0;
        this.swordTrail = [];

        // Initialize spell progress
        this.availableSpells.forEach(spell => {
            if (!this.spellProgress[spell]) {
                this.spellProgress[spell] = 0;
            }
        });
    },

    setArcsisType: function(type) {
        this.arcsisType = type;
        this.typeBonuses = CONSTANTS.ARCSIS_TYPES[type].bonuses;

        // Apply type bonuses
        this.attack = this.typeBonuses.baseAttack || CONSTANTS.PLAYER_BASE_ATTACK;
        this.defense = this.typeBonuses.baseDefense || CONSTANTS.PLAYER_BASE_DEFENSE;

        if (this.typeBonuses.speed) {
            this.speed = CONSTANTS.PLAYER_SPEED * this.typeBonuses.speed;
        }

        if (this.typeBonuses.critChance) {
            this.critChance = CONSTANTS.CRIT_CHANCE_BASE + this.typeBonuses.critChance;
        }

        if (this.typeBonuses.dodgeChance) {
            this.dodgeChance = this.typeBonuses.dodgeChance;
        }
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

        // Update status effects
        this.updateStatusEffects(deltaTime);

        // HP Regeneration (Green Arcsis or Regeneration skill)
        if (this.typeBonuses && (this.typeBonuses.hpRegen || this.skills.regeneration > 0)) {
            const regenRate = (this.typeBonuses.hpRegen || 0) + this.skills.regeneration;
            this.heal(regenRate * (deltaTime / 1000));
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

        // Apply freeze slow
        const freezeEffect = this.statusEffects.find(e => e.type === 'FREEZE');
        if (freezeEffect) {
            dx *= 0.5;
            dy *= 0.5;
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

            // Spawn footstep dust particles every few frames
            if (this.frame % 8 === 0) {
                Combat.addDustParticle(
                    this.x + this.width / 2,
                    this.y + this.height - 2
                );
            }
        }

        // Update sword trail
        this.updateSwordTrail();

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

        // Cycle through ultimates (T key)
        if (Input.wasJustPressed('KeyT')) {
            this.cycleUltimate();
        }

        // Track health history for Time Rewind ultimate (every 100ms)
        if (!this.lastHealthTrack || Date.now() - this.lastHealthTrack > 100) {
            this.healthHistory.unshift({ hp: this.hp, hearts: this.hearts });
            if (this.healthHistory.length > 30) { // Keep 3 seconds of history
                this.healthHistory.pop();
            }
            this.lastHealthTrack = Date.now();
        }

        // Handle potion usage
        if (Input.wasJustPressed('Digit1') && this.potions.health > 0) {
            this.useHealthPotion();
        }
        if (Input.wasJustPressed('Digit2') && this.potions.mana > 0) {
            this.useManaPotion();
        }
        if (Input.wasJustPressed('Digit3') && this.potions.mega > 0) {
            this.useMegaPotion();
        }

        // Regenerate fairy mana
        if (this.hasFairy && this.fairyMana < this.maxFairyMana) {
            let manaRegenRate = 0.01;
            if (this.typeBonuses.manaRegen) {
                manaRegenRate *= this.typeBonuses.manaRegen;
            }
            if (this.skills.manaRegen > 0) {
                manaRegenRate *= (1 + this.skills.manaRegen * 0.5);
            }
            this.fairyMana = Math.min(this.maxFairyMana, this.fairyMana + deltaTime * manaRegenRate);
        }
    },

    updateStatusEffects: function(deltaTime) {
        this.statusEffects = this.statusEffects.filter(effect => {
            effect.duration -= deltaTime;

            // Apply tick damage
            if (effect.tickDamage) {
                effect.tickTimer = (effect.tickTimer || 0) + deltaTime;
                if (effect.tickTimer >= 1000) {
                    this.hp -= effect.tickDamage;
                    effect.tickTimer = 0;

                    Combat.addDamageNumber(this.x + this.width / 2, this.y, effect.tickDamage, effect.color);
                }
            }

            return effect.duration > 0;
        });
    },

    checkWorldCollision: function(x, y, world) {
        if (!world || !world.collisionMap) return false;

        // Check corners of player hitbox
        const checkPoints = [
            { x: x + 4, y: y + this.height - 4 },
            { x: x + this.width - 4, y: y + this.height - 4 },
            { x: x + 4, y: y + this.height / 2 },
            { x: x + this.width - 4, y: y + this.height / 2 }
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

        // Apply fast casting skill
        let cooldown = CONSTANTS.ATTACK_COOLDOWN;
        if (this.skills.fastCasting > 0) {
            cooldown *= (1 - this.skills.fastCasting * 0.1);
        }

        this.attackCooldown = cooldown;
        Audio.swordSwing();

        // Attack ends after short duration
        setTimeout(() => {
            this.attacking = false;
        }, 200);
    },

    getAttackHitbox: function() {
        const baseRange = 40;
        const swordBonus = this.equipment.swordLevel * 2;
        const comboBonus = Math.min(this.currentCombo * 5, 50);
        const range = baseRange + swordBonus + comboBonus;

        switch (this.direction) {
            case 'right':
                return { x: this.x + this.width, y: this.y, width: range, height: this.height };
            case 'left':
                return { x: this.x - range, y: this.y, width: range, height: this.height };
            case 'up':
                return { x: this.x, y: this.y - range, width: this.width, height: range };
            case 'down':
                return { x: this.x, y: this.y + this.height, width: this.width, height: range };
        }
    },

    calculateDamage: function() {
        // Base damage
        let baseDamage = this.attack;

        // Sword level bonus (INFINITE SCALING)
        baseDamage += this.getSwordDamageBonus();

        // Apply rarity multiplier
        const rarityBonus = CONSTANTS.RARITY[this.equipment.swordRarity].multiplier;
        baseDamage *= rarityBonus;

        // Type bonus (Red = Attack focused)
        if (this.typeBonuses && this.typeBonuses.attackPower) {
            baseDamage *= this.typeBonuses.attackPower;
        }

        // Skill bonuses
        if (this.skills.swordMastery > 0) {
            baseDamage *= (1 + this.skills.swordMastery * 0.1);
        }

        // Power-up boost
        if (this.powerUps.damageBoost > 0) {
            baseDamage *= 1.5;
        }

        // Combo multiplier (use both combo systems)
        const comboMultiplier = 1 + (Math.max(this.currentCombo, this.comboCount) * 0.1);
        baseDamage *= comboMultiplier;

        // Check for critical hit
        let totalCritChance = this.critChance + (this.skills.criticalStrike * 5);
        this.lastCritical = Math.random() * 100 < totalCritChance;

        if (this.lastCritical) {
            baseDamage *= CONSTANTS.CRIT_MULTIPLIER;
        }

        // Variance
        const variance = Utils.random(-2, 2);

        // Weakness debuff
        const weaknessEffect = this.statusEffects.find(e => e.type === 'WEAKNESS');
        if (weaknessEffect) {
            baseDamage *= (1 - weaknessEffect.attackReduction / 100);
        }

        return Math.max(1, Math.floor(baseDamage + variance));
    },

    getSwordDamageBonus: function() {
        // INFINITE SCALING - damage increases exponentially
        const level = this.equipment.swordLevel;
        const baseBonus = level * 5;
        const exponentialBonus = Math.floor(Math.pow(level, 1.3));
        return baseBonus + exponentialBonus;
    },

    getShieldReduction: function() {
        // INFINITE SCALING - defense increases exponentially
        const level = this.equipment.shieldLevel;
        const baseReduction = level * 2;
        const exponentialReduction = Math.floor(Math.pow(level, 1.2));

        let total = baseReduction + exponentialReduction;

        // Apply rarity bonus
        const rarityBonus = CONSTANTS.RARITY[this.equipment.shieldRarity].multiplier;
        total *= rarityBonus;

        // Skill bonus
        if (this.skills.shieldMastery > 0) {
            total *= (1 + this.skills.shieldMastery * 0.1);
        }

        // Type bonus (Green = Defense focused)
        if (this.typeBonuses && this.typeBonuses.defense) {
            total *= this.typeBonuses.defense;
        }

        return Math.floor(total);
    },

    takeDamage: function(damage) {
        if (this.invincible) return 0;

        // Check dodge (Blue Arcsis)
        const totalDodge = this.dodgeChance + (this.skills.dodgeRoll * 3);
        if (Math.random() * 100 < totalDodge) {
            Combat.addEffect({
                type: 'dodge',
                x: this.x + this.width / 2,
                y: this.y,
                frame: 0,
                maxFrames: 20
            });
            return 0;
        }

        // Power-up shield protection
        if (this.powerUps.shield > 0) {
            damage = Math.floor(damage * 0.5);
        }

        // Shield reduces damage
        const shieldReduction = this.getShieldReduction();

        // Curse effect reduces defense
        const curseEffect = this.statusEffects.find(e => e.type === 'CURSE');
        let defenseValue = this.defense;
        if (curseEffect) {
            defenseValue *= (1 - curseEffect.defenseReduction / 100);
        }

        const actualDamage = Math.max(1, damage - defenseValue - shieldReduction);

        this.hp -= actualDamage;
        this.invincible = true;
        this.invincibilityTimer = CONSTANTS.INVINCIBILITY_FRAMES;
        this.hitStun = CONSTANTS.HIT_STUN_DURATION;

        // Screen shake on damage
        ScreenShake.medium();

        // Check if heart is lost
        if (this.hp <= 0 && this.hearts > 1) {
            this.hearts--;
            this.hp = this.heartHp; // Refill HP for next heart
            Audio.heartLost();
            // Extra shake when losing a heart
            ScreenShake.heavy();

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

        // Lifesteal
        if (this.skills.lifesteal > 0) {
            const lifestealAmount = actualDamage * (this.skills.lifesteal * 0.05);
            this.heal(lifestealAmount);
        }

        // Track damage taken
        this.totalDamageTaken += actualDamage;

        // Level up shield through use
        this.equipment.shieldExp += actualDamage;
        this.equipment.shieldBlocks++;
        this.checkShieldEvolution();

        // Last Stand skill (only if still alive after heart system)
        if (this.hp <= 0 && this.hearts <= 1 && this.skills.lastStand > 0) {
            const surviveChance = this.skills.lastStand * 10;
            if (Math.random() * 100 < surviveChance) {
                this.hp = 1;
                this.hearts = 1;
                Combat.addEffect({
                    type: 'laststand',
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    frame: 0,
                    maxFrames: 30
                });
            }
        }

        return actualDamage;
    },

    registerHit: function() {
        // Called when player successfully hits enemy
        this.currentCombo++;
        this.equipment.swordCombo++;

        // Update max combo
        if (this.currentCombo > this.equipment.maxCombo) {
            this.equipment.maxCombo = this.currentCombo;
        }
        if (this.currentCombo > this.maxCombo) {
            this.maxCombo = this.currentCombo;
        }

        // Reset combo timer
        const baseTimer = 3000;
        const skillBonus = this.skills.comboMaster * 2000;
        this.comboTimer = baseTimer + skillBonus;

        // Show combo indicator
        if (this.currentCombo >= 5) {
            Combat.addEffect({
                type: 'combo',
                x: this.x + this.width / 2,
                y: this.y - 30,
                frame: 0,
                maxFrames: 30,
                combo: this.currentCombo
            });
        }
    },

    endCombo: function() {
        if (this.currentCombo >= 10) {
            // Bonus for high combo
            const bonusExp = this.currentCombo * 10;
            this.addExp(bonusExp);
        }
        this.currentCombo = 0;
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

        const ultimate = this.ultimateData[this.currentUltimate];
        this.specialAbilityCooldown = ultimate.cooldown;

        Audio.specialCharge();

        // Execute different ultimates based on current selection
        switch (this.currentUltimate) {
            case 'arcsis_nova':
                // ARCSIS NOVA - Massive area damage + heal
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'arcsis_nova');
                this.powerUps.damageBoost = 5000;
                Fairy.speak("ARCSIS NOVA! Devastating explosion!");
                break;

            case 'void_rift':
                // VOID RIFT - Pull and damage enemies
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'void_rift');
                this.powerUps.damageBoost = 3000;
                Fairy.speak("VOID RIFT! Reality tears apart!");
                break;

            case 'phoenix_rebirth':
                // PHOENIX REBIRTH - Auto-revive on next death
                this.phoenixRebirthActive = true;
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'phoenix_rebirth');
                Fairy.speak("PHOENIX REBIRTH! You cannot die!");
                break;

            case 'frost_apocalypse':
                // FROST APOCALYPSE - Freeze all enemies
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'frost_apocalypse');
                this.powerUps.damageBoost = 8000;
                Fairy.speak("FROST APOCALYPSE! All shall freeze!");
                break;

            case 'chaos_storm':
                // CHAOS STORM - Random powerful effects
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'chaos_storm');
                this.powerUps.damageBoost = 10000;
                this.powerUps.speedBoost = 5000;
                this.heal(50);
                Fairy.speak("CHAOS STORM! Unpredictable destruction!");
                break;

            case 'time_rewind':
                // TIME REWIND - Restore health from 3 seconds ago
                if (this.healthHistory.length > 0) {
                    const oldHealth = this.healthHistory[0];
                    this.hp = Math.max(this.hp, oldHealth.hp);
                    this.hearts = Math.max(this.hearts, oldHealth.hearts);
                }
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'time_rewind');
                Fairy.speak("TIME REWIND! Health restored!");
                break;

            case 'lightning_avatar':
                // LIGHTNING AVATAR - Transform into lightning
                this.lightningAvatarActive = true;
                this.lightningAvatarDuration = 5000;
                this.invincible = true;
                this.invincibilityTimer = 5000;
                this.powerUps.speedBoost = 5000;
                this.powerUps.damageBoost = 5000;
                Combat.addEffect(this.x + this.width / 2, this.y + this.height / 2, 'lightning_avatar');
                Fairy.speak("LIGHTNING AVATAR! Pure energy!");
                break;
        }
    },

    unlockUltimate: function(ultimateId) {
        if (this.unlockedUltimates.includes(ultimateId)) {
            return false; // Already unlocked
        }

        const cost = this.ultimateData[ultimateId].unlockCost;
        if (this.coins >= cost) {
            this.coins -= cost;
            this.unlockedUltimates.push(ultimateId);
            Fairy.speak(`Unlocked ${this.ultimateData[ultimateId].name}!`);
            return true;
        }
        return false;
    },

    switchUltimate: function(ultimateId) {
        if (this.unlockedUltimates.includes(ultimateId)) {
            this.currentUltimate = ultimateId;
            Fairy.speak(`Switched to ${this.ultimateData[ultimateId].name}!`);
            return true;
        }
        return false;
    },

    cycleUltimate: function() {
        const currentIndex = this.unlockedUltimates.indexOf(this.currentUltimate);
        const nextIndex = (currentIndex + 1) % this.unlockedUltimates.length;
        this.currentUltimate = this.unlockedUltimates[nextIndex];
        Fairy.speak(`Ultimate: ${this.ultimateData[this.currentUltimate].name}`);
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

    useHealthPotion: function() {
        if (this.potions.health <= 0) return;

        const healAmount = this.maxHp * 0.5;
        this.heal(healAmount);
        this.potions.health--;

        Audio.itemUse();
        Combat.addEffect({
            type: 'potion',
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            frame: 0,
            maxFrames: 20,
            color: '#FF0000'
        });
    },

    useManaPotion: function() {
        if (this.potions.mana <= 0) return;

        const manaAmount = this.maxFairyMana * 0.5;
        this.fairyMana = Math.min(this.maxFairyMana, this.fairyMana + manaAmount);
        this.potions.mana--;

        Audio.itemUse();
        Combat.addEffect({
            type: 'potion',
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            frame: 0,
            maxFrames: 20,
            color: '#0088FF'
        });
    },

    useMegaPotion: function() {
        if (this.potions.mega <= 0) return;

        this.hp = this.maxHp;
        this.fairyMana = this.maxFairyMana;
        this.statusEffects = [];
        this.potions.mega--;

        Audio.itemUse();
        Combat.addEffect({
            type: 'megapotion',
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            frame: 0,
            maxFrames: 40
        });
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
        let hpGain = 10 + (this.skills.vitality * 25);
        this.maxHp += hpGain;
        this.hp = this.maxHp; // Full heal on level up
        this.attack += 2;
        this.defense += 1;

        // Magic pool increase
        if (this.skills.manaPool > 0) {
            this.maxFairyMana += 5;
        }

        // Gain skill point every 5 levels
        if (this.level % 5 === 0) {
            this.skillPoints++;
        }

        // Track max level
        if (this.level > this.maxLevelReached) {
            this.maxLevelReached = this.level;
        }

        Audio.levelUp();

        // Check achievements
        this.checkLevelAchievements();
    },

    checkSwordLevel: function() {
        // INFINITE SCALING - no level cap!
        while (this.equipment.swordExp >= this.equipment.swordExpToNext) {
            this.equipment.swordExp -= this.equipment.swordExpToNext;
            this.equipment.swordLevel++;

            // Exponential scaling for exp requirement
            this.equipment.swordExpToNext = Math.floor(50 * Math.pow(1.8, this.equipment.swordLevel - 1));

            // Update sword name and rarity based on level
            this.updateSwordTier();

            Audio.levelUp();
        }
    },

    updateSwordTier: function() {
        const level = this.equipment.swordLevel;

        if (level >= 100) {
            this.equipment.swordRarity = 'DIVINE';
            this.equipment.swordName = 'Godslayer Blade';
        } else if (level >= 75) {
            this.equipment.swordRarity = 'MYTHIC';
            this.equipment.swordName = 'Mythic Destroyer';
        } else if (level >= 50) {
            this.equipment.swordRarity = 'LEGENDARY';
            this.equipment.swordName = 'Legendary Excalibur';
        } else if (level >= 35) {
            this.equipment.swordRarity = 'EPIC';
            this.equipment.swordName = 'Epic Flamebrand';
        } else if (level >= 20) {
            this.equipment.swordRarity = 'RARE';
            this.equipment.swordName = 'Rare Frostbite';
        } else if (level >= 10) {
            this.equipment.swordRarity = 'UNCOMMON';
            this.equipment.swordName = 'Tempered Steel';
        } else {
            this.equipment.swordRarity = 'COMMON';
            this.equipment.swordName = 'Iron Sword';
        }
    },

    checkShieldEvolution: function() {
        // INFINITE SCALING - no level cap!
        while (this.equipment.shieldExp >= this.equipment.shieldExpToNext) {
            this.equipment.shieldExp -= this.equipment.shieldExpToNext;
            this.equipment.shieldLevel++;

            // Exponential scaling
            this.equipment.shieldExpToNext = Math.floor(50 * Math.pow(2, this.equipment.shieldLevel - 1));

            // Update shield tier
            this.updateShieldTier();

            Audio.levelUp();
        }
    },

    updateShieldTier: function() {
        const level = this.equipment.shieldLevel;

        if (level >= 100) {
            this.equipment.shieldRarity = 'DIVINE';
            this.equipment.shieldName = 'Divine Aegis';
        } else if (level >= 75) {
            this.equipment.shieldRarity = 'MYTHIC';
            this.equipment.shieldName = 'Mythic Fortress';
        } else if (level >= 50) {
            this.equipment.shieldRarity = 'LEGENDARY';
            this.equipment.shieldName = 'Legendary Bulwark';
        } else if (level >= 35) {
            this.equipment.shieldRarity = 'EPIC';
            this.equipment.shieldName = 'Epic Crystal Guard';
        } else if (level >= 20) {
            this.equipment.shieldRarity = 'RARE';
            this.equipment.shieldName = 'Rare Ironwall';
        } else if (level >= 10) {
            this.equipment.shieldRarity = 'UNCOMMON';
            this.equipment.shieldName = 'Reinforced Shield';
        } else {
            this.equipment.shieldRarity = 'COMMON';
            this.equipment.shieldName = 'Wooden Shield';
        }
    },

    // Spell Learning System
    learnSpell: function(spellName) {
        if (this.learnedSpells.includes(spellName)) return false;
        if (!this.availableSpells.includes(spellName)) return false;

        this.learnedSpells.push(spellName);
        Audio.levelUp();
        return true;
    },

    addSpellProgress: function(spellName, amount) {
        if (this.learnedSpells.includes(spellName)) return;
        if (!this.availableSpells.includes(spellName)) return;

        this.spellProgress[spellName] = (this.spellProgress[spellName] || 0) + amount;

        // Auto-learn when progress reaches 100
        if (this.spellProgress[spellName] >= 100) {
            this.learnSpell(spellName);
            this.spellProgress[spellName] = 0;
        }
    },

    // Skill System
    spendSkillPoint: function(skillName) {
        if (this.skillPoints <= 0) return false;
        if (!this.skills.hasOwnProperty(skillName)) return false;
        if (this.skills[skillName] >= 10) return false; // Max level 10

        this.skills[skillName]++;
        this.skillPoints--;

        // Apply immediate effects
        if (skillName === 'vitality') {
            this.maxHp += 25;
            this.hp += 25;
        }
        if (skillName === 'manaPool') {
            this.maxFairyMana += 20;
        }

        return true;
    },

    // Anizon progression
    onAnizonDefeat: function() {
        console.log('[DEBUG] onAnizonDefeat called. Current defeats:', this.anizonDefeats);
        this.anizonDefeats++;

        // Unlock Anizon friends
        const friends = ['Shadow Warrior', 'Ghost Knight', 'Dark Mage', 'Void Walker', 'Death Knight'];
        if (this.anizonDefeats <= friends.length) {
            const newFriend = friends[this.anizonDefeats - 1];
            this.anizonFriends.push(newFriend);
            console.log('[DEBUG] Unlocked friend:', newFriend);
        }

        // Grant the Anizon Heart Key on first defeat
        if (!this.hasAnizonHeartKey) {
            this.hasAnizonHeartKey = true;
            Fairy.speak("You obtained the Anizon Heart Key! You can now free your mom!");
            console.log('[DEBUG] Granted Anizon Heart Key');
        }

        // Drop special keys
        this.secretKeys += this.anizonDefeats;
        console.log('[DEBUG] Added secret keys. Total:', this.secretKeys);

        // Massive exp and coin reward
        const expReward = 1000 * Math.pow(2, this.anizonDefeats - 1);
        const coinReward = 500 * Math.pow(2, this.anizonDefeats - 1);
        console.log('[DEBUG] Granting rewards - EXP:', expReward, 'Coins:', coinReward);
        this.addExp(expReward);
        this.addCoins(coinReward);
    },

    useSecretKey: function() {
        if (this.secretKeys > 0) {
            this.secretKeys--;
            return true;
        }
        return false;
    },

    checkLevelAchievements: function() {
        if (this.level >= 10 && !this.achievements.includes('level_10')) {
            this.achievements.push('level_10');
        }
        if (this.level >= 50 && !this.achievements.includes('level_50')) {
            this.achievements.push('level_50');
        }
        if (this.level >= 100 && !this.achievements.includes('level_100')) {
            this.achievements.push('level_100');
        }
    },

    addCoins: function(amount) {
        this.coins += amount;
        Audio.coinCollect();
    },

    spendCoins: function(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
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

        // Draw status effect visual
        if (this.statusEffects.length > 0) {
            this.drawStatusEffects(ctx);
        }

        Sprites.drawArcsis(ctx, this.x, this.y, this.direction, this.frame, this.equipment, this.arcsisType);

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

        // Draw sword trail effect
        this.drawSwordTrail(ctx);

        // Draw attack effect
        if (this.attacking) {
            Sprites.drawSlash(ctx, this.x + this.width / 2, this.y + this.height / 2, this.direction, (200 - this.attackCooldown) / 20, this.lastCritical);
        }

        // Draw combo counter
        if (this.comboCount > 1 || this.currentCombo >= 3) {
            this.drawComboCounter(ctx);
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

    drawStatusEffects: function(ctx) {
        this.statusEffects.forEach((effect, index) => {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = effect.color;
            ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        });
        ctx.globalAlpha = 1;
    },

    drawComboCounter: function(ctx) {
        ctx.save();
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        const combo = Math.max(this.currentCombo, this.comboCount);
        ctx.fillText(`${combo}x COMBO!`, this.x + this.width / 2, this.y - 10);
        ctx.restore();
    },

    updateSwordTrail: function() {
        // Add new trail point when attacking or spinning
        if (this.attacking || this.spinning) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            let trailPoint;
            if (this.spinning) {
                // Circular trail for spin attack
                const spinProgress = (800 - this.spinDuration) / 800;
                const angle = spinProgress * Math.PI * 8;
                const radius = 40;
                trailPoint = {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    type: 'spin',
                    age: 0
                };
            } else {
                // Directional trail for normal attacks
                let offsetX = 0, offsetY = 0;
                const range = 35;
                switch (this.direction) {
                    case 'right': offsetX = range; break;
                    case 'left': offsetX = -range; break;
                    case 'up': offsetY = -range; break;
                    case 'down': offsetY = range; break;
                }
                trailPoint = {
                    x: centerX + offsetX,
                    y: centerY + offsetY,
                    type: 'slash',
                    age: 0
                };
            }

            this.swordTrail.push(trailPoint);

            // Limit trail length
            if (this.swordTrail.length > this.maxTrailLength) {
                this.swordTrail.shift();
            }
        }

        // Age and clean up trail points
        this.swordTrail = this.swordTrail.filter(point => {
            point.age++;
            return point.age < 12; // Trail fades over 12 frames
        });
    },

    drawSwordTrail: function(ctx) {
        if (this.swordTrail.length < 2) return;

        ctx.save();

        // Get trail color based on sword rarity
        const rarityColors = {
            'COMMON': '#C0C0C0',
            'UNCOMMON': '#00FF00',
            'RARE': '#0088FF',
            'EPIC': '#9400D3',
            'LEGENDARY': '#FFD700',
            'MYTHIC': '#FF1493',
            'DIVINE': '#FF0000'
        };
        const trailColor = rarityColors[this.equipment.swordRarity] || '#FFFFFF';

        // Draw trail segments with fading effect
        for (let i = 1; i < this.swordTrail.length; i++) {
            const prev = this.swordTrail[i - 1];
            const curr = this.swordTrail[i];

            // Calculate opacity based on age (older = more transparent)
            const avgAge = (prev.age + curr.age) / 2;
            const alpha = Math.max(0, 1 - (avgAge / 12));

            ctx.globalAlpha = alpha * 0.7;
            ctx.strokeStyle = trailColor;
            ctx.lineWidth = 4 - (avgAge / 4);
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();

            // Add glow effect for high-level weapons
            if (this.equipment.swordLevel >= 20) {
                ctx.globalAlpha = alpha * 0.3;
                ctx.lineWidth = 8 - (avgAge / 3);
                ctx.stroke();
            }
        }

        // Draw particles along trail for epic+ weapons
        if (this.equipment.swordLevel >= 35 && this.swordTrail.length > 0) {
            const lastPoint = this.swordTrail[this.swordTrail.length - 1];
            if (lastPoint.age < 3) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 3; i++) {
                    const particleX = lastPoint.x + (Math.random() - 0.5) * 20;
                    const particleY = lastPoint.y + (Math.random() - 0.5) * 20;
                    ctx.fillRect(particleX - 2, particleY - 2, 4, 4);
                }
            }
        }

        ctx.restore();
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
            arcsisType: this.arcsisType,
            hp: this.hp,
            heartHp: this.heartHp,
            maxHp: this.maxHp,
            attack: this.attack,
            defense: this.defense,
            critChance: this.critChance,
            dodgeChance: this.dodgeChance,
            level: this.level,
            exp: this.exp,
            expToNext: this.expToNext,
            equipment: Utils.clone(this.equipment),
            learnedSpells: [...this.learnedSpells],
            spellProgress: Utils.clone(this.spellProgress),
            coins: this.coins,
            keys: this.keys,
            secretKeys: this.secretKeys,
            items: [...this.items],
            potions: Utils.clone(this.potions),
            hasFairy: this.hasFairy,
            fairyMana: this.fairyMana,
            maxFairyMana: this.maxFairyMana,
            maxCombo: this.maxCombo,
            anizonDefeats: this.anizonDefeats,
            anizonFriends: [...this.anizonFriends],
            secretsUnlocked: [...this.secretsUnlocked],
            hasAnizonHeartKey: this.hasAnizonHeartKey,
            skillPoints: this.skillPoints,
            skills: Utils.clone(this.skills),
            achievements: [...this.achievements],
            totalDamageDealt: this.totalDamageDealt,
            totalDamageTaken: this.totalDamageTaken,
            enemiesKilled: this.enemiesKilled,
            bossesDefeated: this.bossesDefeated,
            secretsFound: this.secretsFound,
            maxLevelReached: this.maxLevelReached,
            questFlags: Utils.clone(this.questFlags),
            permanentDeaths: this.permanentDeaths,
            currentUltimate: this.currentUltimate,
            unlockedUltimates: [...this.unlockedUltimates]
        };
    },

    loadSaveData: function(data) {
        Object.assign(this, data);
        this.canUseSpecial = (this.hearts === this.maxHearts);
        this.typeBonuses = CONSTANTS.ARCSIS_TYPES[this.arcsisType].bonuses;
    }
};
