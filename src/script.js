require('dotenv').config();
const { testSendAsRootMessage } = require('./services/sendSlackMessageUtils');
const { WebClient } = require('@slack/web-api');
const { logger } = require("../src/middleware/logger"); // Updated path
console.log("Bot Token:", process.env.SLACK_BOT_TOKEN ? "Token exists" : "No token found");
// Initialize Slack client
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const htmlEmail2 = `<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional //EN\"><html><head><title>Facebook</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><style nonce=\"qQeK5SXb\">@media all and (max-width: 480px){*[class].ib_t{min-width:100% !important}*[class].ib_row{display:block !important}*[class].ib_ext{display:block !important;padding:10px 0 5px 0;vertical-align:top !important;width:100% !important}*[class].ib_img,*[class].ib_mid{vertical-align:top !important}*[class].mb_blk{display:block !important;padding-bottom:10px;width:100% !important}*[class].mb_hide{display:none !important}*[class].mb_inl{display:inline !important}*[class].d_mb_flex{display:block !important}}.d_mb_show{display:none}.d_mb_flex{display:flex}@media only screen and (max-device-width: 480px){.d_mb_hide{display:none !important}.d_mb_show{display:block !important}.d_mb_flex{display:block !important}}.mb_text h1,.mb_text h2,.mb_text h3,.mb_text h4,.mb_text h5,.mb_text h6{line-height:normal}.mb_work_text h1{font-size:18px;line-height:normal;margin-top:4px}.mb_work_text h2,.mb_work_text h3{font-size:16px;line-height:normal;margin-top:4px}.mb_work_text h4,.mb_work_text h5,.mb_work_text h6{font-size:14px;line-height:normal}.mb_work_text a{color:#1270e9}.mb_work_text p{margin-top:4px}</style></head><body style=\"margin:0;padding:0;\" dir=\"ltr\" bgcolor=\"#ffffff\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" id=\"email_table\" style=\"border-collapse:collapse;\"><tr><td id=\"email_content\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff;\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"20\" style=\"line-height:20px;\" colspan=\"3\">&nbsp;</td></tr><tr><td height=\"1\" colspan=\"3\" style=\"line-height:1px;\"><span style=\"color:#FFFFFF;font-size:1px;opacity:0;\"> The updated Terms will go into effect on January 1, 2025 and we’ve made our standards easier to find. </span></td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"15\" style=\"line-height:15px;\" colspan=\"3\">&nbsp;</td></tr><tr><td width=\"32\" align=\"left\" valign=\"middle\" style=\"height:32;line-height:0px;\"><a href=\"https://www.facebook.com/n/?aref=1731039656431207&amp;medium=email&amp;mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8&amp;rms=v2&amp;irms=1\" style=\"color:#1b74e4;text-decoration:none;\"><div><img class=\"img\" src=\"https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/6EMh2DWYp9P.png\" alt=\"\" width=\"60\" height=\"12\" /></div></a></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td width=\"100%\" style=\"\"><a href=\"https://www.facebook.com/n/?aref=1731039656431207&amp;medium=email&amp;mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8&amp;rms=v2&amp;irms=1\" style=\"color:#1877f2;text-decoration:none;font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:19px;line-height:32px;\"></a></td></tr><tr style=\"\"><td height=\"0\" style=\"line-height:0px;\" colspan=\"3\">&nbsp;</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\"><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">We’re updating our Terms and Community Standards</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Hi consultxgen, </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">We’re updating our Terms and Community Standards. The updated Terms will go into effect on January 1, 2025 and we have made our standards easier to find.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">What you should know</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">Community Standards</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F477434105621119&amp;e=AT1KB5MRo2ImRIH-l-4TkL585Vfu_y1LCogr-PS-C8WyJ1ia0oKrWvPZ6cuOFynrG9k5V-7i1toBLiH3CYJIS_NJJogjDPU7h0aMoiNpN5FyoNjYFnk_RIsGfaScKr45-_yuNg\" style=\"color:#1b74e4;text-decoration:none;\">Community Standards</a> describe what is and isn’t allowed on our services.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> We’ve brought the standards that apply across Facebook, Instagram, Messenger and Threads together in one place, making them easier for you to find.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">Terms of Service</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\">Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F581066165581870%2F&amp;e=AT04oQwRHBxSV4d_uc4VbCFs9i6RpD7cStWsjBHcAy6trPsLjhUWQl3SqPP4gDThAHhBexys1c2BAOaK67HjX88FUaYZ6FrTKmvgY03bu1_Sk_aSYtrzV_QMvzTGTwRIuD31RQ\" style=\"color:#1b74e4;text-decoration:none;\">Terms</a> explain what you can expect from us as you use our services, and what we expect from you as a user of our services.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> We’ve made our Terms easier to understand by providing more information about certain existing policies and practices. This includes things like clarifying that people or businesses may still be subject to our Terms when they are logged out or if they access our products without an account. We’ve also added links to our Terms for Avatars and AI, which apply if they’re available in your region.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;font-weight:bold;color:#141823;\">What this means for you</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Our <a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F581066165581870%2F&amp;e=AT1fD5Opgmh7o8zlJRNUbY54b9i7Jny28RSVYWQ1IhAHtdgIYMef3quIGXFMQ1KkkA6Uz6O0GX44dPl7NKBLgQYTb6gA2MB3yBccNNdEFWtotlQpvlZJBso8aO5MukBA3P4vXw\" style=\"color:#1b74e4;text-decoration:none;\">Terms</a> have been updated to reflect these changes, and go into effect on January 1, 2025. By continuing to use our products or the services you receive after that date, you agree to the updated Terms.</span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"><a href=\"https://l.instagram.com/?u=https%3A%2F%2Fhelp.instagram.com%2F450817761347796&amp;e=AT2y_wTZWw5oMWE3F3O9wWkOT2JOuL20HizpRXjdU-dKkn80ZwwupSW3dNEgyWeRDx2wI12hw1olkcsH3XmnUJCZKdnQ878Y_lmxEd0QKrfK7q-jkiZ9E6FHnHjKy1zWud2GMw\" style=\"color:#1b74e4;text-decoration:none;\">Learn more</a> about your options if you do not want to agree to the updated Terms. </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr><tr><td style=\"\"><span class=\"mb_text\" style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823;\"> Thank you for using our services,<br />Meta Platforms </span></td></tr><tr style=\"\"><td height=\"28\" style=\"line-height:28px;\">&nbsp;</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td><td style=\"\"><table border=\"0\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" align=\"left\" style=\"border-collapse:collapse;\"><tr style=\"border-top:solid 1px #e5e5e5;\"><td height=\"19\" style=\"line-height:19px;\">&nbsp;</td></tr><tr><td style=\"font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:11px;color:#aaaaaa;line-height:16px;\">This message was sent to <a href=\"mailto:shashankdwivedi9648&#064;gmail.com\" style=\"color:#1b74e4;text-decoration:none;\">shashankdwivedi9648&#064;gmail.com</a> at your request.<br />Meta Platforms, Inc., Attention: Community Support, 1 Meta Way, Menlo Park, CA 94025</td></tr></table></td><td width=\"15\" style=\"display:block;width:15px;\">&nbsp;&nbsp;&nbsp;</td></tr><tr style=\"\"><td height=\"20\" style=\"line-height:20px;\" colspan=\"3\">&nbsp;</td></tr></table><span style=\"\"><img src=\"https://www.facebook.com/email_open_log_pic.php?mid=6265eca3a4b94G24bc3ce82177e3G6265f13d04e67G91b8\" style=\"border:0;width:1px;height:1px;\" /></span></td></tr></table></body></html>\n\n"`

