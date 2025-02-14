const { WebClient } = require("@slack/web-api");
const { formatRootMessage } = require("./formatSlackMessageUtils");
const {
  convertMarkdownToSlack,
  convertMarkdownLinksToSlackLinks,
} = require("./commonUtils");
const { logger } = require("./logger");

const { SLACK, MESSAGE_TYPES } = require("./config");
const { validateTeam, validateEmail } = require("./validators");
const { createMetadata, createSlackBlocks } = require("./messageFormatter");

async function testSendAsRootMessage(team, email, sentiment, client) {
  console.log("Sending Slack message as root message...");

  try {
    logger.info("[EmailOrchestrator] Step 1: Input validation");

    /*

      Adding more input validations. 
      */
    // 1. Team validation
    if (!validateTeam(team)) return; // 2. Client validation (This should throw as it's a technical error)

    if (!client || !client.chat) {
      logger.error("[EmailOrchestrator] Slack client validation failed", {
        client: client ? "exists" : "null",
        chat: client?.chat ? "exists" : "null",
      });
      throw new Error("Invalid Slack client"); // Keep throwing
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

    // Check if the email is provided
    logger.info(`[EmailOrchestrator] Processing message for team ${team.teamID}`);
        logger.debug('Email details', {
            subject: email.subject,
            from: email.from,
            date: email.date
    });

    // Use formatRootMessage to create the message text
    logger.info("[EmailOrchestrator] Step 2: Formatting message text");
    const { finalMessageWithHeader } = formatRootMessage(email, sentiment);

    logger.debug("[EmailOrchestrator] Formatted message", { 
      messageLength: finalMessageWithHeader.length 
    });

    const slackFormattedMessage = convertMarkdownToSlack(
      finalMessageWithHeader
    );

    const slackFormattedMessageWithLinks = convertMarkdownLinksToSlackLinks(
      slackFormattedMessage
    );

    // Split the message into chunks
    const messageChunks = splitMessageAtLineBreak(
      slackFormattedMessageWithLinks
    );

    // Create metadata for the message
    console.log("[EmailOrchestrator] Step 3: Creating metadata");
    const metadata = createMetadata(email, team);

    logger.debug('Message metadata created:', metadata);


    // Create blocks for each chunk, ensuring each chunk is within the character limit
    const blocks = createSlackBlocks(messageChunks);

    const slackPayload = createSlackPayload(
      blocks, 
      metadata, 
      email.slackReference?.threadTs
    );


    logger.debug('Message metadata', metadata);

    // Send the root Slack message
    const response = await client.chat.postMessage({
      ...slackPayload,
      thread_ts: email.slackReference?.threadTs,  // If threading
      metadata: metadata               // Add to message
    });

    // Return both response and metadata
    return {
      messageTs: response.ts,
      metadata: metadata
  };
  } catch (error) {
    logger.error(
      `[EmailOrchestrator] Error sending Slack root message or reply for team ${team.teamID}:`,
      error
    );
    console.error("Error details:", error);
    throw error;
  }
}

function createSlackPayload(blocks, metadata, threadTs) {
  return {
      channel: SLACK.CHANNEL_ID,
      text: SLACK.DEFAULT_TEXT,
      mrkdwn: true,
      blocks,
      metadata,
      ...(threadTs && { thread_ts: threadTs })
  };
}

// Split the message into chunks of 3000 characters
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
    // Check if adding this line would exceed the limit
    if (
      (currentMessage + line + "\n").length > maxLength &&
      currentMessage.length > 0
    ) {
      messages.push(currentMessage.trim());
      currentMessage = "";
    }
    currentMessage += line + "\n";
  }

  // Add the remaining message if any
  if (currentMessage.trim()) {
    messages.push(currentMessage.trim());
  }

  return messages;
}

module.exports = {
  testSendAsRootMessage,
};
