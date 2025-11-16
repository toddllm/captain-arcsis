// Dialogue System for Captain Arcsis
// Interactive conversations and story progression

const Dialogue = {
    active: false,
    currentDialogue: null,
    currentLineIndex: 0,
    displayedText: '',
    targetText: '',
    textSpeed: 50, // ms per character
    lastCharTime: 0,
    waitingForInput: false,
    choices: [],
    selectedChoice: 0,

    // Story dialogues
    dialogues: {
        intro: {
            speaker: 'Narrator',
            lines: [
                "Deep in the enchanted forest, a young boy named Arcsis walks alone...",
                "The trees whisper ancient secrets as he explores the unknown path...",
                "Suddenly, he spots something strange - a glowing red button on a stone pedestal!",
                "Curious, Arcsis reaches out to touch it..."
            ],
            onComplete: 'button_press'
        },

        button_press: {
            speaker: 'Arcsis',
            lines: [
                "What is this? It's glowing...",
                "Should I press it? It looks mysterious...",
                "*presses the button*"
            ],
            onComplete: 'trap_activated'
        },

        trap_activated: {
            speaker: 'Narrator',
            lines: [
                "*CLICK*",
                "The ground beneath Arcsis begins to shake!",
                "A dark portal opens, pulling him into the depths below!",
                "ARCSIS FALLS INTO THE DUNGEON!"
            ],
            onComplete: 'dungeon_arrival'
        },

        dungeon_arrival: {
            speaker: 'Arcsis',
            lines: [
                "Ouch! Where am I?",
                "It's so dark... and cold...",
                "I need to find a way out of here!",
                "Wait, what's that sound? Something is coming!"
            ],
            onComplete: null
        },

        meet_fairy: {
            speaker: 'Fairy',
            lines: [
                "*sparkle sparkle*",
                "Hello there, young one!",
                "I am a fairy from the enchanted forest!",
                "I sensed your presence when you activated that cursed button.",
                "You're trapped in the Dark Dungeon now...",
                "But don't worry! I'll help you escape!",
                "Together, we can defeat the monsters and solve the puzzles!",
                "Press F to use my magic powers when you need them!"
            ],
            onComplete: 'fairy_joined'
        },

        skeleton_encounter: {
            speaker: 'Fairy',
            lines: [
                "Be careful, Arcsis!",
                "That's a Skeleton Knight - they're very tough!",
                "Even the weakest enemies here are dangerous!",
                "Use your sword wisely and watch your shield!"
            ],
            onComplete: null
        },

        zombie_encounter: {
            speaker: 'Fairy',
            lines: [
                "Zombies! They regenerate health over time!",
                "You need to defeat them quickly!",
                "Don't let them surround you!"
            ],
            onComplete: null
        },

        puzzle_hint: {
            speaker: 'Fairy',
            lines: [
                "Hmm, this looks like a puzzle...",
                "Look for patterns and interact with the switches.",
                "Some doors need keys, others need levers.",
                "Be patient and think carefully!"
            ],
            onComplete: null
        },

        origami_mirda_pre: {
            speaker: 'Fairy',
            lines: [
                "I sense immense power ahead...",
                "It's Origami Mirda - the Lightning Goddess!",
                "She was once a benevolent deity, but now she's made of paper...",
                "Her lightning attacks are devastating!",
                "Be very careful, Arcsis!"
            ],
            onComplete: null
        },

        anizon_pre: {
            speaker: 'Fairy',
            lines: [
                "Arcsis... I... I can't believe it...",
                "The presence I feel... it's OVERWHELMING!",
                "ANIZON - The University Destroyer is here!",
                "He is the STRONGEST, MOST POWERFUL being in this realm!",
                "Even the mightiest armor and sharpest swords are USELESS against him!",
                "He can teleport, summon monster horsemen, and his attacks are INSANE!",
                "This will be the toughest battle of your life...",
                "But I believe in you, Captain Arcsis!"
            ],
            onComplete: null
        },

        victory: {
            speaker: 'Narrator',
            lines: [
                "Against all odds, Captain Arcsis has done the impossible!",
                "The mighty Anizon has been defeated!",
                "The dungeon's curse begins to lift...",
                "A portal of light opens before our hero!"
            ],
            onComplete: 'ending'
        },

        ending: {
            speaker: 'Arcsis',
            lines: [
                "We did it! We actually did it!",
                "Thank you, Fairy! I couldn't have done it without you!",
                "Now I can finally go home...",
                "But something tells me this isn't the end of my journey...",
                "Captain Arcsis Yellow, Red, Green, and Blue await!",
                "Until next time!"
            ],
            onComplete: 'game_complete'
        }
    },

    start: function(dialogueKey) {
        const dialogue = this.dialogues[dialogueKey];
        if (!dialogue) return;

        this.active = true;
        this.currentDialogue = dialogue;
        this.currentLineIndex = 0;
        this.displayedText = '';
        this.targetText = dialogue.lines[0];
        this.lastCharTime = Date.now();
        this.waitingForInput = false;

        Audio.dialogueBeep();
    },

    update: function(deltaTime) {
        if (!this.active) return;

        // Typewriter effect
        if (this.displayedText.length < this.targetText.length) {
            const now = Date.now();
            if (now - this.lastCharTime >= this.textSpeed) {
                this.displayedText += this.targetText[this.displayedText.length];
                this.lastCharTime = now;

                // Sound for each character
                if (this.displayedText.length % 3 === 0) {
                    Audio.dialogueBeep();
                }
            }
        } else {
            this.waitingForInput = true;
        }

        // Handle input
        if (Input.wasJustPressed('Space') || Input.wasJustPressed('Enter') || Input.wasJustPressed('KeyE')) {
            if (this.waitingForInput) {
                this.nextLine();
            } else {
                // Skip to end of current line
                this.displayedText = this.targetText;
                this.waitingForInput = true;
            }
        }
    },

    nextLine: function() {
        this.currentLineIndex++;

        if (this.currentLineIndex >= this.currentDialogue.lines.length) {
            // Dialogue complete
            this.end();
        } else {
            // Next line
            this.targetText = this.currentDialogue.lines[this.currentLineIndex];
            this.displayedText = '';
            this.waitingForInput = false;
            this.lastCharTime = Date.now();
        }
    },

    end: function() {
        const callback = this.currentDialogue.onComplete;
        this.active = false;
        this.currentDialogue = null;

        Audio.menuSelect();

        // Handle callbacks
        if (callback === 'fairy_joined') {
            Fairy.activate(Player);
        } else if (callback === 'game_complete') {
            Game.showGameComplete();
        }

        return callback;
    },

    draw: function(ctx) {
        if (!this.active) return;

        ctx.save();

        // Dialogue box
        const boxWidth = 700;
        const boxHeight = 120;
        const boxX = (CONSTANTS.CANVAS_WIDTH - boxWidth) / 2;
        const boxY = CONSTANTS.CANVAS_HEIGHT - boxHeight - 20;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Speaker name
        ctx.font = '16px monospace';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'left';
        ctx.fillText(this.currentDialogue.speaker, boxX + 15, boxY + 25);

        // Dialogue text (with word wrap)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px monospace';

        const maxWidth = boxWidth - 30;
        const lineHeight = 20;
        const words = this.displayedText.split(' ');
        let line = '';
        let y = boxY + 50;

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                ctx.fillText(line, boxX + 15, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, boxX + 15, y);

        // Continue indicator
        if (this.waitingForInput) {
            ctx.fillStyle = '#FFFF00';
            const blinkRate = Math.floor(Date.now() / 500) % 2;
            if (blinkRate) {
                ctx.fillText('▼ Press SPACE to continue', boxX + boxWidth - 220, boxY + boxHeight - 15);
            }
        }

        // Progress indicator
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'right';
        ctx.fillText(
            `${this.currentLineIndex + 1}/${this.currentDialogue.lines.length}`,
            boxX + boxWidth - 15,
            boxY + 25
        );

        ctx.restore();
    },

    isActive: function() {
        return this.active;
    }
};
