const dayjs = require("dayjs");
const { logger } = require("../middleware/logger");  // Updated path to logger

const TurndownService = require('turndown');
const turndownService = new TurndownService();

// Customize the conversion for Slack-specific needs
turndownService.addRule('bold', {
    filter: ['strong', 'b'],
    replacement: function (content) {
      return `*${content}*`; // Slack uses asterisks for bold
    }
  });
  
  turndownService.addRule('italic', {
    filter: ['em', 'i'],
    replacement: function (content) {
      return `_${content}_`; // Slack uses underscores for italics
    }
  });

  turndownService.addRule('link', {
    filter: 'a',
    replacement: function (content, node) {
      const href = node.getAttribute('href');
      if (node.innerHTML.trim().startsWith('<img') || content.trim().includes('http')) {
        // Return only the link without the image text
        return `<${href}>`;
      }
      return `<${href}|${content}>`;
    }
  });

//   turndownService.addRule('convertGtEntity', {
//     filter: function (node) {
//       // Apply this rule to text nodes
//       return node.nodeType === 3; // Node.TEXT_NODE
//     },
//     replacement: function (content) {
//       // Replace &gt; with >
//       return content.replace(/&gt;/g, '>');
//     }
//   });
  
turndownService.addRule('image', {
    filter: 'img',
    replacement: function (content, node) {
      const src = node.getAttribute('src');
      const alt = node.getAttribute('alt') || 'Image';
      return `<${src}|${alt}>`;
    }
  });
  // Custom rule for emails
  turndownService.addRule('email', {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href').startsWith('mailto:');
    },
    replacement: function (content, node) {
      const email = node.getAttribute('href').replace('mailto:', '');
      console.log(`Processing email: ${email}`); // Debugging line
      return `<<mailto:${email}|${email}>>`;
    }
  });


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
   /(?:Regards|Best Regards|Kind Regards|Sincerely|Thanks(?:,|\s+&)? Regards?|Cheers|Best|Best Wishes|With Appreciation|Yours Sincerely|Yours Truly|Warm Regards|Thanks and Regards|Respectfully),?/i,


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

     htmlToMarkdown(input) {
        try {
          // Check if input is undefined or null
          if (input == null) {
            throw new TypeError('Input is null or undefined');
          }
      
          // Convert input to string if it's not already
          const htmlContent = String(input);
      
          console.log('HTML Input:', htmlContent, [htmlContent]);
          const markdownContent = turndownService.turndown(htmlContent);
          console.log('Markdown Output:', markdownContent, [markdownContent]);
          return markdownContent;
        } catch (error) {
          console.error('Error converting HTML to Markdown:', error);
          return null;
        }
      },
      
    extractEmailContent(emailText) {

        console.log("debug emailText         : ", emailText);

        // Normalize line endings
        emailText = emailText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        //  emailText = emailText.trim().replace(/\r?\n(?!\r?\n)/g, ' ');
 
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
 
    

    extractLatestReply(quotedText) {
        // Check if there's a reply header in the text
        if (emailPatterns.isReplyHeader(quotedText)) {
            const matchedText = [
                emailPatterns.replyHeaders.standard,
                emailPatterns.replyHeaders.complex
            ].reduce((match, pattern) => match || quotedText.match(pattern), null);
    
            if (matchedText) {
                // Split by the matched header
                const parts = quotedText.split(matchedText);

                console.log("debug matchedText : ", matchedText[0], matchedText[0].trim().replace(/\r?\n(?!\r?\n)/g, ' '));
                
                // The latest reply will be: header + content until next header (if any)
                let latestReply = matchedText[0].trim().replace(/\r?\n(?!\r?\n)/g, ' '); + "\n";  // Start with the header
                
                if (parts[1]) {
                    // Check if there's another reply header in the remaining text
                    const nextReplyHeader = [
                        emailPatterns.replyHeaders.standard,
                        emailPatterns.replyHeaders.complex
                    ].reduce((match, pattern) => match || parts[1].match(pattern), null);
    
                    if (nextReplyHeader) {
                        // If there's another header, only take content up to it
                        const nextParts = parts[1].split(nextReplyHeader);
                        latestReply += nextParts[0];
                    } else {
                        // If no more headers, take all remaining content
                        latestReply += parts[1];
                    }
                }
                
                return latestReply.trim();
            }
        }
        
        // If no reply header found, return the original text
        return quotedText;
    },

     convertPlainTextToMarkdown(text) {
        // Convert URLs to Markdown links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
      
        // Ensure paragraphs are separated by two newlines
        text = text.replace(/([^\n])\n([^\n])/g, '$1\n\n$2');
      
        // Convert lines starting with numbers to ordered lists
        text = text.replace(/^\d+\.\s+/gm, (match) => match.trim() + ' ');
      
        // Convert lines starting with dashes or asterisks to unordered lists
        text = text.replace(/^[-*]\s+/gm, (match) => match.trim() + ' ');
      
        // Add two spaces at the end of lines for line breaks in Markdown
        text = text.replace(/([^\n])\n/g, '$1  \n');

        console.log("debug text: ", text, [text]);
      
        return text;
      },
      


    handleQuotedPart(email) {
        // First extract the latest reply
        const latestReply = this.extractLatestReply(email);

        console.log("debug", "latestReply: ", latestReply);
        
        // Then process the chevrons in the latest reply
        const lines = latestReply.split('\n');
        const processedLines = [];
    
        for (let line of lines) {
            let chevronCount = (line.match(/^>+/) || [''])[0].length;
            
            if (chevronCount > 0) {
                // Remove all chevrons and any whitespace after them
                console.log("line: ", line);
                line = line.replace(/^>+(\s*>+)?/, '').trim();

                if (emailPatterns.headers.dash.test(line)) {
                    continue;
                }
                
                // Add back single chevron if line isn't empty
                if (line) {
                    processedLines.push(`> ${line}`);
                }
            } else {
                // If no chevrons, just add the line as is
                if (line.trim()) {
                    processedLines.push(line);
                }
            }
        }
    
        const quo = processedLines.join('\n');

        console.log("debug quote: ", quo);
        return quo
    },
    
    
    handleOriginalPart(email) {
            /*
            0. iterate line by line,
            1. it footer is encountered remove it.
        */

        const lines = email.split('\n');
        const processedLines = [];
        let footerDetected = false;
    
        for (let line of lines) {
            // Check for footer
            console.log("debug line : ", line);

            if (footerRegexPatterns.some(pattern => pattern.test(line.trim()))) {
                console.log("debug footer detected", line);
                footerDetected = true;
                break;  // Stop processing once footer is found
            }
    
            // If no footer detected yet, add the line
            if (!footerDetected && line.trim()) {
                processedLines.push(line);
            }
        }
    
        return processedLines.join('\n');
    }
    ,

    normalizeNewlines(text) {
        return text
            .replace(/\n\s*\n\s*\n+/g, '\n\n')  // 3 or more newlines to 2
            .replace(/^\s*\n+/g, '')            // Remove newlines at start
            .replace(/\n+\s*$/g, '')
            .replace(/\\\./g, '.');           // Remove newlines at end
    },

    normalizeHtml(html) {
        console.log("debug inside normalize html: ", html);
        if (!html) return '';
        
        // Replace all variants of <br> tags with a single <br>
        return html
            .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>') // Two consecutive <br> tags
            .replace(/<br\s*[\/]?>/gi, '<br>')
            .replace(/&lt;\s*<\s*/g, '<')
            .replace(/\s*>\s*&gt;/g, '>')
            .replace(/<title[^>]*>.*?<\/title>/gi, '')
            .replace(/\\([^\w\s])/g, '\\$1');
  
  // Replace '&gt;' with '>' only if it is preceded by '>' with optional spaces in between
    },

    convertToSlackLinks(text) {
        // Convert markdown links to Slack format
        console.log("debug test convertToSlackLinks");
        return text.replace(
            /$$([^$$]+)\]$$([^)]+)$$/g, 
            (match, text, url) => `<${url}|${text}>`
        );
    },

    processHtmlToSlackMarkdown(html) {
        try {
            // First normalize HTML
            const normalizedHtml = this.normalizeHtml(html);

            
            
            // Convert to markdown (using your preferred HTML-to-markdown library)
            /*
            1. normalize thde html <br><br> -> <br>
            2. convert htmlToMarkdown
            3. convert markdown to slack format
            */

           
            const markdown = this.htmlToMarkdown(normalizedHtml);
            
            console.log("debug markdown after process 2: ", markdown, [markdown]);
            // Convert markdown links to Slack format
            // const slackFormatted = textFormatters.formatSlackLinksAndEmails(markdown);
            const finalText = this.normalizeNewlines(markdown);
        
            return finalText;
        } catch (error) {
            logger.error('Error processing HTML to Slack markdown:', error);
            throw error;
        }
    },

    //  convertMarkdownToSlackFormat(markdown) {
    //     // Convert Markdown headers to Slack bold text
    //     return markdown.replace(/^###\s*(.*)/gm, '*$1*');
    //   },

    processEmail(email) {
        try {
            // Try HTML to Markdown first
            if (email.html) {
                return convertHtmlToMarkdown(email.html);
            }
        } catch (error) {
            logger.warn('HTML conversion failed, falling back to plain text', { error });
        }
    
        // Fallback to plain text processing
        return processPlainTextEmail(email.text);
    },
      


    processMessages(messages) {
        let originalText = '';
        let quotedText = [];
    
        messages.forEach(msg => {
            console.log("debug message content : ", msg);
            // Normalize content first
            const normalizedContent = msg.content.trim().replace(/\r?\n(?!\r?\n)/g, '\n');

            console.log("debug normalized content : ", [normalizedContent]);
            
            // Check for reply header
            if (emailPatterns.isReplyHeader(normalizedContent)) {
                const matchedText = [
                    emailPatterns.replyHeaders.standard,
                    emailPatterns.replyHeaders.complex
                ].reduce((match, pattern) => match || normalizedContent.match(pattern), null);
    
                if (matchedText) {
                    const parts = normalizedContent.split(matchedText);

                    // console.log("debug normalized content : ", parts[0]);
                    
                    // Handle original part (before reply header)
                    originalText = this.handleOriginalPart(parts[0]);
                    
                    // console.log("debug intermediate orginal_text: ", originalText);
    
                    // Handle quoted part (reply header and everything after)
                    if (parts[1]) {
                        const quotedPart = matchedText[0] + parts[1];
                        quotedText.push(this.handleQuotedPart(quotedPart));
                    }
                }
            } else {
                // If no reply header, treat everything as original text
                originalText = this.handleOriginalPart(normalizedContent);
            }
        });
    
        return {
            originalHTML: originalText,
            quotedHTML : quotedText
        };
    },

   combineOriginalAndQuotedText(originalText, quotedText) {
       const combinedMessage = `\n${originalText.trim()}${textFormatters.prefixedFinalMessage(quotedText.map(line => line.replace(/>/g, "\n>")).join("> "))}`;
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

    formatRootMessage2(email, sentiment) {
        const messages = messageProcessors.extractEmailContent(email.html);
        const { originalText, quotedText } = messageProcessors.processMessages(messages);

        logger.debug('Formatting root message:', {
            hasOriginalText: !!originalText,
            quotedTextCount: quotedText.length
        });

        return {
            originalText,
            quotedText
        };
    },

    formatRootMessage(email, sentiment) {
        const headerMessage = messageFormatters.constructHeaderMessage(email, sentiment);
        
        const messages = messageProcessors.extractEmailContent(email.html);
        const { originalHTML, quotedHTML } = messageProcessors.processMessages(messages);
        const originalText = messageProcessors.processHtmlToSlackMarkdown(originalHTML);
        const quotedText = quotedHTML.map(qt => messageProcessors.processHtmlToSlackMarkdown(qt)); //messageProcessors.htmlToMarkdown(quotedHTML)


        console.log("debug original message : \n ", originalText);
 
 
        // let message = messageProcessors.combineOriginalAndQuotedText(originalText, quotedText);
        // const finalMessage = messageProcessors.cleanAndFormatFinalMessage(message);
        // const finalMessageWithHeader = `${headerMessage}\n${textFormatters.cleanMarkdownSpecialCharacters(finalMessage)}`;

        // console.log("final message with Header :", finalMessageWithHeader);
        return {
            // finalMessageWithHeader,
            headerMessage,
            originalText,
            quotedText,
            headerMessage
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



