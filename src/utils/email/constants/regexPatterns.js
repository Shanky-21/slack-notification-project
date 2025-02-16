

const EMAIL_PATTERNS = {
  REPLY_HEADERS: {
      STANDARD: /On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+.+?(?:at|,)\s+.*?\s+wrote:/i,
      COMPLEX: /(?:On\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+.+?(?:at|,)\s+.*?\s+wrote:|On\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4},?\s+(?:at)?\s*\d{1,2}:\d{2}(?:\s*[APap][Mm])?,?\s+.*?\s+(?:<.*?>)?\s*wrote:)/i
  },
  HEADERS: {
      SENT: /^From:\s+.*?<.*?>\s+Sent:\s+.*?\s+To:\s+.*?\s+Subject:\s+.*$/i,
      FORWARDED: /(?:--\s*Forwarded message\s*--|Fwd:\s+.*|Fw:\s+.*|Begin forwarded message:)/i,
      FROM: /(>*)From: .*? <.*?>/,
      DASH: /----.*?----/g
  },
  FOOTER: [
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
 ]
};

const isReplyHeader = (line) => {
  return (
      EMAIL_PATTERNS.REPLY_HEADERS.STANDARD.test(line) ||
      EMAIL_PATTERNS.REPLY_HEADERS.COMPLEX.test(line) ||
      EMAIL_PATTERNS.HEADERS.FROM.test(line) ||
      EMAIL_PATTERNS.HEADERS.DASH.test(line) ||
      EMAIL_PATTERNS.HEADERS.SENT.test(line) ||
      EMAIL_PATTERNS.HEADERS.FORWARDED.test(line)
  );
};

module.exports = {
  EMAIL_PATTERNS,
  isReplyHeader
};