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
        soulPurification: { cost: 60, cooldown: 0, maxCooldown: 15000, power: 5000 }
    },

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

        // Handle magic input
        if (Input.wasJustPressed('KeyF') && player.fairyMana >= 25) {
            this.castMagic(player);
        }

        // Random helpful comments
        if (Math.random() < 0.001) {
            this.randomComment();
        }

        // Warn about low health
        if (player.hp < player.maxHp * 0.3 && Math.random() < 0.01) {
            this.speak("Your health is low! Be careful!");
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
