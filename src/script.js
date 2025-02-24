require('dotenv').config();
const { testSendAsRootMessage } = require('./services/sendSlackMessageUtils');
const { WebClient } = require('@slack/web-api');
const { logger } = require("../src/middleware/logger"); // Updated path
console.log("Bot Token:", process.env.SLACK_BOT_TOKEN ? "Token exists" : "No token found");
// Initialize Slack client
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const htmlEmail = `<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional //EN\"><html><head><title>Facebook</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><style nonce=\"qQeK5SXb\">@media all and (max-width: 480px){*[class].ib_t{min-width:100% !important}*[class].ib_row{display:block !important}*[class].ib_ext{display:block !important;padding:10px 0 5px 0;vertical-align:top !important;width:100% !important}*[class].ib_img,*[class].ib_mid{vertical-align:top !important}*[class].mb_blk{display:block !important;padding-bottom:10px;width:100% !important}*[class].mb_hide{display:none !important}*[class].mb_inl{display:inline !important}*[class].d_mb_flex{display:block !important}}.d_mb_show{display:none}.d_mb_flex{display:flex}@media only screen and (max-device-width: 480px){.d_mb_hide{display:none !important}.d_mb_show{display:block !important}.d_mb_flex{display:block !important}}.mb_text h1,.mb_text h2,.mb_text h3,.mb_text h4,.mb_text h5,.mb_text h6{line-height:normal}.mb_work_text h1{font-size:18px;line-height:normal;margin-top:4px}.mb_work_text h2,.mb_work_text h3{font-size:16px;line-height:normal;margin-top:4px}.mb_work_text h4,.mb_work_text h5,.mb_work_text h6{font-size:14px;line-height:normal}.mb_work_text a{color:#1270e9}.mb_work_text p{margin-top:4px}</style></head><body style=\"margin:0;padding:0;\" dir=\"ltr\" bgcolor=\"#ffffff\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" id=\"email_table\" style=\"border-collapse:collapse;\"><tr><td id=\"email_content\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff;\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"20\" style=\"line-height:20px;\" colspan=\"3\">&nbsp;</td></tr><tr><td height=\"1\" colspan=\"3\" style=\"line-height:1px;\"><span style=\"color:#FFFFFF;font-size:1px;opacity:0;\"> The updated Terms will go into effect on January 1, 2025 and we’ve made our standards easier to find. </span></td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"15\" style=\"line-height:15px;\" colspan=\"3\">&nbsp;</td></tr><tr><td width=\"32\" align=\"left\" valign=\"middle\" style=\"height:32;line-height:0px;\"><a href=\"https://www.facebook.com/n/?aref=1731039656431207&amp;medium=email&amp;mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8&amp;rms=v2&amp;irms=1\" style=\"color:#1b74e4;text-decoration:none;\"><div><img class=\"img\" src=\"https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/6EMh2DWYp9P.png\" alt=\"\" width=\"60\" height=\"12\" /></div></a></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td width=\"100%\" style=\"\"><a href=\"https://www.facebook.com/n/?aref=1731039656431207&amp;medium=email&amp;mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8&amp;rms=v2&amp;irms=1\" style=\"color:#1877f2;text-decoration:none;font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:19px;line-height:32px;\"></a></td></tr><tr style=\"\"><td height=\"0\" style=\"line-height:0px;\" colspan=\"3\">&nbsp;</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">We’re updating our Terms and Community Standards</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Hi consultxgen, </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">We’re updating our Terms and Community Standards. The updated Terms will go into effect on January 1, 2025 and we have made our standards easier to find.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">What you should know</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">Community Standards</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F477434105621119&amp;e=AT1KB5MRo2ImRIH-l-4TkL585Vfu_y1LCogr-PS-C8WyJ1ia0oKrWvPZ6cuOFynrG9k5V-7i1toBLiH3CYJIS_NJJogjDPU7h0aMoiNpN5FyoNjYFnk_RIsGfaScKr45-_yuNg\" style=\"color:#1b74e4;text-decoration:none;\">Community Standards</a> describe what is and isn’t allowed on our services.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> We’ve brought the standards that apply across Facebook, Instagram, Messenger and Threads together in one place, making them easier for you to find.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">Terms of Service</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F581066165581870%2F&amp;e=AT04oQwRHBxSV4d_uc4VbCFs9i6RpD7cStWsjBHcAy6trPsLjhUWQl3SqPP4gDThAHhBexys1c2BAOaK67HjX88FUaYZ6FrTKmvgY03bu1_Sk_aSYtrzV_QMvzTGTwRIuD31RQ\" style=\"color:#1b74e4;text-decoration:none;\">Terms</a> explain what you can expect from us as you use our services, and what we expect from you as a user of our services.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> We’ve made our Terms easier to understand by providing more information about certain existing policies and practices. This includes things like clarifying that people or businesses may still be subject to our Terms when they are logged out or if they access our products without an account. We’ve also added links to our Terms for Avatars and AI, which apply if they’re available in your region.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">What this means for you</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F581066165581870%2F&amp;e=AT1fD5Opgmh7o8zlJRNUbY54b9i7Jny28RSVYWQ1IhAHtdgIYMef3quIGXFMQ1KkkA6Uz6O0GX44dPl7NKBLgQYTb6gA2MB3yBccNNdEFWtotlQpvlZJBso8aO5MukBA3P4vXw\" style=\"color:#1b74e4;text-decoration:none;\">Terms</a> have been updated to reflect these changes, and go into effect on January 1, 2025. By continuing to use our products or the services you receive after that date, you agree to the updated Terms.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"><a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F450817761347796&amp;e=AT2y_wTZWw5oMWE3F3O9wWkOT2JOuL20HizpRXjdU-dKkn80ZwwupSW3dNEgyWeRDx2wI12hw1olkcsH3XmnUJCZKdnQ878Y_lmxEd0QKrfK7q-jkiZ9E6FHnHjKy1zWud2GMw\" style=\"color:#1b74e4;text-decoration:none;\">Learn more</a> about your options if you do not want to agree to the updated Terms. </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Thank you for using our services,<br />Meta Platforms </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" align=\"left\" style=\"border-collapse:collapse;\"><tr style=\"border-top:solid 1px #e5e5e5;\"><td height=\"19\" style=\"line-height:19px;\">&nbsp;</td></tr><tr><td style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:11px;color:#aaaaaa;line-height:16px;\">This message was sent to <a href=\"mailto:shashankdwivedi9648&#064;gmail.com\" style=\"color:#1b74e4;text-decoration:none;\">shashankdwivedi9648&#064;gmail.com</a> at your request.<br />Meta Platforms, Inc., Attention: Community Support, 1 Meta Way, Menlo Park, CA 94025</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr style=\"\"><td height=\"20\" style=\"line-height:20px;\" colspan=\"3\">&nbsp;</td></tr></table><span style=\"\"><img src=\"https://www.facebook.com/email_open_log_pic.php?mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8\" style=\"border:0;width:1px;height:1px;\" /></span></td></tr></table></body></html>\n\n"`

const longLatestReply = `I hope this email finds you well. https://www.example.com I wanted to provide a comprehensive update on our recent project developments and address several key points that have emerged during our last few meetings.

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
          "html": htmlEmail,
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