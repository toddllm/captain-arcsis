// 8-bit Audio System for Captain Arcsis
// Uses Web Audio API to generate retro sound effects

const Audio = {
    context: null,
    masterVolume: 0.5,
    musicPlaying: false,
    currentMusic: null,

    init: function() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    resume: function() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Generate 8-bit style sound
    playTone: function(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume * this.masterVolume;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        oscillator.stop(this.context.currentTime + duration);
    },

    // Sound effects
    swordSwing: function() {
        this.playTone(400, 0.1, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(600, 0.05, 'sawtooth', 0.3), 50);
    },

    swordHit: function() {
        this.playTone(200, 0.1, 'square', 0.5);
        this.playTone(150, 0.15, 'square', 0.4);
    },

    playerHurt: function() {
        this.playTone(300, 0.1, 'square', 0.5);
        setTimeout(() => this.playTone(200, 0.2, 'square', 0.4), 100);
        setTimeout(() => this.playTone(100, 0.3, 'square', 0.3), 200);
    },

    enemyDeath: function() {
        this.playTone(400, 0.1, 'square', 0.4);
        setTimeout(() => this.playTone(300, 0.1, 'square', 0.3), 100);
        setTimeout(() => this.playTone(200, 0.2, 'square', 0.2), 200);
    },

    coinCollect: function() {
        this.playTone(800, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(1000, 0.15, 'square', 0.3), 100);
    },

    levelUp: function() {
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'square', 0.4), i * 150);
        });
    },

    buttonPress: function() {
        this.playTone(100, 0.3, 'sine', 0.6);
        setTimeout(() => this.playTone(50, 0.5, 'sine', 0.5), 200);
    },

    fairyMagic: function() {
        const notes = [1200, 1400, 1600, 1400, 1200];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.1, 'sine', 0.3), i * 80);
        });
    },

    dialogueBeep: function() {
        this.playTone(600, 0.05, 'square', 0.2);
    },

    menuSelect: function() {
        this.playTone(500, 0.1, 'square', 0.3);
    },

    bossAppear: function() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(100 + i * 50, 0.3, 'sawtooth', 0.5), i * 200);
        }
    },

    teleport: function() {
        for (let i = 10; i > 0; i--) {
            setTimeout(() => this.playTone(200 * i, 0.05, 'sine', 0.3), (10 - i) * 30);
        }
    },

    shieldBlock: function() {
        this.playTone(150, 0.15, 'triangle', 0.5);
    },

    puzzleSolve: function() {
        const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.3, 'sine', 0.4), i * 200);
        });
    },

    saveGame: function() {
        this.playTone(440, 0.2, 'sine', 0.3);
        setTimeout(() => this.playTone(880, 0.3, 'sine', 0.3), 200);
    },

    gameOver: function() {
        const notes = [400, 350, 300, 250, 200];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.4, 'square', 0.4), i * 300);
        });
    },

    victory: function() {
        const melody = [523, 659, 784, 1047, 784, 659, 784, 1047];
        melody.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'square', 0.4), i * 150);
        });
    },

    // Background music (simple loop)
    startForestMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playForestLoop();
    },

    playForestLoop: function() {
        if (!this.musicPlaying) return;

        const melody = [262, 294, 330, 349, 392, 349, 330, 294]; // C4 to G4
        melody.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.4, 'triangle', 0.15);
                }
            }, i * 500);
        });

        this.currentMusic = setTimeout(() => this.playForestLoop(), 4000);
    },

    startDungeonMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playDungeonLoop();
    },

    playDungeonLoop: function() {
        if (!this.musicPlaying) return;

        const melody = [147, 165, 175, 196, 175, 165, 147, 131]; // D3 range - darker
        melody.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.5, 'sawtooth', 0.1);
                }
            }, i * 600);
        });

        this.currentMusic = setTimeout(() => this.playDungeonLoop(), 4800);
    },

    startBossMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playBossLoop();
    },

    playBossLoop: function() {
        if (!this.musicPlaying) return;

        // Intense boss music
        const bass = [98, 98, 110, 98, 98, 110, 98, 131]; // Low, intense
        const lead = [392, 440, 466, 440, 392, 349, 392, 440];

        bass.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.3, 'sawtooth', 0.2);
                }
            }, i * 250);
        });

        lead.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.2, 'square', 0.15);
                }
            }, i * 250);
        });

        this.currentMusic = setTimeout(() => this.playBossLoop(), 2000);
    },

    stopMusic: function() {
        this.musicPlaying = false;
        if (this.currentMusic) {
            clearTimeout(this.currentMusic);
            this.currentMusic = null;
        }
    }
};
