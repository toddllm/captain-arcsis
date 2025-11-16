// Utility functions for Captain Arcsis

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
    easeIn: (t) => t * t
};

// Game constants
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

    // Experience
    EXP_BASE: 100,
    EXP_MULTIPLIER: 1.5,

    // Coins
    COIN_VALUE: 10,

    // Colors (8-bit palette)
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
        PAPER: '#FFFAF0'
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
