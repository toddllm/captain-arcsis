// Boss System for Captain Arcsis
// Epic boss battles with dialogue and special attacks

class Boss {
    constructor(type) {
        this.type = type;
        this.active = false;
        this.frame = 0;
        this.phase = 1;
        this.attackPattern = 0;
        this.attackTimer = 0;
        this.dialogueQueue = [];
        this.currentDialogue = '';
        this.dialogueTimer = 0;
        this.defeated = false;

        this.setBossStats();
    }

    setBossStats() {
        switch (this.type) {
            case 'anizon':
                // THE UNIVERSITY DESTROYER - FINAL BOSS
                // The strongest, coolest, most powerful boss in the entire game!
                this.name = 'ANIZON - The University Destroyer';
                this.x = 400;
                this.y = 100;
                this.width = 80;
                this.height = 96;
                this.maxHp = 5000; // MASSIVE HP
                this.hp = 5000;
                this.attack = 100; // Devastating damage
                this.defense = 50; // Even strongest armor can't scratch him
                this.phase = 1;
                this.maxPhases = 3;

                // Special abilities
                this.canTeleport = true;
                this.teleportCooldown = 0;
                this.summonCooldown = 0;
                this.summonedHorsemen = [];

                // Insane attack patterns
                this.attacks = [
                    'devastation_beam',
                    'teleport_strike',
                    'horseman_summon',
                    'void_crush',
                    'reality_tear',
                    'death_spiral'
                ];

                this.introDialogue = [
                    "...",
                    "So... you've made it this far.",
                    "I am ANIZON, The University Destroyer!",
                    "Your pathetic weapons cannot harm me!",
                    "Even the strongest armor is NOTHING before my power!",
                    "PREPARE TO BE ERASED FROM EXISTENCE!"
                ];
                break;

            case 'origami_mirda':
                // ORIGAMI MIRDA - Lightning Goddess made of paper
                this.name = 'ORIGAMI MIRDA - Lightning Goddess';
                this.x = 400;
                this.y = 150;
                this.width = 64;
                this.height = 80;
                this.maxHp = 2500;
                this.hp = 2500;
                this.attack = 60;
                this.defense = 30;
                this.phase = 1;
                this.maxPhases = 2;

                this.attacks = [
                    'paper_storm',
                    'lightning_strike',
                    'origami_clones',
                    'thunder_crash',
                    'fold_reality'
                ];

                this.introDialogue = [
                    "Foolish mortal...",
                    "I am Origami Mirda!",
                    "The Lightning Goddess reborn in paper form!",
                    "My paper edges will cut through your defenses!",
                    "Feel the power of a THOUSAND FOLDS!"
                ];
                break;

            default:
                this.name = 'Unknown Boss';
                this.x = 400;
                this.y = 200;
                this.width = 48;
                this.height = 64;
                this.maxHp = 1000;
                this.hp = 1000;
                this.attack = 40;
                this.defense = 20;
                this.attacks = ['basic_attack'];
                this.introDialogue = ["..."];
        }
    }

    activate() {
        this.active = true;
        this.dialogueQueue = [...this.introDialogue];
        Audio.bossAppear();
        Audio.stopMusic();
        setTimeout(() => Audio.startBossMusic(), 1000);
    }

    update(deltaTime, player) {
        if (!this.active || this.defeated) return;

        this.frame++;

        // Handle dialogue first
        if (this.dialogueQueue.length > 0) {
            if (this.dialogueTimer <= 0) {
                this.currentDialogue = this.dialogueQueue.shift();
                this.dialogueTimer = 2500;
            } else {
                this.dialogueTimer -= deltaTime;
            }
            return; // Don't attack during dialogue
        }

        this.currentDialogue = '';

        // Update attack timer
        this.attackTimer += deltaTime;

        // Phase transitions
        const hpPercent = this.hp / this.maxHp;
        if (this.type === 'anizon') {
            if (hpPercent <= 0.3 && this.phase < 3) {
                this.enterPhase(3);
            } else if (hpPercent <= 0.6 && this.phase < 2) {
                this.enterPhase(2);
            }
        } else if (this.type === 'origami_mirda') {
            if (hpPercent <= 0.5 && this.phase < 2) {
                this.enterPhase(2);
            }
        }

        // Execute attacks based on type
        if (this.type === 'anizon') {
            this.updateAnizon(deltaTime, player);
        } else if (this.type === 'origami_mirda') {
            this.updateOrigamiMirda(deltaTime, player);
        }

        // Update summoned horsemen
        if (this.summonedHorsemen) {
            this.summonedHorsemen = this.summonedHorsemen.filter(h => h.alive);
            this.summonedHorsemen.forEach(h => h.update(deltaTime, player));
        }
    }

