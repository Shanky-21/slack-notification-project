module.exports = {
  SLACK: {
      CHANNEL_ID: "C08DE1LEVR8",
      MAX_MESSAGE_LENGTH: 3000,
      DEFAULT_TEXT: "Test message"
  },
  MESSAGE_TYPES: {
      EMAIL_NOTIFICATION: "email_notification"
  },
  VALIDATION: {
      REQUIRED_EMAIL_FIELDS: ['subject', 'from', 'date', 'to']
  }
};