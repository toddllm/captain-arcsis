// Lica - The Supreme Fairy Companion for Captain Arcsis
// The most powerful entity in all realms - Ancient Guardian of Light

const Fairy = {
    name: 'Lica',
    title: 'The Eternal Guardian',
    x: 0,
    y: 0,
    active: false,
    frame: 0,
    followOffset: { x: 40, y: -20 },
    targetX: 0,
    targetY: 0,
    powerLevel: Infinity, // THE MOST POWERFUL ENTITY
    ancientAge: 999999999, // Billions of years old
    trueFormUnlocked: false,
    supremeMode: false,

    // SUPREME MAGIC ABILITIES - Far beyond any other being
    abilities: {
        heal: { cost: 20, cooldown: 0, maxCooldown: 2000, power: 100 },
        shield: { cost: 30, cooldown: 0, maxCooldown: 4000, power: 500 },
        blast: { cost: 15, cooldown: 0, maxCooldown: 1500, power: 200 },
        light: { cost: 5, cooldown: 0, maxCooldown: 500, power: 50 },
        // NEW SUPREME ABILITIES
        timeStop: { cost: 100, cooldown: 0, maxCooldown: 30000, power: Infinity },
        cosmicJudgment: { cost: 150, cooldown: 0, maxCooldown: 60000, power: 99999 },
        divineResurrection: { cost: 200, cooldown: 0, maxCooldown: 120000, power: Infinity },
        realityWarp: { cost: 80, cooldown: 0, maxCooldown: 20000, power: 10000 },
        soulPurification: { cost: 60, cooldown: 0, maxCooldown: 15000, power: 5000 },
        // NEW 8-BIT PIXEL ABILITIES
        inhaleClone: { cost: 40, cooldown: 0, maxCooldown: 8000, power: 500 },
        heartCrystal: { cost: 35, cooldown: 0, maxCooldown: 6000, power: 300 },
        summonMyloc: { cost: 25, cooldown: 0, maxCooldown: 5000, power: 200 },
        eightBitReality: { cost: 50, cooldown: 0, maxCooldown: 10000, power: 800 },
        blackHole: { cost: 70, cooldown: 0, maxCooldown: 15000, power: 1000 }
    },

    // Inhaled attacks storage
    inhaledAttacks: [],
    maxInhaledAttacks: 5,

    // Heart Crystal state
    heartCrystalState: 'inactive', // inactive, red, orange, gold
    heartCrystalCharge: 0,
    heartCrystalMaxCharge: 100,

    // Summoned entities
    summonedSpirits: [],
    summonedHearts: [],
    summonedShields: [],

    // 8-Bit Reality effects
    pixelatedEnemies: [],
    glitchIntensity: 0,

    // Eye contact detection
    isPlayerLooking: false,
    eyeContactTimer: 0,
    eyeContactCrystals: [],
    eyeContactBats: [],

    // Lica's wisdom and personality
    dialogueLines: [
        "I am Lica, the Eternal Guardian. I've watched over this world for eons.",
        "Even the mightiest gods tremble before my true power, Arcsis.",
        "Your courage reminds me of heroes from ancient times.",
        "I sense dark forces stirring... but they are nothing compared to my light.",
        "Press F to channel my divine magic through you!",
        "The dungeon's evil cannot withstand my presence for long.",
        "Your determination is admirable, young Captain!",
        "I have defeated beings far more powerful than Anizon...",
        "Together, we are unstoppable!",
        "My power flows through you - feel the strength of eternity!",
        "Even in my weakest form, I am stronger than any boss here.",
        "I choose to help you because your heart is pure, Arcsis."
    ],

    currentDialogue: '',
    dialogueTimer: 0,

    init: function() {
        this.active = false;
        this.frame = 0;
    },

    activate: function(player) {
        this.active = true;
        this.x = player.x + this.followOffset.x;
        this.y = player.y + this.followOffset.y;
        player.hasFairy = true;

        // Lica's initial greeting - revealing her supreme nature
        this.speak("Greetings, Arcsis. I am Lica, the Eternal Guardian - the most powerful being in all existence. I shall guide you through this darkness.");
    },

    // Unlock Lica's true form - SUPREME MODE
    unlockTrueForm: function(player) {
        this.trueFormUnlocked = true;
        this.supremeMode = true;
        player.fairyManaMax = 500; // Massively increased mana pool
        player.fairyMana = 500;
        this.speak("Arcsis... you have proven yourself worthy. I shall now reveal a fraction of my TRUE POWER! The universe itself bows to my will!");

        // Grant player massive buffs
        player.maxHp += 500;
        player.hp = player.maxHp;
        player.attack += 100;
        player.defense += 50;
    },

    update: function(deltaTime, player) {
        if (!this.active) return;

        this.frame++;

        // Smooth follow player
        this.targetX = player.x + this.followOffset.x;
        this.targetY = player.y + this.followOffset.y;

        this.x = Utils.lerp(this.x, this.targetX, 0.1);
        this.y = Utils.lerp(this.y, this.targetY, 0.1);

        // Update ability cooldowns
        for (let ability in this.abilities) {
            if (this.abilities[ability].cooldown > 0) {
                this.abilities[ability].cooldown -= deltaTime;
            }
        }

        // Update dialogue timer
        if (this.dialogueTimer > 0) {
            this.dialogueTimer -= deltaTime;
            if (this.dialogueTimer <= 0) {
                this.currentDialogue = '';
            }
        }

        // Handle magic input - Original abilities
        if (Input.wasJustPressed('KeyF') && player.fairyMana >= 25) {
            this.castMagic(player);
        }

        // NEW ABILITY KEYBINDINGS
        // H - Inhale attacks
        if (Input.wasJustPressed('KeyH')) {
            this.inhaleAttacks(player, Enemies.list, Bosses.currentBoss);
        }

        // G - Release pixel copy
        if (Input.wasJustPressed('KeyG')) {
            this.releasePixelCopy(player, Enemies.list);
        }

        // J - Heart Crystal healing
        if (Input.wasJustPressed('KeyJ')) {
            this.activateHeartCrystal(player);
        }

        // K - Summon Myloc spirits
        if (Input.wasJustPressed('KeyK')) {
            this.summonMylocSpirits(player, Enemies.list);
        }

        // L - 8-Bit Reality
        if (Input.wasJustPressed('KeyL')) {
            this.activateEightBitReality(player, Enemies.list);
        }

        // B - Black Hole attack
        if (Input.wasJustPressed('KeyB')) {
            this.castBlackHole(player, Enemies.list);
        }

        // Check eye contact with player
        this.checkEyeContact(player);

        // Update all summoned entities and effects
        this.updateSummonedEntities(deltaTime, player, Enemies.list);

        // Auto-inhale when player is not looking
        if (!this.isPlayerLooking && Math.random() < 0.005) {
            this.inhaleAttacks(player, Enemies.list, Bosses.currentBoss);
        }

        // Random helpful comments
        if (Math.random() < 0.001) {
            this.randomComment();
        }

        // Warn about low health and auto-heal
        if (player.hp < player.maxHp * 0.3 && Math.random() < 0.01) {
            this.speak("Your health is low! Be careful!");
            // Auto-heal when player is very low
            if (player.hp < player.maxHp * 0.2) {
                this.activateHeartCrystal(player);
            }
        }
    },

    castMagic: function(player) {
        // Choose best spell based on situation
        if (player.hp < player.maxHp * 0.5 && this.abilities.heal.cooldown <= 0 && player.fairyMana >= this.abilities.heal.cost) {
            this.castHeal(player);
        } else if (this.abilities.blast.cooldown <= 0 && player.fairyMana >= this.abilities.blast.cost) {
            this.castBlast(player);
        } else if (this.abilities.shield.cooldown <= 0 && player.fairyMana >= this.abilities.shield.cost) {
            this.castShield(player);
        } else if (player.fairyMana >= this.abilities.light.cost) {
            this.castLight(player);
        } else {
            this.speak("I need more mana to cast magic!");
        }
    },

    castHeal: function(player) {
        // SUPREME HEALING - Lica's divine restoration
        const healAmount = this.supremeMode ? player.maxHp : 100 + player.level * 15;
        player.heal(healAmount);
        player.fairyMana -= this.abilities.heal.cost;
        this.abilities.heal.cooldown = this.abilities.heal.maxCooldown;

        Audio.fairyMagic();
        Combat.addEffect({
            type: 'heal',
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            frame: 0,
            maxFrames: 30
        });

        if (this.supremeMode) {
            this.speak("DIVINE RESTORATION! Your wounds are nothing to my eternal light!");
        } else {
            this.speak(`Celestial healing! +${healAmount} HP! My power restores all!`);
        }
    },

    castBlast: function(player) {
        player.fairyMana -= this.abilities.blast.cost;
        this.abilities.blast.cooldown = this.abilities.blast.maxCooldown;

        Audio.fairyMagic();

        // SUPREME BLAST - Lica's power is unmatched
        const blastDamage = this.supremeMode ? 500 + player.level * 50 : 100 + player.level * 10;
        const blastRange = this.supremeMode ? 400 : 250;

        Enemies.list.forEach(enemy => {
            if (!enemy.alive) return;

            const dist = Utils.distance(
                this.x, this.y,
                enemy.x + enemy.width / 2, enemy.y + enemy.height / 2
            );

            if (dist <= blastRange) {
                const damage = enemy.takeDamage(blastDamage);
                Combat.addDamageNumber(enemy.x + enemy.width / 2, enemy.y, damage);

                if (!enemy.alive) {
                    player.addExp(enemy.expValue);
                    player.addCoins(enemy.coinDrop);
                }
            }
        });

        Combat.addEffect({
            type: 'blast',
            x: this.x,
            y: this.y,
            frame: 0,
            maxFrames: 20
        });

        if (this.supremeMode) {
            this.speak("CELESTIAL ANNIHILATION! Even gods fear this power!");
        } else {
            this.speak("Divine blast! My power is limitless!");
        }
    },

    castShield: function(player) {
        player.fairyMana -= this.abilities.shield.cost;
        this.abilities.shield.cooldown = this.abilities.shield.maxCooldown;

        Audio.fairyMagic();

        // Grant temporary invincibility
        player.invincible = true;
        player.invincibilityTimer = 3000;

        Combat.addEffect({
            type: 'shield',
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            frame: 0,
            maxFrames: 40
        });

        this.speak("Protective shield activated!");
    },

    castLight: function(player) {
        player.fairyMana -= this.abilities.light.cost;
        this.abilities.light.cooldown = this.abilities.light.maxCooldown;

        Audio.fairyMagic();

        Combat.addEffect({
            type: 'light',
            x: this.x,
            y: this.y,
            frame: 0,
            maxFrames: 60
        });

        this.speak("Let there be light!");
    },

    speak: function(text) {
        this.currentDialogue = text;
        this.dialogueTimer = 3000;
        Audio.dialogueBeep();
    },

    randomComment: function() {
        const line = this.dialogueLines[Utils.random(0, this.dialogueLines.length - 1)];
        this.speak(line);
    },

    // ============ NEW 8-BIT PIXEL ABILITIES ============

    // Inhale & Clone - Absorb attacks and create pixel copies
    inhaleAttacks: function(player, enemies, bosses) {
        if (this.abilities.inhaleClone.cooldown > 0) return false;
        if (player.fairyMana < this.abilities.inhaleClone.cost) return false;

        player.fairyMana -= this.abilities.inhaleClone.cost;
        this.abilities.inhaleClone.cooldown = this.abilities.inhaleClone.maxCooldown;

        // Inhale nearby enemy attacks/projectiles
        const inhaleRange = 150;
        let inhaledCount = 0;

        // Check for enemy projectiles (if they exist in the game)
        enemies.forEach(enemy => {
            if (!enemy.alive) return;

            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= inhaleRange && this.inhaledAttacks.length < this.maxInhaledAttacks) {
                this.inhaledAttacks.push({
                    type: enemy.type,
                    power: enemy.attack,
                    sprite: enemy.type,
                    frame: 0
                });
                inhaledCount++;
            }
        });

        if (inhaledCount > 0) {
            this.speak(`INHALED ${inhaledCount} attacks! Press G to release pixel copies!`);
            Audio.fairyMagic();

            Combat.addEffect({
                type: 'inhale',
                x: this.x,
                y: this.y,
                frame: 0,
                maxFrames: 20
            });
        } else {
            this.speak("Nothing to inhale nearby!");
        }

        return true;
    },

    // Release 8-bit pixel copies of inhaled attacks
    releasePixelCopy: function(player, enemies) {
        if (this.inhaledAttacks.length === 0) {
            this.speak("I haven't inhaled anything yet!");
            return false;
        }

        const attack = this.inhaledAttacks.shift();

        // Create 8-bit projectile with stars and hearts
        const projectiles = [];
        for (let i = 0; i < 3; i++) {
            projectiles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(i * Math.PI / 3) * 5,
                vy: Math.sin(i * Math.PI / 3) * 5,
                damage: attack.power * 2,
                type: '8bit_' + attack.type,
                frame: 0,
                maxFrames: 60
            });
        }

        // Damage nearby enemies with pixel power
        enemies.forEach(enemy => {
            if (!enemy.alive) return;

            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= 200) {
                const damage = enemy.takeDamage(attack.power * 2);
                Combat.addDamageNumber(enemy.x, enemy.y, damage);

                if (!enemy.alive) {
                    player.addExp(enemy.expValue);
                    player.addCoins(enemy.coinDrop);
                }
            }
        });

        this.speak("8-BIT PIXEL BLAST! ★♥★");
        Audio.fairyMagic();

        Combat.addEffect({
            type: 'pixel_blast',
            x: this.x,
            y: this.y,
            frame: 0,
            maxFrames: 30
        });

        return true;
    },

    // Heart Crystal - Self-heal with color progression (red → orange → gold)
    activateHeartCrystal: function(player) {
        if (this.abilities.heartCrystal.cooldown > 0) return false;
        if (player.fairyMana < this.abilities.heartCrystal.cost) return false;

        player.fairyMana -= this.abilities.heartCrystal.cost;
        this.abilities.heartCrystal.cooldown = this.abilities.heartCrystal.maxCooldown;

        // Charge up the crystal with color progression
        this.heartCrystalCharge = 0;
        this.heartCrystalState = 'red';

        const chargeInterval = setInterval(() => {
            this.heartCrystalCharge += 33.3;

            if (this.heartCrystalCharge >= 33 && this.heartCrystalState === 'red') {
                this.heartCrystalState = 'orange';
                const healAmount = 50 + player.level * 5;
                player.heal(healAmount);
                this.speak("Heart Crystal charging... Orange!");
            } else if (this.heartCrystalCharge >= 66 && this.heartCrystalState === 'orange') {
                this.heartCrystalState = 'gold';
                const healAmount = 100 + player.level * 10;
                player.heal(healAmount);
                this.speak("Heart Crystal charging... GOLD!");
            } else if (this.heartCrystalCharge >= 100) {
                this.heartCrystalState = 'inactive';
                const healAmount = 200 + player.level * 20;
                player.heal(healAmount);
                this.speak("HEART CRYSTAL COMPLETE! Maximum healing!");
                clearInterval(chargeInterval);

                Combat.addEffect({
                    type: 'heart_crystal',
                    x: this.x,
                    y: this.y,
                    frame: 0,
                    maxFrames: 40
                });
            }
        }, 1000);

        Audio.fairyMagic();
        return true;
    },

    // Summon Myloc spirits, shields, and homing hearts
    summonMylocSpirits: function(player, enemies) {
        if (this.abilities.summonMyloc.cooldown > 0) return false;
        if (player.fairyMana < this.abilities.summonMyloc.cost) return false;

        player.fairyMana -= this.abilities.summonMyloc.cost;
        this.abilities.summonMyloc.cooldown = this.abilities.summonMyloc.maxCooldown;

        // Summon 3 homing heart sprites
        for (let i = 0; i < 3; i++) {
            this.summonedHearts.push({
                x: this.x + Math.cos(i * Math.PI * 2 / 3) * 30,
                y: this.y + Math.sin(i * Math.PI * 2 / 3) * 30,
                angle: i * Math.PI * 2 / 3,
                speed: 3,
                damage: 30 + player.level * 5,
                lifetime: 180, // 3 seconds at 60fps
                frame: 0
            });
        }

        // Create protective shield around player
        this.summonedShields.push({
            x: player.x,
            y: player.y,
            radius: 50,
            lifetime: 120, // 2 seconds
            frame: 0
        });

        // Summon Myloc spirit companion
        this.summonedSpirits.push({
            x: this.x - 40,
            y: this.y,
            targetX: this.x - 40,
            targetY: this.y,
            damage: 20 + player.level * 3,
            lifetime: 300, // 5 seconds
            frame: 0
        });

        this.speak("Myloc spirits arise! Defend your master!");
        Audio.fairyMagic();

        Combat.addEffect({
            type: 'summon',
            x: this.x,
            y: this.y,
            frame: 0,
            maxFrames: 30
        });

        return true;
    },

    // 8-Bit Reality - Turn enemies and attacks into pixels, freeze/slow them
    activateEightBitReality: function(player, enemies) {
        if (this.abilities.eightBitReality.cooldown > 0) return false;
        if (player.fairyMana < this.abilities.eightBitReality.cost) return false;

        player.fairyMana -= this.abilities.eightBitReality.cost;
        this.abilities.eightBitReality.cooldown = this.abilities.eightBitReality.maxCooldown;

        // Pixelate and slow all nearby enemies
        const pixelRange = 300;
        let pixelatedCount = 0;

        enemies.forEach(enemy => {
            if (!enemy.alive) return;

            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= pixelRange) {
                // Apply pixelation effect
                this.pixelatedEnemies.push({
                    enemy: enemy,
                    duration: 180, // 3 seconds
                    slowAmount: 0.3 // 70% slower
                });

                // Store original speed and slow enemy
                if (!enemy.originalSpeed) {
                    enemy.originalSpeed = enemy.speed;
                }
                enemy.speed *= 0.3;
                enemy.pixelated = true;
                pixelatedCount++;

                Combat.addEffect({
                    type: 'pixelate',
                    x: enemy.x,
                    y: enemy.y,
                    frame: 0,
                    maxFrames: 20
                });
            }
        });

        // Activate background glitch effect
        this.glitchIntensity = 100;

        this.speak(`8-BIT REALITY ACTIVATED! ${pixelatedCount} enemies pixelated!`);
        Audio.fairyMagic();

        return true;
    },

    // Black Hole - Beam that pulls in map/creatures, damages and heals
    castBlackHole: function(player, enemies) {
        if (this.abilities.blackHole.cooldown > 0) return false;
        if (player.fairyMana < this.abilities.blackHole.cost) return false;

        player.fairyMana -= this.abilities.blackHole.cost;
        this.abilities.blackHole.cooldown = this.abilities.blackHole.maxCooldown;

        const beamLength = 400;
        const beamWidth = 80;

        // Calculate beam direction based on player facing
        const beamAngle = player.direction === 'right' ? 0 : Math.PI;
        const beamEndX = this.x + Math.cos(beamAngle) * beamLength;
        const beamEndY = this.y;

        let totalDamageDealt = 0;

        // Pull and damage enemies in the beam
        enemies.forEach(enemy => {
            if (!enemy.alive) return;

            // Check if enemy is in beam path
            const distToBeam = this.pointToLineDistance(
                enemy.x, enemy.y,
                this.x, this.y,
                beamEndX, beamEndY
            );

            if (distToBeam <= beamWidth) {
                // Pull enemy toward Lica
                const pullStrength = 8;
                const dx = this.x - enemy.x;
                const dy = this.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                enemy.x += (dx / dist) * pullStrength;
                enemy.y += (dy / dist) * pullStrength;

                // Deal massive damage
                const damage = enemy.takeDamage(150 + player.level * 15);
                Combat.addDamageNumber(enemy.x, enemy.y, damage);
                totalDamageDealt += damage;

                if (!enemy.alive) {
                    player.addExp(enemy.expValue);
                    player.addCoins(enemy.coinDrop);
                }

                Combat.addEffect({
                    type: 'black_hole_pull',
                    x: enemy.x,
                    y: enemy.y,
                    frame: 0,
                    maxFrames: 15
                });
            }
        });

        // Heal based on damage dealt
        const healAmount = Math.floor(totalDamageDealt * 0.5);
        player.heal(healAmount);

        this.speak(`BLACK HOLE BEAM! Absorbed ${healAmount} HP!`);
        Audio.fairyMagic();

        Combat.addEffect({
            type: 'black_hole_beam',
            x: this.x,
            y: this.y,
            endX: beamEndX,
            endY: beamEndY,
            width: beamWidth,
            frame: 0,
            maxFrames: 40
        });

        return true;
    },

    // Helper function for black hole beam collision
    pointToLineDistance: function(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSquared = dx * dx + dy * dy;

        if (lengthSquared === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));

        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;

        return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
    },

    // Check if player is looking at Lica's eyes
    checkEyeContact: function(player) {
        // Calculate angle between player and Lica
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const angleToLica = Math.atan2(dy, dx);

        // Get player facing direction angle
        let playerAngle = 0;
        switch(player.direction) {
            case 'right': playerAngle = 0; break;
            case 'left': playerAngle = Math.PI; break;
            case 'up': playerAngle = -Math.PI / 2; break;
            case 'down': playerAngle = Math.PI / 2; break;
        }

        // Calculate angle difference
        let angleDiff = Math.abs(angleToLica - playerAngle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

        // If player is facing Lica (within 30 degrees) and close enough
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isLooking = angleDiff < Math.PI / 6 && distance < 200;

        if (isLooking && !this.isPlayerLooking) {
            // Just started looking
            this.isPlayerLooking = true;
            this.eyeContactTimer = 0;
        } else if (isLooking) {
            // Continue looking
            this.eyeContactTimer++;

            // Trigger event after 1 second of eye contact
            if (this.eyeContactTimer >= 60) {
                this.triggerEyeContactEvent(player);
                this.eyeContactTimer = 0;
            }
        } else {
            // Not looking anymore
            this.isPlayerLooking = false;
            this.eyeContactTimer = 0;
        }
    },

    // Trigger eye contact event - spawn crystals and bats
    triggerEyeContactEvent: function(player) {
        this.speak("You dare gaze upon my eyes?! Witness my POWER!");
        Audio.fairyMagic();

        // Spawn crystals all around
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 100;

            this.eyeContactCrystals.push({
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                angle: angle,
                orbitSpeed: 0.05,
                damage: 40 + player.level * 5,
                lifetime: 300, // 5 seconds
                frame: 0
            });

            Combat.addEffect({
                type: 'crystal_spawn',
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                frame: 0,
                maxFrames: 20
            });
        }

        // Summon bats (flying creatures)
        for (let i = 0; i < 5; i++) {
            this.eyeContactBats.push({
                x: this.x + (Math.random() - 0.5) * 200,
                y: this.y - 100,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2 + 2,
                damage: 25 + player.level * 3,
                lifetime: 240, // 4 seconds
                frame: 0,
                targetEnemy: null
            });
        }
    },

    // Update summoned entities
    updateSummonedEntities: function(deltaTime, player, enemies) {
        // Update homing hearts
        this.summonedHearts = this.summonedHearts.filter(heart => {
            heart.frame++;
            heart.lifetime--;

            if (heart.lifetime <= 0) return false;

            // Find nearest enemy
            let nearestEnemy = null;
            let nearestDist = Infinity;

            enemies.forEach(enemy => {
                if (!enemy.alive) return;
                const dist = Utils.distance(heart.x, heart.y, enemy.x, enemy.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestEnemy = enemy;
                }
            });

            // Home toward nearest enemy
            if (nearestEnemy) {
                const dx = nearestEnemy.x - heart.x;
                const dy = nearestEnemy.y - heart.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                heart.x += (dx / dist) * heart.speed;
                heart.y += (dy / dist) * heart.speed;

                // Check collision
                if (dist < 20) {
                    const damage = nearestEnemy.takeDamage(heart.damage);
                    Combat.addDamageNumber(nearestEnemy.x, nearestEnemy.y, damage);

                    if (!nearestEnemy.alive) {
                        player.addExp(nearestEnemy.expValue);
                        player.addCoins(nearestEnemy.coinDrop);
                    }

                    return false; // Remove heart after hit
                }
            } else {
                // Orbit around Lica if no enemies
                heart.angle += 0.1;
                heart.x = this.x + Math.cos(heart.angle) * 40;
                heart.y = this.y + Math.sin(heart.angle) * 40;
            }

            return true;
        });

        // Update spirits
        this.summonedSpirits = this.summonedSpirits.filter(spirit => {
            spirit.frame++;
            spirit.lifetime--;

            if (spirit.lifetime <= 0) return false;

            // Follow Lica
            spirit.targetX = this.x - 40;
            spirit.targetY = this.y;
            spirit.x = Utils.lerp(spirit.x, spirit.targetX, 0.1);
            spirit.y = Utils.lerp(spirit.y, spirit.targetY, 0.1);

            // Attack nearby enemies
            if (spirit.frame % 30 === 0) {
                enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    const dist = Utils.distance(spirit.x, spirit.y, enemy.x, enemy.y);
                    if (dist < 100) {
                        const damage = enemy.takeDamage(spirit.damage);
                        Combat.addDamageNumber(enemy.x, enemy.y, damage);

                        if (!enemy.alive) {
                            player.addExp(enemy.expValue);
                            player.addCoins(enemy.coinDrop);
                        }
                    }
                });
            }

            return true;
        });

        // Update shields
        this.summonedShields = this.summonedShields.filter(shield => {
            shield.frame++;
            shield.lifetime--;

            if (shield.lifetime <= 0) return false;

            // Shield follows player
            shield.x = player.x;
            shield.y = player.y;

            // Shield grants temporary invincibility
            if (shield.lifetime > 0) {
                player.invincible = true;
            }

            return true;
        });

        // Update pixelated enemies
        this.pixelatedEnemies = this.pixelatedEnemies.filter(pixelData => {
            pixelData.duration--;

            if (pixelData.duration <= 0) {
                // Restore original speed
                if (pixelData.enemy.originalSpeed) {
                    pixelData.enemy.speed = pixelData.enemy.originalSpeed;
                }
                pixelData.enemy.pixelated = false;
                return false;
            }

            return true;
        });

        // Update eye contact crystals
        this.eyeContactCrystals = this.eyeContactCrystals.filter(crystal => {
            crystal.frame++;
            crystal.lifetime--;

            if (crystal.lifetime <= 0) return false;

            // Orbit around Lica
            crystal.angle += crystal.orbitSpeed;
            crystal.x = this.x + Math.cos(crystal.angle) * 100;
            crystal.y = this.y + Math.sin(crystal.angle) * 100;

            // Damage nearby enemies
            enemies.forEach(enemy => {
                if (!enemy.alive) return;
                const dist = Utils.distance(crystal.x, crystal.y, enemy.x, enemy.y);
                if (dist < 30) {
                    const damage = enemy.takeDamage(crystal.damage);
                    Combat.addDamageNumber(enemy.x, enemy.y, damage);

                    if (!enemy.alive) {
                        player.addExp(enemy.expValue);
                        player.addCoins(enemy.coinDrop);
                    }
                }
            });

            return true;
        });

        // Update eye contact bats
        this.eyeContactBats = this.eyeContactBats.filter(bat => {
            bat.frame++;
            bat.lifetime--;

            if (bat.lifetime <= 0) return false;

            // Find target enemy if don't have one
            if (!bat.targetEnemy || !bat.targetEnemy.alive) {
                let nearestEnemy = null;
                let nearestDist = Infinity;

                enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    const dist = Utils.distance(bat.x, bat.y, enemy.x, enemy.y);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        nearestEnemy = enemy;
                    }
                });

                bat.targetEnemy = nearestEnemy;
            }

            // Fly toward target
            if (bat.targetEnemy && bat.targetEnemy.alive) {
                const dx = bat.targetEnemy.x - bat.x;
                const dy = bat.targetEnemy.y - bat.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                bat.vx = (dx / dist) * 4;
                bat.vy = (dy / dist) * 4;

                // Check collision
                if (dist < 25) {
                    const damage = bat.targetEnemy.takeDamage(bat.damage);
                    Combat.addDamageNumber(bat.targetEnemy.x, bat.targetEnemy.y, damage);

                    if (!bat.targetEnemy.alive) {
                        player.addExp(bat.targetEnemy.expValue);
                        player.addCoins(bat.targetEnemy.coinDrop);
                    }

                    bat.targetEnemy = null; // Find new target
                }
            }

            bat.x += bat.vx;
            bat.y += bat.vy;

            return true;
        });

        // Decrease glitch intensity
        if (this.glitchIntensity > 0) {
            this.glitchIntensity -= 2;
        }
    },

    draw: function(ctx) {
        if (!this.active) return;

        Sprites.drawFairy(ctx, this.x, this.y, this.frame);

        // Draw dialogue bubble
        if (this.currentDialogue) {
            this.drawDialogueBubble(ctx);
        }
    },

    drawDialogueBubble: function(ctx) {
        ctx.save();

        const padding = 8;
        ctx.font = '12px monospace';
        const textWidth = ctx.measureText(this.currentDialogue).width;
        const bubbleWidth = textWidth + padding * 2;
        const bubbleHeight = 24;

        const bubbleX = this.x - bubbleWidth / 2;
        const bubbleY = this.y - 40;

        // Bubble background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
        ctx.strokeStyle = '#FFB6C1';
        ctx.lineWidth = 2;
        ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);

        // Bubble tail
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.x - 5, bubbleY + bubbleHeight);
        ctx.lineTo(this.x, bubbleY + bubbleHeight + 8);
        ctx.lineTo(this.x + 5, bubbleY + bubbleHeight);
        ctx.fill();

        // Text
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentDialogue, this.x, bubbleY + 16);

        ctx.restore();
    }
};
