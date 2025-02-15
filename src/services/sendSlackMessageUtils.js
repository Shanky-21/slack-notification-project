const { WebClient } = require("@slack/web-api");
const { formatRootMessage } = require("../utils/formatSlackMessageUtils");
const {
  convertMarkdownToSlack,
  convertMarkdownLinksToSlackLinks,
  splitMessageAtLineBreak,
} = require("../utils/commonUtils");
const { logger } = require("../middleware/logger");
const { SLACK } = require("../config/config");
const { validateTeam, validateEmail } = require("../utils/validators");
// In both server.js and sendSlackMessageUtils.js
const { messageStore } = require('../utils/storage');  // Instead of './cache'


const formatLongText = (text, prefix = '') => {
  const BLOCK_LIMIT = 2900; // Leave some room for formatting
  
  if (!text || text.length <= BLOCK_LIMIT) {
      return [{
          type: "section",
          text: {
              type: "mrkdwn",
              text: `${prefix}>>>${text}`
          }
      }];
  }

  // Split into chunks
  const blocks = [];
  let remainingText = text;
  let isFirst = true;

  while (remainingText.length > 0) {
      const chunk = remainingText.substring(0, BLOCK_LIMIT);
      remainingText = remainingText.substring(BLOCK_LIMIT);

      blocks.push({
          type: "section",
          text: {
              type: "mrkdwn",
              text: isFirst ? 
                    `<${chunk}>` : // First chunk with prefix and expandable
                  chunk // Subsequent chunks
          }
      });
      isFirst = false;
  }

  return blocks;
};

const chunkText = (text, limit = 2900) => {
  if (!text) return [];
  if (text.length <= limit) return [text];

  logger.debug('Starting text chunking', {
      originalLength: text.length,
      hasNewlines: text.includes('\n'),
      limit
  });

  const chunks = [];
  let currentChunk = '';

  // First try to split by newlines
  const lines = text.split('\n');

  // If there's only one line, split by words
  if (lines.length === 1) {
      logger.debug('No newlines found, splitting by words');
      const words = text.split(' ');
      
      for (const word of words) {
          const potentialChunk = currentChunk ? currentChunk + ' ' + word : word;
          
          if (potentialChunk.length > limit) {
              if (currentChunk) {
                  chunks.push(currentChunk);
                  currentChunk = word;
              } else {
                  // If a single word is too long, split it
                  chunks.push(word.substring(0, limit));
                  currentChunk = word.substring(limit);
              }
          } else {
              currentChunk = potentialChunk;
          }
      }
  } else {
      // Process line by line
      for (const line of lines) {
          const potentialChunk = currentChunk ? currentChunk + '\n' + line : line;
          
          if (potentialChunk.length > limit) {
              if (currentChunk) {
                  chunks.push(currentChunk);
                  currentChunk = line;
              } else {
                  // If a single line is too long, split it by words
                  const lineChunks = chunkText(line, limit);  // Recursive call for long lines
                  chunks.push(...lineChunks);
                  currentChunk = '';
              }
          } else {
              currentChunk = potentialChunk;
          }
      }
  }

  if (currentChunk) {
      chunks.push(currentChunk);
  }

  logger.debug('Text chunking complete', {
      inputLength: text.length,
      chunks: chunks.length,
      chunkSizes: chunks.map(c => c.length)
  });

  return chunks;
};

