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

function createEmailDetailsBlock(email) {
    return {
        type: "section",
        fields: [
            {
                type: "mrkdwn",
                text: `*From:*\n${email.from.name || email.from.address}`
            },
            {
                type: "mrkdwn",
                text: `*To:*\n${email.to.map(t => t.address).join(', ')}`
            },
            {
                type: "mrkdwn",
                text: `*Subject:*\n${email.subject}`
            },
            {
                type: "mrkdwn",
                text: `*Date:*\n${new Date(email.date).toLocaleString()}`
            }
        ]
    };
}

function createThreadContextBlock(email) {
    if (!email.slackReference?.threadTs) {
        return null;
    }

    return {
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: `:thread: *Thread Context:* Previous messages in thread ${email.slackReference.threadTs}`
            }
        ]
    };
}

function createDividerBlock() {
    return {
        type: "divider"
    };
}

function createAttachmentBlocks(email) {
    if (!email.attachments || email.attachments.length === 0) {
        return [];
    }

    return [
        {
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: `:paperclip: *Attachments:* ${email.attachments.length} file(s)`
                }
            ]
        },
        ...email.attachments.map(attachment => ({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `• ${attachment.filename} (${formatFileSize(attachment.size)})`
            }
        }))
    ];
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
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

// Modify createEnhancedSlackBlocks to handle message formatting
function createEnhancedSlackBlocks(email, messageChunks, sentiment) {
  // Validate and preprocess each chunk
  const processedChunks = messageChunks
      .filter(chunk => validateMessageFormat(chunk))
      .map(chunk => preprocessMessage(chunk));

  if (processedChunks.length === 0) {
      logger.warn('[EmailOrchestrator] No valid message chunks found');
      processedChunks.push('(No message content available)');
  }

  const blocks = [
      ...createHeaderBlock(email.subject, sentiment),
      createEmailDetailsBlock(email),
      createDividerBlock()
  ];

  // Add thread context if it exists
  const threadContext = createThreadContextBlock(email);
  if (threadContext) {
      blocks.push(threadContext);
      blocks.push(createDividerBlock());
  }

  // Add processed message content
  blocks.push(...processedChunks.map(chunk => ({
      type: "section",
      text: {
          type: "mrkdwn",
          text: chunk
      }
  })));

  // Add attachments if they exist
  const attachmentBlocks = createAttachmentBlocks(email);
  if (attachmentBlocks.length > 0) {
      blocks.push(createDividerBlock());
      blocks.push(...attachmentBlocks);
  }

  return blocks;
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


function formatEnhancedSlackPayload(email, sentiment, messageChunks, metadata) {
  // Validate message chunks
  if (!Array.isArray(messageChunks)) {
      logger.error('[EmailOrchestrator] Invalid message chunks format', {
          type: typeof messageChunks
      });
      messageChunks = ['(Message format error)'];
  }

  const blocks = createEnhancedSlackBlocks(email, messageChunks, sentiment);

  // Ensure we don't exceed Slack's limits
  if (blocks.length > 50) {
      logger.warn('[EmailOrchestrator] Too many blocks, truncating message');
      blocks.splice(49, blocks.length - 49);
      blocks.push({
          type: "context",
          elements: [{
              type: "mrkdwn",
              text: "*Note:* Message was truncated due to length"
          }]
      });
  }

  return {
      channel: SLACK.CHANNEL_ID,
      text: `New ${sentiment} email from ${email.from.address}`, // Fallback text
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

function validateMessageFormat(message) {
  if (!message || typeof message !== 'string') {
      logger.error('[EmailOrchestrator] Invalid message format', {
          type: typeof message,
          value: message
      });
      return false;
  }
  return true;
}

function preprocessMessage(message) {
  if (!validateMessageFormat(message)) {
      return '';
  }

  // Remove excessive newlines
  message = message.replace(/\n{3,}/g, '\n\n');
  
  // Remove trailing/leading whitespace from each line
  message = message.split('\n')
      .map(line => line.trim())
      .join('\n');

  // Ensure quoted text is properly formatted
  message = message.replace(/^>(>+)/gm, '>');  // Remove multiple quote levels
  message = message.replace(/^>(?!\s)/gm, '> '); // Ensure space after quote marker

  return message;
}

module.exports = {
    validateMessageFormat,
    preprocessMessage,
    createHeaderBlock,
    createMetadata,
    createEmailDetailsBlock,
    createThreadContextBlock,
    createDividerBlock,
    createAttachmentBlocks,
    createSlackBlocks,
    createEnhancedSlackBlocks,
    formatSlackPayload,
    formatEnhancedSlackPayload,
    splitMessageAtLineBreak
};