// messageFormatter.js
const { SLACK } = require('./config');
const { logger } = require('./logger');

function createHeaderBlock(messageText, sentiment) {
    return [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: `New ${sentiment} Reply`,
                emoji: true
            }
        }
    ];
}

function createMetadata(email, team) {
    return {
        event_type: "email_notification",
        event_payload: {
            fromEmail: email.from.address || "Unknown",
            toEmail: email.to[0].address || "Unknown",
            rootEmailId: email._id ? email._id.toString() : undefined,
            rootEmailUID: email.uid?.toString(),
            teamID: team.teamID
        }
    };
}

function createSlackBlocks(messageChunks) {
    return messageChunks.map(chunk => ({
        type: "section",
        text: {
            type: "mrkdwn",
            text: chunk.slice(0, SLACK.MAX_MESSAGE_LENGTH),
        },
    }));
}

function formatSlackPayload(email, sentiment, blocks, metadata) {
    return {
        channel: SLACK.CHANNEL_ID,
        text: SLACK.DEFAULT_TEXT,
        mrkdwn: true,
        blocks,
        metadata,
        ...(email.slackReference?.threadTs && {
            thread_ts: email.slackReference.threadTs
        })
    };
}

function splitMessageAtLineBreak(message, maxLength = SLACK.MAX_MESSAGE_LENGTH) {
    if (!message) {
        logger.warn("[EmailOrchestrator] Empty message received for chunking");
        return [];
    }

    if (typeof message !== 'string') {
        logger.error("[EmailOrchestrator] Invalid message type for chunking");
        return [String(message)];
    }

    logger.debug("[EmailOrchestrator] Splitting message", {
        originalLength: message.length,
        maxChunkSize: maxLength
    });

    if (message.length <= maxLength) {
        return [message];
    }

    const messages = [];
    let currentMessage = "";
    const lines = message.split("\n");

    for (const line of lines) {
        if ((currentMessage + line + "\n").length > maxLength && currentMessage.length > 0) {
            messages.push(currentMessage.trim());
            currentMessage = "";
        }
        currentMessage += line + "\n";
    }

    if (currentMessage.trim()) {
        messages.push(currentMessage.trim());
    }

    return messages;
}

module.exports = {
    createHeaderBlock,
    createMetadata,
    createSlackBlocks,
    formatSlackPayload,
    splitMessageAtLineBreak
};