    enterPhase(newPhase) {
        this.phase = newPhase;
        this.attackTimer = 0;

        if (this.type === 'anizon') {
            if (newPhase === 2) {
                this.dialogueQueue = [
                    "You think you can defeat me?!",
                    "I'll show you TRUE POWER!",
                    "PHASE TWO ACTIVATED!"
                ];
                this.attack *= 1.3;
            } else if (newPhase === 3) {
                this.dialogueQueue = [
                    "IMPOSSIBLE!",
                    "NO ONE HAS EVER PUSHED ME THIS FAR!",
                    "NOW WITNESS MY ULTIMATE FORM!",
                    "THE UNIVERSITY SHALL BE DESTROYED!"
                ];
                this.attack *= 1.5;
                this.defense *= 0.7; // More aggressive, less defensive
            }
        } else if (this.type === 'origami_mirda') {
            if (newPhase === 2) {
                this.dialogueQueue = [
                    "You dare damage my paper form?!",
                    "LIGHTNING WILL CONSUME YOU!"
                ];
                this.attack *= 1.4;
            }
        }
    }

    updateAnizon(deltaTime, player) {
        // Teleport ability
        if (this.canTeleport && this.teleportCooldown <= 0) {
            if (Math.random() < 0.02 * this.phase) {
                this.teleport();
                this.teleportCooldown = 3000 / this.phase;
            }
        } else {
            this.teleportCooldown -= deltaTime;
        }

        // Summon Monster Horsemen
        if (this.summonCooldown <= 0 && this.phase >= 2) {
            if (Math.random() < 0.01) {
                this.summonHorsemen();
                this.summonCooldown = 8000 / this.phase;
            }
        } else {
            this.summonCooldown -= deltaTime;
        }

        // Attack patterns
        if (this.attackTimer >= 2000 / this.phase) {
            this.performAnizonAttack(player);
            this.attackTimer = 0;
        }
    }

    teleport() {
        Audio.teleport();

        // Teleport to random position
        const oldX = this.x;
        const oldY = this.y;

        this.x = Utils.random(100, 600);
        this.y = Utils.random(50, 200);

        Combat.addEffect({
            type: 'teleport_out',
            x: oldX + this.width / 2,
            y: oldY + this.height / 2,
            frame: 0,
            maxFrames: 20
        });

        Combat.addEffect({
            type: 'teleport_in',
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            frame: 0,
            maxFrames: 20
        });
    }

    summonHorsemen() {
        // Summon Monster Horsemen around Anizon
        const numHorsemen = this.phase + 1;

        for (let i = 0; i < numHorsemen; i++) {
            const angle = (i / numHorsemen) * Math.PI * 2;
            const x = this.x + Math.cos(angle) * 100;
            const y = this.y + Math.sin(angle) * 100;

            const horseman = new Enemy(x, y, 'ghost_warrior');
            horseman.maxHp = 80;
            horseman.hp = 80;
            horseman.attack = 35;
            this.summonedHorsemen.push(horseman);
            Enemies.list.push(horseman);
        }

        Combat.addEffect({
            type: 'summon',
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            frame: 0,
            maxFrames: 30
        });
    }

