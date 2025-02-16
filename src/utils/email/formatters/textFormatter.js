class TextFormatter {
  static escapeMarkdown(text) {
      return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/_/g, '\\_')
          .replace(/\*/g, '\\*')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`')
          .replace(/\\/g, '\\\\');
  }

  static cleanMarkdownSpecialCharacters(text) {
      return text.replace(/\\\\([*_~`])/g, '$1');
  }

  static formatSlackLinksAndEmails(text) {
      text = text.replace(
          /(https?:\/\/[^\s]+)/g,
          '<$1|$1>'
      );
      text = text.replace(
          /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
          '<mailto:$1|$1>'
      );
      return text;
  }

  static prefixedFinalMessage(text) {
      return text
          .split('\n')
          .map((line, i) => i === 0 ? line : `> ${line.replace(/>/g, '').trim()}`)
          .join('\n');
  }

  static removeDoubleChevron(text) {
      return text.replace(/>>/g, '>');
  }
}

module.exports = TextFormatter;