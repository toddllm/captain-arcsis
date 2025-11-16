// 8-bit Sprite System for Captain Arcsis - ENHANCED EDITION
// With Color Variants, Infinite Equipment Tiers, and Visual Effects

const Sprites = {
    // Draw pixel art character with color variant support
    drawArcsis: function(ctx, x, y, direction, frame, equipment, arcsisType = 'BLUE') {
        ctx.save();
        ctx.translate(x, y);

        const typeData = CONSTANTS.ARCSIS_TYPES[arcsisType];
        const mainColor = typeData.color;

        // Body (little boy)
        ctx.fillStyle = '#FFE4C4'; // Skin
        ctx.fillRect(8, 4, 16, 12); // Head

        // Hair color based on type
        const hairColors = {
            YELLOW: '#FFD700',
            RED: '#8B0000',
            GREEN: '#006400',
            BLUE: '#4169E1'
        };
        ctx.fillStyle = hairColors[arcsisType] || '#8B4513';
        ctx.fillRect(6, 2, 20, 6);
        ctx.fillRect(8, 0, 16, 4);

        // Eyes with glow for magic users
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 8, 3, 3);
        ctx.fillRect(19, 8, 3, 3);

        // Eye glow for Yellow (Magic)
        if (arcsisType === 'YELLOW') {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(9, 7, 5, 5);
            ctx.fillRect(18, 7, 5, 5);
            ctx.globalAlpha = 1;
        }

        // Shirt (type color)
        ctx.fillStyle = mainColor;
        ctx.fillRect(8, 16, 16, 12);

        // Captain emblem (gold star)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(14, 18, 4, 4);
        ctx.fillRect(13, 19, 6, 2);
        ctx.fillRect(15, 17, 2, 6);

        // Type-specific markings
        if (arcsisType === 'RED') {
            // Flame pattern
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(9, 24, 3, 4);
            ctx.fillRect(20, 24, 3, 4);
        } else if (arcsisType === 'GREEN') {
            // Nature pattern
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(10, 25, 4, 3);
            ctx.fillRect(18, 25, 4, 3);
        } else if (arcsisType === 'BLUE') {
            // Speed lines
            ctx.fillStyle = '#00BFFF';
            ctx.fillRect(9, 17, 2, 10);
            ctx.fillRect(21, 17, 2, 10);
        }

        // Pants (brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(8, 28, 7, 10);
        ctx.fillRect(17, 28, 7, 10);

        // Shoes
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 36, 9, 4);
        ctx.fillRect(17, 36, 9, 4);

        // Arms
        ctx.fillStyle = '#FFE4C4';
        ctx.fillRect(24, 16, 4, 12);
        ctx.fillRect(4, 16, 4, 12);

        // Draw sword based on level and rarity
        this.drawSword(ctx, equipment.swordLevel, direction, frame, equipment.swordRarity);

        // Draw shield based on evolution
        this.drawShield(ctx, equipment.shieldLevel, direction, equipment.shieldRarity);

        // Aura effect for high-level characters
        if (equipment.swordLevel >= 50 || equipment.shieldLevel >= 50) {
            this.drawPowerAura(ctx, frame, mainColor);
        }

        ctx.restore();
    },

    drawSword: function(ctx, level, direction, frame, rarity = 'COMMON') {
        // Dynamic colors based on INFINITE level progression
        let bladeColor;
        if (level >= 100) {
            bladeColor = '#FF0000'; // Divine crimson
        } else if (level >= 75) {
            bladeColor = '#FF1493'; // Mythic pink
        } else if (level >= 50) {
            bladeColor = '#FFD700'; // Legendary gold
        } else if (level >= 35) {
            bladeColor = '#9400D3'; // Epic purple
        } else if (level >= 20) {
            bladeColor = '#0088FF'; // Rare blue
        } else if (level >= 10) {
            bladeColor = '#00FF00'; // Uncommon green
        } else {
            bladeColor = '#C0C0C0'; // Common silver
        }

        // Handle
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(26, 20, 3, 8);

        // Guard
        ctx.fillStyle = CONSTANTS.RARITY[rarity].color;
        ctx.fillRect(24, 19, 7, 3);

        // Blade size scales with level
        const bladeLength = Math.min(14 + Math.floor(level / 10) * 2, 30);
        ctx.fillStyle = bladeColor;
        ctx.fillRect(27, 8 - (bladeLength - 14), 2, bladeLength);

        // Blade edge highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(28, 8 - (bladeLength - 14), 1, bladeLength);
        ctx.globalAlpha = 1;

        // Glow effect for high level swords (INFINITE SCALING)
        if (level >= 10) {
            const glowIntensity = Math.min(0.3 + (level / 100) * 0.3, 0.8);
            const glowSize = Math.min(level / 5, 20);
            ctx.globalAlpha = glowIntensity + Math.sin(frame * 0.1) * 0.2;
            ctx.fillStyle = bladeColor;
            ctx.fillRect(25 - glowSize / 4, 6 - (bladeLength - 14), 6 + glowSize / 2, bladeLength + 4);
            ctx.globalAlpha = 1;
        }

        // Rune effects for Epic+ rarity
        if (level >= 35) {
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = 0.7 + Math.sin(frame * 0.15) * 0.3;
            for (let i = 0; i < Math.min(level / 20, 5); i++) {
                const runeY = 10 + i * 4;
                ctx.fillRect(27, runeY, 2, 2);
            }
            ctx.globalAlpha = 1;
        }
    },

    drawShield: function(ctx, level, direction, rarity = 'COMMON') {
        // Dynamic colors based on INFINITE level progression
        let shieldColor;
        if (level >= 100) {
            shieldColor = '#FFFFFF'; // Divine white
        } else if (level >= 75) {
            shieldColor = '#FF69B4'; // Mythic pink
        } else if (level >= 50) {
            shieldColor = '#FFD700'; // Legendary gold
        } else if (level >= 35) {
            shieldColor = '#00FF00'; // Epic green
        } else if (level >= 20) {
            shieldColor = '#0088FF'; // Rare blue
        } else if (level >= 10) {
            shieldColor = '#C0C0C0'; // Uncommon silver
        } else {
            shieldColor = '#8B4513'; // Common wood
        }

        // Shield size scales with level
        const shieldWidth = Math.min(8 + Math.floor(level / 20) * 2, 16);
        const shieldHeight = Math.min(14 + Math.floor(level / 20) * 2, 22);

        ctx.fillStyle = shieldColor;
        ctx.fillRect(-2 - (shieldWidth - 8) / 2, 16 - (shieldHeight - 14) / 2, shieldWidth, shieldHeight);

        // Shield border
        ctx.strokeStyle = CONSTANTS.RARITY[rarity].color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-2 - (shieldWidth - 8) / 2, 16 - (shieldHeight - 14) / 2, shieldWidth, shieldHeight);

        // Shield emblem
        ctx.fillStyle = CONSTANTS.COLORS.GOLD;
        ctx.fillRect(0, 20, 4, 6);

        // Rarity gem in center
        if (level >= 20) {
            ctx.fillStyle = CONSTANTS.RARITY[rarity].color;
            ctx.fillRect(0, 18, 4, 4);
        }

        // Evolution glow (INFINITE SCALING)
        if (level >= 10) {
            const glowIntensity = Math.min(0.2 + (level / 150), 0.6);
            ctx.globalAlpha = glowIntensity;
            ctx.fillStyle = shieldColor;
            ctx.fillRect(-4 - (shieldWidth - 8) / 2, 14 - (shieldHeight - 14) / 2, shieldWidth + 4, shieldHeight + 4);
            ctx.globalAlpha = 1;
        }

        // Divine symbols for max tier
        if (level >= 100) {
            ctx.fillStyle = '#FFD700';
            ctx.globalAlpha = 0.8;
            ctx.fillRect(-1, 15, 6, 2);
            ctx.fillRect(1, 13, 2, 6);
            ctx.globalAlpha = 1;
        }
    },

    drawPowerAura: function(ctx, frame, color) {
        ctx.globalAlpha = 0.2 + Math.sin(frame * 0.05) * 0.1;
        ctx.fillStyle = color;
        const auraSize = 10 + Math.sin(frame * 0.08) * 5;
        ctx.fillRect(-auraSize, -auraSize, 32 + auraSize * 2, 40 + auraSize * 2);
        ctx.globalAlpha = 1;
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

        // Skeleton body
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(8, 0, 16, 14);
        ctx.fillStyle = '#000';
        ctx.fillRect(10, 4, 4, 4);
        ctx.fillRect(18, 4, 4, 4);
        ctx.fillRect(12, 10, 8, 2);

        // Red glowing eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(11, 5, 2, 2);
        ctx.fillRect(19, 5, 2, 2);

        // Armor
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(6, 14, 20, 16);
        ctx.fillRect(2, 14, 6, 8);
        ctx.fillRect(24, 14, 6, 8);

        // Legs
        ctx.fillStyle = '#696969';
        ctx.fillRect(8, 30, 6, 12);
        ctx.fillRect(18, 30, 6, 12);

        // Sword
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(28, 10, 4, 24);
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(28, 8, 4, 4);

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

        const shamble = Math.sin(frame * 0.1) * 2;
        ctx.translate(shamble, 0);

        ctx.fillStyle = '#556B2F';
        ctx.fillRect(8, 0, 16, 14);
        ctx.fillStyle = '#6B8E23';
        ctx.fillRect(10, 2, 4, 4);
        ctx.fillRect(20, 6, 3, 5);

        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(10, 4, 4, 4);
        ctx.fillRect(18, 4, 4, 4);

        ctx.fillStyle = '#8B0000';
        ctx.fillRect(12, 10, 8, 4);

        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(6, 14, 20, 18);
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(8, 20, 4, 6);
        ctx.fillRect(20, 24, 4, 8);
        ctx.fillRect(0, 16, 6, 14);
        ctx.fillRect(26, 16, 6, 14);
        ctx.fillRect(8, 32, 6, 10);
        ctx.fillRect(18, 32, 6, 10);

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -8, 32 * health, 4);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(0, -8, 32, 4);

        ctx.restore();
    },

    drawCoin: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);

        const scale = Math.abs(Math.cos(frame * 0.1));
        ctx.scale(scale, 1);

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-8, -8, 16, 16);
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(-6, -6, 12, 12);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-2, -4, 4, 8);

        ctx.restore();
    },

    drawButton: function(ctx, x, y, pressed) {
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = pressed ? '#FF0000' : '#8B0000';
        ctx.fillRect(-12, -12, 24, 24);

        if (!pressed) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(-16, -16, 32, 32);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-4, -8, 8, 4);
        ctx.fillRect(-4, 0, 8, 4);
        ctx.fillRect(-4, -8, 4, 12);

        ctx.restore();
    },

    drawTree: function(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, 24, 8, 16);

        ctx.fillStyle = '#228B22';
        ctx.fillRect(4, 8, 24, 20);
        ctx.fillRect(8, 0, 16, 12);

        ctx.restore();
    },

    drawDungeonWall: function(ctx, x, y) {
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(x, y, 32, 32);

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

        ctx.fillStyle = '#505050';
        ctx.fillRect(x + 4, y + 12, 8, 2);
        ctx.fillRect(x + 20, y + 8, 10, 2);
        ctx.fillRect(x + 14, y + 24, 12, 2);
    },

    drawForestGround: function(ctx, x, y) {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(x, y, 32, 32);

        ctx.fillStyle = '#32CD32';
        ctx.fillRect(x + 4, y + 8, 2, 6);
        ctx.fillRect(x + 12, y + 4, 2, 8);
        ctx.fillRect(x + 24, y + 12, 2, 6);
        ctx.fillRect(x + 18, y + 20, 2, 4);
    },

    // Attack effects with critical hit support
    drawSlash: function(ctx, x, y, direction, frame, isCritical = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = 1 - (frame / 10);

        // Critical hits have golden color and larger size
        ctx.strokeStyle = isCritical ? '#FFD700' : '#FFFFFF';
        ctx.lineWidth = isCritical ? 5 : 3;

        const size = isCritical ? 1.5 : 1;

        ctx.beginPath();
        if (direction === 'right') {
            ctx.moveTo(0, -20 * size);
            ctx.lineTo(40 * size, 20 * size);
        } else if (direction === 'left') {
            ctx.moveTo(0, -20 * size);
            ctx.lineTo(-40 * size, 20 * size);
        } else if (direction === 'up') {
            ctx.moveTo(-20 * size, 0);
            ctx.lineTo(20 * size, -40 * size);
        } else {
            ctx.moveTo(-20 * size, 0);
            ctx.lineTo(20 * size, 40 * size);
        }
        ctx.stroke();

        // Critical hit sparkles
        if (isCritical) {
            ctx.fillStyle = '#FFD700';
            for (let i = 0; i < 5; i++) {
                const sparkX = Utils.random(-30, 30);
                const sparkY = Utils.random(-30, 30);
                ctx.fillRect(sparkX, sparkY, 4, 4);
            }
        }

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

    drawDamageNumber: function(ctx, x, y, damage, frame, color = '#FF0000') {
        ctx.save();
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1 - (frame / 30);
        ctx.fillText(`-${damage}`, x, y - frame * 2);
        ctx.globalAlpha = 1;
        ctx.restore();
    },

    // New effects for enhanced gameplay
    drawComboEffect: function(ctx, x, y, combo, frame) {
        ctx.save();
        ctx.font = 'bold 20px monospace';

        const colors = ['#FFFFFF', '#FFFF00', '#FF8C00', '#FF0000', '#FF1493'];
        const colorIndex = Math.min(Math.floor(combo / 5), colors.length - 1);

        ctx.fillStyle = colors[colorIndex];
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1 - (frame / 30);

        // Pulsing glow effect - intensity scales with combo count
        const glowIntensity = Math.min(combo * 2, 20); // Max glow at 10+ combo
        const pulseSpeed = 0.15 + (combo * 0.02); // Faster pulse for higher combos
        const glowPulse = Math.sin(frame * pulseSpeed) * 0.5 + 0.5; // 0 to 1
        ctx.shadowColor = colors[colorIndex];
        ctx.shadowBlur = glowIntensity * (0.5 + glowPulse * 0.5);

        const scale = 1 + Math.sin(frame * 0.3) * 0.2;
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillText(`${combo}x COMBO!`, 0, 0);

        ctx.restore();
    },

    drawDodgeEffect: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = 1 - (frame / 20);

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#00FFFF';
        ctx.textAlign = 'center';
        ctx.fillText('DODGE!', 0, -frame);

        ctx.restore();
    },

    drawLastStandEffect: function(ctx, x, y, frame) {
        ctx.save();
        ctx.translate(x, y);

        ctx.globalAlpha = 0.6 - (frame / 50);
        ctx.fillStyle = '#FFD700';

        const size = 20 + frame * 2;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#FF0000';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1 - (frame / 30);
        ctx.fillText('LAST STAND!', 0, -40);

        ctx.restore();
    },

    drawPotionEffect: function(ctx, x, y, frame, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = 1 - (frame / 20);

        // Spiral effect
        for (let i = 0; i < 8; i++) {
            const angle = (frame * 0.2) + (i * Math.PI / 4);
            const radius = 20 - frame;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius - frame;

            ctx.fillStyle = color;
            ctx.fillRect(px - 2, py - 2, 4, 4);
        }

        ctx.restore();
    },

    drawDustParticle: function(ctx, particle) {
        ctx.save();

        // Fade out as particle ages
        const alpha = 1 - (particle.frame / particle.maxFrames);
        ctx.globalAlpha = alpha * 0.6;

        // Dust color - brownish gray that gets lighter as it rises
        const brightness = 120 + (particle.frame * 3);
        ctx.fillStyle = `rgb(${brightness}, ${brightness - 10}, ${brightness - 20})`;

        // Shrink slightly as it fades
        const currentSize = particle.size * (1 - particle.frame / particle.maxFrames * 0.3);

        ctx.fillRect(
            particle.x - currentSize / 2,
            particle.y - currentSize / 2,
            currentSize,
            currentSize
        );

        ctx.restore();
    },

    drawShopIcon: function(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Shop building
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-16, -16, 32, 32);

        // Roof
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(-20, -20, 40, 8);

        // Door
        ctx.fillStyle = '#654321';
        ctx.fillRect(-6, 0, 12, 16);

        // Sign
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-12, -12, 24, 8);
        ctx.font = '8px monospace';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText('SHOP', 0, -6);

        ctx.restore();
    },

    drawSecretDoor: function(ctx, x, y, frame, locked) {
        ctx.save();
        ctx.translate(x, y);

        // Mysterious door
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(-16, -24, 32, 48);

        // Glowing frame
        ctx.globalAlpha = 0.5 + Math.sin(frame * 0.1) * 0.3;
        ctx.strokeStyle = '#9400D3';
        ctx.lineWidth = 3;
        ctx.strokeRect(-16, -24, 32, 48);
        ctx.globalAlpha = 1;

        // Lock symbol if locked
        if (locked) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(-6, 0, 12, 10);
            ctx.fillRect(-4, -6, 8, 8);
            ctx.fillStyle = '#000';
            ctx.fillRect(-2, 2, 4, 4);
        } else {
            // Open indicator
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(-4, 0, 8, 8);
        }

        ctx.restore();
    }
};
