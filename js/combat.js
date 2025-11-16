// Combat System for Captain Arcsis
// Extreme battle mechanics with visual effects

const Combat = {
    damageNumbers: [],
    effects: [],

    addDamageNumber: function(x, y, damage) {
        this.damageNumbers.push({
            x: x,
            y: y,
            damage: damage,
            frame: 0,
            maxFrames: 30
        });
    },

    addEffect: function(x, y, type) {
        this.effects.push({
            x: x,
            y: y,
            type: type,
            frame: 0,
            maxFrames: type === 'arcsis_nova' ? 60 : type === 'spin_impact' ? 45 : 30
        });
    },

    update: function(deltaTime) {
        // Update damage numbers
        this.damageNumbers = this.damageNumbers.filter(num => {
            num.frame++;
            return num.frame < num.maxFrames;
        });

        // Update effects
        this.effects = this.effects.filter(effect => {
            effect.frame++;
            return effect.frame < effect.maxFrames;
        });
    },

    draw: function(ctx) {
        // Draw damage numbers
        this.damageNumbers.forEach(num => {
            Sprites.drawDamageNumber(ctx, num.x, num.y, num.damage, num.frame);
        });

        // Draw effects
        this.effects.forEach(effect => {
            this.drawEffect(ctx, effect);
        });
    },

    drawEffect: function(ctx, effect) {
        ctx.save();

        switch (effect.type) {
            case 'heal':
                this.drawHealEffect(ctx, effect);
                break;

            case 'blast':
                this.drawBlastEffect(ctx, effect);
                break;

            case 'shield':
                this.drawShieldEffect(ctx, effect);
                break;

            case 'light':
                this.drawLightEffect(ctx, effect);
                break;

            case 'teleport_out':
            case 'teleport_in':
                this.drawTeleportEffect(ctx, effect);
                break;

            case 'summon':
                this.drawSummonEffect(ctx, effect);
                break;

            case 'beam':
                this.drawBeamEffect(ctx, effect);
                break;

            case 'strike':
                this.drawStrikeEffect(ctx, effect);
                break;

            case 'void':
                this.drawVoidEffect(ctx, effect);
                break;

            case 'tear':
                this.drawTearEffect(ctx, effect);
                break;

            case 'spiral':
                this.drawSpiralEffect(ctx, effect);
                break;

            case 'paper_cut':
                this.drawPaperCutEffect(ctx, effect);
                break;

            case 'lightning':
                this.drawLightningEffect(ctx, effect);
                break;

            case 'thunder':
                this.drawThunderEffect(ctx, effect);
                break;

            case 'fold':
                this.drawFoldEffect(ctx, effect);
                break;

            case 'spin_crash':
                this.drawSpinCrashEffect(ctx, effect);
                break;

            case 'spin_impact':
                this.drawSpinImpactEffect(ctx, effect);
                break;

            case 'arcsis_nova':
                this.drawArcsisNovaEffect(ctx, effect);
                break;

            default:
                this.drawDefaultEffect(ctx, effect);
        }

        ctx.restore();
    },

    drawHealEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        const size = effect.frame * 3;

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.stroke();

        // Plus symbols
        ctx.fillStyle = '#00FF00';
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + effect.frame * 0.1;
            const px = effect.x + Math.cos(angle) * size;
            const py = effect.y + Math.sin(angle) * size;
            ctx.fillRect(px - 4, py - 1, 8, 2);
            ctx.fillRect(px - 1, py - 4, 2, 8);
        }
    },

    drawBlastEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        const size = effect.frame * 8;

        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    },

    drawShieldEffect: function(ctx, effect) {
        ctx.globalAlpha = 0.3 + (1 - effect.frame / effect.maxFrames) * 0.4;
        const size = 40 + Math.sin(effect.frame * 0.3) * 5;

        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fill();
    },

    drawLightEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        const size = 100 + effect.frame * 2;

        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();
    },

    drawTeleportEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#9400D3';
        ctx.lineWidth = 2;

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const length = 30 + effect.frame * 2;
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            ctx.lineTo(
                effect.x + Math.cos(angle) * length,
                effect.y + Math.sin(angle) * length
            );
            ctx.stroke();
        }
    },

    drawSummonEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;

        // Pentagram-like effect
        const size = 80;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 / 5) * Math.PI * 2 - Math.PI / 2;
            const x = effect.x + Math.cos(angle) * size;
            const y = effect.y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    },

    drawBeamEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.targetX, effect.targetY);
        ctx.stroke();

        ctx.strokeStyle = '#FF6600';
        ctx.lineWidth = 4;
        ctx.stroke();
    },

    drawStrikeEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        // Cross strike
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(effect.x - 30, effect.y - 30);
        ctx.lineTo(effect.x + 30, effect.y + 30);
        ctx.moveTo(effect.x + 30, effect.y - 30);
        ctx.lineTo(effect.x - 30, effect.y + 30);
        ctx.stroke();
    },

    drawVoidEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        const size = 50 + effect.frame;

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#9400D3';
        ctx.lineWidth = 3;
        ctx.stroke();
    },

    drawTearEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 3;

        // Reality tear lines
        ctx.beginPath();
        ctx.moveTo(effect.x - 20, effect.y);
        ctx.lineTo(effect.x - 5, effect.y - 10);
        ctx.lineTo(effect.x + 5, effect.y + 5);
        ctx.lineTo(effect.x + 20, effect.y - 5);
        ctx.stroke();
    },

    drawSpiralEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;

        ctx.beginPath();
        for (let i = 0; i < 50; i++) {
            const angle = (i / 10) * Math.PI + effect.frame * 0.1;
            const radius = i * 3;
            const x = effect.x + Math.cos(angle) * radius;
            const y = effect.y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    },

    drawPaperCutEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#FFFAF0';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(effect.x - 15, effect.y);
        ctx.lineTo(effect.x + 15, effect.y);
        ctx.stroke();
    },

    drawLightningEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 4;

        // Jagged lightning bolt
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x - 10, effect.y + 50);
        ctx.lineTo(effect.x + 5, effect.y + 50);
        ctx.lineTo(effect.x - 5, effect.y + 100);
        ctx.lineTo(effect.x + 10, effect.y + 100);
        ctx.lineTo(effect.x, effect.targetY || effect.y + 150);
        ctx.stroke();

        // Glow
        ctx.globalAlpha *= 0.5;
        ctx.lineWidth = 10;
        ctx.stroke();
    },

    drawThunderEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        const size = 100 + effect.frame * 3;

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Lightning bolts radiating out
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            const endX = effect.x + Math.cos(angle) * size;
            const endY = effect.y + Math.sin(angle) * size;
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    },

    drawFoldEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        // Reality folding effect
        ctx.strokeStyle = '#FFFAF0';
        ctx.lineWidth = 2;

        const size = 40;
        for (let i = 0; i < 4; i++) {
            ctx.strokeRect(
                effect.x - size / 2 + i * 5,
                effect.y - size / 2 + i * 5,
                size - i * 10,
                size - i * 10
            );
        }
    },

    drawDefaultEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 20, 0, Math.PI * 2);
        ctx.fill();
    },

    // ARCSIS SPIN ATTACK EFFECTS
    drawSpinCrashEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        // Explosion of impact
        const size = effect.frame * 4;

        // Orange/red explosion
        ctx.fillStyle = '#FF6600';
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Shockwave rings
        ctx.strokeStyle = '#FFAA00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Impact stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + effect.frame * 0.2;
            const dist = size * 0.8;
            ctx.fillRect(
                effect.x + Math.cos(angle) * dist - 3,
                effect.y + Math.sin(angle) * dist - 3,
                6, 6
            );
        }
    },

    drawSpinImpactEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        // Massive shockwave
        const size = effect.frame * 8;

        // Multiple rings expanding
        for (let i = 0; i < 3; i++) {
            const ringSize = size - i * 20;
            if (ringSize > 0) {
                ctx.strokeStyle = i === 0 ? '#FF0000' : i === 1 ? '#FF6600' : '#FFAA00';
                ctx.lineWidth = 6 - i * 2;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, ringSize, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Center flash
        if (effect.frame < 10) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 30 - effect.frame * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Debris particles
        ctx.fillStyle = '#FF8800';
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = effect.frame * 6;
            ctx.fillRect(
                effect.x + Math.cos(angle) * dist - 4,
                effect.y + Math.sin(angle) * dist - 4,
                8, 8
            );
        }
    },

    drawArcsisNovaEffect: function(ctx, effect) {
        ctx.globalAlpha = 1 - (effect.frame / effect.maxFrames);

        // MASSIVE golden explosion
        const size = effect.frame * 6;

        // Outer ring
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, size
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Energy beams
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + effect.frame * 0.15;
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            ctx.lineTo(
                effect.x + Math.cos(angle) * size * 1.2,
                effect.y + Math.sin(angle) * size * 1.2
            );
            ctx.stroke();
        }

        // Center star
        if (effect.frame < 30) {
            ctx.fillStyle = '#FFFFFF';
            const starSize = 20 + Math.sin(effect.frame * 0.5) * 10;
            // Draw star shape
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
                const radius = i % 2 === 0 ? starSize : starSize * 0.5;
                const x = effect.x + Math.cos(angle) * radius;
                const y = effect.y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        // "ARCSIS NOVA" text
        if (effect.frame < 40) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('ARCSIS NOVA!', effect.x, effect.y - size - 20);
        }
    },

    clear: function() {
        this.damageNumbers = [];
        this.effects = [];
    }
};
