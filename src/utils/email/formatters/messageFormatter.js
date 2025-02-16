const dayjs = require('dayjs');
const { logger } = require('../../../middleware/logger');
const TextFormatter = require('../../email/formatters/textFormatter');
const MessageProcessor = require('../processors/messageProcessor'); // Add this import

class MessageFormatter {
    static formatRootMessage(email, sentiment) {
        try {
            if (!email || !email.text) {
                throw new Error('Invalid email data provided');
            }

            // Use MessageProcessor instead of undefined internal methods
            const messages = MessageProcessor.extractEmailContent(email.text);
            const { originalText, quotedText } = MessageProcessor.processMessages(messages);

            logger.debug('Formatting root message:', {
                hasOriginalText: !!originalText,
                quotedTextCount: quotedText?.length,
                emailText: email.text.substring(0, 100) + '...' // Log first 100 chars for debugging
            });

            return {
                originalText,
                quotedText
            };
        } catch (error) {
            logger.error('Error formatting root message:', {
                error: error.message,
                stack: error.stack,
                emailId: email?.id
            });
            throw new Error('Failed to format root message');
        }
    }
    static constructHeaderMessage(email, sentiment) {
        try {
            const {
                subject,
                fromName,
                fromAddress,
                toAddress,
                formattedDate
            } = this._extractEmailMetadata(email);

            const ccList = this._formatCCList(email.cc);
            const bccList = this._formatBCCList(email.bcc);

            return this._assembleHeaderMessage(
                sentiment,
                subject,
                fromName,
                fromAddress,
                toAddress,
                formattedDate,
                ccList,
                bccList
            );
        } catch (error) {
            logger.error('Error constructing header message:', error);
            throw new Error('Failed to construct header message');
        }
    }

    static formatThreadMessage(generatedReply) {
        try {
            return `*Generated Reply:*\n\n${TextFormatter.escapeMarkdown(generatedReply)}`;
        } catch (error) {
            logger.error('Error formatting thread message:', error);
            throw new Error('Failed to format thread message');
        }
    }

    // Private helper methods
    static _extractEmailMetadata(email) {
        const subject = email.subject || '(No subject)';
        const fromName = email.from.name || email.from.address;
        const fromAddress = email.from.address;
        const toAddress = email.to[0].address;
        const date = dayjs(email.date);

        if (!date.isValid()) {
            logger.error(`Invalid date format: ${email.date}`);
        }

        return {
            subject,
            fromName,
            fromAddress,
            toAddress,
            formattedDate: date.format('MM/DD/YYYY') || '(No date)'
        };
    }

    static _formatCCList(cc) {
        if (!cc || cc.length === 0) return '';
        
        const ccString = cc
            .map(cc => `${TextFormatter.escapeMarkdown(cc.name || cc.address)} ${cc.address}`)
            .join(', ');
        
        return `*CC:* ${ccString}\n`;
    }

    static _formatBCCList(bcc) {
        if (!bcc || bcc.length === 0) return '';
        
        const bccString = bcc
            .map(bcc => `${TextFormatter.escapeMarkdown(bcc.name || bcc.address)} ${bcc.address}`)
            .join(', ');
        
        return `*BCC:* ${bccString}\n`;
    }

    static _assembleHeaderMessage(
        sentiment,
        subject,
        fromName,
        fromAddress,
        toAddress,
        formattedDate,
        ccList,
        bccList
    ) {
        return [
            `:mailbox_with_mail: *New ${sentiment} Reply*`,
            `*Subject:* *${TextFormatter.escapeMarkdown(subject)}*`,
            `*From:* ${TextFormatter.escapeMarkdown(fromName)} ${fromAddress}`,
            `*To:* ${toAddress}`,
            ccList,
            bccList,
            `*Date:* ${formattedDate}`
        ].filter(Boolean).join('\n');
    }
}

module.exports = MessageFormatter;