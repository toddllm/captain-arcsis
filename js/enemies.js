// Enemy System for Captain Arcsis
// Even the weakest enemies are tough!

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 40;
        this.frame = 0;
        this.alive = true;
        this.hitStun = 0;
        this.attackCooldown = 0;
        this.state = 'patrol'; // patrol, chase, attack, stunned
        this.patrolDirection = 1;
        this.patrolTimer = 0;

        // Set stats based on type - ALL ENEMIES ARE TOUGH
        this.setStats();
    }

    setStats() {
        switch (this.type) {
            case 'skeleton_knight':
                // Very tough! Heavy armor, strong attacks
                this.maxHp = 150;
                this.hp = 150;
                this.attack = 25;
                this.defense = 15;
                this.speed = 1.5;
                this.expValue = 80;
                this.coinDrop = 25;
                this.aggroRange = 180;
                this.attackRange = 50;
                this.attackCooldownMax = 2000;
                break;

            case 'zombie':
                // Tough and persistent! Won't stay down easily
                this.maxHp = 120;
                this.hp = 120;
                this.attack = 20;
                this.defense = 10;
                this.speed = 1;
                this.expValue = 60;
                this.coinDrop = 15;
                this.aggroRange = 150;
                this.attackRange = 40;
                this.attackCooldownMax = 1500;
                this.regenRate = 0.5; // Zombies slowly regenerate!
                break;

            case 'dark_slime':
                // Even slimes are dangerous here!
                this.maxHp = 80;
                this.hp = 80;
                this.attack = 15;
                this.defense = 8;
                this.speed = 2;
                this.expValue = 40;
                this.coinDrop = 10;
                this.aggroRange = 120;
                this.attackRange = 35;
                this.attackCooldownMax = 1200;
                break;

            case 'ghost_warrior':
                // Can phase through attacks sometimes!
                this.maxHp = 100;
                this.hp = 100;
                this.attack = 30;
                this.defense = 5;
                this.speed = 2.5;
                this.expValue = 70;
                this.coinDrop = 20;
                this.aggroRange = 200;
                this.attackRange = 45;
                this.attackCooldownMax = 1800;
                this.phaseChance = 0.3;
                break;

            case 'dungeon_bat':
                // Fast and annoying!
                this.maxHp = 60;
                this.hp = 60;
                this.attack = 12;
                this.defense = 3;
                this.speed = 3.5;
                this.expValue = 30;
                this.coinDrop = 8;
                this.aggroRange = 250;
                this.attackRange = 30;
                this.attackCooldownMax = 800;
                this.width = 24;
                this.height = 24;
                break;

            case 'armored_golem':
                // Tank enemy - super tough!
                this.maxHp = 250;
                this.hp = 250;
                this.attack = 35;
                this.defense = 25;
                this.speed = 0.8;
                this.expValue = 120;
                this.coinDrop = 40;
                this.aggroRange = 140;
                this.attackRange = 55;
                this.attackCooldownMax = 3000;
                this.width = 48;
                this.height = 56;
                break;

            // CRYSTAL CAVERNS ENEMIES
            case 'crystal_spider':
                // Fast and deadly!
                this.maxHp = 90;
                this.hp = 90;
                this.attack = 22;
                this.defense = 12;
                this.speed = 3;
                this.expValue = 65;
                this.coinDrop = 18;
                this.aggroRange = 200;
                this.attackRange = 35;
                this.attackCooldownMax = 1000;
                this.width = 36;
                this.height = 28;
                break;

            case 'crystal_elemental':
                // High defense, reflects damage!
                this.maxHp = 180;
                this.hp = 180;
                this.attack = 28;
                this.defense = 30;
                this.speed = 1.2;
                this.expValue = 100;
                this.coinDrop = 35;
                this.aggroRange = 160;
                this.attackRange = 50;
                this.attackCooldownMax = 2200;
                this.reflectChance = 0.2;
                break;

            case 'gem_golem':
                // Even tougher than armored golem!
                this.maxHp = 300;
                this.hp = 300;
                this.attack = 45;
                this.defense = 35;
                this.speed = 0.6;
                this.expValue = 150;
                this.coinDrop = 60;
                this.aggroRange = 120;
                this.attackRange = 60;
                this.attackCooldownMax = 3500;
                this.width = 52;
                this.height = 60;
                break;

            // SHADOW REALM ENEMIES
            case 'shadow_assassin':
                // Can teleport behind you!
                this.maxHp = 110;
                this.hp = 110;
                this.attack = 40;
                this.defense = 8;
                this.speed = 4;
                this.expValue = 90;
                this.coinDrop = 30;
                this.aggroRange = 250;
                this.attackRange = 40;
                this.attackCooldownMax = 1600;
                this.canTeleport = true;
                this.teleportCooldown = 0;
                break;

            case 'void_wraith':
                // Drains life!
                this.maxHp = 140;
                this.hp = 140;
                this.attack = 35;
                this.defense = 12;
                this.speed = 2.2;
                this.expValue = 95;
                this.coinDrop = 28;
                this.aggroRange = 180;
                this.attackRange = 45;
                this.attackCooldownMax = 1400;
                this.lifeDrain = 0.3; // Heals 30% of damage dealt
                break;

            case 'nightmare_beast':
                // Huge and terrifying!
                this.maxHp = 350;
                this.hp = 350;
                this.attack = 55;
                this.defense = 20;
                this.speed = 1.5;
                this.expValue = 180;
                this.coinDrop = 70;
                this.aggroRange = 200;
                this.attackRange = 70;
                this.attackCooldownMax = 2800;
                this.width = 56;
                this.height = 64;
                break;

            // SKY CITADEL ENEMIES
            case 'wind_elemental':
                // Super fast, pushes player back!
                this.maxHp = 100;
                this.hp = 100;
                this.attack = 25;
                this.defense = 10;
                this.speed = 4.5;
                this.expValue = 85;
                this.coinDrop = 25;
                this.aggroRange = 220;
                this.attackRange = 50;
                this.attackCooldownMax = 900;
                this.pushBack = true;
                break;

            case 'thunder_knight':
                // Lightning attacks!
                this.maxHp = 200;
                this.hp = 200;
                this.attack = 50;
                this.defense = 22;
                this.speed = 1.8;
                this.expValue = 130;
                this.coinDrop = 45;
                this.aggroRange = 180;
                this.attackRange = 55;
                this.attackCooldownMax = 2000;
                this.chainLightning = true;
                break;

            case 'sky_dragon':
                // Mini boss level enemy!
                this.maxHp = 500;
                this.hp = 500;
                this.attack = 70;
                this.defense = 40;
                this.speed = 2.5;
                this.expValue = 250;
                this.coinDrop = 100;
                this.aggroRange = 300;
                this.attackRange = 80;
                this.attackCooldownMax = 2500;
                this.width = 64;
                this.height = 72;
                this.fireBreath = true;
                break;

            // FOREST ENEMIES - Starting area dangers!
            case 'forest_wolf':
                // Fast and vicious forest predator
                this.maxHp = 70;
                this.hp = 70;
                this.attack = 18;
                this.defense = 6;
                this.speed = 3.2;
                this.expValue = 35;
                this.coinDrop = 12;
                this.aggroRange = 200;
                this.attackRange = 35;
                this.attackCooldownMax = 1100;
                this.packHunter = true; // Stronger when near other wolves
                break;

            case 'corrupted_sprite':
                // Twisted forest spirit
                this.maxHp = 50;
                this.hp = 50;
                this.attack = 25;
                this.defense = 4;
                this.speed = 4;
                this.expValue = 45;
                this.coinDrop = 20;
                this.aggroRange = 180;
                this.attackRange = 40;
                this.attackCooldownMax = 900;
                this.magicDamage = true;
                this.width = 24;
                this.height = 24;
                break;

            case 'wild_boar':
                // Charges at you!
                this.maxHp = 100;
                this.hp = 100;
                this.attack = 30;
                this.defense = 12;
                this.speed = 2.8;
                this.expValue = 50;
                this.coinDrop = 18;
                this.aggroRange = 160;
                this.attackRange = 45;
                this.attackCooldownMax = 2000;
                this.chargeAttack = true;
                this.width = 40;
                this.height = 32;
                break;

            case 'forest_spider':
                // Venomous and sneaky
                this.maxHp = 45;
                this.hp = 45;
                this.attack = 15;
                this.defense = 5;
                this.speed = 2.5;
                this.expValue = 30;
                this.coinDrop = 10;
                this.aggroRange = 140;
                this.attackRange = 30;
                this.attackCooldownMax = 800;
                this.poisonous = true;
                this.width = 28;
                this.height = 20;
                break;

            default:
                // Default tough enemy
                this.maxHp = 100;
                this.hp = 100;
                this.attack = 18;
                this.defense = 10;
                this.speed = 1.5;
                this.expValue = 50;
                this.coinDrop = 12;
                this.aggroRange = 160;
                this.attackRange = 40;
                this.attackCooldownMax = 1500;
        }
    }

    update(deltaTime, player) {
        if (!this.alive) return;

        this.frame++;

        // Update timers
        if (this.hitStun > 0) {
            this.hitStun -= deltaTime;
            return;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }

        // Zombie regeneration
        if (this.type === 'zombie' && this.regenRate) {
            this.hp = Math.min(this.maxHp, this.hp + this.regenRate * deltaTime * 0.001);
        }

        // AI behavior
        const distToPlayer = Utils.distance(
            this.x + this.width / 2,
            this.y + this.height / 2,
            player.x + player.width / 2,
            player.y + player.height / 2
        );

        if (distToPlayer <= this.attackRange && this.attackCooldown <= 0) {
            this.state = 'attack';
            this.performAttack(player);
        } else if (distToPlayer <= this.aggroRange) {
            this.state = 'chase';
            this.chasePlayer(player);
        } else {
            this.state = 'patrol';
            this.patrol();
        }
    }

    patrol() {
        this.patrolTimer++;

        if (this.patrolTimer > 120) {
            this.patrolTimer = 0;
            this.patrolDirection *= -1;
        }

        this.x += this.speed * 0.5 * this.patrolDirection;
    }

    chasePlayer(player) {
        const angle = Utils.angle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            player.x + player.width / 2,
            player.y + player.height / 2
        );

        const dir = Utils.angleToVector(angle);
        this.x += dir.x * this.speed;
        this.y += dir.y * this.speed;
    }

    performAttack(player) {
        this.attackCooldown = this.attackCooldownMax;

        // Check if player is in range
        const enemyHitbox = this.getHitbox();
        const playerHitbox = player.getHitbox();

        if (Utils.distance(
            enemyHitbox.x + enemyHitbox.width / 2,
            enemyHitbox.y + enemyHitbox.height / 2,
            playerHitbox.x + playerHitbox.width / 2,
            playerHitbox.y + playerHitbox.height / 2
        ) <= this.attackRange + 20) {
            return this.attack; // Return damage to be dealt
        }

        return 0;
    }

    takeDamage(damage) {
        // Ghost warriors can phase through attacks
        if (this.type === 'ghost_warrior' && this.phaseChance && Math.random() < this.phaseChance) {
            return 0; // Phased through!
        }

        const actualDamage = Math.max(1, damage - this.defense);
        this.hp -= actualDamage;
        this.hitStun = 300;

        if (this.hp <= 0) {
            this.die();
            return actualDamage;
        }

        Audio.swordHit();
        return actualDamage;
    }

    die() {
        this.alive = false;
        Audio.enemyDeath();
    }

    draw(ctx) {
        if (!this.alive) return;

        switch (this.type) {
            case 'skeleton_knight':
                Sprites.drawSkeletonKnight(ctx, this.x, this.y, this.frame, this.hp / this.maxHp);
                break;

            case 'zombie':
                Sprites.drawZombie(ctx, this.x, this.y, this.frame, this.hp / this.maxHp);
                break;

            case 'dark_slime':
                this.drawDarkSlime(ctx);
                break;

            case 'ghost_warrior':
                this.drawGhostWarrior(ctx);
                break;

            case 'dungeon_bat':
                this.drawDungeonBat(ctx);
                break;

            case 'armored_golem':
                this.drawArmoredGolem(ctx);
                break;

            case 'crystal_spider':
                this.drawCrystalSpider(ctx);
                break;

            case 'crystal_elemental':
                this.drawCrystalElemental(ctx);
                break;

            case 'gem_golem':
                this.drawGemGolem(ctx);
                break;

            case 'shadow_assassin':
                this.drawShadowAssassin(ctx);
                break;

            case 'void_wraith':
                this.drawVoidWraith(ctx);
                break;

            case 'nightmare_beast':
                this.drawNightmareBeast(ctx);
                break;

            case 'wind_elemental':
                this.drawWindElemental(ctx);
                break;

            case 'thunder_knight':
                this.drawThunderKnight(ctx);
                break;

            case 'sky_dragon':
                this.drawSkyDragon(ctx);
                break;

            case 'forest_wolf':
                this.drawForestWolf(ctx);
                break;

            case 'corrupted_sprite':
                this.drawCorruptedSprite(ctx);
                break;

            case 'wild_boar':
                this.drawWildBoar(ctx);
                break;

            case 'forest_spider':
                this.drawForestSpider(ctx);
                break;

            default:
                this.drawDefaultEnemy(ctx);
        }
    }

    // FOREST ENEMY DRAWING FUNCTIONS
    drawForestWolf(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Wolf body
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(4, 12, 24, 16);

        // Head
        ctx.fillStyle = '#A0855B';
        ctx.fillRect(0, 8, 12, 12);

        // Snout
        ctx.fillRect(-4, 12, 6, 6);

        // Ears
        ctx.fillStyle = '#6B5338';
        ctx.fillRect(2, 4, 4, 6);
        ctx.fillRect(8, 4, 4, 6);

        // Eyes (glowing)
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(2, 10, 3, 3);
        ctx.fillRect(7, 10, 3, 3);

        // Legs
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(6, 28, 4, 12);
        ctx.fillRect(22, 28, 4, 12);

        // Tail
        ctx.fillRect(28, 14, 8, 6);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawCorruptedSprite(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Corrupted magical glow
        ctx.globalAlpha = 0.7 + Math.sin(this.frame * 0.15) * 0.3;

        // Dark energy core
        ctx.fillStyle = '#440066';
        ctx.beginPath();
        ctx.arc(12, 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Corruption tendrils
        ctx.strokeStyle = '#880088';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + this.frame * 0.08;
            ctx.beginPath();
            ctx.moveTo(12, 12);
            ctx.lineTo(12 + Math.cos(angle) * 12, 12 + Math.sin(angle) * 12);
            ctx.stroke();
        }

        // Glowing evil eyes
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(8, 10, 3, 3);
        ctx.fillRect(13, 10, 3, 3);

        ctx.globalAlpha = 1;

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 24 * (this.hp / this.maxHp), 3);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 24, 3);

        ctx.restore();
    }

    drawWildBoar(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Massive body
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(8, 8, 28, 20);

        // Head
        ctx.fillStyle = '#4A3426';
        ctx.fillRect(0, 10, 12, 16);

        // Tusks
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-4, 20, 6, 3);
        ctx.fillRect(-4, 24, 6, 3);

        // Eyes (angry)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(4, 14, 4, 4);

        // Legs
        ctx.fillStyle = '#3C2A1E';
        ctx.fillRect(12, 28, 6, 12);
        ctx.fillRect(28, 28, 6, 12);

        // Tail
        ctx.fillRect(36, 12, 4, 4);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -10, 40 * (this.hp / this.maxHp), 5);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -10, 40, 5);

        ctx.restore();
    }

    drawForestSpider(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Body
        ctx.fillStyle = '#2F4F2F';
        ctx.fillRect(8, 6, 12, 8);

        // Legs
        ctx.fillStyle = '#1E3F1E';
        ctx.fillRect(0, 4, 3, 12);
        ctx.fillRect(25, 4, 3, 12);
        ctx.fillRect(4, 2, 3, 14);
        ctx.fillRect(21, 2, 3, 14);

        // Eyes (multiple)
        ctx.fillStyle = '#88FF00';
        ctx.fillRect(10, 8, 2, 2);
        ctx.fillRect(14, 8, 2, 2);
        ctx.fillRect(12, 6, 2, 2);
        ctx.fillRect(12, 10, 2, 2);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -6, 28 * (this.hp / this.maxHp), 3);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -6, 28, 3);

        ctx.restore();
    }

    // NEW ENEMY DRAWING FUNCTIONS
    drawCrystalSpider(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Body
        ctx.fillStyle = '#88CCFF';
        ctx.fillRect(8, 8, 20, 12);

        // Crystal legs
        ctx.fillStyle = '#44AAFF';
        ctx.fillRect(2, 4, 4, 20);
        ctx.fillRect(30, 4, 4, 20);
        ctx.fillRect(6, 2, 4, 24);
        ctx.fillRect(26, 2, 4, 24);

        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(12, 10, 4, 4);
        ctx.fillRect(20, 10, 4, 4);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 36 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 36, 4);

        ctx.restore();
    }

    drawCrystalElemental(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Crystalline body
        ctx.fillStyle = '#66FFFF';
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(32, 16);
        ctx.lineTo(24, 40);
        ctx.lineTo(8, 40);
        ctx.lineTo(0, 16);
        ctx.closePath();
        ctx.fill();

        // Inner glow
        ctx.fillStyle = '#AAFFFF';
        ctx.fillRect(10, 12, 12, 16);

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 14, 3, 3);
        ctx.fillRect(17, 14, 3, 3);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawGemGolem(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Massive body
        ctx.fillStyle = '#FF44FF';
        ctx.fillRect(8, 4, 36, 44);

        // Gem core
        ctx.fillStyle = '#FF88FF';
        ctx.fillRect(18, 18, 16, 16);

        // Arms
        ctx.fillStyle = '#CC00CC';
        ctx.fillRect(0, 12, 10, 28);
        ctx.fillRect(42, 12, 10, 28);

        // Eyes
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(16, 10, 6, 6);
        ctx.fillRect(30, 10, 6, 6);

        // Legs
        ctx.fillRect(12, 48, 12, 12);
        ctx.fillRect(28, 48, 12, 12);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -12, 52 * (this.hp / this.maxHp), 6);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -12, 52, 6);

        ctx.restore();
    }

    drawShadowAssassin(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Shadowy body with transparency
        ctx.globalAlpha = 0.8;

        // Cloak
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(6, 4, 20, 32);

        // Hood
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(4, 0, 24, 12);

        // Glowing eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(10, 4, 3, 3);
        ctx.fillRect(19, 4, 3, 3);

        // Daggers
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 20, 2, 14);
        ctx.fillRect(30, 20, 2, 14);

        ctx.globalAlpha = 1;

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawVoidWraith(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Void essence
        ctx.globalAlpha = 0.6 + Math.sin(this.frame * 0.1) * 0.2;

        // Body
        ctx.fillStyle = '#330066';
        ctx.fillRect(4, 0, 24, 36);

        // Void core
        ctx.fillStyle = '#000000';
        ctx.fillRect(10, 12, 12, 12);

        // Wispy trails
        ctx.fillStyle = '#660099';
        ctx.fillRect(2, 28, 8, 12);
        ctx.fillRect(22, 28, 8, 12);

        // Eyes
        ctx.fillStyle = '#9900FF';
        ctx.fillRect(8, 6, 6, 6);
        ctx.fillRect(18, 6, 6, 6);

        ctx.globalAlpha = 1;

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawNightmareBeast(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Massive dark body
        ctx.fillStyle = '#220022';
        ctx.fillRect(8, 8, 40, 48);

        // Spikes
        ctx.fillStyle = '#440044';
        ctx.fillRect(12, 0, 8, 12);
        ctx.fillRect(28, 0, 8, 12);
        ctx.fillRect(36, 4, 12, 8);

        // Claws
        ctx.fillStyle = '#660066';
        ctx.fillRect(0, 24, 10, 24);
        ctx.fillRect(46, 24, 10, 24);

        // Multiple eyes
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(16, 16, 4, 4);
        ctx.fillRect(24, 12, 4, 4);
        ctx.fillRect(32, 16, 4, 4);
        ctx.fillRect(20, 24, 4, 4);
        ctx.fillRect(28, 24, 4, 4);

        // Fangs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(20, 36, 4, 8);
        ctx.fillRect(32, 36, 4, 8);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -12, 56 * (this.hp / this.maxHp), 6);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -12, 56, 6);

        ctx.restore();
    }

    drawWindElemental(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Swirling wind form
        ctx.globalAlpha = 0.7;

        const wobble = Math.sin(this.frame * 0.2) * 3;

        ctx.fillStyle = '#AAFFFF';
        ctx.beginPath();
        ctx.arc(16 + wobble, 20, 16, 0, Math.PI * 2);
        ctx.fill();

        // Wind trails
        ctx.strokeStyle = '#88FFFF';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + this.frame * 0.1;
            ctx.beginPath();
            ctx.moveTo(16 + wobble, 20);
            ctx.lineTo(16 + wobble + Math.cos(angle) * 20, 20 + Math.sin(angle) * 20);
            ctx.stroke();
        }

        // Eyes
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10 + wobble, 16, 4, 4);
        ctx.fillRect(18 + wobble, 16, 4, 4);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawThunderKnight(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Armored body
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(6, 4, 20, 32);

        // Helmet
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(4, 0, 24, 12);

        // Lightning bolt emblem
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(14, 16, 4, 12);

        // Electric sword
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(28, 8, 4, 24);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(28, 8, 4, 24);

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 4, 3, 3);
        ctx.fillRect(19, 4, 3, 3);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawSkyDragon(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Dragon body
        ctx.fillStyle = '#4488FF';
        ctx.fillRect(12, 16, 40, 40);

        // Head
        ctx.fillStyle = '#3366CC';
        ctx.fillRect(8, 4, 28, 20);

        // Wings
        ctx.fillStyle = '#66AAFF';
        ctx.fillRect(0, 20, 14, 28);
        ctx.fillRect(50, 20, 14, 28);

        // Tail
        ctx.fillStyle = '#3366CC';
        ctx.fillRect(44, 44, 20, 12);

        // Eyes
        ctx.fillStyle = '#FF4400';
        ctx.fillRect(14, 10, 6, 6);
        ctx.fillRect(26, 10, 6, 6);

        // Fangs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(16, 20, 4, 6);
        ctx.fillRect(26, 20, 4, 6);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -12, 64 * (this.hp / this.maxHp), 6);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -12, 64, 6);

        ctx.restore();
    }

    drawDarkSlime(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Pulsing animation
        const pulse = 1 + Math.sin(this.frame * 0.1) * 0.1;
        ctx.scale(pulse, 1 / pulse);

        // Dark slime body
        ctx.fillStyle = '#1C1C1C';
        ctx.fillRect(4, 10, 24, 20);
        ctx.fillRect(8, 6, 16, 6);

        // Menacing eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(10, 14, 4, 4);
        ctx.fillRect(18, 14, 4, 4);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawGhostWarrior(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Ghostly transparency
        ctx.globalAlpha = 0.7 + Math.sin(this.frame * 0.08) * 0.2;

        // Ghost body
        ctx.fillStyle = '#4A6FA5';
        ctx.fillRect(6, 0, 20, 32);

        // Tattered cloak
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(4, 8, 24, 24);
        ctx.fillRect(2, 28, 6, 8);
        ctx.fillRect(24, 28, 6, 8);

        // Glowing eyes
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(10, 8, 4, 4);
        ctx.fillRect(18, 8, 4, 4);

        // Spectral sword
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(26, 12, 3, 20);

        ctx.globalAlpha = 1;

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    }

    drawDungeonBat(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Wing flapping
        const wingAngle = Math.sin(this.frame * 0.3) * 0.5;

        // Wings
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(-6, 4 + wingAngle * 4, 12, 8);
        ctx.fillRect(18, 4 - wingAngle * 4, 12, 8);

        // Body
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(8, 6, 8, 12);

        // Eyes
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(9, 8, 2, 2);
        ctx.fillRect(13, 8, 2, 2);

        // Fangs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 14, 1, 3);
        ctx.fillRect(13, 14, 1, 3);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 24 * (this.hp / this.maxHp), 3);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 24, 3);

        ctx.restore();
    }

    drawArmoredGolem(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Heavy stone body
        ctx.fillStyle = '#696969';
        ctx.fillRect(8, 0, 32, 40);

        // Metal armor plates
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(6, 8, 36, 28);

        // Glowing core
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(20, 18, 8, 8);

        // Arms (heavy)
        ctx.fillStyle = '#505050';
        ctx.fillRect(0, 12, 8, 24);
        ctx.fillRect(40, 12, 8, 24);

        // Fists
        ctx.fillStyle = '#3C3C3C';
        ctx.fillRect(-2, 32, 12, 12);
        ctx.fillRect(38, 32, 12, 12);

        // Eyes
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(14, 6, 6, 4);
        ctx.fillRect(28, 6, 6, 4);

        // Legs
        ctx.fillRect(10, 40, 10, 16);
        ctx.fillRect(28, 40, 10, 16);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -12, 48 * (this.hp / this.maxHp), 6);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -12, 48, 6);

        ctx.restore();
    }

    drawDefaultEnemy(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#8B0000';
        ctx.fillRect(4, 4, 24, 32);

        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(10, 12, 4, 4);
        ctx.fillRect(18, 12, 4, 4);

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * (this.hp / this.maxHp), 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

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

// Enemy manager
const Enemies = {
    list: [],

    spawn: function(x, y, type) {
        const enemy = new Enemy(x, y, type);
        this.list.push(enemy);
        return enemy;
    },

    update: function(deltaTime, player) {
        this.list.forEach(enemy => enemy.update(deltaTime, player));
    },

    draw: function(ctx) {
        this.list.forEach(enemy => enemy.draw(ctx));
    },

    checkCollisions: function(player) {
        const playerHitbox = player.getHitbox();
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        // Handle ARCSIS SPIN ATTACK
        if (player.spinning) {
            const spinHitbox = player.getSpinAttackHitbox();

            for (let enemy of this.list) {
                if (!enemy.alive) continue;

                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const dist = Utils.distance(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY);

                // Pull enemies toward player (vortex effect)
                if (dist <= player.spinRadius && dist > 30) {
                    const pullStrength = 0.15;
                    const angle = Utils.angle(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY);
                    enemy.x += Math.cos(angle) * pullStrength * (player.spinRadius - dist);
                    enemy.y += Math.sin(angle) * pullStrength * (player.spinRadius - dist);

                    // Track caught enemies
                    if (!player.caughtEnemies.includes(enemy)) {
                        player.caughtEnemies.push(enemy);
                    }
                }
            }
        }

        // When spin attack FINISHES - launch and crash enemies together!
        if (!player.spinning && player.caughtEnemies.length > 0) {
            const caughtCount = player.caughtEnemies.length;

            // Calculate ULTRA DAMAGE based on number of enemies caught
            const baseDamage = player.calculateDamage() * player.spinDamageMultiplier;
            const collisionBonus = caughtCount * 50; // Bonus damage for each enemy crashed together

            // Apply damage to all caught enemies
            for (let enemy of player.caughtEnemies) {
                if (!enemy.alive) continue;

                // Launch effect (visual only, enemies stay in place)
                enemy.y -= 20; // Brief launch

                // ULTRA DAMAGE from spin + collision
                const totalDamage = baseDamage + collisionBonus;
                const actualDamage = enemy.takeDamage(totalDamage);

                if (actualDamage > 0) {
                    Combat.addDamageNumber(enemy.x + enemy.width / 2, enemy.y - 30, actualDamage);
                    Combat.addEffect(enemy.x + enemy.width / 2, enemy.y, 'spin_crash');

                    if (!enemy.alive) {
                        player.addExp(enemy.expValue * 2); // Bonus EXP for spin kill
                        player.addCoins(enemy.coinDrop * 2); // Bonus coins!
                        player.addCombo();
                    }
                }
            }

            // Clear caught enemies
            player.caughtEnemies = [];

            // Create massive impact effect
            Combat.addEffect(playerCenterX, playerCenterY, 'spin_impact');
        }

        // Handle special ability (Arcsis Nova)
        if (player.specialAbilityCooldown > 14900) { // Just activated
            const novaRadius = 200;

            for (let enemy of this.list) {
                if (!enemy.alive) continue;

                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const dist = Utils.distance(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY);

                if (dist <= novaRadius) {
                    // Massive nova damage
                    const novaDamage = player.calculateDamage() * 10;
                    const actualDamage = enemy.takeDamage(novaDamage);

                    if (actualDamage > 0) {
                        Combat.addDamageNumber(enemy.x + enemy.width / 2, enemy.y, actualDamage);

                        if (!enemy.alive) {
                            player.addExp(enemy.expValue * 3);
                            player.addCoins(enemy.coinDrop * 3);
                            player.addCombo();
                        }
                    }
                }
            }
        }

        for (let enemy of this.list) {
            if (!enemy.alive) continue;

            // Check if player is attacking this enemy
            if (player.attacking) {
                const attackBox = player.getAttackHitbox();
                if (Utils.collides(attackBox, enemy.getHitbox())) {
                    const damage = player.calculateDamage();
                    const actualDamage = enemy.takeDamage(damage);

                    if (actualDamage > 0) {
                        Combat.addDamageNumber(
                            enemy.x + enemy.width / 2,
                            enemy.y,
                            actualDamage
                        );

                        // Screen shake on hit - stronger for criticals
                        if (player.lastCritical) {
                            ScreenShake.critical();
                        } else {
                            ScreenShake.light();
                        }

                        player.addCombo(); // Add to combo on hit

                        if (!enemy.alive) {
                            player.addExp(enemy.expValue);
                            player.addCoins(enemy.coinDrop);
                        }
                    }
                }
            }

            // Check if enemy hits player (not during spin or dash)
            if (!player.spinning && !player.dashing) {
                const enemyHitbox = enemy.getHitbox();
                if (Utils.collides(playerHitbox, enemyHitbox)) {
                    if (enemy.state === 'attack' || Utils.distance(
                        enemyHitbox.x, enemyHitbox.y,
                        playerHitbox.x, playerHitbox.y
                    ) < 30) {
                        const damage = player.takeDamage(enemy.attack);
                        if (damage > 0) {
                            Combat.addDamageNumber(player.x + player.width / 2, player.y, damage);
                            player.comboCount = 0; // Reset combo on hit
                        }
                    }
                }
            }
        }

        // Remove dead enemies
        this.list = this.list.filter(e => e.alive);
    },

    clear: function() {
        this.list = [];
    },

    getCount: function() {
        return this.list.filter(e => e.alive).length;
    }
};