const htmlEmail8 = `<div dir=\"auto\"><div>\n<div>\n<p>Hey Shashank,</p>\n<p dir=\"auto\">Thanks for the update!<br></p>\n<p dir=\"auto\">Can you push the updated code to a GitHub repo? That’ll make it easier to review. Also, could you share a screenshot comparing the previous message formatting vs. the improvements you made? It’d be good to see how it’s evolved.</p>\n<p dir=\"auto\">Looking forward to the update.</p>\n<p dir=\"auto\">Best,</p><p dir=\"auto\">Anique</p>\n</div>\n</div><br></div><div><br><div class=\"gmail_quote gmail_quote_container\"><div dir=\"ltr\" class=\"gmail_attr\">On Fri, Feb 14, 2025 at 9:13 PM SouLNex &lt;<a href=\"mailto:shashankdwivedi9648@gmail.com\">shashankdwivedi9648@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;padding-left:1ex;border-left-color:rgb(204,204,204)\"><div dir=\"ltr\"><p>Hi Anique and Sean,</p><p>I just realized that I missed a few details in the assignment, particularly regarding function imports and exports in JavaScript. I wanted to acknowledge this and ensure that functions are properly exported before being imported into other files.</p><p>Apologies for the oversight, and I appreciate your time reviewing my submission. Please let me know if there’s anything else I should clarify.</p><p>Best regards,<br>Shashank</p><p></p></div>\n<br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Fri, 14 Feb, 2025, 2:06 am SouLNex, &lt;<a href=\"mailto:shashankdwivedi9648@gmail.com\" target=\"_blank\">shashankdwivedi9648@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;padding-left:1ex;border-left-color:rgb(204,204,204)\"><div dir=\"ltr\"><div dir=\"ltr\"><p>Hi Sean and Anique,</p><p>I hope you&#39;re both doing well.</p><p>I&#39;ve completed the assignment and added my comments to the document. Additionally, I’ve created a separate document outlining key findings and improvements.</p><p>You can find it here also attached to this email<br><a rel=\"noopener noreferrer\" href=\"https://docs.google.com/document/d/1Uvx2KAYp7iYsFRuxBTyL_oBwFULCzeRDNT-wCczr9rI/edit?usp=sharing\" target=\"_blank\">Key Findings &amp; Improvements Document</a></p><p>Please let me know if you have any feedback or if there&#39;s anything else I can assist with. Looking forward to your thoughts!</p><p>Best,<br>Shashank</p></div><br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Thu, Feb 13, 2025 at 2:55 PM SouLNex &lt;<a href=\"mailto:shashankdwivedi9648@gmail.com\" rel=\"noreferrer\" target=\"_blank\">shashankdwivedi9648@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;padding-left:1ex;border-left-color:rgb(204,204,204)\"><div dir=\"ltr\"><div dir=\"ltr\"><p>Hi Anique,</p><p>Thank you for sharing the assignment details. I’ve received the link and will review the requirements tonight. If I have any questions, I’ll reach out.</p><p>Best regards,<br>Shashank</p></div><br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Thu, Feb 13, 2025 at 12:42 PM Anique Hussain &lt;anique@reachorbit.email&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0px 0px 0px 0.8ex;border-left-width:1px;border-left-style:solid;padding-left:1ex;border-left-color:rgb(204,204,204)\"><div dir=\"ltr\"><p>Hi Shashank,<br></p><div>As the next step in our hiring process, we&#39;d like you to complete a take-home assignment focused on Slack message formatting and code review.</div><div><br></div><div>Assignment Link: <a href=\"https://docs.google.com/document/d/10cNH-Eqrit2eUbRQNg6D5qgQg9xgXSc4e9CLtZndmE8/edit?usp=sharing\" rel=\"noreferrer\" target=\"_blank\">https://docs.google.com/document/d/10cNH-Eqrit2eUbRQNg6D5qgQg9xgXSc4e9CLtZndmE8/edit?usp=sharing</a><br></div><div><br></div><div>Let us know if you have any questions. Looking forward to your submission!<br></div><div><br></div><div>Cheers,<br>Anique</div></div>\n</blockquote></div></div>\n</blockquote></div></div>\n</blockquote></div>\n</blockquote></div></div>\n`

