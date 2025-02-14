

async function testSendAsRootMessage(team, email, sentiment, client = app.client) {
  logger.info("Sending Slack message as root message...");


  try {
      console.log("Step 1: Starting function");


      // Check if the email is provided
      if (!email) {
          logger.info(`[EmailOrchestrator] Skipping Slack message for team ${team.teamID} because the email is null or undefined.`);
          return;
      }




      // Use formatRootMessage to create the message text
      console.log("Step 2: Formatting message text");
      const { finalMessageWithHeader } = formatRootMessage(email, sentiment, email);


      const slackFormattedMessage = convertMarkdownToSlack(finalMessageWithHeader);


      const slackFormattedMessageWithLinks =     convertMarkdownLinksToSlackLinks(slackFormattedMessage);


      // Split the message into chunks
      const messageChunks = splitMessageAtLineBreak(slackFormattedMessageWithLinks);


      const fromAddress = email.from.address || "Unknown";
      const toAddress = email.to[0].address || "Unknown";


      // Create metadata for the message
      console.log("Step 3: Creating metadata");
      const metadata = JSON.stringify({
          fromEmail: fromAddress,
          toEmail: toAddress,
          rootEmailId: email._id,
          rootEmailUID: email.uid,
          teamID: team.teamID,
      });


      // Create blocks for each chunk, ensuring each chunk is within the character limit
      const blocks = messageChunks.map(chunk => ({
          type: "section",
          text: {
              type: "mrkdwn",
              text: chunk.slice(0, 3000), // Ensure each block's text is within the 3000 character limit
          },
      }));


      const slackPayload = {
          channel: 'C07TBNV0MU7', // Replace with your channel ID
          text: "Test message",
          mrkdwn: true,
          blocks: blocks,
      };


      // Send the root Slack message
      await client.chat.postMessage(slackPayload);
  } catch (error) {
      logger.error(`[EmailOrchestrator] Error sending Slack root message or reply for team ${team.teamID}:`, error);
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
  let currentMessage = '';
  const lines = message.split('\n');


  for (const line of lines) {
      // Check if adding this line would exceed the limit
      if ((currentMessage + line + '\n').length > maxLength && currentMessage.length > 0) {
          messages.push(currentMessage.trim());
          currentMessage = '';
      }
      currentMessage += line + '\n';
  }


  // Add the remaining message if any
  if (currentMessage.trim()) {
      messages.push(currentMessage.trim());
  }


  return messages;
}
