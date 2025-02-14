// messageFormatter.js
const { SLACK } = require('./config');
const { logger } = require('./logger');

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

module.exports = {
    createMetadata,
    createSlackBlocks
};