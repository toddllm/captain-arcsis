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

            default:
                this.drawDefaultEnemy(ctx);
        }
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

                        if (!enemy.alive) {
                            player.addExp(enemy.expValue);
                            player.addCoins(enemy.coinDrop);
                        }
                    }
                }
            }

            // Check if enemy hits player
            const enemyHitbox = enemy.getHitbox();
            if (Utils.collides(playerHitbox, enemyHitbox)) {
                if (enemy.state === 'attack' || Utils.distance(
                    enemyHitbox.x, enemyHitbox.y,
                    playerHitbox.x, playerHitbox.y
                ) < 30) {
                    const damage = player.takeDamage(enemy.attack);
                    if (damage > 0) {
                        Combat.addDamageNumber(player.x + player.width / 2, player.y, damage);
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
