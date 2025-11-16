// Save/Load System for Captain Arcsis
// Persistent progress storage using localStorage

const SaveSystem = {
    SAVE_KEY: 'captain_arcsis_save',
    AUTO_SAVE_INTERVAL: 60000, // Auto-save every 60 seconds
    lastAutoSave: 0,

    save: function(gameData) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                player: Player.getSaveData(),
                currentLevel: gameData.currentLevel,
                currentArea: gameData.currentArea,
                puzzles: Puzzles.getSaveData(),
                defeatedBosses: gameData.defeatedBosses || [],
                playTime: gameData.playTime || 0,
                coins: Player.coins,
                questFlags: Player.questFlags
            };

            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));

            Audio.saveGame();
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    },

    load: function() {
        try {
            const savedString = localStorage.getItem(this.SAVE_KEY);

            if (!savedString) {
                return null;
            }

            const saveData = JSON.parse(savedString);

            // Version check (for future compatibility)
            if (!saveData.version) {
                console.warn('Old save format detected');
            }

            return saveData;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    },

    applyLoadData: function(saveData) {
        if (!saveData) return false;

        try {
            Player.loadSaveData(saveData.player);

            if (saveData.puzzles) {
                Puzzles.loadSaveData(saveData.puzzles);
            }

            return {
                currentLevel: saveData.currentLevel || 1,
                currentArea: saveData.currentArea || 'dungeon_1',
                defeatedBosses: saveData.defeatedBosses || [],
                playTime: saveData.playTime || 0
            };
        } catch (error) {
            console.error('Failed to apply save data:', error);
            return false;
        }
    },

    deleteSave: function() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    },

    hasSaveData: function() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    autoSave: function(gameData) {
        const now = Date.now();

        if (now - this.lastAutoSave >= this.AUTO_SAVE_INTERVAL) {
            this.save(gameData);
            this.lastAutoSave = now;
            console.log('Auto-saved');
        }
    },

    getSaveInfo: function() {
        const saveData = this.load();

        if (!saveData) {
            return null;
        }

        return {
            timestamp: new Date(saveData.timestamp).toLocaleString(),
            level: saveData.player.level,
            coins: saveData.player.coins,
            playTime: Utils.formatTime(saveData.playTime / 1000),
            area: saveData.currentArea
        };
    },

    exportSave: function() {
        const saveData = localStorage.getItem(this.SAVE_KEY);
        if (!saveData) return null;

        // Encode to base64 for easy sharing
        return btoa(saveData);
    },

    importSave: function(encodedData) {
        try {
            const saveData = atob(encodedData);
            JSON.parse(saveData); // Validate JSON
            localStorage.setItem(this.SAVE_KEY, saveData);
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }
};
