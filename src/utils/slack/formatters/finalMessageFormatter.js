const TextFormatter = require('../../email/formatters/textFormatter');
const { logger } = require('../../../middleware/logger');

class FinalMessageFormatter {
    static combineOriginalAndQuotedText(originalText, quotedText) {
        try {
            const combinedMessage = this._createCombinedMessage(originalText, quotedText);
            return TextFormatter.removeDoubleChevron(combinedMessage.trim());
        } catch (error) {
            logger.error('Error combining original and quoted text:', error);
            throw new Error('Failed to combine message texts');
        }
    }

    static cleanAndFormatFinalMessage(message) {
        try {
            const cleanedMessage = this._cleanMessage(message);
            return TextFormatter.formatSlackLinksAndEmails(cleanedMessage);
        } catch (error) {
            logger.error('Error cleaning and formatting final message:', error);
            throw new Error('Failed to format final message');
        }
    }

    // Private helper methods
    static _createCombinedMessage(originalText, quotedText) {
        const formattedQuotedText = quotedText
            .map(line => line.replace(/>/g, '\n>'))
            .join('> ');
        
        return `\n${originalText.join('\n').trim()}${TextFormatter.prefixedFinalMessage(formattedQuotedText)}`;
    }

    static _cleanMessage(message) {
        return message
            .replace(/(> *\n> *\n)+/g, '>\n')
            .replace(/>\s*$/g, '');
    }
}

module.exports = FinalMessageFormatter;