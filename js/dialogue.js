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
            speaker: 'Lica',
            lines: [
                "*A brilliant light fills the room*",
                "Greetings, young warrior.",
                "I am Lica, the Eternal Guardian - the most powerful being in all existence.",
                "For eons, I have watched over the realms from beyond time itself.",
                "I sensed your pure heart when you activated that cursed button.",
                "You're trapped in the Dark Dungeon now, but fear not...",
                "My power transcends all darkness. Even the gods bow before me.",
                "Together, we shall overcome any obstacle!",
                "Press F to channel my divine magic through you!"
            ],
            onComplete: 'fairy_joined'
        },

        skeleton_encounter: {
            speaker: 'Lica',
            lines: [
                "A Skeleton Knight approaches, Arcsis.",
                "To most mortals, these creatures are fearsome...",
                "But compared to the beings I have faced across millennia, they are mere insects.",
                "Still, be cautious. I shall lend you my strength."
            ],
            onComplete: null
        },

        zombie_encounter: {
            speaker: 'Lica',
            lines: [
                "Zombies - creatures cursed with unholy regeneration.",
                "In my true form, I could obliterate them with a thought...",
                "But this is your journey, Arcsis. Defeat them quickly before they regenerate!",
                "My power flows through you - use it wisely!"
            ],
            onComplete: null
        },

        puzzle_hint: {
            speaker: 'Lica',
            lines: [
                "A puzzle blocks our path...",
                "I have solved riddles that would break lesser minds across infinite dimensions.",
                "Look for the patterns - switches, levers, and keys hold the answer.",
                "Your intelligence grows stronger, young Captain."
            ],
            onComplete: null
        },

        origami_mirda_pre: {
            speaker: 'Lica',
            lines: [
                "I sense a powerful presence ahead...",
                "Origami Mirda - once called the Lightning Goddess.",
                "She was a deity of great power in her realm...",
                "But even she is nothing compared to my eternal might.",
                "Still, do not underestimate her. Her lightning is deadly!",
                "Fight with courage, Arcsis. I am always with you."
            ],
            onComplete: null
        },

        anizon_pre: {
            speaker: 'Lica',
            lines: [
                "Arcsis... *her form glows intensely*",
                "The presence I feel... it's quite formidable.",
                "ANIZON - The University Destroyer stands before us!",
                "Many consider him the strongest being in this realm...",
                "*laughs softly* But he knows nothing of TRUE power.",
                "In my full form, I could unmake him from existence itself.",
                "However, this is your battle to fight, your legend to forge.",
                "He can teleport, summon horsemen, tear reality apart...",
                "But you have ME, the Eternal Guardian, by your side!",
                "Show him the strength of your heart, Captain Arcsis!"
            ],
            onComplete: null
        },

        lica_revelation: {
            speaker: 'Lica',
            lines: [
                "*Lica's form begins to shimmer with impossible radiance*",
                "Arcsis... you have proven yourself more than worthy.",
                "It is time you learned the truth of who I am.",
                "I am not merely a fairy - I am the Eternal Guardian.",
                "Before the universe existed, I was there. When it ends, I shall remain.",
                "I have defeated gods, destroyed dimensions, and rewritten the laws of reality.",
                "Anizon, the bosses, even the Eternal Emperor... they are like children compared to me.",
                "But I choose to help you, not because you need me...",
                "But because your pure heart deserves to have the strongest ally possible.",
                "Now... let me show you a FRACTION of my true power!"
            ],
            onComplete: 'lica_true_form'
        },

        // STORY TWIST: Mom is trapped in the dungeon!
        find_mom_prison: {
            speaker: 'Arcsis',
            lines: [
                "Wait... what is that behind those bars?",
                "*runs toward the prison cell*",
                "No... it can't be... MOM?!",
                "MOM! Can you hear me?! It's me, Arcsis!"
            ],
            onComplete: 'mom_responds'
        },

        mom_responds: {
            speaker: 'Mother',
            lines: [
                "*weakly looks up*",
                "A-Arcsis...? Is that really you, my son?",
                "I thought I'd never see you again...",
                "That monster... Anizon... he captured me weeks ago...",
                "He said if I ever tried to escape, he would destroy our village!",
                "Please, you must be careful! He's too powerful!"
            ],
            onComplete: 'arcsis_promise'
        },

        arcsis_promise: {
            speaker: 'Arcsis',
            lines: [
                "Mom, don't worry! I'm going to save you!",
                "I've become stronger - I'm Captain Arcsis now!",
                "And I have Lica, the most powerful being in existence, helping me!",
                "We WILL defeat Anizon and free you!",
                "*grips sword tightly*",
                "I promise you, Mom. I won't let him hurt anyone else!"
            ],
            onComplete: 'lica_mom_support'
        },

        lica_mom_support: {
            speaker: 'Lica',
            lines: [
                "*glows warmly*",
                "Your mother's life force is weakening, Arcsis...",
                "But fear not. I have placed a protection spell on her.",
                "She will be safe until we defeat Anizon.",
                "This cell requires a special key - the Anizon Heart Key.",
                "You must defeat him to obtain it.",
                "Your love for your mother gives you strength beyond measure.",
                "Let us continue forward and end this evil!"
            ],
            onComplete: 'mom_found'
        },

        mom_rescue_success: {
            speaker: 'Narrator',
            lines: [
                "*The prison bars shatter as Arcsis uses the Anizon Heart Key*",
                "The magical chains dissolve into light!",
                "At last, after weeks of captivity, mother and son are reunited!"
            ],
            onComplete: 'mom_free_dialogue'
        },

        mom_free_dialogue: {
            speaker: 'Mother',
            lines: [
                "*embraces Arcsis tightly*",
                "My brave boy... you've become so strong!",
                "I always knew you were destined for greatness.",
                "*tears of joy*",
                "Thank you, Lica, for protecting my son.",
                "And thank YOU, Arcsis, for never giving up hope!"
            ],
            onComplete: 'lica_mom_blessing'
        },

        lica_mom_blessing: {
            speaker: 'Lica',
            lines: [
                "*bows respectfully*",
                "Your son has a heart of pure gold.",
                "It has been my honor to guide him.",
                "The bond between mother and child... even my infinite power respects it.",
                "Now go, both of you. The portal home awaits.",
                "Arcsis... you have become a true hero. Never forget that."
            ],
            onComplete: 'family_ending'
        },

        // PLOT TWIST: The button was a trap by Anizon
        anizon_truth_reveal: {
            speaker: 'Anizon',
            lines: [
                "*laughs maniacally*",
                "You FOOL! Did you really think that button was random?",
                "I PLACED it there specifically for YOU, Arcsis!",
                "I've been watching your family for years!",
                "Your mother was just BAIT to lure you here!",
                "And now, with your arrival, my power grows even STRONGER!",
                "Every hero that falls makes me MORE INVINCIBLE!"
            ],
            onComplete: 'lica_counters'
        },

        lica_counters: {
            speaker: 'Lica',
            lines: [
                "*steps forward, radiating immense power*",
                "Your schemes end here, Anizon.",
                "You may have orchestrated this trap...",
                "But you made one FATAL mistake.",
                "You drew the attention of ME - LICA, THE ETERNAL GUARDIAN!",
                "Your power is impressive for a mortal realm...",
                "But I have existed since before time itself!",
                "Arcsis, let us show him the TRUE meaning of power!"
            ],
            onComplete: null
        },

        // SECRET TWIST: Lica knows Arcsis's destiny
        lica_destiny_secret: {
            speaker: 'Lica',
            lines: [
                "*speaks solemnly*",
                "Arcsis... there is something I must tell you.",
                "I did not find you by accident.",
                "Across infinite timelines, I have searched for the one...",
                "The one with a heart pure enough to wield the Ultimate Weapon.",
                "You are that person, Arcsis.",
                "The trials you face now are preparing you for something far greater.",
                "One day, you will face the TRUE enemy - the Void Eternal.",
                "And on that day, even my power will not be enough alone.",
                "Together, we will need to save not just this world, but ALL worlds."
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
