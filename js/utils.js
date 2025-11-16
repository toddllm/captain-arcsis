// Utility functions for Captain Arcsis - ENHANCED EDITION

const Utils = {
    // Random number between min and max (inclusive)
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Random float between min and max
    randomFloat: (min, max) => Math.random() * (max - min) + min,

    // Distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),

    // Check collision between two rectangles
    collides: (a, b) => {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },

    // Clamp value between min and max
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

    // Lerp (linear interpolation)
    lerp: (start, end, t) => start + (end - start) * t,

    // Angle between two points
    angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),

    // Convert angle to direction vector
    angleToVector: (angle) => ({
        x: Math.cos(angle),
        y: Math.sin(angle)
    }),

    // Deep clone object
    clone: (obj) => JSON.parse(JSON.stringify(obj)),

    // Format time (seconds to MM:SS)
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Format large numbers
    formatNumber: (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.floor(num).toString();
    },

    // Shuffle array
    shuffle: (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Ease functions
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOut: (t) => t * (2 - t),
    easeIn: (t) => t * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    elasticOut: (t) => Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
};

// Game constants - ENHANCED EDITION
const CONSTANTS = {
    TILE_SIZE: 32,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Player stats
    PLAYER_BASE_HP: 100,
    PLAYER_BASE_ATTACK: 10,
    PLAYER_BASE_DEFENSE: 5,
    PLAYER_SPEED: 3,

    // Combat
    ATTACK_COOLDOWN: 500,
    HIT_STUN_DURATION: 200,
    INVINCIBILITY_FRAMES: 1000,
    CRIT_MULTIPLIER: 2.5,
    CRIT_CHANCE_BASE: 5, // 5%

    // Experience
    EXP_BASE: 100,
    EXP_MULTIPLIER: 1.5,

    // Coins
    COIN_VALUE: 10,

    // Equipment Rarity Tiers
    RARITY: {
        COMMON: { name: 'Common', color: '#FFFFFF', multiplier: 1.0 },
        UNCOMMON: { name: 'Uncommon', color: '#00FF00', multiplier: 1.2 },
        RARE: { name: 'Rare', color: '#0088FF', multiplier: 1.5 },
        EPIC: { name: 'Epic', color: '#9400D3', multiplier: 2.0 },
        LEGENDARY: { name: 'Legendary', color: '#FFD700', multiplier: 3.0 },
        MYTHIC: { name: 'Mythic', color: '#FF1493', multiplier: 5.0 },
        DIVINE: { name: 'Divine', color: '#FF0000', multiplier: 10.0 }
    },

    // Status Effects
    STATUS_EFFECTS: {
        POISON: { name: 'Poison', color: '#00FF00', tickDamage: 2, duration: 5000 },
        BURN: { name: 'Burn', color: '#FF4500', tickDamage: 3, duration: 4000 },
        FREEZE: { name: 'Freeze', color: '#00FFFF', slowPercent: 50, duration: 3000 },
        STUN: { name: 'Stun', color: '#FFFF00', duration: 1500 },
        BLEED: { name: 'Bleed', color: '#8B0000', tickDamage: 4, duration: 6000 },
        WEAKNESS: { name: 'Weakness', color: '#808080', attackReduction: 30, duration: 8000 },
        CURSE: { name: 'Curse', color: '#4B0082', defenseReduction: 50, duration: 10000 }
    },

    // Arcsis Color Variants
    ARCSIS_TYPES: {
        YELLOW: {
            name: 'Captain Arcsis Yellow',
            color: '#FFD700',
            specialty: 'Magic',
            bonuses: { manaRegen: 2.0, spellPower: 1.5, baseAttack: 8, baseDefense: 4 },
            description: 'Master of arcane arts with enhanced spell power'
        },
        RED: {
            name: 'Captain Arcsis Red',
            color: '#FF0000',
            specialty: 'Attack',
            bonuses: { attackPower: 1.8, critChance: 15, baseAttack: 15, baseDefense: 3 },
            description: 'Fierce warrior with devastating attack power'
        },
        GREEN: {
            name: 'Captain Arcsis Green',
            color: '#00FF00',
            specialty: 'Defense',
            bonuses: { defense: 2.0, hpRegen: 1, baseAttack: 8, baseDefense: 10 },
            description: 'Stalwart defender with regenerating health'
        },
        BLUE: {
            name: 'Captain Arcsis Blue',
            color: '#0088FF',
            specialty: 'Speed',
            bonuses: { speed: 1.5, dodgeChance: 20, baseAttack: 10, baseDefense: 5 },
            description: 'Swift fighter with unmatched agility'
        }
    },

    // Shop Prices (scales with level)
    SHOP_PRICES: {
        SWORD_BASE: 100,
        SWORD_MULTIPLIER: 2.2,
        SHIELD_BASE: 100,
        SHIELD_MULTIPLIER: 2.2,
        HEALTH_POTION: 50,
        MANA_POTION: 40,
        MEGA_POTION: 500,
        SPELL_UNLOCK_BASE: 200,
        SPELL_UNLOCK_MULTIPLIER: 3.0,
        KEY_PRICE: 150
    },

    // Anizon Progressive Scaling
    ANIZON_SCALING: {
        HP_BASE: 10000,
        HP_PER_ENCOUNTER: 5000,
        HP_MULTIPLIER: 1.5,
        ATTACK_BASE: 150,
        ATTACK_PER_ENCOUNTER: 50,
        DEFENSE_BASE: 75,
        DEFENSE_PER_ENCOUNTER: 25
    },

    // Achievement Categories
    ACHIEVEMENT_CATEGORIES: {
        COMBAT: 'Combat',
        EXPLORATION: 'Exploration',
        COLLECTION: 'Collection',
        BOSS: 'Boss',
        MASTERY: 'Mastery',
        SECRET: 'Secret'
    },

    // Colors (8-bit palette - ENHANCED)
    COLORS: {
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        RED: '#FF0000',
        GREEN: '#00FF00',
        BLUE: '#0000FF',
        YELLOW: '#FFFF00',
        PURPLE: '#800080',
        ORANGE: '#FFA500',
        BROWN: '#8B4513',
        GRAY: '#808080',
        DARK_GRAY: '#404040',
        LIGHT_GRAY: '#C0C0C0',
        DARK_GREEN: '#006400',
        DARK_BLUE: '#00008B',
        DARK_RED: '#8B0000',
        GOLD: '#FFD700',
        SILVER: '#C0C0C0',
        BRONZE: '#CD7F32',
        FOREST: '#228B22',
        DUNGEON: '#2F4F4F',
        MAGIC: '#9400D3',
        LIGHTNING: '#F0E68C',
        PAPER: '#FFFAF0',
        CRIMSON: '#DC143C',
        CYAN: '#00FFFF',
        PINK: '#FF69B4',
        LIME: '#32CD32',
        INDIGO: '#4B0082',
        CORAL: '#FF7F50',
        TEAL: '#008080'
    }
};

// Input handler
const Input = {
    keys: {},
    keyPressed: {},

    init: function() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keyPressed[e.code] = true;
            }
            this.keys[e.code] = true;

            // Prevent default for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    },

    isPressed: function(key) {
        return this.keys[key] || false;
    },

    wasJustPressed: function(key) {
        if (this.keyPressed[key]) {
            this.keyPressed[key] = false;
            return true;
        }
        return false;
    },

    clearPressed: function() {
        this.keyPressed = {};
    }
};
