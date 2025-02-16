// src/utils/email/processors/messageProcessor.js

const { logger } = require('../../../middleware/logger');
const TextFormatter = require('../formatters/textFormatter');
const { EMAIL_PATTERNS, isReplyHeader } = require('../constants/regexPatterns');

class MessageProcessor {
    static extractEmailContent(emailText) {
        try {
            emailText = emailText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            emailText = this._removeStyles(emailText);

            const lines = emailText.split('\n');
            const messages = [];
            let currentMessage = {
                content: '',
                level: 0,
            };

            for (let line of lines) {
                line = line.trim();
                if (this._shouldSkipLine(line)) continue;
                currentMessage.content = this._appendContent(currentMessage.content, line);
            }

            if (currentMessage.content) {
                messages.push(currentMessage);
            }

            return messages;
        } catch (error) {
            logger.error('Error in extractEmailContent:', error);
            throw new Error('Failed to extract email content');
        }
    }

    static processMessages(messages) {
      logger.debug("processMessages entry", {
          messageCount: messages.length
      });
  
      let state = {
          stopAddingText: false,
          originalText: [],
          quotedText: [],
          originalTextIsFound: false,
          footerDetected: false,
          replyHeaderCount: 0
      };
  
      logger.debug('Starting to process messages', {
          messageCount: messages.length
      });
  
      for (let msg of messages) {
          const lines = TextFormatter.escapeMarkdown(msg.content.trim()).split('\n');
  
          logger.debug('Processing message', {
              lineCount: lines.length,
              firstLine: lines[0],
              originalText: state.originalText,
              quotedText: state.quotedText
          });
  
          for (let line of lines) {
              logger.debug('Processing line', {
                  line,
                  currentState: {
                      stopAddingText: state.stopAddingText,
                      footerDetected: state.footerDetected,
                      replyHeaderCount: state.replyHeaderCount,
                      originalTextIsFound: state.originalTextIsFound
                  }
              });
  
              if (state.footerDetected || state.replyHeaderCount >= 2) {
                  logger.debug('Stopping processing - Footer detected or max reply headers reached', {
                      footerDetected: state.footerDetected,
                      replyHeaderCount: state.replyHeaderCount
                  });
                  break;
              }
  
              if (EMAIL_PATTERNS.FOOTER.some(pattern => pattern.test(line.trim()))) {
                  logger.debug('Footer pattern detected', { line });
                  state.footerDetected = true;
                  break;
              }
  
              let chevronCount = (line.match(/^>+/) || [''])[0].length;
  
              if (!state.stopAddingText) {
                  line = line.replace(/^>+(\s*>+)?/, '').trim();
              }
  
              // When we detect a reply header
              if (isReplyHeader(line)) {
                  logger.debug('Reply header detected', {
                      line,
                      replyHeaderCount: state.replyHeaderCount
                  });
                  
                  state.replyHeaderCount++;
                  if (state.replyHeaderCount === 2) {
                      state.stopAddingText = true;
                      break;
                  }
  
                  const matchedText = [
                      EMAIL_PATTERNS.REPLY_HEADERS.STANDARD,
                      EMAIL_PATTERNS.REPLY_HEADERS.COMPLEX
                  ].reduce((match, pattern) => match || line.match(pattern), null);
  
                  const splitLine = line.split(matchedText);
  
                  // Clean the header
                  const cleanedHeader = matchedText[0]
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&');
  
                  // Clean the quoted content
                  const quotedContent = splitLine[1]?.split('----')[0] || '';
                  const cleanedQuote = quotedContent
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&')
                      .replace(/^>+/gm, '')
                      .split('\n')
                      .map(line => line.trim())
                      .filter(line => line)
                      .join(' ')
                      .trim();
  
                  logger.debug('Processing quote', {
                      originalHeader: matchedText[0],
                      cleanedHeader,
                      originalQuote: quotedContent,
                      cleanedQuote
                  });
  
                  state.originalText.push(splitLine[0] || '');
                  state.quotedText.push(`${cleanedHeader}\n${cleanedQuote}\n`);
  
                  state.originalTextIsFound = true;
                  break;
              }
  
              if (EMAIL_PATTERNS.HEADERS.DASH.test(line)) {
                  logger.debug('Separator dash detected', { line });
                  state.stopAddingText = true;
                  if (state.replyHeaderCount < 2) {
                      state.originalText.push(line.trim());
                  }
                  break;
              }
  
              if (line.startsWith('>')) {
                  logger.debug('Quoted text line detected', { line });
                  state.quotedText.push(line.replace(/^>\s*/, ''));
                  break;
              }
  
              if (chevronCount > 0 && state.originalTextIsFound) {
                  logger.debug('Nested quoted text detected', {
                      line,
                      chevronCount
                  });
                  state.quotedText.push(line.replace(/^>\s*/, ''));
                  break;
              }
  
              if (state.replyHeaderCount < 2) {
                  logger.debug('Adding to original text', { line });
                  state.originalText.push(line);
              }
          }
  
          if (state.footerDetected || state.replyHeaderCount >= 2) {
              logger.debug('Stopping message processing', {
                  footerDetected: state.footerDetected,
                  replyHeaderCount: state.replyHeaderCount
              });
              break;
          }
      }
  
      logger.debug('Final processing result before formatting', {
          originalTextLength: state.originalText.length,
          quotedTextLength: state.quotedText.length,
          originalText: state.originalText,
          quotedText: state.quotedText
      });
  
      const formattedQuotedText = state.quotedText
          .map(quote => {
              const headerMatch = quote.match(/On (.+?) at (.+?) <(.+?)> wrote:/);
              if (headerMatch) {
                  return {
                      author: headerMatch[3],
                      date: `${headerMatch[1]} at ${headerMatch[2]}`,
                      content: quote.split('\n')[1]
                  };
              }
              return null;
          })
          .filter(Boolean);
  
      logger.debug('Formatted output', {
          originalText: state.originalText.join(' ').trim(),
          quotedText: formattedQuotedText
      });
  
      return {
          originalText: state.originalText.join(' ').trim(),
          quotedText: formattedQuotedText
      };
  }

