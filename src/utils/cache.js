// cache.js
const NodeCache = require('node-cache');
const { logger } = require('../middleware/logger');

// Initialize cache with 24 hours TTL (time to live)
const cache = new NodeCache({ 
    stdTTL: 24 * 60 * 60, // 24 hours in seconds
    checkperiod: 60 * 60   // Check for expired keys every hour
});

// Wrapper for our cache operations
const messageStore = {
    set: (key, value) => {
        logger.debug('Storing message in cache', {
            key,
            contentLength: value.originalText?.length
        });
        return cache.set(key, value);
    },

    get: (key) => {
        const value = cache.get(key);
        logger.debug('Retrieving from cache', {
            key,
            found: !!value
        });
        return value;
    },

    delete: (key) => {
        logger.debug('Deleting from cache', { key });
        return cache.del(key);
    },

    clear: () => {
        logger.debug('Clearing cache');
        return cache.flushAll();
    },

    getStats: () => {
        const stats = cache.getStats();
        logger.debug('Cache stats', stats);
        return stats;
    },

    keys: () => {
        return cache.keys();
    },

    size: () => {
        return cache.keys().length;
    }
};

module.exports = { messageStore };