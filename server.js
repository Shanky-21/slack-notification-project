require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { App } = require('@slack/bolt');
const { logger } = require('./logger');
const { WebClient } = require('@slack/web-api');

const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));


const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_TOKEN) {
    logger.error('SLACK_BOT_TOKEN is not set in environment variables');
    process.exit(1);
}

const client = new WebClient(SLACK_TOKEN);


// In both server.js and sendSlackMessageUtils.js
const { messageStore } = require('./storage');  // Instead of './cache'

// Start server
const port = 3000;
expressApp.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Now run 'ngrok http ${port}' in a separate terminal`);
});

// In server.js
expressApp.get('/debug/storage', (req, res) => {
  try {
      const keys = messageStore.keys();
      const contents = keys.map(key => {
          const content = messageStore.get(key);
          return {
              id: key,
              originalTextLength: content?.originalText?.length,
              quotedTextCount: content?.quotedText?.length
          };
      });

      res.json({
          size: messageStore.size(),
          keys: keys,
          contents: contents
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Debug endpoints
expressApp.get('/debug/cache', (req, res) => {
  const keys = messageStore.keys();
  const stats = messageStore.getStats();
  
  logger.debug('Cache status', {
      keys,
      stats
  });

  res.json({
      size: messageStore.size(),
      keys: keys,
      stats: stats,
      contents: keys.map(key => {
          const content = messageStore.get(key);
          return {
              id: key,
              originalTextLength: content?.originalText?.length,
              quotedTextCount: content?.quotedText?.length
          };
      })
  });
});


expressApp.post('/slack/actions', async (req, res) => {
  logger.info('Received Slack action request');
  
  try {
      const payload = JSON.parse(req.body.payload);
      
      logger.debug('Parsed action payload', {
          type: payload.type,
          actionId: payload.actions?.[0]?.action_id,
          value: payload.actions?.[0]?.value
      });

      if (payload.type === 'block_actions' && payload.actions[0].action_id === 'show_more_content') {
          const value = JSON.parse(payload.actions[0].value);
          const messageId = value.messageId;

          logger.debug('Processing show more request', { 
              value,
              messageId,
              availableKeys: messageStore.keys()
          });

          // Get stored content
          const content = messageStore.get(messageId);
          if (!content) {
              logger.error(`Content not found for messageId: ${messageId}`);
              return res.send('Content not found');
          }

          // Get message blocks
          const messageBlocks = payload.message.blocks;

          // Find the correct button
          const buttonBlockIndex = messageBlocks.findIndex((block, index) => {
              if (block.type !== "actions") return false;
              if (!block.elements?.[0]?.value) return false;
              
              try {
                  const buttonValue = JSON.parse(block.elements[0].value);
                  if (value.type === 'latest_reply') {
                      return buttonValue.type === 'latest_reply';
                  } else if (value.type === 'quoted_reply') {
                      return buttonValue.type === 'quoted_reply' && 
                             buttonValue.quoteIndex === value.quoteIndex;
                  }
                  return false;
              } catch (e) {
                  return false;
              }
          });

          logger.debug('Found button block', {
              buttonBlockIndex,
              totalBlocks: messageBlocks.length,
              type: value.type,
              quoteIndex: value.quoteIndex
          });

          if (buttonBlockIndex === -1) {
              logger.error('Button block not found', {
                  type: value.type,
                  quoteIndex: value.quoteIndex
              });
              return res.send('Button not found');
          }

          // Get the next chunk of text
          let nextChunk;
          let isLastChunk = false;

          if (value.type === 'latest_reply') {
              const start = value.currentChunk * 1000;
              nextChunk = content.originalText.substring(start, start + 1000);
              isLastChunk = value.currentChunk + 1 >= value.totalChunks;

              logger.debug('Processing latest reply chunk', {
                  chunkSize: nextChunk.length,
                  startPosition: start,
                  isLastChunk
              });

              // Always create a new section
              messageBlocks.splice(buttonBlockIndex, 0, {
                  type: "section",
                  text: {
                      type: "mrkdwn",
                      text: nextChunk.trim()
                  }
              });

              logger.debug('Added new content section for latest reply', {
                  position: buttonBlockIndex,
                  contentLength: nextChunk.trim().length
              });

          } else if (value.type === 'quoted_reply') {
              const quote = content.quotedText[value.quoteIndex];
              const start = value.currentChunk * 1000;
              nextChunk = quote.content.substring(start, start + 1000);
              isLastChunk = value.currentChunk + 1 >= value.totalChunks;

              logger.debug('Processing quoted reply chunk', {
                  chunkSize: nextChunk.length,
                  startPosition: start,
                  isLastChunk,
                  quoteIndex: value.quoteIndex
              });

              // Always create a new section for quoted text
              messageBlocks.splice(buttonBlockIndex, 0, {
                  type: "section",
                  text: {
                      type: "mrkdwn",
                      text: `>${nextChunk.trim().split('\n').join('\n>')}`
                  }
              });

              logger.debug('Added new content section for quoted reply', {
                  position: buttonBlockIndex,
                  contentLength: nextChunk.trim().length,
                  quoteIndex: value.quoteIndex
              });
          }

          // Handle button update/removal (common for both types)
          if (isLastChunk) {
              // Remove the button block
              messageBlocks.splice(buttonBlockIndex + 1, 1);
              logger.debug('Removed show more button', {
                  type: value.type,
                  quoteIndex: value.quoteIndex,
                  remainingBlocks: messageBlocks.length
              });
          } else {
              const buttonBlock = messageBlocks[buttonBlockIndex + 1];
              if (buttonBlock?.type === 'actions' && buttonBlock.elements?.[0]) {
                  buttonBlock.elements[0].value = JSON.stringify({
                      ...value,
                      currentChunk: value.currentChunk + 1
                  });
                  buttonBlock.elements[0].text.text = 
                      `Show More (${value.totalChunks - (value.currentChunk + 1)} parts remaining)`;
                  
                  logger.debug('Updated button for next chunk', {
                      type: value.type,
                      quoteIndex: value.quoteIndex,
                      nextChunk: value.currentChunk + 1,
                      remainingChunks: value.totalChunks - (value.currentChunk + 1)
                  });
              }
          }

          // Validate all blocks before sending
          const validateBlocks = (blocks) => {
              for (let i = 0; i < blocks.length; i++) {
                  const block = blocks[i];
                  if (block.type === 'section' && block.text?.text.length > 2900) {
                      logger.error('Block text too long', {
                          blockIndex: i,
                          textLength: block.text.text.length,
                          blockType: block.type
                      });
                      throw new Error(`Block text at index ${i} exceeds Slack's limit`);
                  }
              }
              return blocks;
          };

          // Update the message in Slack with validation
          try {
              // Validate blocks before sending
              validateBlocks(messageBlocks);

              await client.chat.update({
                  channel: payload.channel.id,
                  ts: payload.message.ts,
                  text: "Message updated with more content",
                  blocks: messageBlocks
              });
              
              logger.debug('Successfully updated message', {
                  blockCount: messageBlocks.length,
                  type: value.type,
                  quoteIndex: value.type === 'quoted_reply' ? value.quoteIndex : undefined,
                  currentChunk: value.currentChunk,
                  blockSizes: messageBlocks.map(block => ({
                      type: block.type,
                      textLength: block.text?.text?.length || 0
                  }))
              });
          } catch (updateError) {
              logger.error('Failed to update Slack message', {
                  error: updateError,
                  type: value.type,
                  quoteIndex: value.type === 'quoted_reply' ? value.quoteIndex : undefined,
                  blockCount: messageBlocks.length,
                  blocks: messageBlocks.map(block => ({
                      type: block.type,
                      textLength: block.text?.text?.length || 0
                  }))
              });
              throw updateError;
          }
      }

      res.send('');
  } catch (error) {
      logger.error('Error processing Slack action', error);
      res.status(500).send('Error processing request');
  }
});

// Debug endpoint
expressApp.get('/debug/messages', (req, res) => {
  const messages = Array.from(messageStore.entries()).map(([key, value]) => ({
      id: key,
      contentSizes: {
          originalTextLength: value.originalText?.length,
          quotedTextCount: value.quotedText?.length
      }
  }));
  
  logger.debug('Current message store contents', { messages });
  res.json(messages);
});

// Add this to server.js
expressApp.get('/test', (req, res) => {
  logger.info('Test endpoint called');
  res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      messageStoreSize: messageStore.size
  });
});

module.exports = { expressApp, messageStore };