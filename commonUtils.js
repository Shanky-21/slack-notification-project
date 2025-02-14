

// Function to convert markdown-style links to Slack links
function convertMarkdownLinksToSlackLinks(message) {
  return message.replace(/\[([^\]]+)\]\("([^"]+)"\)/g, (match, text, url) => {
      return `<${url}|${text}>`;
  });
}


// Function to convert markdown to Slack format
function convertMarkdownToSlack(text) {
  // Convert links in markdown to Slack format <{url}|{text}>
  const linkRegex = /\*\*?\[([^\]]+?)\**\)*\]\(([^\)]+)\)\*\*?/g;
  text = text.replace(linkRegex, '<$2|$1>');




  // Convert headers and bold text to Slack's *{text}* format
  const headerAndBoldRegex = /(?:\*\*|\*)+([^*#\n]+)(?:\*\*|\*)+/g;
  text = text.replace(headerAndBoldRegex, '*$1*');


  // Convert any headers to Slack format
  const headerRegex = /(?:\*\*|\*)+([^*#\n]+)(?:\*\*|\*)+/g;
  text = text.replace(headerRegex, '*$1*');


  // Convert image links to Slack format with captions
  const imageRegex = /View image: \(([^\)]+)\) Caption: ([^\n]+)/g;
  text = text.replace(imageRegex, 'View image: <$1|$2>');


  // Replace horizontal rules with a line of dashes
  const horizontalRuleRegex = /[-]{3,}/g;
  text = text.replace(horizontalRuleRegex, '———');


  // Preserve spacing by maintaining multiple newlines
  const spacingRegex = /\n{2,}/g;
  text = text.replace(spacingRegex, '\n\n');


  return text;
}