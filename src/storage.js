// storage.js
const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

const STORAGE_FILE = path.join(__dirname, 'message-store.json');

const messageStore = {
    set: (key, value) => {
        try {
            // Read existing data
            let data = {};
            if (fs.existsSync(STORAGE_FILE)) {
                data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
            }

            // Add new data
            data[key] = value;

            // Write back to file
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));

            logger.debug('Stored message', {
                key,
                contentLength: value.originalText?.length
            });

            return true;
        } catch (error) {
            logger.error('Error storing message', error);
            return false;
        }
    },

    get: (key) => {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
                return data[key];
            }
        } catch (error) {
            logger.error('Error retrieving message', error);
        }
        return null;
    },

    keys: () => {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
                return Object.keys(data);
            }
        } catch (error) {
            logger.error('Error getting keys', error);
        }
        return [];
    },

    size: () => {
        return messageStore.keys().length;
    },

    clear: () => {
        try {
            fs.writeFileSync(STORAGE_FILE, '{}');
            return true;
        } catch (error) {
            logger.error('Error clearing storage', error);
            return false;
        }
    }
};

module.exports = { messageStore };