// types.js
/**
 * @typedef {Object} EmailAddress
 * @property {string} address - Email address
 * @property {string} [name] - Name associated with email address
 */

/**
 * @typedef {Object} SlackReference
 * @property {string} messageTs - Message timestamp
 * @property {boolean} isRootMessage - Whether this is a root message
 * @property {string} threadTs - Thread timestamp
 */

/**
 * @typedef {'Good' | 'Neutral' | 'Bad'} EmailSentiment
 */

/**
 * @typedef {Object} Email
 * @property {string} _id - Email ID
 * @property {number} uid - Email UID
 * @property {EmailAddress} from - Sender's email details
 * @property {EmailAddress[]} to - Recipients' email details
 * @property {EmailAddress[]} [cc] - CC recipients
 * @property {EmailAddress[]} [bcc] - BCC recipients
 * @property {string} subject - Email subject
 * @property {Date} date - Email date
 * @property {string} text - Email body text
 * @property {string} [html] - Email HTML content
 * @property {SlackReference} [slackReference] - Slack message reference
 * @property {EmailSentiment} sentiment - Email sentiment
 */

/**
 * @typedef {Object} Team
 * @property {string} teamID - Team identifier
 * @property {string} slackTeamID - Slack team identifier
 * @property {string[]} [emailAddressList] - List of team email addresses
 */

/**
 * @typedef {Object} SlackBlock
 * @property {'section' | 'context' | 'divider' | 'header'} type - Block type
 * @property {Object} [text] - Block text
 * @property {string} text.type - Text type (mrkdwn or plain_text)
 * @property {string} text.text - Actual text content
 */

/**
 * @typedef {Object} SlackPayload
 * @property {string} channel - Channel ID
 * @property {string} text - Default text
 * @property {boolean} mrkdwn - Whether to parse markdown
 * @property {SlackBlock[]} blocks - Message blocks
 * @property {Object} metadata - Message metadata
 * @property {string} [thread_ts] - Thread timestamp for replies
 */

/**
 * @typedef {Object} EmailMetadata
 * @property {string} event_type - Type of event
 * @property {Object} event_payload - Event payload
 * @property {string} event_payload.fromEmail - Sender's email
 * @property {string} event_payload.toEmail - Recipient's email
 * @property {string} event_payload.rootEmailId - Root email ID
 * @property {string} event_payload.rootEmailUID - Root email UID
 * @property {string} event_payload.teamID - Team ID
 */

/**
 * @typedef {Object} SlackResponse
 * @property {string} messageTs - Message timestamp
 * @property {EmailMetadata} metadata - Message metadata
 */

/**
 * @typedef {Object} FormattedMessage
 * @property {string} finalMessageWithHeader - Final formatted message with header
 * @property {string[]} originalText - Original message text
 * @property {string[]} quotedText - Quoted text from previous messages
 */