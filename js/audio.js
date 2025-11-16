// 8-bit Audio System for Captain Arcsis
// Uses Web Audio API to generate retro sound effects

const Audio = {
    context: null,
    masterVolume: 0.5,
    musicPlaying: false,
    currentMusic: null,
    currentMusicSource: null,
    musicBuffers: {},
    loadedMusic: {},

    init: function() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        // Preload WAV music files
        this.loadMusicFile('forest_theme', 'forest_theme.wav');
        this.loadMusicFile('dungeon_theme', 'dungeon_theme.wav');
    },

    loadMusicFile: function(name, url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.musicBuffers[name] = audioBuffer;
                console.log(`Loaded music: ${name}`);
            })
            .catch(err => console.log(`Could not load ${name}:`, err));
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

    // Arcsis Spin Attack Sound
    spinAttack: function() {
        // Whooshing spin sound
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.playTone(300 + i * 100, 0.15, 'sawtooth', 0.4), i * 50);
        }
        // Impact sound
        setTimeout(() => {
            this.playTone(100, 0.3, 'square', 0.6);
            this.playTone(80, 0.4, 'sawtooth', 0.5);
        }, 400);
    },

    // Heart lost sound
    heartLost: function() {
        this.playTone(200, 0.2, 'square', 0.6);
        setTimeout(() => this.playTone(150, 0.3, 'square', 0.5), 150);
        setTimeout(() => this.playTone(100, 0.4, 'square', 0.4), 300);
    },

    // Special ability charge
    specialCharge: function() {
        const notes = [523, 659, 784, 1047, 1319]; // C5 to E6
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15, 'sine', 0.5), i * 100);
        });
    },

    // Dash sound
    dash: function() {
        this.playTone(500, 0.1, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(700, 0.08, 'sawtooth', 0.2), 50);
    },

    // Combo hit sound
    comboHit: function(comboCount) {
        const pitch = 400 + comboCount * 50;
        this.playTone(pitch, 0.08, 'square', 0.4);
    },

    // Power-up collected
    powerUpCollect: function() {
        const notes = [880, 1047, 1319, 1568];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'triangle', 0.4), i * 80);
        });
    },

    // Play actual WAV music file
    playMusicFile: function(name) {
        if (!this.musicBuffers[name]) return false;

        // Stop any current music source
        if (this.currentMusicSource) {
            this.currentMusicSource.stop();
            this.currentMusicSource = null;
        }

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = this.musicBuffers[name];
        source.loop = true;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        gainNode.gain.value = this.masterVolume * 0.6;

        source.start();
        this.currentMusicSource = source;
        this.loadedMusic[name] = { source, gainNode };

        return true;
    },

    // Background music (simple loop)
    startForestMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;

        // Try to play WAV file first, fallback to generated
        if (!this.playMusicFile('forest_theme')) {
            this.playForestLoop();
        }
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

        // Try to play WAV file first, fallback to generated
        if (!this.playMusicFile('dungeon_theme')) {
            this.playDungeonLoop();
        }
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

    // Start crystal caverns music
    startCrystalMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playCrystalLoop();
    },

    playCrystalLoop: function() {
        if (!this.musicPlaying) return;

        // Crystalline, ethereal melody
        const melody = [659, 784, 880, 988, 880, 784, 659, 587]; // E5 range - sparkly
        melody.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.3, 'sine', 0.2);
                    this.playTone(note * 1.5, 0.2, 'triangle', 0.1); // Shimmer
                }
            }, i * 400);
        });

        this.currentMusic = setTimeout(() => this.playCrystalLoop(), 3200);
    },

    // Start shadow realm music
    startShadowMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playShadowLoop();
    },

    playShadowLoop: function() {
        if (!this.musicPlaying) return;

        // Dark, ominous melody
        const melody = [98, 110, 98, 87, 98, 110, 131, 110]; // Very low - dark
        melody.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.6, 'sawtooth', 0.15);
                }
            }, i * 700);
        });

        this.currentMusic = setTimeout(() => this.playShadowLoop(), 5600);
    },

    // Start sky citadel music
    startSkyMusic: function() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.playSkyLoop();
    },

    playSkyLoop: function() {
        if (!this.musicPlaying) return;

        // Airy, majestic melody
        const melody = [523, 659, 784, 1047, 784, 659, 523, 440]; // C5 range - uplifting
        melody.forEach((note, i) => {
            setTimeout(() => {
                if (this.musicPlaying) {
                    this.playTone(note, 0.35, 'triangle', 0.2);
                }
            }, i * 450);
        });

        this.currentMusic = setTimeout(() => this.playSkyLoop(), 3600);
    },

    stopMusic: function() {
        this.musicPlaying = false;
        if (this.currentMusic) {
            clearTimeout(this.currentMusic);
            this.currentMusic = null;
        }
        // Stop WAV music if playing
        if (this.currentMusicSource) {
            this.currentMusicSource.stop();
            this.currentMusicSource = null;
        }
    }
};