const htmlEmail4 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Marketing Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            color: #333;
        }
        .content {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Boost Your Sales with [Your Product Name]</h1>
        </div>
        <div class="content">
            <p>Discover how [Your Product Name] can help you increase conversions, automate workflows, and grow your business effortlessly.</p>
            <p>🚀 Get started today and take your marketing to the next level!</p>
            <a href="https://yourwebsite.com" class="cta-button">Start Now</a>
        </div>
        <div class="footer">
            <p>Need help? <a href="mailto:support@yourwebsite.com">Contact us</a></p>
            <p>&copy; 2025 [Your Company Name]. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

const htmlEmail6 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Struggling with Coding Problems? Let’s Make It Easy!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            color: #333;
        }
        .content {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .coupon {
            background-color: #ffeb3b;
            color: #333;
            font-weight: bold;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Struggling with Coding Problems?</h1>
        </div>
        <div class="content">
            <p>We’ve all been there—stuck on a coding problem for hours, searching through endless forums, and watching multiple tutorials, only to feel more confused.</p>
            <p><strong>CodeSmart</strong> makes it easier! Our browser extension gives you instant hints, step-by-step approaches, and smart suggestions right where you code.</p>
            <p>🚀 **Solve problems faster** and **learn efficiently**—without breaking your flow.</p>
            <p class="coupon">Use Code: <strong>SMART50</strong> for 50% off on your first month!</p>
            <a href="https://codesmart.in" class="cta-button">Try CodeSmart Now</a>
        </div>
        <div class="footer">
            <p>Need help? <a href="mailto:support@codesmart.in">Contact us</a></p>
            <p>&copy; 2025 CodeSmart.in | Co-founded by Shashank Dwivedi</p>
        </div>
    </div>
</body>
</html>
`

const htmlEmail5 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Re: How CodeSmart Helps You</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: left;
            padding: 15px 20px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #ddd;
        }
        .header h2 {
            color: #333;
            font-size: 18px;
            margin: 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .question {
            font-weight: bold;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 15px;
            border-top: 1px solid #ddd;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Re: How CodeSmart Helps You</h2>
        </div>
        <div class="content">
            <p>Hi Shashank,</p>
            <p>Thanks for reaching out! I have a few questions before I proceed:</p>

            <p class="question">1. How is CodeSmart going to solve my problem?</p>
            <p>I want to understand exactly how it helps me when solving coding problems.</p>

            <p class="question">2. Why should I pay for it?</p>
            <p>There are many free resources available, so what makes CodeSmart worth the cost?</p>

            <p class="question">3. Why can’t I just Google or use ChatGPT instead?</p>
            <p>Wouldn’t a quick search give me the same or better answers?</p>

            <p class="question">4. What else is included in the subscription?</p>
            <p>Besides problem-solving hints, what additional features does CodeSmart provide?</p>

            <p>Looking forward to your response!</p>

            <p>Best,</p>
            <p>Rahul</p>
        </div>
        <div class="footer">
            <p>Rahul | <a href="mailto:rahul@gmail.com">rahul@gmail.com</a></p>
            <p>Sent on February 25, 2025</p>
        </div>
    </div>
</body>
</html>
`

const htmlEmail7 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Boost Your Coding Skills with CodeSmart</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .banner {
            width: 100%;
            height: auto;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header {
            text-align: center;
            padding: 15px 0;
        }
        .header h1 {
            color: #333;
            font-size: 22px;
        }
        .content {
            text-align: center;
            padding: 20px;
            font-size: 16px;
            color: #555;
        }
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .coupon {
            background-color: #ffeb3b;
            color: #333;
            font-weight: bold;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
            border-top: 1px solid #ddd;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://res.cloudinary.com/dxievocjq/image/upload/v1734286011/HINTS2_qrmhh7.jpg" alt="CodeSmart Banner" class="banner">
        <div class="header">
            <h1>Struggling with Coding Problems?</h1>
        </div>
        <div class="content">
            <p>We know how frustrating it can be to get stuck on coding problems, spending hours searching for the right approach.</p>
            <p><strong>CodeSmart</strong> gives you **instant hints, step-by-step solutions, and expert insights** right where you code.</p>
            <p>🚀 *Solve problems faster* and **learn more efficiently**—without disrupting your flow.</p>
            <p class="coupon">Use Code: <strong>SMART50</strong> for 50% off your first month!</p>
            <a href="https://codesmart.in" class="cta-button">Try CodeSmart Now</a>
        </div>
        <div class="footer">
            <p>Need help? <a href="mailto:support@codesmart.in">Contact us</a></p>
            <p>&copy; 2025 CodeSmart.in | Co-founded by Shashank Dwivedi</p>
        </div>
    </div>
</body>
</html>
`

const htmlEmail10 = `<!DOCTYPE html><html><head>\r\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n  <style type=\"text/css\">\r\n    table td {\r\n      border-collapse: collapse;\r\n    }\r\n    body[dir=rtl] .directional_text_wrapper { direction: rtl; unicode-bidi: embed; }\r\n\r\n  </style>\r\n\r\n          <style type=\"text/css\">\r\n            @media only screen and (max-width: 768px) {\r\n              .simplified-email-footer .namecard {\r\n                display: block;\r\n                min-width: 100%;\r\n                padding: 0 0 16px 0; }\r\n\r\n              .simplified-email-footer .content {\r\n                padding: 16px; }\r\n            }\r\n          </style>\r\n        </head>\r\n<body lang=\"en-us\" style=\"width: 100%!important; margin: 0; padding: 0;\">\r\n  <div style=\"padding: 10px ; line-height: 18px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 12px; color:#444444;\">\r\n    <div style=\"color: #b5b5b5;\">##- Please type your reply above this line -##</div>\r\n    <p dir=\"ltr\">Your request (3553002) has been updated. To add additional comments, reply to this email.<br></p><div style=\"margin-top: 25px\" data-version=\"2\"><table class=\"zd-liquid-comment\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\">  <tbody><tr>    <td width=\"100%\" style=\"padding: 15px 0; border-top: 1px dotted #c5c5c5;\">      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;\" role=\"presentation\">        <tbody><tr>                    <td width=\"100%\" style=\"padding: 0; margin: 0;\" valign=\"top\">            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 15px; line-height: 18px; margin-bottom: 0; margin-top: 0; padding: 0; color:#1b1d1e;\" dir=\"ltr\">                                                <strong>Paola Sanchez</strong> (Outlier)                                          </p>            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 13px; line-height: 25px; margin-bottom: 15px; margin-top: 0; padding: 0; color:#bbbbbb;\" dir=\"ltr\">              Jan 24, 2025, 4:11 PM EST            </p>                                    <div class=\"zd-comment\" dir=\"auto\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">Hello Shashank,<br>&nbsp;<br>Apologies for the delayed response.<br>&nbsp;<br>We received your concern and will route your concern to the proper team for further assistance since it's beyond our scope and the new ticket is 3559102.<br>&nbsp;<br>For that, we will close this ticket since there's no further action needed. We kindly request you to wait for response from the team in your new ticket due to high volume of requests at this time.<br>&nbsp;<br>Thank you for your understanding and patience.<br><div class=\"signature\"><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">Best regards,</p><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">Paola S.<br>\r\nOutlier Support</p></div></div><p dir=\"ltr\">                      </p></td>        </tr>      </tbody></table>    </td>  </tr></tbody></table><p dir=\"ltr\"></p><table class=\"zd-liquid-comment\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\">  <tbody><tr>    <td width=\"100%\" style=\"padding: 15px 0; border-top: 1px dotted #c5c5c5;\">      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;\" role=\"presentation\">        <tbody><tr>                    <td width=\"100%\" style=\"padding: 0; margin: 0;\" valign=\"top\">            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 15px; line-height: 18px; margin-bottom: 0; margin-top: 0; padding: 0; color:#1b1d1e;\" dir=\"ltr\">                                                <strong>Support Team</strong> (Outlier)                                          </p>            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 13px; line-height: 25px; margin-bottom: 15px; margin-top: 0; padding: 0; color:#bbbbbb;\" dir=\"ltr\">              Jan 24, 2025, 12:52 AM EST            </p>                                    <div class=\"zd-comment\" dir=\"auto\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\"><div style=\"background-color: #fff; margin: 0; padding: 16px 0 0;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; font-size: 1em; width: 100%; margin: 0;\"><tbody><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0;\"><div style=\"color: #000; line-height: 1.4;\"><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Hello Shashank,</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Thank you for reaching out.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">We understand that your issue is important, and we’re committed to resolving it as quickly as possible. Your ticket is being routed to the appropriate team, and a Support Agent address your concern shortly. We appreciate your patience during this time.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">In the meantime, you may find helpful information related to your issue in the FAQ below. This resource covers common questions and solutions that might assist you while you wait.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">If you have any additional details you'd like to share or if your situation changes, please feel free to reply to this message. Your satisfaction is our priority, and we’re here to help.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Thank you for your understanding, and we look forward to assisting you soon!</p><h6 style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; font-size: 14px; margin: 0 0 16px;\" dir=\"auto\"><em>(This is an automated message)</em></h6></div></div></td></tr><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0 0 16px;\"> <a href=\"https://app.forethought.ai/redirect/v2?destination=https%3A%2F%2Ftryoutlier.zendesk.com%2Fhc%2Fen-us%2Farticles%2F28684480808091&amp;tracking_token=gbZLZvME8D5OaaCpQ0J59N_nmmiE9fCxYF5rn1ctl8tFfJ5DRCzxY9c3-LHprJp7ilWCyoqQvteg14Jk0RFuKKXfxUofL2sXoJsZ2TEVbdi7zy1TdLYNXBxeMTKY9HPQeJ9ZVbssQV1JDdRe-X7zGeFToZuA55BwoQF7TDONOFf43iXqf7Jfp1_kNesc0t-JXEyY3Cwy9wKYggs5YhFbMJIqMTpqe1G1eQwnc0nCgCjJtc18kpAVYck0F3NAI8115M8oKGSQGH8AQsmVZvssvQ%3D%3D\" rel=\"noopener noreferrer\" style=\"border-radius: 8px; color: #000000; text-decoration: none; display: block; padding: 16px; border: 1px solid #e4e7f0;\"><div><span title=\"Understanding project availability\" style=\"font-size: 16px; font-weight: 600; line-height: 22px;\">Understanding project availability</span></div><div style=\"margin-top: 8px;\"><span style=\"font-size: 14px; font-weight: 400; line-height: 20px; color: #727583;\">**How can I change the project I have enabled?**\r\n\r\n  * Because our system matches automatically based on the skills required, we’re unable to manually match you to projects by request.\r\n  * Read about the most frequent reasons...</span></div><div style=\"margin-top: 8px; text-decoration: none; color: #9194a0; font-size: 12px; font-weight: 400;\">tryoutlier.zendesk.com</div><div style=\"padding-right: 4px; font-size: 14px; line-height: 20px; white-space: nowrap; display: block; width: 100%; box-sizing: border-box; font-weight: 700; color: #000000; margin: 8px 0;\"><span style=\"text-decoration: underline; width: 100%; display: flex; align-items: center; box-sizing: border-box;\"><span style=\"text-decoration: underline; overflow: hidden; text-overflow: ellipsis;\">Read article</span><span style=\"display: inline-block; height: 18px; width: 18px; vertical-align: middle; flex-shrink: 0;\"><img alt=\"\" src=\"https://d3tnn7lar6ozas.cloudfront.net/e7128335-7e7f-47bb-86e5-52759cd29d97.png\" style=\"height: 18px !important; width: 18px !important; max-width: 100%;\"></span></span></div></a> <a href=\"https://app.forethought.ai/redirect/v2?destination=https%3A%2F%2Ftryoutlier.zendesk.com%2Fhc%2Fen-us%2Farticles%2F32262779022619&amp;tracking_token=Xp7yDRQRJ9tr3srvf1WRjShpjojFWJsxa0c9m5-iDSzvKAZyI1DUlpbhZ-kFZv3EgTjAX0sKTUO2jJ106lzya-CPz_LRjOoQ28tLRCfY1UtJEStxODWOm7REwvKYlYhewTTbc0WSmd4J69RdPVQqWfwyNNXcJjP4yYzrCK41_y14jQS-c0_Ipx5r09JgdqwX3BRSDuNn8DUTbGA2w3zMS1Tj_OKxI-z-yxFMp9Thb0feYmPFcnXs6CH3AF6FyFsAtDGj-twX58NpYVsOgz9lWg%3D%3D\" rel=\"noopener noreferrer\" style=\"border-radius: 8px; color: #000000; text-decoration: none; display: block; margin-top: 32px; padding: 16px; border: 1px solid #e4e7f0;\"><div><span title=\"Onboarding FAQ and troubleshooting\" style=\"font-size: 16px; font-weight: 600; line-height: 22px;\">Onboarding FAQ and troubleshooting</span></div><div style=\"margin-top: 8px;\"><span style=\"font-size: 14px; font-weight: 400; line-height: 20px; color: #727583;\">**I tried completing an assessment on my mobile device and didn’t see all the options, so I failed. Can I try again?**\r\n\r\n  * The Outlier site is not optimized for mobile devices, including cell phones and tablets. To ensure th...</span></div><div style=\"margin-top: 8px; text-decoration: none; color: #9194a0; font-size: 12px; font-weight: 400;\">tryoutlier.zendesk.com</div><div style=\"padding-right: 4px; font-size: 14px; line-height: 20px; white-space: nowrap; display: block; width: 100%; box-sizing: border-box; font-weight: 700; color: #000000; margin: 8px 0;\"><span style=\"text-decoration: underline; width: 100%; display: flex; align-items: center; box-sizing: border-box;\"><span style=\"text-decoration: underline; overflow: hidden; text-overflow: ellipsis;\">Read article</span><span style=\"display: inline-block; height: 18px; width: 18px; vertical-align: middle; flex-shrink: 0;\"><img alt=\"\" src=\"https://d3tnn7lar6ozas.cloudfront.net/e7128335-7e7f-47bb-86e5-52759cd29d97.png\" style=\"height: 18px !important; width: 18px !important; max-width: 100%;\"></span></span></div></a> </div></td></tr><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0 0 16px;\"><section style=\"box-sizing: border-box; text-align: center; width: 100%; padding: 4px 0;\"><h2 style=\"font-size: 16px; font-weight: 400; color: #333; text-transform: none; line-height: 26px; margin: 5px 0 8px;\" dir=\"auto\">Was this email helpful?</h2><div><a href=\"https://app.forethought.ai/solve/email/feedback?conversation_id=24e48f94-5979-47c1-a17c-252573feea0b&amp;token=PofPtQyUI8_ljRLjiRuDBDIexd_9fp_rA7_Ttz094VmJ-kRjI07oRb9gO8OuVkPfSCtt8a0watnqm3fdnnHBcBR9G-XIlMJ2uc8JlOe-_basUAkPqXW8Ll2YPevn1VDN94-5qppq7UAMRq7dbQa1mvS-8bT5wDRBqCY9RPbuBaqJLrNMe0L_ISUyjzyM0TJDTpby8nkFQySSiPYDYHj5xHInuWgRHAF7x_xcpkSptdd7c5SvhFiFe72N_wZ99qlnq1UYf0zu3Kun8LOL-Xrgd1zCztnEF_oWbtKRtqwewkI%3D&amp;success=True\" rel=\"noreferrer noopener\" style=\"border-radius: 54px; color: #545767; display: inline-block; font-size: 14px; font-weight: 600; text-decoration: none; min-width: 120px; text-align: center; box-sizing: border-box; margin: 8px 4px; padding: 8px; border: 1px solid #545767;\"><span style=\"line-height: 20px; vertical-align: middle; display: inherit;\"><img src=\"https://d3tnn7lar6ozas.cloudfront.net/b167266d-c052-492c-893b-c0a7718291ba.png\" style=\"width: 20px; height: 20px; transform: translateY(2px); max-width: 100%;\"></span><span style=\"line-height: 20px; vertical-align: middle; display: inherit; margin-left: 2px;\">Yes!</span></a><a href=\"https://app.forethought.ai/solve/email/feedback?conversation_id=24e48f94-5979-47c1-a17c-252573feea0b&amp;token=zRcu3TTt3d6tWzVJYxUwztKA3uFx7zUM_sl-V77egyON6uWG8ErGhD534IdI52h-5TrBTg9HiJ4mAlLFR3YBC0uaoDF-hTB-_yxseUXzOFVpc6dvwyE_4JvZWDdF_zEJLtRk7NIB6PhFlwKiW-wmb30VEpCP15qM8eHVWK1mZlFdSKxD8y78vddllm13DNmuIPYKJqXc6XtkwK0LjCUSESYR_dAjWgQuZz7mZcI-0OOYrRDA3ekSkdl0uj44r0vMTLMDWsGZwcpnml-i2dRaQdrp7xyC6Jq5yA5QM-lkP7o%3D&amp;success=False\" rel=\"noreferrer noopener\" style=\"border-radius: 54px; color: #545767; display: inline-block; font-size: 14px; font-weight: 600; text-decoration: none; min-width: 120px; text-align: center; box-sizing: border-box; margin: 8px 4px; padding: 8px; border: 1px solid #545767;\"><span style=\"line-height: 20px; vertical-align: middle; display: inherit;\"><img src=\"https://d3tnn7lar6ozas.cloudfront.net/949f3939-a1ef-4bda-90cc-18f901820925.png\" style=\"width: 20px; height: 20px; transform: translateY(2px); max-width: 100%;\"></span><span style=\"line-height: 20px; vertical-align: middle; display: inherit; margin-left: 2px;\">Not really</span></a></div></section></div></td></tr></tbody></table></div><div class=\"signature\"><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">Best,<br>\r\nJulie<br>\r\nOutlier Support</p></div></div><p dir=\"ltr\">                      </p></td>        </tr>      </tbody></table>    </td>  </tr></tbody></table><p dir=\"ltr\"></p><table class=\"zd-liquid-comment\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\">  <tbody><tr>    <td width=\"100%\" style=\"padding: 15px 0; border-top: 1px dotted #c5c5c5;\">      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;\" role=\"presentation\">        <tbody><tr>                    <td width=\"100%\" style=\"padding: 0; margin: 0;\" valign=\"top\">            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 15px; line-height: 18px; margin-bottom: 0; margin-top: 0; padding: 0; color:#1b1d1e;\" dir=\"ltr\">                              <strong>Shashank Dwivedi</strong>                          </p>            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 13px; line-height: 25px; margin-bottom: 15px; margin-top: 0; padding: 0; color:#bbbbbb;\" dir=\"ltr\">              Jan 24, 2025, 12:35 AM EST            </p>                                    <div class=\"zd-comment\" dir=\"auto\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\"><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">I've already uploaded my resume and also worked on a few projects now why am I seeing the onboarding again?</p></div>                      </td>        </tr>      </tbody></table>    </td>  </tr></tbody></table></div>\r\n  </div>\r\n  <div style=\"padding: 10px ; line-height: 18px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 12px; color: #aaaaaa;\r\n    margin: 10px 0 14px 0; padding-top: 10px; border-top: 1px solid #eeeeee;\">\r\n    This email is a service from Outlier. Delivered by <a href=\"https://www.zendesk.com/support/?utm_campaign=text&amp;utm_content=Remotasks&amp;utm_medium=poweredbyzendesk&amp;utm_source=email-notification\" style=\"color:black;\" target=\"_blank\">Zendesk</a>\r\n  </div>\r\n<span style=\"color:#FFFFFF\" aria-hidden=\"true\" class=\"zd_encoded_id\">[2DDP6R-3EYWV]</span>\r\n\r\n<div itemscope=\"\" itemtype=\"http://schema.org/EmailMessage\" style=\"display:none\">  <div itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ViewAction\">    <link itemprop=\"url\" href=\"https://tryoutlier.zendesk.com/hc/requests/3553002\">    <meta itemprop=\"name\" content=\"View ticket\">  </div></div></body></html>`

const htmlEmail = `<!DOCTYPE html><html><head>\r\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n  <style type=\"text/css\">\r\n    table td {\r\n      border-collapse: collapse;\r\n    }\r\n    body[dir=rtl] .directional_text_wrapper { direction: rtl; unicode-bidi: embed; }\r\n\r\n  </style>\r\n\r\n          <style type=\"text/css\">\r\n            @media only screen and (max-width: 768px) {\r\n              .simplified-email-footer .namecard {\r\n                display: block;\r\n                min-width: 100%;\r\n                padding: 0 0 16px 0; }\r\n\r\n              .simplified-email-footer .content {\r\n                padding: 16px; }\r\n            }\r\n          </style>\r\n        </head>\r\n<body lang=\"en-us\" style=\"width: 100%!important; margin: 0; padding: 0;\">\r\n  <div style=\"padding: 10px ; line-height: 18px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 12px; color:#444444;\">\r\n    <div style=\"color: #b5b5b5;\">##- Please type your reply above this line -##</div>\r\n    <p dir=\"ltr\">Your request (3553002) has been updated. To add additional comments, reply to this email.<br></p><div style=\"margin-top: 25px\" data-version=\"2\"><table class=\"zd-liquid-comment\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\">  <tbody><tr>    <td width=\"100%\" style=\"padding: 15px 0; border-top: 1px dotted #c5c5c5;\">      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;\" role=\"presentation\">        <tbody><tr>                    <td width=\"100%\" style=\"padding: 0; margin: 0;\" valign=\"top\">            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 15px; line-height: 18px; margin-bottom: 0; margin-top: 0; padding: 0; color:#1b1d1e;\" dir=\"ltr\">                                                <strong>Support Team</strong> (Outlier)                                          </p>            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 13px; line-height: 25px; margin-bottom: 15px; margin-top: 0; padding: 0; color:#bbbbbb;\" dir=\"ltr\">              Jan 24, 2025, 12:52 AM EST            </p>                                    <div class=\"zd-comment\" dir=\"auto\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\"><div style=\"background-color: #fff; margin: 0; padding: 16px 0 0;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse; font-size: 1em; width: 100%; margin: 0;\"><tbody><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0;\"><div style=\"color: #000; line-height: 1.4;\"><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Hello Shashank,</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Thank you for reaching out.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">We understand that your issue is important, and we’re committed to resolving it as quickly as possible. Your ticket is being routed to the appropriate team, and a Support Agent address your concern shortly. We appreciate your patience during this time.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">In the meantime, you may find helpful information related to your issue in the FAQ below. This resource covers common questions and solutions that might assist you while you wait.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">If you have any additional details you'd like to share or if your situation changes, please feel free to reply to this message. Your satisfaction is our priority, and we’re here to help.</p><p style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; margin: 0 0 16px;\" dir=\"ltr\">Thank you for your understanding, and we look forward to assisting you soon!</p><h6 style=\"color: #000; font-weight: 400; line-height: 1.5; text-transform: none; font-size: 14px; margin: 0 0 16px;\" dir=\"auto\"><em>(This is an automated message)</em></h6></div></div></td></tr><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0 0 16px;\"> <a href=\"https://app.forethought.ai/redirect/v2?destination=https%3A%2F%2Ftryoutlier.zendesk.com%2Fhc%2Fen-us%2Farticles%2F28684480808091&amp;tracking_token=gbZLZvME8D5OaaCpQ0J59N_nmmiE9fCxYF5rn1ctl8tFfJ5DRCzxY9c3-LHprJp7ilWCyoqQvteg14Jk0RFuKKXfxUofL2sXoJsZ2TEVbdi7zy1TdLYNXBxeMTKY9HPQeJ9ZVbssQV1JDdRe-X7zGeFToZuA55BwoQF7TDONOFf43iXqf7Jfp1_kNesc0t-JXEyY3Cwy9wKYggs5YhFbMJIqMTpqe1G1eQwnc0nCgCjJtc18kpAVYck0F3NAI8115M8oKGSQGH8AQsmVZvssvQ%3D%3D\" rel=\"noopener noreferrer\" style=\"border-radius: 8px; color: #000000; text-decoration: none; display: block; padding: 16px; border: 1px solid #e4e7f0;\"><div><span title=\"Understanding project availability\" style=\"font-size: 16px; font-weight: 600; line-height: 22px;\">Understanding project availability</span></div><div style=\"margin-top: 8px;\"><span style=\"font-size: 14px; font-weight: 400; line-height: 20px; color: #727583;\">**How can I change the project I have enabled?**\r\n\r\n  * Because our system matches automatically based on the skills required, we’re unable to manually match you to projects by request.\r\n  * Read about the most frequent reasons...</span></div><div style=\"margin-top: 8px; text-decoration: none; color: #9194a0; font-size: 12px; font-weight: 400;\">tryoutlier.zendesk.com</div><div style=\"padding-right: 4px; font-size: 14px; line-height: 20px; white-space: nowrap; display: block; width: 100%; box-sizing: border-box; font-weight: 700; color: #000000; margin: 8px 0;\"><span style=\"text-decoration: underline; width: 100%; display: flex; align-items: center; box-sizing: border-box;\"><span style=\"text-decoration: underline; overflow: hidden; text-overflow: ellipsis;\">Read article</span><span style=\"display: inline-block; height: 18px; width: 18px; vertical-align: middle; flex-shrink: 0;\"><img alt=\"\" src=\"https://d3tnn7lar6ozas.cloudfront.net/e7128335-7e7f-47bb-86e5-52759cd29d97.png\" style=\"height: 18px !important; width: 18px !important; max-width: 100%;\"></span></span></div></a> <a href=\"https://app.forethought.ai/redirect/v2?destination=https%3A%2F%2Ftryoutlier.zendesk.com%2Fhc%2Fen-us%2Farticles%2F32262779022619&amp;tracking_token=Xp7yDRQRJ9tr3srvf1WRjShpjojFWJsxa0c9m5-iDSzvKAZyI1DUlpbhZ-kFZv3EgTjAX0sKTUO2jJ106lzya-CPz_LRjOoQ28tLRCfY1UtJEStxODWOm7REwvKYlYhewTTbc0WSmd4J69RdPVQqWfwyNNXcJjP4yYzrCK41_y14jQS-c0_Ipx5r09JgdqwX3BRSDuNn8DUTbGA2w3zMS1Tj_OKxI-z-yxFMp9Thb0feYmPFcnXs6CH3AF6FyFsAtDGj-twX58NpYVsOgz9lWg%3D%3D\" rel=\"noopener noreferrer\" style=\"border-radius: 8px; color: #000000; text-decoration: none; display: block; margin-top: 32px; padding: 16px; border: 1px solid #e4e7f0;\"><div><span title=\"Onboarding FAQ and troubleshooting\" style=\"font-size: 16px; font-weight: 600; line-height: 22px;\">Onboarding FAQ and troubleshooting</span></div><div style=\"margin-top: 8px;\"><span style=\"font-size: 14px; font-weight: 400; line-height: 20px; color: #727583;\">**I tried completing an assessment on my mobile device and didn’t see all the options, so I failed. Can I try again?**\r\n\r\n  * The Outlier site is not optimized for mobile devices, including cell phones and tablets. To ensure th...</span></div><div style=\"margin-top: 8px; text-decoration: none; color: #9194a0; font-size: 12px; font-weight: 400;\">tryoutlier.zendesk.com</div><div style=\"padding-right: 4px; font-size: 14px; line-height: 20px; white-space: nowrap; display: block; width: 100%; box-sizing: border-box; font-weight: 700; color: #000000; margin: 8px 0;\"><span style=\"text-decoration: underline; width: 100%; display: flex; align-items: center; box-sizing: border-box;\"><span style=\"text-decoration: underline; overflow: hidden; text-overflow: ellipsis;\">Read article</span><span style=\"display: inline-block; height: 18px; width: 18px; vertical-align: middle; flex-shrink: 0;\"><img alt=\"\" src=\"https://d3tnn7lar6ozas.cloudfront.net/e7128335-7e7f-47bb-86e5-52759cd29d97.png\" style=\"height: 18px !important; width: 18px !important; max-width: 100%;\"></span></span></div></a> </div></td></tr><tr><td style=\"vertical-align: top; padding: 0; border: 1px none #ddd;\" valign=\"top\"><div style=\"box-sizing: border-box; max-width: 540px; margin: 0; padding: 0 0 16px;\"><section style=\"box-sizing: border-box; text-align: center; width: 100%; padding: 4px 0;\"><h2 style=\"font-size: 16px; font-weight: 400; color: #333; text-transform: none; line-height: 26px; margin: 5px 0 8px;\" dir=\"auto\">Was this email helpful?</h2><div><a href=\"https://app.forethought.ai/solve/email/feedback?conversation_id=24e48f94-5979-47c1-a17c-252573feea0b&amp;token=PofPtQyUI8_ljRLjiRuDBDIexd_9fp_rA7_Ttz094VmJ-kRjI07oRb9gO8OuVkPfSCtt8a0watnqm3fdnnHBcBR9G-XIlMJ2uc8JlOe-_basUAkPqXW8Ll2YPevn1VDN94-5qppq7UAMRq7dbQa1mvS-8bT5wDRBqCY9RPbuBaqJLrNMe0L_ISUyjzyM0TJDTpby8nkFQySSiPYDYHj5xHInuWgRHAF7x_xcpkSptdd7c5SvhFiFe72N_wZ99qlnq1UYf0zu3Kun8LOL-Xrgd1zCztnEF_oWbtKRtqwewkI%3D&amp;success=True\" rel=\"noreferrer noopener\" style=\"border-radius: 54px; color: #545767; display: inline-block; font-size: 14px; font-weight: 600; text-decoration: none; min-width: 120px; text-align: center; box-sizing: border-box; margin: 8px 4px; padding: 8px; border: 1px solid #545767;\"><span style=\"line-height: 20px; vertical-align: middle; display: inherit;\"><img src=\"https://d3tnn7lar6ozas.cloudfront.net/b167266d-c052-492c-893b-c0a7718291ba.png\" style=\"width: 20px; height: 20px; transform: translateY(2px); max-width: 100%;\"></span><span style=\"line-height: 20px; vertical-align: middle; display: inherit; margin-left: 2px;\">Yes!</span></a><a href=\"https://app.forethought.ai/solve/email/feedback?conversation_id=24e48f94-5979-47c1-a17c-252573feea0b&amp;token=zRcu3TTt3d6tWzVJYxUwztKA3uFx7zUM_sl-V77egyON6uWG8ErGhD534IdI52h-5TrBTg9HiJ4mAlLFR3YBC0uaoDF-hTB-_yxseUXzOFVpc6dvwyE_4JvZWDdF_zEJLtRk7NIB6PhFlwKiW-wmb30VEpCP15qM8eHVWK1mZlFdSKxD8y78vddllm13DNmuIPYKJqXc6XtkwK0LjCUSESYR_dAjWgQuZz7mZcI-0OOYrRDA3ekSkdl0uj44r0vMTLMDWsGZwcpnml-i2dRaQdrp7xyC6Jq5yA5QM-lkP7o%3D&amp;success=False\" rel=\"noreferrer noopener\" style=\"border-radius: 54px; color: #545767; display: inline-block; font-size: 14px; font-weight: 600; text-decoration: none; min-width: 120px; text-align: center; box-sizing: border-box; margin: 8px 4px; padding: 8px; border: 1px solid #545767;\"><span style=\"line-height: 20px; vertical-align: middle; display: inherit;\"><img src=\"https://d3tnn7lar6ozas.cloudfront.net/949f3939-a1ef-4bda-90cc-18f901820925.png\" style=\"width: 20px; height: 20px; transform: translateY(2px); max-width: 100%;\"></span><span style=\"line-height: 20px; vertical-align: middle; display: inherit; margin-left: 2px;\">Not really</span></a></div></section></div></td></tr></tbody></table></div><div class=\"signature\"><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">Best,<br>\r\nJulie<br>\r\nOutlier Support</p></div></div><p dir=\"ltr\">                      </p></td>        </tr>      </tbody></table>    </td>  </tr></tbody></table><p dir=\"ltr\"></p><table class=\"zd-liquid-comment\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" role=\"presentation\">  <tbody><tr>    <td width=\"100%\" style=\"padding: 15px 0; border-top: 1px dotted #c5c5c5;\">      <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"table-layout:fixed;\" role=\"presentation\">        <tbody><tr>                    <td width=\"100%\" style=\"padding: 0; margin: 0;\" valign=\"top\">            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 15px; line-height: 18px; margin-bottom: 0; margin-top: 0; padding: 0; color:#1b1d1e;\" dir=\"ltr\">                              <strong>Shashank Dwivedi</strong>                          </p>            <p style=\"font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif; font-size: 13px; line-height: 25px; margin-bottom: 15px; margin-top: 0; padding: 0; color:#bbbbbb;\" dir=\"ltr\">              Jan 24, 2025, 12:35 AM EST            </p>                                    <div class=\"zd-comment\" dir=\"auto\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\"><p dir=\"ltr\" style=\"color: #2b2e2f; line-height: 22px; margin: 15px 0;\">I've already uploaded my resume and also worked on a few projects now why am I seeing the onboarding again?</p></div>                      </td>        </tr>      </tbody></table>    </td>  </tr></tbody></table></div>\r\n  </div>\r\n  <div style=\"padding: 10px ; line-height: 18px; font-family: 'Lucida Grande',Verdana,Arial,sans-serif; font-size: 12px; color: #aaaaaa;\r\n    margin: 10px 0 14px 0; padding-top: 10px; border-top: 1px solid #eeeeee;\">\r\n    This email is a service from Outlier. Delivered by <a href=\"https://www.zendesk.com/support/?utm_campaign=text&amp;utm_content=Remotasks&amp;utm_medium=poweredbyzendesk&amp;utm_source=email-notification\" style=\"color:black;\" target=\"_blank\">Zendesk</a>\r\n  </div>\r\n<span style=\"color:#FFFFFF\" aria-hidden=\"true\" class=\"zd_encoded_id\">[2DDP6R-3EYWV]</span>\r\n\r\n<div itemscope=\"\" itemtype=\"http://schema.org/EmailMessage\" style=\"display:none\">  <div itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ViewAction\">    <link itemprop=\"url\" href=\"https://tryoutlier.zendesk.com/hc/requests/3553002\">    <meta itemprop=\"name\" content=\"View ticket\">  </div></div></body></html>`
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