    static _processMessageLines(lines, state) {
        let currentQuote = [];
        let isInQuote = false;

        for (let line of lines) {
            if (this._shouldBreakProcessing(line, state)) {
                if (currentQuote.length > 0) {
                    state.quotedText.push(currentQuote.join('\n'));
                }
                break;
            }

            this._processLine(line, state, currentQuote, isInQuote);
        }

        if (currentQuote.length > 0) {
            state.quotedText.push(currentQuote.join('\n'));
        }
    }

    static _processLine(line, state, currentQuote, isInQuote) {
        if (isReplyHeader(line)) {
            if (!state.firstReplyFound) {
                state.firstReplyFound = true;
                const splitIndex = line.indexOf('On ');
                if (splitIndex > 0) {
                    const latestReply = line.substring(0, splitIndex).trim();
                    if (latestReply) {
                        state.originalText.push(latestReply);
                    }
                }
                isInQuote = true;
                currentQuote.push(line.substring(splitIndex));
            } else {
                if (currentQuote.length > 0) {
                    state.quotedText.push(currentQuote.join('\n'));
                    currentQuote.length = 0; // Clear the array
                }
                currentQuote.push(line);
            }
            state.replyHeaderCount++;
        } else if (state.firstReplyFound) {
            if (isInQuote) {
                currentQuote.push(line);
            }
        } else {
            state.originalText.push(line);
        }
    }

    static _shouldBreakProcessing(line, state) {
        return (
            state.footerDetected ||
            EMAIL_PATTERNS.FOOTER.some(pattern => pattern.test(line.trim()))
        );
    }

    static _removeStyles(text) {
        const specificCssStylesRegex = /{[\s\S]*?margin: 0 !important;[\s\S]*?}@media[\s\S]*?{[\s\S]*?}/g;
        const inlineCssRegex = /<style[\s\S]*?>[\s\S]*?<\/style>/gi;
        return text
            .replace(specificCssStylesRegex, '')
            .replace(inlineCssRegex, '');
    }

    static _shouldSkipLine(line) {
        if (line === '') return true;

        const skipPatterns = {
            header: /^[A-Z][\w-]*: .*$/,
            spamAnalysis: /^Content-(Type|Transfer-Encoding|Disposition): .*$/i,
            separator: /^(-{2,}|_{2,}|\*{2,})$/
        };

        return Object.values(skipPatterns).some(pattern => pattern.test(line));
    }

    static _appendContent(currentContent, line) {
        return currentContent ? currentContent + '\n' + line : line;
    }

    static _formatProcessedOutput(state) {
        const cleanedOriginalText = state.originalText
            .filter(line => line.trim())
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        const formattedQuotedText = this._formatQuotedText(state.quotedText);

        logger.debug('Processed message output:', {
            originalText: cleanedOriginalText,
            quotedTextCount: formattedQuotedText.length,
            quotedText: formattedQuotedText
        });

        return {
            originalText: cleanedOriginalText,
            quotedText: formattedQuotedText
        };
    }

    static _formatQuotedText(quotedText) {
        return quotedText
            .map(quote => {
                const headerMatch = quote.match(/On (.+?) at (.+?) <(.+?)> wrote:/);
                if (headerMatch) {
                    const [fullHeader, date, time, author] = headerMatch;
                    const content = quote
                        .replace(fullHeader, '')
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line)
                        .join('\n');

                    return {
                        author,
                        date: `${date} at ${time}`,
                        content
                    };
                }
                return null;
            })
            .filter(Boolean);
    }
}

module.exports = MessageProcessor;