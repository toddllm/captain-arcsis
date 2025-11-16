// 8-bit Sprite System for Captain Arcsis

const Sprites = {
    // Draw pixel art character
    drawArcsis: function(ctx, x, y, direction, frame, equipment) {
        ctx.save();
        ctx.translate(x, y);

        // Body (little boy)
        ctx.fillStyle = '#FFE4C4'; // Skin
        ctx.fillRect(8, 4, 16, 12); // Head

        // Hair (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(6, 2, 20, 6);
        ctx.fillRect(8, 0, 16, 4);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 8, 3, 3);
        ctx.fillRect(19, 8, 3, 3);

        // Shirt (blue - captain style)
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(8, 16, 16, 12);

        // Captain emblem
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(14, 18, 4, 4);

        // Pants (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(8, 28, 7, 10);
        ctx.fillRect(17, 28, 7, 10);

        // Shoes
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 36, 9, 4);
        ctx.fillRect(17, 36, 9, 4);

        // Arms based on direction and frame
        ctx.fillStyle = '#FFE4C4';
        if (direction === 'right' || direction === 'down') {
            ctx.fillRect(24, 16, 4, 12);
            ctx.fillRect(4, 16, 4, 12);
        } else {
            ctx.fillRect(24, 16, 4, 12);
            ctx.fillRect(4, 16, 4, 12);
        }

        // Draw sword based on level
        this.drawSword(ctx, equipment.swordLevel, direction, frame);

        // Draw shield based on evolution
        this.drawShield(ctx, equipment.shieldLevel, direction);

        ctx.restore();
    },

    drawSword: function(ctx, level, direction, frame) {
        const swordColors = {
            1: '#C0C0C0', // Basic iron
            2: '#B8860B', // Bronze
            3: '#FFD700', // Gold
            4: '#E0E0E0', // Platinum
            5: '#FF4500', // Fire enchanted
            6: '#00FFFF', // Ice enchanted
            7: '#9400D3', // Magic purple
            8: '#FF1493', // Legendary pink
            9: '#FFFFFF', // Divine white
            10: '#FF0000' // Ultimate crimson
        };

        ctx.fillStyle = swordColors[level] || '#C0C0C0';

        // Handle
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(26, 20, 3, 8);

        // Blade
        ctx.fillStyle = swordColors[level] || '#C0C0C0';
        ctx.fillRect(27, 8, 2, 14);

        // Glow effect for high level swords
        if (level >= 5) {
            ctx.globalAlpha = 0.3 + Math.sin(frame * 0.1) * 0.2;
            ctx.fillStyle = swordColors[level];
            ctx.fillRect(25, 6, 6, 18);
            ctx.globalAlpha = 1;
        }
    },

    drawShield: function(ctx, level, direction) {
        const shieldColors = {
            1: '#8B4513', // Wood
            2: '#A0522D', // Reinforced wood
            3: '#C0C0C0', // Iron
            4: '#B8860B', // Bronze
            5: '#FFD700', // Gold
            6: '#E0E0E0', // Platinum
            7: '#9400D3', // Magic
            8: '#00FF00', // Nature evolved
            9: '#FF69B4', // Fairy blessed
            10: '#FFFFFF' // Divine protection
        };

        ctx.fillStyle = shieldColors[level] || '#8B4513';
        ctx.fillRect(-2, 16, 8, 14);

        // Shield design
        ctx.fillStyle = CONSTANTS.COLORS.GOLD;
        ctx.fillRect(0, 20, 4, 6);

        // Evolution glow
        if (level >= 7) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = shieldColors[level];
            ctx.fillRect(-4, 14, 12, 18);
            ctx.globalAlpha = 1;
        }
    },

    drawFairy: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);

        // Floating animation
        const floatY = Math.sin(frame * 0.15) * 4;
        ctx.translate(0, floatY);

        // Wings (sparkly)
        ctx.globalAlpha = 0.7 + Math.sin(frame * 0.2) * 0.3;
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(-8, 0, 6, 10);
        ctx.fillRect(10, 0, 6, 10);
        ctx.globalAlpha = 1;

        // Body
        ctx.fillStyle = '#FFFACD';
        ctx.fillRect(2, 2, 12, 14);

        // Head
        ctx.fillStyle = '#FFF8DC';
        ctx.fillRect(4, -4, 8, 8);

        // Hair (golden)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(3, -6, 10, 4);

        // Eyes (big fairy eyes)
        ctx.fillStyle = '#9400D3';
        ctx.fillRect(5, -2, 2, 3);
        ctx.fillRect(9, -2, 2, 3);

        // Magic aura
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 5; i++) {
            const sparkX = Math.cos(frame * 0.1 + i) * 12;
            const sparkY = Math.sin(frame * 0.1 + i) * 12;
            ctx.fillRect(sparkX + 6, sparkY + 4, 2, 2);
        }
        ctx.globalAlpha = 1;

        ctx.restore();
    },

    drawSkeletonKnight: function(ctx, x, y, frame, health) {
        ctx.save();
        ctx.translate(x, y);

        // Skeleton body (white bones)
        ctx.fillStyle = '#F5F5DC';

        // Skull
        ctx.fillRect(8, 0, 16, 14);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 4, 4, 4); // Left eye socket
        ctx.fillRect(18, 4, 4, 4); // Right eye socket
        ctx.fillRect(12, 10, 8, 2); // Mouth

        // Red glowing eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(11, 5, 2, 2);
        ctx.fillRect(19, 5, 2, 2);

        // Armor (dark metal)
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(6, 14, 20, 16);

        // Shoulder pads
        ctx.fillRect(2, 14, 6, 8);
        ctx.fillRect(24, 14, 6, 8);

        // Legs (bone with armor)
        ctx.fillStyle = '#696969';
        ctx.fillRect(8, 30, 6, 12);
        ctx.fillRect(18, 30, 6, 12);

        // Sword (big and menacing)
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(28, 10, 4, 24);
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(28, 8, 4, 4); // Bloody tip

        // Shield
        ctx.fillStyle = '#1C1C1C';
        ctx.fillRect(-2, 16, 10, 16);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * health, 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    },

    drawZombie: function(ctx, x, y, frame, health) {
        ctx.save();
        ctx.translate(x, y);

        // Shambling animation
        const shamble = Math.sin(frame * 0.1) * 2;
        ctx.translate(shamble, 0);

        // Head (rotting green)
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(8, 0, 16, 14);

        // Rotting patches
        ctx.fillStyle = '#6B8E23';
        ctx.fillRect(10, 2, 4, 4);
        ctx.fillRect(20, 6, 3, 5);

        // Dead eyes
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(10, 4, 4, 4);
        ctx.fillRect(18, 4, 4, 4);

        // Open mouth (groaning)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(12, 10, 8, 4);

        // Tattered clothes
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(6, 14, 20, 18);

        // Torn parts
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(8, 20, 4, 6);
        ctx.fillRect(20, 24, 4, 8);

        // Arms (reaching out)
        ctx.fillRect(0, 16, 6, 14);
        ctx.fillRect(26, 16, 6, 14);

        // Legs
        ctx.fillRect(8, 32, 6, 10);
        ctx.fillRect(18, 32, 6, 10);

        // Health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * health, 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    },

    drawCoin: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);

        // Spinning animation
        const scale = Math.abs(Math.cos(frame * 0.1));
        ctx.scale(scale, 1);

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-8, -8, 16, 16);

        ctx.fillStyle = '#FFA500';
        ctx.fillRect(-6, -6, 12, 12);

        // Coin symbol
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-2, -4, 4, 8);

        ctx.restore();
    },

    drawButton: function(ctx, x, y, pressed) {
        ctx.save();
        ctx.translate(x, y);

        // Mysterious button
        ctx.fillStyle = pressed ? '#FF0000' : '#8B0000';
        ctx.fillRect(-12, -12, 24, 24);

        // Glow
        if (!pressed) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(-16, -16, 32, 32);
            ctx.globalAlpha = 1;
        }

        // Symbol on button
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-4, -8, 8, 4);
        ctx.fillRect(-4, 0, 8, 4);
        ctx.fillRect(-4, -8, 4, 12);

        ctx.restore();
    },

    drawTree: function(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, 24, 8, 16);

        // Leaves
        ctx.fillStyle = '#228B22';
        ctx.fillRect(4, 8, 24, 20);
        ctx.fillRect(8, 0, 16, 12);

        ctx.restore();
    },

    drawDungeonWall: function(ctx, x, y) {
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x, y, 32, 32);

        // Brick pattern
        ctx.fillStyle = '#1C1C1C';
        ctx.fillRect(x, y + 8, 32, 2);
        ctx.fillRect(x, y + 22, 32, 2);
        ctx.fillRect(x + 16, y, 2, 10);
        ctx.fillRect(x + 8, y + 10, 2, 14);
        ctx.fillRect(x + 24, y + 10, 2, 14);
        ctx.fillRect(x + 16, y + 24, 2, 8);
    },

    drawDungeonFloor: function(ctx, x, y) {
        ctx.fillStyle = '#696969';
        ctx.fillRect(x, y, 32, 32);

        // Cracks
        ctx.fillStyle = '#505050';
        ctx.fillRect(x + 4, y + 12, 8, 2);
        ctx.fillRect(x + 20, y + 8, 10, 2);
        ctx.fillRect(x + 14, y + 24, 12, 2);
    },

    drawForestGround: function(ctx, x, y) {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(x, y, 32, 32);

        // Grass details
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(x + 4, y + 8, 2, 6);
        ctx.fillRect(x + 12, y + 4, 2, 8);
        ctx.fillRect(x + 24, y + 12, 2, 6);
        ctx.fillRect(x + 18, y + 20, 2, 4);
    },

    // Attack effects
    drawSlash: function(ctx, x, y, direction, frame) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = 1 - (frame / 10);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();

        if (direction === 'right') {
            ctx.moveTo(0, -20);
            ctx.lineTo(40, 20);
        } else if (direction === 'left') {
            ctx.moveTo(0, -20);
            ctx.lineTo(-40, 20);
        } else if (direction === 'up') {
            ctx.moveTo(-20, 0);
            ctx.lineTo(20, -40);
        } else {
            ctx.moveTo(-20, 0);
            ctx.lineTo(20, 40);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
    },

    drawMagicBlast: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);

        const size = 10 + frame * 3;
        ctx.globalAlpha = 1 - (frame / 20);

        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.restore();
    },

    drawDamageNumber: function(ctx, x, y, damage, frame) {
        ctx.save();
        ctx.font = '16px monospace';
        ctx.fillStyle = '#FF0000';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1 - (frame / 30);
        ctx.fillText(`-${damage}`, x, y - frame * 2);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
};
