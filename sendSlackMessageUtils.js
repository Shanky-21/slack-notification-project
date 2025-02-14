const { WebClient } = require("@slack/web-api");
const { formatRootMessage } = require("./formatSlackMessageUtils");
const {
  convertMarkdownToSlack,
  convertMarkdownLinksToSlackLinks,
} = require("./commonUtils");
const { logger } = require("./logger");

const { SLACK, MESSAGE_TYPES } = require("./config");
const { validateTeam, validateEmail } = require("./validators");

const { 
  createHeaderBlock, 
  createMetadata, 
  createSlackBlocks,
  formatSlackPayload,
  splitMessageAtLineBreak
} = require("./messageFormatter");

/**
 * Sends an email as a Slack message
 * @param {Team} team - Team information
 * @param {Email} email - Email to be sent
 * @param {string} sentiment - Email sentiment
 * @param {WebClient} client - Slack client
 * @returns {Promise<SlackResponse>} - Slack message response
 */
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

    const slackFormattedMessage = convertMarkdownToSlack(finalMessageWithHeader);

    const slackFormattedMessageWithLinks = convertMarkdownLinksToSlackLinks(slackFormattedMessage);

    // Split the message into chunks
    const messageChunks = splitMessageAtLineBreak(slackFormattedMessageWithLinks);

    // Create metadata for the message
    console.log("[EmailOrchestrator] Step 3: Creating metadata");
    const metadata = createMetadata(email, team);

    logger.debug('Message metadata created:', metadata);

    const headerBlocks = createHeaderBlock(finalMessageWithHeader, sentiment);
    const contentBlocks = createSlackBlocks(messageChunks);
    const blocks = [...headerBlocks, ...contentBlocks];


    // Create blocks for each chunk, ensuring each chunk is within the character limit
    // const blocks = createSlackBlocks(messageChunks);

    const slackPayload = formatSlackPayload(email, sentiment, blocks, metadata);


    logger.debug('Message metadata', metadata);

    // Send the root Slack message
    const response = await client.chat.postMessage(slackPayload);

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


module.exports = {
  testSendAsRootMessage,
};
