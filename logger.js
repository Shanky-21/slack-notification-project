// logger.js
const logger = {
  info: (message) => {
      console.log(`[${new Date().toISOString()}] [INFO] ${message}`);
  },
  error: (message, error) => {
      console.error(`[${new Date().toISOString()}] [ERROR] ${message}`);
      if (error) {
          console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              ...(error.response && { response: error.response.data })
          });
      }
  },
  warn: (message) => {
      console.warn(`[${new Date().toISOString()}] [WARN] ${message}`);
  },
  debug: (message, data) => {
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${message}`);
      if (data) {
          console.debug('Debug data:', data);
      }
  }
};

module.exports = { logger };