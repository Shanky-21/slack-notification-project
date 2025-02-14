const { WebClient } = require("@slack/web-api");
const { formatRootMessage } = require("./formatSlackMessageUtils");
const {
  convertMarkdownToSlack,
  convertMarkdownLinksToSlackLinks,
} = require("./commonUtils");
const { logger } = require("./logger");

async function testSendAsRootMessage(team, email, sentiment, client) {
  console.log("Sending Slack message as root message...");

  try {
    console.log("Step 1: Starting function");

    /*

      Adding more input validations. 
      */
    // 1. Team validation
    if (!team || !team.teamID) {
      logger.info(
        `[EmailOrchestrator] Skipping Slack message: Invalid team data`,
        {
          team: team ? "exists" : "null",
          teamID: team?.teamID,
        }
      );
      return; // Skip instead of throw
    } // 2. Client validation (This should throw as it's a technical error)

    if (!client || !client.chat) {
      logger.error("[EmailOrchestrator] Slack client validation failed", {
        client: client ? "exists" : "null",
        chat: client?.chat ? "exists" : "null",
      });
      throw new Error("Invalid Slack client"); // Keep throwing
    }

    // 3. Email validation
    if (!email) {
      logger.info(
        `[EmailOrchestrator] Skipping Slack message for team ${team.teamID}`,
        {
          reason: "Email is null or undefined",
          teamID: team.teamID,
        }
      );
      return;
    }

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
    console.log("[EmailOrchestrator] Step 2: Formatting message text");
    const { finalMessageWithHeader } = formatRootMessage(email, sentiment);

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

    const fromAddress = email.from.address || "Unknown";
    const toAddress = email.to[0].address || "Unknown";

    // Create metadata for the message
    console.log("[EmailOrchestrator] Step 3: Creating metadata");
    const metadata = {
      // Metadata must follow Slack's schema
      event_type: "email_notification",
      event_payload: {
          fromEmail: fromAddress,
          toEmail: toAddress,
          rootEmailId: email._id?.toString(), // Ensure it's a string
          rootEmailUID: email.uid?.toString(),
          teamID: team.teamID
      }
    };

    logger.debug('Message metadata created:', metadata);


    // Create blocks for each chunk, ensuring each chunk is within the character limit
    const blocks = messageChunks.map((chunk) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: chunk.slice(0, 3000), // Ensure each block's text is within the 3000 character limit
      },
    }));

    const slackPayload = {
      channel: "C08DE1LEVR8", // Replace with your channel ID
      text: "Test message",
      mrkdwn: true,
      blocks: blocks,
      metadata: metadata
    };

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

// Split the message into chunks of 3000 characters
function splitMessageAtLineBreak(message, maxLength = 3000) {
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
