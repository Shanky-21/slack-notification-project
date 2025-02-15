const dayjs = require("dayjs");
const { logger } = require("../middleware/logger");  // Updated path to logger


// Regex patterns for reply headers
const replyHeaderRegex = /On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+.+?(?:at|,)\s+.*?\s+wrote:|On\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4},\s+.*?\s+<.*?>\s+wrote:|[A-Za-z]{3} \d{1,2}, \d{4}, (?:at)?\s*\d{1,2}:\d{2}(?:\s*[APap][Mm])?, .*? wrote:|\d{4}-\d{2}-\d{2} \d{2}:\d{2}, .*? wrote:/i;
const complexReplyHeaderRegex = /(?:On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+.+?(?:at|,)\s+.*?\s+wrote:|On\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4},?\s+(?:at)?\s*\d{1,2}:\d{2}(?:\s*[APap][Mm])?,?\s+.*?\s+(?:<.*?>)?\s*wrote:|\d{4}-\d{2}-\d{2} \d{2}:\d{2}, .*? wrote:|[A-Za-z]{3} \d{1,2}, \d{4},?\s+(?:at)?\s*\d{1,2}:\d{2}(?:\s*[APap][Mm])?,?\s+.*?\s+(?:<.*?>)?\s*wrote:)/i;


const sentHeaderRegex = /^From:\s+.*?<.*?>\s+Sent:\s+.*?\s+To:\s+.*?\s+Subject:\s+.*$/i;


const forwardedHeaderRegex = /(?:--\s*Forwarded message\s*--|Fwd:\s+.*|Fw:\s+.*|Begin forwarded message:)/i;


const fromHeaderRegex = /(>*)From: .*? <.*?>/; // Matches "From" headers in emails


const dashRegex = /----.*?----/g; // Matches lines with dashes, often used as separators


const footerRegexPatterns = [
   // **Signature Separators**
   /^[_-]{2,}$/,  // Multiple dashes or underscores (e.g., "--", "___")
   /^--+\s*$/,  // Dashed signature separator ("--")


   // **Common Closing Phrases**
   /^(?:Regards|Best Regards|Kind Regards|Sincerely|Thanks(?:,|\s+&)? Regards?|Cheers|Best|Best Wishes|With Appreciation|Yours Sincerely|Yours Truly|Warm Regards|Thanks and Regards|Respectfully),?/i,


   // **Mobile Email Signatures**
   /Sent (from|via|using) my/i,  // Covers multiple variations (iPhone, Android, Samsung, etc.)
   /Get Outlook for (?:Android|iOS)/i,  // Outlook signatures


   // **Company Disclaimers / Legal Notices**
   /(?:This email|This message|This transmission) (?:contains|may contain) (?:confidential|sensitive) information/i,
   /If you are not the intended recipient, (?:please notify|delete this email)/i,
   /The contents of this email are intended solely for/i,
   /This email is intended only for the addressee/i,
   /Please consider the environment before printing/i,
   /Nothing in this email should be construed as legal advice/i,
   /Any views expressed in this email are those of the individual sender/i,


   // **Unsubscribe / Email List Messages**
   /(?:Unsubscribe|To unsubscribe|Click here to unsubscribe|If you no longer wish to receive these emails|Manage your email preferences|Update email preferences|You are receiving this email because)/i,
   /This is an automated email, please do not reply/i,


   // **Download / App Links**
   /Download (?:the|our) (?:iOS|Android|Web|Desktop|Mobile) App/i,


   // **Diagnostics / Auto-Generated Messages**
   /(?:Diagnostic information for administrators:|This email was automatically generated|This is an automated message, please do not reply|Replies to this email will not be monitored|For support, please contact)/i,


   // **Marketing / Promotions**
   /^This email was sent to you by/i,
   /^You are subscribed to our newsletter/i,
   /^Receive exclusive offers/i,
   /^Visit our website/i,
   /^Follow us on/i,
   /^Check out our latest updates/i,


   // **Privacy & Security Notices**
   /^We value your privacy/i,
   /Your privacy is important to us/i,
   /This email complies with GDPR/i,
   /For more information, visit our privacy policy/i,


   // **Customer Support Notices**
   /(?:For any questions, contact support at|Need help\? Visit our help center|For assistance, please reach out to our team|Our support team is available|Send feedback to)/i,


   // **Additional Common Auto-Replies & System Messages**
   /(?:This inbox is no longer being monitored|To complete this verification, simply reply to this message)/i,
   /(?:If the problem continues, forward this message to your email admin|To avoid any delay in service, please reach out to our Customer Experience team)/i,
   /Was this helpful\? Send feedback to Microsoft/i,
   /Click the link below to instantly become a trusted sender/i,
   /Thank you for verifying your email address/i
];




