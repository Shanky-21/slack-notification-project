require('dotenv').config();
const { testSendAsRootMessage } = require('./services/sendSlackMessageUtils');
const { WebClient } = require('@slack/web-api');
const { logger } = require("../src/middleware/logger"); // Updated path
console.log("Bot Token:", process.env.SLACK_BOT_TOKEN ? "Token exists" : "No token found");
// Initialize Slack client
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const htmlEmail = `<h3 id="hi-anique-and-sean-">Hi = Anique and Sean,</h3>
<p>I have addressed several major issues in the <code>processMessage</code>\= function and made improvements for better handling of email parsing. Below= are the key fixes:</p>
<ol>
<li><strong>Footer Handling:</strong> If an email contained a footer match,= the rest of the email was being ignored, preventing quoted text from being= sent to Slack. This has been fixed.</li>
<li><strong>Separator Issue:</strong> Similarly, if a separator was detecte= d in the original email, the rest of the content was ignored, affecting quo= ted text visibility in Slack. This is now resolved.</li>
<li><strong>Code Refactoring:</strong> The <code>processMessage</code> func= tion was handling both original and quoted email processing in a complex ma= nner. I have extracted this logic into separate functions for better clarit= y and maintainability.</li>
</ol>
<p>After implementing these fixes, I tested emails with:</p>
<ul>
<li>Footers</li>
<li>Separators</li>
<li>Single emails</li>
<li>Replies</li>
</ul>
<p>I haven=E2=80=99t yet tested <strong>forwarded emails or emails with att= achments</strong>, which I will check separately.</p>
<p>Now that <code>processMessage</code> is handling most cases correctly, m= y next focus will be on <strong>enhancing Slack message formatting for bett= er readability.</strong></p>
<p>Here is the PR with the changes:<br>\=F0=9F=94=97 <a href="3D&quot;https://github.com/Shanky-21/slack-notification-pro=">Pull Request #11</a></p>
<p>Let me know if you have any feedback or suggestions.</p>
<p>Best,<br>Shashank</p>
<p>On Sun, Feb 23, 2025 at 3:50=E2=80=AFAM S= ouLNex &lt;<a href="3D&quot;mailto:shashankdwivedi9648@gmail.com&quot;">shashankdwivedi= 9648@gmail.com</a>> wrote:  </p>
<blockquote>
<h3 id="hi-anique-and-sean-">Hi Anique and Sean,</h3>
<p>While testing the formatting across multiple emails (around 50), I ident= ified the cause of the quoted content appearing in the original content.</p>
<p><strong>Issue 1: Quoted Content in Original Text</strong></p>
<ul>
<li>The reply header contained <code>\n</code> (new lines), causing it to b= e split into two parts, which prevented the regex from matching it correctl= y.</li>
<li>As a result, the header was appended to the original content instead of= being treated as a reply.</li>
</ul>
<p><strong>Possible Approaches to Fix This:</strong></p>
<ol>
<li>Normalize the text so that <code>\n</code> is removed from headers befo= re processing.</li>
<li>Or, first, split the email based on the reply header before splitting b= y new lines. This would ensure that the original content is separated from = the quoted content, but I need to verify that this does not introduce unint= ended issues.</li>
</ol>
<p>I will explore both options further to determine the most suitable fix.&lt;= /p&gt;</p>
<p><strong>Issue 2: HTML Content in Text Emails</strong></p>
<ul>
<li>Some emails contain an HTML document inside the text body. While we cur= rently remove inline CSS when extracting email content, the HTML document i= tself is not being stripped.</li>
<li>I will work on refining the cleanup logic to ensure the extracted text = is properly formatted.</li>
</ul>
<p>Let me know if you have any thoughts on the approach. I will continue te= sting and update you on the fixes.</p>
<p>Best,<br>Shashank</p>
<p>On Sat, Feb = 22, 2025 at 4:46=E2=80=AFAM SouLNex <a href="&#109;&#97;&#x69;&#x6c;&#116;&#x6f;&#x3a;&#91;&#x73;&#104;&#97;&#x73;&#104;&#97;&#110;&#x6b;&#x64;&#119;&#105;&#118;&#101;&#x64;&#105;&#57;&#x36;&#x34;&#56;&#64;&#x67;&#x6d;&#97;&#105;&#x6c;&#x2e;&#99;&#111;&#109;&#x5d;&#40;&#x33;&#68;&#x22;&#109;&#x61;&#105;&#108;&#116;&#111;&#58;&#115;&#104;&#x61;&#115;&#104;&#x61;&#x6e;&#x6b;&#x64;&#119;&#x69;&#118;&#101;&#100;&#x69;&#57;&#54;&#x3d;&#41;&#92;">&#91;&#x73;&#104;&#97;&#x73;&#104;&#97;&#110;&#x6b;&#x64;&#119;&#105;&#118;&#101;&#x64;&#105;&#57;&#x36;&#x34;&#56;&#64;&#x67;&#x6d;&#97;&#105;&#x6c;&#x2e;&#99;&#111;&#109;&#x5d;&#40;&#x33;&#68;&#x22;&#109;&#x61;&#105;&#108;&#116;&#111;&#58;&#115;&#104;&#x61;&#115;&#104;&#x61;&#x6e;&#x6b;&#x64;&#119;&#x69;&#118;&#101;&#100;&#x69;&#57;&#54;&#x3d;&#41;&#92;</a> wrote= :  </p>
<blockquote>
<h3 id="hi-anique-s-ean-">Hi Anique &amp; S= ean,</h3>
<p>I wanted to give you an update on my recent findings regarding Slack mes= sage formatting. I&#39;m also attaching a link for the updated code (showin= g code diffrence ) which you can check out. I&#39;ll be continuing on it ju= st wanted to give=C2=A0you an update.</p>
<h3 id="-f0-9f-94-b9-issue-identified-process-message-"><strong>\=F0=9F=94=B9 Issue Identified: ( Process Message )</strong></h3>
<ul>
<li>We were <strong>splitting the content by=C2=A0<code>newLine</code> and checking for <code>replyHeader</code>.</strong>
<strong>*   If found, we were adding all content </strong>after** <code>reply= Header</code> to <code>quotedText</code>.</li>
<li>Some emails contain <strong>multiple <code>replyHeaders</code> in a sin= gle line</strong>, which caused multiple replies and emails to be mistakenl= y included in the quoted content.**</li>
</ul>
<p>**</p>
<h3 id="-f0-9f-94-b9-fix-implemented-c2-a0-"><strong>\=F0=9F=94=B9 Fix Implemented:=C2=A0</strong></h3>
<ul>
<li>Now, the code <strong>checks the quoted content for additional <code>re= plyHeaders</code></strong>, ensuring that <strong>only the latest reply is included.</strong>
<strong>*   This prevents older replies from being mistakenly added to the quoted c= ontent.</strong></li>
</ul>
<p>**</p>
<h3 id="-f0-9f-94-b9-next-steps-"><strong>\=F0=9F=94=B9 Next Steps:</strong></h3>
<p>\=E2=9C=85 <strong>Continue checking for similar issues</strong> in the p= arsing logic.<br>\=E2=9C=85 <strong>Primary Focus:</strong> First, ensure the <strong>parsing= of different email formats is accurate</strong> and handled correctly.<br>\=E2=9C=85 <strong>Secondary Focus:</strong> Once parsing is solid, improve = <strong>how emails are displayed in Slack</strong> for better readability.&lt;= /p&gt;</p>
<p>\=F0=9F=94=97 <a href="3D&quot;https://www.diffchecker.com/mhjiOxjY/&quot;">View Code Changes</a></p>
<p>Let me know if you have any feedback or suggestions. I&#39;ll keep you u= pdated as I make further improvements.</p>
<p>Thanks,<br>Shashank</p>
<hr>
<hr>
<p>On Fri, Feb 21, 2025 at 7:24=E2=80=AFPM SouLNex &lt;<a href="3D&quot;=">shashankdwivedi9648= @gmail.com</a>> wrote:  </p>
<blockquote>
<p>Hi Anique,</p>
<p>I appreci= ate you taking the time to discuss the project today. It was great going ov= er the details, and I=E2=80=99ve noted your feedback on improving the Slack= message formatting.</p>
<p>I=E2=80=99ll be working on refining it over the = weekend, testing it across multiple email formats to ensure it=E2=80=99s mo= re robust. I=E2=80=99ll update you once the improvements are ready.</p>
<p>T= hanks again for your time!</p>
<p>Best,<br>Shashank</p>
<p>On Fri, 21 Feb,= 2025, 12:15 am SouLNex, <a href="&#x6d;&#97;&#105;&#108;&#x74;&#111;&#58;&#91;&#x73;&#104;&#97;&#115;&#104;&#97;&#x6e;&#x6b;&#x64;&#x77;&#x69;&#x76;&#101;&#x64;&#x69;&#x39;&#54;&#52;&#56;&#64;&#x67;&#x6d;&#x61;&#105;&#108;&#46;&#x63;&#x6f;&#x6d;&#x5d;&#x28;&#51;&#x44;&#x22;&#x6d;&#x61;&#105;&#x6c;&#116;&#111;&#x3a;&#x73;&#104;&#x61;&#115;&#104;&#97;&#x6e;&#107;&#x64;&#x77;&#105;&#118;&#101;&#100;&#105;&#57;&#54;&#52;&#x38;&#64;&#x67;&#109;&#97;&#x69;&#x6c;&#x2e;&#99;&#111;&#x3d;&#41;&#92;">&#91;&#x73;&#104;&#97;&#115;&#104;&#97;&#x6e;&#x6b;&#x64;&#x77;&#x69;&#x76;&#101;&#x64;&#x69;&#x39;&#54;&#52;&#56;&#64;&#x67;&#x6d;&#x61;&#105;&#108;&#46;&#x63;&#x6f;&#x6d;&#x5d;&#x28;&#51;&#x44;&#x22;&#x6d;&#x61;&#105;&#x6c;&#116;&#111;&#x3a;&#x73;&#104;&#x61;&#115;&#104;&#97;&#x6e;&#107;&#x64;&#x77;&#105;&#118;&#101;&#100;&#105;&#57;&#54;&#52;&#x38;&#64;&#x67;&#109;&#97;&#x69;&#x6c;&#x2e;&#99;&#111;&#x3d;&#41;&#92;</a> wrote:  </p>
<p>\=</p>
<blockquote>
<p>Hi An= ique,</p>
<p>Thanks for reaching out. I=E2=80=99ve booked the <strong>4:30 P= M ( IST ) slot</strong> and look forward to our discussion. Let me know if = there=E2=80=99s anything specific you=E2=80=99d like me to prepare in advan= ce.</p>
<p>See you then!</p>
<p>Best,<br>Shashank</p>
<p>On Thu, Feb 20, 2025 at = 9:10=E2=80=AFPM Anique Hussain <a href="&#109;&#97;&#x69;&#x6c;&#x74;&#111;&#x3a;&#97;&#x6e;&#x69;&#x71;&#x75;&#x65;&#64;&#x72;&#x65;&#97;&#99;&#104;&#x6f;&#114;&#98;&#x69;&#x74;&#x2e;&#x65;&#109;&#97;&#105;&#108;">&#97;&#x6e;&#x69;&#x71;&#x75;&#x65;&#64;&#x72;&#x65;&#97;&#99;&#104;&#x6f;&#114;&#98;&#x69;&#x74;&#x2e;&#x65;&#109;&#97;&#105;&#108;</a> wrote:  </p>
<blockquote>
<p>Hi S= hashank,<br>Tomorrow works for me. Please use this [link&lt;= /a&gt; to schedule the meeting at your convenience.  </p>
<p>Cheers,<br>Anique<br>](3D&quot;<a href="https://calen=">https://calen=</a>)</p>
<p><a href="3D&quot;https://calen="></a></p>
<p><a href="3D&quot;https://calen=">On= Thu, Feb 20, 2025 at 4:39=E2=80=AFPM SouLNex &lt;</a><a href="3D&quot;mailto:shashan=">shashankdwived= i9648@gmail.com</a>> wrote:  </p>
<blockquote>
<p>Hi Sean &amp; Anique,</p>
<p>Thanks for the update! As mentioned, I=E2=80=99m available tomorrow, b= ut I=E2=80=99m also free today if you=E2=80=99d like to talk sooner. Let me= know what works best for you.</p>
<p>Looking forward to our discussion!</p>
<p>\=</p>
<p>Best,<br>Shashank</p>
<p>On Thu, 20 Feb, 2025, 4:22 pm Sean Grossman, <sean@r= eachorbit.email> wrote:  </p>
<blockquote>
<p>Great! Anique had a few questions he wanted to talk through ab= out your project. I=E2=80=99ll let you guys firm up a time.</p>
<p><img src="3D&quot;https://r.superhuman.com/iLExwOvAUG1G6KkAUSIwhyed=" alt="3D&quot;&quot;"></p>
<p>\=20 =20</p>
<p>On Thu, Feb 20, 2025 at 3:52=E2=80=AFAM, SouLNex <a href="&#109;&#x61;&#105;&#108;&#x74;&#111;&#x3a;&#91;&#x73;&#104;&#97;&#x73;&#104;&#97;&#110;&#107;&#100;&#119;&#x69;&#118;&#x65;&#x64;&#x69;&#57;&#x36;&#x34;&#56;&#x40;&#103;&#109;&#x61;&#x69;&#108;&#x2e;&#x63;&#x6f;&#x6d;&#93;&#x28;&#51;&#x44;&#34;&#x6d;&#x61;&#105;&#108;&#x74;&#x6f;&#58;&#x73;&#x68;&#x61;&#x73;&#x68;&#x61;&#x6e;&#107;&#x64;&#119;&#x69;&#118;&#x65;&#100;&#105;&#x39;&#x36;&#x34;&#56;&#x40;&#x67;&#x6d;&#x61;&#x69;&#x6c;&#x2e;&#x63;&#111;&#x6d;&#34;&#x29;&#x5c;">&#91;&#x73;&#104;&#97;&#x73;&#104;&#97;&#110;&#107;&#100;&#119;&#x69;&#118;&#x65;&#x64;&#x69;&#57;&#x36;&#x34;&#56;&#x40;&#103;&#109;&#x61;&#x69;&#108;&#x2e;&#x63;&#x6f;&#x6d;&#93;&#x28;&#51;&#x44;&#34;&#x6d;&#x61;&#105;&#108;&#x74;&#x6f;&#58;&#x73;&#x68;&#x61;&#x73;&#x68;&#x61;&#x6e;&#107;&#x64;&#119;&#x69;&#118;&#x65;&#100;&#105;&#x39;&#x36;&#x34;&#56;&#x40;&#x67;&#x6d;&#x61;&#x69;&#x6c;&#x2e;&#x63;&#111;&#x6d;&#34;&#x29;&#x5c;</a> wrote:  </p>
<blockquote>
<p>Yes, I am available.</p>
<p>On Thu= , 20 Feb, 2025, 3:21 pm Sean Grossman, <a href="&#x6d;&#x61;&#x69;&#x6c;&#x74;&#x6f;&#58;&#115;&#x65;&#x61;&#110;&#64;&#x72;&#101;&#x61;&#99;&#x68;&#111;&#114;&#98;&#105;&#x74;&#46;&#101;&#x6d;&#x61;&#105;&#108;">&#115;&#x65;&#x61;&#110;&#64;&#x72;&#101;&#x61;&#99;&#x68;&#111;&#114;&#98;&#105;&#x74;&#46;&#101;&#x6d;&#x61;&#105;&#108;</a> wrote:=  </p>
<blockquote>
<p>Hey Shashank!=C2=A0</p>
<p>Are you available at = this time on Friday? Had a last minute conflict.=C2=A0</p>
<p>\=</p>
<p>Sean</p>
<p>\=20</p>
<p>\=20 =20</p>
</blockquote>
</blockquote>
</blockquote>
</blockquote>
</blockquote>
</blockquote>
</blockquote>
<hr>
</blockquote>
</blockquote>
`

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