    performAnizonAttack(player) {
        const attackType = this.attacks[Utils.random(0, Math.min(this.phase + 2, this.attacks.length - 1))];

        switch (attackType) {
            case 'devastation_beam':
                // Massive damage beam
                Combat.addEffect({
                    type: 'beam',
                    x: this.x + this.width / 2,
                    y: this.y + this.height,
                    targetX: player.x + player.width / 2,
                    targetY: player.y + player.height / 2,
                    frame: 0,
                    maxFrames: 40,
                    damage: this.attack * 1.5
                });
                player.takeDamage(this.attack * 1.5);
                break;

            case 'teleport_strike':
                this.teleport();
                setTimeout(() => {
                    player.takeDamage(this.attack);
                    Combat.addEffect({
                        type: 'strike',
                        x: player.x + player.width / 2,
                        y: player.y + player.height / 2,
                        frame: 0,
                        maxFrames: 15
                    });
                }, 300);
                break;

            case 'void_crush':
                // Area damage
                Combat.addEffect({
                    type: 'void',
                    x: player.x + player.width / 2,
                    y: player.y + player.height / 2,
                    frame: 0,
                    maxFrames: 50,
                    damage: this.attack * 2
                });
                player.takeDamage(this.attack * 2);
                break;

            case 'reality_tear':
                // Multiple hits
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        player.takeDamage(this.attack * 0.6);
                        Combat.addEffect({
                            type: 'tear',
                            x: player.x + player.width / 2 + Utils.random(-50, 50),
                            y: player.y + player.height / 2 + Utils.random(-50, 50),
                            frame: 0,
                            maxFrames: 20
                        });
                    }, i * 300);
                }
                break;

            case 'death_spiral':
                // Ultimate attack
                Combat.addEffect({
                    type: 'spiral',
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    frame: 0,
                    maxFrames: 60,
                    damage: this.attack * 3
                });
                setTimeout(() => {
                    player.takeDamage(this.attack * 3);
                }, 500);
                break;
        }
    }

    updateOrigamiMirda(deltaTime, player) {
        if (this.attackTimer >= 2500 / this.phase) {
            this.performOrigamiMirdaAttack(player);
            this.attackTimer = 0;
        }
    }

    performOrigamiMirdaAttack(player) {
        const attackType = this.attacks[Utils.random(0, Math.min(this.phase + 2, this.attacks.length - 1))];

        switch (attackType) {
            case 'paper_storm':
                // Rapid paper cuts
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        player.takeDamage(this.attack * 0.3);
                        Combat.addEffect({
                            type: 'paper_cut',
                            x: player.x + Utils.random(-30, 30),
                            y: player.y + Utils.random(-30, 30),
                            frame: 0,
                            maxFrames: 10
                        });
                    }, i * 150);
                }
                break;

            case 'lightning_strike':
                Combat.addEffect({
                    type: 'lightning',
                    x: player.x + player.width / 2,
                    y: 0,
                    targetY: player.y + player.height / 2,
                    frame: 0,
                    maxFrames: 30,
                    damage: this.attack * 1.8
                });
                player.takeDamage(this.attack * 1.8);
                break;

            case 'origami_clones':
                // Create paper clones
                for (let i = 0; i < 3; i++) {
                    const clone = new Enemy(
                        this.x + Utils.random(-100, 100),
                        this.y + Utils.random(50, 150),
                        'ghost_warrior'
                    );
                    clone.maxHp = 50;
                    clone.hp = 50;
                    clone.attack = 25;
                    Enemies.list.push(clone);
                }
                break;

            case 'thunder_crash':
                Combat.addEffect({
                    type: 'thunder',
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    frame: 0,
                    maxFrames: 40
                });
                player.takeDamage(this.attack * 2);
                break;

            case 'fold_reality':
                // Warp attack
                Combat.addEffect({
                    type: 'fold',
                    x: player.x + player.width / 2,
                    y: player.y + player.height / 2,
                    frame: 0,
                    maxFrames: 35
                });
                player.takeDamage(this.attack * 1.5);
                break;
        }
    }

    takeDamage(damage) {
        // Boss has high defense - even strongest weapons struggle!
        const actualDamage = Math.max(1, damage - this.defense);
        this.hp -= actualDamage;

        if (this.hp <= 0) {
            this.hp = 0;
            this.defeat();
        }

        return actualDamage;
    }

    defeat() {
        this.defeated = true;
        Audio.stopMusic();
        Audio.victory();

        if (this.type === 'anizon') {
            this.dialogueQueue = [
                "IMPOSSIBLE... IMPOSSIBLE!!!",
                "How could a mere child defeat ME?!",
                "The University... will... not... fall...",
                "But you... you have proven yourself...",
                "CAPTAIN... ARCSIS..."
            ];
        } else if (this.type === 'origami_mirda') {
            this.dialogueQueue = [
                "My paper form... crumbling...",
                "The lightning... fades...",
                "You have earned this victory..."
            ];
        }
    }

    draw(ctx) {
        if (!this.active) return;

        if (this.type === 'anizon') {
            this.drawAnizon(ctx);
        } else if (this.type === 'origami_mirda') {
            this.drawOrigamiMirda(ctx);
        }

        // Draw health bar
        this.drawBossHealthBar(ctx);

        // Draw dialogue
        if (this.currentDialogue) {
            this.drawBossDialogue(ctx);
        }

        // Draw summoned horsemen
        if (this.summonedHorsemen) {
            this.summonedHorsemen.forEach(h => h.draw(ctx));
        }
    }

    drawAnizon(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Pulsing aura based on phase
        const pulseSize = 20 + Math.sin(this.frame * 0.05) * 10 * this.phase;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = this.phase === 3 ? '#FF0000' : this.phase === 2 ? '#FF6600' : '#9400D3';
        ctx.fillRect(-pulseSize, -pulseSize, this.width + pulseSize * 2, this.height + pulseSize * 2);
        ctx.globalAlpha = 1;

        // Robot/Human-like body
        ctx.fillStyle = '#1C1C1C';
        ctx.fillRect(20, 20, 40, 50); // Core body

        // Head (menacing)
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(24, 0, 32, 24);

        // Glowing red eyes (INTENSE)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(28, 8, 8, 6);
        ctx.fillRect(44, 8, 8, 6);

        // Eye glow effect
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(26, 6, 12, 10);
        ctx.fillRect(42, 6, 12, 10);
        ctx.globalAlpha = 1;

        // Armored shoulders
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(8, 22, 16, 20);
        ctx.fillRect(56, 22, 16, 20);

        // Powerful arms
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(4, 40, 12, 30);
        ctx.fillRect(64, 40, 12, 30);

        // Claws/Hands
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(2, 68, 16, 12);
        ctx.fillRect(62, 68, 16, 12);

        // Legs
        ctx.fillStyle = '#1C1C1C';
        ctx.fillRect(22, 70, 14, 26);
        ctx.fillRect(44, 70, 14, 26);

        // Power core (glowing)
        const coreGlow = Math.abs(Math.sin(this.frame * 0.1));
        ctx.fillStyle = `rgba(255, ${100 + coreGlow * 155}, 0, ${0.5 + coreGlow * 0.5})`;
        ctx.fillRect(32, 35, 16, 16);

        // University destroyer symbol
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(36, 25, 8, 4);
        ctx.fillRect(38, 28, 4, 4);

        // Phase indicators
        if (this.phase >= 2) {
            ctx.strokeStyle = '#FF6600';
            ctx.lineWidth = 2;
            ctx.strokeRect(-5, -5, this.width + 10, this.height + 10);
        }
        if (this.phase >= 3) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.strokeRect(-10, -10, this.width + 20, this.height + 20);
        }

        ctx.restore();
    }

    drawOrigamiMirda(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Paper texture effect
        const flutter = Math.sin(this.frame * 0.08) * 3;

        // Folded paper body (goddess form)
        ctx.fillStyle = CONSTANTS.COLORS.PAPER;
        ctx.fillRect(16 + flutter, 20, 32, 40);

        // Paper folds (geometric patterns)
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.moveTo(16 + flutter, 20);
        ctx.lineTo(32, 35);
        ctx.lineTo(16 + flutter, 50);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(48 + flutter, 20);
        ctx.lineTo(32, 35);
        ctx.lineTo(48 + flutter, 50);
        ctx.fill();

        // Head (origami crane-like)
        ctx.fillStyle = CONSTANTS.COLORS.PAPER;
        ctx.fillRect(20, 0, 24, 24);

        // Lightning patterns
        ctx.fillStyle = CONSTANTS.COLORS.LIGHTNING;
        ctx.fillRect(22, 4, 2, 16);
        ctx.fillRect(40, 4, 2, 16);

        // Glowing eyes
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(26, 8, 4, 4);
        ctx.fillRect(34, 8, 4, 4);

        // Paper wings
        ctx.fillStyle = CONSTANTS.COLORS.PAPER;
        ctx.fillRect(0, 24 - flutter, 16, 32);
        ctx.fillRect(48, 24 + flutter, 16, 32);

        // Lightning crackling
        if (this.frame % 30 < 15) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(32, 0);
            ctx.lineTo(28, 10);
            ctx.lineTo(36, 15);
            ctx.lineTo(30, 25);
            ctx.stroke();
        }

        // Crown (goddess)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(24, -6, 16, 6);
        ctx.fillRect(28, -10, 8, 6);

        ctx.restore();
    }

    drawBossHealthBar(ctx) {
        ctx.save();

        const barWidth = 400;
        const barHeight = 20;
        const barX = (CONSTANTS.CANVAS_WIDTH - barWidth) / 2;
        const barY = 20;

        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

        // Health
        const healthPercent = this.hp / this.maxHp;
        ctx.fillStyle = healthPercent > 0.5 ? '#FF0000' : healthPercent > 0.25 ? '#FF6600' : '#FF00FF';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Boss name
        ctx.font = '14px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, CONSTANTS.CANVAS_WIDTH / 2, barY - 6);

        // Phase indicator
        ctx.fillText(`Phase ${this.phase}/${this.maxPhases || 1}`, CONSTANTS.CANVAS_WIDTH / 2, barY + 36);

        ctx.restore();
    }

    drawBossDialogue(ctx) {
        ctx.save();

        const dialogueBoxWidth = 600;
        const dialogueBoxHeight = 80;
        const dialogueX = (CONSTANTS.CANVAS_WIDTH - dialogueBoxWidth) / 2;
        const dialogueY = CONSTANTS.CANVAS_HEIGHT - dialogueBoxHeight - 20;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(dialogueX, dialogueY, dialogueBoxWidth, dialogueBoxHeight);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(dialogueX, dialogueY, dialogueBoxWidth, dialogueBoxHeight);

        ctx.font = '16px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentDialogue, CONSTANTS.CANVAS_WIDTH / 2, dialogueY + 45);

        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Boss manager
const Bosses = {
    currentBoss: null,

    spawn: function(type) {
        this.currentBoss = new Boss(type);
        return this.currentBoss;
    },

    activate: function() {
        if (this.currentBoss) {
            this.currentBoss.activate();
        }
    },

    update: function(deltaTime, player) {
        if (this.currentBoss && this.currentBoss.active) {
            this.currentBoss.update(deltaTime, player);
        }
    },

    draw: function(ctx) {
        if (this.currentBoss && this.currentBoss.active) {
            this.currentBoss.draw(ctx);
        }
    },

    checkCollisions: function(player) {
        if (!this.currentBoss || !this.currentBoss.active || this.currentBoss.defeated) return;

        // Check player attacks against boss
        if (player.attacking) {
            const attackBox = player.getAttackHitbox();
            if (Utils.collides(attackBox, this.currentBoss.getHitbox())) {
                const damage = player.calculateDamage();
                const actualDamage = this.currentBoss.takeDamage(damage);

                if (actualDamage > 0) {
                    Combat.addDamageNumber(
                        this.currentBoss.x + this.currentBoss.width / 2,
                        this.currentBoss.y,
                        actualDamage
                    );
                }
            }
        }
    },

    clear: function() {
        this.currentBoss = null;
    },

    isDefeated: function() {
        return this.currentBoss && this.currentBoss.defeated;
    }
};
