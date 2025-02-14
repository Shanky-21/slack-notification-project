require('dotenv').config();
const { testSendAsRootMessage } = require('./sendSlackMessageUtils');
const { WebClient } = require('@slack/web-api');

console.log("Bot Token:", process.env.SLACK_BOT_TOKEN ? "Token exists" : "No token found");
// Initialize Slack client
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

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
          "text": "I am good, how about you? On Sat, Oct 19, 2024 at 5:11 AM <anique.orbit@zohomail.in> wrote: > Hey, > > How's you > > ---- On Fri, Oct 18, 2024, 1:36 AM <anique@reachorbit.email> wrote: --- > > Hi AniqueOrbit, > > > > I hope this message finds you well. As we continue to develop our > products > > and align our goals for the upcoming quarter, I would like to schedule a > > meeting to discuss the product roadmap.\n> > > > It’s essential that we gather insights and feedback from all stakeholders > > to ensure our plans reflect our strategic vision and address our users' > > needs effectively. I believe this discussion will help us prioritize > > features and set clear milestones for our projects.\n> > > > Could you please let me know your availability for a meeting next week? I > > look forward to collaborating on this exciting planning phase.\n> > > > Thank you, and I look forward to hearing from you soon.\n> > > > Best regards, > > AniqueGmail > > > >",
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


      await testSendAsRootMessage(team, email, sentiment, client)
      process.exit(0);
  } catch (error) {
      console.error('Error sending email to Slack:', error);
  }
};


// Execute the function
testSendEmailToSlack();