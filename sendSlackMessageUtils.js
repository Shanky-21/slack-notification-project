const { WebClient } = require("@slack/web-api");
const { formatRootMessage } = require("./formatSlackMessageUtils");
const {
  convertMarkdownToSlack,
  convertMarkdownLinksToSlackLinks,
} = require("./commonUtils");
const { logger } = require("./logger");
const { SLACK } = require("./config");
const { validateTeam, validateEmail } = require("./validators");

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

    logger.debug('Message metadata created:', metadata);

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
        // Latest Reply Section
        {
          type: "section",
          text: {
              type: "mrkdwn",
              text: "*Latest Reply:*\n" + originalText  // originalText is already a string
          }
        },
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
          {
              type: "section",
              text: {
                  type: "mrkdwn",
                  text: quotedText.map(quote => (
                    `> *From:* ${quote.author}\n` +
                    `> *Date:* ${quote.date}\n` +
                    `> ${quote.content.split('>').join('\n>')}`  // Add '>' to each line
                )).join('\n')
              }
          }
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