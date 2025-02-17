// src/formatSlackMessageUtils.js

const MessageFormatter = require('../utils/email/formatters/messageFormatter');
const FinalMessageFormatter = require('../utils/slack/formatters/finalMessageFormatter');
const MessageProcessor = require('../utils/email/processors/messageProcessor');
const { logger } = require('../middleware/logger');

/**
 * Main utility class for formatting Slack messages
 * Maintains the original interface while using the modularized components
 */
class FormatSlackMessageUtils {
    static formatRootMessage(email, sentiment) {
        try {
            return MessageFormatter.formatRootMessage(email, sentiment);
        } catch (error) {
            logger.error('Error in formatRootMessage:', error);
            throw error;
        }
    }

    static formatThreadMessage(generatedReply) {
        try {
            return MessageFormatter.formatThreadMessage(generatedReply);
        } catch (error) {
            logger.error('Error in formatThreadMessage:', error);
            throw error;
        }
    }

    static processMessages(messages) {
        try {
            return MessageProcessor.processMessages(messages);
        } catch (error) {
            logger.error('Error in processMessages:', error);
            throw error;
        }
    }

    static extractEmailContent(emailText) {
        try {
            return MessageProcessor.extractEmailContent(emailText);
        } catch (error) {
            logger.error('Error in extractEmailContent:', error);
            throw error;
        }
    }

    static constructHeaderMessage(email, sentiment) {
        try {
            return MessageFormatter.constructHeaderMessage(email, sentiment);
        } catch (error) {
            logger.error('Error in constructHeaderMessage:', error);
            throw error;
        }
    }

    static cleanAndFormatFinalMessage(message) {
        try {
            return FinalMessageFormatter.cleanAndFormatFinalMessage(message);
        } catch (error) {
            logger.error('Error in cleanAndFormatFinalMessage:', error);
            throw error;
        }
    }

    static combineOriginalAndQuotedText(originalText, quotedText) {
        try {
            return FinalMessageFormatter.combineOriginalAndQuotedText(originalText, quotedText);
        } catch (error) {
            logger.error('Error in combineOriginalAndQuotedText:', error);
            throw error;
        }
    }
}

module.exports = FormatSlackMessageUtils;