async function testSendAsRootMessage(team, email, sentiment, client) {
  logger.info("[EmailOrchestrator] Starting Slack message processing...");

  try {
    logger.info("[EmailOrchestrator] Step 1: Input validation");

    // 1. Team validation
    if (!validateTeam(team)) return;

    // 2. Client validation
    if (!client || !client.chat) {
      logger.error("[EmailOrchestrator] Slack client validation failed", {
        client: client ? "exists" : "null",
        chat: client?.chat ? "exists" : "null",
      });
      throw new Error("Invalid Slack client");
    }

    // 3. Email validation
    if (!validateEmail(email, team)) return;

    // 4. Email content validation
    if (!email.subject || !email.from || !email.date) {
      logger.info(
        `[EmailOrchestrator] Skipping malformed email for team ${team.teamID}`,
        {
          hasSubject: !!email.subject,
          hasFrom: !!email.from,
          hasDate: !!email.date,
          emailId: email._id,
        }
      );
      return;
    }

    logger.info(`[EmailOrchestrator] Processing message for team ${team.teamID}`);
    logger.debug('Email details', {
      subject: email.subject,
      from: email.from,
      date: email.date
    });

    // Format the message
    logger.info("[EmailOrchestrator] Step 2: Formatting message text");
    const { originalText, quotedText   } = formatRootMessage(email, sentiment);

    logger.debug("[EmailOrchestrator] Formatted message", { 
        hasOriginalText: !!originalText,
        quotedTextCount: quotedText.length
    });

    // Process the message for Slack formatting
    // const slackFormattedMessage = convertMarkdownToSlack(messageContent);
    // const slackFormattedMessageWithLinks = convertMarkdownLinksToSlackLinks(
    //   slackFormattedMessage
    // );

    // Create metadata
    logger.info("[EmailOrchestrator] Step 3: Creating metadata");
    const metadata = {
      event_type: "email_notification",
      event_payload: {
          fromEmail: email.from.address,
          toEmail: email.to[0].address,
          rootEmailId: email._id?.toString(),
          rootEmailUID: email.uid?.toString(),
          teamID: team.teamID
      }
    };

    const messageId = email._id?.$oid || 
                         email._id?.toString() || 
                         Date.now().toString();


    logger.debug('Storing message content', {
        messageId,
        originalTextLength: originalText?.length,
        quotedTextCount: quotedText?.length
    });

    // Store in cache
    messageStore.set(messageId, {
        originalText,
        quotedText
    });

    // Verify storage
    const storedContent = messageStore.get(messageId);
    logger.debug('Verified message storage', {
        messageId,
        wasStored: !!storedContent,
        cacheSize: messageStore.size()
    });


    // Create the Slack payload with proper block structure
    const slackPayload = {
      channel: SLACK.CHANNEL_ID,
      text: `New ${sentiment} email from ${email.from.address}`,
      blocks: [
        // Header Block with Title
        {
          type: "section",
          text: {
              type: "mrkdwn",
              text: `*New ${sentiment} Reply*`
          }
        },
        // Email Details in a clean format
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*From:*\n${email.from.name} ${email.from.address}`  // Added email address
            },
            {
              type: "mrkdwn",
              text: `*To:*\n${email.to[0].address}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Subject:*\n${email.subject}`
            },
            {
              type: "mrkdwn",
              text: `*Date:*\n${new Date(email.createdAt.$date).toLocaleString()}`
            }
          ]
        },
        // First, add the header
        {
          type: "section",
          text: {
              type: "mrkdwn",
              text: "*Latest Reply:*"
          }
      },
      {
          type: "section",
          text: {
              type: "mrkdwn",
              text: originalText.substring(0, 1000)
          }
      },
      ...(originalText.length > 1000 ? [{
          type: "actions",
          elements: [{
              type: "button",
              text: {
                  type: "plain_text",
                  text: `Show More (${Math.ceil(originalText.length / 1000)} parts)`,
                  emoji: true
              },
              value: JSON.stringify({
                  type: 'latest_reply',
                  messageId: messageId,
                  currentChunk: 1,
                  totalChunks: Math.ceil(originalText.length / 1000)
              }),
              action_id: "show_more_content"
          }]
      }] : []),
        {
          type: "divider"
        },
        // Thread Context after Latest Reply
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `📎 Thread Context: Previous messages in thread ${email.slackReference?.threadTs}`
            }
          ]
        },
        {
          type: "divider"
        },
        // Previous Messages Section
        ...(quotedText.length > 0 ? [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Previous Messages:*"
                }
            },
            ...quotedText.map((quote, index) => [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*From:* ${quote.author}\n*Date:* ${quote.date}\n${quote.content.substring(0, 1000).split('>').join("\n> ")}`
                    }
                },
                ...(quote.content.length > 1000 ? [{
                    type: "actions",
                    elements: [{
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: `Show More (${Math.ceil(quote.content.length / 1000)} parts)`,
                            emoji: true
                        },
                        value: JSON.stringify({
                            type: 'quoted_reply',
                            messageId: messageId,
                            quoteIndex: index,
                            currentChunk: 1,
                            totalChunks: Math.ceil(quote.content.length / 1000)
                        }),
                        action_id: "show_more_content"
                    }]
                }] : [])
            ]).flat()
        ] : [])
      ],
      metadata: metadata,
      ...(email.slackReference?.threadTs && {
        thread_ts: email.slackReference.threadTs
      })
    };

    // Add CC and BCC if they exist
    if (email.cc?.length > 0) {
      slackPayload.blocks.splice(2, 0, {
        type: "context",
        elements: [{
          type: "mrkdwn",
          text: `*CC:* ${email.cc.map(cc => cc.address).join(', ')}`
        }]
      });
    }

    if (email.bcc?.length > 0) {
      slackPayload.blocks.splice(email.cc?.length > 0 ? 3 : 2, 0, {
        type: "context",
        elements: [{
          type: "mrkdwn",
          text: `*BCC:* ${email.bcc.map(bcc => bcc.address).join(', ')}`
        }]
      });
    }

    logger.debug('Sending message with payload:', { 
      channel: slackPayload.channel,
      blocksCount: slackPayload.blocks.length,
      hasThread: !!slackPayload.thread_ts
    });

    // Send the message
    const response = await client.chat.postMessage(slackPayload);

    logger.info('[EmailOrchestrator] Message sent successfully', {
      messageTs: response.ts
    });

    // Store for 24 hours then delete
    setTimeout(() => {
      messageStore.delete(email._id);
  }, 24 * 60 * 60 * 1000);

    return {
      messageTs: response.ts,
      metadata: metadata
    };

  } catch (error) {
    logger.error(
      `[EmailOrchestrator] Error sending Slack message for team ${team.teamID}:`,
      error
    );
    console.error("Error details:", error);
    throw error;
  }
}

module.exports = {
  testSendAsRootMessage,
};