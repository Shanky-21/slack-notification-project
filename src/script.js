require('dotenv').config();
const { testSendAsRootMessage } = require('./services/sendSlackMessageUtils');
const { WebClient } = require('@slack/web-api');
const { logger } = require("../src/middleware/logger"); // Updated path
console.log("Bot Token:", process.env.SLACK_BOT_TOKEN ? "Token exists" : "No token found");
// Initialize Slack client
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const longLatestReply = `I hope this email finds you well. https://www.example.com I wanted to provide a comprehensive update on our recent project developments and address several key points that have emerged during our last few meetings.

First and foremost, I'm pleased to report that we've made significant progress on the core functionalities we discussed. The team has successfully implemented the new authentication system, which now includes multi-factor authentication and improved session management. Our initial testing shows a 40% reduction in unauthorized access attempts, while maintaining a smooth user experience for legitimate users.

Regarding the performance optimizations we prioritized last quarter, I'm excited to share that we've achieved remarkable improvements. The database query optimization effort has resulted in a 60% reduction in response times for our most frequently used API endpoints. We've implemented caching layers at strategic points, and the results are quite promising. Average page load times have decreased from 3.2 seconds to just 1.1 seconds, which puts us well ahead of our target metrics.

I've been reviewing the detailed analytics from our user behavior studies, and there are several interesting patterns that I believe we should discuss in our next meeting. The data suggests that users are spending significantly more time on our new dashboard features, particularly the customizable widgets we introduced last month. The average session duration has increased by 25%, and we're seeing much higher engagement rates with the interactive elements.

On the technical infrastructure front, we've completed the migration to the new cloud architecture we discussed. This transition has already shown benefits in terms of scalability and resource utilization. Our system can now handle peak loads 3x higher than before, with only a minimal increase in operational costs. The automated scaling mechanisms are working as intended, and we've documented a 99.99% uptime since the migration.

I've also been working closely with the UX team to address the feedback we received from our beta testers. We've implemented several key improvements:
1. Redesigned the navigation flow to reduce the number of clicks required for common actions
2. Added more intuitive error messages and helper tooltips throughout the interface
3. Improved the mobile responsiveness of all major features
4. Implemented a new color scheme that better adheres to accessibility guidelines

The security audit we commissioned last month has been completed, and I'm pleased to report that no critical vulnerabilities were found. However, they did identify several areas where we can enhance our security posture:
- Implementing additional input validation layers
- Strengthening our password policy requirements
- Enhancing our logging and monitoring systems
- Updating some third-party dependencies to their latest versions

Looking ahead to next quarter, I've drafted a preliminary roadmap that I'd like to discuss with you. It includes:
- Expanding our API capabilities to support the new integration requirements
- Implementing the machine learning features we discussed for predictive analytics
- Developing a more robust backup and disaster recovery system
- Rolling out the new reporting dashboard with customizable metrics

The development team has also made significant progress on the technical debt items we identified. We've refactored several key components, resulting in a more maintainable codebase. The unit test coverage has increased from 76% to 92%, and we've automated many of our previously manual testing processes.

I've been particularly impressed with how the team has handled the challenges that arose during the recent feature rollout. Their quick response to user feedback and ability to iterate rapidly on solutions has been exemplary. We've maintained our aggressive development schedule while ensuring quality hasn't been compromised.

Regarding the budget allocation for the next phase, I've prepared a detailed breakdown of the resources we'll need. The estimates include provisions for:
- Additional cloud infrastructure costs
- Third-party service subscriptions
- Development tools and licenses
- External security testing and auditing
- Training and documentation resources

I believe we're well-positioned to move forward with the next phase of development. The groundwork we've laid this quarter provides a solid foundation for the ambitious features we have planned. The team is energized and ready to tackle the challenges ahead.

Would you like to schedule a meeting next week to discuss these points in detail? I can prepare a more detailed presentation with specific metrics and visualizations if that would be helpful. I'm particularly interested in getting your thoughts on the prioritization of the new features we've proposed.

Also, I've attached the complete technical specifications document for your review. It includes detailed architecture diagrams, API documentation, and performance benchmarks from our latest testing cycle.

Please let me know if you need any clarification on any of these points or if there are specific aspects you'd like me to elaborate on further. I'm available for a call at your convenience to discuss any immediate concerns or questions you might have.

Looking forward to your feedback and our continued collaboration on this exciting project.`;

