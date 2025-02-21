// src/services/queue/MessageQueue.js
const { logger } = require('../../middleware/logger');
const { WebClient } = require("@slack/web-api");
const { SLACK } = require('../../config/config');

class MessageQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.processInterval = 1000; // 1 second between messages
    }

    async addToQueue(team, email, sentiment, client) {
        const message = {
            id: Date.now(),
            team,
            email,
            sentiment,
            client,
            attempts: 0,
            maxAttempts: 3,
            status: 'pending'
        };

        this.queue.push(message);
        logger.debug('Message added to queue', {
            messageId: message.id,
            queueLength: this.queue.length
        });

        if (!this.processing) {
            console.log("stated processing the queue value")
            this.startProcessing();
        }

        return {
            status: 'queued',
            messageId: message.id,
            queueLength: this.queue.length
        };
    }

    startProcessing() {
        this.processing = true;
        this.processQueue();
    }

    async processQueue() {
        while (this.queue.length > 0) {
            const message = this.queue[0];


            try {
                logger.debug('Processing queued message', {
                    messageId: message.id,
                    attempt: message.attempts + 1
                });

                await this.processMessage(message);

                this.queue.shift(); // Remove processed message
                logger.debug('Message processed successfully', {
                    messageId: message.id
                });

            } catch (error) {
                await this.handleProcessingError(message, error);
            }

            // Wait before processing next message
            await new Promise(resolve => setTimeout(resolve, this.processInterval));
        }

        this.processing = false;
    }

    async handleProcessingError(message, error) {
        logger.error('Failed to process message', {
            messageId: message.id,
            error: error.message,
            attempt: message.attempts + 1
        });

        if (message.attempts < message.maxAttempts) {
            message.attempts++;
            // Move to end of queue for retry
            this.queue.shift();
            this.queue.push(message);
        } else {
            // Remove failed message after max attempts
            this.queue.shift();
            logger.error('Message failed all retry attempts', {
                messageId: message.id,
                maxAttempts: message.maxAttempts
            });
        }
    }

    async processMessage(message) {

        const client = new WebClient(SLACK.BOT_TOKEN);

        const { team, email, sentiment } = message;
        // Import and use your existing send function
        const { testSendAsRootMessage } = require('../sendSlackMessageUtils');
        await testSendAsRootMessage(team, email, sentiment, client);
    }

    getQueueStatus() {
        return {
            length: this.queue.length,
            processing: this.processing,
            messages: this.queue.map(msg => ({
                id: msg.id,
                attempts: msg.attempts,
                status: msg.status
            }))
        };
    }
}

// Create and export a singleton instance
const messageQueue = new MessageQueue();
module.exports = messageQueue;