// Group related regex patterns into objects for better organization
const emailPatterns = {
   replyHeaders: {
       standard: replyHeaderRegex,
       complex: complexReplyHeaderRegex
   },
   headers: {
       sent: sentHeaderRegex,
       forwarded: forwardedHeaderRegex,
       from: fromHeaderRegex,
       dash: dashRegex
   },
   isReplyHeader(line) {
       return (
           this.replyHeaders.standard.test(line) ||
           this.replyHeaders.complex.test(line) ||
           this.headers.from.test(line) ||
           this.headers.dash.test(line) ||
           this.headers.sent.test(line) ||
           this.headers.forwarded.test(line)
       );
   }
};


// Helper functions
const textFormatters = {
   escapeMarkdown(text) {
       return text
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/_/g, '\\_')
           .replace(/\*/g, '\\*')
           .replace(/~/g, '\\~')
           .replace(/`/g, '\\`')
           .replace(/\\/g, '\\\\');
   },


   cleanMarkdownSpecialCharacters(text) {
       return text.replace(/\\\\([*_~`])/g, '$1');
   },


   formatSlackLinksAndEmails(text) {
       text = text.replace(
           /(https?:\/\/[^\s]+)/g,
           '<$1|$1>'
       );
       text = text.replace(
           /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
           '<mailto:$1|$1>'
       );
       return text;
   },


   prefixedFinalMessage(text) {
       return text
           .split('\n')
           .map((line, i) => i === 0 ? line : `> ${line.replace(/>/g, '').trim()}`)
           .join('\n');
   },


   removeDoubleChevron(text) {
       return text.replace(/>>/g, '>');
   }
};


// Message processing functions
const messageProcessors = {
    extractEmailContent(emailText) {
        // Normalize line endings
        emailText = emailText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove specific CSS styles from the email text
        const specificCssStylesRegex = /{[\s\S]*?margin: 0 !important;[\s\S]*?}@media[\s\S]*?{[\s\S]*?}/g;
        emailText = emailText.replace(specificCssStylesRegex, '');

        // Remove inline CSS styles
        const inlineCssRegex = /<style[\s\S]*?>[\s\S]*?<\/style>/gi;
        emailText = emailText.replace(inlineCssRegex, '');

        // Split the email text into lines
        const lines = emailText.split('\n');

        // Initialize variables
        const messages = [];
        let currentMessage = {
            content: '',
            level: 0,
        };

        // Regular expressions to identify email headers, spam analysis, and separators
        const headerRegex = /^[A-Z][\w-]*: .*$/;
        const spamAnalysisRegex = /^Content-(Type|Transfer-Encoding|Disposition): .*$/i;
        const separatorRegex = /^(-{2,}|_{2,}|\*{2,})$/;

        // Iterate over each line
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // Skip empty lines
            if (line === '') {
                continue;
            }

            // Check if line is a header or spam analysis
            if (headerRegex.test(line) || spamAnalysisRegex.test(line)) {
                continue; // Skip headers
            }

            // Check for separator lines
            if (separatorRegex.test(line)) {
                continue; // Skip separators
            }

            // Append the line to the current message content
            if (currentMessage.content) {
                currentMessage.content += '\n' + line;
            } else {
                currentMessage.content = line;
            }
        }

        // Add the message to the messages array
        if (currentMessage.content) {
            messages.push(currentMessage);
        }

        return messages;
    },

processMessages(messages) {

    logger.debug("processMessages entry", {
        messageCount: messages.length
    });
    let stopAddingText = false;
    let originalText = [];
    let quotedText = [];
    let originalTextIsFound = false;
    let footerDetected = false;
    let replyHeaderCount = 0;

    logger.debug('Starting to process messages', {
        messageCount: messages.length
    });

    for (let msg of messages) {
        const lines = textFormatters.escapeMarkdown(msg.content.trim()).split('\n');

        logger.debug('Processing message', {
            lineCount: lines.length,
            firstLine: lines[0],
            originalText: originalText,
            quotedText:  quotedText
        });

        for (let line of lines) {
            logger.debug('Processing line shashank', {
                line: line,
                quotedText: quotedText,
                originalText: originalText
            })

            logger.debug('Processing line', {
                line,
                currentState: {
                    stopAddingText,
                    footerDetected,
                    replyHeaderCount,
                    originalTextIsFound
                }
            });

            if (footerDetected || replyHeaderCount >= 2) {
                logger.debug('Stopping processing - Footer detected or max reply headers reached', {
                    footerDetected,
                    replyHeaderCount
                });
                break;
            }

            if (footerRegexPatterns.some(pattern => pattern.test(line.trim()))) {
                logger.debug('Footer pattern detected', {
                    line
                });
                footerDetected = true;
                break;
            }

            let chevronCount = (line.match(/^>+/) || [''])[0].length;

            if (!stopAddingText) {
                line = line.replace(/^>+(\s*>+)?/, '').trim();
            }

            // When we detect a reply header
            if (emailPatterns.isReplyHeader(line)) {
                logger.debug('Reply header detected', {
                    line,
                    replyHeaderCount
                });
                replyHeaderCount++;
                if (replyHeaderCount === 2) {
                    stopAddingText = true;
                    break;
                }
            
                const matchedText = [
                    emailPatterns.replyHeaders.standard,
                    emailPatterns.replyHeaders.complex
                ].reduce((match, pattern) => match || line.match(pattern), null);
            
                const splitLine = line.split(matchedText);
                
                // Clean the header (remove HTML entities)
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
                    .replace(/^>+/gm, '') // Remove '>' characters
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
            
                originalText.push(splitLine[0] || '');
                quotedText.push(`${cleanedHeader}\n${cleanedQuote}\n`);
            
                originalTextIsFound = true;
                break;
            }

            if (emailPatterns.headers.dash.test(line)) {
                logger.debug('Separator dash detected', {
                    line
                });
                stopAddingText = true;
                if (replyHeaderCount < 2) {
                    originalText.push(line.trim());
                }
                break;
            }

            if (line.startsWith('>')) {
                logger.debug('Quoted text line detected', {
                    line
                });
                quotedText.push(line.replace(/^>\s*/, ''));
                break;
            }

            if (chevronCount > 0 && originalTextIsFound) {
                logger.debug('Nested quoted text detected', {
                    line,
                    chevronCount
                });
                quotedText.push(line.replace(/^>\s*/, ''));
                break;
            }

            if (replyHeaderCount < 2) {
                logger.debug('Adding to original text', {
                    line
                });
                originalText.push(line);
            }

        }

        if (footerDetected || replyHeaderCount >= 2) {
            logger.debug('Stopping message processing', {
                footerDetected,
                replyHeaderCount
            });
            break;
        }
    }

    logger.debug('Final processing result before formatting', {
        originalTextLength: originalText.length,
        quotedTextLength: quotedText.length,
        originalText: originalText,
        quotedText: quotedText
    });

    // Parse the quoted text to extract author and date
    const formattedQuotedText = quotedText.map(quote => {
        const headerMatch = quote.match(/On (.+?) at (.+?) <(.+?)> wrote:/);
        if (headerMatch) {
            return {
                author: headerMatch[3],
                date: `${headerMatch[1]} at ${headerMatch[2]}`,
                content: quote.split('\n')[1] // Get the content part after the header
            };
        }
        return null;
    }).filter(Boolean);

    logger.debug('Formatted output', {
        originalText: originalText.join(' ').trim(),
        quotedText: formattedQuotedText
    });

    return {
        originalText: originalText.join(' ').trim(),
        quotedText: formattedQuotedText
    };
},

   combineOriginalAndQuotedText(originalText, quotedText) {
       const combinedMessage = `\n${originalText.join("\n").trim()}${textFormatters.prefixedFinalMessage(quotedText.map(line => line.replace(/>/g, "\n>")).join("> "))}`;
       return textFormatters.removeDoubleChevron(combinedMessage.trim());
   },


   cleanAndFormatFinalMessage(message) {
       let cleanedFinalMessage = message
           .replace(/(> *\n> *\n)+/g, '>\n')
           .replace(/>\s*$/g, '');
       return textFormatters.formatSlackLinksAndEmails(cleanedFinalMessage);
   }
};


// Message formatting functions
const messageFormatters = {
   constructHeaderMessage(email, sentiment) {
       const subject = email.subject || '(No subject)';
       const fromName = email.from.name || email.from.address;
       const fromAddress = email.from.address;
       const toAddress = email.to[0].address;
       const date = dayjs(email.date);


       if (!date.isValid()) {
           logger.error(`Invalid date format: ${email.date}`);
       }
       const formattedDate = date.format('MM/DD/YYYY') || '(No date)';


       let ccList = '';
       if (email.cc && email.cc.length > 0) {
           ccList = email.cc.map(cc => `${textFormatters.escapeMarkdown(cc.name || cc.address)} ${cc.address}`).join(', ');
           ccList = `*CC:* ${ccList}\n`; // Use block quote formatting
       }


       let bccList = '';
       if (email.bcc && email.bcc.length > 0) {
           bccList = email.bcc.map(bcc => `${textFormatters.escapeMarkdown(bcc.name || bcc.address)} ${bcc.address}`).join(', ');
           bccList = `*BCC:* ${bccList}\n`; // Use block quote formatting
       }


       return `${`:mailbox_with_mail: *New ${sentiment} Reply*\n` +
           `*Subject:* *${textFormatters.escapeMarkdown(subject)}*\n` +
           `*From:* ${textFormatters.escapeMarkdown(fromName)} ${fromAddress}\n` +
           `*To:* ${toAddress}\n`}${ccList
           }${bccList
           }*Date:* ${formattedDate}\n`;
   },


   formatThreadMessage(generatedReply) {
       return `*Generated Reply:*\n\n${textFormatters.escapeMarkdown(generatedReply)}`;
   },


    // In formatSlackMessageUtils.js
    // formatRootMessage(email, sentiment) {
    //     const messages = messageProcessors.extractEmailContent(email.text);
    //     const { originalText, quotedText } = messageProcessors.processMessages(messages);
    
    //     // Just clean up the texts without adding formatting
    //     const cleanOriginalText = originalText
    //         .filter(line => line.trim() !== '')
    //         .join('\n');
    
    //     // Return raw texts without formatting
    //     return {
    //         originalText: cleanOriginalText,
    //         quotedText: quotedText
    //     };
    // },

    formatRootMessage(email, sentiment) {
        const messages = messageProcessors.extractEmailContent(email.text);
        const { originalText, quotedText } = messageProcessors.processMessages(messages);

        logger.debug('Formatting root message:', {
            hasOriginalText: !!originalText,
            quotedTextCount: quotedText.length
        });

        return {
            originalText,
            quotedText
        };
    }
    


};


module.exports = {
   formatRootMessage: messageFormatters.formatRootMessage,
   formatThreadMessage: messageFormatters.formatThreadMessage,
   processMessages: messageProcessors.processMessages,
   extractEmailContent: messageProcessors.extractEmailContent,
   constructHeaderMessage: messageFormatters.constructHeaderMessage,
   cleanAndFormatFinalMessage: messageProcessors.cleanAndFormatFinalMessage,
   combineOriginalAndQuotedText: messageProcessors.combineOriginalAndQuotedText
};



