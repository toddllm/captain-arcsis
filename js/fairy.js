// Fairy Companion for Captain Arcsis
// A magical companion with special powers

const Fairy = {
    x: 0,
    y: 0,
    active: false,
    frame: 0,
    followOffset: { x: 40, y: -20 },
    targetX: 0,
    targetY: 0,

    // Magic abilities
    abilities: {
        heal: { cost: 30, cooldown: 0, maxCooldown: 5000 },
        shield: { cost: 40, cooldown: 0, maxCooldown: 8000 },
        blast: { cost: 25, cooldown: 0, maxCooldown: 3000 },
        light: { cost: 10, cooldown: 0, maxCooldown: 1000 }
    },

    // Dialogue lines
    dialogueLines: [
        "I'll help you, Arcsis!",
        "Be careful! These enemies are tough!",
        "Your sword is getting stronger!",
        "I sense danger ahead...",
        "The dungeon is full of mysteries.",
        "Press F to use my magic!",
        "Your shield is evolving nicely!",
        "Watch out for traps!",
        "I believe in you, Captain!"
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

        // Initial greeting
        this.speak("Hello, Arcsis! I'm a fairy from the enchanted forest. I'll help you escape this dungeon!");
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
        const healAmount = 30 + player.level * 5;
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

        this.speak(`Healing light! +${healAmount} HP!`);
    },

    castBlast: function(player) {
        player.fairyMana -= this.abilities.blast.cost;
        this.abilities.blast.cooldown = this.abilities.blast.maxCooldown;

        Audio.fairyMagic();

        // Damage all nearby enemies
        const blastDamage = 20 + player.level * 3;
        const blastRange = 150;

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

        this.speak("Magic blast!");
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