const testSendEmailToSlack = async () => {
  try {
      const sentiment = "Good"
     
      const team =  {
          "_id": "67245603b922398f8da1985d0",
          "teamID": "ORBIT",
          "__v": 21,
          "createdAt": "2024-08-29T20:51:51.670Z",
          "emailAddressList": [
            {
              "emailAddress": "anique.orbit@zohomail.in", // Replace with your's, you can create a new one in zoho
              "password": "xxxx-xxxxx-xxxxx",
              "goodChannel": "C082VFQGT9N", // Replace with the ID of the channel where you want to send the good email
              "neutralChannel": "C08297E9QGL", // Replace with the ID of the channel where you want to send the neutral email
              "badChannel": "C08297EG7J8", // Replace with the ID of the channel where you want to send the bad email
              "coreChannel": "C0823SA4PB7", // Replace with the ID of the channel where you want to send the core email
              "host": "imap.zoho.in", // Replace with the host of your zoho email
              "imapPort": "993", // Replace with the port of your zoho email
              "smtpUsername": "anique.orbit@zohomail.in", // Replace with your's, you can create a new one in zoho
              "smtpPassword": "xxxx-xxxxx-xxxxx", // Password of your zoho email
              "smtpHost": "smtp.zoho.in", // Host of your zoho email
              "smtpPort": "465", // Port of your zoho email
              "calendlyLink": "https://calendly.com/anique-reachorbit/30min", // Link to your calendly
              "firstName": "Orbit", // First name of your team
              "lastName": "Unibox", // Last name of your team
              "status": "Live", // Status of your team
              "dateChecked": "2024-11-28T22:05:23.710Z", // Date of your last email check
              "latestEmailMessageID": 0, // Latest email message ID
            }
          ],
          "slackTeamID": "XXXXX"
        }


      // Example email data fetched from imap
      const email = {
          "_id": {
            "$oid": "67a4e72eb6edea6a4c221d33"
          },
          "uid": 19,
          "from": {
            "address": "anique@reachorbit.email",
            "name": "Anique Hussain"
          },
          "__v": 0,
          "attachments": [],
          "bcc": [],
          "cc": [],
          "createdAt": {
            "$date": "2025-02-06T16:45:34.150Z"
          },
          "date":"2024-10-18T23:42:11.000Z", // check this needs to be handled as validation
          "followUps": {
            "completed": false,
            "followUpHistory": [],
            "noOfApprovalRequestsSent": 0
          },
          "generatedReply": null,
          "generatedReplySent": false,
          "headers": {
            "messageId": "<CAMdWmwJMfSi4E7BxnZ7fhyQHLwErNb30hy6JrMp5fM=DMQ1toA@mail.gmail.com>",
            "inReplyTo": "<d8480d9f-07f6-be34-3a72-ca8da54c6f57@zohomail.in>",
            "references": [
              "<CAMdWmwLHkPgTEzP===fp7SYY3KbKUGv_irkgnC=Lbm5EUebzbg@mail.gmail.com>",
              "<d8480d9f-07f6-be34-3a72-ca8da54c6f57@zohomail.in>"
            ],
            "dkimSignature": {
              "version": "v=1",
              "signingAlgorithm": "rsa-sha256",
              "canonicalizationMethod": "relaxed/relaxed",
              "signingDomain": "reachorbit-email.20230601.gappssmtp.com",
              "selector": "20230601",
              "timestamp": 1729294943,
              "expirationTime": 1729899743,
              "domainAlignmentTag": "zohomail.in",
              "signedHeaders": "to:subject:message-id:date:from:in-reply-to:references:mime-version :from:to:cc:subject:date:message-id:reply-to",
              "bodyHash": "/O8yMSewSQRjK0trtMKZniTWux/vnhk32fumzIEVK5I=",
              "signature": "v4yQEuQtO7sbGbzmaHzla5cOlGFhYFnN0i4OsaeA51FGvN13ds2JjlBo+L89G9F0Lg SGH3Y9rCCkK0fvB3r7iPJCbuw5e71ZBx7HoR7tfZAIGN6SYV26yNdJFC/5ncRgl4HHXv Ujd+gKHRy5m0xag2323tgMAZVxIEYM7vzn3gIVc3ei+e9c8oHhhXilVdKJldN4SWkxz5 aDI//lPGyUMsKaJrnZiIhVuDNSVkg5oYHTAUa0b7QVVK8OfCxH2Oz/hHWWxXPX+aFtxl hurrlqX0VugqLdiDH5r35rqzznkxuoxz0pZqD08JSDhEBFsTW40ErgrH98nTVngCWlWU hjTQ=="
            },
            "authenticationResults": [],
            "xMailer": "",
            "xOriginatingIp": "",
            "listUnsubscribe": ""
          },
          "html": "<html><head></head><body><div dir=\"ltr\">I am good, how about you?&nbsp;<br></div><br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Sat, Oct 19, 2024 at 5:11 AM &lt;<a href=\"mailto:anique.orbit@zohomail.in\">anique.orbit@zohomail.in</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex\">Hey,<br>\n<br>\nHow's you<br>\n<br>\n---- On Fri, Oct 18, 2024, 1:36 AM &lt;anique@reachorbit.email&gt; wrote: --- <br>\n&gt; Hi AniqueOrbit,<br>\n&gt; <br>\n&gt; I hope this message finds you well. As we continue to develop our products<br>\n&gt; and align our goals for the upcoming quarter, I would like to schedule a<br>\n&gt; meeting to discuss the product roadmap.<br>\n&gt; <br>\n&gt; It’s essential that we gather insights and feedback from all stakeholders<br>\n&gt; to ensure our plans reflect our strategic vision and address our users'<br>\n&gt; needs effectively. I believe this discussion will help us prioritize<br>\n&gt; features and set clear milestones for our projects.<br>\n&gt; <br>\n&gt; Could you please let me know your availability for a meeting next week? I<br>\n&gt; look forward to collaborating on this exciting planning phase.<br>\n&gt; <br>\n&gt; Thank you, and I look forward to hearing from you soon.<br>\n&gt; <br>\n&gt; Best regards,<br>\n&gt; AniqueGmail<br>\n<br>\n<br>\n<br>\n</blockquote></div>\n</body></html>",
          "isDeliveryFailureEmail": false,
          "isOutOfOfficeEmail": false,
          "isPromotionalEmail": false,
          "isSpamEmail": false,
          "outOfOfficeInfo": {
            "conferences": [],
            "contacts": [],
            "links": []
          },
          "slackReplyHistory": [],
          "status": "Live",
          "subject": "Re: Product Roadmap Meeting",
          "teamID": "ORBIT",
          "text": `${longLatestReply} On Sat, Oct 19, 2024 at 5:11 AM <anique.orbit@zohomail.in> wrote: > > Hey, > >  how's you? > > ---- On Fri, Oct 18, 2024, 1:36 AM <anique@reachorbit.email> wrote: --- > > Hi AniqueOrbit, > > > > I hope this message finds you well. As we continue to develop our > products > > and align our goals for the upcoming quarter, I would like to schedule a > > meeting to discuss the product roadmap.\n> > > > It’s essential that we gather insights and feedback from all stakeholders > > to ensure our plans reflect our strategic vision and address our users' > > needs effectively. I believe this discussion will help us prioritize > > features and set clear milestones for our projects.\n> > > > Could you please let me know your availability for a meeting next week? I > > look forward to collaborating on this exciting planning phase.\n> > > > Thank you, and I look forward to hearing from you soon.\n> > > > Best regards, > > AniqueGmail > > > >`,
          "to": [
            {
              "address": "anique.orbit@zohomail.in",
              "name": "",
              "_id": {
                "$oid": "67a4e72e01f7aca09c0ca32d"
              }
            }
          ],
          "updatedAt": {
            "$date": "2025-02-06T16:45:37.027Z"
          },
          "sentiment": "Good",
          "slackReference": {
            "messageTs": "1738860336.484729",
            "isRootMessage": true,
            "threadTs": "1738860336.484729"
          }
        }


      const result = await testSendAsRootMessage(team, email, sentiment, client)

      logger.info('Message sent successfully', {
        messageTimestamp: result.messageTs,
        metadata: result.metadata
      });

      process.exit(0);
  } catch (error) {
      console.error('Error sending email to Slack:', error);
      process.exit(1);
  }
};


// Execute the function
testSendEmailToSlack();